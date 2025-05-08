<template>
    <div class="status-wrap">
        <div :class="['status-inner',page.layout]">
            <div class="file-path">
                <template v-for="(item,index) in page.path">
                    <span class="item" :title="item.value" :data-index="index" @click="onOpenFolder">{{item.name}}</span>
                    <template v-if="index + 1 != (page.path).length">
                        <i class="iconfont icon-return"></i>
                    </template>
                </template>
            </div>
            <div class="file-info">
<!--                <span>{{settings.page.num}}:{{settings.page.total}}</span>-->
                <span>{{settings.zoom}}%</span>
                <span>{{settings.space}} {{$t('status.spaces')}}</span>
                <span>{{file.file_size}}</span>
                <span>MIME:{{File.getFileExt(file.file_path).toUpperCase()}}</span>
                <span><i class="iconfont icon-remind"></i></span>
            </div>
        </div>
    </div>

    <Confirm :confirm="confirm" @cancel="onCancelConfirm" @confirm="onOperateConfirm"></Confirm>
</template>

<script setup lang="ts">
import {useI18n} from "vue-i18n";
import {reactive,onMounted, watch} from 'vue'
import {Base,Common,File} from "@renderer/utils";
import {usePageStore} from '@renderer/stores/page'
import type {PageInter, ConfirmInter} from "@renderer/utils/types";

import Confirm from "@renderer/components/Confirm.vue";

interface Props {
    show: boolean,
    file: {
        file_id:number,
        file_date: string,
        file_modified:string,
        file_name: string,
        file_type: string,
        file_path: string,
        file_size:number,
        file_total:number,
        file_status: string,
        file_categories: object,
        file_artists: object,
        file_alias:string,
        file_intro:string
    },
    settings: {
        page: {
            num: number,
            total: number
        },
        scrollTop: 0,
        zoom: number,
        space: number,
    }
}

const { t } = useI18n();
const pageStore = usePageStore();
const props = defineProps<Props>()
const page = reactive({
    show: false,
    layout: Common.getLayoutFold(pageStore.layout,'status-inner')
})
const confirm:ConfirmInter = reactive({show: false});


const onOpenFolder = function ({currentTarget: {dataset: {index}}}) {
    const path = page.path[index].value;
    if(!File.isExists(path)) {
        Common.showAlert(confirm,t("alert.content.inexistence"));
        return false;
    }

    window.electron.ipcRenderer.send('openpath', path);
}

const analyzePath = function (path:string):object {
    if(Base.isEmpty(path)) {
        return [];
    }

    const list = [];
    const data = path.split('\\');
    const len = Base.getDataLength(data);

    data.splice(len - 1,1);

    for(let i in data) {
        let path = '';
        for(let j = 0; j <= i; j++) {
            path += data[j]+'\\';
        }

        list.push({name: data[i], value : path});
    }

    if(len - 1 > 0 && /^[a-zA-Z]:/ig.test(list[0].name)) {
        list[0].name = `${t('status.location')}(${list[0].name})`;
    }

    return list;
}

const onCancelConfirm = function () {
    Common.cancelConfirm(confirm);
}

const onOperateConfirm = function () {
    Common.operateConfirm(confirm, page);
}

watch(() => props.file.file_path,(value)=>{
    page.path = analyzePath(value);
})

watch(() => pageStore.layout,(value)=>{
    page.layout = Common.getLayoutFold(value,'status-inner');
})
</script>
