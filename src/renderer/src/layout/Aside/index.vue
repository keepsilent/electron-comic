<template>
    <div class="aside-wrap">
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
                <div class="user pt-25 tc">
                    <div class="user-info">
                        <img class="avatar" :src="user.avatar" :alt="user.nicename" width="48" height="48">
                        <h3 class="title mt-10">{{user.nicename}}</h3>
                    </div>

                    <div class="user-menu">
                        <div class="user-menu-header">
                            <h3 class="title mt-10">{{user.nicename}}</h3>
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
                <div class="menu pt-25">
                    <ul>
                        <li :class="{'active': index == menu.current }" v-for="(item,index) in menu.data" :key="index" :data-index="index" :title="item.name" @click="onSwitchMenu"><i v-if="item.icon" :class="['iconfont',item.icon]" ></i>{{item.name}}</li>
                    </ul>
                </div>
            </div>

            <!-- 广告 -->
            <div class="aside-footer">
                <div class="banner">
                    <img :src="banner.image" :alt="banner.name" :data-url="banner.url" data-target="_blank" width="100%" @click="onRedirectByEvent">
                    <span class="tips">广告</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import {ref,reactive} from "vue";
import { useRouter } from 'vue-router'
import {Base,User} from "@renderer/utils";
interface Menu {
    current: number,
    data: object
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

const router = useRouter()
const menu:Menu = reactive({ current: 1,
    data:[
        {name: '最近使用',url: '',icon: 'icon-time'},
        {name: '全部文件',url: '',icon: 'icon-file'},
        {name: '图片',url: '',icon: ''},
        {name: '漫画',url: '/',icon: ''},
        {name: '视频',url: '',icon: ''},
        {name: '书籍',url: '',icon: ''},
        {name: '文档',url: '',icon: ''},
        {name: '回收站',url: '/recycle',icon: 'icon-delete'},
    ]
})

const banner:Banner = reactive({
    name: '阿里云服务器（ECS）等，高性能服务器，就选阿里云 ',
    image:'./src/assets/images/banner/banner-01.png',
    url: 'https://s.click.taobao.com/Viylruu'}
)

const user:User = reactive({
    nicename: 'KeepSilent',
    avatar: './src/assets/electron.svg',
    level: 5,
    exp: 10000,
})


const getUserLevelExp = function (level):number {
    return User.getUserLevelExp(level);
}
const getUserExpProgress = function (level,exp):number {
    return User.getUserExpProgress(level,exp);
}
const onSwitchMenu = function ({currentTarget: {dataset: {index}}}):void {
    const {url} = menu.data[index];

    menu.current = index;
    console.log('url',url);
   // Base.redirect(url)

    router.push({
        path: url,
        query:{ //query是个配置项
            age:20
        }
    })
    //this.$router.push({ name:‘hello’, query:{ name:‘word’, age:‘11’ } })
}

const onRedirectByEvent = function (event) {
    Base.redirectByEvent(event)
}

</script>
<style lang="scss" scoped>
@use "./index.scss";
</style>
