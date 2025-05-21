<template>
    <Toolbar @upload="onShowUpload"/>
    <div class="taxonomy-wrap scrollbar">
        <div v-if="empty.show != true" class="taxonomy-header">
            <div class="menu">
                <span v-for="(item,index) in page.menu" :key="index" :class="{'active':page.current == item.value}"  @click="onSwitchSort(item.value)">{{item.name}}</span>
            </div>
            <div v-if="page.current == 'group'" class="sort" >
                <span v-for="(item,index) in page.sort" :key="index" :class="{'selected':item.selected}" @click="onSwitchGroup(item.value)">{{item.name}}</span>
            </div>
        </div>
        <div v-if="empty.show != true"  class="taxonomy-main">
            <template v-if="page.current == 'group'">
                <section v-for="(items,indexs) in page.data" :key="indexs" :class="{active: page.group == items.name}">
                    <h3>{{items.name}}</h3>
                    <span v-for="(item, index) in items.data" :key="index" class="item" :data-name="item.name" @click="onSearchTaxonomy">
                        <em>{{item.name}}</em>
                        <i>{{setCountUnit(item.count)}}</i>
                    </span>
                </section>
            </template>

            <template v-if="page.current == 'popular'">
                <span v-for="(item,index) in page.popular" :key="index" class="item" :data-name="item.name" @click="onSearchTaxonomy">
                    <em>{{item.name}}</em>
                    <i>{{setCountUnit(item.count)}}</i>
                </span>
            </template>
        </div>
        <Statusbar :pagination="pagination" :group="page.group"></Statusbar>

        <Empty :empty="empty" style="margin-top:20%"></Empty>
        <Upload :show="page.upload" @hide="onHideUpload"></Upload>
        <Pagination :pagination="pagination" @chagePage="onChangePage"></Pagination>
    </div>
</template>

<script lang="ts" setup>
import {useI18n} from 'vue-i18n';
import {useRouter,useRoute} from 'vue-router'
import {ref, reactive, watch, onMounted} from 'vue'
import type { ConfirmInter, EmptyInter} from "@renderer/utils/types";
import {Base, Common, File} from "@renderer/utils";
import {getTermList, getTermGroupFristRcord, getTermGroupFristRcordPosition} from "@renderer/api/terms";
import {debounce, throttle} from "@renderer/utils/throttle";

import {usePageStore} from '@renderer/stores/page'
import Toolbar from "./components/toolbar.vue";
import Statusbar from "./components/statusbar.vue";
import Empty from "@renderer/components/Empty.vue";
import Upload from "@renderer/components/Upload.vue";
import Pagination from "@renderer/components/Pagination.vue";

interface PageInter {
    current:string,
    menu:{name:string,value:string}[],
    data:any[],
    popular:any[],
    upload:boolean,
    group:string,
    sort:any[]
}

interface LoadInter {
    page:number,
    pageSize:number,
    taxonomy:string,
    sort:string
}

const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const pageStore = usePageStore();
const load:LoadInter = reactive({page: 1, pageSize: 100, taxonomy: '',sort: ''})
const pagination = reactive({show: false, page: 1, totalPage: 1, total: 0, source: ''})
const empty:EmptyInter = reactive({show: false});
const page:PageInter = reactive({
    current: 'group',
    menu: [
        {name: 'A-Z',value: 'group'},
        {name:'Popular',value: 'popular'}
    ],
    data:[],
    popular:[],

    upload: false,
    group: '',
    sort: []
})

onMounted(()=> {
    init();
})

const init = function () {
    const {type, page: current, group, sort} = route.query;
    console.log('route.query',route.query);

    page.group = group as string ?? '';
    page.current = sort as string ?? 'group';

    load.page = Number(current as string) ?? 1;
    load.taxonomy = getTaxonomy(type as string ?? '');

    pagination.source = t('aside.menu.'+type);
    loadTermList();
}

const setCountUnit = function (value) {
    return Common.setCountUnit(value);
}

const loadTermList = async function () {
    try {
        const params = getParams()
        const res = await getTermList(params);
        if(res.code != 200) {
            return false;
        }

        let {list,total} = res.data;
        page.popular = list ?? [];
        //pageStore.num = total ?? 0;

        setEmpty(res.data);
        setDataGroup(list);
        setPagination(res.data)
    } catch (err) {
        pagination.show = false;
        Base.printErrorLog('getTermList',err)
    }
}

const setEmpty = function ({total}):boolean|void {
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

    let title = t('empty.repositories.title');
    let subtitle = t('empty.repositories.subtitle');
    let icon = options[taxonomy];
    Common.showEmpty(empty, title, subtitle, icon)
}

const setDataGroup = function (data:any[]):void {
    const group = {};
    for(let i in data) {
        let {term_group} = data[i];
        if(!Base.inArray(group,term_group,term_group)) {
            group[term_group] = term_group
        }
    }

    page.sort = getSortData(group);
    page.data = getGroupData(group, data);
}

const getSortData = function(group:object):object[] {
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

const getGroupData = function(group:object, data:any[]):{name:string,data:object[]}[] {
    const arr:{name:string,data:object[]}[] = []
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

const getParams = function ():LoadInter {
    const options = {
        page: load.page,
        pageSize: load.pageSize,
        taxonomy: load.taxonomy,
        sort: page.current
    }

    return options
}

const getTaxonomy = function (key:string):string {
    const options = {
        tags: 'tag',
        artists: 'artist',
        categories: 'category',
        parodies: 'parody',
        groups: 'group'
    }

    return options[key];
}

const getTaxonomys = function (key:string):string {
    const options = {
        tag: 'tags',
        artist: 'artists',
        category: 'categories',
        parody: 'parodies',
        group: 'groups'
    }

    return options[key];
}

const setPagination = function ({page,totalPage,total}):void {
    pagination.show = true;
    pagination.page = page;
    pagination.totalPage = totalPage;
    pagination.total = total;
}

const createSortDefaultData = function ():{name:string,value:number,selected:boolean}[] {
    const data = [{name: '#',value: 35, selected: false}]
    for(let i = 65; i <= 90; i++) {
        data.push({name: String.fromCharCode(i), value: i, selected: false})
    }

    return data;
}

const onSwitchSort = throttle((type)=>{
    const object = {
        path: `/taxonomy`,
        query:  {
            type: getTaxonomys(load.taxonomy),
            page: 1,
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
            return  false;
        }
        const {name} = res.data[0];
        await loadTermGroupFristRcordPosition(name,group);
    } catch (err) {
        Base.printErrorLog('getTermGroupFristRcord',err);
    }
})

const loadTermGroupFristRcordPosition = async function (name, group) {
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
                sort: page.current
            }
        }
        router.push(object)

    } catch (err) {
        Base.printErrorLog('getTermGroupFristRcord',err);
    }
}

const onChangePage = function ({value}):void {
    const object = {
        path: `/taxonomy`,
        query:  {
            type: getTaxonomys(load.taxonomy),
            page: value,
            sort: page.current
        }
    }

    router.push(object)
}

const onSearchTaxonomy = function (event):void {
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

const onShowUpload = function () {
    page.upload = true
}

const onHideUpload = function () {
    page.upload = false;
}
</script>

<style src="./index.scss" lang="scss" scoped></style>
