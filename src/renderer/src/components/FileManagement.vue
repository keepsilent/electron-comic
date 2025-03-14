<template>
    <div class="file-wrap scrollbar">
        <div class="file-inner">


            <div v-for="(item,index) in files.data" :key="index" class="file-item">
                <div class="cover">
                    <img src="./dist/images/default_cover.png" data-load="0" data-src="xx" data-width="xx"  data-height="xx" width="216" height="287">
                </div>
                <p class="title">{{item.name}}</p>
            </div>



            <div class="file-upload-btn">
                <i class="iconfont icon-add"></i>
                <input type="file" v-mode="upload" ref="upload"  title="Upload File" accept=".zip,.txt,.pdf" @change="onUpload">
                <p>Upload File</p>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import {ref, reactive, watch, onMounted} from 'vue'
import {Base, Config, File} from "@renderer/utils";
import {getFileList, isFileExist, addFile} from "@renderer/api/file";

import {Archive} from 'libarchive.js/main.js';

const upload = ref(null);
const files = reactive({data: {}});

onMounted(() => {
    Archive.init({
        workerUrl: '/src/utils/libarchive.js/dist/worker-bundle.js'
    });

    loadFileList();
})

const loadFileList = async function () {
    console.log('vv');
    try {
        const params = {
            page: 1,
            pagesize: 10
        }

        const res = await getFileList(params)
        console.log('res',res);
        if(res.code != 200) {
            return false;
        }
        console.log('res',res)
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
        const res = await archive.extractFiles();

        const cover = await File.getExtractFileCover(res);

        File.createCoverByBase64(file.name,cover)

        const data= {
            name: file.name,
            author: '',
            type: file.type,
            size: file.size,
            path: file.path,
            total: File.getExtractFileTotal(res)
        }

        await addFile(data);
        // const sql = {
        //     table: 'file',
        //     data: {
        //         name: file.name,
        //         author: '',
        //         type: file.type,
        //         size: file.size,
        //         path: file.path,
        //         total: File.getExtractFileTotal(res)
        //     }
        // }

    } catch (err) {
        console.error('err',err)
    } finally {
        upload.value.value = null;
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
        grid-template-columns: repeat(auto-fill, 216px);
        gap: 15px;
    }


    &-item {
        width: 216px;
        height: 317px;
        //border: solid 1px #f5f5f5;
        cursor: pointer;
        overflow: hidden;

        &:hover {
            background: rgba(255,196,89,0.06);
            border-color: rgba(255,196,89,0.01);
        }
        //
        //&.active {
        //    border: solid 1px rgba(255,196,89,0.1);
        //    background: rgba(255,196,89,0.06);
        //
        //    &:hover {
        //        background: rgba(255,196,89,0.06);
        //    }
        //}

        .cover {
            width: 216px;
            height: 287px;
            overflow: hidden;
        }

        .title {
            padding: 10px 0;
            height: 30px;
            text-align: center;
            overflow: hidden;

            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
            overflow: hidden;
        }
    }


    &-upload-btn {
        position: relative;
        width: 150px;
        height: 195px;

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
            padding-top: 52px;
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
