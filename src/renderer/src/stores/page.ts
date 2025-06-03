import {ref,reactive, computed} from 'vue'
import {defineStore} from 'pinia'
import * as path from "path";

//组合式API Vue3 Setup 函数
export const usePageStore = defineStore('page',() => {

    const page = reactive({
        back: 0,
        layout: localStorage.getItem('cm_setting_layout') ?? 'three',
        aside: localStorage.getItem('cm_setting_aside') ?? 'unfold'
    })

    const order = reactive({
        file: { //Cache file list order info
            mode: localStorage.getItem('cm_setting_order_file_mode') ?? 'name',
            sort: localStorage.getItem('cm_setting_order_file_sort') ?? 'asc'
        }
    })

    const pop = reactive({
        setting: false, //Control pop setting window show status
        upload: false, //Control pop upload window show status
    })

    const toolbar = reactive({
        submenu: {
            order: false,
            view: false
        },
        more: false, //Control toolbar pop more window show status
        view: localStorage.getItem('cm_setting_view') ?? 'large' //Cache view model method
    })

    const pageSize = ref(localStorage.getItem('cm_setting_page_size') ?? '20');

    return {
        pop: pop,
        page: page,
        toolbar: toolbar,
        order: order,

        pageSize: pageSize
    }
})





