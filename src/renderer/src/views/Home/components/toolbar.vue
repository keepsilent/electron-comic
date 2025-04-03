<template>
    <!-- 工具栏 -->
    <div class="toolbar">

            <div class="operate">
                <span class="operate-btn" :title="$t('tool.increase')">
                    <i class="iconfont icon-increase"></i>
                    <em>{{$t('button.increase')}}</em>
                    <input type="file" ref="upload" title="Upload File" accept=".zip,.txt,.pdf" @change="onUpload">
                </span>
                <span class="operate-btn forbiden" :title="$t('tool.open')" @click="onOpenFolder"><i class="iconfont icon-file"></i><em>{{$t('button.open')}}</em></span>
                <span class="operate-btn forbiden" :title="$t('tool.edit')" ><i class="iconfont icon-feedback"></i><em>{{$t('button.edit')}}</em></span>
                <span class="operate-btn forbiden" :title="$t('tool.delete')" @click="onDeleteFile"><i class="iconfont icon-delete"></i><em>{{$t('button.delete')}}</em></span>
            </div>

            <div class="more">
                <span class="operate-btn" :title="$t('button.more')"><i class="iconfont icon-more"></i></span>
            </div>
    </div>

    <Confirm :confirm="confirm" @cancel="onCancelConfirm" @confirm="onOperateConfirm"></Confirm>
</template>

<script setup lang="ts">
import {useI18n} from 'vue-i18n';
import {reactive, ref, watch } from "vue";
import {Base, Common, File} from "@renderer/utils";
import type {PageInter, ConfirmInter} from "@renderer/utils/types";
import {getFileList, isFileExist, addFile,updateFileStatus} from "@renderer/api/file";
import Confirm from "@renderer/components/Confirm.vue";
import {Archive} from 'libarchive.js/main.js';

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
const upload:string = ref(null);

page.actions.onDeleteFile = async function ():boolean {
    try {
        const {id} = props.file;
        // if (File.deleteFile(path) == false) {
        //     Common.showAlert(confirm,t("alert.content.delete.fail"));
        //     return false;
        // }
        const params = { id: id, status: 'delete'};
        const res = await updateFileStatus(params);
        if(res.code != 200) {
            return false;
        }
    } catch (err) {
        Base.printErrorLog('deleteFile',err);
    } finally {
        Common.cancelConfirm(confirm);
    }
}


const setArchive = function () {
    Common.setArchive(Archive);
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
    // const path = props.file.path;
    // if(!File.isExists(path)) {
    //     Common.showAlert(confirm,t("alert.content.inexistence"));
    //     return false;
    // }

    Common.showConfirm(confirm,t("confirm.delete.content"),'onDeleteFile',t("confirm.delete.title"));
}


const isUploaded = async function (name,type) {
    try {
        const params = {name: name, type: type};
        const res = await isFileExist(params);

        if(res.code !== 200) {
            return true;
        }

        if(Base.getDataLength(res.data) >= 1) {
            return true
        }

        return false;
    } catch (err) {
        Base.printErrorLog('isFileExist',err)
        return true;
    }
}

const onUpload = async function (event) {
    if (event.length == 0) {
        Common.showAlert(confirm,'Please select the file you upload','Upload File Tips');
        upload.value.value = null;
        return false;
    }

    try {
        Common.showLoading(page);
        const [file] = event.target.files;
        const archive = await Archive.open(file);
        const extract = await archive.extractFiles();

        if(await isUploaded(file.name,file.type)) {
            Common.showAlert(confirm,`${File.getFileAlias(file.name)} already exist!`,'Upload File Tips');
            return false;
        }

        await uploadFile(file, extract);
    } catch (err) {
        console.error('err',err)
    } finally {
        Common.hideLoading(page);
        upload.value.value = null;
    }
}

const uploadFile = async function ( file,extract) {
    try {
        const data= {
            name: file.name,
            author: '',
            type: file.type,
            size: file.size,
            path: file.path,
            total: File.getExtractFileTotal(extract),
        }

        const cover = await File.getExtractFileCover(extract);
        const res = await addFile(data);
        if(res.code != 200) {
            return false
        }

        File.createCoverByBase64(res.data, cover)

        console.log('addSingleFile res',res);
    } catch (err) {
        Base.printErrorLog('addFile', err)
    }
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
