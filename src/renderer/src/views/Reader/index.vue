<template>
    <Toolbar :file="file" @operate="onOperateToolbar"/>
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
                <img class="cover" :src="file.file_cover" :alt="file.file_name" width="183" height="243" @error="setDefaultImage">
                <div class="info">
                    <h3 class="title">
                        {{file.file_alias}}
                        <i class="iconfont icon-copy" :title="$t('button.copy')" :data-text="file.file_alias" @click="onCopy"></i>
                    </h3>
<!--                    <p class="subtitle">[BG本田] シンタロ-がストッキングオナニ-する話 [英訳]</p>-->
                    <p class="no"><span>#</span>{{file.file_id}}</p>

                    <div v-if="file.file_tags.length > 0" class="taxonomy-wrap">
                        <div class="taxonomy-inner">
                            <label>{{t('details.tags')}}：</label>
                            <span class="item" v-for="(item,index) in file.file_tags" :key="index">
                                <em>{{item.name}}</em>
                                <i>{{item.count}}</i>
                            </span>
                        </div>
                    </div>

                    <div v-if="file.file_artists.length > 0" class="taxonomy-wrap">
                        <div class="taxonomy-inner">
                            <label>{{t('details.artists')}}：</label>
                            <span class="item" v-for="(item,index) in file.file_artists" :key="index">
                                <em>{{item.name}}</em>
                                <i>{{item.count}}</i>
                            </span>
                        </div>
                    </div>

                    <div v-if="file.file_languages.length > 0" class="taxonomy-wrap">
                        <div class="taxonomy-inner">
                            <label>{{t('details.languages')}}：</label>
                            <span class="item" v-for="(item,index) in file.file_languages" :key="index">
                                <em>{{item.name}}</em>
                                <i>{{item.count}}</i>
                            </span>
                        </div>
                    </div>

                    <div v-if="file.file_categories.length > 0" class="taxonomy-wrap">
                        <div class="taxonomy-inner">
                            <label>{{t('details.categories')}}：</label>
                            <span class="item" v-for="(item,index) in file.file_categories" :key="index">
                                <em>{{item.name}}</em>
                                <i>{{item.count}}</i>
                            </span>
                        </div>
                    </div>
                    <div class="taxonomy-wrap">
                        <div class="taxonomy-inner">
                            <label>{{t('details.pages')}}：{{file.file_total}}</label>
                        </div>
                    </div>
                    <div class="taxonomy-wrap">
                        <div class="taxonomy-inner">
                            <label>{{t('details.uploaded')}}：{{file.file_modified}}</label>
                        </div>
                    </div>
                    <div v-if="file.file_intro" class="taxonomy-wrap">
                        <div class="taxonomy-inner">
                            <label>{{t('details.intro')}}：{{file.file_intro}}</label>
                        </div>
                    </div>
                </div>
            </div>
            <Empty :empty="empty"></Empty>

            <div class="detail-main" >
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

            <!-- 分页数 -->
            <div v-if="settings.page.show" class="detail-page none-select">
                <span class="current">{{settings.page.num}}</span>
                <em>/</em>
                <span class="total">{{settings.page.total}}</span>
            </div>

            <Menubar ref="menubar" :settings="settings" @update="onUpdateSettings"></Menubar>
        </div>
    </div>

    <Loading :show="page.loading"></Loading>
    <FileEdit :show="fileEdit" :file="file" @cancel="onCancelFileEdit" @update="onUpdateFileEdit"></FileEdit>
    <Confirm :confirm="confirm" @cancel="onCancelConfirm" @confirm="onOperateConfirm"></Confirm>
</template>

<script lang="ts" setup>
import {useI18n} from 'vue-i18n';
import {useRouter,useRoute} from 'vue-router'
import {ref, reactive, watch, onMounted, onBeforeUnmount} from 'vue'
import type {PageInter, ConfirmInter, FileInter, EmptyInter, InterimInter} from "@renderer/utils/types";
import {Alphabet, Base,Common, File,Time} from "@renderer/utils";
import {usePageStore} from '@renderer/stores/page'
import {getFileInfo, getFileTaxonomy} from "@renderer/api/file";
import {isFileMetaExist,getFileMetaValue,updateFileMetaValue,addFileMeta} from "@renderer/api/filemeta";
import {Archive} from 'libarchive.js/main.js';

import Toolbar from "./components/toolbar.vue";
import Menubar from "./components/menubar.vue";
import Confirm from "@renderer/components/Confirm.vue";
import Loading from "@renderer/components/Loading.vue";
import Interim from "@renderer/components/Interim.vue";
import Empty from "@renderer/components/Empty.vue";
import FileEdit from "@renderer/components/FileEdit.vue";

const { t } = useI18n();
const route = useRoute();
const router = useRouter();

const pageStore = usePageStore();
const fs = require("fs") as typeof import("fs");
const scrollbar = ref(null);
const menubar = ref(null);
const fileEdit:boolean = ref(false);
const page:PageInter = reactive({init: false, loading: false, actions: {}});
const confirm:ConfirmInter = reactive({});
const file:FileInter = reactive({});
const interim:InterimInter = reactive({});
const empty:EmptyInter = reactive({});
const thumbnail = reactive([])
const settings = reactive({
    page: {show: false, num: 1, total: 1},
    scrollTop: 0,
    zoom: import.meta.env.VITE_APP_COMIC_ZOOM,
    space: import.meta.env.VITE_APP_COMIC_SPACE,
    thumbnail:[]
});


// import puppeteer from 'puppeteer-core';
// import axios from "axios";


const cp = require("child_process") as typeof import("child_process");
onMounted(async () => {
    init();

    console.log('__dirname',__dirname);
    const url = './resources/crawler/index.ts';
    cp.spawn('node', [url],
        { stdio: 'inherit' }
    );
    console.log('child_process',cp)
    // axios.get('https://www.bilibili.com/')
    //     .then(function (res) {
    //         // 获取网页数据
    //         console.log(res);
    //
    //     })
    //     .catch(function (err) {
    //         console.log('failed', err);
    //     });


// Or import puppeteer from 'puppeteer-core';


    // const browser = await puppeteer.launch();
    // const page = await browser.newPage();

// Navigate the page to a URL.
    //await page.goto('https://developer.chrome.com/');


//     await browser.close();

    // var Nightmare = require("nightmare") as typeof import("nightmare");
    // var nightmare = Nightmare({ show: true });
    //
    // nightmare.goto('https://www.bidu.com')
    //     .end(() => 'some value')
    //     .then(function (result) {
    //         console.log(result);
    //     })
    //     .catch(function (error) {
    //         console.error('Search failed:', error);
    //     });

    // nightmare.goto('https://duckduckgo.com')
    //     .type('#search_form_input_homepage', 'github nightmare')
    //     .click('#search_button_homepage')
    //     .wait('#zero_click_wrapper .c-info__title a')
    //     .evaluate(function () {
    //         return document.querySelector('#zero_click_wrapper .c-info__title a').href;
    //     })
    //     .end()
    //     .then(function (result) {
    //         console.log(result);
    //     })
    //     .catch(function (error) {
    //         console.error('Search failed:', error);
    //     });

    // var iframe = document.createElement("iframe");
    // iframe.id = 'iframe';
    // //iframe.src = "https://nhentai.net/g/568663/";
    // iframe.src = "https://www.bilibili.com/";
    //
    // iframe.src = 'https://e-hentai.org';
    //
    // if (iframe.attachEvent){
    //     iframe.attachEvent("onload", function(){
    //        // alert("Local iframe is now loaded.");
    //         console.log('Local iframe is now loaded1');
    //     });
    // } else {
    //     iframe.onload = function(){
    //         console.log('Local iframe is now loaded2');
    //         // var iframe2 = document.getElementById('iframe');
    //         // var iframeDocument = iframe2.contentDocument || iframe2.contentWindow.document;
    //         // console.log('iframeDocument',iframeDocument);
    //     };
    // }
    // document.body.appendChild(iframe);
})

onBeforeUnmount(() => {
    updateFileSettings();
    scrollbar.value.removeEventListener("scroll", onScroll);
    scrollbar.value.removeEventListener("click", onContent);
});

watch(() => page.init,(value) => {
    if(value == false) {
        return false;
    }

    setTimeout(  () => {
        prerenderThumbnail();
        scrollbar.value.addEventListener("scroll", onScroll);
        scrollbar.value.addEventListener("click", onContent);
    },4)
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

        console.log('x');

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
    const {file_path} = file;
    if(File.isExists(file_path)) {
        renderFilesThumbnail(file);
        return false;
    }

    const title = t('empty.inexistence.title');
    const subtitle = t('empty.inexistence.subtitle');
    Common.showEmpty(empty,title, subtitle)
}

const resetFileData = async function (data):boolean {
    if(Base.isEmpty(data)) {
        return false
    }

    Object.assign(file,data[0])
    file.file_alias = File.getFileAlias(file.file_name);
    file.file_size = File.formatFileSize(file.file_size);
    file.file_modified = Time.formatDate(file.file_modified,'YYYY/MM/DD');

    file.file_tags = await loadFileTaxonomy(file.file_id,'tag');
    file.file_artists = await loadFileTaxonomy(file.file_id,'artist');
    file.file_categories = await loadFileTaxonomy(file.file_id,'category');
    file.file_languages = await loadFileTaxonomy(file.file_id,'language');

    //console.log('file.file_artists',file.file_artists);
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
    pageStore.num = file.file_total;
    pageStore.setStatusPath(file.file_path,'path');
}

const renderFilesThumbnail = async function (file:File):void {
    try {
        const fileBuffer = fs.readFileSync(file.file_path);
        const blob = new Blob([fileBuffer], {type: file.file_mine_type});

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
        data[i].origin = getThumbnailOrigin(i);
        data[i].width = getThumbnailPreviewSizeEquation(data[i].origin.width);
        data[i].height = getThumbnailPreviewSizeEquation(data[i].origin.height);
        data[i].status = 'loading';
    }

    Object.assign(thumbnail, data)
    setThumbnailPage()
    autoCreateCover();
}

const getThumbnailOrigin = function (index) {
    const {thumbnail} = settings;
    const width = import.meta.env.VITE_APP_COMIC_WIDTH;
    const height = import.meta.env.VITE_APP_COMIC_HEIGHT;

    for(let i in thumbnail) {
        if(index == thumbnail[i].index) {
            return { type: 'real', width: thumbnail[i].width, height: thumbnail[i].height}
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
    File.createCoverByBase64(file_id, cover);
}

const renderCover = async function ({file_id}):void {
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

    //onContent()
    renderThumbnail(scrollTop);
    renderThumbnailPage(scrollTop);
}

const getThumbnailTotal = function () {
    return settings.page.total - 1;
}

const renderThumbnailPage = function (scrollTop) {
    const total = getThumbnailTotal();
    const offset = parseInt( window.screen.height / 2);

    if (isScrollbarTouchBottom()) {
        settings.page = { ...settings.page, num:　parseInt(total)+1}
        return false;
    }

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

const isScrollbarTouchBottom = function () {
    const scrollableElement = document.getElementById("scrollbar");
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
    const index = parseInt(page.num) - 1;
    const total = parseInt(page.total) - 1;

    settings.page.num = page.num;

    runPrerenderThumbnailScheme(index,total,scrollTop);
    document.getElementById('scrollbar').scrollTop = scrollTop;
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

            if(position.top == position.bottom && i == total){
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
    if(thumbnail[index].origin.type == 'real') {
        return false;
    }

    setThumbnailPreviewSize(index)
}

const setThumbnailPreviewSize = function (index) {
    const img = new Image();
    img.src = thumbnail[index].cover;
    img.onload = function() {
        thumbnail[index] = {
            ...thumbnail[index],
            origin: {
                type: 'real',
                width: img.width,
                height: img.height
            },
            width: getThumbnailPreviewSizeEquation(img.width),
            height: getThumbnailPreviewSizeEquation(img.height)
        }
    }

    img.onerror = function () {
        console.log('图片加载失败',index);
    }
}

const getThumbnailPreviewSizeEquation = function (value):number {
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

const isExistFileSetttings = async function () {
    if(Base.isEmpty(file)) {
        return false;
    }

    try {
        const {id} = file;
        const params = {id: id, key: 'settings'}
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

const getFileSettings = async function() {
    if(Base.isEmpty(file)) {
        return false;
    }

    if(isExistFileSetttings() == false) {
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

const updateFileSettings = async function () {
    if(Base.isEmpty(file)) {
        return false;
    }

    const {file_id} = file
    const key = 'settings'
    const value = {
        current: settings.page.num,
        scrollTop: parseInt(settings.scrollTop),
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
    const data = [];
    for(let i in thumbnail) {
        if(thumbnail[i].origin.type == 'real') {
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
                thumbnail[i].width = getThumbnailPreviewSizeEquation(thumbnail[i].origin.width)
                thumbnail[i].height = getThumbnailPreviewSizeEquation(thumbnail[i].origin.height)
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

const onUpdateFileEdit = function (data:object):boolean {
    if(Base.isEmpty(data)) {
        return false;
    }
    file.file_name = data.file_name;
    file.file_path = data.file_path;
    file.file_alias = data.file_alias;
    file.file_intro = data.file_intro;
    console.log('onUpdateFileEdit',data);
}

const onCopy = function (event) {
    Base.copy(event);
}
</script>

<style src="./index.scss" lang="scss" scoped></style>
