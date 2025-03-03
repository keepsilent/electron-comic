<template>
    <Toolbar></Toolbar>

    <div class="file-list-box scrollbar" >
<!--        <Empty :icon="empty.icon" :title="empty.title" :subtitle="empty.subtitle"></Empty>-->

        <ul>
            <template v-for="(image,index) in images">
                <img :src="image" class="image">
            </template>
            <li class="upload-file-box">
                <div class="upload-file">
                    <i class="iconfont icon-add"></i>
                    <input type="file" class="cc-upload-btn" title="上传文件" accept=".zip,.txt,.pdf" @change="onUpload">
                </div>
                <p>上传文件</p>
            </li>
        </ul>

        <!-- 分页 -->
        <div class="hide" id="cc-page-wrap"></div>
    </div>
</template>

<script lang="ts" setup>
import {ref, reactive,watch} from 'vue'
import {Base, Config, File} from "@renderer/utils";
import Toolbar from './components/toolbar.vue'

import {init} from "@renderer/sql/db.ts";
import {addTest} from "@renderer/sql/sql-api.ts";
// import fs from 'fs'
// import path from 'path'
const fs = require("fs") as typeof import("fs");
const path = require("path") as typeof import("path");


console.log('mport.meta.env.VITE_CURRENT_RUN_MODE')
const test = () => {
    // let db = conDb();
    // console.log('db',db);
    //init();
    addTest();





    // console.log('x');
    // const path = File.getStorePath();
    // File.mkdir(path)
    //mkdirs('C:/Users/keepsilent/Desktop/test/4')
}

// import {Archive} from '@renderer/utils/libarchive.js/main.js';
// Archive.init({
//     workerUrl: '@renderer/utils/libarchive.js/dist/worker-bundle.js'
// });

const src = ref('')
const images = ref({})
import {Archive} from 'libarchive.js/main.js';
Archive.init({
    workerUrl: '/src/utils/libarchive.js/dist/worker-bundle.js'
});
const onUpload = async function (event) {
    if (event.length == 0) {
        // tipsBox.alert('请选择上传的文件');
        // $(options.uploadBtn).val('');
        return false;
    }

    const [file] = event.target.files
    console.log('file',file);

    File.mkdir(File.getStorePath())
    const archive = await Archive.open(file);
    let obj = await archive.extractFiles();
    console.log('obj',obj);

    const reader = new FileReader()
    reader.onload = (loadEvent) =>{
        let str = loadEvent.target.result;
        console.log('typeof',typeof  loadEvent.target.result);
        src.value = (str).replace('data:application/octet-stream;base64,','data:image/png;base64,')
        console.log('loadEvent.target.resul',loadEvent.target.result);
    }

    console.log('obj[0]',obj.test);
    reader.readAsDataURL(new Blob([obj.test['00025AE0.png']]))


    // tipsBox.loading(1);
    // options.files = {
    //     list: files,
    //     index: 0,
    //     total: files.length
    // }
    //
    // //createRootFolder();
    // mkdirs(getFilePath());
    // singleFileUpload(options.files.list[0]);
}



import {Base, Config} from "@renderer/utils";
import {usePageStore} from '@renderer/stores/page'
import Empty from '@renderer/components/Empty.vue'
import file from "../../utils/file";

interface Empty {
    icon: string,
    title: string,
    subtitle?: string
}

const pageStore = usePageStore();
const page = reactive({height: Config.getMainHeight(pageStore.height)});
const empty:Empty = reactive({icon: 'icon-file-fill',title: '漫画库为空',subtitle:'您的漫画库空荡荡～'})

pageStore.setStatusPath('Comic');
//pageStore.setStatusPath(['C:','Users','keepsilent','Downloads'],'path');
watch(() => pageStore.height,(value)=>{
    page.height = Config.getMainHeight(value);
})
</script>

<style scoped>

</style>
