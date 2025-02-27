import { defineStore } from 'pinia'
import { ref, reactive } from "vue";

export const useUserStore = defineStore('user',()=>{
    const user = reactive({})
    const increment = function () {
        user.value++;
    }

    return {
        user: user,
        increment: increment
    }
})

