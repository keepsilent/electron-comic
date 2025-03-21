<template>
    <Toolbar />
    <div class="detail-wrap scrollbar">
        <div class="detail-inner">
            <div class="detail-header">
                <div class="detail-info">
                    <img class="cover" :src="file.data.cover" width="170" height="227">
                    <div class="info">
                        <h3 class="title">{{file.data.name}}</h3>
                        <p class="subtitle">作者：{{file.data.author || '未知'}}</p>
                        <p class="subtitle">文件数量：{{file.data.total}}页</p>
                        <p class="subtitle">文件大小：{{file.data.size}}</p>
                        <p class="subtitle">收录时间：{{file.data.date}}</p>
                    </div>
                </div>
                <div class="detail-tag">
                    <p class="mt-5">
                        <span>#热血</span><span>#科幻</span><span>#机甲</span>
                    </p>
                </div>
            </div>
            <div class="detail-main">

            </div>
        </div>
    </div>


</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import {ref, reactive, watch, onMounted} from 'vue'
import type {PageInter, ConfirmInter} from "@renderer/utils/types";
import {Base, Config, File, Time} from "@renderer/utils";
import {getFileInfo} from "@renderer/api/file";
import {Archive} from 'libarchive.js/main.js';

import Toolbar from "./components/toolbar.vue";

const { t } = useI18n();
const page:PageInter = reactive({init: false, loading: false, actions: {}});
const confirm:ConfirmInter = reactive({show: false, title: '需要密码重置',content: '',callback:'', showCancel: false, cancelText: '取消', confirmText: '确定'});
const file = reactive({data: {}});


onMounted(()=>{
    loadArchive();
    loadDetail();
})

const loadArchive = function () {
    const options = {
        workerUrl: '/src/utils/libarchive.js/dist/worker-bundle.js'
    }

    Archive.init(options);
}

const loadDetail = async function () {
    try {
        const params = {id: 36}
        const res = await getFileInfo(params);
        if(res.code != 200) {
            return false;
        }

        console.log('res',res);
        file.data = res.data[0];
        file.data.name = File.getRenderFileName(file.data.name);
        file.data.cover = File.getFileCoverById(file.data.id);
        file.data.size = File.formatFileSize(file.data.size);
        file.data.date = Time.formatDate(file.data.date,'YYYY/MM/DD');
        console.log('file.data',file.data);

    } catch (err) {
        Base.printErrorLog('getFileInfo',err)
    }
}
</script>

<style lang="scss" scoped>
.detail {
    &-wrap {

    }

    &-inner {
        padding: var(--spacing-m);
    }

    &-header {
        display: flex;
        align-items: center;
        .cover {

            border-radius: var(--border-radius-l);
        }
    }
}
.file-details-box { padding: 30px; }
.file-details-header { position: relative; height: 215px; padding-left: 170px; padding-bottom: 15px; border-bottom: solid 1px #d1d1d1; }
.file-details-header h3 { padding-bottom: 8px; font-size: 20px; }
.file-details-header p { padding-bottom: 5px;}
.file-details-header p i.file-author {  cursor: pointer; }
.file-details-header p i.file-author:hover { text-decoration: underline; }
.file-details-header p span { margin-right: 10px; padding: 3px 15px; color: #FFF; cursor: pointer; font-size: 12px; background: #CCC; border-radius: 20px; opacity: 0.9; }
.file-details-header p span:hover { opacity: 1; }

.file-details-header div.file-details-cover { position: absolute; top: 0; left: 0; width: 150px; height: 195px; }
.file-details-header div.file-details-cover img {  width: 150px; height: 195px; }
.file-details-header div.file-details-tab { position: absolute; bottom: 27px; left: 170px; }

.file-details-close-light h3,
.file-details-close-light p{ color: #f5f5f5; }
.file-details-close-light p span { color: #454545; background: #F5F5F5; opacity: 0.95; }
.file-details-close-light p span:hover { opacity: 1;}

.file-details-main ul { margin-top: 15px;  overflow: hidden;  }
.file-details-main ul li { float: left; width: 130px; height: 185px;  padding: 15px; text-align: center; border: solid 1px #f5f5f5; overflow: hidden; }
.file-details-main ul li:hover { background: rgba(255,165,0,0.04); }
.file-details-main ul li.active { border: solid 1px rgba(255,165,0,0.1); background: rgba(255,165,0,0.06); }
.file-details-main ul li.active:hover{ background: rgba(255,165,0,0.06); }
.file-details-main ul li p { padding: 10px 0; height: 30px; overflow: hidden; }

.file-details-main ul li.upload-file-box:hover { background: transparent; }
.file-details-main ul li div.upload-file { position: relative; width: 139px; height: 162px; border: dashed 1px #CCC; background: #FFF; }
.file-details-main ul li div.upload-file:hover { border: dashed 1px rgba(255,165,0,0.45); }
.file-details-main ul li div.upload-file i { position: absolute; top: 45px; left: 39px; color: #ccc; font-size: 60px; }
.file-details-main ul li div.upload-file:hover i { color: #aaa; }
</style>
