<template>
    <Toolbar :file="file" @cancel="" @confirm=""/>
    <div class="detail-wrap scrollbar">
        <div class="detail-inner">
            <div class="detail-header">
                <img class="cover" :src="file.cover" :alt="file.name" width="183" height="243">
                <div class="info">
                    <h3 class="title">{{file.alias}}</h3>
                    <p>{{t('details.author')}}：{{file.author || '未知'}}</p>
                    <p>{{t('details.size')}}：{{file.size}}</p>
<!--                    <p>{{t('details.include.title')}}：{{t('details.include.subtitle',{files:file.total,folders:0})}} </p>-->
                    <p>{{t('details.date')}}：{{file.date}}</p>
                    <div class="tags">
                        <span>#热血</span><span>#科幻</span><span>#机甲</span>
                    </div>
                </div>
            </div>
            <div class="detail-main">
                <div v-for="(item,index) in thumbnail" :key="index" class="file-item">
                    <div class="cover">
                        <img :src="item.cover" :alt="item.name" width="216" height="287">
                    </div>
                    <p class="title">{{item.alias}}</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import {ref, reactive, watch, onMounted} from 'vue'
import type {PageInter, ConfirmInter, FileInter} from "@renderer/utils/types";
import {Base, File,Time} from "@renderer/utils";
import {usePageStore} from '@renderer/stores/page'
import {getFileInfo} from "@renderer/api/file";
import {Archive} from 'libarchive.js/main.js';

import Toolbar from "./components/toolbar.vue";

const { t } = useI18n();
const fs = require("fs") as typeof import("fs");
const page:PageInter = reactive({init: false, loading: false, actions: {}});
const confirm:ConfirmInter = reactive({show: false, title: '需要密码重置',content: '',callback:'', showCancel: false, cancelText: '取消', confirmText: '确定'});
const file:FileInter = reactive({});
const thumbnail = reactive([])

const pageStore = usePageStore();

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


        resetFileData(res.data);

        renderStatus(file);
        renderCover(file);
        renderFilesThumbnail(file);
    } catch (err) {
        Base.printErrorLog('getFileInfo',err)
    }
}

const resetFileData = function (data):boolean {
    if(Base.isEmpty(data)) {
        return false
    }

    Object.assign(file,data[0])
    file.alias = File.getFileAlias(file.name);
    file.size = File.formatFileSize(file.size);
    file.date = Time.formatDate(file.date,'YYYY/MM/DD');
}

const renderStatus = function (file) {
    pageStore.setStatusPath(file.path,'path');
    pageStore.num = file.total;
}

const renderFilesThumbnail = async function (file:File):void {
    try {
        const fileBuffer = fs.readFileSync(file.path);
        const blob = new Blob([fileBuffer], {type: file.type});

        const archive = await Archive.open(blob);
        const extract = await archive.extractFiles();

        readImageFile(File.getExtractImageList(extract));
    } catch (err) {
        Base.printErrorLog('archive',err)
    }
}

const readImageFile = async function (data):boolean {
    if(Base.isEmpty(data)) {
        return false;
    }

    for(let i in data) {
        data[i].cover = await File.getBase64Image(data[i])
        data[i].alias = File.getFileAlias(data[i].name);
    }

    Object.assign(thumbnail, data)
    autoCreateCover();
    console.log('thumbnail',thumbnail);
}

const autoCreateCover = function () {
    const {id} = file;
    const cover = thumbnail[0].cover
    const path = File.getFileCoverById(id);
    console.error('File.isExists(path)',File.isExists(path))
    if (File.isExists(path)) {
        return false;
    }

    file.cover = cover;
    File.createCoverByBase64(id, cover);
}

const renderCover = async function ({id}):void {
    try {
        const path = File.getFileCoverById(id);

        if (File.isExists(path) == false) {
            return false;
        }

        const fileBuffer = fs.readFileSync(path);
        file.cover = await File.getBase64Image(fileBuffer);
    } catch (err) {
        Base.printErrorLog('loadCover readFileSync',err)
    }
}
</script>

<style lang="scss" scoped>
.detail {
    &-wrap {
        height: calc(100vh - 25px - 48px - 41px);
        overflow-y: auto;
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
            object-fit: contain;
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
        padding: var(--spacing-m);
        display: grid;
        grid-template-columns: repeat(auto-fill, 183px);
        gap: 15px;

        .file-item {
            width: 183px;
            cursor: pointer;
            overflow: hidden;

            .cover {
                position: relative;
                width: 183px;
                height: 243px;

                //background: var(--background-color-secondary);
                border-radius: var(--border-radius-default);
                overflow: hidden;

                img {
                    width: 100%;
                    height: 100%;
                    object-fit: contain;
                }
            }

            .title {
                text-align: center;
            }
        }
    }
}

</style>
