<template>
    <Toolbar :file="toolbar.file" @order="onSwitchOrder" @upload="onShowUpload" @filter="onFilefilter" @refresh="onRefresh"/>
    <div ref="scrollbar" class="file-wrap scrollbar">

        <!-- Skeleton -->
        <div v-if="page.init == false" :class="['file-main','file-main__skeleton',toolbar.view.class]">
            <div v-for="(item,index) in parseInt(load.pageSize)" :key="index" class="file-item">
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
                                        <template v-if="index + 1 != (item.file_artist.data).length">
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

    <Loading :show="page.loading"></Loading>
    <Upload :show="page.upload" @hide="onHideUpload"></Upload>
    <Confirm :confirm="confirm" @cancel="onCancelConfirm" @confirm="onOperateConfirm"></Confirm>
</template>

<script lang="ts" setup>
import {useI18n} from 'vue-i18n';
import {useRouter,useRoute} from 'vue-router'
import {ref, reactive, watch, onMounted} from 'vue'

import type { ConfirmInter, EmptyInter} from "@renderer/utils/types";
import {Base, Common, File, Time} from "@renderer/utils";
import {getFileList, getFileArtist} from "@renderer/api/file";
import {usePageStore} from '@renderer/stores/page'

import Toolbar from "./components/toolbar.vue";
import Statusbar from "./components/statusbar.vue";
import Loading from "@renderer/components/Loading.vue";
import Empty from "@renderer/components/Empty.vue";
import Confirm from "@renderer/components/Confirm.vue";
import Upload from "@renderer/components/Upload.vue";
import Pagination from "@renderer/components/Pagination.vue";
import Tooltips from "@renderer/components/Tooltips.vue";
import {Archive} from "libarchive.js/main";

interface PageInter {
    init: boolean,
    loading: boolean,
    upload: boolean
    options: object,
    actions: object
}


const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const pageStore = usePageStore();
const fs = require("fs") as typeof import("fs");
const page:PageInter = reactive({init: false, loading: false, upload: false, options: {}, actions: {}});
const load = reactive({
    page: 1,
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
const pagination = reactive({show: false, page: 1, totalPage: 1, total: 0})

const empty:EmptyInter = reactive({});
const confirm:ConfirmInter = reactive({});
const scrollbar = ref(null);
const toolbar = reactive({
    file: {},
    view: { class: '', model: pageStore.toolbar.view }
})

onMounted(() => {
    const {q, page, name, taxonomy} = route.query;
    //console.log('route.query',route.query);

    load.page = page ?? 1;
    load.q = q ?? '';
    load.name = name ?? '';
    load.taxonomy = taxonomy ?? '';
    toolbar.view.class = getToolbarViewClass();

    init()
})

const init = function () {
    const {options} = File.getFileFilterOptions()
    setArchive();
    loadFileList();

    page.options = options

    console.log('page.options',page.options);
}

const setArchive = function () {
    Common.setArchive(Archive);
}

const getParams = function () {
    const params = {
        page: load.page,
        pageSize: load.pageSize
    }

    if(!Base.isEmpty(load.q )) {
        params.q = load.q
    }

    if(!Base.isEmpty(load.order )) {
        params.order = load.order
    }

    if(!Base.isEmpty(load.name) && !Base.isEmpty(load.taxonomy)) {
        params.name = load.name
        params.taxonomy = load.taxonomy
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

const setDelayDisplay = function () {
    if(load.page != 1) {
        page.init = true;
        return false;
    }

    setTimeout(()=> {
        page.init = true;
    },150)
}

const setCountUnit = function (value) {
    return Common.setCountUnit(value);
}

const setEmpty = function ({total}):boolean {
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

const setFileList = async function (data:object[]) {
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
        data[i].file_date = getTimeAgo(data[i].file_date);
        data[i].file_artist = await loadFileArtist(data[i].file_id);
    }
    load.list = data;
}

const getFileExt = function (path) {
    return File.getFileExt(path).toUpperCase();
}

const getTimeAgo = function (date:number):string {   //dateTimeStamp是一个时间毫秒，注意时间戳是秒的形式，在这个毫秒的基础上除以1000，就是十位数的时间戳。13位数的都是时间毫秒。
    if (Base.isEmpty(date)) {
        return '';
    }

    const timeStamp = Time.dateToTimestamp(date);
    const now = new Date().getTime();   //获取当前时间毫秒
    const value = now - parseInt(timeStamp); //时间差

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

    if(Time.formatDate(timeStamp, 'YYYY') == new Date().getFullYear()) {
        return Time.formatDate(timeStamp, 'MM-DD');
    } else {
        return Time.formatDate(timeStamp, 'YYYY-MM-DD');
    }
}

const setPagination = function ({page,totalPage,total}):void {
    pagination.show = true;
    pagination.page = page;
    pagination.totalPage = totalPage;
    pagination.total = total;
}

const getCover = async function ({file_id}):Promise<string> {
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

const loadFileArtist = async function (object_id) {
    try {
        const params = {object_id: object_id}
        const res = await getFileArtist(params);

        console.log('res',res);
        if(res.code != 200 || Base.isEmpty(res.data)) {
            return { status: 'fail', data: []};
        }

        return { status: 'success', data: res.data};
    } catch (err) {
        Base.printErrorLog('getFileArtist',err)
        return  { status: 'fail', data: []}
    }
}

const onRedirect = function ({currentTarget: {dataset: {id}}}):void {
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

const setDefaultImage = function ({currentTarget: {dataset: {index}}}) :void{
    load.list[index].cover = Common.getDefaultImage();
}

const onChangePage = function ({value}):void {
    const object = {
        path: '/',
        query:  {
            page: value,
            pageSize: load.pageSize
        }
    }

    if(!Base.isEmpty(load.q)) {
        object.query.q = load.q;
    }

    if(!Base.isEmpty(load.name) && !Base.isEmpty(load.taxonomy)) {
        object.query.name = load.name;
        object.query.taxonomy = load.taxonomy;
    }

    router.push(object)
}

const onSwitchOrder = function ({mode, sort}):void {
    load.order = { mode: mode, sort: sort}
    loadFileList();
}


const onShowUpload = function ():void {
    page.upload = true
}

const onHideUpload = function ({refresh}):boolean {
    if(refresh == false) {
        page.upload = false;
        return false;
    }

    page.init = false;
    page.upload = false;
    init();
}

const onRefresh = function () {
    page.init = false;
    init();
}

const getToolbarViewClass = function () {
    const model = pageStore.toolbar.view;
    return `file-main__${model}`;
}

const onFilefilter = function ({change}) {
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
