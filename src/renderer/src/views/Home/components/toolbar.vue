<template>
    <!-- 工具栏 -->
    <div class="toolbar" @click="onContent">

            <div class="operate">
<!--                <span class="operate-btn" :title="$t('tool.return')" @click="onGoBack">-->
<!--                    <i class="iconfont icon-round-right"></i>-->
<!--                    <em>{{$t('button.return')}}</em>-->
<!--                </span>-->
                <span class="operate-btn" :title="$t('tool.upload')">
                    <i class="iconfont icon-upload"></i>
                    <em>{{$t('button.upload')}}</em>
                    <input type="file" ref="upload" title="Upload File" accept=".zip,.txt,.pdf" @change="onUpload">
                </span>
                <span class="operate-btn forbiden" :title="$t('tool.open')" @click="onOpenFolder"><i class="iconfont icon-file"></i><em>{{$t('button.open')}}</em></span>
                <span class="operate-btn forbiden" :title="$t('tool.edit')" ><i class="iconfont icon-feedback"></i><em>{{$t('button.edit')}}</em></span>
                <span class="operate-btn forbiden" :title="$t('tool.delete')" @click="onDeleteFile"><i class="iconfont icon-delete"></i><em>{{$t('button.delete')}}</em></span>
            </div>

            <div class="more">
                <span class="operate-btn" :title="$t('tool.sort')" @click.stop="onShowOrderMenu"><i class="iconfont icon-more"></i></span>
            </div>
    </div>

    <!-- Order Menu -->
    <div v-if="order.show" class="order-menu">
        <em class="up-icon"></em>
        <ul>
            <li v-for="(item,index) in order.typeData" :key="index" :data-value="item.value" :class="{'active': item.value === order.type}" @click="onOrderType">
                <em><i class="iconfont icon-check"></i></em>{{item.name}}
            </li>
        </ul>
        <ul class="line">
            <li v-for="(item,index) in order.methodData" :key="index" :data-value="item.value" :class="{'active': item.value === order.method}" @click="onOrderMethod">
                <em><i class="iconfont icon-check"></i></em>{{item.name}}
            </li>
        </ul>
    </div>

    <Confirm :confirm="confirm" @cancel="onCancelConfirm" @confirm="onOperateConfirm"></Confirm>
</template>

<script setup lang="ts">
import {useI18n} from 'vue-i18n';
import {reactive, ref, watch } from "vue";
import {useRouter,useRoute} from 'vue-router'
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
const route = useRoute();
const router = useRouter();
const emit = defineEmits(['cancel','confirm','sort'])
const props = defineProps<Props>()
const page:PageInter = reactive({show: false, actions:{}})
const confirm:ConfirmInter = reactive({show: false});
const upload:string = ref(null);
const order = reactive({
    show: false,
    type: 'name',
    method: 'desc',
    typeData: [
        {name: t('tool.order.name'),value: 'name'},
        {name: t('tool.order.size'),value: 'size'},
        {name: t('tool.order.type'),value: 'type'},
        {name: t('tool.order.date'),value: 'date'},
    ],
    methodData: [
        {name: t('tool.order.desc'),value: 'desc'},
        {name: t('tool.order.asc'),value: 'asc'}
    ],
})

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

const uploadFile = async function ( file, extract) {
    try {
        const data= {
            'file_name': file.name,
            'file_mine_type': file.type,
            'file_size': file.size,
            'file_path': file.path,
            'file_total': File.getExtractFileTotal(extract),
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


const onShowOrderMenu = function () {
    const type = localStorage.getItem('cm_setting_sort_type') || 'name';
    const method = localStorage.getItem('cm_setting_sort_method') || 'desc';

    order.show = true;
    order.type = type;
    order.method = method;
}

const onOrderType = function ({currentTarget: {dataset: {value}}}) {
    const type = localStorage.getItem('cm_setting_sort_type') || 'name';
    if(type == value) {
        order.show = false;
        return false
    }

    order.show = false;
    order.type = value;
    localStorage.setItem('cm_setting_sort_type',value);
    setSort();
}

const onOrderMethod = function ({currentTarget: {dataset: {value}}}) {
    const method = localStorage.getItem('cm_setting_sort_method') || 'desc';
    if(method == value) {
        order.show = false;
        return false
    }

    order.show = false;
    order.method = value;
    localStorage.setItem('cm_setting_sort_method',value);
    setSort();
}

const setSort = function () {
    const {type, method} = order
    emit('sort',{'order': type,'sort': method})
}

const onHideOrderMenu = function () {
    order.show = false;
}

const onContent = function () {
    order.show = false;
}

const onGoBack = async function () {
    router.back();
}

defineExpose({ onHideOrderMenu })
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
            &:hover {
                color: var(--content-color-tertiary);
                background: transparent;
            }
        }
    }
}

/** 排序菜单 **/
.order-menu {
    position: fixed;
    top: 87px;
    right: 10px;

    background: #FFF;
    z-index: 1;
    border-radius: var(--border-radius-default);
    box-shadow: 1px 2px 10px rgba(0, 0, 0, .15);
    overflow: hidden;

    .up-icon {
        position: fixed;
        top: 72px;
        right: 17px;
        right: 17px;
        border: solid 8px transparent;
        border-bottom-color: #FFF;
    }

    ul {
        &.line {
            border-top: solid 1px var(--border-color-default);
        }

        li {
            line-height: 35px;
            padding-right: var(--spacing-l);
            cursor: pointer;

            &.active {
                em i {
                        display: block;
                }

                &:hover {
                    em i {
                        color: var(--content-color-secondary);
                    }
                }
            }

            em {
                display: block;
                float: left;
                width: 30px;
                height: 35px;
                padding-left: 10px;
                margin-right: 10px;
                background: var(--background-color-secondary);
                border-right: solid 1px var(--border-color-default);

                i {
                    display: none;
                }
            }


            &:hover {
                background: var(--background-color-secondary);

                em {
                    background: transparent;
                    i {
                        display: block;
                        color: var(--grey-40);
                    }
                }
            }
        }
    }
}
</style>
