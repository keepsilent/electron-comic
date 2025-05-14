<template>
    <!-- Toolbar -->
    <div class="toolbar-wrap">
        <div class="toolbar-left">
            <span class="operate-btn" :title="$t('tool.increase')" @click="onShowUpload"><i class="iconfont icon-increase"></i><em>{{$t('button.increase')}}</em></span>
            <span class="operate-btn forbiden" :title="$t('tool.open')"><i class="iconfont icon-file"></i><em>{{$t('button.open')}}</em></span>
            <span class="operate-btn forbiden" :title="$t('tool.edit')" ><i class="iconfont icon-feedback"></i><em>{{$t('button.edit')}}</em></span>
            <span class="operate-btn forbiden" :title="$t('tool.delete')"><i class="iconfont icon-delete"></i><em>{{$t('button.delete')}}</em></span>
        </div>

        <div class="toolbar-right">
            <span class="operate-btn" :title="$t('tool.more')" @click.stop="onShowMoreMenu"><i class="iconfont icon-more"></i></span>
        </div>
    </div>

    <!-- More Menu -->
    <div v-if="page.more" class="toolbar-more-menu-wrap" @click.stop>
        <em class="up"></em>
        <div class="toolbar-more-menu-inner">

            <div class="item" data-key="view" @mouseenter="onSubItemFoucs">
                <span><i :class="['iconfont',getViewIcon()] "></i><em>{{t('button.view')}}</em></span>
                <i class="iconfont icon-return"></i>

                <!-- View Menu -->
                <div ref="view" class="toolbar-more-sub-menu-wrap" :style="'left:'+(page.submenu.view.left)">
                    <div class="toolbar-more-sub-menu-inner">
                        <div v-for="(item,index) in page.view.data" :key="index" :data-value="item.value" :class="item.value === page.view.current ? 'sub-item active': 'sub-item'" @click="onSwitchView">
                            <em><i class="dot"></i></em>
                            <em :class="['iconfont',item.icon]"></em>
                            {{item.name}}
                        </div>
                    </div>
                </div>
            </div>

            <div class="item" data-key="order" @mouseenter="onSubItemFoucs">
                <span><i class="iconfont icon-order"></i><em>{{t('button.order')}}</em></span>
                <i class="iconfont icon-return"></i>

                <!-- Order Menu -->
                <div ref="order" class="toolbar-more-sub-menu-wrap" :style="'left:'+(page.submenu.order.left)">
                    <div class="toolbar-more-sub-menu-inner">
                        <div v-for="(item,index) in page.order.mode.data" :key="index" :data-value="item.value" :class="item.value === page.order.mode.current ? 'sub-item active': 'sub-item'" @click="onSwitchOrderMode">
                            <em><i class="dot"></i></em>{{item.name}}
                        </div>
                        <div class="line"></div>
                        <div v-for="(item,index) in page.order.sort.data" :key="index" :data-value="item.value"  :class="item.value === page.order.sort.current ? 'sub-item active': 'sub-item'" @click="onSwitchOrderSort">
                            <em><i class="dot"></i></em>{{item.name}}
                        </div>
                    </div>
                </div>
            </div>

            <div class="item" @click="onRefresh"><span><i class="iconfont icon-refresh"></i><em>{{t('button.refresh')}}</em></span></div>
            <div class="line"></div>
            <div class="item" @click="onShowUpload"><span><i class="iconfont icon-increase"></i><em>{{t('button.increase')}}</em></span></div>
            <div class="line"></div>
            <div class="item" @click="onGoBack"><span><i class="iconfont icon-back"></i><em>{{t('button.return')}}</em></span></div>
            <div class="item" @click="onShowSetting"><span><i class="iconfont icon-setting"></i><em>{{t('button.settings')}}</em></span>
            </div>
        </div>
    </div>

    <Confirm :confirm="confirm" @cancel="onCancelConfirm" @confirm="onOperateConfirm"></Confirm>
</template>

<script setup lang="ts">
import {useI18n} from 'vue-i18n';
import {reactive, ref, watch } from "vue";
import {useRouter,useRoute} from 'vue-router'
import {Base, Common, File} from "@renderer/utils";
import type {ConfirmInter} from "@renderer/utils/types";
import {updateFileStatus} from "@renderer/api/file";
import {usePageStore} from '@renderer/stores/page'

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
const route = useRoute();
const router = useRouter();
const emit = defineEmits(['cancel','confirm','order','upload','refresh'])
const props = defineProps<Props>()
const pageStore = usePageStore();
const view = ref(null);
const order = ref(null);
const page = reactive({
    show: false,
    actions:{},
    more: false,
    view: {
        current: pageStore.toolbar.view,
        data: [
            {name: t('tool.view.super'),value: 'super',icon: 'icon-super-large-icon'},
            {name: t('tool.view.large'),value: 'large',icon: 'icon-large-icon'},
            {name: t('tool.view.middle'),value: 'middle',icon: 'icon-middle-icon'},
            {name: t('tool.view.small'),value: 'small',icon: 'icon-small-icon'}
        ]
    },
    order: {
        mode: {
            current: pageStore.order.file.mode,
            data: [
                {name: t('tool.order.name'),value: 'name'},
                // {name: t('tool.order.size'),value: 'size'},
                {name: t('tool.order.type'),value: 'type'},
                {name: t('tool.order.date'),value: 'date'},
            ]
        },
        sort: {
            current: pageStore.order.file.sort,
            data: [
                {name: t('tool.order.asc'),value: 'asc'},
                {name: t('tool.order.desc'),value: 'desc'}
            ]
        }
    },
    submenu: {
        view: { width: 0, left: 0},
        order: { width: 0, left: 0}
    }
})
const confirm:ConfirmInter = reactive({show: false});

page.actions.onDeleteFile = async function () {
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

const onCancelConfirm = function () {
    Common.cancelConfirm(confirm);
}

const onOperateConfirm = function () {
    Common.operateConfirm(confirm, page);
}

const onShowMoreMenu = function () {
    page.more = true;
    pageStore.toolbar.more = true;
}

const onSwitchOrderMode = function ({currentTarget: {dataset: {value}}}) {
    const mode = page.order.mode.current
    if(mode == value) {
        setHideMoreMenu()
        return false
    }

    setHideMoreMenu()
    page.order.mode.current = value;
    pageStore.order.file.mode = value;
    localStorage.setItem('cm_setting_order_file_mode',value);
    setOrderConfig();
}

const onSwitchOrderSort = function ({currentTarget: {dataset: {value}}}) {
    const mode = page.order.sort.current
    if(mode == value) {
        setHideMoreMenu()
        return false
    }

    setHideMoreMenu()
    page.order.sort.current = value;
    pageStore.order.file.sort = value;
    localStorage.setItem('cm_setting_order_file_sort',value);
    setOrderConfig();
}

const setOrderConfig = function () {
    emit('order',{
        'mode': page.order.mode.current,
        'sort': page.order.sort.current
    })
}

const onShowSetting = function () {
    setHideMoreMenu()
    pageStore.pop.setting = true;
}

const onGoBack = async function () {
    setHideMoreMenu();
    router.back();
}

const setHideMoreMenu = function () {
    page.more = false;
    pageStore.toolbar.more = false;
}

const onSubItemFoucs = async function ({currentTarget: {dataset: {key}}}) {
    if(page.submenu[key].width != 0) {
        return false;
    }

    let width = 0;
    switch (key) {
        case 'view':
            width = view.value.offsetWidth
            break;
        case 'order':
            width = order.value.offsetWidth
            break
    }

    page.submenu[key].width = width;
    page.submenu[key].left = ((width - 5) * - 1) + 'px';
}

const onSwitchView = function ({currentTarget: {dataset: {value}}}) {
    page.view.current = value;

    pageStore.toolbar.more = false;
    pageStore.toolbar.view = value;
    localStorage.setItem('cm_setting_view',value);
}

const onShowUpload = function () {
    emit('upload');
    pageStore.toolbar.more = false;
}

const onRefresh = function () {
    emit('refresh');
    pageStore.toolbar.more = false;
}

const getViewIcon = function () {
    let icon = '';
    switch (page.view.current) {
        case 'super':
            icon = 'icon-large-icon';
            break;
        default:
            icon = `icon-${page.view.current}-icon`;
            break
    }
    return icon;
}

watch(() => pageStore.toolbar.more,(value)=> {
    page.more = value;
})
</script>
