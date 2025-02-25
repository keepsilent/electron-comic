<template>
    <div class="file-list-box scrollbar" style="height: 1000px">


        <Empty></Empty>

<!--        <ul>-->
<!--            <li v-for="(item,index) in 100"  onmousedown="" data-id="{{item.file_id}}" title="名称：&#10;大小：&#10;修改时间：">-->
<!--                <div class="font-0"><img src="./dist/images/default_cover.png" data-load="0" data-src="" data-width=""  data-height="" width="150" height="195"></div>-->
<!--                <p>文件名</p>-->
<!--            </li>-->
<!--        </ul>-->

        <!-- 分页 -->
        <div class="hide" id="cc-page-wrap"></div>
    </div>
</template>

<script lang="ts" setup>
import {ref } from 'vue'
import Empty from '@renderer/components/Empty.vue'



</script>

<style scoped>

</style>
