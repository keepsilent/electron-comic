<template>
    <div class="wrap" @click="onWatchBubbling">
        <Aside></Aside>
        <div class="inner">
            <Header></Header>
            <div :class="['main',page.layout]">
<!--                <router-view v-slot="{ Component }">-->
<!--                    <component :key="refresh" :is="Component"></component>-->
<!--                </router-view>-->
                <router-view v-slot="{ Component, route }">
                    <component :is="Component" :key="route.fullPath" />
<!--                    <transition name="animation" mode="out-in">-->
<!--                        <component :is="Component" :key="route.path" />-->
<!--                    </transition>-->
                </router-view>
            </div>
<!--            <Footer></Footer>-->
        </div>
    </div>
    <Launch :show="page.launch"></Launch>
</template>
<script setup lang="ts">
import {reactive, watch} from "vue";

import {Common, File} from "@renderer/utils";
import {usePageStore} from '@renderer/stores/page'

import Aside from '@renderer/layout/Aside/index.vue'
import Header from '@renderer/layout/Header/index.vue'
import Launch from '@renderer/layout/Launch/index.vue'

interface Page {
    launch: boolean,
    layout: string
}

const path = require("path") as typeof import("path");
const pageStore = usePageStore();
const page:Page = reactive({
    launch: true,
    layout: Common.getLayoutFold(pageStore.page.layout,'main')
})

const setProgramLaunch = function ():void {
    page.launch = false;
}

const setWindowMaximize = function ():boolean|void {
    const maximize = localStorage.getItem('cm_setting_maximize') ?? '';

    if(maximize !== 'true') {
        return false
    }

    window.electron?.ipcRenderer.send('maximize');
}

const setStoragesFolder = function ({path}):void {
    const storage = import.meta.env.VITE_APP_STORAGE_PATH

    const dbPath = `${path}\\${storage}\\database`;
    const imagePath = `${path}\\${storage}\\files\\images`;

    File.mkdir(dbPath)
    File.mkdir(imagePath)
    window.localStorage.setItem('cm_app_path',path);
}

const onWatchBubbling = function ():void {
    pageStore.toolbar.more = false;
    pageStore.toolbar.submenu.view = false;
    pageStore.toolbar.submenu.order = false;
}

window.electron.ipcRenderer.on('ready-to-show',(event,args)=> {
    const mode = import.meta.env.MODE;
    if(mode == 'production') {
        args.app.path = path.join(args.app.path, './../../')
        const index = args.app.path.lastIndexOf('\\');
        args.app.path = args.app.path.slice(0, index);
    }

    console.log('args.app.path',args.app.path);
    setProgramLaunch();
    setWindowMaximize();
    setStoragesFolder(args.app)
})

watch(() => pageStore.page.layout,(value) => {
    page.layout = Common.getLayoutFold(value,'main');
})
</script>
<style scoped lang="scss">
.main {
    transition: margin-left var(--transition-delay-default) var(--transition-timing-default);

    &__fold {
        margin-left: 0;
    }

    &__fold-2 {
        margin-left: 76px;
    }
}
</style>

