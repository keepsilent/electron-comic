<template>
    <div class="header">
        <div class="header-inner">
            <div class="nav">
                <span class="iconfont icon-return" :title="$t('button.return')" @click="onGoBack"></span>
                <div class="search ml-10">
                    <i class="iconfont icon-search"></i>
                    <input type="text" v-model="keyword" :placeholder="$t('search.placeholder')" @keydown="onSearch" autocomplete="off">
                    <i v-if="keyword" class="iconfont icon-close ml-10" @click="onClear"></i>
                </div>
            </div>

            <!-- 头部菜单 -->
            <div class="menu tc">
                <div class="left">
                    <span class="iconfont icon-setting" :title="$t('button.setting')">
                        <i class="dot"></i>
                    </span>
                </div>

                <div class="right">
                    <span class="iconfont icon-minimize" :title="$t('button.minimize')" data-key="minimize" @click="onIPC"></span>
                    <span :class="maximize.value == 'maximize' ? ['iconfont', 'icon-maximize'] : ['iconfont', 'icon-restore']" :title="maximize.name" :data-key="maximize.value" @click="onIPC"></span>
                    <span class="iconfont icon-close" :title="$t('button.close')" data-key="close" @click="onIPC"></span>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import {useI18n} from "vue-i18n";
import {ref, reactive, toRefs} from "vue";
import {useRouter,useRoute} from 'vue-router'
import {Base} from "@renderer/utils";

import {usePageStore} from '@renderer/stores/page'

interface Maximize {
    name: string,
    value: string
}

const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const pageStore = usePageStore();
const keyword:string = ref(null);
const maximize:Maximize = reactive({name: 'Maximize', value: 'maximize'})

const onSearch = function({keyCode}):boolean|void {
    if(keyCode !== 13) {
        return false;
    }

    // if(Base.isEmpty(keyword.value)) {
    //     return false;
    // }

    if(route.path == '/') {
        pageStore.keyword = keyword.value;
        return false;
    }

    const object = {
        path: '/',
        query: {
            keyword: keyword.value
        }
    }

    router.push(object)
}

const onGoBack = function ():void {
    router.back();
}

const onClear = function():void {
    keyword.value = '';
    pageStore.keyword = '';
}

const onIPC = function({currentTarget: {dataset: {key}}}): void {
    switch (key) {
        case 'restore':
            maximize.name = t('button.maximize');
            maximize.value = 'maximize';
            window.electron.ipcRenderer.send(key);
            break
        case 'maximize':
            maximize.name = t('button.restore');
            maximize.value = 'restore';
            window.electron.ipcRenderer.send(key);
            break
        default:
            window.electron.ipcRenderer.send(key);
    }
}

window.electron.ipcRenderer.on('maximize',(event,args)=> {
    if(args == true) {
        maximize.name = t('button.restore');
        maximize.value = 'restore';
        return false
    }

    maximize.name = t('button.maximize');
    maximize.value = 'maximize';
})
</script>
<style lang="scss" scoped>
@use "./index.scss";
</style>
