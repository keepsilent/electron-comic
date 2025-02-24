<template>
    <div class="header">
        <div class="header-inner">
            <div class="nav">
                <span class="iconfont icon-return" title="返回" onclick="config.back()"></span>
                <div class="search ml-10">
                    <i class="iconfont icon-search"></i>
                    <input type="text" v-model="keyword" placeholder="搜索" @keydown="onSearch" autocomplete="off">
                    <i v-if="keyword" class="iconfont icon-close ml-10" @click="onClear"></i>
                </div>
            </div>

            <!-- 头部菜单 -->
            <div class="menu tc">
                <span class="iconfont icon-minimize" title="最小化" data-key="minimize" @click="onIPC"></span>
                <span :class="maximize.value == 'maximize' ? ['iconfont', 'icon-maximize'] : ['iconfont', 'icon-restore']" :title="maximize.name" :data-key="maximize.value" @click="onIPC"></span>
                <span class="iconfont icon-close" title="退出" data-key="close" @click="onIPC"></span>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import {ref, reactive, toRefs} from "vue";
import {Base} from "@renderer/utils";

interface Maximize {
    name: string,
    value: string
}

const keyword:string = ref(null);
const maximize:Maximize = reactive({name: '最大化', value: 'maximize'})

const onSearch = function({keyCode}):boolean|void {
    if(keyCode !== 13) {
        return false;
    }

    if(Base.isEmpty(keyword.value)) {
        return  false;
    }

    console.error('k',keyCode,keyword.value)
}

const onClear = function():void {
    keyword.value = '';
}

const onIPC = function({currentTarget: {dataset: {key}}}): void {
    switch (key) {
        case 'restore':
            maximize.name = '最大化';
            maximize.value = 'maximize';
            window.electron.ipcRenderer.send(key);
            break
        case 'maximize':
            maximize.name = '还原';
            maximize.value = 'restore';
            window.electron.ipcRenderer.send(key);
            break
        default:
            window.electron.ipcRenderer.send(key);
    }
}

window.electron.ipcRenderer.on('maximize',(event,args)=> {
    if(args == true) {
        maximize.name = '还原';
        maximize.value = 'restore';
        return false
    }

    maximize.name = '最大化';
    maximize.value = 'maximize';
})

</script>
<style lang="scss" scoped>
@use "./index.scss";
</style>
