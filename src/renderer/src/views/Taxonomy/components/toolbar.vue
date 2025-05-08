<template>
    <!-- 工具栏 -->
    <div class="toolbar">
        <div class="operate">
            <span class="operate-btn forbiden" :title="$t('tool.upload')"><i class="iconfont icon-upload"></i><em>{{$t('button.upload')}}</em></span>
            <span class="operate-btn forbiden" :title="$t('tool.open')"><i class="iconfont icon-file"></i><em>{{$t('button.open')}}</em></span>
            <span class="operate-btn forbiden" :title="$t('tool.edit')"><i class="iconfont icon-feedback"></i><em>{{$t('button.edit')}}</em></span>
            <span class="operate-btn forbiden" :title="$t('tool.delete')"><i class="iconfont icon-delete"></i><em>{{$t('button.delete')}}</em></span>
        </div>

        <div class="more">
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
const emit = defineEmits(['operate','cancel','confirm'])
const props = defineProps<Props>()
const page:PageInter = reactive({show: false, actions:{}})
const confirm:ConfirmInter = reactive({show: false});

const onCancelConfirm = function () {
    Common.cancelConfirm(confirm);
}

const onOperateConfirm = function () {
    Common.operateConfirm(confirm, page);
}



</script>

<style scoped lang="scss">
.toolbar {
    display: flex;
    align-items: center;
    justify-content: space-between;

    padding: 6px var(--spacing-s);

    border-bottom: var(--border-style-solid) var(--border-width-default) var(--border-color-default);
    background-color: var(--background-color-secondary);

    .operate,.more {
        display: flex;
        align-items: center;

        .operate-btn {
            display: flex;
            align-items: center;
            position: relative;
            width: fit-content;
            height: var(--size-s);
            line-height: var(--size-s);
            padding: var(--spacing-xxs) var(--spacing-s);
            margin-right: var(--spacing-m);

            color: var(--content-color-secondary);
            font-size: var(--text-size-m);

            cursor: pointer;
            border-radius: var(--border-radius-default);
            overflow: hidden;

            i { margin-right: var(--spacing-xxs)}

            .icon-round-right {
                transform: rotate(180deg)
            }

            input[type="file"] {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                cursor: pointer;
                opacity: 0;
            }

            &:hover {
                color: var(--content-color-primary);
                background: var(--highlight-background-color-primary);
            }

            &:last-child {
                margin-right: 0;
            }
        }

        .forbiden {
            color: var(--content-color-tertiary);
            cursor: inherit;
            &:hover {
                color: var(--content-color-tertiary);
                background: transparent;
            }
        }
    }
}
</style>
