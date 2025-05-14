<template>
    <!-- 工具栏 -->
    <div class="toolbar-wrap">
        <div class="toolbar-left">
            <span class="operate-btn" :title="$t('tool.increase')" @click="onShowUpload"><i class="iconfont icon-increase"></i><em>{{$t('button.increase')}}</em></span>
            <span class="operate-btn forbiden" :title="$t('tool.open')"><i class="iconfont icon-file"></i><em>{{$t('button.open')}}</em></span>
            <span class="operate-btn forbiden" :title="$t('tool.edit')"><i class="iconfont icon-feedback"></i><em>{{$t('button.edit')}}</em></span>
            <span class="operate-btn forbiden" :title="$t('tool.delete')"><i class="iconfont icon-delete"></i><em>{{$t('button.delete')}}</em></span>
        </div>

        <div class="toolbar-right">
            <span class="operate-btn forbiden" :title="$t('button.more')"><i class="iconfont icon-more"></i></span>
        </div>
    </div>


    <Confirm :confirm="confirm" @cancel="onCancelConfirm" @confirm="onOperateConfirm"></Confirm>
</template>

<script setup lang="ts">
import {useI18n} from 'vue-i18n';
import {ref, reactive, watch} from "vue";
import {useRouter,useRoute} from 'vue-router'
import {Base, Common, File} from "@renderer/utils";
import type {PageInter, ConfirmInter} from "@renderer/utils/types";
import {updateFileStatus} from "@renderer/api/file";

import Confirm from "@renderer/components/Confirm.vue";

interface Props {}

const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const emit = defineEmits(['operate','cancel','upload','confirm'])
const props = defineProps<Props>()
const page:PageInter = reactive({show: false, actions:{}})
const confirm:ConfirmInter = reactive({show: false});

const onCancelConfirm = function () {
    Common.cancelConfirm(confirm);
}

const onOperateConfirm = function () {
    Common.operateConfirm(confirm, page);
}

const onShowUpload = function () {
    emit('upload')
}
</script>
