<template>
    <div class="file-wrap scrollbar">
        <div class="file-main">
            <div v-for="(item,index) in load.list" :key="index" class="file-item" :data-id="item.file_id" @click="onRedirect">
                <div class="cover">
                    <img :src="item.file_cover" :data-index="index" width="216" height="287" @error="setDefaultImage">
                </div>
<!--                <span class="type">ZIP</span>-->
<!--                <div class="mask">-->
<!--                    <p class="title">{{item.file_name}}</p>-->
<!--                </div>-->
                <p class="title">{{item.file_name}}</p>
            </div>

<!--            <div class="file-upload-btn">-->
<!--                <i class="iconfont icon-add"></i>-->
<!--                <input type="file" ref="upload" title="Upload File" accept=".zip,.txt,.pdf" @change="onUpload">-->
<!--                <p>Upload File</p>-->
<!--            </div>-->
        </div>

        <div class="file-footer">
            <Pagination :pagination="pagination" @chagePage="onChangePage"></Pagination>
        </div>
    </div>

    <Loading :show="page.loading"></Loading>
    <Confirm :confirm="confirm" @cancel="onCancelConfirm" @confirm="onOperateConfirm"></Confirm>
</template>

<script setup lang="ts">
import {useI18n} from 'vue-i18n';
import {useRouter,useRoute} from 'vue-router'
import {ref, reactive, watch, onMounted} from 'vue'

import type {PageInter, ConfirmInter} from "@renderer/utils/types";
import {Base, Common, File, Time} from "@renderer/utils";
import {getFileList, isFileExist, addFile} from "@renderer/api/file";
import {getNhentaiList} from "@renderer/api/nhentai";
import {usePageStore} from '@renderer/stores/page'
import Pagination from "@renderer/components/Pagination.vue";


import Loading from "./Loading.vue";
import Confirm from "./Confirm.vue";
import {Archive} from 'libarchive.js/main.js';

const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const pageStore = usePageStore();
const fs = require("fs") as typeof import("fs");
const page:PageInter = reactive({init: false, loading: false, actions: {}});
const confirm:ConfirmInter = reactive({});
const upload:string = ref(null);

const load = reactive({page: 1, pageSize: 20, list:[], keyword: ''})
const pagination = reactive({show: false, page: 1, totalPage: 1})

onMounted(() => {

    const {keyword, page, group, sort} = route.query;
    console.log('route.query',route.query);

    //pageStore.setStatusPath(`Source: ${type}`);

    load.page = page ?? 1;
    load.keyword = keyword ?? 1;
    console.log('load',load.page);

    init()
})

const init = function () {
    setArchive();
    setSearchKeyWord();
    loadFileList();
}

const setSearchKeyWord = function () {
    load.keyword = route.query.keyword ?? '';
}

const setArchive = function () {
    Common.setArchive(Archive);
}

const getParams = function () {
    const params = {
        page: load.page,
        pageSize: load.pageSize
    }

    if(!Base.isEmpty(load.keyword )) {
        params.keyword = load.keyword
    }

    return params
}

const loadFileList = async function () {
    try {
        const params = getParams();
        const res = await getFileList(params)
        if(res.code != 200) {
            return false;
        }

        console.log('res',res);
        if(Base.isEmpty(res.data.list)) {
            load.list = [];
            return false;
        }



        setPagination(res.data)
        setFileList(res.data.list);
    } catch (err) {
        Base.printErrorLog('getFileList',err);
    }
}

const setFileList = async function (data:object[]) {
    if(Base.isEmpty(data)) {
        return false;
    }

    for(let i in data) {
        data[i].file_name = File.getFileAlias(data[i].file_name);
        data[i].file_cover = await getCover(data[i]);
        data[i].file_size = File.formatFileSize(data[i].file_size);
        data[i].file_date = Time.formatDate(data[i].file_date,'YYYY/MM/DD');
    }
    load.list = data;
}

const setPagination = function ({page,totalPage}):void {
    pagination.show = true;
    pagination.page = page;
    pagination.totalPage = totalPage;
}


const getCover = async function ({file_id}):Promise<void> {
    try {
        const path = File.getFileCoverById(file_id);

        if (File.isExists(path) == false) {
            return Common.getDefaultImage();
        }

        const fileBuffer = fs.readFileSync(path);
        return await File.getBase64Image(fileBuffer);
    } catch (err) {
        Base.printErrorLog('loadCover readFileSync',err)
    }
}

const isUploaded = async function (name,type) {
    try {
        const params = {name: name, type: type};
        const res = await isFileExist(params);

        if(res.code !== 200) {
            return true;
        }

        if(Base.getDataLength(res.data) >= 1) {
            return true
        }

        return false;
    } catch (err) {
        Base.printErrorLog('isFileExist',err)
        return true;
    }
}

const onUpload = async function (event) {
    if (event.length == 0) {
        Common.showAlert(confirm,'Please select the file you upload','Upload File Tips');
        upload.value.value = null;
        return false;
    }

    try {
        Common.showLoading(page);
        const [file] = event.target.files;
        const archive = await Archive.open(file);
        const extract = await archive.extractFiles();

        if(await isUploaded(file.name,file.type)) {
            Common.showAlert(confirm,`${File.getFileAlias(file.name)} already exist!`,'Upload File Tips');
            return false;
        }

        await uploadFile(file, extract);
    } catch (err) {
        console.error('err',err)
    } finally {
        Common.hideLoading(page);
        upload.value.value = null;
    }
}

const uploadFile = async function (file, extract) {
    try {
        const data= {
            'file_name': file.name,
            'file_mine_type': file.type,
            'file_size': file.size,
            'file_path': file.path,
            'file_total': File.getExtractFileTotal(extract),
        }

        const cover = await File.getExtractFileCover(extract);
        const res = await addFile(data);
        if(res.code != 200) {
            return false
        }

        const file_id = res.data;
        data.file_id = file_id;
        await getNhentaiList(data);
        File.createCoverByBase64(file_id, cover)
        loadFileList();
        console.log('addSingleFile res',res);
    } catch (err) {
        Base.printErrorLog('addFile', err)
    }
}

page.actions.onTest = function () {
    console.log('I am test')
}

const onCancelConfirm = function () {
    Common.cancelConfirm(confirm);
}

const onRedirect = function ({currentTarget: {dataset: {id}}}) {
    const object = {
        //path: `/details`,
        path: `/reader`,
        query: {
            id: id
        }
    }

    router.push(object)
}

const onOperateConfirm = function () {
    Common.operateConfirm(confirm, page);
}

const setDefaultImage = function ({currentTarget: {dataset: {index}}}) {
    load.list[index].cover = Common.getDefaultImage();
}

const onChangePage = function ({value}):void {
    const object = {
        path: `/`,
        query:  {
            page: value
        }
    }

    if(!Base.isEmpty(load.keyword)) {
        object.query.keyword = load.keyword
    }

    router.push(object)
}

watch(() => pageStore.keyword,(value)=>{
    load.keyword = value;
   loadFileList();
})
</script>

<style scoped lang="scss">
.file {
    &-wrap {
        height: calc(100vh - 25px - 48px - 41px);
        padding: var(--spacing-m);
        //background: var(--background-color-secondary);
        overflow-y: auto;
    }

    &-main {
        display: grid;
        min-height: 560px;
        //grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
        grid-template-columns: repeat(auto-fill, 183px);
        gap: 15px;
    }


    &-item {
        //width: 216px;
        position: relative;

        width: 183px;
        cursor: pointer;
        overflow: hidden;

        .cover {
            position: relative;
            width: 183px;
            height: 243px;

            background: #FFF;
            border-radius: var(--border-radius-default);
            overflow: hidden;

            img {
                width: 100%;
                height: 100%;
                object-fit: contain;
            }
        }

        .mask {
            position: absolute;
            right: 0;
            bottom: 0;

            width: 100%;
            padding-top: var(--spacing-xs);
            padding-bottom: var(--spacing-xs);

            background: -webkit-gradient(linear, left top, left bottom, from(rgba(0, 0, 0, 0)), to(rgba(0, 0, 0, .5)));
            background: -webkit-linear-gradient(top, rgba(0, 0, 0, 0), rgba(0, 0, 0, .5));
            background: -o-linear-gradient(top, rgba(0, 0, 0, 0) 0, rgba(0, 0, 0, .5) 100%);
            background: linear-gradient(180deg, rgba(0, 0, 0, 0), rgba(0, 0, 0, .5));
            border-bottom-left-radius: var(--border-radius-default);
            border-bottom-right-radius: var(--border-radius-default);
            z-index: 1;
            .title {
                padding: 0 var(--spacing-s);

                color: #fff;
                font-size: var(--text-size-m);

                //height: calc(2* (var(--text-size-l) * 1.4));

                display: -webkit-box;
                -webkit-box-orient: vertical;
                -webkit-line-clamp: 2;
                overflow: hidden;
            }

        }
        .title {
            padding: var(--spacing-xxs) 0;

            color: var(--content-color-secondary);
            font-size: var(--text-size-m);

            height: calc( 2 * (var(--text-size-m) * 1.5));

            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
            overflow: hidden;
        }

        .type {
            position: absolute;
            top: 10px;
            left: 10px;
            padding: 2px 8px;
            border-radius: 5px;
            background: #FFF;
        }
    }


    &-upload-btn {
        position: relative;

        width: 183px;
        height: 243px;

        text-align: center;

        cursor: pointer;
        background: var(--background-color-secondary);
        border-radius: var(--border-radius-default);
        border: dashed var(--border-width-default) var(--grey-30);

        &:hover {
            border-color: var(--grey-40);
            i  {
                color: var(--content-color-tertiary);
                opacity: 1;
            }
            p {
                opacity: 1;
                color: var(--content-color-tertiary);
            }
        }

        i {
            display: block;
            width: 60px;
            height: 60px;
            margin: 0 auto;
            padding-top: 62.5px;
            color: var(--grey-40);

            opacity: 0.75;
            font-size: 60px;
            line-height: 1;
        }

        input {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;

            cursor: pointer;
            opacity: 0;
        }

        p {
            padding: 10px 0;
            height: 30px;
            color: var(--grey-40);
            opacity: 0.75;
        }
    }
}
</style>
