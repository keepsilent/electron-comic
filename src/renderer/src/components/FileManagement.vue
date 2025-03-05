<template>

    <div class="file-wrap scrollbar">

        <div class="upload-btn">
            <i class="iconfont icon-add"></i>
            <input type="file" v-mode="upload" ref="upload"  title="Upload File" accept=".zip,.txt,.pdf" @change="onUpload">
            <p>Upload File</p>
        </div>
    </div>
</template>

<script setup lang="ts">
import {ref, reactive,watch} from 'vue'
import {Base, Config, File} from "@renderer/utils";
import {sqQuery} from "@renderer/api/db/db";


console.error('import.meta.env.VITE_CURRENT_RUN_MODE',import.meta.env.VITE_CURRENT_RUN_MODE);

const upload = ref(null);
const src = ref('')
const images = ref({})

import {Archive} from 'libarchive.js/main.js';
import {sqInsert} from "../api/db";
Archive.init({
    workerUrl: '/src/utils/libarchive.js/dist/worker-bundle.js'
});


const onUpload = async function (event) {
    if (event.length == 0) {
        // tipsBox.alert('请选择上传的文件');
        upload.value.value = null;
        return false;
    }

    try {
        console.log('event.target.files', event.target.files);
        const [file] = event.target.files;


        console.log('file', file);

        const archive = await Archive.open(file);
        const res = await archive.extractFiles();
        const cover = await File.getExtractFileCover(res);
        const total = File.getExtractFileTotal(res);

        File.createCoverByBase64(file.name,cover)

        const sql = {
            table: 'file',
            data: {
                name: file.name,
                author: '',
                type: file.type,
                size: file.size,
                path: file.path,
                total: total
            }
        }

        sqInsert(sql);
    } catch (err) {
        console.error('err',err)
    } finally {
        upload.value.value = null;
    }

    return false

    const reader = new FileReader()
    reader.onload = (loadEvent) =>{
        const {target: {result}} = loadEvent
        const base64 = (result).replace('data:application/octet-stream;base64,','data:image/png;base64,')
        //console.log('loadEvent.target.resul',loadEvent.target.result);
    }

    //console.log('obj[0]',obj.test);
    reader.readAsDataURL(new Blob([obj.test['00025AE0.png']]))
}

</script>

<style scoped lang="scss">
.file-wrap {
    height:calc(100vh - 25px - 48px - 41px);
    padding: var(--spacing-m);


    background: var(--background-color-secondary);
    overflow-y: auto;

    .file-list-box ul li p { padding: 10px 0; height: 30px; text-align: center; overflow: hidden; }
    .file-list-box ul li p { display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: 2;  overflow: hidden;}

    .upload-btn {
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



/** 文件列表 **/
.file-list-box { position: relative;  background: var(--background-color-secondary); }
.file-list-box ul { padding: 15px; overflow: hidden;  }
.file-list-box ul li { float: left; width: 150px; height: 247px;  padding: 15px; border: solid 1px #f5f5f5; overflow: hidden; }
.file-list-box ul li:hover { background:  rgba(255,196,89,0.06); border-color: rgba(255,196,89,0.01);  }
.file-list-box ul li.active { border: solid 1px rgba(255,196,89,0.1); background: rgba(255,196,89,0.06); }
.file-list-box ul li.active:hover{ background: rgba(255,196,89,0.06); }

.file-list-box ul li div { text-align: center; width: 150px; height: 195px; overflow: hidden; }
.file-list-box ul li p { padding: 10px 0; height: 30px; text-align: center; overflow: hidden; }
.file-list-box ul li p { display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: 2;  overflow: hidden;}


.file-list-box ul li.upload-file-box:hover { background: transparent; }
.file-list-box ul li div.upload-file { position: relative; width: 150px; height: 195px; border: dashed 1px #CCC; background: #FFF; }
.file-list-box ul li div.upload-file:hover { border: dashed 1px rgba(255,196,89,0.6); }
.file-list-box ul li div.upload-file i { position: absolute; top: 72px; left: 45px; color: #ccc; display: block; width: 60px; height: 60px; font-size: 60px; line-height: 1; }
.file-list-box ul li div.upload-file:hover i { color: #aaa; }
.file-list-box ul li div.upload-file input { position: absolute; top: 0; left: 0; width: 100%; height: 100%; opacity: 0; }



</style>
