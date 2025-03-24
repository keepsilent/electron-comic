<template>
    <Toolbar />
    <div class="detail-wrap scrollbar">
        <div class="detail-inner">
            <div class="detail-header">
                <img class="cover" :src="file.data.cover" :alt="file.data.name" width="183" height="243">
                <div class="info">
                    <h3 class="title">{{file.data.name}}</h3>
                    <p>作者：{{file.data.author || '未知'}}</p>
                    <p>文件数量：{{file.data.total}}页</p>
                    <p>文件大小：{{file.data.size}}</p>
                    <p>收录时间：{{file.data.date}}</p>
                    <div class="tags">
                        <span>#热血</span><span>#科幻</span><span>#机甲</span>
                    </div>
                </div>
            </div>
            <div class="detail-main">

            </div>
        </div>
    </div>


</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import {ref, reactive, watch, onMounted} from 'vue'
import type {PageInter, ConfirmInter} from "@renderer/utils/types";
import {Base, Config,File,Time} from "@renderer/utils";

import {getFileInfo} from "@renderer/api/file";
import {Archive} from 'libarchive.js/main.js';

import Toolbar from "./components/toolbar.vue";

const { t } = useI18n();
const fs = require("fs") as typeof import("fs");
const page:PageInter = reactive({init: false, loading: false, actions: {}});
const confirm:ConfirmInter = reactive({show: false, title: '需要密码重置',content: '',callback:'', showCancel: false, cancelText: '取消', confirmText: '确定'});
const file = reactive({data: {}});


onMounted(()=>{
    loadArchive();
    loadDetail();
})

const loadArchive = function () {
    const options = {
        workerUrl: '/src/utils/libarchive.js/dist/worker-bundle.js'
    }

    Archive.init(options);
}

const loadDetail = async function () {
    try {
        const params = {id: 36}
        const res = await getFileInfo(params);
        if(res.code != 200) {
            return false;
        }

        console.log('res',res);
        [file.data] = res.data;
        file.data.name = File.getRenderFileName(file.data.name);
        //file.data.cover = File.getFileCoverById(file.data.id);
        file.data.size = File.formatFileSize(file.data.size);
        file.data.date = Time.formatDate(file.data.date,'YYYY/MM/DD');

        console.log('file.data',file.data);

        loadZIP(file.data);
    } catch (err) {
        Base.printErrorLog('getFileInfo',err)
    }
}


const loadZIP = async function (file:File):void {
    try {
        const fileBuffer = fs.readFileSync(file.path);
        const blob = new Blob([fileBuffer], {type: file.type});

        const archive = await Archive.open(blob);
        const extract = await archive.extractFiles();

        const list = File.getExtractImageList(extract);
        console.log('list',list);
        loadCover(extract);
    } catch (err) {
        Base.printErrorLog('archive',err)
    }
}

const loadCover = async function (extract:File):void {
    //file.data.cover = await File.getExtractFileCover(extract);
    try {
        const reader = new FileReader()
        const fileBuffer = fs.readFileSync('D:\\Work\\electron-comic\\src\\renderer\\data\\images\\cover\\35.png');
        const blob = new Blob([fileBuffer], {type: 'image/png'});
        //const blob = new Blob([fileBuffer]);

        console.log('b',blob);
        console.log('x',File.formatFileSize(7433));

        reader.onload = ({target: {result}}) => {
            console.log('xxx',result);
            const base64 = (result).replace('data:application/octet-stream;base64,', 'data:image/png;base64,')
            console.error('b',base64);
        }

        reader.onerror = function (error) {

            console.error('e',error);
        }

        reader.readAsDataURL(blob)


    } catch (err) {
        console.error(err);
    }
}

</script>

<style lang="scss" scoped>
.detail {
    &-wrap {

    }

    &-inner {

    }

    &-header {
        display: flex;
        align-items: flex-start;
        justify-content: flex-start;

        padding: var(--spacing-m);
        //height: 243px;
        //overflow: hidden;

        .cover {
            margin-right: var(--spacing-m);
            border-radius: var(--border-radius-l);
        }

        .info {
            position: relative;
            width: 100%;
            height: 243px;
            h3 { padding-bottom: 8px; font-size: 20px; }
            p { padding-bottom: 5px; font-size: 13px; }

            .tags {
                position: absolute;
                left: 0;
                bottom: 10px;
                padding-top: var(--spacing-m);
                span {
                    margin-right: var(--spacing-m);
                    padding: 3px 15px;
                    color: #FFF;

                    font-size: 12px;
                    background: #CCC;
                    border-radius: 20px;
                    cursor: pointer;
                    opacity: 0.9;
                    &:hover { opacity: 1}
                }
            }
        }
    }

    &-main {
        //margin-top: var(--spacing-m);
        border-top:var(--border-style-solid) var(--border-width-default) var(--border-color-default);
    }
}

</style>
