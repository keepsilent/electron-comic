<template>
    <div class="header">
        <div class="header-inner">
            <div class="nav">
                <span class="iconfont icon-return" title="返回" onclick="config.back()"></span>
                <div class="search ml-10">
                    <i class="iconfont icon-search"></i>
                    <input type="text" v-model="keyword" placeholder="搜索" @keydown="search" autocomplete="off">
                    <i v-if="keyword" class="iconfont icon-close ml-10" @click="clear"></i>
                </div>
            </div>

            <!-- 头部菜单 -->
            <div class="menu tc">
                <span class="iconfont icon-minimize" title="最小化" data-key="minimize" @click="ipcHandle"></span>
                <span :class="maximize_cfg.value == 'maximize' ? ['iconfont', 'icon-maximize'] : ['iconfont', 'icon-restore']" :title="maximize_cfg.name" :data-key="maximize_cfg.value" @click="ipcHandle"></span>
                <span class="iconfont icon-close" title="退出" data-key="close" @click="ipcHandle"></span>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import {ref, reactive, toRefs} from "vue";

interface maximize {
    name: string,
    value: string
}

const keyword:string = ref('');
const maximize_cfg:maximize = reactive({name: '最大化', value: 'maximize'})

const search = function({keyCode}):boolean|void {
    if(keyCode !== 13) {
        return false;
    }
    console.error('k',keyCode)
}

const clear = function():void {
    keyword.value = '';
}

const ipcHandle = function({currentTarget: {dataset: {key}}}): void {
    switch (key) {
        case 'restore':
            maximize_cfg.name = '最大化';
            maximize_cfg.value = 'maximize';
            window.electron.ipcRenderer.send(key);
            break
        case 'maximize':
            maximize_cfg.name = '还原';
            maximize_cfg.value = 'restore';
            window.electron.ipcRenderer.send(key);
            break
        default:
            window.electron.ipcRenderer.send(key);
    }
}

window.electron.ipcRenderer.on('maximize',(event,args)=> {
    if(args == true) {
        maximize_cfg.name = '还原';
        maximize_cfg.value = 'restore';
        return false
    }

    maximize_cfg.name = '最大化';
    maximize_cfg.value = 'maximize';
})
</script>
<style lang="scss" scoped>
@use "./index.scss";
</style>
