<template>
    <div class="footer">
        <div class="footer-inner">
            <div class="file-path">
                <template v-if="status.scene == 'catalogue'">{{status.name}}</template>
                <template v-else>
                    <template v-for="(item,index) in status.path">
                        <span class="item" :title="'当前路径:' +item" @click="onOpenPath">{{item}}</span>
                        <i v-if="index + 1 != status.path.length" class="iconfont icon-return"></i>
                    </template>
                </template>
            </div>
            <div class="file-num"><i class="num">{{status.num}}</i>项</div>
        </div>
    </div>
</template>

<script setup lang="ts">
import {ref, reactive,watch} from 'vue'
import {Base, Config} from "@renderer/utils";
import {usePageStore} from '@renderer/stores/page'

interface Status {
    name: string,
    num: number,
    scene: string,
    path?: object
}

const status = reactive({name: '',num: 0, scene: '', path: []})
const pageStore = usePageStore();

const onOpenPath = function () {
    window.electron.ipcRenderer.send('openpath',`C:\\Users\\keepsilent\\Desktop`);
}

watch(() => pageStore.name,(value)=>{
    status.name = value;
})

watch(() => pageStore.scene,(value)=>{
    status.scene = value;
})

watch(() => pageStore.path,(value)=>{
    status.path = value;
})

watch(() => pageStore.num,(value)=>{
    status.num = value;
})
</script>
<style scoped lang="scss">
@use "./index.scss";
</style>
