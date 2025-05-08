import {ref,computed} from 'vue'
import {defineStore} from 'pinia'
import * as path from "path";

//组合式API Vue3 Setup 函数
export const usePageStore = defineStore('page',()=>{
    // const x:number = ref(null);
    // const y:number = ref(null);
    // const width:number = ref(1165);
    // const height:number = ref(678);

    const num:number = ref(0);
    const name:string = ref(null);
    const path:object = ref([]);
    const scene:string = ref(null);
    const keyword:string = ref(null);

    const pageSize:string = ref(localStorage.getItem('cm_setting_page_size') || '20');
    const layout:string = ref(localStorage.getItem('cm_setting_layout') || 'three');
    const aside:string = ref(localStorage.getItem('cm_setting_aside') || 'unfold');
    //const maximize:number = ref(localStorage.getItem('maximize') || 0);

    const setPageSize = function (value:number) {
        pageSize.value = value
    }

    const setStatusPath = function (value:string|object,type:string='catalogue'):void {
        scene.value = type;
        switch (type) {
            case 'path':
                path.value = value;
                break
            default:
                name.value = value;
                break
        }
    }


    return {
        // x:x,
        // y:y,
        // width: width,
        // height: height,

        name: name,
        path: path,
        num: num,
        scene: scene,
        keyword: keyword,
        layout: layout,
        aside: aside,
        pageSize: pageSize,
        //maximize: maximize,
        setPageSize: setPageSize,
        setStatusPath: setStatusPath
    }
})





