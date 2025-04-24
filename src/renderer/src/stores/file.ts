import {ref,reactive, computed} from 'vue'
import {defineStore} from 'pinia'

//组合式API Vue3 Setup 函数
export const useFileStore = defineStore('file',()=>{

    const id:number = ref(null);
    const info:object = reactive({});

    return {
        id: id,
        info: info
    }
})





