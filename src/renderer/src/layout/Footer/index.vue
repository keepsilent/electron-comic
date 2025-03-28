<template>
    <div class="footer">
        <div class="footer-inner">
            <div class="file-path">
                <template v-if="status.scene == 'catalogue'">{{status.name}}</template>
                <template v-else>
                    <template v-for="(item,index) in status.path">
                        <span class="item" :title="item.value" :data-index="index" @click="onOpenFolder">{{item.name}}</span>
                        <template v-if="index + 1 != (status.path).length">
                            <i class="iconfont icon-return"></i>
                        </template>
                    </template>
                </template>
            </div>
            <div class="file-info">
                <div class="file-num">
                    <i class="num">{{status.num}} </i>
                    <template v-if="status.scene == 'path'">{{t('status.files')}}</template>
                    <template v-else>{{t('status.item')}}</template>
                </div>
                <div class="iconfont icon-problem"></div>
            </div>
        </div>
    </div>

    <Confirm :confirm="confirm" @cancel="onCancelConfirm" @confirm="onOperateConfirm"></Confirm>
</template>

<script setup lang="ts">
import {useI18n} from "vue-i18n";
import {reactive,watch} from 'vue'
import {Base,Common,File} from "@renderer/utils";
import {usePageStore} from '@renderer/stores/page'
import type {PageInter, ConfirmInter} from "@renderer/utils/types";

import Confirm from "@renderer/components/Confirm.vue";

interface Status {
    name: string,
    num: number,
    scene: string,
    path?: object
}

const { t } = useI18n();
const pageStore = usePageStore();
const status:Status = reactive({name: '',num: 0, scene: '', path: []})
const page:PageInter = reactive({show: false})
const confirm:ConfirmInter = reactive({show: false});

const onOpenFolder = function ({currentTarget: {dataset: {index}}}) {
    const path = status.path[index].value;
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

watch(() => pageStore.name,(value)=>{
    status.name = value;
})

watch(() => pageStore.scene,(value)=>{
    status.scene = value;
})

watch(() => pageStore.path,(value)=>{
    status.path = analyzePath(value);
})

watch(() => pageStore.num,(value)=>{
    status.num = value;
})

</script>
<style scoped lang="scss">
@use "./index.scss";
</style>
