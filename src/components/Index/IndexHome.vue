<template>
  <div class="layout">
    <el-container ref="box">
      <div class="aside" :class="{'asideCollapse':sidebarStore.collapse}" :style="style">
        <Aside></Aside>
      </div>
      <el-container>
        <el-header style="padding: 0">
          <Header></Header>
        </el-header>
        <el-main style="padding: 0">
          <router-view/>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>
<script>
import Aside from "@/components/Index/Aside";
import Header from "@/components/Index/Header";
import {siderbarStore} from "@/store/siderbarStore";
import {onMounted, reactive, ref} from "vue";

export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: "IndexHome",
  components: {Header, Aside},
  // eslint-disable-next-line no-unused-vars
  setup(props,context){
    let sidebarStore=siderbarStore()
    let box = ref(null);
    let style=reactive({})
    onMounted(async () => {
      console.log(box.value)
      style = {
        height: box.value
      }
    });
    return{
      sidebarStore,
      style
    }
  }
}
</script>

<style scoped>
.layout{
  height: 100%;
  margin: 0;
  padding: 0;
}
.aside{
  width: 200px;
  -webkit-transition: all .3s ease-in-out;
  transition: all .3s ease-in-out;
}
.asideCollapse{
  width: 65px;
}
</style>
