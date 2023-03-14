<template>
  <div class="Aside">
    <el-menu
        default-active="2"
        class="el-menu-vertical-demo"
        :collapse="sidebarStore.collapse"
        style="border: none"
    >
      <el-menu-item index="1" @click="goToMain">
        <el-icon><House /></el-icon>
        <template #title>首页</template>
      </el-menu-item>
      <el-menu-item index="2" @click="goToHome">
        <el-icon><UserFilled /></el-icon>
        <template #title>个人中心</template>
      </el-menu-item>
      <el-menu-item v-if="useStore.user.roleId===0" index="3" @click="goToAdmin">
        <el-icon><document /></el-icon>
        <template #title>管理员管理</template>
      </el-menu-item>
      <el-menu-item index="4" @click="goToUser">
        <el-icon><SuitcaseLine /></el-icon>
        <template #title>用户管理</template>
      </el-menu-item>
      <el-menu-item index="5" @click="goToStorage">
        <el-icon><Monitor /></el-icon>
        <template #title>仓库管理</template>
      </el-menu-item>
      <el-menu-item index="6" @click="goToGoodsType">
        <el-icon><Menu /></el-icon>
        <template #title>物品分类管理</template>
      </el-menu-item>
      <el-menu-item index="7" @click="goToGoods">
        <el-icon><GoodsFilled /></el-icon>
        <template #title>物品管理</template>
      </el-menu-item>
      <el-menu-item index="8" @click="goToRecord">
        <el-icon><GoodsFilled /></el-icon>
        <template #title>记录管理</template>
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script>
import {
  Document,
} from '@element-plus/icons-vue'
import {siderbarStore} from "@/store/siderbarStore";
import router from "@/router/router";
import {userStore} from "@/store/userStore";
export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: "Aside",
  components:{
    Document,
  },
  // eslint-disable-next-line no-unused-vars
  setup(props,context){
    let sidebarStore=siderbarStore()
    let useStore=userStore()
    const goToMain=async () => {
      await router.push({path: "/indexHome/main"})
    }
    const goToHome=async () => {
      await router.push({path: "/indexHome/home"})
    }
    let goToAdmin=async () => {
      await router.push({path: "/indexHome/admin"})
    };
    let goToUser=async () => {
      await router.push({path: "/indexHome/user"})
    };
    let goToStorage=async () => {
      await router.push({path: "/indexHome/storage"})
    };
    let goToGoodsType=async () => {
      await router.push({path: "/indexHome/goodsType"})
    };
    let goToGoods=async () => {
      await router.push({path: "/indexHome/goods"})
    };
    let goToRecord=async () => {
      await router.push({path: "/indexHome/record"})
    };
    return{
      sidebarStore,
      goToMain,
      goToHome,
      goToAdmin,
      goToUser,
      useStore,
      goToStorage,
      goToGoodsType,
      goToGoods,
      goToRecord
    }
  }
}
</script>

<style scoped>
  .Aside{
    height: 100%;
    margin: 0;
    padding: 0;
  }
  .AsideCollapse{
    width: 50px;
  }
</style>
