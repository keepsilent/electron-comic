<template>
    <div class="status-wrap">
        <div :class="['status-inner',page.layout]">
            <div class="file-path">
                <template v-if="group">{{t('status.group',{group:group})}}</template>
            </div>
            <div class="file-info">
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
    show: boolean,
    pagination: {
        page:number,
        totalPage: string,
        total:string,
        source: string
    },
    group:string
}

const { t } = useI18n();
const pageStore = usePageStore();
const props = defineProps<Props>()
const page = reactive({
    show: false,
    layout: Common.getLayoutFold(pageStore.layout,'status-inner')
})
const confirm:ConfirmInter = reactive({show: false});

const onCancelConfirm = function () {
    Common.cancelConfirm(confirm);
}

const onOperateConfirm = function () {
    Common.operateConfirm(confirm, page);
}

watch(() => pageStore.layout,(value) => {
    page.layout = Common.getLayoutFold(value,'status-inner');
})
</script>
