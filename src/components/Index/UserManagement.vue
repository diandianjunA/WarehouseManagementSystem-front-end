<template>
  <div class="Main">
    <div>
      <el-input v-model:model-value="searchValue" placeholder="请输入查询内容" suffix-icon="Search" style="width: 200px;margin: 5px" @keydown.enter="search"></el-input>
      <el-select v-model="searchSex" class="m-2" placeholder="请选择性别" style="width: 200px;margin: 5px">
        <el-option
            v-for="item in sexes"
            :key="item.value"
            :label="item.label"
            :value="item.value"
        />
      </el-select>
      <el-button @click="search" type="success">查询</el-button>
      <el-button @click="reset" type="primary">重置</el-button>
      <el-button @click="dialogFormVisible = true;check=true" type="primary">新增</el-button>
      <el-dialog v-model="dialogFormVisible" title="新增员工" width="500px" @closed="resetForm">
        <el-form :model="form" style="margin-right: 120px" ref="ruleFormRef" :rules="rules">
          <el-form-item label="员工Id" :label-width="formLabelWidth">
            <el-input v-model="form.id"/>
          </el-form-item>
          <el-form-item label="员工账户" :label-width="formLabelWidth" prop="account">
            <el-input v-model="form.account"/>
          </el-form-item>
          <el-form-item label="员工姓名" :label-width="formLabelWidth" prop="name">
            <el-input v-model="form.name"/>
          </el-form-item>
          <el-form-item label="员工密码" :label-width="formLabelWidth" prop="password">
            <el-input type="password" v-model="form.password"/>
          </el-form-item>
          <el-form-item label="员工年龄" :label-width="formLabelWidth"  prop="age">
            <el-input v-model.number="form.age"/>
          </el-form-item>
          <el-form-item label="员工性别" :label-width="formLabelWidth" prop="sex">
            <el-radio-group v-model="form.sex">
              <el-radio :label="0">男</el-radio>
              <el-radio :label="1">女</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="员工电话号码" :label-width="formLabelWidth"  prop="phone">
            <el-input v-model="form.phone"/>
          </el-form-item>
          <el-form-item v-if="!check" label="员工角色" :label-width="formLabelWidth" prop="roleId">
            <el-radio-group v-model="form.roleId">
              <el-radio :label="0" :disabled="useStore.user.roleId>0">超级管理员</el-radio>
              <el-radio :label="1">管理员</el-radio>
              <el-radio :label="2">普通用户</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item v-if="form.roleId>useStore.user.roleId" label="是否禁用" :label-width="formLabelWidth" prop="valid">
            <el-radio-group v-model="form.valid">
              <el-radio :label="0">不禁用</el-radio>
              <el-radio :label="1">禁用</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取消</el-button>
            <el-button type="primary" @click="submit(ruleFormRef)">
              确认
            </el-button>
          </span>
        </template>
      </el-dialog>
    </div>
    <el-table :data="userData.list" style="width: 100%" border="border">
      <el-table-column fixed prop="id" label="Id"/>
      <el-table-column prop="account" label="账号"/>
      <el-table-column prop="name" label="姓名"/>
      <el-table-column prop="age" label="年龄"/>
      <el-table-column label="角色">
        <template #default="scope">
          <div>
            <el-button :style="roleColorChange(scope.row.roleId)" :type="roleTypeChange(scope.row.roleId)" size="small">{{roleChange(scope.row.roleId)}}</el-button>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="性别">
        <template #default="scope">
          <div>
            <el-button style="background: #409EFF" type="primary" size="small">{{sexChange(scope.row.sex)}}</el-button>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="phone" label="电话"/>
      <el-table-column fixed="right" label="操作">
        <template #default="scope">
          <el-button type="success" size="small" @click="handleEdit(scope.row)">编辑</el-button>
          <el-button type="danger" size="small" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
        background
        :page-size="pageSize"
        layout="prev, pager, next"
        :total="userData.total"
        :pager-count="navSize"
        class="mt-4"
        v-model:current-page="currentPage"
        style="margin-top: 10px;justify-content: center;"
    />
  </div>
</template>

<script>
// eslint-disable-next-line no-unused-vars
import {post,get} from "@/request/request"
import {onMounted, reactive, ref, watch} from "vue";
import {ElMessage, ElMessageBox} from "element-plus";
import {userStore} from "@/store/userStore";
export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: "AdminManagement",
  setup() {
    const userData=ref(0)
    let currentPage=ref(1)
    const pageSize=10
    const navSize=5
    const formLabelWidth='140px'
    const dialogFormVisible=ref(false)
    let searchValue=ref("")
    let searchSex=ref("")
    const ruleFormRef = ref('')
    const check=ref(true)
    const httpUrl='http://localhost:8083'
    const useStore=userStore()
    let checkAccount=(rule, value, callback) => {
      if (!value) {
        return callback(new Error('请输入账户'))
      }
      setTimeout(async () => {
        if(check.value===true){
          const {data} = await get(httpUrl+"/user/findByAccount",{account:value})
          if (data===0) {
            callback(new Error('已存在相同账户'))
          } else {
            callback()
          }
        }else {
          callback()
        }
      }, 1000)
    };
    let checkAge=(rule, value, callback) => {
      if (!value) {
        return callback(new Error('请输入年龄'))
      }
      setTimeout(() => {
        if (!Number.isInteger(value)) {
          callback(new Error('请输入数字'))
        } else {
          if (value > 150) {
            callback(new Error('年龄过大'))
          } else {
            callback()
          }
        }
      }, 1000)
    };
    let checkPhone=(rule, value, callback) => {
      if (!value) {
        return callback(new Error('请输入电话号码'))
      }
      setTimeout(() => {
        if (value.length > 18) {
          callback(new Error('电话号码过长'))
        } else {
          callback()
        }
      }, 1000)
    };
    const rules = reactive({
      name: [{ required: true,message: "请输入姓名", trigger: 'blur' }],
      account: [{validator: checkAccount, trigger: 'blur' }],
      password: [{ required: true,message: "请输入密码", trigger: 'blur' }],
      age: [{validator: checkAge, trigger: 'blur' }],
      phone: [{validator: checkPhone, trigger: 'blur' }],
      sex: [{ required: true,message: "请选择性别", trigger: 'blur' }],
      roleId: [{ required: true,message: "请选择角色", trigger: 'blur' }],
      valid: [{ required: true,message: "请选择是否禁用", trigger: 'blur' }],
    })
    let sexes=[
      {
        value: '0',
        label: '男',
      },
      {
        value: '1',
        label: '女',
      },
      {
        value: null,
        label: "均可"
      }
    ]
    const form = reactive({
      id:'',
      account:'',
      name: '',
      password: '',
      age: '',
      sex: '',
      phone: '',
      roleId: '',
      valid: '',
    })
    const search=async () => {
      const {data} = await post(httpUrl+"/user/listPage", {
        pageSize: pageSize,
        pageNum: currentPage.value,
        navSize: navSize,
        name: searchValue.value,
        sex: searchSex.value,
        roleId: 2
      })
      userData.value = data
      console.log(data.total)
    }
    const reset=()=>{
      searchValue.value=""
      searchSex.value=""
      primarySearch()
    }
    const resetForm=()=>{
      form.sex=''
      form.age=''
      form.valid=''
      form.name=''
      form.password=''
      form.roleId=''
      form.account=''
      form.id=''
      form.phone=''
    }
    const primarySearch=async () => {
      const {data} = await post(httpUrl+"/user/listPage", {
        pageSize: pageSize,
        pageNum: currentPage.value,
        navSize: navSize,
        roleId: 2
      })
      userData.value = data
      console.log(data.total)
    }
    onMounted(async () => {
      await primarySearch()
    })
    watch(currentPage,async (value) => {
      const {data} = await post(httpUrl+"/user/listPage", {
        pageSize: pageSize,
        pageNum: value,
        navSize: navSize,
        roleId: 2
      })
      userData.value = data
      console.log(data.total)
    })
    const handleEdit = (row) => {
      if(useStore.user.roleId<row.roleId){
        check.value=false
        dialogFormVisible.value=true
        console.log(check.value)
        form.sex=row.sex
        form.age=row.age
        form.valid=row.valid
        form.name=row.name
        form.password=row.password
        form.roleId=row.roleId
        form.account=row.account
        form.id=row.id
        form.phone=row.phone
      }else{
        ElMessage({
          message: '权限不够',
          type: 'error',
        })
      }
    }
    const handleDelete = async (row) => {
      if(useStore.user.roleId<row.roleId){
        ElMessageBox.confirm(
            '您确定要删除该用户吗',
            '请确认',
            {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning',
            }
        ).then(async () => {
          const {code} = await get(httpUrl+"/user/delete", {id:row.id})
          if (code === 200) {
            ElMessage({
              message: '删除成功',
              type: 'success',
            })
          } else {
            ElMessage({
              message: '删除失败',
              type: 'error',
            })
          }
          await primarySearch()
        })
            .catch(() => {
              ElMessage({
                type: 'info',
                message: '取消删除',
              })
            })
      }else{
        ElMessage({
          message: '权限不够',
          type: 'error',
        })
      }
    }
    const sexChange=(sex)=>{
      if(sex===0){
        return "男"
      }else {
        return "女"
      }
    }
    const roleChange=(roleId)=>{
      if(roleId===0){
        return "超级管理员"
      }else if(roleId===1){
        return "管理员"
      }else {
        return "普通员工"
      }
    }
    const roleColorChange=(roleId)=>{
      if(roleId===0){
        return "background-color: rgb(245,108,108)"
      }else if(roleId===1){
        return "background-color: rgb(103,194,58)"
      }else {
        return "background-color: rgb(64,158,255)"
      }
    }
    const roleTypeChange=(roleId)=>{
      if(roleId===0){
        return "danger"
      }else if(roleId===1){
        return "success"
      }else {
        return "primary"
      }
    }
    const submit=async (formEl) => {
      if (!formEl) return
      formEl.validate(async (valid) => {
        if (valid) {
          dialogFormVisible.value = false
          if(check.value){
            form.roleId=2
          }
          const {code} = await post(httpUrl+"/user/saveOrMod", form)
          if (code === 200) {
            ElMessage({
              message: '操作成功',
              type: 'success',
            })
            await primarySearch()
          } else {
            ElMessage({
              message: '操作失败',
              type: 'error',
            })
          }
        } else {
          ElMessage({
            message: '操作失败',
            type: 'error',
          })
          return false
        }
      })
    }
    let changeCheck=()=>{
      check.value=true
    };
    return{
      handleEdit,
      handleDelete,
      userData,
      sexChange,
      roleChange,
      roleColorChange,
      roleTypeChange,
      currentPage,
      navSize,
      pageSize,
      searchValue,
      search,
      reset,
      searchSex,
      sexes,
      dialogFormVisible,
      form,
      formLabelWidth,
      submit,
      resetForm,
      ruleFormRef,
      rules,
      check,
      changeCheck,
      useStore
    }
  }
}
</script>

<style scoped>
.Main{
  height: 800px;
  margin: 0;
  padding: 0;
}
</style>
