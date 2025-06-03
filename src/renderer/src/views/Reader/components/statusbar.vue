<template>

    <!-- Status Bar -->
    <div class="statusbar-wrap">
        <div :class="['statusbar-inner',page.layout]">
            <div class="statusbar-left">
                <template v-for="(item,index) in page.path">
                    <span class="item" :title="item.value" :data-index="index" @click="onOpenFolder">{{item.name}}</span>
                    <template v-if="index + 1 != page.total">
                        <i class="iconfont icon-return"></i>
                    </template>
                </template>
            </div>

            <div class="statusbar-right">
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
import type {ConfirmInter} from "@renderer/utils/types";

import Confirm from "@renderer/components/Confirm.vue";

interface Props {
    show?: boolean,
    file: {
        file_id:number,
        file_cover?:string,
        file_date?: string,
        file_name?: string,
        file_alias?: string,
        file_author?: string,
        file_intro?: string,
        file_path?: string,
        file_size?: string,
        file_total?: number,
        file_status?: string,
        file_modified?: string,
        file_mine_type?: string,
        file_tags?: { name:string, count:string}[],
        file_artists?: { name:string, count:string}[],
        file_languages?: { name:string, count:string}[],
        file_categories?: { name:string, count:string}[],
    },
    settings: {
        page: {
            num: number,
            total: number
        },
        scrollTop: number,
        zoom: number,
        space: number,
    }
}

interface PageInter {
    show:boolean,
    total:number,
    path:{name?:string,value?:string}[],
    layout:string
}

const { t } = useI18n();
const pageStore = usePageStore();
const props = defineProps<Props>()
const page:PageInter = reactive({
    show: false,
    total: 0,
    path: [],
    layout: Common.getLayoutFold(pageStore.page.layout,'statusbar-inner')
})
const confirm:ConfirmInter = reactive({show: false});


const onOpenFolder = function (event) {
    const {currentTarget: {dataset: {index}}} = event
    const path = page.path[index].value;
    if(!File.isExists(path || '')) {
        Common.showAlert(confirm,t("alert.content.inexistence"));
        return false;
    }

    window.electron.ipcRenderer.send('openpath', path);
}

const analyzePath = function (path:string = ''):{name:string,value:string}[] {
    if(Base.isEmpty(path)) {
        return [];
    }

    const list:{name:string,value:string}[] = [];
    const data = path.split('\\');
    const len = Base.getDataLength(data);

    data.splice(len - 1,1);

    for(let i in data) {
        let path = '';
        for(let j = 0; j <= Number(i); j++) {
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
    page.total = Base.getDataLength(page.path);
})

watch(() => pageStore.page.layout,(value) => {
    page.layout = Common.getLayoutFold(value,'statusbar-inner');
})
</script>
