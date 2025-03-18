<template>
    <div class="file-wrap scrollbar">
        <div class="file-inner">


            <div v-for="(item,index) in files.data" :key="index" class="file-item">
                <div class="cover">
                    <img :src="item.cover" data-load="0" data-src="xx" data-width="xx"  data-height="xx" width="216" height="287">
<!--                    <span class="type">ZIP</span>-->
<!--                    <div class="mask">-->
<!--                        <span class="num">{{item.total}}页</span>-->
<!--                    </div>-->
                </div>
                <p class="title">{{item.name}}</p>
<!--                <p class="subtitle">-->
<!--                    <span>{{item.date}}</span>-->
<!--                    <span>{{item.total}}页</span>-->
<!--                </p>-->
            </div>



            <div class="file-upload-btn">
                <i class="iconfont icon-add"></i>
                <input type="file" v-mode="upload" ref="upload"  title="Upload File" accept=".zip,.txt,.pdf" @change="onUpload">
                <p>Upload File</p>
            </div>
        </div>
    </div>

    <Loading :show="page.loading"></Loading>
    <Confirm :show="confirm.show" :title="confirm.title" :content="confirm.content" :showCancel="confirm.showCancel" :cancelText="confirm.cancelText" :confirmText="confirm.confirmText"></Confirm>
</template>

<script setup lang="ts">
import {ref, reactive, watch, onMounted} from 'vue'
import {Base, Config, File, Time} from "@renderer/utils";
import {getFileList, isFileExist, addFile} from "@renderer/api/file";

import {Archive} from 'libarchive.js/main.js';
import Loading from "./Loading.vue";
import Confirm from "./Confirm.vue";

interface Page {
    init: boolean,
    loading: boolean
}
interface Confirm {
    show:boolean,
    title?:string,
    content: string,
    showCancel?: boolean,
    cancelText?: string,
    confirmText?: string
}

const page:Page = reactive({init: false, loading: false});
const confirm:Confirm = reactive({show: false, title: '',content: '',showCancel: false,cancelText: '取消',confirmText: '确定'});
const upload = ref(null);
const files = reactive({data: {}});

onMounted(() => {
    Archive.init({
        workerUrl: '/src/utils/libarchive.js/dist/worker-bundle.js'
    });

    confirm.show = true;
    confirm.content = '本系列更新只有利用周末和下班时间整理，比较多的内容的话更新会比较慢，希望能对你有所帮助，请多多star或点赞收藏支持一下';
    confirm.showCancel= false;
    loadFileList();
})

const loadFileList = async function () {
    try {
        const params = {
            page: 1,
            pagesize: 10
        }

        const res = await getFileList(params)
        if(res.code != 200) {
            return false;
        }
        console.log('res',res)

        for(let i in res.data) {
            res.data[i].name = File.getRenderFileName(res.data[i].name);
            res.data[i].cover = File.getFileCoverById(res.data[i].id);
            res.data[i].size = File.formatFileSize(res.data[i].size);
            res.data[i].date = Time.formatDate(res.data[i].date,'YYYY/MM/DD');
        }
        files.data = res.data;

        console.log('files',files)

    } catch (err) {
        Base.printErrorLog('getFileList',err);
    }
}

const onUpload = async function (event) {
    if (event.length == 0) {
        // tipsBox.alert('请选择上传的文件');
        upload.value.value = null;
        return false;
    }

    try {
        const [file] = event.target.files;
        const archive = await Archive.open(file);
        const extract = await archive.extractFiles();

        await addSingleFile(file, extract);
    } catch (err) {
        console.error('err',err)
    } finally {
        upload.value.value = null;
    }
}

const addSingleFile = async function ( file,extract) {
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

</script>

<style scoped lang="scss">
.file {
    &-wrap {
        height: calc(100vh - 25px - 48px - 41px);
        padding: var(--spacing-m);
        background: var(--background-color-secondary);
        overflow-y: auto;
    }

    &-inner {
        display: grid;
        //grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
        grid-template-columns: repeat(auto-fill, 183px);
        gap: 15px;
    }


    &-item {
        //width: 216px;
        width: 183px;
        cursor: pointer;
        overflow: hidden;


        .cover {
            position: relative;
            //width: 216px;
            //height: 287px;
            width: 183px;
            height: 243px;


            background: #FFF;
            border-radius: var(--border-radius-default);
            overflow: hidden;

            img {
                width: 100%;
                height: 100%;
                object-fit: contain;
            }
            .mask {
                position: absolute;
                right: 0;
                bottom: 0;
                font-size: 26px;
                line-height: 24px;
                padding: 0 8px 6px 0;
                color: #fff;
                background: -webkit-gradient(linear, left top, left bottom, from(rgba(0, 0, 0, 0)), to(rgba(0, 0, 0, .5)));
                background: -webkit-linear-gradient(top, rgba(0, 0, 0, 0), rgba(0, 0, 0, .5));
                background: -o-linear-gradient(top, rgba(0, 0, 0, 0) 0, rgba(0, 0, 0, .5) 100%);
                background: linear-gradient(180deg, rgba(0, 0, 0, 0), rgba(0, 0, 0, .5));
                width: 100%;
                text-align: right;
                z-index: 4;

                font-style: italic;
                font-family: DIN-BoldItalic;
            }
            .type {
                position: absolute;
                top: 10px;
                left: 10px;
                padding: 2px 8px;
                border-radius: 5px;
                background: #FFF;
            }

            //.num {
            //    position: absolute;
            //    bottom: 5px;
            //    right: 10px;
            //
            //    color: #FFF;
            //    font-size: 24px;
            //    font-weight: bolder;
            //    font-style: italic;
            //    font-family: DIN-BoldItalic;
            //}
        }

        .title {
            padding: 5px 0;

            color: #333;
            font-size: var(--text-size-l);
            height: calc(2* (var(--text-size-l) * 1.4));

            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
            overflow: hidden;
        }

        .subtitle {
            display: flex;
            align-items: center;
            justify-content: space-between;
        }
    }


    &-upload-btn {
        position: relative;

        width: 183px;
        height: 243px;

        text-align: center;

        cursor: pointer;
        background: var(--background-color-primary);
        border-radius: var(--border-radius-default);
        border: dashed var(--border-width-default) var(--grey-30);

        &:hover {
            border-color: var(--grey-40);
            i  {
                color: var(--content-color-tertiary);
                opacity: 1;
            }
            p {
                opacity: 1;
                color: var(--content-color-tertiary);
            }
        }

        i {
            display: block;
            width: 60px;
            height: 60px;
            margin: 0 auto;
            padding-top: 62.5px;
            color: var(--grey-40);

            opacity: 0.75;
            font-size: 60px;
            line-height: 1;
        }

        input {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;

            cursor: pointer;
            opacity: 0;
        }

        p {
            padding: 10px 0;
            height: 30px;
            color: var(--grey-40);
            opacity: 0.75;
        }
    }
}
</style>
