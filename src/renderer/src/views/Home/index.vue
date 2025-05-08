<template>
    <Toolbar ref="toolbar"  :file="file" @sort="onChangeSort"/>
    <div ref="scrollbar" class="file-wrap scrollbar">
        <div v-if="empty.show != true" class="file-main">
            <div v-for="(item,index) in load.list" :key="index" class="file-item" :data-id="item.file_id" @click="onRedirect">
                <div class="cover">
                    <img :src="item.file_cover" :data-index="index" width="216" height="287" @error="setDefaultImage">
                </div>
                <p class="title">{{item.file_name}}</p>
            </div>
        </div>

        <Empty :empty="empty" style="margin-top:20%"></Empty>
        <Pagination :pagination="pagination" @chagePage="onChangePage"></Pagination>
    </div>

    <Statusbar :pagination="pagination" :load="load"></Statusbar>

    <Loading :show="page.loading"></Loading>
    <Confirm :confirm="confirm" @cancel="onCancelConfirm" @confirm="onOperateConfirm"></Confirm>
</template>

<script lang="ts" setup>
import {useI18n} from 'vue-i18n';
import {useRouter,useRoute} from 'vue-router'
import {ref, reactive, watch, onMounted} from 'vue'

import type {PageInter, ConfirmInter, EmptyInter} from "@renderer/utils/types";
import {Base, Common, File, Time} from "@renderer/utils";
import {getFileList, isFileExist, addFile} from "@renderer/api/file";
import {getNhentaiList} from "@renderer/api/nhentai";
import {usePageStore} from '@renderer/stores/page'
import Pagination from "@renderer/components/Pagination.vue";

// import file from "../../utils/file";

import Toolbar from "./components/toolbar.vue";
import Statusbar from "./components/statusbar.vue";
import Loading from "@renderer/components/Loading.vue";
import Empty from "@renderer/components/Empty.vue";
import Confirm from "@renderer/components/Confirm.vue";

import {Archive} from 'libarchive.js/main.js';

const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const pageStore = usePageStore();
const fs = require("fs") as typeof import("fs");
const page:PageInter = reactive({init: false, loading: false, actions: {}});
const empty:EmptyInter = reactive({});
const confirm:ConfirmInter = reactive({});
const upload:string = ref(null);
const scrollbar = ref(null);
const toolbar = ref(null);
const load = reactive({page: 1, pageSize: pageStore.pageSize, list:[], q: '',name:'',type: '',order: localStorage.getItem('cm_setting_sort_type') || '',sort: localStorage.getItem('cm_setting_sort_method') || ''})
const pagination = reactive({show: false, page: 1, totalPage: 1, total: 0})
const file = reactive({});

onMounted(() => {
    const {q, page, name, type,order,sort} = route.query;
    //console.log('route.query',route.query);

    load.page = page ?? 1;
    load.q = q ?? '';
    load.name = name ?? '';
    load.type = type ?? '';
    load.order = order ?? '';
    load.sort = sort ?? '';

    pageStore.setStatusPath(`${t('status.source')}: ${t('aside.menu.home')}`);
    setTimeout(() => {
        scrollbar.value.addEventListener("click", onContent);
    },4)

    init()
})

const init = function () {
    setArchive();
    loadFileList();
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
    if(!Base.isEmpty(load.sort )) {
        params.sort = load.sort
    }

    if(!Base.isEmpty(load.name) && !Base.isEmpty(load.type)) {
        params.name = load.name
        params.type = load.type
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
        pageStore.num = res.data.total;
        setEmpty(res.data);
        setFileList(res.data.list);
        setPagination(res.data)
    } catch (err) {
        Base.printErrorLog('getFileList',err);
    }
}

const setEmpty = function ({total}):boolean {
    if(total != 0) {
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
        data[i].file_size = File.formatFileSize(data[i].file_size);
        data[i].file_date = Time.formatDate(data[i].file_date,'YYYY/MM/DD');
    }
    load.list = data;
}

const setPagination = function ({page,totalPage,total}):void {
    pagination.show = true;
    pagination.page = page;
    pagination.totalPage = totalPage;
    pagination.total = total;
}


const getCover = async function ({file_id}):void {
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

const onCancelConfirm = function () {
    Common.cancelConfirm(confirm);
}

const onRedirect = function ({currentTarget: {dataset: {id}}}) {
    const object = {
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
            page: value,
            pageSize: load.pageSize
        }
    }

    if(!Base.isEmpty(load.q)) {
        object.query.q = load.q;
    }

    if(!Base.isEmpty(load.sort)) {
        object.query.sort = load.sort;
    }

    if(!Base.isEmpty(load.order)) {
        object.query.order = load.order;
    }

    if(!Base.isEmpty(load.name) && !Base.isEmpty(load.type)) {
        object.query.name = load.name;
        object.query.type = load.type;
    }

    router.push(object)
}

const onChangeSort = function ({order,sort}) {

    console.log('sort',order,sort)
    load.order = order;
    load.sort = sort;
    loadFileList();
}

const onContent = function () {
    toolbar.value.onHideOrderMenu();
}

watch(() => pageStore.pageSize,(value) => {
    load.pageSize = value;
    loadFileList();
})

</script>

<style src="./index.scss" lang="scss" scoped></style>
