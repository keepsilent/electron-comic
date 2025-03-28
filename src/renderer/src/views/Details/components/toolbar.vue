<template>
    <!-- 工具栏 -->
    <div class="toolbar">
        <template v-if="page.show">
            <div class="operate">
                <span class="operate-btn forbiden" :title="$t('tool.increase')"><i class="iconfont icon-increase"></i><em>{{$t('button.increase')}}</em></span>
                <span class="operate-btn" :title="$t('tool.open')" @click="onOpenFolder"><i class="iconfont icon-file"></i><em>{{$t('button.open')}}</em></span>
                <span class="operate-btn" :title="$t('tool.edit')" ><i class="iconfont icon-feedback"></i><em>{{$t('button.edit')}}</em></span>
                <span class="operate-btn" :title="$t('tool.delete')" @click="onDeleteFile"><i class="iconfont icon-delete"></i><em>{{$t('button.delete')}}</em></span>
            </div>

            <div class="more">
                <span class="operate-btn" :title="$t('button.more')"><i class="iconfont icon-more"></i></span>
            </div>
        </template>
    </div>

    <Confirm :confirm="confirm" @cancel="onCancelConfirm" @confirm="onOperateConfirm"></Confirm>
</template>

<script setup lang="ts">
import {useI18n} from 'vue-i18n';
import {reactive, watch} from "vue";
import {Base, Common, File} from "@renderer/utils";
import type {PageInter, ConfirmInter} from "@renderer/utils/types";

import Confirm from "@renderer/components/Confirm.vue";

interface Props {
    file: {
        id:number,
        date: string,
        modified:string,
        name: string,
        author: string,
        type: string,
        path: string,
        size:number,
        total:number,
        status: string
    }
}

const { t } = useI18n();
const emit = defineEmits(['cancel','confirm'])
const props = defineProps<Props>()
const page:PageInter = reactive({show: false, actions:{}})
const confirm:ConfirmInter = reactive({show: false});



page.actions.onDeleteFile = function ():boolean {
    try {
        const {id, path} = props.file;
        if (File.deleteFile(path) == false) {
            Common.showAlert(confirm,t("alert.content.delete.fail"));
            return false;
        }
    } catch (err) {

        console.log('e',err);
    } finally {
        Common.cancelConfirm(confirm);
    }
}

const onOpenFolder = function () {
    const path = props.file.path;
    if(!File.isExists(path)) {
        Common.showAlert(confirm,t("alert.content.inexistence"));
        return false;
    }

    window.electron.ipcRenderer.send('openpath', path);
}

const onDeleteFile = function () {
    const path = props.file.path;
    if(!File.isExists(path)) {
        Common.showAlert(confirm,t("alert.content.inexistence"));
        return false;
    }

    Common.showConfirm(confirm,t("confirm.delete.content"),'onDeleteFile',t("confirm.delete.title"));
}

const onCancelConfirm = function () {
    Common.cancelConfirm(confirm);
}

const onOperateConfirm = function () {
    Common.operateConfirm(confirm, page);
}

watch(() => props.file.path,(value)=>{
    page.show = !Base.isEmpty(value)
})
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
            &:hover {
                color: var(--content-color-tertiary);
                background: transparent;
            }
        }
    }
}
</style>
