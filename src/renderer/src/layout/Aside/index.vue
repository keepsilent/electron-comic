<template>
    <div :class="['aside-wrap',aside.fold]">
        <div class="aside-inner">

            <!-- Aside -->
            <div class="aside-main">
                <!-- User Avatar-->
                <div class="user tc">
                    <div class="user-info">
                        <img class="avatar" src="@renderer/assets/electron.svg" :alt="user.nicename" width="48" height="48">
                        <p class="title">{{user.nicename}}</p>
                    </div>
                </div>

                <!-- Menu List -->
                <div class="menu pt-xl">
                    <template v-for="(item,index) in menu.data" :key="index">
                        <div :class="{'active': index == menu.current }" :data-index="index" @click="onSwitchMenu">
                            <i :class="index == menu.current ? 'iconfont '+item.icon+'-fill' : 'iconfont '+item.icon"></i>
                            <em>{{item.name}}</em>
                        </div>
                        <span v-if="index == 1 || index == 6" class="line mt-s mb-s"></span>
                    </template>
                </div>
            </div>

            <!-- Banner -->
            <div class="aside-footer">
                <div class="banner">
                    <img src="@renderer/assets/images/banner/banner-01.png" :alt="banner.name" :data-url="banner.url" data-target="_blank" width="100%" @click="onRedirectByEvent">
                    <span class="tips">{{t('aside.advertisement')}}</span>
                </div>
                <div class="line"></div>
                <div class="layout">
                    <template v-if="aside.layout == 'two'">
                        <span :class="[isLayoutActive('one')]" @click="onChangePageLayout('one')"><i class="iconfont icon-layout-single"></i></span>
                        <span :class="[isLayoutActive('three')]" @click="onChangePageLayout('three')"><i class="iconfont icon-layout-three"></i></span>
                    </template>
                    <template v-else>
                        <span :class="[isLayoutActive('three')]" @click="onChangePageLayout('three')"><i class="iconfont icon-layout-three"></i></span>
                        <span :class="[isLayoutActive('two')]" @click="onChangePageLayout('two')"><i class="iconfont icon-layout-double"></i></span>
                        <span :class="[isLayoutActive('one')]" @click="onChangePageLayout('one')"><i class="iconfont icon-layout-single"></i></span>
                    </template>
                </div>
            </div>
        </div>
    </div>

    <!-- Layout Fold -->
    <div v-if="aside.layout == 'one'" class="aside-toggle" @click="onChangePageLayout('reset')">
        <i class="iconfont icon-return"></i>
    </div>

    <Confirm :confirm="confirm" @cancel="onCancelConfirm" @confirm="onOperateConfirm"></Confirm>
</template>

<script setup lang="ts">
import {useI18n} from "vue-i18n";
import {useRouter} from 'vue-router'
import {reactive, watch} from "vue";
import {Base, Config, Common, File} from "@renderer/utils";
import {usePageStore} from '@renderer/stores/page'
import {useFileStore} from '@renderer/stores/file'
import {debounce, throttle} from "@renderer/utils/throttle";
import {getRandomFileInfo} from "@renderer/api/file";
import type {ConfirmInter} from "@renderer/types/common";
import type {PageInter, AsideInter, MenuInter, BannerInter, UserInter} from "@renderer/types/layout/aside";

import Confirm from "@renderer/components/Confirm.vue";


const {t} = useI18n();
const router = useRouter()
const pageStore = usePageStore();
const fileStore = useFileStore();
const fs = require("fs") as typeof import("fs");
const path = require("path") as typeof import("path");
const page:PageInter = reactive({
    init: false,
    file: {
        file_id: ''
    },
    actions: {}
});

const aside:AsideInter = reactive({
    prefix: 'aside-wrap',
    layout: pageStore.page.layout,
    fold: Common.getLayoutFold(pageStore.page.layout,'aside-wrap')
})

const user:UserInter = reactive({
    nicename: 'Comic++',
})

const menu:MenuInter = reactive({
    current: 0,
    data:[
        {name: t('aside.menu.home'), key:'home', url: '/',icon: 'icon-home'},
        {name: t('aside.menu.random'), key:'random', url: '',icon: 'icon-discover'},
        {name: t('aside.menu.tags'), key:'tags', url: '/taxonomy',icon: 'icon-tag'},
        {name: t('aside.menu.artists'), key:'artists', url: '/taxonomy',icon: 'icon-artist'},
        {name: t('aside.menu.categories'), key:'categories', url: '/taxonomy',icon: 'icon-we'},
        {name: t('aside.menu.parodies') ,key:'parodies', url: '/taxonomy',icon: 'icon-parody'},
        {name: t('aside.menu.groups'), key:'groups', url: '/taxonomy',icon: 'icon-group'},
        {name: t('aside.menu.favor'), key:'favor', url: '',icon: 'icon-favor'},
        // {name: t('aside.menu.about'), key:'favor', url: '',icon: 'icon-about'}
    ]
})

const banner:BannerInter = reactive({
    name: '阿里云服务器（ECS）等，高性能服务器，就选阿里云 ',
    url: 'https://s.click.taobao.com/Viylruu'}
)

const confirm:ConfirmInter = reactive({show: false, content: ''});

const isLayoutActive = function(value):string {
    if(value == aside.layout) {
        return 'active'
    }

    return '';
}

const setBackMenu = function():void {
    setTimeout(()=> {//响应路由会有延时问题,需要定时器
        const {currentRoute:{value:{path,query:{type}}}} = router
        const {data} = menu;
        switch (path) {
            case '/':
                menu.current = 0;
                break;
            case '/taxonomy':
                for(let i in data) {
                    if(data[i].url == path && data[i].key == type) {
                        menu.current = Number(i);
                    }
                }
                break;
        }
    },10)
}

const onSwitchMenu = function(event):boolean|void {
    const {currentTarget: {dataset: {index}}} = event
    const {key,url} = menu.data[index];

    menu.current = index;
    if(key == 'random') {
        loadRandomFileInfo();
        return false;
    }

    if(key == 'home'){
        localStorage.setItem('cm_cache_home_scroll','0');
    }

    router.push({path: url, query: {type:key}})
}

const loadRandomFileInfo = debounce(async () => {
    try {
        const {file: {file_id} } = page
        const params = {file_id: file_id}
        const res = await getRandomFileInfo(params);
        if(res.code != 200) {
            return false;
        }

        if(Base.isEmpty(res.data)) {
            Common.showAlert(confirm,t('aside.random.empty'));
            return false;
        }

        router.push({path:'/reader',query:{id: res.data[0].file_id}})
    } catch (err) {
        Base.printErrorLog('getRandomFileInfo',err)
        Common.showAlert(confirm,t('aside.random.anomaly'));
    }
})

const onChangePageLayout = throttle((layout)=>{
    if(pageStore.page.layout == layout) {
        return false;
    }

    if(layout == 'reset') {
        layout = localStorage.getItem('cm_setting_layout_old') || 'three';
    }

    aside.layout = layout;
    aside.fold = Common.getLayoutFold(layout,aside.prefix);
    pageStore.page.layout = layout;

    localStorage.setItem('cm_setting_layout',layout)
    if(layout != 'one') {
        localStorage.setItem('cm_setting_layout_old', layout)
    }
})

const onCancelConfirm = function():void {
    Common.cancelConfirm(confirm);
}

const onOperateConfirm = function():void {
    Common.operateConfirm(confirm, page);
}

const onRedirectByEvent = function(event):void {
    Base.redirectByEvent(event)
}

watch(() => pageStore.page.layout,(value)=>{
    aside.layout = value;
    aside.fold = Common.getLayoutFold(value,aside.prefix);
})

watch(() => pageStore.page.back, (value)=>{
    setBackMenu()
})

watch(() => fileStore.id,(value)=>{
    page.file.file_id = value ? value as string : '0';
})

window.electron.ipcRenderer.on('openDialog',(event,args)=> {
    const {canceled,filePaths} = args;
    if(canceled == true) {
        return false;
    }
    const [path] = filePaths;
    const originFilePath = Config.getStoragePath();

    if(Base.isEmpty(originFilePath) || Base.isEmpty(path)) {
        return false;
    }

    fileStore.path = path;
    localStorage.setItem('cm_setting_storage_path',path);
    File.removeToNewDir(originFilePath, path)
})


//
// const getFiles = function (originFilePath:string, copyFilePath:string):void {
//     console.log('originFilePath',path.resolve(originFilePath));
//     fs.readdir(originFilePath, { withFileTypes: true }, (err, files) => {
//         if (err) {
//             console.error('读取目录出错:', err);
//             return false;
//         }
//         for (let file of files) {
//             if(file.isDirectory()) { //如果是文件夹就递归变量把最新的文件夹路径传过去
//                 const originDirPath = path.resolve(originFilePath,file.name)
//                 if(originDirPath !== copyFilePath) {
//                     console.log('originDirPath xx',originDirPath);
//                     copyDirSync(originFilePath, copyFilePath, file.name)
//                 }
//             } else { //获取旧文件夹中要复制的文件
//                 copyFileSync(originFilePath,copyFilePath,file.name)
//             }
//         }
//         console.log('files err',err);
//         console.log('files',files);
//     })
// }
//
// const copyDirSync = function(originFilePath:string, copyFilePath:string, fileName:string):void {
//     const originDirPath = path.resolve(originFilePath,fileName)
//     const copyDirPath = path.resolve(copyFilePath,fileName)
//     File.mkdir(copyDirPath);
//     getFiles(originDirPath,copyDirPath)
// }
//
// const copyFileSync = function(originFilePath:string, copyFilePath:string, fileName:string):boolean|void {
//     const originFile = path.resolve(originFilePath, fileName) //获取新文件夹中复制的地方
//     const copyFile = path.resolve(copyFilePath, fileName)  //将文件从旧文件夹复制到新文件夹中
//     if(!File.isImageFileByPath(copyFile)) {
//         return false
//     }
//     fs.copyFileSync(originFile,copyFile)
// }
</script>
<style src="./index.scss" lang="scss" scoped></style>
