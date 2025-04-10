<template>
    <Toolbar :file="file"/>
    <div v-if="page.init == false" class="detail-wrap scrollbar scrollbar-space">
        <div class="detail-inner">
            <div class="detail-header-skeleton">
                <div class="cover"></div>
                <div class="info">
                    <p class="title"></p>
                    <p class="subtitle"></p>
                    <div class="tags">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                </div>
            </div>

            <Interim :interim="interim"></Interim>
        </div>
    </div>

    <div v-if="page.init" class="detail-wrap scrollbar scrollbar-space">
        <div class="detail-inner">
            <div class="detail-header">
                <img class="cover" :src="file.cover" :alt="file.name" width="183" height="243" @error="setDefaultImage">
                <div class="info">
                    <h3 class="title">{{file.alias}}</h3>
                    <p>{{t('details.author')}}：{{file.author || t('details.unknown')}}</p>
                    <p>{{t('details.size')}}：{{file.size}}</p>
<!--                    <p>{{t('details.include.title')}}：{{t('details.include.subtitle',{files:file.total,folders:0})}} </p>-->
                    <p>{{t('details.date')}}：{{file.date}}</p>
                    <div class="tags">
                        <span>#热血</span><span>#科幻</span><span>#机甲</span>
                    </div>
                </div>
            </div>
            <Empty :empty="empty"></Empty>
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

    <Loading :show="page.loading"></Loading>
    <Confirm :confirm="confirm" @cancel="onCancelConfirm" @confirm="onOperateConfirm"></Confirm>
</template>

<script lang="ts" setup>
import {useI18n} from 'vue-i18n';
import {useRouter,useRoute} from 'vue-router'
import {reactive, onMounted} from 'vue'
import type {PageInter, ConfirmInter, FileInter, EmptyInter, InterimInter} from "@renderer/utils/types";
import {Base,Common, File,Time} from "@renderer/utils";
import {usePageStore} from '@renderer/stores/page'
import {getFileInfo} from "@renderer/api/file";
import {Archive} from 'libarchive.js/main.js';

import Toolbar from "./components/toolbar.vue";
import Confirm from "@renderer/components/Confirm.vue";
import Loading from "@renderer/components/Loading.vue";
import Interim from "@renderer/components/Interim.vue";
import Empty from "@renderer/components/Empty.vue";

const { t } = useI18n();
const route = useRoute();
const router = useRouter();

const pageStore = usePageStore();
const fs = require("fs") as typeof import("fs");
const page:PageInter = reactive({init: false, loading: false, actions: {}});
const confirm:ConfirmInter = reactive({});
const file:FileInter = reactive({});
const interim:InterimInter = reactive({});
const empty:EmptyInter = reactive({});
const thumbnail = reactive([])

onMounted(() => {
    init();
})

page.actions.onGoBack = function ():void {
    Common.cancelConfirm(confirm);
    router.back()
}

const init = function () {
    setArchive();
    loadDetail();
}

const setArchive = function () {
    Common.setArchive(Archive);
}

const loadDetail = async function () {
    try {
        const {id} = route.query;
        const params = {id: id, status:'normal'}
        const res = await getFileInfo(params);
        if(res.code != 200 ) {
            Common.showAlert(confirm,t('alert.content.inexistence'),t('alert.default'),t('button.ok'),'onGoBack')
            return false;
        }

        if(Base.isEmpty(res.data)) {
            Common.showAlert(confirm,t('alert.content.inexistence'),t('alert.default'),t('button.ok'),'onGoBack')
            return false;
        }

        resetFileData(res.data);
        renderCover(file);
        renderContent(file)
        renderStatus(file);
        Common.lazyRenderPage(page);
    } catch (err) {
        Base.printErrorLog('getFileInfo',err)
    }
}

const renderContent = function (file) {
    const {path} = file;
    if(File.isExists(path)) {
        renderFilesThumbnail(file);
        return false;
    }

    const title = t('empty.inexistence.title');
    const subtitle = t('empty.inexistence.subtitle');
    Common.showEmpty(empty,title, subtitle)
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
    pageStore.num = file.total;
    pageStore.setStatusPath(file.path,'path');
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
        data[i].cover = await File.getBase64Image(data[i]);
        data[i].alias = File.getFileAlias(data[i].name);
    }

    Object.assign(thumbnail, data)
    autoCreateCover();
}

const autoCreateCover = function () {
    const {id} = file;
    const cover = thumbnail[0].cover
    const path = File.getFileCoverById(id);

    if (File.isExists(path)) {
        return false;
    }

    file.cover = cover;
    File.createCoverByBase64(id, cover);
}

const renderCover = async function ({id}):void {
    try {
        const path = File.getFileCoverById(id);

        if (File.isExists(path) == false && File.isExists(file.path) == false) {
            file.cover = Common.getDefaultImage()
            return false;
        }

        if (File.isExists(path) == false) {
            return false;
        }

        const fileBuffer = fs.readFileSync(path);
        file.cover = await File.getBase64Image(fileBuffer);
    } catch (err) {
        Base.printErrorLog('loadCover readFileSync',err)
    }
}

const onCancelConfirm = function () {
    Common.cancelConfirm(confirm);
}

const onOperateConfirm = function () {
    Common.operateConfirm(confirm, page);
}

const setDefaultImage = function () {
    file.cover = Common.getDefaultImage();
}
</script>

<style src="./index.scss" lang="scss" scoped></style>
