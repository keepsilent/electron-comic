<template>
    <Toolbar :file="file" @operate="onOperateToolbar" @refresh="onRefresh" @upload="onShowUpload"/>
    <div v-if="page.init == false" ref="scrollbar" class="detail-wrap scrollbar scrollbar-space">
        <div class="detail-inner">
            <div class="detail-header-skeleton">
                <div class="cover"></div>
                <div class="info">
                    <p class="title"></p>
                    <p class="subtitle"></p>
                    <p class="no"></p>
                    <p class="tag">
                        <span></span>
                        <span></span>
                        <span></span>
                        <span></span>
                        <span></span>
                        <span></span>
                    </p>
                    <p class="tag">
                        <span></span>
                        <span></span>
                        <span></span>
                    </p>
                    <p class="tag">
                        <span></span>
                        <span></span>
                        <span></span>
                        <span></span>
                        <span></span>
                        <span></span>
                    </p>
                    <p class="tag">
                        <span></span>
                        <span></span>
                        <span></span>
                    </p>
                    <p class="tag">
                        <span></span>
                        <span></span>
                    </p>
                    <p class="tag">
                        <span></span>
                    </p>
                </div>
            </div>

            <Interim :interim="interim" style="opacity: 0.65"></Interim>
        </div>
    </div>
    <div v-if="page.init" ref="scrollbar" class="detail-wrap scrollbar scrollbar-space" id="scrollbar">
        <div class="detail-inner">
            <div class="detail-header">
                <img class="cover" :src="file.file_cover" :alt="file.file_name" width="183" height="243" @error="setDefaultImage">
                <div class="info">


<!--                   <i class="iconfont icon-copy" style="font-weight: normal" :title="$t('button.copy')" :data-text="file.file_alias" @click="onCopy"></i>-->

                    <p class="title" v-html="formatTitle(file.file_alias)"></p>
                    <p v-if="meta.title.show" class="subtitle" v-html="formatTitle(meta.title.title)"></p>
                    <p v-if="meta.id.show" class="no" ><span>#</span>{{meta.id.id}}</p>

                    <div v-if="Base.getDataLength(file.file_tags) > 0" class="taxonomy">
                        <label>{{t('details.tags')}}：</label>
                        <span class="item" v-for="(item,index) in file.file_tags" :key="index" :data-name="item.name" data-type="tag" @click="onSearchTaxonomy">
                            <em>{{item.name}}</em>
                            <i>{{setCountUnit(item.count)}}</i>
                        </span>
                    </div>

                    <div v-if="Base.getDataLength(file.file_artists) > 0" class="taxonomy">
                        <label>{{t('details.artists')}}：</label>
                        <span class="item" v-for="(item,index) in file.file_artists" :key="index" :data-name="item.name" data-type="artist" @click="onSearchTaxonomy">
                            <em>{{item.name}}</em>
                            <i>{{item.count}}</i>
                        </span>
                    </div>

                    <div v-if="Base.getDataLength(file.file_languages) > 0" class="taxonomy">
                        <label>{{t('details.languages')}}：</label>
                        <span class="item" v-for="(item,index) in file.file_languages" :key="index" :data-name="item.name" data-type="language" @click="onSearchTaxonomy">
                            <em>{{item.name}}</em>
                            <i>{{item.count}}</i>
                        </span>
                    </div>

                    <div v-if="Base.getDataLength(file.file_categories) > 0" class="taxonomy">
                        <label>{{t('details.categories')}}：</label>
                        <span class="item" v-for="(item,index) in file.file_categories" :key="index" :data-name="item.name" data-type="category" @click="onSearchTaxonomy">
                            <em>{{item.name}}</em>
                            <i>{{item.count}}</i>
                        </span>
                    </div>

                    <div class="taxonomy">
                        <label>{{t('details.pages')}}：{{file.file_total}}</label>
                    </div>

                    <div class="taxonomy">
                        <label>{{t('details.uploaded')}}：{{file.file_modified}}</label>
                    </div>

                    <div v-if="file.file_intro" class="taxonomy">
                        <label>{{t('details.intro')}}：{{file.file_intro}}</label>
                    </div>
                </div>
            </div>
            <Empty :empty="empty"></Empty>

            <div class="detail-main">
                <div v-for="(item,index) in thumbnail" :key="index" class="file-item" :id="'file-item-'+index" :style="{ width: item.width+'px', height:item.height+'px',marginTop: settings.space+'px'}">
                    <template v-if="item.status == 'loading'">
                        <div class="loading">
                            <img src="@renderer/assets/images/common/loading.gif" width="200" height="200">
                        </div>
                        <div class="title">Comic++</div>
                    </template>

                    <template v-if="item.status == 'finish'">
                        <div class="cover">
                            <img :src="item.cover" :alt="item.name" width="100%">
                        </div>
                    </template>
                </div>
            </div>

            <div v-if="thumbnail.length > 0" class="detail-footer mt-m">Σ(ﾟдﾟ;) {{t('details.end')}}</div>

            <!-- 分页数 -->
            <div v-if="settings.page.show" :class="['detail-page','none-select',settings.page.layout]">
                <span class="current">{{settings.page.num}}</span>
                <em>/</em>
                <span class="total">{{settings.page.total}}</span>
            </div>

            <Menubar ref="menubar" :settings="settings" @update="onUpdateSettings"></Menubar>
        </div>
    </div>
    <Statusbar :file="file" :settings="settings"></Statusbar>

    <Loading :show="page.loading"></Loading>
    <Upload :show="page.upload" @hide="onHideUpload"></Upload>
    <FileEdit :show="fileEdit" :file="file" @cancel="onCancelFileEdit" @update="onUpdateFileEdit"></FileEdit>
    <Confirm :confirm="confirm" @cancel="onCancelConfirm" @confirm="onOperateConfirm"></Confirm>
</template>

<script lang="ts" setup>
import {useI18n} from 'vue-i18n';
import {useRouter,useRoute} from 'vue-router'
import {ref, reactive, watch, onMounted, onBeforeUnmount} from 'vue'
import type {PageInter, ConfirmInter, FileInter, EmptyInter, InterimInter} from "@renderer/utils/types";
import {Alphabet, Base,Common, File,Time} from "@renderer/utils";
import {usePageStore} from '@renderer/stores/page';
import {useFileStore} from '@renderer/stores/file';
import {getFileInfo, updateFileStatus, getFileTaxonomy} from "@renderer/api/file";
import {isFileMetaExist,getFileMetaValue,updateFileMetaValue,addFileMeta} from "@renderer/api/filemeta";
import {Archive} from 'libarchive.js/main.js';

import Toolbar from "./components/toolbar.vue";
import Menubar from "./components/menubar.vue";
import Statusbar from "./components/statusbar.vue";
import Confirm from "@renderer/components/Confirm.vue";
import Loading from "@renderer/components/Loading.vue";
import Upload from "@renderer/components/Upload.vue";
import Interim from "@renderer/components/Interim.vue";
import Empty from "@renderer/components/Empty.vue";
import FileEdit from "@renderer/components/FileEdit.vue";
import {updateFileInfo} from "../../api/file";

const { t } = useI18n();
const route = useRoute();
const router = useRouter();


interface ThumbnailInter {
    name?:string,
    cover?:string,
    alias?:string,
    origin?: { type: string, width: string, height: string}
    width?:number,
    height?:number
    status?:string
}

interface SettingsInter {
    page?: {
        show: boolean,
        num: number,
        total: number,
        layout: string
    },
    scrollTop?: number,
    zoom?: number,
    space?: number
    thumbnail?: { index?:string,width?:string,height?:string }[],
}

const pageStore = usePageStore();
const fileStore = useFileStore();
const fs = require("fs") as typeof import("fs");
const scrollbar:any = ref(null);
const menubar:any = ref(null);
const fileEdit = ref(false);
const page:PageInter = reactive({init: false, loading: false, upload: false, layout:pageStore.layout, actions: {}});
const confirm:ConfirmInter = reactive({show:false});
const file:FileInter = reactive({file_id: 0});
const interim:InterimInter = reactive({show: true, space: true});
const empty:EmptyInter = reactive({show: false});
const thumbnail:ThumbnailInter[] = reactive([])
const meta = reactive({
    id: {show: false, id: 0, source: ''},
    title: {show:  false, title: '',source: ''},
});

const settings = reactive({
    page: {
        show: false,
        num: 1,
        total: 1,
        layout: Common.getLayoutFold(pageStore.layout,'detail-page')
    },
    scrollTop: 0,
    zoom: import.meta.env.VITE_APP_COMIC_ZOOM,
    space: import.meta.env.VITE_APP_COMIC_SPACE,
    thumbnail:[],
});

onMounted(async () => {
    init();
})

onBeforeUnmount(() => {
    updateFileView();
    updateFileSettings();
    scrollbar.value.removeEventListener("scroll", onScroll);
    scrollbar.value.removeEventListener("click", onContent);
});

watch(() => page.init,(value) => {
    if(value == false) {
        return false;
    }

    setTimeout(  () => {
        if(Base.isEmpty(thumbnail)) {
            return false;
        }
        prerenderThumbnail();
        scrollbar.value.addEventListener("scroll", onScroll)
        scrollbar.value.addEventListener("click", onContent)
    },4)
})

// page.actions.onGoBack = function ():void {
//     Common.cancelConfirm(confirm);
//     router.back()
// }

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
        await getFileSettings();
        renderCover(file);
        renderContent(file)
        renderStatus(file);
        Common.lazyRenderPage(page);
    } catch (err) {
        Base.printErrorLog('getFileInfo',err)
    }
}

const renderContent = function (file) {
    const {file_path, file_status} = file;
    if(file_status == 'normal' && File.isExists(file_path)) {
        renderFilesThumbnail(file);
        return false;
    }

    setFileStatus(file);
    const title = t('empty.inexistence.title');
    const subtitle = t('empty.inexistence.subtitle');
    Common.showEmpty(empty,title, subtitle)
}

const setFileStatus = async function ({file_id}) {
    try {
        const params = {id: file_id, status: 'lose'}
        await updateFileStatus(params)
    } catch (err) {
        Base.printErrorLog('updateFileStatus',err)
    }
}

const resetFileData = async function (data) {
    if(Base.isEmpty(data)) {
        return false
    }

    Object.assign(file,data[0])
    file.file_alias = File.getFileAlias(file.file_name);
    file.file_size = File.formatFileSize(Number(file.file_size));
    file.file_modified = getTimeAgo(file.file_modified,'YYYY/MM/DD HH:mm:ss');

    file.file_tags = await loadFileTaxonomy(file.file_id,'tag');
    file.file_artists = await loadFileTaxonomy(file.file_id,'artist');
    file.file_categories = await loadFileTaxonomy(file.file_id,'category');
    file.file_languages = await loadFileTaxonomy(file.file_id,'language');

    await setFileMetaId(file.file_id);
    await setFileMetaTitle(file.file_id,file.file_alias);
}

const setFileMetaId = async function (file_id):Promise<boolean> {
    const res = await getFileMeta(file_id,'id');
    if(Base.isEmpty(res)) {
        return false
    }

    meta.id = {
        id: res.id,
        source: res.source,
        show: true,
    }
    return true
}

const setFileMetaTitle = async function (file_id, file_name):Promise<boolean> {
    const res = await getFileMeta(file_id,'title');
    if(Base.isEmpty(res)) {
        return false
    }

    const language = getFileTitleLanguage(res.title, file_name);
    const subtitle = getFileSubtitle(res.title, language);

    meta.title = {
        title: subtitle,
        source: res.source,
        show: subtitle ? true: false
    }

    formatTitle(subtitle);
    return true
}

const getFileTitleLanguage = function (data:object, name:string):string {
    const reg = /[/\\?%*:|"<>]/g;
    for(let i in data) {
        if(data[i] == name) {
            return i;
        }

        //移除文件夹不支持字符
        if(data[i].replaceAll(reg,'') == name.replaceAll(reg,'')) {
            return i;
        }

        //移除文件夹不支持字符 && 移除空格
        if(data[i].replaceAll(reg,'').replaceAll("\s*", "") == name.replaceAll(reg,'').replaceAll("\s*", "")) {
            return i;
        }
    }

    return ''
}

const formatTitle = function (title:string = ''):string {
    if(Base.isEmpty(title)) {
        return title
    }

    title = title.replaceAll(/[\(]/g,'<span>(')
    title = title.replaceAll(/[\[]/g,'<span>[')

    title = title.replaceAll(/[\)]/g,')</span>')
    title = title.replaceAll(/[\]]/g,']</span>')
    return title;
}

const getFileSubtitle = function (data:object, type:string):string {
    if(Base.isEmpty(type)) {
        return '';
    }

    for(let i in data) {
        if(i != type) {
            return data[i];
        }
    }

    return ''
}

const loadFileTaxonomy = async function (file_id, taxonomy) {
    try {
        const params = {file_id: file_id, taxonomy: taxonomy}
        const res = await getFileTaxonomy(params)
        if(res.code != 200) {
            return []
        }

        //console.log('loadFileTaxonomy', res.data, params);
        return res.data || [];
    } catch (err) {
        Base.printErrorLog('getFileTaxonomy',err)
        return []
    }
}

const renderStatus = function (file) {
    fileStore.info = file;
    fileStore.id = file.file_id;
    // pageStore.num = file.file_total;
    // pageStore.setStatusPath(file.file_path,'path');
}

const renderFilesThumbnail = async function (file):Promise<void> {
    try {
        //const now = (new Date()).valueOf();
        const fileBuffer = fs.readFileSync(file.file_path);
        const blob = new Blob([fileBuffer], {type: file.file_mine_type});

        const archive = await Archive.open(blob);
        const extract = await archive.extractFiles();
        //const current =  (new Date()).valueOf() - now;

        readImageFile(File.getExtractImageList(extract));
    } catch (err) {
        Base.printErrorLog('archive',err)
    }
}

const readImageFile = async function (data):Promise<boolean> {
    if(Base.isEmpty(data)) {
        return false;
    }

    for(let i in data) {
        data[i].cover = (Number(i) == 0) ? await File.getBase64Image(data[i]) : '';
        data[i].alias = File.getFileAlias(data[i].name);
        data[i].origin = getThumbnailOrigin(i);
        data[i].width = getThumbnailPreviewSizeEquation(data[i].origin.width);
        data[i].height = getThumbnailPreviewSizeEquation(data[i].origin.height);
        data[i].status = 'loading';
    }

    Object.assign(thumbnail, data)
    setThumbnailPage()
    autoCreateCover();
    return true;
}

const getThumbnailOrigin = function (index) {

    const {thumbnail} = settings;
    const width = import.meta.env.VITE_APP_COMIC_WIDTH;
    const height = import.meta.env.VITE_APP_COMIC_HEIGHT;

    for(let i in thumbnail) {
        let item:{index?:string,width?:string,height?:string} = thumbnail[i] || {index: 0, width: '', height: ''}
        if(index == item.index) {
            return { type: 'real', width: item.width, height: item.height}
        }
    }

    return { type: 'placeholder', width: width, height: height}
}

const setThumbnailPage = function () {
    settings.page.show = true;
    settings.page.total = Base.getDataLength(thumbnail);
}

const autoCreateCover = function () {
    const {file_id} = file;
    const cover = thumbnail[0].cover
    const path = File.getFileCoverById(file_id);

    if (File.isExists(path)) {
        return false;
    }

    file.file_cover = cover;
    File.createCoverByBase64(file_id.toString(), cover);
}

const renderCover = async function ({file_id}) {
    try {
        const path = File.getFileCoverById(file_id);

        if (File.isExists(path) == false && File.isExists(file.file_path) == false) {
            file.file_cover = Common.getDefaultImage()
            return false;
        }

        if (File.isExists(path) == false) {
            return false;
        }


        const fileBuffer = fs.readFileSync(path);
        file.file_cover = await File.getBase64Image(fileBuffer);
        return true;
    } catch (err) {
        Base.printErrorLog('loadCover readFileSync',err)
        return false;
    }
}

const onCancelConfirm = function () {
    Common.cancelConfirm(confirm);
}

const onOperateConfirm = function () {
    Common.operateConfirm(confirm, page);
}

const setDefaultImage = function () {
    file.file_cover = Common.getDefaultImage();
}

const onScroll = function (event) {
    const scrollTop = event.target.scrollTop;
    settings.scrollTop = scrollTop;

    //onContent()
    renderThumbnail(scrollTop);
    renderThumbnailPage(scrollTop);
}

const getThumbnailTotal = function () {
    return settings.page.total - 1;
}

const renderThumbnailPage = function (scrollTop) {
    const total = getThumbnailTotal();
    const offset = parseInt( (window.screen.height / 2).toString());

    if (isScrollbarTouchBottom()) {
        settings.page = { ...settings.page, num:　Number(total)+1}
        return false;
    }

    for(let i in thumbnail) {
        const position = getImageScrollPosition(i,total);

        if(scrollTop >= position.top - offset && scrollTop < position.bottom - offset && Number(i) != total ){
            settings.page = { ...settings.page, num:　Number(i)+1}
            break;
        }

        if(scrollTop >= position.bottom - offset && Number(i) == total ){
            settings.page = { ...settings.page, num:　Number(i)+1}
            break;
        }
    }
}

const isScrollbarTouchBottom = function () {
    const scrollableElement = document.getElementById("scrollbar");
    if(!scrollableElement) {
        return false;
    }
    const elementHeight = scrollableElement.scrollHeight;
    const visibleHeight = scrollableElement.clientHeight;
    const scrollTop = scrollableElement.scrollTop;

    if (scrollTop != 0 && scrollTop + visibleHeight >= elementHeight) { //元素触底了
        return true;
    }

    return false;
}

const prerenderThumbnail = function () {
    const {page, scrollTop} = settings
    const index = Number(page.num) - 1;
    const total = Number(page.total) - 1;

    settings.page.num = page.num;

    runPrerenderThumbnailScheme(index,total,scrollTop);
    const scrollbar = document.getElementById('scrollbar')
    if(scrollbar) {
        scrollbar.scrollTop = scrollTop;
    }
}

const runPrerenderThumbnailScheme = function (index, total, scrollTop) {
    if(scrollTop == 0 && index == 0) {
        showThumbnail(index);
        return false;
    }

    if(index == 0 && index + 1 <= total) {
        showThumbnail(index);
        showThumbnail(index + 1);
        return false;
    }

    if(index == total && index - 1 >= 0) {
        showThumbnail(index);
        showThumbnail(index - 1);
        return false;
    }

    if(index - 1 >= 0) {
        showThumbnail(index - 1);
    }

    if(index + 1 <= total) {
        showThumbnail(index + 1);
    }

    showThumbnail(index);
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

            if(position.top == position.bottom && Number(i) == total){
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

    //已获取过图片真实大小
    if(thumbnail[index].origin && thumbnail[index].origin.type == 'real') {
        return false;
    }

    setThumbnailPreviewSize(index)
}

const setThumbnailPreviewSize = function (index) {
    const img:{src:any, width: any, height:any, onload:any,onerror:any} = new Image();
    img.src = thumbnail[index].cover;
    img.onload = function() {
        thumbnail[index] = {
            ...thumbnail[index],
            origin: {
                type: 'real',
                width: img.width,
                height: img.height
            },
            width: getThumbnailPreviewSizeEquation(Number(img.width)),
            height: getThumbnailPreviewSizeEquation(Number(img.height))
        }
    }

    img.onerror = function () {
        console.log('图片加载失败',index);
    }
}

const getThumbnailPreviewSizeEquation = function (value:number = 0):number {
    const {zoom} = settings;
    return value * zoom / 100
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

const isExistFileSetttings = async function ():Promise<boolean> {
    if(Base.isEmpty(file)) {
        return false;
    }

    try {
        const {file_id} = file;
        const params = {id: file_id, key: 'settings'}
        const res = await isFileMetaExist(params);
        if (res.code !== 200) {
            return false;
        }

        if(Base.isEmpty(res.data)) {
            return false
        }

        return true;
    } catch (err) {
        Base.printErrorLog('isFileMetaExist',err);
        return false;
    }
}

const getFileMeta = async function(id:number, key:string) {
    try {
        const params = {id: id, key: key }
        const res = await getFileMetaValue(params);
        if(res.code !== 200) {
            return '';
        }

        if(Base.isEmpty(res.data)) {
            return '';
        }

        return JSON.parse(res.data[0].meta_value);
    } catch (err) {
        return ''
    }
}

const getFileSettings = async function() {
    if(Base.isEmpty(file)) {
        return false;
    }

    if(await isExistFileSetttings() == false) {
        return false;
    }

    try {
        const {file_id} = file;
        const params = {id: file_id, key: 'settings'}
        const res = await getFileMetaValue(params);
        if(res.code !== 200) {
            return false;
        }

        if(Base.isEmpty(res.data)) {
            return false;
        }

        const {current, scrollTop, zoom, space, thumbnail} = JSON.parse(res.data[0].meta_value);
        settings.page.num = current;
        settings.scrollTop = scrollTop;
        settings.zoom = zoom;
        settings.space = space;
        settings.thumbnail = JSON.parse(thumbnail);
    } catch (err) {
        Base.printErrorLog('getFileMetaValue',err);
    }
}

const updateFileView = async function () {
    if(Base.isEmpty(file)) {
        return false;
    }

    try {
        const {file_id, file_view} = file
        const params = {
            file_id: file_id,
            data: {file_view: file_view ? file_view+1: 1}
        }
        await updateFileInfo(params)
    } catch (err) {
        Base.printErrorLog('updateFileInfo',err)
    }
}

const updateFileSettings = async function () {
    if(Base.isEmpty(file)) {
        return false;
    }

    const {file_id} = file
    const key = 'settings'
    const value = {
        current: settings.page.num,
        scrollTop: parseInt((settings.scrollTop).toString()),
        zoom: settings.zoom,
        space: settings.space,
        thumbnail: JSON.stringify(getThumbnailCacheData())
    }

    try {
        const res = await isFileMetaExist({id: file_id,key: key});
        if(res.code !== 200) {
            return false;
        }

        if(Base.isEmpty(res.data)) {
            await addFileMeta({file_id: file_id, meta_key: key, meta_value:JSON.stringify(value)});
            return false
        }

        await updateFileMetaValue({id: file_id, key: key, value: JSON.stringify(value)});
    } catch (err) {
        Base.printErrorLog('updateFileSettings',err)
    }
}

const getThumbnailCacheData = function ():object {
    const data: { index:string,width:string,height:string }[] = [];
    for(let i in thumbnail) {
        if(thumbnail[i].origin && thumbnail[i].origin.type == 'real') {
            data.push({
                index: i,
                width:thumbnail[i].origin.width,
                height: thumbnail[i].origin.height
            })
        }
    }

    return data;
}

const onUpdateSettings = function ({key,value}) {
    console.log('onUpdateSettings',key,value);
    switch (key) {
        case 'space':
            settings.space = value;
            break
        case 'zoom':
            settings.zoom = value;
            for(let i in thumbnail) {
                const {width, height} = thumbnail[i]
                thumbnail[i].width = getThumbnailPreviewSizeEquation(width)
                thumbnail[i].height = getThumbnailPreviewSizeEquation(height)
            }
            break;
    }
}

const onContent = function () {
    menubar.value.onHideSetting();
}

const onOperateToolbar = function (args) {
    switch (args.key) {
        case 'edit':
            fileEdit.value = args.value;
            break
    }
}

const onCancelFileEdit = function ():void {
    fileEdit.value = false;
}

const onUpdateFileEdit = function (data):boolean {
    if(Base.isEmpty(data)) {
        return false;
    }
    file.file_name = data.file_name;
    file.file_path = data.file_path;
    file.file_alias = data.file_alias;
    file.file_intro = data.file_intro;
    console.log('onUpdateFileEdit',data);
    return true;
}

const onCopy = function (event) {
    Base.copy(event);
}

const getTimeAgo = function (date:string|number='', format:string = 'YYYY/MM/DD HH:mm:ss'):string {
    if (Base.isEmpty(date)) {
        return '';
    }

    const now = new Date().getTime();   //获取当前时间毫秒
    const timeStamp = Time.dateToTimestamp(date);
    const value = now - timeStamp; //时间差

    const day = Math.floor(value / (1000 * 60 * 60) / 24);
    const hour = Math.floor(value / (1000 * 60 * 60));
    const minute = Math.floor(value / (1000 * 60));
    const second = Math.floor(value / 1000);

    if (day >= 1 && day <= 6) {
        return t('time.day',{day:day, hour:hour - day * 24});
    }

    if (hour >= 1 && hour <= 23) {
        return t('time.hour',{hour:hour, minute:minute - hour * 60});
    }

    if (minute >= 1 && minute <= 59) {
        return t('time.minute',{minute:minute});
    }

    if(second >= 4 && second <= 59) {
        return t('time.second',{second:second})
    }

    if(second >= 0 && second <= 3) {
        return t('time.now');
    }

    return Time.formatDate(timeStamp, format);
}

const setCountUnit = function (value) {
    return Common.setCountUnit(value);
}

const onSearchTaxonomy = function (event):void {
    const {currentTarget: {dataset: {name,type}}} = event
    const object = {
        path: `/`,
        query:  {
            name: name,
            taxonomy: type
        }
    }

    router.push(object)
}

const onShowUpload = function () {
    page.upload = true
}

const onHideUpload = function () {
    page.upload = false;
}

const onRefresh = function () {
    page.init = false;
    init();
}

watch(() => pageStore.layout,(value)=>{
    page.layout = value;
    settings.page.layout = Common.getLayoutFold(value,'detail-page');
})
</script>

<style src="./index.scss" lang="scss" scoped></style>
