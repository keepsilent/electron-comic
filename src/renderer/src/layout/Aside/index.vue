<template>
    <div :class="['aside-wrap',aside.layoutFold]">
        <div class="aside-inner">

            <!-- 用户头像 -->
            <div class="side-header hide">
                <h1 class="tc">
                    <img src="@renderer/assets/electron.svg" width="22" height="22" alt="comic++">
                    <i>C</i>omi<i>c</i>++
                </h1>
            </div>

            <!-- 左侧菜单 -->
            <div class="aside-main">
                <!-- 用户头像-->
                <div class="user tc">
                    <div class="user-info">
                        <img class="avatar" :src="user.avatar" :alt="user.nicename" width="48" height="48">
                        <p class="title">{{user.nicename}}</p>
<!--                        <p class="level">Lv.{{user.level}}</p>-->
                    </div>

                    <div class="user-menu">
                        <div class="user-menu-header">
                            <h3 class="title  mt-m">{{user.nicename}}</h3>
                            <dl class="level">
                                <dt>
                                    <span>等级<i class="ml-5">{{user.level}}</i></span>
                                    <span class="exp">{{user.exp}}/{{getUserLevelExp(user.level)}}</span>
                                </dt>
                                <dd class="progress">
                                    <div></div>
                                    <div :style="{ width: getUserExpProgress(user.level,user.exp)+'%' }"></div>
                                </dd>
                            </dl>
                        </div>

                        <div class="user-menu-main">
                            <ul>
                                <li><label class="iconfont icon-personal"></label>个人信息</li>
                                <li><label class="iconfont icon-password"></label>修改密码</li>
                            </ul>
                        </div>
                        <div class="user-menu-footer">
                            <ul>
                                <li><label class="iconfont icon-exit"></label>退出</li>
                            </ul>
                        </div>
                    </div>
                </div>

                <!-- 菜单 -->
                <div class="menu pt-xl">
                    <div :class="{'active': index == menu.current }" v-for="(item,index) in menu.data" :key="index" v-show="index < 2" :data-index="index" :title="item.name" @click="onSwitchMenu">
                        <i :class="index == menu.current ? 'iconfont '+item.icon+'-fill' : 'iconfont '+item.icon"></i>
                        <em>{{item.name}}</em>
                    </div>
                    <span class="line mt-s mb-s"></span>
                    <div :class="{'active': index == menu.current }" v-for="(item,index) in menu.data"  v-show="index >= 2" :key="index" :data-index="index" :title="item.name" @click="onSwitchMenu">
                        <i :class="index == menu.current ? 'iconfont '+item.icon+'-fill' : 'iconfont '+item.icon"></i>
                        <em>{{item.name}}</em>
                    </div>
                </div>
            </div>

            <!-- 广告 -->
            <div class="aside-footer">
                <div class="banner">
                    <img :src="banner.image" :alt="banner.name" :data-url="banner.url" data-target="_blank" width="100%" @click="onRedirectByEvent">
                    <span class="tips">广告</span>
                </div>
                <div class="line"></div>
                <div class="layout">
                    <template v-if="aside.layout == 'two'">
                        <span :class="[isLayoutActive('one')]" @click="onPageLayout('one')"><i class="iconfont icon-layout-single"></i></span>
                        <span :class="[isLayoutActive('three')]" @click="onPageLayout('three')"><i class="iconfont icon-layout-three"></i></span>
                    </template>
                    <template v-else>
                        <span :class="[isLayoutActive('three')]" @click="onPageLayout('three')"><i class="iconfont icon-layout-three"></i></span>
                        <span :class="[isLayoutActive('two')]" @click="onPageLayout('two')"><i class="iconfont icon-layout-double"></i></span>
                        <span :class="[isLayoutActive('one')]" @click="onPageLayout('one')"><i class="iconfont icon-layout-single"></i></span>
                    </template>
                </div>
            </div>
        </div>
    </div>

    <!-- Layout Fold -->
    <div v-if="aside.layout == 'one'" class="aside-toggle" @click="onPageLayout('reset')">
        <i class="iconfont icon-return"></i>
    </div>

    <Confirm :confirm="confirm" @cancel="onCancelConfirm" @confirm="onOperateConfirm"></Confirm>
</template>

<script setup lang="ts">
import {useI18n} from "vue-i18n";
import {ref, reactive, watch} from "vue";
import { useRouter } from 'vue-router'
import {Base,Common,User} from "@renderer/utils";
import {usePageStore} from '@renderer/stores/page'
import {useFileStore} from '@renderer/stores/file'
import {debounce, throttle} from "@renderer/utils/throttle";
import {getRandomFileInfo} from "@renderer/api/file";
import {ConfirmInter, FileInter, PageInter} from "@renderer/utils/types";

import Confirm from "@renderer/components/Confirm.vue";

interface Menu {
    current: number,
    data: {
        name:string,
        key:string,
        url:string
        icon:string
    }[]
}

interface Banner {
    name: string,
    image: string,
    url: string
}

interface User {
    nicename: string,
    avatar: string,
    level: number,
    exp:number
}

interface Aside {
    layout?:string
    layoutFold?:string
}

const { t } = useI18n();
const router = useRouter()
const pageStore = usePageStore();
const fileStore = useFileStore();
const aside:Aside = reactive({
    layout: pageStore.layout,
    layoutFold: Common.getLayoutFold(pageStore.layout,'aside-wrap')
})
const file:FileInter = reactive({file_id: 0})
const menu:Menu = reactive({ current: 0,
    data:[
        {name: t('aside.menu.home'), key:'home', url: '/',icon: 'icon-home'},
        {name: t('aside.menu.random'), key:'random', url: '',icon: 'icon-discover'},
        {name: t('aside.menu.tags'), key:'tags', url: '/taxonomy',icon: 'icon-tag'},
        {name: t('aside.menu.artists'), key:'artists', url: '/taxonomy',icon: 'icon-artist'},
        {name: t('aside.menu.categories'), key:'categories', url: '/taxonomy',icon: 'icon-we'},
        {name: t('aside.menu.parodies') ,key:'parodies', url: '/taxonomy',icon: 'icon-parody'},
        {name: t('aside.menu.groups'), key:'groups', url: '/taxonomy',icon: 'icon-group'}
    ]
})

const banner:Banner = reactive({
    name: '阿里云服务器（ECS）等，高性能服务器，就选阿里云 ',
    image:'./src/assets/images/banner/banner-01.png',
    url: 'https://s.click.taobao.com/Viylruu'}
)

const user:User = reactive({
    nicename: 'Comic++',
    avatar: './src/assets/electron.svg',
    level: 5,
    exp: 10000,
})
const confirm:ConfirmInter = reactive({show: false});
const page:PageInter = reactive({init: false, loading: false, actions: {}});

const getUserLevelExp = function (level):number {
    return User.getUserLevelExp(level);
}
const getUserExpProgress = function (level,exp):number {
    return User.getUserExpProgress(level,exp);
}

const loadRandomFileInfo = debounce(async () => {
    try {

        const params = {id: file.file_id}
        const res = await getRandomFileInfo(params);

        if(res.code != 200) {
            return false;
        }

        if(Base.isEmpty(res.data)) {
            Common.showAlert(confirm,t('aside.random.empty'));
            return false;
        }

        const object = {
            path: `/reader`,
            query:  {id: res.data[0].file_id}
        }

        router.push(object)
    } catch (err) {
        Base.printErrorLog('getRandomFileInfo',err)
        Common.showAlert(confirm,t('aside.random.anomaly'));
    }
})

const isLayoutActive = function (value) {
    if(value == aside.layout) {
        return 'active'
    }

    return '';
}

const onSwitchMenu = function (event) {
    const {currentTarget: {dataset: {index}}} = event
    const {key,url} = menu.data[index];

    menu.current = index;
    if(key == 'random') {
        loadRandomFileInfo();
        return false;
    }

    console.log('url',url);
   // Base.redirect(url)

    const query = { //query是个配置项
        type: key
    }
    router.push({path: url, query: query})
}

const onRedirectByEvent = function (event) {
    Base.redirectByEvent(event)
}

const onCancelConfirm = function () {
    Common.cancelConfirm(confirm);
}

const onOperateConfirm = function () {
    Common.operateConfirm(confirm, page);
}

const onResetPageLayout = function () {
    const layout = localStorage.getItem('cm_setting_layout_old')
    onPageLayout(layout);
}

const onPageLayout = throttle((layout)=>{
    if(pageStore.layout == layout) {
        return false;
    }

    if(layout == 'reset') {
        layout = localStorage.getItem('cm_setting_layout_old') || 'three';
    }

    aside.layout = layout;
    aside.layoutFold = Common.getLayoutFold(layout,'aside-wrap');
    pageStore.layout = layout;

    localStorage.setItem('cm_setting_layout',layout)
    if(layout != 'one') {
        localStorage.setItem('cm_setting_layout_old', layout)
    }
})

watch(() => pageStore.layout,(value)=>{
    aside.layout = value;
    aside.layoutFold = Common.getLayoutFold(value,'aside-wrap');
})

watch(() => fileStore.id,(value)=>{
    file.file_id = value || 0;
})
</script>
<style src="./index.scss" lang="scss" scoped></style>
