<template>
    <div v-if="show" :class="page.show ? 'setting-mask opacity':'setting-mask'"></div>
    <div v-if="show" :class="page.show ? 'setting-wrap opacity':'setting-wrap'">
        <div class="setting-inner">
            <div class="setting-header">
                <span class="title">{{t('edit.title')}}</span>
                <span class="iconfont icon-close" @click="onClose"></span>
            </div>

            <div class="setting-main">
                <div class="item">
                    <div class="item-header">
                        <label>{{t('edit.name.title')}}:</label>
                    </div>
                    <div class="input-wrap input-l">
                        <div class="input-inner">
                            <input v-model="page.alias" type="text" :placeholder="t('edit.name.placeholder')">
                        </div>
                        <i v-if="page.alias" data-key="alias" @click="onInputClear" class="iconfont icon-close-fill"></i>
                    </div>
                </div>

                <div class="item">
                    <div class="item-header">
                        <label>{{t('edit.artists.title')}}:</label>
                        <Tooltips :content="t('edit.artists.tips')">
                            <i class="iconfont icon-problem"></i>
                        </Tooltips>
                    </div>
                    <div class="taxonomy-wrap">
                        <div class="taxonomy-main">
                            <div class="input-wrap input-xxm">
                                <div class="input-inner">
                                    <input v-model="page.artists" type="text" :placeholder="t('edit.artists.placeholder')">
                                </div>
                                <i v-if="page.artists" data-key="artists" @click="onInputClear" class="iconfont icon-close-fill"></i>
                            </div>
                            <span class="btn btn-secondary btn-small ml-m"  @click="onIncrease('artists')">{{t('button.increase')}}</span>
                        </div>
                        <div class="taxonomy-footer">
                            <span v-for="(item,index) in file.file_artists" :key="index"><i class="iconfont icon-close-fill" @click="onRemoveTermRelationships(index,'artists')"></i><em>{{item.name}}</em></span>
                        </div>
                    </div>
                </div>

                <div class="item">
                    <div class="item-header">
                        <label>{{t('edit.tags.title')}}:</label>
                        <Tooltips :content="t('edit.tags.tips')">
                            <i class="iconfont icon-problem"></i>
                        </Tooltips>
                    </div>
                    <div class="taxonomy-wrap">
                        <div class="taxonomy-main">
                            <div class="input-wrap input-xxm">
                                <div class="input-inner">
                                    <input v-model="page.tags" type="text" :placeholder="t('edit.tags.placeholder')">
                                </div>
                                <i v-if="page.tags" data-key="tags" @click="onInputClear" class="iconfont icon-close-fill"></i>
                            </div>
                            <span class="btn btn-secondary btn-small ml-m" @click="onIncrease('tags')">{{t('button.increase')}}</span>
                        </div>
                        <div class="taxonomy-footer">
                            <span v-for="(item,index) in file.file_tags" :key="index" ><i class="iconfont icon-close-fill" @click="onRemoveTermRelationships(index,'tags')"></i><em>{{item.name}}</em></span>
                        </div>
                    </div>
                </div>

                <div class="item">
                    <div class="item-header">
                        <label>{{t('edit.categories.title')}}:</label>
                        <Tooltips :content="t('edit.categories.tips')">
                            <i class="iconfont icon-problem"></i>
                        </Tooltips>
                    </div>
                    <div class="taxonomy-wrap">
                        <div class="taxonomy-main">
                            <div class="input-wrap input-xxm">
                                <div class="input-inner">
                                    <input v-model="page.categories" type="text" :placeholder="t('edit.categories.placeholder')">
                                </div>
                                <i v-if="page.categories" data-key="categories" @click="onInputClear" class="iconfont icon-close-fill"></i>
                            </div>
                            <span class="btn btn-secondary btn-small ml-m"  @click="onIncrease('categories')">{{t('button.increase')}}</span>
                        </div>
                        <div class="taxonomy-footer">
                            <span v-for="(item,index) in file.file_categories" :key="index"><i class="iconfont icon-close-fill" @click="onRemoveTermRelationships(index,'categories')"></i><em>{{item.name}}</em></span>
                        </div>
                    </div>
                </div>

                <div class="item">
                    <div class="item-header">
                        <label>{{t('edit.languages.title')}}:</label>
                        <Tooltips :content="t('edit.languages.tips')">
                            <i class="iconfont icon-problem"></i>
                        </Tooltips>
                    </div>
                    <div class="taxonomy-wrap">
                        <div class="taxonomy-main">
                            <div class="input-wrap input-xxm">
                                <div class="input-inner">
                                    <input v-model="page.languages" type="text" :placeholder="t('edit.languages.placeholder')">
                                </div>
                                <i v-if="page.languages" data-key="languages" @click="onInputClear" class="iconfont icon-close-fill"></i>
                            </div>
                            <span class="btn btn-secondary btn-small ml-m"  @click="onIncrease('languages')">{{t('button.increase')}}</span>
                        </div>
                        <div class="taxonomy-footer">
                            <span v-for="(item,index) in file.file_languages" :key="index" ><i class="iconfont icon-close-fill" @click="onRemoveTermRelationships(index,'languages')"></i><em>{{item.name}}</em></span>
                        </div>
                    </div>
                </div>

                <div class="item">
                    <div class="item-header">
                        <label>{{t('edit.intro.title')}}:</label>
                    </div>
                    <div class="input-wrap input-l" >
                        <div class="input-inner">
                            <textarea v-model="page.intro" :placeholder="t('edit.intro.placeholder')" rows="5" maxlength="120"></textarea>
                        </div>
                    </div>
                </div>
            </div>

            <div class="setting-footer">
                <div></div>
                <div>
                    <span class="btn btn-secondary btn-small mr-l" @click="onClose">{{t('button.cancel')}}</span>
                    <span class="btn btn-primary btn-small" @click="onSave">{{t('button.save')}}</span>
                </div>
            </div>
        </div>
    </div>

    <Confirm :confirm="confirm" @cancel="onCancelConfirm" @confirm="onOperateConfirm"></Confirm>
</template>

<script setup lang="ts">
import {useI18n} from 'vue-i18n';
import { reactive, onMounted, watch} from "vue";
const fs = require("fs") as typeof import("fs");
import {Base, Common, File} from "@renderer/utils";
import type {PageInter, ConfirmInter,SelectInter} from "@renderer/utils/types";
import {updateFileInfoRecord} from "@renderer/api/file";
import {isTermExist, getTermByName, increaseTerm, increaseTermRelationships, removeTermRelationships} from "@renderer/api/terms";
import {debounce, throttle} from "@renderer/utils/throttle";

import Confirm from "@renderer/components/Confirm.vue";
import Tooltips from "@renderer/components/Tooltips.vue";
import {usePageStore} from '@renderer/stores/page'

interface Props {
    show: boolean,
    file: {
        file_id:number,
        file_date: string,
        file_modified:string,
        file_name: string,
        file_author: string,
        file_type: string,
        file_path: string,
        file_size:number,
        file_total:number,
        file_status: string,
        file_categories: object,
        file_artists: object,
        file_alias:string,
        file_intro:string
    }
}

interface Page {
    show:boolean,
    categories: string,
    tags: string,
    languages: string,
    artists: string
}

const { t } = useI18n();
const emit = defineEmits(['cancel','update'])
const props = defineProps<Props>()
const pageStore = usePageStore();
const page:Page = reactive({show: true, alias: '',intro: '', categories: '', tags: '', languages: '', artists: ''})
const confirm:ConfirmInter = reactive({show: false});

onMounted(() => {
    page.show = props.show
})

const onClose = function () {
    emit('cancel')
}

const onCancelConfirm = function () {
    Common.cancelConfirm(confirm);
}

const onOperateConfirm = function () {
    Common.operateConfirm(confirm, page);
}

const onIncrease = throttle(async (key:string) => {
    const value = page[key];

    if(Base.isEmpty(value)) {
        return false;
    }

    const { file_id: object_id} = props.file;
    const arr = Base.unique(value.replaceAll('，',',').split(','));
    const data = getCanIncreaseData(arr,key);

    for(let i in data) {
        let name = data[i].trim();
        let taxonomy = getTaxonomyBykey(key);
        let success = await insertTermRelationships(object_id, name, taxonomy);

        if(!success) {
            continue;
        }

        const term = await getTerm(name,taxonomy)
        props.file['file_'+key].push(term);
    }

    page[key] = '';
})

const getTaxonomyBykey = function (key:string) {
    const map = {
        'tags':'tag',
        'artists': 'artist',
        'categories': 'category',
        'languages': 'language'
    }

    return map[key];
}

const getCanIncreaseData = function (arr:object, key:string):object {
    const tmp = [];
    const data = props.file['file_'+key] || [];
    for(let i in arr) {
        if(!Base.isEmpty(arr[i]) && !Base.inArray(data,'name',arr[i])) {
            tmp.push(arr[i]);
        }
    }

    return tmp;
}

const insertTermRelationships =  async function (object_id:number, name:string, taxonomy:string):Promise<Boolean> {
    try {
        const params = {name: name, taxonomy: taxonomy};
        const res = await isTermExist(params);
        if (res.code != 200) {
            return false;
        }

        let relationships = { code: 500 };
        if(res.data.length == 0) { //如果没有,插入数据, 添加关系,统计数+1
            relationships = await increaseTerm(object_id, name, taxonomy);
        } else {  //如果有,查看是否有关系,没有：添加关系，统计数+1; 有:不操作
            relationships = await increaseTermRelationships(object_id, name, taxonomy);
        }

        return relationships.code == 200 ? true : false;
    } catch (err) {
        return false;
    }
}


const onRemoveTermRelationships = throttle(async (index:number, key:string) => {
    try {
        const { file_id: object_id} = props.file;
        const {term_taxonomy_id} = props.file['file_'+key][index];
        const res = await removeTermRelationships(object_id, term_taxonomy_id);

        if(res.code != 200) {
            return false;
        }

        props.file['file_'+key].splice(index,1);

    } catch (err) {
        Base.printErrorLog('removeTermRelationships',err)
    }
});

const getTerm = async function (name:string,taxonomy:string) {
    try {
        const params = {name: name, taxonomy: taxonomy};
        const res = await getTermByName(params);
        if (res.code != 200) {
            return {};
        }

        return res.data[0];
    } catch (err) {
        return {}
    }
}

const getNewFilePath = function (file_path:string, file_alias:string, alias:string):string {
    const ext = File.getFileExt(file_path);
    return file_path.replace(file_alias+'.'+ext, alias.trim()+'.'+ext);
}



const onSave = throttle( async () => {
    const {alias, intro} = page;
    const {file_id, file_alias, file_path} = props.file;
    const ext = File.getFileExt(file_path);
    const new_file_path = getNewFilePath(file_path, file_alias, alias);
    const exists = File.isExists(file_path);
    const reg = /[/\\?%*:|"<>]/g;

    if(Base.isEmpty(alias)) {
        Common.showAlert(confirm, t('edit.name.empty'));
        return false;
    }

    if(file_path != new_file_path) {
        if(reg.test(alias)) {
            Common.showAlert(confirm,t("alert.content.rename"));
            return false;
        }

        if(exists && File.isExists(new_file_path)) {
            Common.showAlert(confirm,`${alias} ${t("edit.save.file_exits")}`);
            return false;
        }
    }

    try {
        const params = {
            file_id: file_id,
            file_name: alias + '.' + ext,
            file_intro: intro,
            old_file_path: file_path,
            new_file_path: new_file_path,
        }
        const res = await updateFileInfoRecord(params);
        if(res.code != 200) {
            Common.showAlert(confirm,t("edit.anomaly"));
            return false
        }

        props.file.file_name = params.file_name;
        props.file.file_path = new_file_path;
        props.file.file_alias = alias;
        props.file.file_intro = intro;
        emit('update',props.file);
        emit('cancel')
    } catch (err) {
        Base.printErrorLog('updateFileInfo',err);
    }
})

const onInputClear = function ({currentTarget: {dataset: {key}}}) {
    page[key] = ''
}

watch(() => props.show,(value) => {
    setTimeout(()=> {page.show = value},10)
    if(value == true) {
        page.alias = props.file.file_alias;
        page.intro = props.file.file_intro;
        page.categories = '';
        page.tags = '';
        page.languages = '';
        page.artists = '';
    }
})

watch(() => props.file.file_alias,(value) => {
    page.alias = value
})

watch(() => props.file.file_intro,(value) => {
    page.intro = value
})
</script>

<style scoped lang="scss">
.setting {
    &-mask {
        position: fixed;
        top: 0;
        left: 0;
        z-index: 5;
        width: 100%;
        height: 100%;

        background-color: rgba(0, 0, 0, 0.3);
        transition: opacity var(--transition-delay-default) var(--transition-timing-default);;
        opacity: 0;
    }

    &-wrap {
        display: flex;
        align-items: center;
        justify-content: center;

        position: fixed;
        top: 0;
        left: 0;
        z-index: 6;
        width: 100%;
        height: 100%;

        transition: opacity var(--transition-delay-default) var(--transition-timing-default);;
        opacity: 0;
    }

    &-inner {
        width: 415px;

        background: #FFF;
        border-radius: 8px;
        overflow: hidden;
    }

    &-header {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: var(--spacing-m);
        background: var(--background-color-secondary);

        color: var(--content-color-secondary);
        .title {
            padding: var(--spacing-xs) 0;
            margin-left: var(--spacing-s);
            color: var(--content-color-secondary);
            font-size: var(--text-size-m);
            font-weight: var(--text-weight-medium);
            opacity: 1;
        }

        .icon-close {
            position: absolute;
            top: 7px;
            right: 10px;
            cursor: pointer;
            width: 36px;
            height: 36px;
            line-height: 36px;
            text-align: center;
            font-size: var(--text-size-m);
            font-weight: var(--text-weight-medium);

            &:hover {
                color: var(--content-color-primary);
                background: var(--background-color-tertiary);
                border-radius: var(--border-radius-default);
            }
        }
    }

    &-main {
        padding: var(--spacing-l);

        .item {
            padding-bottom: var(--spacing-s);

            &-header {
                position: relative;
                display: flex;
                align-items: center;
                padding-bottom: var(--spacing-s);

                label {
                    font-size: var(--text-size-m);
                }
            }

            .taxonomy {
                &-main {
                    display: flex;
                    align-items: center;

                }

                &-footer {

                    display: inline-block;

                    span {
                        float: left;
                        display: flex;
                        align-items: center;
                        margin-top: var(--spacing-s);
                        margin-right: var(--spacing-m);

                        .iconfont {
                            margin-right: var(--spacing-xs);
                            color: var(--grey-40);
                            font-size: 16px;

                            cursor: pointer;
                            &:hover {
                                color: var(--red-40);
                            }
                        }
                    }
                }
            }
            &:last-child {
                padding-bottom: 0;
            }
        }
    }

    &-footer {
        display: flex;
        justify-content: space-between;
        margin-top: -8px;
        padding: 0  var(--spacing-l) var(--spacing-l);
    }
}

.opacity {
    opacity: 1;
}
</style>
