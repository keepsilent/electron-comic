<template>
    <div class="file-list-box scrollbar" :style="{height: page.height+'px'}">
        <Empty :icon="empty.icon" :title="empty.title" :subtitle="empty.subtitle"></Empty>

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
import {ref, reactive,watch} from 'vue'
import {Base, Config} from "@renderer/utils";
import {usePageStore} from '@renderer/stores/page'
import Empty from '@renderer/components/Empty.vue'

interface Empty {
    icon: string,
    title: string,
    subtitle?: string
}

const pageStore = usePageStore();
const page = reactive({height: Config.getMainHeight(pageStore.height)});
const empty:Empty = reactive({icon: 'icon-file-fill',title: '回收站为空',subtitle:'没有文件需要被处理'})

pageStore.setStatusPath('回收站');
//pageStore.setStatusPath(['C:','Users','keepsilent','Downloads'],'path');
watch(() => pageStore.height,(value)=>{
    page.height = Config.getMainHeight(value);
})
</script>

<style scoped>

</style>
