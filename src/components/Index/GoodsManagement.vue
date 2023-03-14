<template>
  <div class="Main">
    <div>
      <el-input v-model:model-value="searchValue" placeholder="请输入查询内容" suffix-icon="Search" style="width: 200px;margin: 5px" @keydown.enter="search"></el-input>
      <el-select v-model="form.storageId" class="m-2" placeholder="请选择仓库" style="width: 200px;margin: 5px">
        <el-option
            v-for="(item,index) in storageList"
            :key="index"
            :label="item.name"
            :value="item.id"
        />
      </el-select>
      <el-select v-model="form.goodsTypeId" class="m-2" placeholder="请选择分类" style="width: 200px;margin: 5px">
        <el-option
            v-for="(item,index) in goodsTypeList"
            :key="index"
            :label="item.name"
            :value="item.id"
        />
      </el-select>
      <el-button @click="search" type="success">查询</el-button>
      <el-button @click="reset" type="primary">重置</el-button>
      <el-button @click="dialogFormVisible = true;check=true" type="primary">新增</el-button>
      <el-button @click="inGoods" type="primary">入库</el-button>
      <el-button @click="outGoods" type="primary">出库</el-button>
      <el-dialog v-model="dialogFormVisible" title="新增物品" width="500px" @closed="resetForm">
        <el-form :model="form" style="margin-right: 120px" ref="ruleFormRef" :rules="rules">
          <el-form-item label="物品Id" :label-width="formLabelWidth" prop="id">
            <el-input v-model="form.id"/>
          </el-form-item>
          <el-form-item label="物品名称" :label-width="formLabelWidth" prop="name">
            <el-input v-model="form.name"/>
          </el-form-item>
          <el-form-item label="仓库" :label-width="formLabelWidth" prop="storageId">
            <el-select v-model="form.storageId" class="m-2" placeholder="请选择仓库" style="width: 200px;margin: 5px">
              <el-option
                  v-for="(item,index) in storageList"
                  :key="index"
                  :label="item.name"
                  :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="分类" :label-width="formLabelWidth" prop="goodsTypeId">
            <el-select v-model="form.goodsTypeId" class="m-2" placeholder="请选择分类" style="width: 200px;margin: 5px">
              <el-option
                  v-for="(item,index) in goodsTypeList"
                  :key="index"
                  :label="item.name"
                  :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item required label="数量" :label-width="formLabelWidth" prop="count">
            <el-input v-model="form.count"/>
          </el-form-item>
          <el-form-item label="备注" :label-width="formLabelWidth"  prop="remark">
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
      <el-dialog v-model="inGoodsFormVisible" :title="'物品'+goodsFormTitle" width="500px" @closed="resetInGoodsForm">
        <el-form :model="inGoodsForm" style="margin-right: 120px" ref="inGoodsRuleFormRef" :rules="inGoodsRules">
          <el-form-item label="物品Id" :label-width="formLabelWidth" prop="id">
            <el-input v-model="inGoodsForm.id"/>
          </el-form-item>
          <el-form-item label="物品名称" :label-width="formLabelWidth" prop="name">
            <el-input v-model="inGoodsForm.name"/>
          </el-form-item>
          <el-form-item label="取货/补货人" :label-width="formLabelWidth" prop="userName">
            <el-input v-model="inGoodsForm.userName" @click="innerVisible = true"/>
            <el-dialog v-model="innerVisible" title="选择人员" append-to-body>
              <template #default>
                <select-user></select-user>
              </template>
              <template #footer>
                <div class="dialog-footer">
                  <el-button @click="innerVisible = false">Cancel</el-button>
                  <el-button type="primary" @click="selectUserSubmit">
                    提交
                  </el-button>
                </div>
              </template>
            </el-dialog>
          </el-form-item>
          <el-form-item label="数量" :label-width="formLabelWidth" prop="count">
            <el-input v-model="inGoodsForm.count"/>
          </el-form-item>
          <el-form-item label="备注" :label-width="formLabelWidth"  prop="remark">
            <el-input v-model="inGoodsForm.remark"/>
          </el-form-item>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="inGoodsFormVisible = false">取消</el-button>
            <el-button type="primary" @click="inGoodsSubmit(inGoodsRuleFormRef)">
              确认
            </el-button>
          </span>
        </template>
      </el-dialog>
    </div>
    <el-table :data="goodsData.list" style="width: 100%" border="border" highlight-current-row @current-change="handleCurrentChange">
      <el-table-column fixed prop="id" label="Id"/>
      <el-table-column prop="name" label="名称"/>
      <el-table-column prop="storageId" label="仓库Id"/>
      <el-table-column prop="goodsTypeId" label="分类Id"/>
      <el-table-column prop="count" label="数量"/>
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
        :total="goodsData.total"
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
import SelectUser from "@/components/Index/SelectUser";
import {selectUserStore} from "@/store/selectUserStore";
export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: "GoodsManagement",
  components: {SelectUser},
  setup() {
    const goodsData = ref(0)
    let currentPage = ref(1)
    const pageSize = 10
    const navSize = 5
    const formLabelWidth = '140px'
    const dialogFormVisible = ref(false)
    let searchValue = ref("")
    const ruleFormRef = ref('')
    const inGoodsRuleFormRef=ref('')
    const check = ref(true)
    const httpUrl = 'http://localhost:8083'
    const useStore = userStore()
    const storageList=ref('')
    const goodsTypeList=ref('')
    let currentRow = ref()
    const goodsFormTitle=ref('')
    const innerVisible=ref(false)
    const handleCurrentChange = (val) => {
      currentRow.value = val
    }
    const form = reactive({
      id: '',
      name: '',
      remark: '',
      storageId: '',
      goodsTypeId: '',
      count: '',
    })
    const getData=async () => {
      {
        const {data} = await get(httpUrl + "/storage/list")
        storageList.value = data
      }
      {
        const {data} = await get(httpUrl + "/goodsType/list")
        goodsTypeList.value = data
      }
    }
    const search = async () => {
      const {data} = await post(httpUrl + "/goods/listPage", {
        pageSize: pageSize,
        pageNum: currentPage.value,
        navSize: navSize,
        name: searchValue.value,
        storageId: form.storageId,
        goodsTypeId: form.goodsTypeId
      })
      goodsData.value = data
      console.log(data.total)
    }
    const reset = () => {
      searchValue.value = ""
      resetForm()
      currentRow.value=null
      primarySearch()
    }
    const resetForm = () => {
      form.name = ''
      form.id = ''
      form.remark = ''
      form.storageId = ''
      form.goodsTypeId = ''
      form.count = ''
    }
    const primarySearch = async () => {
      const {data} = await post(httpUrl + "/goods/listPage", {
        pageSize: pageSize,
        pageNum: currentPage.value,
        navSize: navSize,
      })
      goodsData.value = data
    }
    onMounted(async () => {
      await primarySearch()
      await getData();
    })
    watch(currentPage, async (value) => {
      const {data} = await post(httpUrl + "/goods/listPage", {
        pageSize: pageSize,
        pageNum: value,
        navSize: navSize,
      })
      goodsData.value = data
      console.log(data.total)
    })
    const handleEdit = (row) => {
      check.value = false
      dialogFormVisible.value = true
      console.log(check.value)
      form.name = row.name
      form.id = row.id
      form.remark = row.remark
      form.storageId = row.storageId
      form.goodsTypeId = row.goodsTypeId
      form.count = row.count
    }
    const handleDelete = async (row) => {
      ElMessageBox.confirm(
          '您确定要删除该分类吗',
          '请确认',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
          }
      ).then(async () => {
        const {code} = await get(httpUrl + "/goods/delete", {id: row.id})
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
    const submit = async (formEl) => {
      if (!formEl) return
      formEl.validate(async (valid) => {
        if (valid) {
          dialogFormVisible.value = false
          const {code} = await post(httpUrl + "/goods/saveOrMod", form)
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
    let changeCheck = () => {
      check.value = true
    };
    let checkCount = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请输入数量'))
      }
      setTimeout(async () => {
        if (value < 0) {
          callback(new Error('数量不能小于0'))
        } else {
          callback()
        }
      }, 1000)
    };
    const rules = reactive({
      name: [{required: true, message: "请输入姓名", trigger: 'blur'}],
      storageId: [{required: true, message: "请选择仓库", trigger: 'blur'}],
      goodsTypeId: [{required: true, message: "请选择分类", trigger: 'blur'}],
      count: [{validator: checkCount, trigger: 'blur'}],
    })
    let inGoods=()=>{
      if(!currentRow.value){
        ElMessage({
          message: '请至少选择一样物品',
          type: 'error',
        })
        return
      }
      goodsFormTitle.value="入库"
      inGoodsFormVisible.value=true
      inGoodsForm.id=currentRow.value.id
      inGoodsForm.name=currentRow.value.name
    };
    let outGoods=()=>{
      if(!currentRow.value){
        ElMessage({
          message: '请至少选择一样物品',
          type: 'error',
        })
        return
      }
      goodsFormTitle.value="出库"
      inGoodsFormVisible.value=true
      inGoodsForm.id=currentRow.value.id
      inGoodsForm.name=currentRow.value.name
    }
    const inGoodsForm=reactive({
      id: '',
      name: '',
      count: '',
      userName: '',
      admin: useStore.user.id,
      remark: '',
    })
    const resetInGoodsForm = () => {
      inGoodsForm.name = ''
      inGoodsForm.id = ''
      inGoodsForm.remark = ''
      inGoodsForm.userName = ''
      inGoodsForm.count = ''
    }
    let checkCountForOutGoods = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请输入数量'))
      }
      setTimeout(async () => {
        if (value < 0) {
          callback(new Error('数量不能小于0'))
        } else {
          if(goodsFormTitle.value==="出库"&&value>currentRow.value.count){
            callback(new Error('数量不够'))
          }else{
            callback()
          }
        }
      }, 1000)
    };
    const inGoodsRules = reactive({
      userName: [{required: true,message: "请输入取货/补货人", trigger: 'blur'}],
      count: [{validator: checkCountForOutGoods, trigger: 'blur'}],
    })
    const inGoodsFormVisible=ref(false);
    let inGoodsSubmit=async (formEl) => {
      if (!formEl) return
      formEl.validate(async (valid) => {
        if (valid) {
          inGoodsFormVisible.value = false
          if(goodsFormTitle.value==="出库"){
            inGoodsForm.count=-inGoodsForm.count
          }
          const {data} = await get(httpUrl+"/user/getIdByName",{userName: inGoodsForm.userName})
          {
            const {code}=await post(httpUrl + "/record/save", {
              goodsId: inGoodsForm.id,
              userId: data,
              adminId: inGoodsForm.admin,
              count: inGoodsForm.count,
              remark: inGoodsForm.remark
            })
            if (code !== 200) {
              ElMessage({
                message: '申请失败',
                type: 'error',
              })
              return
            }
          }
          const {code} = await get(httpUrl + "/goods/addCount", {
            id: inGoodsForm.id,
            count: inGoodsForm.count
          })
          if (code === 200) {
            ElMessage({
              message: '申请成功',
              type: 'success',
            })
            await primarySearch()
          } else {
            ElMessage({
              message: '申请失败',
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
    };
    let selectUserSubmit=()=>{
      innerVisible.value = false
      inGoodsForm.userName=selectUserStore().user.name
    };
    return {
      handleEdit,
      handleDelete,
      goodsData,
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
      useStore,
      rules,
      storageList,
      goodsTypeList,
      handleCurrentChange,
      inGoods,
      inGoodsFormVisible,
      inGoodsForm,
      inGoodsRuleFormRef,
      inGoodsSubmit,
      resetInGoodsForm,
      inGoodsRules,
      outGoods,
      goodsFormTitle,
      currentRow,
      innerVisible,
      selectUserSubmit
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

