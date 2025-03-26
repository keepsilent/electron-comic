<template>
    <!-- 工具栏 -->
    <div class="toolbar">
        <template v-if="page.show">
            <div class="operate">
                <span class="toolbar-menu-btn forbiden" :title="$t('tool.open')" @click="onOpenFolder"><i class="iconfont icon-file"></i>{{$t('button.open')}}</span>
                <span class="toolbar-menu-btn forbiden" :title="$t('tool.upload')"><i class="iconfont icon-top"></i>{{$t('button.upload')}}<input type="file" class="cc-upload-btn" :title="$t('tool.upload')" accept=".zip,.txt,.pdf" onchange="ccFile.upload($(this))"></span>
                <span class="toolbar-menu-btn forbiden" :title="$t('tool.edit')" onclick="ccSearch.showFile($(this))"><i class="iconfont icon-feedback"></i>{{$t('button.edit')}}</span>
                <span class="toolbar-menu-btn forbiden" :title="$t('tool.delete')" data-type="delete" onclick="ccSearch.showTips($(this))"><i class="iconfont icon-delete"></i>{{$t('button.delete')}}</span>
            </div>

            <div class="more">
                <span :title="$t('button.more')" onclick="ccFile.showOrderMenu(event,'{{model}}')"><i class="iconfont icon-more"></i></span>
            </div>
        </template>
    </div>

    <Confirm :confirm="confirm" @cancel="onCancelConfirm" @confirm="onOperateConfirm"></Confirm>
</template>

<script setup lang="ts">
import {reactive, watch} from "vue";
import type {PageInter, ConfirmInter, FileInter} from "@renderer/utils/types";
import {Base, File, Time} from "@renderer/utils";
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


const emit = defineEmits(['cancel','confirm'])
const props = defineProps<Props>()
const page:PageInter = reactive({show: false})
const confirm:ConfirmInter = reactive({show: false});
const onCancel = function () {
    emit('cancel')
}

const onConfirm = function () {
    emit('confirm')
}

const onOpenFolder = function () {
    Base.showAlert(confirm,'xxx');
    //window.electron.ipcRenderer.send('openpath', props.file.path);
}

const onCancelConfirm = function () {
    Base.cancelConfirm(confirm);
}

const onOperateConfirm = function () {
    Base.operateConfirm(confirm, page);
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

        span {
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
    }
}
</style>
