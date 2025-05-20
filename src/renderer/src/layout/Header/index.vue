<template>
    <div class="header">
        <div :class="['header-inner',page.layout]">
            <div class="nav ml-m">
                <span class="iconfont icon-return" :title="$t('button.return')" @click="onGoBack"></span>
                <div class="search ml-m">
                    <i class="iconfont icon-search"></i>
                    <input type="text" v-model="page.keyword" :placeholder="$t('search.placeholder')" @keydown="onSearch" autocomplete="off">
                    <i v-if="page.keyword" class="iconfont icon-close ml-10" @click="onClear"></i>
                </div>
            </div>

            <!-- 头部菜单 -->
            <div class="menu tc">
                <div class="left">
                    <span class="iconfont icon-setting" :title="$t('button.setting')" @click="onShowSetting">
                        <i class="dot"></i>
                    </span>
                </div>

                <div class="right">
                    <span class="iconfont icon-minimize" :title="$t('button.minimize')" data-key="minimize" @click="onIPC"></span>
                    <span :class="page.maximize.value == 'maximize' ? ['iconfont', 'icon-maximize'] : ['iconfont', 'icon-restore']" :title="page.maximize.name" :data-key="page.maximize.value" @click="onIPC"></span>
                    <span class="iconfont icon-close" :title="$t('button.close')" data-key="close" @click="onIPC"></span>
                </div>
            </div>
        </div>
    </div>
    <Setting :show="page.setting" @hide="onHideSetting"></Setting>
</template>

<script setup lang="ts">
import {useI18n} from "vue-i18n";
import {ref, reactive, watch} from "vue";
import {useRouter,useRoute} from 'vue-router'
import {Base,Common} from "@renderer/utils";
import {usePageStore} from '@renderer/stores/page'

import Setting from "@renderer/components/Setting.vue";
import {PageInter} from "../../utils/types";

const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const pageStore = usePageStore();

const page = reactive({
    keyword: '',
    setting: false,
    maximize: { name: 'Maximize', value: 'maximize'},
    layout: Common.getLayoutFold(pageStore.layout,'header-inner'),
})

const onSearch = function({keyCode}):boolean|void {
    if(keyCode !== 13) {
        return false;
    }

    interface ObjectInter {
        path: string,
        query: {
            q?:string
        }
    }
    const {keyword} = page;
    const object:ObjectInter = {
        path: '/',
        query:{}
    }

    if(!Base.isEmpty(keyword)) {
        object.query.q = keyword
    }

    router.push(object)
}

const onShowSetting = function ():void {
    page.setting = true;
    pageStore.pop.setting = true;
}

const onHideSetting = function ():void {
    page.setting = false;
    pageStore.pop.setting = false;
}

const onGoBack = function ():void {
    router.back();
}

const onClear = function():void {
    page.keyword = '';


    if(route.path == '/') {
        router.push({path: '/'})
    }
}

const onIPC = function(event): void {
    const {currentTarget: {dataset: {key}}} = event
    switch (key) {
        case 'restore':
            page.maximize.name = t('button.maximize');
            page.maximize.value = 'maximize';
            window.electron.ipcRenderer.send(key);
            break
        case 'maximize':
            page.maximize.name = t('button.restore');
            page.maximize.value = 'restore';
            window.electron.ipcRenderer.send(key);
            break
        default:
            window.electron.ipcRenderer.send(key);
    }
}

watch(() => pageStore.layout,(value)=>{
    page.layout = Common.getLayoutFold(value,'header-inner');
})

watch(() => pageStore.pop.setting,(value) => {
    page.setting = value;
})

window.electron.ipcRenderer.on('maximize',(event,args)=> {
    if(args == true) {
        page.maximize.name = t('button.restore');
        page.maximize.value = 'restore';
        return false
    }

    page.maximize.name = t('button.maximize');
    page.maximize.value = 'maximize';
})

</script>
<style src="./index.scss" lang="scss" scoped></style>
