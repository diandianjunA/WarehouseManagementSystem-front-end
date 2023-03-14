import {defineStore} from 'pinia'

export const siderbarStore=defineStore("siderbar",{
    state: ()=>{
        return {
            collapse: false
        };
    },
    actions:{
      change(){
          this.collapse=!this.collapse
      }
    }
})
