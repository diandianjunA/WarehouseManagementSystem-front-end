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
    </div>
    <el-table :data="recordData.list" style="width: 100%" border="border">
      <el-table-column fixed prop="id" label="Id"/>
      <el-table-column prop="remark" label="备注"/>
      <el-table-column prop="storageName" label="仓库"/>
      <el-table-column prop="goodsTypeName" label="分类"/>
      <el-table-column prop="count" label="数量"/>
      <el-table-column prop="createTime" label="操作时间"/>
      <el-table-column prop="userName" label="取货人/补货人"/>
      <el-table-column prop="adminName" label="操作人"/>
    </el-table>
    <el-pagination
        background
        :page-size="pageSize"
        layout="prev, pager, next"
        :total="recordData.total"
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
import {userStore} from "@/store/userStore";
export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: "RecordManagement",
  setup() {
    const recordData = ref(0)
    let currentPage = ref(1)
    const pageSize = 10
    const navSize = 5
    const formLabelWidth = '140px'
    const dialogFormVisible = ref(false)
    let searchValue = ref("")
    const ruleFormRef = ref('')
    const check = ref(true)
    const httpUrl = 'http://localhost:8083'
    const useStore = userStore()
    const storageList=ref('')
    const goodsTypeList=ref('')
    const form = reactive({
      id: '',
      remark: '',
      count: '',
      createTime: '',
      storageName: '',
      goodsTypeName: '',
      userName: '',
      adminName: '',
      storageId: '',
      goodsTypeId: ''
    })
    const search = async () => {
      const {data} = await post(httpUrl + "/record/listPage", {
        pageSize: pageSize,
        pageNum: currentPage.value,
        navSize: navSize,
        name: searchValue.value,
        storageId: form.storageId,
        goodsTypeId: form.goodsTypeId
      })
      recordData.value = data
      console.log(data.total)
    }
    const reset = () => {
      searchValue.value = ""
      resetForm()
      primarySearch()
    }
    const resetForm = () => {
      form.id = ''
      form.remark = ''
      form.createTime = ''
      form.goodsTypeName = ''
      form.count = ''
      form.storageName=''
      form.userName=''
      form.adminName=''
      form.storageId=''
      form.goodsTypeId=''
    }
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
    const primarySearch = async () => {
      const {data} = await post(httpUrl + "/record/listPage", {
        pageSize: pageSize,
        pageNum: currentPage.value,
        navSize: navSize,
      })
      recordData.value = data
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
      recordData.value = data
    })
    return {
      recordData,
      currentPage,
      navSize,
      pageSize,
      searchValue,
      search,
      reset,
      dialogFormVisible,
      form,
      formLabelWidth,
      resetForm,
      ruleFormRef,
      check,
      useStore,
      storageList,
      goodsTypeList,
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

