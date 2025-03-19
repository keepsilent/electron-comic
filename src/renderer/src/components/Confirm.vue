<template>
    <div v-if="confirm.show" :class="page.show ? 'confirm-mask opacity':'confirm-mask'"></div>
    <div v-if="confirm.show" :class="page.show ? 'confirm-wrap opacity':'confirm-wrap'">
        <div class="confirm-inner">
            <div class="confirm-main">
                <div v-if="confirm.title" class="title">{{ confirm.title }}</div>
                <div class="content">{{ confirm.content }}</div>
            </div>

            <div class="confirm-footer" >
                <div v-if="confirm.showCancel" class="btn-cancel" @click="onCancel">{{confirm.cancelText}}</div>
                <div class="btn-confirm" @click="onConfirm">{{confirm.confirmText}}</div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import {reactive, watch} from "vue";

interface Props {
    confirm: {
        show: boolean,
        title: string,
        content: string,

        confirmText: string,
        showCancel: boolean,
        cancelText: string,
    }
}

interface Page {
    show:boolean
}

const emit = defineEmits(['cancel','confirm'])
const props = defineProps<Props>()
const page:Page = reactive({show: false})

const onCancel = function () {
    emit('cancel')
}

const onConfirm = function () {
    emit('confirm')
}
watch(() => props.confirm.show,(value)=>{
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
        width: 300px;

        background: #FFF;
        border-radius: 8px;
    }

    &-main {
        padding: 10px;
        text-align: center;
        line-height: 1.7;

        .title {
            padding-top: 5px;
            padding-bottom: 10px;
            line-height: 1;

            color: var(--content-color-primary);
            font-size: var(--text-size-xl);
            font-weight: bolder;
        }

        .content {
            color: var(--content-color-secondary);
            font-size: var(--text-size-m);
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
