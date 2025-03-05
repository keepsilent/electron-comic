<template>
    <Toolbar />
    <FileManagement/>

    <div class="file-list-box scrollbar">
<!--        <Empty :icon="empty.icon" :title="empty.title" :subtitle="empty.subtitle"></Empty>-->



        <!-- 分页 -->
        <div class="hide" id="cc-page-wrap"></div>
    </div>
</template>

<script lang="ts" setup>
import {ref, reactive,watch} from 'vue'
import {Base, Config, File} from "@renderer/utils";
import Toolbar from '@renderer/components/Toolbar.vue'
import FileManagement from '@renderer/components/FileManagement.vue'

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
