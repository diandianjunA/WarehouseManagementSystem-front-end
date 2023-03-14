<template>
  <div class="Main">
    <div>
      <el-input v-model:model-value="searchValue" placeholder="请输入查询内容" suffix-icon="Search" style="width: 200px;margin: 5px" @keydown.enter="search"></el-input>
      <el-button @click="search" type="success">查询</el-button>
      <el-button @click="reset" type="primary">重置</el-button>
      <el-button @click="dialogFormVisible = true;check=true" type="primary">新增</el-button>
      <el-dialog v-model="dialogFormVisible" title="新增仓库" width="500px" @closed="resetForm">
        <el-form :model="form" style="margin-right: 120px" ref="ruleFormRef" :rules="rules">
          <el-form-item label="仓库Id" :label-width="formLabelWidth" prop="id">
            <el-input v-model="form.id"/>
          </el-form-item>
          <el-form-item required label="仓库名称" :label-width="formLabelWidth" prop="name">
            <el-input v-model="form.name"/>
          </el-form-item>
          <el-form-item required label="备注" :label-width="formLabelWidth"  prop="remark">
            <el-input v-model="form.remark"/>
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
    <el-table :data="storageData.list" style="width: 100%" border="border">
      <el-table-column fixed prop="id" label="Id"/>
      <el-table-column prop="name" label="名称"/>
      <el-table-column prop="remark" label="备注"/>
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
        :total="storageData.total"
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
  name: "StorageManagement",
  setup() {
    const storageData=ref(0)
    let currentPage=ref(1)
    const pageSize=10
    const navSize=5
    const formLabelWidth='140px'
    const dialogFormVisible=ref(false)
    let searchValue=ref("")
    const ruleFormRef = ref('')
    const check=ref(true)
    const httpUrl='http://localhost:8083'
    const useStore=userStore()
    const form = reactive({
      id:'',
      name: '',
      remark: ''
    })
    const search=async () => {
      const {data} = await post(httpUrl+"/storage/listPage", {
        pageSize: pageSize,
        pageNum: currentPage.value,
        navSize: navSize,
        name: searchValue.value,
      })
      storageData.value = data
      console.log(data.total)
    }
    const reset=()=>{
      searchValue.value=""
      primarySearch()
    }
    const resetForm=()=>{
      form.name=''
      form.id=''
      form.remark=''
    }
    const primarySearch=async () => {
      const {data} = await post(httpUrl+"/storage/listPage", {
        pageSize: pageSize,
        pageNum: currentPage.value,
        navSize: navSize,
      })
      storageData.value = data
      console.log(data.total)
    }
    onMounted(async () => {
      await primarySearch()
    })
    watch(currentPage,async (value) => {
      const {data} = await post(httpUrl+"/storage/listPage", {
        pageSize: pageSize,
        pageNum: value,
        navSize: navSize,
      })
      storageData.value = data
      console.log(data.total)
    })
    const handleEdit = (row) => {
      check.value=false
      dialogFormVisible.value=true
      console.log(check.value)
      form.name=row.name
      form.id=row.id
      form.remark=row.remark
    }
    const handleDelete = async (row) => {
      ElMessageBox.confirm(
          '您确定要删除该仓库吗',
          '请确认',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
          }
      ).then(async () => {
        const {code} = await get(httpUrl+"/storage/delete", {id:row.id})
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
    }
    const submit=async (formEl) => {
      if (!formEl) return
      formEl.validate(async (valid) => {
        if (valid) {
          dialogFormVisible.value = false
          console.log(form.id)
          const {code} = await post(httpUrl+"/storage/saveOrMod", form)
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
      storageData,
      currentPage,
      navSize,
      pageSize,
      searchValue,
      search,
      reset,
      dialogFormVisible,
      form,
      formLabelWidth,
      submit,
      resetForm,
      ruleFormRef,
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
