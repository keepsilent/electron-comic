<template>
    <Toolbar :file="file" @operate="onOperateToolbar" @refresh="onRefresh" @upload="onUpload"/>
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
                            <i>{{Common.setCountUnit(item.count)}}</i>
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
                <Interim v-if="settings.page.show == false" :interim="interim" style="opacity: 0.65"></Interim>
                <div v-else v-for="(item,index) in thumbnail" :key="index" class="file-item" :id="'file-item-'+index" :style="{ width: item.width+'px', height:item.height+'px',marginTop: settings.space+'px'}">
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

            <!-- Show Page Num -->
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
    <Upload :show="page.upload" @hide="onUpload(false)"></Upload>
    <FileEdit :show="page.edit" :file="file" @cancel="onCancelFileEdit" @update="onUpdateFileEdit"></FileEdit>
    <Confirm :confirm="confirm" @cancel="onCancelConfirm" @confirm="onOperateConfirm"></Confirm>
</template>

<script lang="ts" setup>
import {useI18n} from 'vue-i18n';
import {useRouter,useRoute} from 'vue-router'
import {ref, reactive, watch, onMounted, onBeforeUnmount} from 'vue'
import type {ConfirmInter, EmptyInter, InterimInter} from "@renderer/types/common";
import type {PageInter, FileInter, ThumbnailInter, MetaInter, SettingsInter} from "@renderer/types/views/reader";
import {Base, Common, File,Time} from "@renderer/utils";
import {usePageStore} from '@renderer/stores/page';
import {useFileStore} from '@renderer/stores/file';
import {getFileInfo, updateFileInfo, updateFileStatus, getFileTaxonomy} from "@renderer/api/file";
import {isFileMetaExist, getFileMetaValue, updateFileMetaValue, addFileMeta} from "@renderer/api/filemeta";
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

const {t} = useI18n();
const route = useRoute();
const router = useRouter();
const pageStore = usePageStore();
const fileStore = useFileStore();
const fs = require("fs") as typeof import("fs");
const scrollbar:any = ref(null);
const menubar:any = ref(null);

const page:PageInter = reactive({init: false, loading: false, edit: false, upload: false, layout:pageStore.page.layout, actions: {}});
const file:FileInter = reactive({
    file_id: 0,
    file_date: '',
    file_modified: '',
    file_name: '',
    file_path: '',
    file_status: '',
    file_size: '',
    file_total: 0,
    file_mine_type: '',
    file_view: 0,
    file_intro: '',
});
const meta:MetaInter = reactive({
    id: {show: false, id: 0, source: ''},
    title: {show:  false, title: '',source: ''},
});
const settings:SettingsInter = reactive({
    page: {
        show: false,
        num: 1,
        total: 1,
        layout: Common.getLayoutFold(pageStore.page.layout,'detail-page')
    },
    scrollTop: 0,
    zoom: import.meta.env.VITE_APP_COMIC_ZOOM,
    space: import.meta.env.VITE_APP_COMIC_SPACE,
    thumbnail:[],
});

const thumbnail:ThumbnailInter[] = reactive([])
const confirm:ConfirmInter = reactive({show:false,content:''});
const empty:EmptyInter = reactive({show: false});
const interim:InterimInter = reactive({show: true, space: true});

onMounted(async () => {
    init();
})

onBeforeUnmount(() => {
    updateFileView();
    updateFileSettings();
    scrollbar.value.removeEventListener("scroll", onScroll);
    scrollbar.value.removeEventListener("click", onContent);
});

const init = function():void {
    setArchive();
    loadDetail();
}

const setArchive = function():void {
    Common.setArchive(Archive);
}

const loadDetail = async function ():Promise<boolean|void> {
    try {
        const {id} = route.query;
        const params = {id: id, status:'normal'}
        const res = await getFileInfo(params);

        if(res.code != 200 ) {
            Common.showAlert(confirm,t('alert.content.inexistence'),t('alert.default'),t('button.ok'),'onReturn')
            return false;
        }

        if(Base.isEmpty(res.data)) {
            Common.showAlert(confirm,t('alert.content.inexistence'),t('alert.default'),t('button.ok'),'onReturn')
            return false;
        }

        resetFileData(res.data);
        await getFileSettings();
        await renderCover(file);
        await renderContent(file)
        await renderStatus(file);
    } catch (err) {
        Base.printErrorLog('getFileInfo',err)
    } finally {
        page.init = true;
    }
}

const renderContent = function (file):boolean|void {
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

const setFileStatus = async function ({file_id}):Promise<void> {
    try {
        const params = {id: file_id, status: 'lose'}
        await updateFileStatus(params)
    } catch (err) {
        Base.printErrorLog('updateFileStatus',err)
    }
}

const resetFileData = async function (data):Promise<boolean|void> {
    if(Base.isEmpty(data)) {
        return false
    }

    Object.assign(file,data[0])
    file.file_alias = File.getFileAlias(file.file_name);
    file.file_size = File.formatFileSize(Number(file.file_size));
    file.file_modified = Time.getTimeAgo(file.file_modified);

    file.file_tags = await loadFileTaxonomy(file.file_id,'tag');
    file.file_artists = await loadFileTaxonomy(file.file_id,'artist');
    file.file_categories = await loadFileTaxonomy(file.file_id,'category');
    file.file_languages = await loadFileTaxonomy(file.file_id,'language');

    await setFileMetaId(file.file_id);
    await setFileMetaTitle(file.file_id,file.file_alias);
}

const setFileMetaId = async function (file_id:number):Promise<boolean> {
    const res = await getFileMeta(file_id,'id');
    if(Base.isEmpty(res)) {
        return false
    }

    const {id, source} = res
    meta.id = {
        id: id,
        source: source,
        show: id != 0 ? true: false,
    }
    return true
}

const setFileMetaTitle = async function (file_id:number, file_name:string):Promise<boolean> {
    const res = await getFileMeta(file_id,'title');
    if(Base.isEmpty(res)) {
        return false
    }

    const {title} = res;
    const language = getFileTitleLanguage(title, file_name);
    const subtitle = getFileSubtitle(title, language);

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

const loadFileTaxonomy = async function(file_id:number, taxonomy:string) {
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

const renderStatus = function(file):void {
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

        let archive = await Archive.open(blob);
        let extract = await archive.extractFiles();
        //const current =  (new Date()).valueOf() - now;

        readImageFile(File.getExtractImageList(extract));

        archive = null;
        extract = null;
    } catch (err) {
        Base.printErrorLog('archive',err)
    }
}

const readImageFile = async function (data):Promise<boolean|void> {
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
}

const getThumbnailOrigin = function (index):{type:string,width:string,height:string} {
    const {thumbnail} = settings;
    const width = import.meta.env.VITE_APP_COMIC_WIDTH;
    const height = import.meta.env.VITE_APP_COMIC_HEIGHT;

    for(let i in thumbnail) {
        let item:{index:string,width:string,height:string} = thumbnail[i] || {index: 0, width: '', height: ''}
        if(index == item.index) {
            return { type: 'real', width: item.width, height: item.height}
        }
    }

    return { type: 'placeholder', width: width, height: height}
}

const setThumbnailPage = function():void {
    settings.page.show = true;
    settings.page.total = Base.getDataLength(thumbnail);
}

const autoCreateCover = function():boolean|void {
    const {file_id} = file;
    const cover = thumbnail[0].cover
    const path = File.getFileCoverById(file_id);

    if (File.isExists(path)) {
        return false;
    }

    file.file_cover = cover;
    File.createCoverByBase64(file_id.toString(), cover);
}

const renderCover = async function ({file_id}):Promise<boolean|void> {
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
    } catch (err) {
        Base.printErrorLog('loadCover readFileSync',err)
    }
}

const setDefaultImage = function():void {
    file.file_cover = Common.getDefaultImage();
}

const onScroll = function (event):void {
    const scrollTop = event.target.scrollTop;
    settings.scrollTop = scrollTop;

    //onContent()
    renderThumbnail(scrollTop);
    renderThumbnailPage(scrollTop);
}

const getThumbnailTotal = function ():number {
    return settings.page.total - 1;
}

const renderThumbnailPage = function (scrollTop):boolean|void {
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

const isScrollbarTouchBottom = function ():boolean {
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

const prerenderThumbnail = function ():void {
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

const runPrerenderThumbnailScheme = function(index:number, total:number, scrollTop:number):boolean|void {
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

const renderThumbnail = function (scrollTop:number):void {
    const total = getThumbnailTotal();
    for(let i in thumbnail) {
        if(thumbnail[i].status == 'loading') {
            const position = getImageScrollPosition(i,total);
            const offset = (position.bottom - position.top) / 2;
            if(scrollTop >= position.top - offset * 4 && scrollTop < position.bottom + offset ){
                showThumbnail(Number(i));
                break;
            }

            if(position.top == position.bottom && Number(i) == total){
                showThumbnail(Number(i));
                break;
            }
        }
    }
}

const showThumbnail = async function (index:number):Promise<boolean|void> {
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

const setThumbnailPreviewSize = function (index:number):void {
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

const getImageScrollPosition = function (i:string,total:number):{top:number, bottom:number} {
    const next = (parseInt(i)+1) > total ? total : (parseInt(i)+1);
    const topId = document.getElementById('file-item-'+i);
    const bottomId = document.getElementById('file-item-'+next);
    const topPosition = getElementPagePosition(topId);

    const bottomPostion = getElementPagePosition(bottomId);
    const top = topPosition.y;
    const bottom = bottomPostion.y;

    return { top: top, bottom: bottom };
}

const getElementPagePosition = function(element):{x:number,y:number} {
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

const getFileMeta = async function(id:number, key:string):Promise<{id: number,title: object, source: string}> {
    try {
        const params = {id: id, key: key }
        const res = await getFileMetaValue(params);
        if(res.code !== 200) {
            return {id: 0, title: {}, source: ''};
        }

        if(Base.isEmpty(res.data)) {
            return {id: 0, title: {}, source: ''};
        }

        return JSON.parse(res.data[0].meta_value);
    } catch (err) {
        return {id: 0, title: {}, source: ''}
    }
}

const getFileSettings = async function():Promise<boolean|void> {
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

const updateFileView = async function():Promise<boolean|void> {
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

const updateFileSettings = async function():Promise<boolean|void> {
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

const onUpdateSettings = function ({key,value}):void {
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

const onContent = function():void {
    menubar.value.onHideSetting();
}

const onOperateToolbar = function(args):void {
    switch (args.key) {
        case 'edit':
            page.edit = args.value;
            break
    }
}

const onCancelFileEdit = function ():void {
    page.edit = false;
}

const onUpdateFileEdit = function (data):boolean {
    if(Base.isEmpty(data)) {
        return false;
    }
    file.file_name = data.file_name;
    file.file_path = data.file_path;
    file.file_alias = data.file_alias;
    file.file_intro = data.file_intro;
    return true;
}

const onCopy = function (event):void {
    Base.copy(event);
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

const onUpload = function (show:boolean=true):void {
    page.upload = show
}

const onRefresh = function () {
    page.init = false;
    settings.page.show = false;
    init();
}

const onCancelConfirm = function():void {
    Common.cancelConfirm(confirm);
}

const onOperateConfirm = function():void {
    Common.operateConfirm(confirm, page);
}

watch(() => page.init,(value) => {
    if(value == false) {
        return false;
    }

    setTimeout(  () => {
        scrollbar.value.addEventListener("click", onContent)
    },4)
})

watch(() => settings.page.show,(value) => {
    if(value == false) {
        return false;
    }

    setTimeout(  () => {
        if(Base.isEmpty(thumbnail)) {
            return false;
        }
        prerenderThumbnail();
        scrollbar.value.addEventListener("scroll", onScroll)
    },4)
})

watch(() => pageStore.page.layout,(value)=>{
    page.layout = value;
    settings.page.layout = Common.getLayoutFold(value,'detail-page');
})
</script>
<style src="./index.scss" lang="scss" scoped></style>
