import {ref,reactive, computed} from 'vue'
import {defineStore} from 'pinia'

//组合式API Vue3 Setup 函数
export const useFileStore = defineStore('file',()=>{

    const id = ref(null);
    const path = ref('');
    const info = reactive({});

    return {
        id: id,
        info: info,
        path: path
    }
})





