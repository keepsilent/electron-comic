<template>
    <Toolbar @order="onSwitchOrder" @filter="onFilefilter" @upload="onUpload" @refresh="onRefresh"/>
    <div ref="scrollbar" class="file-wrap scrollbar" id="scrollbar">

        <!-- Skeleton -->
        <div v-if="page.init == false" :class="['file-main','file-main__skeleton',toolbar.view.class]">
            <div v-for="(item,index) in Number(load.pageSize)" :key="index" class="file-item">
                <div class="cover"></div>
                <p class="title"></p>
                <p class="subtitle"></p>
            </div>
        </div>

        <template v-if="page.init">
            <div v-if="empty.show != true" :class="['file-main',toolbar.view.class]">
                <div v-for="(item,index) in load.list" :key="index" class="file-item" :data-id="item.file_id" @click="onRedirect">
                    <div v-if="page.options.cover" class="cover">
                        <img :src="item.file_cover" :data-index="index" width="216" height="287" :style="item.file_cover_options" @error="setDefaultImage">
                        <div v-if="page.options.view || page.options.type || page.options.size" class="mask">
                            <div class="mask-inner">
                                <div class="mask-left">
                                    <span v-if="page.options.view"><i class="iconfont icon-attention"></i><em>{{item.file_view}}</em></span>
                                    <span v-if="page.options.type"><i class="iconfont icon-file1"></i><em>{{item.file_ext}}</em></span>
                                </div>
                                <div v-if="toolbar.view.model != 'small' && page.options.size" class="mask-right">
                                    <span>{{item.file_size}}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <span v-if="page.options.cover && item.file_status == 'lose'" class="status">
                        <Tooltips :content="t('home.lose')" placement="bottom">
                            <i class="iconfont icon-warn-fill"></i>
                        </Tooltips>
                    </span>
                    <p v-if="page.options.title" class="title">{{item.file_name}}</p>
                    <p :class="page.options.title? 'subtitle' : 'subtitle mt-s'">
                        <template v-if="page.options.artist">
                            <i class="iconfont icon-user mr-xxs"></i>
                            <span class="artist">
                                <template v-if="item.file_artist.status == 'success'">
                                    <template v-for="(artist,index) in item.file_artist.data">
                                        <em>{{artist.name}}</em>
                                        <template v-if="index + 1 != item.file_artist.total">
                                            <i class="ml-xs mr-xs">·</i>
                                        </template>
                                    </template>
                                </template>
                                <template v-else>{{t('home.unknown')}}</template>
                            </span>
                        </template>
                        <span v-if="toolbar.view.model != 'middle' && toolbar.view.model != 'small' && page.options.date" class="date">
                            <i v-if="page.options.artist" class="ml-xs mr-xs">·</i>
                            <em>{{item.file_date}}</em>
                        </span>
                    </p>
                </div>
            </div>

            <Empty :empty="empty" style="margin-top:20%"></Empty>
            <Pagination :pagination="pagination" @chagePage="onChangePage"></Pagination>
        </template>
    </div>

    <Statusbar :pagination="pagination" :load="load"></Statusbar>

    <!-- 浮动框 -->
    <Upload :show="page.upload" @hide="onHideUpload"></Upload>
    <Confirm :confirm="confirm" @cancel="onCancelConfirm" @confirm="onOperateConfirm"></Confirm>
</template>

<script lang="ts" setup>
import {useI18n} from 'vue-i18n';
import {useRouter,useRoute} from 'vue-router'
import {ref, reactive, watch, onMounted, onBeforeUnmount} from 'vue'

import {Base,Common,File,Time} from "@renderer/utils";
import {getFileList,getFileArtist} from "@renderer/api/file";
import {usePageStore} from '@renderer/stores/page'
import type {ConfirmInter,EmptyInter,PaginationInter} from "@renderer/types/common";
import type {CoverInter, PageInter,LoadInter,ToolbarInter} from "@renderer/types/views/home";

import Toolbar from "./components/toolbar.vue";
import Statusbar from "./components/statusbar.vue";

import Empty from "@renderer/components/Empty.vue";
import Confirm from "@renderer/components/Confirm.vue";
import Upload from "@renderer/components/Upload.vue";
import Pagination from "@renderer/components/Pagination.vue";
import Tooltips from "@renderer/components/Tooltips.vue";
import {Archive} from "libarchive.js/main";

const {t} = useI18n();
const route = useRoute();
const router = useRouter();
const pageStore = usePageStore();
const fs = require("fs") as typeof import("fs");
const scrollbar:any = ref(null);
const page:PageInter = reactive({
    init: false,
    upload: false,
    options: {},
    actions: {}
});
const load:LoadInter = reactive({
    page: '1',
    pageSize: pageStore.pageSize,
    list:[],
    q: '',
    name:'',
    taxonomy: '',
    order: {
        mode: pageStore.order.file.mode,
        sort: pageStore.order.file.sort
    }
})
const empty:EmptyInter = reactive({show: false});
const confirm:ConfirmInter = reactive({show: false, content: ''});
const pagination:PaginationInter = reactive({show: false, page: 1, totalPage: 1, total: 0})
const toolbar:ToolbarInter = reactive({view: { class: '', model: pageStore.toolbar.view }})

onMounted(() => {
    const {q, page, name, taxonomy} = route.query;

    load.page = page as string ?? '1';
    load.q = q as string ?? '';
    load.name = name as string ?? '';
    load.taxonomy = taxonomy as string ?? '';
    toolbar.view.class = getToolbarViewClass();

    init()
    scrollbar.value.addEventListener("scroll", onScroll)
})

onBeforeUnmount(() => {
    scrollbar.value.removeEventListener("scroll", onScroll);
});

const onScroll = function (event):void {
    const scrollTop = event.target.scrollTop;
    localStorage.setItem('cm_cache_home_scroll',scrollTop)
}

const init = function ():void {
    setArchive();
    setDisplayOptions();
    loadFileList();
}


const setArchive = function ():void {
    Common.setArchive(Archive);
}

const setDisplayOptions = function ():void {
    const {options} = File.getFileFilterOptions()
    page.options = options
}

const getParams = function ():object {
    const {page, pageSize, q, order, name, taxonomy } = load;
    const params = {
        page: page,
        pageSize: Number(pageSize),
        q: q,
        order: order,
        name:name,
        taxonomy: taxonomy,
    }
    return params
}

const loadFileList = async function ():Promise<boolean|void> {
    try {
        const params = getParams();
        const res = await getFileList(params)
        if(res.code != 200) {
            return false;
        }

        setEmpty(res.data);
        setFileList(res.data.list);
        setPagination(res.data)
    } catch (err) {
        Base.printErrorLog('getFileList',err);
    } finally {
        //page.init = true;
        setDelayDisplay()
    }
}

const setDelayDisplay = function ():boolean|void {
    // if(Number(load.page) != 1) {
    //     page.init = true;
    //     return false;
    // }

    setTimeout(()=> {
        page.init = true;
    },150)
}

const setCountUnit = function (value):string {
    return Common.setCountUnit(value);
}

const setEmpty = function ({total}):boolean|void {
    if(total != 0) {
        empty.show = false;
        return false;
    }

    let title = '', subtitle = '';
    if (!Base.isEmpty(load.q)) {
        title = t('empty.search.title', {name: load.q});
        subtitle = t('empty.search.subtitle');
        Common.showEmpty(empty,title, subtitle)
        return false;
    }

    title = t('empty.repositories.title');
    subtitle = t('empty.repositories.subtitle');
    Common.showEmpty(empty,title, subtitle)
}

const setFileList = async function (data):Promise<boolean|void> {
    if(Base.isEmpty(data)) {
        load.list = [];
        return false;
    }

    for(let i in data) {
        data[i].file_name = File.getFileAlias(data[i].file_name);
        data[i].file_cover = await getCover(data[i]);
        data[i].file_ext = getFileExt(data[i].file_path);
        data[i].file_view = setCountUnit(data[i].file_view);
        data[i].file_size = File.formatFileSize(data[i].file_size);
        data[i].file_date = Time.getTimeAgo(data[i].file_date,'YYYY-MM-DD','MM-DD');
        data[i].file_artist = await loadFileArtist(data[i].file_id);
        data[i].file_cover_options = await getImageSize(data[i].file_cover);
    }
    load.list = data;
}

const getImageSize = function(src:string):Promise<CoverInter> {
    const img = new Image()
    img.src = src;
    return new Promise<CoverInter>((resolve, reject) => {
        img.onload = function() {
            resolve(setImageCenter(img.width, img.height));
        }

        img.onerror = function() {
            reject({marginLeft: '0',marginTop: '0', width: '100%', height: 'auto'});
        }
    });
}

const setImageCenter = function(originalWidth:number,originalHeight:number):CoverInter {
    const model = toolbar.view.model;
    const data = {
        super: {width: 216, height:288},
        large: {width: 183, height:243},
        middle: {width: 155, height:204},
        small: {width: 130, height:171}
    }
    const {width,height} = data[model];
    const object = { marginLeft: '0', marginTop:　'0', width: '100%', height: 'auto' }
    if(originalWidth < width) {
        object.width = originalWidth+'px';
        object.marginLeft = ((width - originalWidth) / 2)+'px';

        if(originalHeight < height) {
            object.height = originalHeight+'px';
            object.marginTop = ((height - originalHeight) / 2)+'px';
        } else {
            object.height = height+'px';
        }
    } else {
        object.width = width+'px';
        const zoomHeight = originalHeight * (width / height)
        if(zoomHeight <　height) {
            object.height = zoomHeight.toString()+'px';
            object.marginTop = ((height - zoomHeight) / 2)+'px';
        } else {
            object.height = height+'px';
        }
    }

    return object;
}

const getFileExt = function(path):string {
    return File.getFileExt(path).toUpperCase();
}

const setPagination = function({page,totalPage,total}):void {
    pagination.show = true;
    pagination.page = page;
    pagination.totalPage = totalPage;
    pagination.total = total;
}

const getCover = async function({file_id, file_date}):Promise<any>{
    try {
        const path = File.getFileCoverById(file_id.toString(), file_date);
        if (File.isExists(path) == false) {
            return Common.getDefaultImage();
        }

        const fileBuffer = fs.readFileSync(path);
        return await File.getBase64Image(fileBuffer);
    } catch (err) {
        Base.printErrorLog('loadCover readFileSync',err)
    }
}

const loadFileArtist = async function(object_id):Promise<Record<string, any>> {
    try {
        const params = {object_id: object_id}
        const res = await getFileArtist(params);

        if(res.code != 200 || Base.isEmpty(res.data)) {
            return { status: 'fail', data: [], total: 0};
        }

        return { status: 'success', data: res.data, total: Base.getDataLength(res.data)};
    } catch (err) {
        Base.printErrorLog('getFileArtist',err)
        return  { status: 'fail', data: [], total: 0}
    }
}

const setDefaultImage = function(event):void{
    const {currentTarget: {dataset: {index}}} = event
    load.list[index].file_cover = Common.getDefaultImage();
}

const getToolbarViewClass = function():string {
    const model = pageStore.toolbar.view;
    return `file-main__${model}`;
}

const onFilefilter = function({change}):boolean|void {
    if(change == false) {
        return false;
    }

    const {options} = File.getFileFilterOptions();
    page.options = options;

    loadFileList();
}

const onSwitchOrder = function({mode, sort}):void {
    load.order = { mode: mode, sort: sort}
    loadFileList();
}

const onChangePage = function({value}):void {
    const {q, name, taxonomy } = load;
    const object = {
        path: '/',
        query:  {
            page: value,
            pageSize: load.pageSize,
            q: q,
            name:name,
            taxonomy: taxonomy,
        }
    }
    localStorage.setItem('cm_cache_home_scroll','0');
    router.push(object)
}

const onRefresh = function():void {
    page.init = false;
    init();
}

const onRedirect = function(event):void {
    const {currentTarget: {dataset: {id}}} = event
    const object = {
        path: '/reader',
        query: {
            id: id
        }
    }

    router.push(object)
}

const onUpload = function(show:boolean=true):void {
    page.upload = show
}

const onHideUpload = function({refresh}):boolean|void {
    if(refresh == false) {
        page.upload = false;
        return false;
    }

    page.init = false;
    page.upload = false;
    init();
}

const onCancelConfirm = function():void {
    Common.cancelConfirm(confirm);
}

const onOperateConfirm = function():void {
    Common.operateConfirm(confirm, page);
}

watch(() => page.init,(value) => {
    if(value != true) {
        return false
    }

    const scrollBar = document.getElementById('scrollbar')
    const scrollTop = localStorage.getItem('cm_cache_home_scroll') || '0';
    if(scrollBar) {
        scrollBar.scrollTop = Number(scrollTop);
    }
})


const resetPreviewImageSize = async function():Promise<boolean|void> {
    if(Base.isEmpty(load.list)) {
        return false;
    }
    for (let i in load.list) {
        load.list[i].file_cover_options = await getImageSize(load.list[i].file_cover);
    }
}

watch(() => pageStore.pageSize,(value) => {
    load.pageSize = value;
    loadFileList();
})

watch(() => pageStore.toolbar.view, (value) => {
    toolbar.view.model = value;
    toolbar.view.class = getToolbarViewClass();

    resetPreviewImageSize();
})
</script>
<style src="./index.scss" lang="scss" scoped></style>
