<template>
    <div v-if="show" :class="page.show ? 'uploader-mask opacity':'uploader-mask'"></div>
    <div v-if="show" :class="page.show ? 'uploader-wrap opacity':'uploader-wrap'">
        <div class="uploader-inner">
            <div class="uploader-header">
                <span class="title">{{t('uploader.title')}}</span>
                <span class="iconfont icon-close" @click="onClose"></span>
            </div>
            <div class="uploader-main" ref="upload">
                <p class="icon">
                    <i class="iconfont icon-upload"></i>
                    <em></em>
                </p>
                <p class="title">{{t('uploader.explain')}} <span>{{t('uploader.choose')}}</span></p>
                <p class="subtitle">{{t('uploader.accept')}}</p>

                <input ref="filePaste" class="filePaste-ipt"/>
                <input ref="fileInput" class="file-ipt" type="file" title="" :accept="page.accept" multiple @change="changeFile" />
            </div>
            <div v-if="files.show" class="uploader-footer">
                <div class="uploader-footer-header">Upload Files Result: <span>{{files.current}}/{{files.total}}</span></div>
                <div :class="files.total <= 4 ? 'uploader-footer-main scrollbar': 'uploader-footer-main scrollbar pr-s' ">
                    <div v-for="(item,index) in files.data" :key="index" class="item">
                        <span class="title" :title="item.file.name">{{item.file.name}}</span>
                        <span v-if="item.status == 'success'"><i class="iconfont icon-success"></i></span>
                        <span v-if="item.status == 'fail'">
                            <Tooltips :content="item.message" placement="left">
                                <i class="iconfont icon-warn"></i>
                            </Tooltips>
                        </span>

                        <div v-if="item.status == 'uploading'" class="loading-wrap">
                            <div class="loading-inner">
                                <div class="rect"></div>
                                <div class="rect rect-two"></div>
                                <div class="rect rect-three"></div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
<!--            <div class="uploader-tips">-->
<!--                <p class="subtitle">{{t('uploader.accept')}}</p>-->
<!--            </div>-->
        </div>
    </div>

    <Confirm :confirm="confirm" @cancel="onCancelConfirm" @confirm="onOperateConfirm"></Confirm>
</template>

<script setup lang="ts">
import {useI18n} from 'vue-i18n';
import {ref, reactive, onMounted, onUnmounted, watch} from "vue";
import {Base, Common, File} from "@renderer/utils";
import type { ConfirmInter} from "@renderer/utils/types";

import {usePageStore} from '@renderer/stores/page'
import {isFileExist, addFile, updateFileInfo} from "@renderer/api/file";
import {getNhentaiList} from "@renderer/api/nhentai";

import Confirm from "@renderer/components/Confirm.vue";
import Tooltips from "@renderer/components/Tooltips.vue";

import {Archive} from 'libarchive.js/main.js';

interface Props {
    show: boolean,
}

interface Page {
    show: boolean,
    accept: string,
    refresh: boolean,
    status: boolean
}



interface Files {
    show: boolean,
    current: number,
    total: number,
    data: {
        status: string,
        scene?: string,
        message?: string,
        file:File
    }[]
}

const { t } = useI18n();
const emit = defineEmits(['hide'])
const props = defineProps<Props>()
const pageStore = usePageStore();
const upload:{value?:any} = ref(null)
const filePaste:{value?:any} = ref(null)
const fileInput:{value?:any} = ref(null)
const page:Page = reactive({
    show: true,
    accept:'.zip,.rar,.7z,.tar',
    refresh: false,
    status: false
})
const files:Files = reactive({show: false, current: 0, total: 0, data:[] });
const confirm:ConfirmInter = reactive({show: false});


const init = function (value:boolean) {
    if(value == false) {
        return false;
    }

    page.refresh = false;
    page.status = false;
    Object.assign(files,{show: false, current: 0, total: 0, data:[]})
    setTimeout(() => {
        upload.value.addEventListener('drop', handleDrop)
        upload.value.addEventListener('dragleave', handleDragleave)
        upload.value.addEventListener('dragenter', handleDragenter)
        upload.value.addEventListener('dragover', handleDragenter)
        upload.value.addEventListener('mouseover', handleMouseover);
        upload.value.addEventListener('mouseout', handleMouseout);
    },4)
}

const isAcceptFile = function (file):boolean {
    const ext = File.getFileExt(file.path)
    const data = page.accept.split(',');

    if(data.includes('.'+ext)) {
        return true;
    }

    return false;
}

const preprocessUploadFile = async function (file) {
    if(!isAcceptFile(file)) { //校验上传的文件类型
        return { status: 'fail', scene:'preprocess',message:t('uploader.accept')};
    }

    try {
        const {name} = file
        const params = { name: name };
        const res = await isFileExist(params);
        if(res.code !== 200) {
            return { status: 'fail', scene:'preprocess', message:t('uploader.database') };
        }

        if(Base.getDataLength(res.data) == 0) { //文件存在上传过的记录
            return await insertFileInfoRecord(file);
        }

        return await checkUploadFile(file, res.data[0]);
    } catch (err) {
        return { status: 'fail', scene: 'preprocess',  message:t('uploader.accident')};
    }
}

const checkUploadFile = async function (file, record) {
    const {file_id, file_path, file_status} = record;
    if(file_status == 'normal' && File.isExists(file_path)) {
        return { status: 'fail', scene:'check', message:t('uploader.exist') }
    }

    if(file.path != file_path) { //如果文件路径不一样,删除旧的文件
        File.deleteFile(file_path);
    }

    return await updateFileInfoRecord(file_id, file); //文件被删除,转移或掉失,需要更新信息
}

const updateFileInfoRecord = async function(file_id, file) {
    try {
        const archive = await Archive.open(file);
        const extract = await archive.extractFiles();

        const params = {
            file_id: file_id,
            data: {
                file_path: file.path,
                file_size: file.size,
                file_status: 'normal',
                file_mine_type: file.type,
                file_total: File.getExtractFileTotal(extract)
            }
        }
        const res = await updateFileInfo(params)
        if(res.code != 200) {
            return { status: 'fail', scene:'update', message:t('uploader.database') };
        }

        await createFileCover(file_id, extract);
        await getNhentaiList({file_id:file_id, file_name: file.name});

        return { status: 'success', scene: 'update'};
    } catch (err) {
        Base.printErrorLog('updateFileInfo',err);
        return { status: 'fail', scene: 'update', message:t('uploader.accident')};
    }
}

const createFileCover = async function (file_id, extract) {
    const cover = await File.getExtractFileCover(extract);
    File.createCoverByBase64(file_id, cover);
}

const insertFileInfoRecord = async function (file) {
    try {
        const archive = await Archive.open(file);
        const extract = await archive.extractFiles();
        const data = {
            'file_name': file.name,
            'file_mine_type': file.type,
            'file_size': file.size,
            'file_path': file.path,
            'file_total': File.getExtractFileTotal(extract)
        }

        const res = await addFile(data);
        if(res.code != 200) {
            return { status: 'fail', scene: 'insert', message:t('uploader.database')};
        }

        const file_id = res.data;
        await createFileCover(file_id, extract);
        await getNhentaiList({file_id:file_id, file_name: file.name});

        return { status: 'success', scene: 'insert'};
    } catch (err) {
        Base.printErrorLog('addFile', err)
        return { status: 'fail', scene: 'insert', message: t('uploader.accident')};
    }
}

const handleFileName = async function (fileList:FileList){
    if(page.status == true) {
        Common.showAlert(confirm,t("uploader.tips"));
        return false;
    }

    const total = Base.getDataLength(files.data);
    const data = Array.from(fileList)
    if(Base.isEmpty(data)) {
        return false;
    }

    try {
        page.status = true;
        files.show = true;
        files.current = total == 0 ? 0 : total;
        files.total = total + Base.getDataLength(data);
        for (let i in data) {
            files.current++;
            let file:File = data[i];
            files.data.unshift({file: file, status: 'uploading'})
            files.data[0] = {...files.data[0], ...await preprocessUploadFile(data[i])}
            if(files.data[0].status == 'success') {
                page.refresh = true;
            }
        }
    } catch (err) {
        Base.printErrorLog('handleFileName',err);
    } finally {
        page.status = false;
        fileInput.value.value = null;
    }
}

const changeFile = (e) => {
    e.preventDefault()
    handleFileName(e.target.files)
}

const handleDrop = (e) => {
    e.preventDefault()
    handleFileName(e.dataTransfer.files)
}

const handleDragleave = (e) => {
    e.preventDefault()
}

const handleDragenter = (e) => {
    e.preventDefault()
}

const handlePaste = (e) => {
    e.preventDefault()
    handleFileName(e.clipboardData.files)
}

const handleMouseover = function (event) {
    filePaste.value.focus()
    filePaste.value.addEventListener('paste', handlePaste)
}

const handleMouseout = function (event) {
    filePaste.value.blur()
    filePaste.value.removeEventListener('paste', handlePaste)
}

const onClose = function () {
    if(page.status == true) {
        Common.showAlert(confirm,t("uploader.tips"));
        return false;
    }

    upload.value.removeEventListener('drop', handleDrop)
    upload.value.removeEventListener('dragleave', handleDragleave)
    upload.value.removeEventListener('dragenter', handleDragenter)
    upload.value.removeEventListener('dragover', handleDragenter)
    upload.value.removeEventListener('mouseover', handleMouseover);
    upload.value.removeEventListener('mouseout', handleMouseout);
    emit('hide',{refresh:page.refresh})
}

const onCancelConfirm = function () {
    Common.cancelConfirm(confirm);
}

const onOperateConfirm = function () {
    Common.operateConfirm(confirm, page);
}

watch(() => props.show,(value)=>{
    init(value)
    //延时显示，动画效果更佳
    setTimeout(()=> {page.show = value},10)
})
</script>

<style scoped lang="scss">
.uploader {
    &-mask {
        position: fixed;
        top: 0;
        left: 0;
        z-index: 5;
        width: 100%;
        height: 100%;

        background-color: rgba(0, 0, 0, 0.3);
        transition: opacity var(--transition-delay-default) var(--transition-timing-default);;
        opacity: 0;
    }

    &-wrap {
        display: flex;
        align-items: center;
        justify-content: center;

        position: fixed;
        top: 0;
        left: 0;
        z-index: 6;
        width: 100%;
        height: 100%;

        transition: opacity var(--transition-delay-default) var(--transition-timing-default);;
        opacity: 0;
    }

    &-inner {
        width: 480px;

        background: #FFF;
        border-radius: 8px;
        overflow: hidden;
    }

    &-header {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: var(--spacing-m);
        background: var(--background-color-secondary);

        color: var(--content-color-secondary);
        .title {
            padding: var(--spacing-xs) 0;
            margin-left: var(--spacing-s);
            color: var(--content-color-secondary);
            font-size: var(--text-size-m);
            font-weight: var(--text-weight-medium);
            opacity: 1;
        }

        .icon-close {
            position: absolute;
            top: 7px;
            right: 10px;
            cursor: pointer;
            width: 36px;
            height: 36px;
            line-height: 36px;
            text-align: center;
            font-size: var(--text-size-m);
            font-weight: var(--text-weight-medium);

            &:hover {
                color: var(--content-color-primary);
                background: var(--background-color-tertiary);
                border-radius: var(--border-radius-default);
            }
        }
    }

    &-main {
        position: relative;
        text-align: center;
        height: 155px;
        margin: 20px ;
        border: dashed 1px var(--border-color-default);
        border-radius: var(--border-radius-default);

        .file-ipt {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            opacity: 0;
            cursor: pointer;
            z-index: 2;
        }

        .filePaste-ipt {
            position: fixed;
            right: -100vw;
            opacity: 0;
            z-index: 2;
        }

        &:hover {
            border-color: var(--grey-40);

            .icon-upload {
                color: var(--grey-50);
            }

            .title {
                color: var(--content-color-secondary);
                span { color: var(--blue-40); }
            }
        }

        .icon {
            position: relative;
            display: block;
            width: 45px;
            height: 45px;
            line-height: 45px;
            margin: 30px auto 10px;

            background: var(--background-color-secondary);
            border-radius: var(--border-radius-max);

            em {
                position: absolute;
                bottom: 0px;
                left: 0px;
                width: 100%;
                height: 10px;
                background: var(--background-color-secondary);
                border-radius: var(--border-radius-max);
            }

            &::before {
                content:  '';
                position: absolute;
                top: 14px;
                right: -10px;

                width: 30px;
                height: 30px;

                background: var(--background-color-secondary);
                border-radius: var(--border-radius-max);
            }

            &::after {
                content:  '';
                position: absolute;
                top: 14px;
                left: -10px;

                width: 30px;
                height: 30px;

                background: var(--background-color-secondary);
                border-radius: var(--border-radius-max);
            }

            i {
                position: relative;
                font-size: 28px;
                color: var(--grey-50);
                z-index: 1;
            }
        }

        .title {
            font-size: var(--text-size-m);
            color: var(--content-color-secondary);
            font-weight: bolder;
            span {
                //color: var(--blue-40);
                //color: var(--grey-50);
                text-decoration: underline;
            }
        }

        .subtitle {
            padding-top: 5px;
            font-size: var(--text-size-s);
            color: var(--grey-40);
        }
    }

    &-footer {
        margin-top: -5px;
        padding: 0 20px 25px;
        &-header {
            display: flex;
            justify-content: space-between;
            padding-bottom: var(--spacing-l)
        }

        &-main {
            max-height: 210px;
            overflow-y: auto;
            .item {
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: var(--spacing-s);
                margin-bottom: var(--spacing-s);

                background: var(--background-color-secondary);
                border-radius: var(--border-radius-default);

                &:last-child {
                    margin-bottom: 0;
                }

                span {
                    display: flex;
                    align-items: center;

                    .icon-success {
                        color: var(--base-color-success);
                    }

                    .icon-warn {
                        color: var(--base-color-error);
                    }

                    &:first-child {
                        width: 65%;

                        display: -webkit-box;
                        -webkit-box-orient: vertical;
                        -webkit-line-clamp: 1;
                        overflow: hidden;

                    }
                }
            }
        }
    }

    &-tips {
        margin-top: -10px;
        padding: 0px 20px 15px;
    }
}

.opacity {
    opacity: 1;
}

.loading {
    &-wrap {
        display: flex;
        align-items: center;
        justify-content: center;
    }


    &-inner {
        display: flex;
        justify-content: space-between;

        width: var(--size-xs,16px);
        height: var(--size-xs,16px);
        font-size: var(--text-size-xs,10px);
        opacity: 0.75;

        .rect {
            width: 4px;
            height: 100%;

            border-radius: 8px;
            background: var(--content-color-tertiary);
            animation: spinner-bounce 0.6s infinite ease-in-out;
            transform-origin: center;
            opacity: 0.2;
        }

        .rect-two {
            animation-delay: 0.15s;
        }

        .rect-three {
            animation-delay: 0.3s;
        }
    }
}
</style>
