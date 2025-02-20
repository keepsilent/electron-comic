<template>
    <div class="side" id="app-side-box">
        <div class="side-inner">
            <!-- 用户头像 -->
            <div class="side-header hide ">
                <h1 class="tc">
                    <img src="./dist/images/logo.png" width="22" height="22" alt="comic++">
                    <i>C</i>omi<i>c</i>++
                </h1>
            </div>
            <!-- 左侧菜单 -->
            <div class="side-main">
                <!-- 用户头像-->
                <div class="side-user pt-25 tc title-drag" id="side-user"></div>

                <!-- 左侧菜单 -->
                <div class="side-menu pt-25" id="side-menu">
                    <ul>
                        <li onclick="tipsBox.autoClose('功能暂未开放');"><i class="iconfont icon-time"></i>最近使用</li>
                        <li id="side-menu-index-btn" onclick="base.jumpUrl('#/index')"><i class="iconfont icon-icon_workfile_line" ></i>全部文件</li>
                        <li id="side-menu-zip-btn" onclick="base.jumpUrl('#/index/zip')">漫画</li>
                        <li id="side-menu-pdf-btn" onclick="base.jumpUrl('#/index/pdf')">书籍</li>
                        <li id="side-menu-txt-btn" onclick="base.jumpUrl('#/index/txt')">文档</li>
                        <li id="side-menu-recycle-btn" onclick="base.jumpUrl('#/recycle')"><i class="iconfont icon-delete"></i>回收站</li>
                    </ul>
                </div>
            </div>
            <!-- 左侧广告 -->
            <div class="side-footer" id="side-footer"></div>
        </div>
    </div>

</template>

<!--<script>-->
<!--export default {-->
<!--    name: "index"-->
<!--}-->
<!--</script>-->

<!--<style scoped>-->

<!--</style>-->


<script setup lang="ts">
import {onMounted, onUnmounted, ref} from "vue";
import {test} from './index.ts'
// const {test} = index


console.log('a')

onMounted(()=>{
    test()
})
</script>
<style lang="scss" scoped>
@use "./index.scss";
</style>
