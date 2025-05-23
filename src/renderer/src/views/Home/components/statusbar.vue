<template>
    <div class="statusbar-wrap">
        <div :class="['statusbar-inner',page.layout.fold]">
            <div class="statusbar-left">
                <template v-if="load.q">{{t('status.search',{q:load.q})}}</template>
                <template v-if="load.name && load.type">{{t('status.taxonomy',{name:load.name, type: load.type})}}</template>
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
import {reactive, watch} from 'vue'
import {Common} from "@renderer/utils";
import {usePageStore} from '@renderer/stores/page'
import type {ConfirmInter} from "@renderer/types/common";

import Confirm from "@renderer/components/Confirm.vue";

interface Props {
    pagination: {
        show: boolean
        page: number,
        totalPage: number,
        total: number
    },
    load: {
        q?:string,
        name?: string,
        type?: string
    }
}

interface PageInter {
    show:boolean,
    layout: {
        prefix:string,
        fold:string
    }
}

const { t } = useI18n();
const pageStore = usePageStore();
const props = defineProps<Props>()
const page = reactive<PageInter>({
    show: false,
    layout: {
        prefix: 'statusbar-inner',
        fold: Common.getLayoutFold(pageStore.layout,'statusbar-inner')
    }
})
const confirm = reactive<ConfirmInter>({show: false, content: ''});


const onCancelConfirm = function () {
    Common.cancelConfirm(confirm);
}

const onOperateConfirm = function () {
    Common.operateConfirm(confirm, page);
}

watch(() => pageStore.layout,(value)=>{
    const prefix = page.layout.prefix;
    page.layout.fold = Common.getLayoutFold(value,prefix);
})
</script>
