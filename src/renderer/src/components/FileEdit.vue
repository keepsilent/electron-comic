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
                            <input v-model="file.alias" :placeholder="t('edit.name.placeholder')" type="text" value="">
                        </div>
                    </div>
                </div>

                <div class="item">
                    <label>{{t('edit.author.title')}}: </label>
                    <div class="input-wrap input-xxm">
                        <div class="input-inner">
                            <input v-model="file.author" :placeholder="t('edit.author.placeholder')" type="text" value="">
                        </div>
                    </div>
                </div>

                <div class="item">
                    <label>{{t('edit.tags.title')}}: <i class="iconfont icon-problem"></i></label>
                    <div class="item-right">
                        <div class="input-wrap input-l">
                            <div class="input-inner">
                                <input v-model="file.tags" :placeholder="t('edit.tags.placeholder')"  type="text" value="">
                            </div>
                        </div>
                        <p class="mt-s">{{t('edit.tags.tips')}}</p>
                    </div>
                </div>

                <div class="item">
                    <div class="item-header">
                        <label>{{t('edit.categories.title')}}:</label>
                        <Tooltips :content="t('edit.categories.tips')">
                            <i class="iconfont icon-problem"></i>
                        </Tooltips>
                    </div>
                    <div class="category-wrap">

                        <div class="category-main">
                            <div class="input-wrap input-xxm">
                                <div class="input-inner">
                                    <input v-model="file.tags" :placeholder="t('edit.categories.placeholder')"  type="text" value="">
                                </div>
                            </div>
                            <span class="btn btn-secondary btn-small ml-m" @click="onClose">{{t('button.increase')}}</span>
                        </div>

                        <div class="category-footer">
                            <span><i class="iconfont icon-close"></i><em>热血</em></span>
                            <span><i class="iconfont icon-close"></i><em>热血</em></span>
                        </div>
                    </div>
                </div>

                <div class="item">
                    <label>{{t('edit.languages.title')}}: <i class="iconfont icon-problem"></i></label>
                    <div>
                        <div class="input-wrap input-l">
                            <div class="input-inner">
                                <input v-model="file.tags" :placeholder="t('edit.languages.placeholder')"  type="text" value="">
                            </div>
                        </div>
                        <p class="mt-s">{{t('edit.languages.tips')}}</p>
                    </div>
                </div>

                <div class="item">
                    <div class="item-header">
                        <label>{{t('edit.intro.title')}}:</label>
                    </div>
                    <div class="input-wrap input-l" >
                        <div class="input-inner">
                            <textarea v-model="file.intro" :placeholder="t('edit.intro.placeholder')" rows="5" maxlength="120"></textarea>
                        </div>
                    </div>
                </div>
            </div>

            <div class="setting-footer">
                <div></div>
                <div>
                    <span class="btn btn-secondary btn-small mr-l" @click="onClose">{{t('button.cancel')}}</span>
                    <span class="btn btn-primary btn-small" @click="">{{t('button.save')}}</span>
                </div>
            </div>
        </div>
    </div>

    <Confirm :confirm="confirm" @cancel="onCancelConfirm" @confirm="onOperateConfirm"></Confirm>
</template>

<script setup lang="ts">
import {useI18n} from 'vue-i18n';
import {ref, reactive, onMounted, watch} from "vue";
import {Base,Config, Common} from "@renderer/utils";
import type {PageInter, ConfirmInter,SelectInter} from "@renderer/utils/types";
import Confirm from "@renderer/components/Confirm.vue";
import Tooltips from "@renderer/components/Tooltips.vue";
import {usePageStore} from '@renderer/stores/page'

import Select from "./Select.vue";
import Switch from "./Switch.vue";

interface Props {
    show: boolean,
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

interface Page {
    show:boolean
}

const { t } = useI18n();
const emit = defineEmits(['cancel'])
const props = defineProps<Props>()
const pageStore = usePageStore();
const page:Page = reactive({show: true})
const confirm:ConfirmInter = reactive({show: false});

const onClose = function () {
    emit('cancel')
}

const onCancelConfirm = function () {
    Common.cancelConfirm(confirm);
}

const onOperateConfirm = function () {
    Common.operateConfirm(confirm, page);
}

const onSelectOption = function (option) {
    switch (option.key) {
        case 'window':
            break
        case 'language':


            break
        case 'pageing':

            localStorage.setItem('cm_setting_pageing', option.value)
            break
    }
}

onMounted(()=>{
    page.show = props.show
})

const onToggleSwitch = function (option) {
    switch (option.key) {
        case 'shortcuts':
            // shortcuts.value = option.value;
            // localStorage.setItem('cm_setting_shortcuts', option.value)
            break
    }
}


watch(() => props.show,(value)=>{
    setTimeout(()=> {page.show = value},10)
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
        transition: opacity 0.25s ease-in-out;
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

        transition: opacity 0.25s ease-in-out;
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
            padding-bottom: var(--spacing-l);

            &-header {
                position: relative;
                display: flex;
                align-items: center;
                padding-bottom: var(--spacing-s);

                label {
                    font-size: var(--text-size-m);
                }
            }

            .category {
                &-main {
                    display: flex;
                    align-items: center;
                }

                &-footer {
                    display: flex;
                    align-items: center;
                    margin-top: var(--spacing-s);

                    span {
                        display: flex;
                        align-items: center;
                        margin-right: var(--spacing-m);

                        .iconfont {
                            display: block;
                            width: 15px;
                            height: 15px;
                            line-height: 16px;
                            margin-right: var(--spacing-xs);

                            color: #FFF;
                            font-size: 9px;
                            text-align: center;

                            background: var(--grey-40);
                            border-radius: 100%;
                            cursor: pointer;

                            &:hover {
                                background: var(--red-40);
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
        padding: 0  var(--spacing-l) var(--spacing-l);
    }
}

.opacity {
    opacity: 1;
}
</style>
