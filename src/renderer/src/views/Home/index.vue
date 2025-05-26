<template>
    <Toolbar @order="onSwitchOrder" @upload="onShowUpload" @filter="onFilefilter" @refresh="onRefresh"/>
    <div ref="scrollbar" class="file-wrap scrollbar">

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
                        <img :src="item.file_cover" :data-index="index" width="216" height="287" @error="setDefaultImage">
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
import {ref,reactive,watch,onMounted} from 'vue'

import {Base,Common,File,Time} from "@renderer/utils";
import {getFileList,getFileArtist} from "@renderer/api/file";
import {usePageStore} from '@renderer/stores/page'
import type {ConfirmInter,EmptyInter,PaginationInter} from "@renderer/types/common";
import type {PageInter,LoadInter,ToolbarInter} from "@renderer/types/views/home";

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
const scrollbar = ref(null);
const page:PageInter = reactive({
    init: false,
    upload: false,
    options: {},
    actions: {}}
);
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
})

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
        page.init = true;
        setDelayDisplay()
    }
}

const setDelayDisplay = function ():boolean|void {
    if(Number(load.page) != 1) {
        page.init = true;
        return false;
    }

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
    }
    load.list = data;
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

const getCover = async function({file_id}):Promise<any>{
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

const onCancelConfirm = function():void {
    Common.cancelConfirm(confirm);
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

const onOperateConfirm = function():void {
    Common.operateConfirm(confirm, page);
}

const setDefaultImage = function(event):void{
    const {currentTarget: {dataset: {index}}} = event
    load.list[index].file_cover = Common.getDefaultImage();
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

    router.push(object)
}

const onSwitchOrder = function({mode, sort}):void {
    load.order = { mode: mode, sort: sort}
    loadFileList();
}


const onShowUpload = function():void {
    page.upload = true
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

const onRefresh = function():void {
    page.init = false;
    init();
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

watch(() => pageStore.pageSize,(value) => {
    load.pageSize = value;
    loadFileList();
})

watch(() => pageStore.toolbar.view,(value) => {
    toolbar.view.model = value;
    toolbar.view.class = getToolbarViewClass();
})
</script>
<style src="./index.scss" lang="scss" scoped></style>
