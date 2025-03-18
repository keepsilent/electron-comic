<template>
    <div v-if="show" :class="page.show ? 'confirm-mask opacity':'confirm-mask'"></div>
    <div v-if="show" :class="page.show ? 'confirm-wrap opacity':'confirm-wrap'">
        <div class="confirm-inner">
            <div class="confirm-main">
                <div v-if="title" class="title">{{ title }}</div>
                <div class="content">{{ content }}</div>
            </div>

            <div class="confirm-footer" >
                <div v-if="showCancel" class="btn-cancel" catchtap="onCancel">{{cancelText}}</div>
                <div class="btn-confirm" catchtap="onConfirm">{{confirmText}}</div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import {reactive, watch} from "vue";

interface Props {
    show: boolean,
    title: string,
    content: string,

    confirmText: string,
    showCancel: boolean,
    cancelText: string,
}

interface Page {
    show:boolean
}

const props = defineProps<Props>()
const page:Page = reactive({show: false})

watch(() => props.show,(value)=>{
    //延时显示，动画效果更佳
    setTimeout(()=> {page.show = value},10)
})
</script>

<style scoped lang="scss">
.confirm {
    &-mask {
        position: fixed;
        top: 0;
        left: 0;
        z-index: 8;
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
        z-index: 9;
        width: 100%;
        height: 100%;

        transition: opacity 0.25s ease-in-out;
        opacity: 0;
    }

    &-inner {
        width: 320px;

        background: #FFF;
        border-radius: 8px;
    }

    &-main {
        padding: 10px;

        .content {
            display: block;
            color: rgba(51, 51, 51, 1);
            font-size: 14px;
            text-align: center;
            line-height: 1.7;
        }
    }

    &-footer {
        display: flex;
        align-items: center;
        justify-content: space-between;
        line-height: 42px;

        font-size: 14px;
        color: var(--content-color-primary);
        text-align: center;
        border-top: var(--border-width-default) var(--border-style-solid) var(--border-color-default);

        .btn-cancel, .btn-confirm {
            width: 100%;
            cursor: pointer;
        }

        .btn-cancel {
            color: var(--content-color-tertiary);
            border-right: var(--border-width-default) var(--border-style-solid) var(--border-color-default);
        }
    }
}

.opacity {
    opacity: 1;
}


</style>
