<template>
    <div v-if="show" :class="page.show ? 'setting-mask opacity':'setting-mask'"></div>
    <div v-if="show" :class="page.show ? 'setting-wrap opacity':'setting-wrap'">
        <div class="setting-inner">
            <div class="setting-header">
                <span class="title">{{t('filter.title')}}</span>
                <span class="iconfont icon-close" @click="onClose"></span>
            </div>

            <div class="setting-info">
                <div>
                    <p class="title">{{t('filter.explain.title')}}</p>
                    <p class="mt-m"><b>· {{t('filter.full')}}</b> - {{t('filter.explain.full')}}</p>
                    <p class="mt-s"><b>· {{t('filter.minimal')}}</b> - {{t('filter.explain.minimal')}}</p>
                    <p class="mt-s"><b>· {{t('filter.custom')}}</b> - {{t('filter.explain.custom')}}</p>
                </div>
                <div>
                    <Select :select="page.style" @select="onSelectOption"></Select>
                </div>
            </div>

            <div class="setting-main">

                <div class="preview">
                    <p class="mb-l"><b>{{t('filter.preview')}}:</b></p>
                    <div v-if="isSelected('cover')" class="cover">
                        <div class="mask">
                            <span>
                                <em v-if="isSelected('view')" class="view"></em>
                                <em v-if="isSelected('type')" class="type"></em>
                            </span>
                            <span>
                                <em  v-if="isSelected('size')" class="size"></em>
                            </span>
                        </div>
                    </div>
                    <p v-if="isSelected('title')" class="title"></p>
                    <p v-if="isSelected('title')" class="subtitle"></p>
                    <p class="extend">
                        <span v-if="isSelected('artist')" class="artist"><i class="round"></i><em></em></span>
                        <span v-if="isSelected('date')" class="date">
                            <i class="dot" v-if="isSelected('artist')"></i><em></em>
                        </span>
                    </p>
                </div>

                <div v-if="page.style.value == 'custom'" class="options">
                    <p class="mb-s"><b>{{t('filter.options')}}:</b></p>
                    <span v-for="(item,index) in page.filter" :key="index" :data-index="index" :data-value="item.value" @click="onSelected">
                        <i :class="item.selected ? 'iconfont icon-radio-box-fill' : 'iconfont icon-unselected'"></i>
                        {{item.name}}
                    </span>
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
import type {ConfirmInter} from "@renderer/utils/types";


import Select from "@renderer/components/Select.vue";
import Confirm from "@renderer/components/Confirm.vue";
import {usePageStore} from '@renderer/stores/page'

interface Props {
    show: boolean,
}

const { t } = useI18n();
const emit = defineEmits(['cancel','update'])
const props = defineProps<Props>()
const pageStore = usePageStore();
const page = reactive({
    show: true,
    style: {
        key: 'style',
        name: '',
        value: '',
        width: 105,
        options: [
            {name: t('filter.full'),value: 'full'},
            {name: t('filter.minimal'),value: 'minimal'},
            {name: t('filter.custom'),value: 'custom'},
        ]
    },
    filter: [
        { name: t('filter.file.cover'), value: 'cover', selected: true},
        { name: t('filter.file.title'), value: 'title', selected: true},
        { name: t('filter.file.artist'), value: 'artist', selected: false},
        { name: t('filter.file.date'), value: 'date', selected: false},
        { name: t('filter.file.view'), value: 'view', selected: false},
        { name: t('filter.file.type'), value: 'type', selected: false},
        { name: t('filter.file.size'), value: 'size', selected: false}
    ]
})
const confirm:ConfirmInter = reactive({show: false});

onMounted(() => {
    page.show = props.show
    page.style.name = getStyleName();
    page.style.value = getStyleValue();

    setFileFilterOptions();
})

const onClose = function () {
    emit('cancel',{change: false})
}

const isSelected = function (value) {
    const {filter} = page
    for(let i in filter) {
        if(filter[i].value == value) {
            return filter[i].selected
        }
    }
}

const onSelected = function (event) {
    const {currentTarget: {dataset: {index}}} = event
    page.filter[index].selected = !page.filter[index].selected
}

const onSelectOption = function (option) {
    console.log('option',option);
    switch (option.value) {
        case 'minimal':
            for(let i in page.filter) {
                page.filter[i].selected = false
            }

            page.filter[0].selected = true
            page.filter[1].selected = true
            page.filter[2].selected = true
            page.filter[3].selected = true
            break
        case 'full':
            for(let i in page.filter) {
                page.filter[i].selected = true
            }
            break
    }
}

const onSave = function () {
    const {options} = File.getFileFilterOptions();
    const object = { mode: page.style.value, options: {}}
    const {filter} = page;

    for(let i in filter) {
        let {value, selected} = filter[i]
        object.options[value] = selected
    }

    localStorage.setItem('cm_setting_file_filter',JSON.stringify(object))
    emit('cancel',{change: isChange(object.options, options)});
}

const isChange = function (data, old) {
    for(let i in data) {
        for(let j in old) {
            if(data[i] != old[j]) {
                return true
            }
        }
    }

    return false;
}

const getStyleName = function ():string {
    const {mode} = File.getFileFilterOptions()
    for(let i in page.style.options) {
        if(page.style.options[i].value == mode) {
            return page.style.options[i].name
        }
    }
    return '';
}

const getStyleValue= function () {
    const {mode} = File.getFileFilterOptions()
    return mode;
}

const setFileFilterOptions = function () {
    const {options} = File.getFileFilterOptions()
    const {filter} = page;
    for(let i in options) {
        for(let j in filter) {
            if(filter[j].value == i) {
                filter[j].selected = options[i]
            }
        }
    }
}

const onCancelConfirm = function () {
    Common.cancelConfirm(confirm);
}

const onOperateConfirm = function () {
    Common.operateConfirm(confirm, page);
}

watch(() => props.show,(value) => {
    setTimeout(()=> {page.show = value},10)
    if(value == true) {

    }
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

    &-info {
        padding: var(--spacing-l);
        display: flex;
        justify-content: space-between;
    }

    &-main {
        display: flex;
        justify-content: space-between;
        min-height: 171px;

        padding: var(--spacing-l);

        .preview {
            .cover {
                position: relative;
                width: 130px;
                height: 171px;
                border-radius: var(--skeleton-radius-default);
                background: var(--skeleton-color-secondary);

                .mask {
                    position: absolute;
                    left: var(--spacing-s);
                    right: var(--spacing-s);
                    bottom: var(--spacing-s);

                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    span {
                        display: flex;
                        align-items: center;

                        em {
                            display: block;
                            width: 25px;
                            height: 8px;
                            margin-right: var(--spacing-s);
                            border-radius: var(--skeleton-radius-default);
                            background: var(--base-color-brand);
                            opacity: 0.75;

                            &:nth-child(2n) {
                                opacity: 0.45;
                            }
                            &:last-child {
                                margin-right: 0;
                            }
                        }

                    }
                }
            }

            .title,.subtitle {
                width: var(--skeleton-width-default);
                height: var(--skeleton-height-default);
                margin-top: var(--spacing-xs);
                border-radius: var(--skeleton-radius-default);
                background: var(--skeleton-color-secondary);
            }

            .extend {
                display: flex;
                align-items: center;
                margin-top: var(--spacing-xs);
                .artist {
                    display: flex;
                    align-items: center;
                    margin-right: var(--spacing-xs);
                    .round {
                        display: block;
                        width: var(--skeleton-height-default);
                        height: var(--skeleton-height-default);
                        border-radius: var(--skeleton-radius-max);
                        background: var(--skeleton-color-secondary);
                    }

                    em {
                        display: block;
                        margin-left: var(--spacing-xs);
                        width: 35px;
                        height: var(--skeleton-height-default);
                        background: var(--skeleton-color-secondary);
                        border-radius: var(--skeleton-radius-default);
                    }
                }

                .date {
                    display: flex;
                    align-items: center;

                    .dot {
                        display: block;
                        width: 4px;
                        height: 4px;
                        margin-right: var(--spacing-xs);
                        border-radius: var(--skeleton-radius-max);
                        background: var(--skeleton-color-secondary);
                    }

                    em {
                        display: block;

                        width: 50px;
                        height: var(--skeleton-height-default);
                        background: var(--skeleton-color-secondary);
                        border-radius: var(--skeleton-radius-default);
                    }
                }
            }
        }
        .options {
            width: 150px;
            p { margin-bottom: var(--spacing-m)}
            span {
                display: flex;
                align-items: center;
                float: left;

                width: 75px;
                line-height: 2;
                cursor: pointer;
                i {
                    margin-right: var(--spacing-xxs);
                    &.icon-radio-box-fill {
                        color:var(--base-color-brand);
                        opacity: 0.85;
                    }
                }
            }
        }
    }

    &-footer {
        display: flex;
        justify-content: space-between;
        margin-top: var(--spacing-l);
        padding: 0  var(--spacing-l) var(--spacing-l);
    }
}

.opacity {
    opacity: 1;
}
</style>
