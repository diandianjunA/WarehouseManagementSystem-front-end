<template>
  <div class="home">
    <div></div>
    <h2 style="text-align: center;margin-top: 20px">欢迎你，{{useStore.user.name}}，来到仓库后台管理系统</h2>
    <h3 style="text-align: center;margin-top: 20px">现在是：{{ nowTime }}</h3>
    <el-descriptions
        :column="2"
        size="large"
        border
        style="margin: 20px auto;width: 90%"
        title="个人中心"
    >
      <el-descriptions-item  label-align="center" align="center">
        <template #label>
          <div class="cell-item">
            <el-icon>
              <user />
            </el-icon>
            id
          </div>
        </template>
        {{useStore.user.id}}
      </el-descriptions-item>
      <el-descriptions-item  label-align="center" align="center">
        <template #label>
          <div class="cell-item">
            <el-icon>
              <user />
            </el-icon>
            账号
          </div>
        </template>
        {{useStore.user.account}}
      </el-descriptions-item>
      <el-descriptions-item  label-align="center" align="center">
        <template #label>
          <div class="cell-item">
            <el-icon>
              <user />
            </el-icon>
            姓名
          </div>
        </template>
        {{useStore.user.name}}
      </el-descriptions-item>
      <el-descriptions-item  label-align="center" align="center">
        <template #label>
          <div class="cell-item">
            <el-icon>
              <iphone />
            </el-icon>
            电话号码
          </div>
        </template>
        {{ useStore.user.phone }}
      </el-descriptions-item>
      <el-descriptions-item  label-align="center" align="center">
        <template #label>
          <div class="cell-item">
            <el-icon><CoffeeCup /></el-icon>
            年龄
          </div>
        </template>
        {{ useStore.user.age }}
      </el-descriptions-item>
      <el-descriptions-item  label-align="center" align="center">
        <template #label>
          <div class="cell-item">
            <el-icon>
              <tickets />
            </el-icon>
            性别
          </div>
        </template>
        <el-tag v-if="useStore.user.sex===0" size="large" type="success">男</el-tag>
        <el-tag v-else size="large" type="danger">女</el-tag>
      </el-descriptions-item>
      <el-descriptions-item  label-align="center" align="center">
        <template #label>
          <div class="cell-item">
            <el-icon><Service /></el-icon>
           角色
          </div>
        </template>
        <el-tag v-if="useStore.user.roleId===0" size="large" type="danger">超级管理员</el-tag>
        <el-tag v-else size="large" type="success">管理员</el-tag>
      </el-descriptions-item>
    </el-descriptions>
  </div>
</template>

<script>
import {userStore} from "@/store/userStore";
import {onMounted, ref} from "vue";
export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: "Home",
  setup(){
    const useStore=userStore()
    const complement = function (value) {
      return value < 10 ? `0${value}` : value;
    };
    const formateDate = (date) => {
      const time = new Date(date);
      const year = time.getFullYear();
      const month = complement(time.getMonth() + 1);
      const day = complement(time.getDate());
      const hour = complement(time.getHours());
      const minute = complement(time.getMinutes());
      const second = complement(time.getSeconds());
      const week = '星期' + '日一二三四五六'.charAt(time.getDay());
      return `${year}年${month}月${day}日 ${week} ${hour}:${minute}:${second}`;
    }
    const nowTime = ref("")
    onMounted(() => {
      setInterval(() => {
        nowTime.value = formateDate(new Date())
      })
    });
    return{
      useStore,
      nowTime
    }
  }
}
</script>

<style scoped>
  .home{
    width: 100%;
    height: 855px;
    background-color: lightcyan;
    overflow: hidden;
  }
</style>
