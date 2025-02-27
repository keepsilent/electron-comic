<template>
    <div class="file-list-box scrollbar" :style="{height: page.height+'px'}">
<!--        <Empty :icon="empty.icon" :title="empty.title" :subtitle="empty.subtitle"></Empty>-->

<!--        <ul>-->
<!--            <li v-for="(item,index) in 100"  onmousedown="" data-id="{{item.file_id}}" title="名称：&#10;大小：&#10;修改时间：">-->
<!--                <div class="font-0"><img src="./dist/images/default_cover.png" data-load="0" data-src="" data-width=""  data-height="" width="150" height="195"></div>-->
<!--                <p>文件名</p>-->
<!--            </li>-->
<!--        </ul>-->

        <img :src="src"/>
        <ul>
            <span @click="test">点我</span>
            <template v-for="(image,index) in images">
                <img
                    :src="image" class="image"
                >
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
// import fs from 'fs'
// import path from 'path'
const fs = require("fs") as typeof import("fs");
const path = require("path") as typeof import("path");

const test = () => {
    console.log('x');
    const path = File.getStorePath();
    File.mkdir(path)
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

pageStore.setStatusPath('漫画');
//pageStore.setStatusPath(['C:','Users','keepsilent','Downloads'],'path');
watch(() => pageStore.height,(value)=>{
    page.height = Config.getMainHeight(value);
})
</script>

<style scoped>

</style>
