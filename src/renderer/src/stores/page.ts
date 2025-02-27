import {ref,computed} from 'vue'
import {defineStore} from 'pinia'
import * as path from "path";

//组合式API Vue3 Setup 函数
export const usePageStore = defineStore('page',()=>{
    const x:number = ref(null);
    const y:number = ref(null);
    const width:number = ref(1165);
    const height:number = ref(678);

    const num:number = ref(0);
    const name:string = ref(null);
    const path:object = ref([]);
    const scene:string = ref(null);


    const setStatusPath = function (value:string|object,type:string='catalogue'):void {
        scene.value = type;
        console.log('type',type);
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
        x:x,
        y:y,
        width: width,
        height: height,

        name: name,
        path: path,
        num: num,
        scene: scene,
        setStatusPath: setStatusPath
    }
})





