import {defineStore} from 'pinia'
import {reactive} from "vue";

export const selectUserStore=defineStore("selectUserStore",{
    state: ()=>{
        return {
            user: reactive({})
        };
    },
    actions:{
        construct(user){
            this.user=user
        }
    },
    persist: {
        enabled: true, // 开启数据缓存
    }
})
