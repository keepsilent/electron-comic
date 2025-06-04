<template>
    <div class="header">
        <div :class="['header-inner',page.layout.fold]">
            <!-- Search -->
            <div class="nav ml-m">
                <span class="iconfont icon-return" :title="$t('button.return')" @click="onGoBack"></span>
                <div class="search ml-m">
                    <i class="iconfont icon-search"></i>
                    <input type="text" v-model="page.keyword" :placeholder="$t('search.placeholder')" @keydown="onSearch" autocomplete="off">
                    <i v-if="page.keyword" class="iconfont icon-close ml-10" @click="onClear"></i>
                </div>
            </div>

            <!-- Menu -->
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

    <Setting :show="page.setting" @hide="onHideSetting" @electron="onElectronEvent"></Setting>
</template>

<script setup lang="ts">
import {useI18n} from "vue-i18n";
import {reactive, watch} from "vue";
import {useRouter,useRoute} from 'vue-router'
import {Base,Common} from "@renderer/utils";
import {usePageStore} from '@renderer/stores/page'
import type {ConfirmInter} from "@renderer/types/common";
import type {PageInter} from "@renderer/types/layout/header";

import Setting from "@renderer/components/Setting.vue";

const {t} = useI18n();
const route = useRoute();
const router = useRouter();
const pageStore = usePageStore();

const page:PageInter = reactive({
    init: false,
    setting: false,
    keyword: '',
    actions: {},
    maximize: { name: 'Maximize', value: 'maximize'},
    layout: {
        prefix: 'header-inner',
        fold: Common.getLayoutFold(pageStore.page.layout,'header-inner')
    }
})

const confirm:ConfirmInter = reactive({show: false, content: ''});

const onSearch = function({keyCode}):boolean|void {
    if(keyCode !== 13) {
        return false;
    }

    const {keyword} = page;
    if(Base.isEmpty(keyword)) {
        router.push({path:'/'})
        return false;
    }

    router.push({path:'/',query: {q:keyword}})
}

const onShowSetting = function():void {
    page.setting = true;
    pageStore.pop.setting = true;
}

const onHideSetting = function():void {
    page.setting = false;
    pageStore.pop.setting = false;
}

const onGoBack = function():void {
    router.back();
}

const onClear = function():void {
    page.keyword = '';
    if(route.path == '/') {
        router.push({path: '/'})
    }
}

const onIPC = function(event):void {
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

const onElectronEvent = function(args):void {
    const {key, data} = args;
    switch (key) {
        case 'maximize':
            window.electron.ipcRenderer.send('maximize');
            break
        case 'restore':
            window.electron.ipcRenderer.send('restore');
            break
        case 'openDialog':
            window.electron.ipcRenderer.send('openDialog',data);
            break
    }
}

const onCancelConfirm = function():void {
    Common.cancelConfirm(confirm);
}

const onOperateConfirm = function():void {
    Common.operateConfirm(confirm, page);
}

window.electron.ipcRenderer.on('maximize',(event,args)=> {
    if(args == true) {
        page.maximize.name = t('button.restore');
        page.maximize.value = 'restore';
        return false
    }

    page.maximize.name = t('button.maximize');
    page.maximize.value = 'maximize';
})

watch(() => pageStore.page.layout,(value)=>{
    const {layout:{prefix}} = page;
    page.layout.fold = Common.getLayoutFold(value, prefix);
})

watch(() => pageStore.pop.setting,(value) => {
    page.setting = value;
})
</script>
<style src="./index.scss" lang="scss" scoped></style>
