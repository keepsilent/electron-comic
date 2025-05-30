<template>
    <div class="statusbar-wrap">
        <div :class="['statusbar-inner',page.layout.fold]">
            <div class="statusbar-left">
                <template v-if="group">{{t('status.group',{group:group})}}</template>
            </div>
            <div class="statusbar-right">
                <span>{{t('status.current')}} {{pagination.page}}, {{t('status.total')}} {{pagination.total}}</span>
                <span><i class="iconfont icon-remind"></i></span>
            </div>
        </div>
    </div>

    <Confirm :confirm="confirm" @cancel="onCancelConfirm" @confirm="onOperateConfirm"></Confirm>
</template>

<script setup lang="ts">
import {useI18n} from "vue-i18n";
import {reactive,watch} from 'vue'
import {Common} from "@renderer/utils";
import {usePageStore} from '@renderer/stores/page'
import type {ConfirmInter} from "@renderer/types/common";

import Confirm from "@renderer/components/Confirm.vue";

interface Props {
    pagination: {
        show:boolean
        page:number,
        totalPage:number,
        total:number,
        source?:string
    },
    group:string
}

interface PageInter {
    layout: {
        prefix:string,
        fold:string
    }
}

const {t} = useI18n();
const pageStore = usePageStore();
const props = defineProps<Props>()
const page = reactive<PageInter>({
    layout: {
        prefix: 'statusbar-inner',
        fold: Common.getLayoutFold(pageStore.layout,'statusbar-inner')
    }
})
const confirm = reactive<ConfirmInter>({show: false, content: ''});

const onCancelConfirm = function():void {
    Common.cancelConfirm(confirm);
}

const onOperateConfirm = function():void {
    Common.operateConfirm(confirm, page);
}

watch(() => pageStore.layout,(value)=>{
    const {layout: {prefix}} = page;
    page.layout.fold = Common.getLayoutFold(value,prefix);
})
</script>
