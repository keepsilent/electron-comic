<template>
    <Toolbar @upload="onUpload" @refresh="onRefresh"/>
    <div class="taxonomy-wrap scrollbar">
        <!-- Menu -->
        <div v-if="empty.show != true" class="taxonomy-header">
            <div class="menu">
                <span v-for="(item,index) in menu.data" :key="index" :class="{'active':menu.current == item.value}"  @click="onSwitchSort(item.value)">{{item.name}}</span>
            </div>
            <div v-if="menu.current == 'group'" class="sort" >
                <span v-for="(item,index) in menu.sort" :key="index" :class="{'selected':item.selected}" @click="onSwitchGroup(item.value)">{{item.name}}</span>
            </div>
        </div>

        <!-- Main -->
        <div v-if="empty.show != true" class="taxonomy-main">
            <template v-if="menu.current == 'group'">
                <section v-for="(items,indexs) in load.list" :key="indexs" :class="{active: menu.group == items.name}">
                    <h3>{{items.name}}</h3>
                    <span v-for="(item, index) in items.data" :key="index" class="item" :data-name="item.name" @click="onSearchTaxonomy">
                        <em>{{item.name}}</em>
                        <i>{{Common.setCountUnit(item.count)}}</i>
                    </span>
                </section>
            </template>

            <template v-if="menu.current == 'popular'">
                <span v-for="(item,index) in load.popular" :key="index" class="item" :data-name="item.name" @click="onSearchTaxonomy">
                    <em>{{item.name}}</em>
                    <i>{{Common.setCountUnit(item.count)}}</i>
                </span>
            </template>
        </div>

        <Statusbar :pagination="pagination" :group="menu.group"></Statusbar>

        <Empty :empty="empty" style="margin-top:20%"></Empty>
        <Upload :show="page.upload" @hide="onUpload(false)"></Upload>
        <Pagination :pagination="pagination" @chagePage="onChangePage"></Pagination>
    </div>
</template>

<script lang="ts" setup>
import {useI18n} from 'vue-i18n';
import {reactive,onMounted} from 'vue'
import {useRouter,useRoute} from 'vue-router'
import {Base, Common} from "@renderer/utils";
import type {ConfirmInter,EmptyInter,PaginationInter} from "@renderer/types/common";
import type {PageInter,LoadInter,MenuInter,SortInter,TermInter,ParamsInter} from "@renderer/types/views/taxonomy";
import {getTermList,getTermGroupFristRcord,getTermGroupFristRcordPosition} from "@renderer/api/terms";
import {throttle} from "@renderer/utils/throttle";
import {usePageStore} from '@renderer/stores/page'

import Toolbar from "./components/toolbar.vue";
import Statusbar from "./components/statusbar.vue";

import Empty from "@renderer/components/Empty.vue";
import Upload from "@renderer/components/Upload.vue";
import Pagination from "@renderer/components/Pagination.vue";

const {t} = useI18n();
const route = useRoute();
const router = useRouter();
const pageStore = usePageStore();
const page:PageInter = reactive({
    init:false,
    upload: false,
    actions: {},
})
const menu:MenuInter = reactive({
    current: 'group',
    group: '',
    sort: [],
    data: [
        {name: 'A-Z',value: 'group'},
        {name:'Popular',value: 'popular'}
    ]
})
const load:LoadInter = reactive({ page: '1', pageSize: 100, taxonomy: '', sort: '',list:[], popular:[]})
const empty:EmptyInter = reactive({show: false});
const confirm:ConfirmInter = reactive({show: false, content: ''});
const pagination:PaginationInter = reactive({show: false, page: 1, totalPage: 1, total: 0, source: ''})

onMounted(()=> {
    init();
})

const init = function():void {
    const {type, page: current, group, sort} = route.query;

    menu.group = group as string ?? '';
    menu.current = sort as string ?? 'group';

    load.page = current as string ?? '1';
    load.taxonomy = getTaxonomy(type as string ?? '');

    pagination.source = t('aside.menu.'+type) as string ?? '';
    loadTermList();
}

const loadTermList = async function():Promise<boolean|void> {
    try {
        const params = getParams()
        const res = await getTermList(params);
        if(res.code != 200) {
            return false;
        }

        let {list} = res.data;
        load.popular = list ?? [];

        setEmpty(res.data);
        setDataGroup(list);
        setPagination(res.data)
    } catch (err) {
        page.init = true;
        pagination.show = false;
        Base.printErrorLog('getTermList',err)
    }
}

const loadTermGroupFristRcordPosition = async function(name, group):Promise<boolean|void> {
    try {
        const {taxonomy} = load;
        const params = {taxonomy: taxonomy, name: name}
        const res = await getTermGroupFristRcordPosition(params)
        if(res.code != 200) {
            return false;
        }
        if(Base.isEmpty(res.data)) {
            return false;
        }

        const {total} = res.data[0];
        const object = {
            path: `/taxonomy`,
            query:  {
                type: getTaxonomys(load.taxonomy),
                page: Math.ceil(total / load.pageSize) || 1,
                group: String.fromCharCode(group),
                sort: menu.current
            }
        }
        router.push(object)
    } catch (err) {
        Base.printErrorLog('getTermGroupFristRcord',err);
    }
}

const setDataGroup = function(data:any[]):void {
    const group = {};
    for(let i in data) {
        let {term_group} = data[i];
        if(!Base.inArray(group,term_group,term_group)) {
            group[term_group] = term_group
        }
    }

    menu.sort = getSortData(group);
    load.list = getGroupData(group, data);
}

const getSortData = function(group:object):SortInter[] {
    const data:any[] = createSortDefaultData();
    for(let i in group) {
        for(let j in data) {
            let {name} = data[j]
            if(String.fromCharCode(group[i]) == name) {
                data[j].selected = true;
            }
        }
    }

    return data
}

const getGroupData = function(group:object, data:any[]):{name:string,data:TermInter[]}[] {
    const arr:{name:string,data:TermInter[]}[] = []
    for(let i in group) {
        let tmp:any[] = [];
        for(let j in data) {
            let {term_group} = data[j]
            if(group[i] == term_group) {
                tmp.push(data[j]);
            }
        }
        arr.push({name: String.fromCharCode(group[i]),data: tmp});
    }

    return arr;
}

const getParams = function():ParamsInter {
    const options = {
        page: load.page,
        pageSize: load.pageSize,
        taxonomy: load.taxonomy,
        sort: menu.current
    }

    return options
}

const getTaxonomy = function(key:string = ''):string {
    const options = {
        tags: 'tag',
        artists: 'artist',
        categories: 'category',
        parodies: 'parody',
        groups: 'group'
    }

    return options[key];
}

const getTaxonomys = function(key:string='tags'):string {
    const options = {
        tag: 'tags',
        artist: 'artists',
        category: 'categories',
        parody: 'parodies',
        group: 'groups'
    }

    return options[key];
}

const createSortDefaultData = function():{name:string,value:number,selected:boolean}[] {
    const data = [{name: '#',value: 35, selected: false}]
    for(let i = 65; i <= 90; i++) {
        data.push({name: String.fromCharCode(i), value: i, selected: false})
    }

    return data;
}

const setPagination = function({page,totalPage,total}):void {
    pagination.show = true;
    pagination.page = page;
    pagination.totalPage = totalPage;
    pagination.total = total;
}

const setEmpty = function({total}):boolean|void {
    if(total !== 0 ) {
        return false;
    }

    const {taxonomy} = load;
    const options = {
        tag: 'icon-tag',
        artist: 'icon-artist',
        category: 'icon-we',
        parody: 'icon-parody',
        group: 'icon-group'
    }

    const title = t('empty.repositories.title');
    const subtitle = t('empty.repositories.subtitle');
    const icon = options[taxonomy];
    Common.showEmpty(empty, title, subtitle, icon)
}

const onSwitchSort = throttle((type)=>{
    const object = {
        path: `/taxonomy`,
        query:  {
            type: getTaxonomys(load.taxonomy),
            page: '1',
            sort: type
        }
    }
    router.push(object)
})

const onSwitchGroup = throttle(async (group)=>{
    try {
        const {taxonomy} = load;
        const params = {taxonomy: taxonomy, group: group}
        const res = await getTermGroupFristRcord(params)
        if(res.code != 200) {
            return false;
        }

        if(Base.isEmpty(res.data)) {
            return false;
        }
        const {name} = res.data[0];
        await loadTermGroupFristRcordPosition(name,group);
    } catch (err) {
        Base.printErrorLog('getTermGroupFristRcord',err);
    }
})

const onChangePage = function({value}):void {
    const object = {
        path: `/taxonomy`,
        query:  {
            type: getTaxonomys(load.taxonomy),
            page: value,
            sort: menu.current
        }
    }

    router.push(object)
}

const onSearchTaxonomy = function(event):void {
    const {currentTarget: {dataset: {name}}} = event
    const object = {
        path: `/`,
        query:  {
            name: name,
            taxonomy: load.taxonomy
        }
    }

    router.push(object)
}

const onUpload = function (show:boolean=true):void {
    page.upload = show
}

const onRefresh = function():void {
    page.init = false;
    load.page = '1';
    loadTermList();
}

const onCancelConfirm = function():void {
    Common.cancelConfirm(confirm);
}

const onOperateConfirm = function():void {
    Common.operateConfirm(confirm, page);
}
</script>

<style src="./index.scss" lang="scss" scoped></style>
