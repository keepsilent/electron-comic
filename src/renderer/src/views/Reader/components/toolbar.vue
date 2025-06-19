<template>
    <!-- Toolbar -->
    <div class="toolbar-wrap">
        <template v-if="page.show">
            <div class="toolbar-menu">
                <span class="operate-btn" @click="onUpload"><i class="iconfont icon-roundadd"></i><em>{{$t('button.increase')}}</em></span>
                <span class="separation-line"></span>
                <span class="operate-btn" :title="$t('tool.open')" @click="onOpenFolder"><i class="iconfont icon-file1"></i></span>
                <span class="operate-btn" :title="$t('tool.edit')" @click="onShowFileEdit"><i class="iconfont icon-edit"></i></span>
                <span class="operate-btn" :title="$t('tool.delete')" @click="onDeleteFile"><i class="iconfont icon-delete1"></i></span>
                <span class="separation-line"></span>
                <div class="operate-btn forbiden">
                    <i class="iconfont icon-order"></i>
                    {{$t('tool.order.title')}}
                    <i class="iconfont icon-return down"></i>
                </div>
                <div class="operate-btn forbiden" >
                    <i :class="['iconfont',getViewIcon()]"></i>
                    {{$t('tool.view.title')}}
                    <i class="iconfont icon-return down"></i>
                </div>
            </div>

            <div class="toolbar-right">
                <span class="operate-btn" :title="$t('button.more')" @click.stop="onShowMoreMenu"><i class="iconfont icon-more"></i></span>
            </div>
        </template>
    </div>

    <!-- More Menu -->
    <div v-if="page.more" class="toolbar-more-menu-wrap" @click.stop>
        <em class="up"></em>
        <div class="toolbar-more-menu-inner">
            <div class="item" data-key="open" @mouseenter="onSubItemFoucs">
                <span>
                    <i :class="['iconfont','icon-file1'] "></i>
                    <em class="title">{{$t('tool.more.open.title')}}</em>
                </span>
                <i class="iconfont icon-return"></i>

                <!-- View Menu -->
                <div ref="open" class="toolbar-more-sub-menu-wrap" :style="'left:'+(page.submenu.open.left)">
                    <div class="toolbar-more-sub-menu-inner">
                        <div v-for="(item,index) in page.open.data" :key="index" :data-value="item.value" class="sub-item" @click="onSwitchOpen">
                            {{item.name}}
                        </div>
                    </div>
                </div>
            </div>

            <div class="line"></div>
            <div class="item" @click="onReturn"><span><i class="iconfont icon-back"></i><em class="title">{{t('button.return')}}</em></span></div>
            <div class="item" @click="onRefresh"><span><i class="iconfont icon-refresh"></i><em class="title">{{t('button.refresh')}}</em></span></div>
        </div>
    </div>

    <Confirm :confirm="confirm" @cancel="onCancelConfirm" @confirm="onOperateConfirm"></Confirm>
</template>

<script setup lang="ts">
import {useI18n} from 'vue-i18n';
import {ref, reactive, watch} from "vue";
import {useRouter,useRoute} from 'vue-router'
import {Base, Common, File} from "@renderer/utils";
import type {ConfirmInter} from "@renderer/utils/types";
import {usePageStore} from '@renderer/stores/page'
import {deleteFileInfoRecord} from "@renderer/api/file";

import Confirm from "@renderer/components/Confirm.vue";

interface Props {
    file: {
        file_id: number,
        file_date?: string,
        file_modified?: string,
        file_name?: string,
        file_path?: string,
        file_status?: string,
        file_size?: string,
        file_total?: number,
        file_mine_type?: string,
        file_view?: number,
        file_intro?: string,
    }
}

interface PageInter {
    show:boolean,
    more:boolean,
    actions:any,
    open:{
        data:{name:string,value:string}[]
    },
    submenu: {
        open: {width: number,left:number}
    }
}

const {t} = useI18n();
const route = useRoute();
const router = useRouter();
const pageStore = usePageStore();
const open = ref<any>(null);
const emit = defineEmits(['operate','cancel','refresh','confirm','upload'])
const props = defineProps<Props>()
const page = reactive<PageInter>({
    show: false,
    more: false,
    actions:{
        onDeleteFile:async function () {
            try {
                Common.cancelConfirm(confirm);
                const {file_id, file_date, file_path} = props.file;
                const params = { file_id: file_id};
                const res = await deleteFileInfoRecord(params);
                if(res == false) {
                    Common.showAlert(confirm,t("confirm.delete.fail.content"),t("confirm.delete.fail.title"));
                    return false;
                }

                const cover_path = File.getFileCoverById(file_id.toString(), file_date || '');
                File.deleteFile(file_path || '');
                File.deleteFile(cover_path);

                router.back();
                pageStore.page.back = pageStore.page.back+1;
            } catch (err) {
                Base.printErrorLog('deleteFileInfoRecord',err);
            }
        }
    },
    submenu: {
        open: { width: 0, left: 0}
    },
    open: {
        data: [
            {name: t('tool.more.open.app'), value: 'app'},
            {name: t('tool.more.open.cache'), value: 'cache'},
            {name: t('tool.more.open.database'), value: 'database'}
        ]
    }
})

const confirm = reactive<ConfirmInter>({show: false, content: ''});

const getViewIcon = function():string {
    let icon = '';
    const {toolbar:{view}} = pageStore
    switch (view) {
        case 'super':
            icon = 'icon-large-icon';
            break;
        default:
            icon = `icon-${view}-icon`;
            break
    }
    return icon;
}

const onOpenFolder = function():boolean|void {
    const path = props.file.file_path;
    if(!File.isExists(path)) {
        Common.showAlert(confirm,t("alert.content.inexistence"));
        return false;
    }

    window.electron.ipcRenderer.send('openpath', path);
}

const onShowFileEdit = function():void {
    emit('operate',{key:'edit', value: true})
}

const onDeleteFile = function():void {
    Common.showConfirm(confirm,t("confirm.delete.tips.content"),'onDeleteFile',t("confirm.delete.tips.title"));
}

const onUpload = function():void {
    emit('upload')
}

const onShowMoreMenu = function():void {
    page.more = true;
    pageStore.toolbar.more = true;
    pageStore.toolbar.submenu.view = false;
    pageStore.toolbar.submenu.order = false;
}

const setHideMoreMenu = function():void {
    page.more = false;
    pageStore.toolbar.more = false;
}

const onSubItemFoucs = function(event):boolean|void {
    const {currentTarget: {dataset: {key}}} = event
    if(page.submenu[key].width != 0) {
        return false;
    }

    let width = 0;
    switch (key) {
        case 'open':
            width = open.value.offsetWidth
            break;
    }

    page.submenu[key].width = width;
    page.submenu[key].left = ((width - 5) * - 1) + 'px';
}

const onSwitchOpen = function(event):void {
    const {currentTarget: {dataset: {value}}} = event
    Common.openFolder(value);
    pageStore.toolbar.more = false;
}

const onReturn = function():void {
    setHideMoreMenu();
    router.back();
    pageStore.page.back = pageStore.page.back+1;
}

const onRefresh = function():void {
    setHideMoreMenu();
    emit('refresh')
}

const onCancelConfirm = function():void {
    Common.cancelConfirm(confirm);
}

const onOperateConfirm = function():void {
    Common.operateConfirm(confirm, page);
}

watch(() => props.file.file_path,(value)=>{
    page.show = !Base.isEmpty(value)
})

watch(() => pageStore.toolbar.more,(value)=> {
    page.more = value;
})
</script>


