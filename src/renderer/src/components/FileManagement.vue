<template>
    <div class="file-wrap scrollbar">
        <div class="file-inner">


            <div v-for="(item,index) in files" :key="index" class="file-item" :data-id="item.id" @click="onRedirect">
                <div class="cover">
                    <img :src="item.cover" :data-index="index" width="216" height="287" @error="setDefaultImage">
<!--                    <span class="type">ZIP</span>-->
<!--                    <div class="mask">-->
<!--                        <span class="num">{{item.total}}页</span>-->
<!--                    </div>-->
                </div>
                <p class="title">{{item.name}}</p>
<!--                <p class="subtitle">-->
<!--                    <span>{{item.date}}</span>-->
<!--                    <span>{{item.total}}页</span>-->
<!--                </p>-->
            </div>



            <div class="file-upload-btn">
                <i class="iconfont icon-add"></i>
                <input type="file" ref="upload" title="Upload File" accept=".zip,.txt,.pdf" @change="onUpload">
                <p>Upload File</p>
            </div>
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
import {usePageStore} from '@renderer/stores/page'

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
const keyword:string = ref(null);
const files = reactive({});

onMounted(() => {
    init()
})

const init = function () {
    setArchive();
    setSearchKeyWord();
    loadFileList();
}

const setSearchKeyWord = function () {
    keyword.value = route.query.keyword ?? '';
}

const setArchive = function () {
    Common.setArchive(Archive);
}

const getParams = function () {
    const params = {
        page: 1,
        pagesize: 10
    }

    if(!Base.isEmpty(keyword.value)) {
        params.keyword = keyword.value
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

        for(let i in res.data) {
            res.data[i].name = File.getFileAlias(res.data[i].name);
            res.data[i].cover = await getCover(res.data[i]);
            res.data[i].size = File.formatFileSize(res.data[i].size);
            res.data[i].date = Time.formatDate(res.data[i].date,'YYYY/MM/DD');
        }

        Object.assign(files,res.data);
    } catch (err) {
        Base.printErrorLog('getFileList',err);
    }
}


const getCover = async function ({id}):void {
    try {
        const path = File.getFileCoverById(id);

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

const uploadFile = async function ( file,extract) {
    try {
        const data= {
            name: file.name,
            author: '',
            type: file.type,
            size: file.size,
            path: file.path,
            total: File.getExtractFileTotal(extract),
        }

        const cover = await File.getExtractFileCover(extract);
        const res = await addFile(data);
        if(res.code != 200) {
            return false
        }

        File.createCoverByBase64(res.data, cover)
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
        path: `/details`,
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
    files[index].cover = Common.getDefaultImage();
}

watch(() => pageStore.keyword,(value)=>{
   keyword.value = value;
   loadFileList();
})
</script>

<style scoped lang="scss">
.file {
    &-wrap {
        height: calc(100vh - 25px - 48px - 41px);
        padding: var(--spacing-m);
        background: var(--background-color-secondary);
        overflow-y: auto;
    }

    &-inner {
        display: grid;
        //grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
        grid-template-columns: repeat(auto-fill, 183px);
        gap: 15px;
    }


    &-item {
        //width: 216px;
        width: 183px;
        cursor: pointer;
        overflow: hidden;


        .cover {
            position: relative;
            //width: 216px;
            //height: 287px;
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
            .mask {
                position: absolute;
                right: 0;
                bottom: 0;
                font-size: 26px;
                line-height: 24px;
                padding: 0 8px 6px 0;
                color: #fff;
                background: -webkit-gradient(linear, left top, left bottom, from(rgba(0, 0, 0, 0)), to(rgba(0, 0, 0, .5)));
                background: -webkit-linear-gradient(top, rgba(0, 0, 0, 0), rgba(0, 0, 0, .5));
                background: -o-linear-gradient(top, rgba(0, 0, 0, 0) 0, rgba(0, 0, 0, .5) 100%);
                background: linear-gradient(180deg, rgba(0, 0, 0, 0), rgba(0, 0, 0, .5));
                width: 100%;
                text-align: right;
                z-index: 4;

                font-style: italic;
                font-family: DIN-BoldItalic;
            }
            .type {
                position: absolute;
                top: 10px;
                left: 10px;
                padding: 2px 8px;
                border-radius: 5px;
                background: #FFF;
            }

            //.num {
            //    position: absolute;
            //    bottom: 5px;
            //    right: 10px;
            //
            //    color: #FFF;
            //    font-size: 24px;
            //    font-weight: bolder;
            //    font-style: italic;
            //    font-family: DIN-BoldItalic;
            //}
        }

        .title {
            padding: 5px 0;

            color: #333;
            font-size: var(--text-size-l);
            height: calc(2* (var(--text-size-l) * 1.4));

            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
            overflow: hidden;
        }

        .subtitle {
            display: flex;
            align-items: center;
            justify-content: space-between;
        }
    }


    &-upload-btn {
        position: relative;

        width: 183px;
        height: 243px;

        text-align: center;

        cursor: pointer;
        background: var(--background-color-primary);
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
