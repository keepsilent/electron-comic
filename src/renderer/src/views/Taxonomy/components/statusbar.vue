<template>
    <div class="statusbar-wrap">
        <div :class="['statusbar-inner',page.layout]">
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
import {reactive,onMounted, watch} from 'vue'
import {Base,Common,File} from "@renderer/utils";
import {usePageStore} from '@renderer/stores/page'
import type {PageInter, ConfirmInter} from "@renderer/utils/types";

import Confirm from "@renderer/components/Confirm.vue";

interface Props {
    show?: boolean,
    pagination: {
        show: boolean
        page: number,
        totalPage: number,
        total: number,
        source: string
    },
    group:string
}

const { t } = useI18n();
const pageStore = usePageStore();
const props = defineProps<Props>()
const page = reactive({
    show: false,
    layout: Common.getLayoutFold(pageStore.layout,'statusbar-inner')
})
const confirm:ConfirmInter = reactive({show: false});

const onCancelConfirm = function () {
    Common.cancelConfirm(confirm);
}

const onOperateConfirm = function () {
    Common.operateConfirm(confirm, page);
}

watch(() => pageStore.layout,(value) => {
    page.layout = Common.getLayoutFold(value,'statusbar-inner');
})
</script>
