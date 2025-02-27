<template>
    <div class="wrap">
        <Aside></Aside>
        <div class="inner">
            <Header></Header>
            <div class="main">
<!--                <router-view v-slot="{ Component }">-->
<!--                    <component :key="refresh" :is="Component"></component>-->
<!--                </router-view>-->
                <router-view v-slot="{ Component, route }">
                    <transition name="animation" mode="out-in">
                        <component :is="Component" :key="route.path" />
                    </transition>
                </router-view>
            </div>
            <Footer></Footer>
        </div>
    </div>
</template>
<script setup lang="ts">
import {storeToRefs} from 'pinia'
import {usePageStore} from '@renderer/stores/page'

import Aside from '@renderer/layout/Aside/index.vue'
import Header from '@renderer/layout/Header/index.vue'
import Footer from '@renderer/layout/Footer/index.vue'


const pageStore = usePageStore();
const {height} = storeToRefs(pageStore);

// const ipcHandle = (): void => window.electron.ipcRenderer.send('maximize')
window.electron.ipcRenderer.on('resize',(event,args)=> {
    const {x, y, width, height} = args;

    pageStore.x = x;
    pageStore.y = y;
    pageStore.width = width;
    pageStore.height = height;
})

</script>
