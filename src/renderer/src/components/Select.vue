<template>
    <div class="input-select-wrap" v-outside>
        <div class="input-select-inner">
            <div class="input-select-main" @click="onShowDropDownBox">
                <input type="text" class="input-name" :value="select.name" readonly="true">
                <i class="iconfont icon-return"></i>
            </div>
            <div v-if="page.drop" class="dropdown-menu">
                <ul :class="select.options.length > 5 ? 'scrollbar scrollbar-space': 'scrollbar'">
                    <li v-for="(item,index) in select.options" :key="index" :data-name="item.name" :data-value="item.value" @click="onSelectOption">{{item.name}}</li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">

import {reactive} from "vue";

interface Props {
    select: {
        key: string,
        name: string,
        value: string,
        options: object,
    }
}

const props = defineProps<Props>()
const emit = defineEmits(['select'])
const page = reactive({name: '', value: '', drop: false})


const onShowDropDownBox = function ()  {
    page.drop = true;
}

const onSelectOption = function ({currentTarget: {dataset: {name,value}}}) {
    page.drop = false;
    props.select.name = name;
    props.select.value = value;
    emit('select',{key:props.select.key,name:name,value: value})
}

// 自定义指令，用于处理点击外部区域的事件
const vOutside = {
    beforeMount(el, binding) {
        // 在元素上绑定一个事件监听器
        el.clickOutsideEvent = function (event) {
            // 判断点击事件是否发生在元素外部
            if (!(el === event.target || el.contains(event.target))) {
                // 如果是外部点击，则执行绑定的函数
                //binding.value(event);
                page.drop = false;
            }
        };
        // 在全局添加点击事件监听器
        document.addEventListener("click", el.clickOutsideEvent);
    },
    unmounted(el) {
        // 在组件销毁前，移除事件监听器以避免内存泄漏
        document.removeEventListener("click", el.clickOutsideEvent);
    },
};
</script>


<style scoped lang="scss">

.input-select {
    &-wrap {
        position: relative;
        width: 100%;
        background-color: var(--background-color-tertiary);
    }

    &-inner {
        position: relative;
        padding: 8px 10px;

        .dropdown-menu {
            position: absolute;
            left: 0;
            top: 40px;

            width: 140px;
            background: #FFF;
            border: var(--border-width-default) var(--border-style-solid) var(--border-color-default);
            z-index: 1;

            overflow: auto;
            border-radius: var(--border-radius-default);
            box-shadow: var(--shadow-default);

            ul {
                max-height: 160px;
                padding: 10px;
                overflow: auto;

                li {
                    cursor: pointer;
                    padding: 7px 15px;
                    font-weight: normal;
                    &:hover {
                        background: var(--background-color-tertiary);
                        border-radius: var(--border-radius-default);
                    }
                }
            }
        }
    }

    &-main {
        display: flex;
        align-items: center;
        justify-content: space-between;

        cursor: pointer;
        height: 16px;
        overflow: hidden;

        .iconfont {
            font-size: var(--text-size-m);
            transform: rotate(270deg);
        }

        input {
            width: 100%;
            height: var(--controls-size-s);
            color: var(--content-color-secondary);
            font-size: var(--text-size-m);
            font-weight: var(--text-weight-medium);
            font-family: var(--text-family-default);
            line-height: var(--line-height-s);
            margin: 0;
            padding: 0;


            border-width: 0;
            background: transparent;
        }
    }
}
</style>
