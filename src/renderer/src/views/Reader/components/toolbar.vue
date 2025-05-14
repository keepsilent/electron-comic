<template>
    <!-- 工具栏 -->
    <div class="toolbar-wrap">
        <template v-if="page.show">
            <div class="toolbar-left">
<!--                <span class="operate-btn" :title="$t('tool.return')" @click="onGoBack">-->
<!--                    <i class="iconfont icon-round-right"></i>-->
<!--                    <em>{{$t('button.return')}}</em>-->
<!--                </span>-->
                <span class="operate-btn" :title="$t('tool.increase')" @click="onShowUpload"><i class="iconfont icon-increase"></i><em>{{$t('button.increase')}}</em></span>
                <span class="operate-btn" :title="$t('tool.open')" @click="onOpenFolder"><i class="iconfont icon-file"></i><em>{{$t('button.open')}}</em></span>
                <span class="operate-btn" :title="$t('tool.edit')" @click="onShowFileEdit" ><i class="iconfont icon-feedback"></i><em>{{$t('button.edit')}}</em></span>
                <span class="operate-btn" :title="$t('tool.delete')" @click="onDeleteFile"><i class="iconfont icon-delete"></i><em>{{$t('button.delete')}}</em></span>
            </div>

            <div class="toolbar-right">
                <span class="operate-btn" :title="$t('button.refresh')" @click="onRefresh"><i class="iconfont icon-refresh"></i></span>
            </div>
        </template>
    </div>


    <Confirm :confirm="confirm" @cancel="onCancelConfirm" @confirm="onOperateConfirm"></Confirm>
</template>

<script setup lang="ts">
import {useI18n} from 'vue-i18n';
import {ref, reactive, watch} from "vue";
import {useRouter,useRoute} from 'vue-router'
import {Base, Common, File} from "@renderer/utils";
import type {PageInter, ConfirmInter} from "@renderer/utils/types";
import {deleteFileInfoRecord} from "@renderer/api/file";

import Confirm from "@renderer/components/Confirm.vue";

interface Props {
    file: {
        file_id:number,
        file_date: string,
        file_modified:string,
        file_name: string,
        file_author: string,
        file_mine_type: string,
        file_path: string,
        file_size:number,
        file_total:number,
        file_status: string
    }
}

const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const emit = defineEmits(['operate','cancel','refresh','confirm','upload'])
const props = defineProps<Props>()
const page:PageInter = reactive({show: false, actions:{}})
const confirm:ConfirmInter = reactive({show: false});
const edit:boolean = ref(true);

page.actions.onDeleteFile = async function () {
    try {
        Common.cancelConfirm(confirm);
        const {file_id, file_path} = props.file;
        const params = { file_id: file_id};
        const res = await deleteFileInfoRecord(params);
        if(res.code != 200) {
            return false;
        }

        const cover_path = File.getFileCoverById(file_id);
        File.deleteFile(file_path);
        File.deleteFile(cover_path);
        router.back();
    } catch (err) {
        Base.printErrorLog('deleteFileInfoRecord',err);
    }
}

const onOpenFolder = function () {
    const path = props.file.file_path;
    if(!File.isExists(path)) {
        Common.showAlert(confirm,t("alert.content.inexistence"));
        return false;
    }

    window.electron.ipcRenderer.send('openpath', path);
}

const onShowFileEdit = function () {
    emit('operate',{key:'edit', value: true})
}

const onDeleteFile = function () {
    Common.showConfirm(confirm,t("confirm.delete.content"),'onDeleteFile',t("confirm.delete.title"));
}

const onCancelConfirm = function () {
    Common.cancelConfirm(confirm);
}

const onOperateConfirm = function () {
    Common.operateConfirm(confirm, page);
}

const onShowUpload = function () {
    emit('upload')
}

const onRefresh = function () {
    emit('refresh')
}

const onGoBack = async function () {
    router.back();
}

watch(() => props.file.file_path,(value)=>{
    page.show = !Base.isEmpty(value)
})
</script>


