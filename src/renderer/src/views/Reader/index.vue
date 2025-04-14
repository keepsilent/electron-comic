<template>
    <Toolbar :file="file"/>
    <div v-if="page.init == false" ref="scrollbar" class="detail-wrap scrollbar scrollbar-space">
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

    <div v-if="page.init" ref="scrollbar" class="detail-wrap scrollbar scrollbar-space" id="scrollbar">
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
            <div class="detail-main" >

                <div v-for="(item,index) in thumbnail" :key="index" class="file-item" :id="'file-item-'+index" :style="{ width: item.width+'px', height:item.height+'px'}">
                    <template v-if="item.status == 'loading'">
                        <div class="loading">
                            <img src="@renderer/assets/images/common/loading.gif" width="200" height="200">
                        </div>
                        <div class="title">Comic++{{item.status}}</div>
                    </template>

                    <template v-if="item.status == 'finish'">
                        <div class="cover">
                            <img :src="item.cover" :alt="item.name" width="100%">
                        </div>
                    </template>
                </div>

<!--                <div class="cc-reader-image-box" id="cc-reader-item-{{index}}" data-url="{{item.url}}" data-type="{{item.type}}" data-status="{{item.status}}" data-mode="{{item.mode}}" style="{{space}}">-->
<!--                    <div class="ddl-loading-spinner">-->
<!--                        <img src="./dist/images/loading.gif" width="200" height="200">-->
<!--                    </div>-->
<!--                    <div class="ddl-logo">Comic++</div>-->
<!--                </div>-->
            </div>
            <div class="detail-page">
                <span class="current">{{settings.page.num}}</span>
                <em>/</em>
                <span class="total">{{settings.page.total}}</span>
            </div>

        </div>
    </div>

    <Loading :show="page.loading"></Loading>
    <Confirm :confirm="confirm" @cancel="onCancelConfirm" @confirm="onOperateConfirm"></Confirm>
</template>

<script lang="ts" setup>
import {useI18n} from 'vue-i18n';
import {useRouter,useRoute} from 'vue-router'
import {ref, reactive, watch, onMounted, onUnmounted} from 'vue'
import type {PageInter, ConfirmInter, FileInter, EmptyInter, InterimInter} from "@renderer/utils/types";
import {Base,Common, File,Time} from "@renderer/utils";
import {usePageStore} from '@renderer/stores/page'
import {getFileInfo} from "@renderer/api/file";
import {isFileMetaExist,getFileMetaValue,updateFileMetaValue,addFileMeta} from "@renderer/api/filemeta";
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

const scrollbar = ref(null);
const page:PageInter = reactive({init: false, loading: false, actions: {}});
const confirm:ConfirmInter = reactive({});
const file:FileInter = reactive({});
const interim:InterimInter = reactive({});
const empty:EmptyInter = reactive({});
const thumbnail = reactive([])
const settings = reactive({
    page: {num: 1, total: 1},
    scrollTop: 0
});

onMounted(() => {
    init();


})



onUnmounted(() => {
    updateSettings();
    scrollbar.value.removeEventListener("scroll", onScroll);
});

watch(() => page.init,(value) => {
    if(value == false) {
        return false;
    }

    setTimeout(()=> {
        prerenderThumbnail();
        scrollbar.value.addEventListener("scroll", onScroll);
    },0)
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
        //const {id} = route.query;
        const  id = 1;
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

        updateSettings()

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
        data[i].cover = (i == 0) ? await File.getBase64Image(data[i]) : '';
        data[i].alias = File.getFileAlias(data[i].name);
        data[i].origin = { width: 700, height: 933}
        data[i].width = 700;
        data[i].height = 933;
        data[i].status = 'loading';
    }

    Object.assign(thumbnail, data)
    console.log('thumbnail',thumbnail);
    setThumbnailPage(1, thumbnail.length)
    autoCreateCover();
}

const setThumbnailPage = function (num, total) {
    settings.page.num = num;
    settings.page.total = total;
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

const onScroll = function (event) {
    const scrollTop = event.target.scrollTop;
    settings.scrollTop = scrollTop;

    renderThumbnail(scrollTop);
    renderThumbnailPage(scrollTop);
}

const getThumbnailTotal = function () {
    return settings.page.total - 1;
}

const renderThumbnailPage = function (scrollTop) {
    const total = getThumbnailTotal();
    const offset = parseInt( window.screen.height / 2);
    for(let i in thumbnail) {
        const position = getImageScrollPosition(i,total);
        if(scrollTop >= position.top - offset && scrollTop < position.bottom - offset && i != total ){
            settings.page = { ...settings.page, num:　parseInt(i)+1}
            break;
        }

        if(scrollTop >= position.bottom - offset && i == total ){
            settings.page = { ...settings.page, num:　parseInt(i)+1}
            break;
        }
    }
}


const prerenderThumbnail = function () {
    const index = 0
    showThumbnail(index);
    //{page: '', zoom: 100, position: ''}
    //document.getElementById('scrollbar').scrollTop = 2000;
}

const renderThumbnail = function (scrollTop) {
    const total = getThumbnailTotal();
    for(let i in thumbnail) {
        if(thumbnail[i].status == 'loading') {
            const position = getImageScrollPosition(i,total);
            const offset = (position.bottom - position.top) / 2;
            if(scrollTop >= position.top - offset * 4 && scrollTop < position.bottom + offset ){
                showThumbnail(i);
                break;
            }

            if(position.top == position.bottom && i == total && scrollTop >= position.bottom - window.screen.height / 2){
                showThumbnail(i);
                break;
            }
        }
    }
}

const showThumbnail = async function (index) {
    if(thumbnail[index].status == 'finish') {
        return false;
    }
    const cover = await File.getBase64Image(thumbnail[index])

    thumbnail[index] = {
        ...thumbnail[index],
        cover: cover,
        status: 'finish'
    }

    const img = new Image();
    img.src = thumbnail[index].cover;
    img.onload = function() {
        thumbnail[index] = {
            ...thumbnail[index],
            origin: {
                width: img.width,
                height: img.height
            },
            width: img.width * 100 / 100,
            height: img.height * 100 / 100,
        }
    }

    img.onerror = function () {
        console.log('图片加载失败',index);
    }
}


const getImageScrollPosition = function (i,total) {
    const next = (parseInt(i)+1) > total ? total : (parseInt(i)+1);
    const topId = document.getElementById('file-item-'+i);
    const bottomId = document.getElementById('file-item-'+next);
    const topPosition = getElementPagePosition(topId);

    const bottomPostion = getElementPagePosition(bottomId);
    const top = topPosition.y;
    const bottom = bottomPostion.y;

    return { top: top, bottom: bottom };
}


const getElementPagePosition = function(element) {
    let left = element.offsetLeft;
    let top = element.offsetTop;
    const current = element.offsetParent;

    if (!Base.isEmpty(current)){
        left += current.offsetLeft;
        top += (current.offsetTop + current.clientTop);
    }

    return {x: left, y: top};
}

const updateSettings = async function ():boolean {
    if(Base.isEmpty(file)) {
        return false;
    }

    const {id} = file
    const key = 'settings'
    const value = {
        current: settings.page.num,
        position: settings.scrollTop,
        zoom: 100,
        space: 20
    }

    try {
        const res = await isFileMetaExist({id: id,key: key});
        if(res.code !== 200) {
            return false;
        }

        if(Base.isEmpty(res.data)) {
            await addFileMeta({file_id: id, meta_key: key, meta_value:JSON.stringify(value)});
            return false
        }

        await updateFileMetaValue({id: id, key: key, value: JSON.stringify(value)});
    } catch (err) {
        Base.printErrorLog('updateSettings',err)
    }
}
</script>

<style src="./index.scss" lang="scss" scoped></style>
