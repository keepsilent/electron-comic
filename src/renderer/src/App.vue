<template>
    <div class="wrap" @click="onBubbling">
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
import {useI18n} from "vue-i18n";
import {reactive, watch} from "vue";
import {storeToRefs} from 'pinia'
import {Base,Common} from "@renderer/utils";
import {usePageStore} from '@renderer/stores/page'

import Aside from '@renderer/layout/Aside/index.vue'
import Header from '@renderer/layout/Header/index.vue'
import Footer from '@renderer/layout/Footer/index.vue'
import Launch from '@renderer/layout/Launch/index.vue'

interface Page  {
    launch: boolean,
    layout: string
}

const {locale} = useI18n();
const pageStore = usePageStore();
const page:Page = reactive({launch: true, layout: Common.getLayoutFold(pageStore.layout,'main')})


// const ipcHandle = (): void => window.electron.ipcRenderer.send('maximize')
// window.electron.ipcRenderer.on('resize',(event,args)=> {
//     const {x, y, width, height} = args;
//
//     pageStore.x = x;
//     pageStore.y = y;
//     pageStore.width = width;
//     pageStore.height = height;
// })

const onBubbling = function () {
    pageStore.toolbar.more = false;
    pageStore.toolbar.submenu.view = false;
    pageStore.toolbar.submenu.order = false;
}

window.electron.ipcRenderer.on('ready-to-show',(event,args)=> {
    page.launch = false;

    if(localStorage.getItem('cm_setting_maximize') == 'true') {
        window.electron.ipcRenderer.send('maximize');
    }
})

watch(() => pageStore.layout,(value)=>{
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

