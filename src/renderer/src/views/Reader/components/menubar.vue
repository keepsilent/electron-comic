<template>
    <div class="menu-wrap" @click.stop>
        <div class="menu-inner">
            <div class="menu-item">
                <span class="iconfont icon-quit" @click="onReturn"></span>
            </div>
            <div :class="settings.show ? 'menu-item active' : 'menu-item'">
                <span class="iconfont icon-setting-fill" @click="onShowSetting"></span>
                <template v-if="settings.show">
                    <i class="arrow"></i>
                    <div class="setting-wrap">
                        <div class="setting-header">{{t('details.settings')}}</div>
                        <div class="setting-main">
                            <div class="file-setting">
                                <div>
                                    <label>{{t('details.zoom')}}</label>
                                    <input v-model="settings.zoom" type="range" min="25" max="200"  step="1" data-key="zoom" @change="onChangeRange"/>
                                    <span>{{settings.zoom}}%</span>
                                </div>
                                <div>
                                    <label>{{t('details.space')}}</label>
                                    <input v-model="settings.space" type="range" min="0" max="50"  step="1" data-key="space" @change="onChangeRange"/>
                                    <span>{{settings.space}}px</span>
                                </div>
                            </div>
                        </div>
                        <div class="setting-footer">
                            <span class="restore-btn" @click="onResetSetting">{{t('details.reset')}}</span>
                        </div>
                    </div>
                </template>
            </div>
            <div class="menu-item">
                <span class="iconfont icon-return-top" @click="onReturnTop"></span>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import {useI18n} from 'vue-i18n';
import {reactive, onMounted, watch} from "vue";
import {useRouter, useRoute} from 'vue-router'
import {Base} from "@renderer/utils";
import type {ConfirmInter} from "@renderer/types/common";
import {debounce, throttle} from "@renderer/utils/throttle";

interface Props {
    settings: {
        zoom?:number,
        space?:number,
        scrollTop?: number
    }
}

interface PageInter {
    show:boolean,
    actions:any
}

interface SettingsInter {
    show: boolean,
    zoom?: number,
    space?: number,
    scrollTop?: number
}

const {t} = useI18n();
const route = useRoute();
const router = useRouter();

const emit = defineEmits(['update'])
const props = defineProps<Props>()
const page = reactive<PageInter>({show: false, actions:{}})
const confirm = reactive<ConfirmInter>({show: false, content: ''});
const settings = reactive<SettingsInter>({show: false, zoom: 0, space: 0, scrollTop: 0});

onMounted(() => {
    settings.zoom = props.settings.zoom ?? 100;
    settings.space = props.settings.space ?? 25;
    settings.scrollTop = props.settings.scrollTop ?? 0;
})

const asyncUpdate = function(key):boolean|void {
    if(Base.isEmpty(key)) {
        return false;
    }
    const args = {key:key,value: settings[key]};
    emit('update',args)
}

const onShowSetting = function():void {
    settings.show = settings.show ?　false: true;
}

const onHideSetting = function():void {
    settings.show = false
}

const onReturn = function():void {
    router.back();
}

const onReturnTop = function():void {
    const element = document.getElementById('scrollbar');

    if (element) {
        element.scrollTop = 0;
    }
}

const onChangeRange = debounce((event) => {
    asyncUpdate(event.target.dataset.key);
});

const onResetSetting = throttle(() => {
    const zoom = import.meta.env.VITE_APP_COMIC_ZOOM;
    const space = import.meta.env.VITE_APP_COMIC_SPACE;
    if(settings.zoom != zoom) {
        settings.zoom = zoom;
        asyncUpdate('zoom');
    }

    if(settings.space != space) {
        settings.space = space;
        asyncUpdate('space');
    }
})

watch(() => props.settings.zoom,(value)=>{
    settings.zoom = value;
})

watch(() => props.settings.space,(value)=>{
    settings.space = value;
})

defineExpose({onHideSetting})
</script>

<style scoped lang="scss">
.menu {
    &-wrap {
        position: fixed;
        bottom: 5%;
        right: 2.5%;
        z-index: 1;
    }

    &-item {
        position: relative;
        margin-bottom: 10px;
        padding: 4px;

        border: solid 1px rgba(255,255,255,0.45);
        border-radius: 100%;
        box-shadow: 0 2px 15px rgba(0, 0, 0, 0.08);

        .iconfont {
            display: block;
            width: 48px;
            height: 48px;
            line-height: 48px;
            color: rgba(0,0,0,0.35);
            font-size: 24px;
            text-align: center;
            background: rgba(255,255,255,0.75);
            box-shadow: 0 2px 15px rgba(0, 0, 0, 0.01);
            border-radius: 100%;
            cursor: pointer;
        }

        .arrow {
            position: absolute;
            right: 68px;
            bottom: 18px;
            border: solid 10px transparent;
            border-left-color: rgba(255,255,255,0.9);
            z-index: 2;
        }

        &.active,
        &:hover {
            border-color: rgba(255,165,0,0.15);

            .iconfont {
                color: #FFF;
                background: var(--base-color-brand);
                transition: background 100ms ease-in-out;
            }
        }
        &:hover {
            .iconfont {
                opacity: 0.9;
            }
        }
    }
}

.setting {
    &-wrap {
        position: absolute;
        right: 88px;
        bottom: -70px;
        width: 320px;

        background: rgba(255,255,255,0.9);
        box-shadow: 1px 2px 10px rgba(0, 0, 0, .25);
        border-radius: var(--border-radius-l);
        overflow: hidden;
        z-index: 1;
    }

    &-header {
        font-size: var(--text-size-l);
        padding: var(--spacing-m) ;
        color: var(--content-color-secondary);
        background: var(--background-color-secondary);
    }

    &-main {
        padding: 0 var(--spacing-m);

        .file-setting {
            div {
                display: flex;
                align-items: center;
                justify-content: space-between;

                padding: var(--spacing-m) var(--spacing-s);
                border-bottom: solid 1px var(--border-color-default);
                label {
                    min-width: 30px;
                    padding-right: var(--spacing-l);
                }

                span {
                    display: block;
                    min-width: 30px;
                    padding-left: var(--spacing-l);
                }

                &:last-child {
                    border-width: 0;
                }
            }
        }
    }

    &-footer {
        padding: 0 var(--spacing-m) var(--spacing-m);
        .restore-btn {
            display: block;
            width: 100%;
            height: 40px;
            line-height: 40px;
            margin-top: 10px;
            color:#FFF;
            text-align: center;
            background: var(--base-color-brand);
            border-radius: var(--border-radius-default);
            cursor: pointer;

            &:hover {
                opacity: 0.9;
            }
        }
    }
}
</style>
