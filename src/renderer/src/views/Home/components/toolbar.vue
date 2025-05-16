<template>
    <!-- Toolbar -->
    <div class="toolbar-wrap">
<!--        <div class="toolbar-left">-->
<!--            <span class="operate-btn" :title="$t('tool.increase')" @click="onShowUpload"><i class="iconfont icon-increase"></i><em>{{$t('button.increase')}}</em></span>-->
<!--            <span class="operate-btn forbiden" :title="$t('tool.open')"><i class="iconfont icon-file"></i><em>{{$t('button.open')}}</em></span>-->
<!--            <span class="operate-btn forbiden" :title="$t('tool.edit')" ><i class="iconfont icon-feedback"></i><em>{{$t('button.edit')}}</em></span>-->
<!--            <span class="operate-btn forbiden" :title="$t('tool.delete')"><i class="iconfont icon-delete"></i><em>{{$t('button.delete')}}</em></span>-->
<!--        </div>-->

        <div class="toolbar-menu">
            <span class="operate-btn" @click="onShowUpload"><i class="iconfont icon-roundadd"></i><em>{{$t('button.increase')}}</em></span>
            <span class="separation-line"></span>
            <span class="operate-btn forbiden" :title="$t('tool.open')"><i class="iconfont icon-file1"></i></span>
<!--            <span class="operate-btn forbiden" :title="$t('tool.open')"><i class="iconfont icon-cut"></i></span>-->
<!--            <span class="operate-btn forbiden" :title="$t('tool.open')"><i class="iconfont icon-copy"></i></span>-->


            <span class="operate-btn forbiden" :title="$t('tool.edit')" ><i class="iconfont icon-edit"></i></span>
            <span class="operate-btn forbiden" :title="$t('tool.delete')"><i class="iconfont icon-delete1"></i></span>
            <span class="separation-line"></span>
            <div :class="page.order.show ? 'operate-btn active': 'operate-btn'"  @click.stop="onShowOrderMenu">
                <i class="iconfont icon-order"></i>
                {{$t('tool.order.title')}}
                <i class="iconfont icon-return down"></i>

                <div v-if="page.order.show" class="toolbar-drop-menu-wrap" @click.stop>
                    <em class="up"></em>
                    <div class="toolbar-drop-menu-inner">
                        <div v-for="(item,index) in page.order.mode.data" :key="index" :data-value="item.value" :class="isOrderModeMore(item.value) ? 'item active': 'item'" @click="onSwitchOrderMode">
                            <span class="dot-wrap"><i class="dot-inner"></i></span>
                            <em class="title">{{item.name}}</em>

                            <template v-if="item.value == 'more'">
                                <em class="iconfont icon-return"></em>
                                <div ref="view" class="toolbar-drop-sub-menu-wrap" style="left:95%">
                                    <div class="toolbar-drop-sub-menu-inner">
                                        <div v-for="(item,index) in page.order.mode.more" :key="index" :data-value="item.value" :class="item.value === page.order.mode.current ? 'sub-item active': 'sub-item'" @click="onSwitchOrderMode">
                                            <span class="dot-wrap"><i class="dot-inner"></i></span>
                                            <em class="title">{{item.name}}</em>
                                        </div>
                                    </div>
                                </div>
                            </template>
                        </div>
                        <div class="line"></div>
                        <div v-for="(item,index) in page.order.sort.data" :key="index" :data-value="item.value"  :class="item.value === page.order.sort.current ? 'item active': 'item'" @click="onSwitchOrderSort">
                            <span class="dot-wrap"><i class="dot-inner"></i></span>
                            <em class="title">{{item.name}}</em>
                        </div>
                    </div>
                </div>
            </div>
            <div :class="page.view.show ? 'operate-btn active': 'operate-btn'" @click.stop="onShowViewMenu">
                <i :class="['iconfont',getViewIcon()]"></i>
                {{$t('tool.view.title')}}
                <i class="iconfont icon-return down"></i>
                <div v-if="page.view.show" class="toolbar-drop-menu-wrap" @click.stop>
                    <em class="up"></em>
                    <div class="toolbar-drop-menu-inner">
                        <div v-for="(item,index) in page.view.data" :key="index" :data-value="item.value" :class="item.value === page.view.current ? 'item active': 'item'" @click="onSwitchView">
                            <span class="dot-wrap"><i class="dot-inner"></i></span>
                            <i :class="['iconfont',item.icon]"></i>
                            <em class="title">{{item.name}}</em>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="toolbar-right">
            <span class="operate-btn" :title="$t('button.more')" @click.stop="onShowMoreMenu"><i class="iconfont icon-more"></i></span>
        </div>
    </div>

    <!-- More Menu -->
    <div v-if="page.more" class="toolbar-more-menu-wrap" @click.stop>
        <em class="up"></em>
        <div class="toolbar-more-menu-inner">
<!--            <div class="item" data-key="view" @mouseenter="onSubItemFoucs">-->
<!--                <span>-->
<!--                    <i :class="['iconfont',getViewIcon()] "></i>-->
<!--                    <em class="title">{{t('button.view')}}</em>-->
<!--                </span>-->
<!--                <i class="iconfont icon-return"></i>-->

<!--                &lt;!&ndash; View Menu &ndash;&gt;-->
<!--                <div ref="view" class="toolbar-more-sub-menu-wrap" :style="'left:'+(page.submenu.view.left)">-->
<!--                    <div class="toolbar-more-sub-menu-inner">-->
<!--                        <div v-for="(item,index) in page.view.data" :key="index" :data-value="item.value" :class="item.value === page.view.current ? 'sub-item active': 'sub-item'" @click="onSwitchView">-->
<!--                            <span class="dot-wrap"><i class="dot-inner"></i></span>-->
<!--                            <i :class="['iconfont',item.icon]"></i>-->
<!--                            <em class="title">{{item.name}}</em>-->
<!--                        </div>-->
<!--                    </div>-->
<!--                </div>-->
<!--            </div>-->

<!--            <div class="item" data-key="order" @mouseenter="onSubItemFoucs">-->
<!--                <span>-->
<!--                    <i class="iconfont icon-order"></i>-->
<!--                    <em class="title">{{t('button.order')}}</em>-->
<!--                </span>-->
<!--                <i class="iconfont icon-return"></i>-->

<!--                &lt;!&ndash; Order Menu &ndash;&gt;-->
<!--                <div ref="order" class="toolbar-more-sub-menu-wrap" :style="'left:'+(page.submenu.order.left)">-->
<!--                    <div class="toolbar-more-sub-menu-inner">-->
<!--                        <div v-for="(item,index) in page.order.mode.data" :key="index" :data-value="item.value" :class="item.value === page.order.mode.current ? 'sub-item active': 'sub-item'" @click="onSwitchOrderMode">-->
<!--                            <span class="dot-wrap"><i class="dot-inner"></i></span>-->
<!--                            <em class="title">{{item.name}}</em>-->
<!--                        </div>-->
<!--                        <div class="line"></div>-->
<!--                        <div v-for="(item,index) in page.order.sort.data" :key="index" :data-value="item.value"  :class="item.value === page.order.sort.current ? 'sub-item active': 'sub-item'" @click="onSwitchOrderSort">-->
<!--                            <span class="dot-wrap"><i class="dot-inner"></i></span>-->
<!--                            <em class="title">{{item.name}}</em>-->
<!--                        </div>-->
<!--                    </div>-->
<!--                </div>-->
<!--            </div>-->

            <div class="item" data-key="open" @mouseenter="onSubItemFoucs">
                <span>
                    <i :class="['iconfont','icon-file1'] "></i>
                    <em class="title">{{$t('tool.open.title')}}</em>
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

            <div class="item" @click="onRefresh"><span><i class="iconfont icon-a-guangqi_guolv11x"></i><em class="title">{{t('tool.filter')}}</em></span></div>


<!--            <div class="line"></div>-->

<!--            <div class="item" @click="onShowUpload"><span><i class="iconfont icon-increase"></i><em>{{t('button.increase')}}</em></span></div>-->
            <div class="line"></div>

<!--            <div class="item" @click="onShowSetting"><span><i class="iconfont icon-setting"></i><em>{{t('button.settings')}}</em></span></div>-->

            <div class="item" @click="onGoBack"><span><i class="iconfont icon-back"></i><em class="title">{{t('button.return')}}</em></span></div>

            <div class="item" @click="onRefresh"><span><i class="iconfont icon-refresh"></i><em class="title">{{t('button.refresh')}}</em></span></div>

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
const open = ref(null);
const view = ref(null);
const order = ref(null);
const page = reactive({
    show: false,
    actions:{},
    more: false,
    open: {
        data: [
            {name: t('tool.open.app'), value: 'app'},
            {name: t('tool.open.cache'), value: 'cache'},
            {name: t('tool.open.database'), value: 'database'}
        ]
    },
    view: {
        show: false,
        current: pageStore.toolbar.view,
        data: [
            {name: t('tool.view.super'),value: 'super',icon: 'icon-super-large-icon'},
            {name: t('tool.view.large'),value: 'large',icon: 'icon-large-icon'},
            {name: t('tool.view.middle'),value: 'middle',icon: 'icon-middle-icon'},
            {name: t('tool.view.small'),value: 'small',icon: 'icon-small-icon'}
        ]
    },
    order: {
        show: false,
        mode: {
            current: pageStore.order.file.mode,
            data: [
                {name: t('tool.order.name'),value: 'name'},
                {name: t('tool.order.type'),value: 'type'},
                {name: t('tool.order.date'),value: 'date'},
                {name: t('tool.order.more'),value: 'more'},
            ],
            more: [
                {name: t('tool.order.size'),value: 'size'},
                {name: t('tool.order.modify'),value: 'modify'},
                {name: t('tool.order.view'),value: 'view'},
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
        open: { width: 0, left: 0},
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
    page.view.show = false;
    page.order.show = false;
    pageStore.toolbar.more = true;
    pageStore.toolbar.submenu.view = false;
    pageStore.toolbar.submenu.order = false;
}

const onShowOrderMenu = function () {
    page.more = false;
    page.order.show = true;
    page.view.show = false;
    pageStore.toolbar.more = false;
    pageStore.toolbar.submenu.order = true;
    pageStore.toolbar.submenu.view = false;
}

const onShowViewMenu = function () {
    page.more = false;
    page.view.show = true;
    page.order.show = false;
    pageStore.toolbar.more = false;
    pageStore.toolbar.submenu.view = true;
    pageStore.toolbar.submenu.order = false;
}

const onSwitchOrderMode = function ({currentTarget: {dataset: {value}}}) {
    const mode = page.order.mode.current
    if(value == 'more') {
        return false;
    }
    if(mode == value) {
        setHideMoreMenu()
        page.order.show = false;
        pageStore.toolbar.submenu.order = false;
        return false
    }

    setHideMoreMenu()
    page.order.show = false;
    page.order.mode.current = value;
    pageStore.order.file.mode = value;
    pageStore.toolbar.submenu.order = false;
    localStorage.setItem('cm_setting_order_file_mode',value);
    setOrderConfig();
}

const onSwitchOrderSort = function ({currentTarget: {dataset: {value}}}) {
    const mode = page.order.sort.current
    if(mode == value) {
        setHideMoreMenu()
        page.order.show = false;
        pageStore.toolbar.submenu.order = false;
        return false
    }

    setHideMoreMenu()
    page.order.show = false;
    page.order.sort.current = value;
    pageStore.order.file.sort = value;
    pageStore.toolbar.submenu.order = false;
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
        case 'open':
            width = open.value.offsetWidth
            break;
        case 'view':
            width = view.value.offsetWidth
            break;
        case 'order':
            width = order.value.offsetWidth
            break
    }

    page.submenu[key].width = width;
    page.submenu[key].left = ((width - 5) * - 1) + 'px';
    console.log('page.submenu',page.submenu);
}

const onSwitchView = function ({currentTarget: {dataset: {value}}}) {
    page.view.show = false;
    page.view.current = value;


    pageStore.toolbar.more = false;
    pageStore.toolbar.view = value;
    pageStore.toolbar.submenu.view = false;
    localStorage.setItem('cm_setting_view',value);
}

const onSwitchOpen = function () {

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

const isOrderModeMore = function (value) {

    const options = ['name', 'type', 'date', 'more'];
    if(options.includes(value)) {
        if(page.order.mode.current == value && value != 'more') {
            return true
        }

        if(value == 'more' && page.order.mode.current !== 'name' && page.order.mode.current !== 'type' && page.order.mode.current !== 'date') {
            return true
        }
    }
    return false;
}

watch(() => pageStore.toolbar.more,(value)=> {
    page.more = value;
})

watch(() => pageStore.toolbar.submenu.order,(value)=> {
    page.order.show = value;
})

watch(() => pageStore.toolbar.submenu.view,(value)=> {
    page.view.show = value;
})
</script>
