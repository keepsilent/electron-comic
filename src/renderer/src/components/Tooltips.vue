<template>
    <div class="tooltip" @mouseenter="onFoucs">
        <slot></slot>
        <i :class="['arrow',placement]"></i>
        <span ref="text" :style="placement == 'left' ? 'left:-'+(width+8)+'px': ''" :class="['tips',placement]">{{content}}</span>
    </div>
</template>

<script setup lang="ts">
import {ref, reactive, onMounted, watch} from "vue";

const props = defineProps({
    content:{
        type:String,
        default: ''
    },
    effect: {
        type:String,
        default: 'dark'
    },
    placement: {
        type:String,
        default: 'top'
    }
});

const width = ref(0);
const text:{value?:any} = ref(null);

const onFoucs = function () {
    width.value = text.value.offsetWidth;
}

</script>

<style scoped lang="scss">
.tooltip {
    position: relative;
    cursor: pointer;
    line-height: 1;

    margin-left: var(--spacing-xxs);

    .arrow {
        display: none;
        position: absolute;

        border: 8px solid transparent;


        &.top {
            top: -10px;
            right: 0;
            border-top-color: var(--grey-70);
        }

        &.bottom {
            bottom: -10px;
            right: 0;
            border-bottom-color: var(--grey-70);
        }

        &.left {
            top: 0px;
            left: -10px;
            border-left-color: var(--grey-70);
        }
    }


    .tips {
        display: none;
        position: absolute;

        width: fit-content;
        white-space: nowrap;

        padding: var(--spacing-s) var(--spacing-s);
        color: #FFF;
        font-size: var(--text-size-m);
        background: var(--grey-70);
        border-radius: var(--border-radius-default);

        &.top {
            top: -36px;
            left: -120%;
        }

        &.bottom {
            bottom: -36px;
            left: -120%;
        }

        &.left {
            top:-35%;
            left: -340px;
        }
    }

    &:hover {
        .tips,.arrow {
            display: block;
        }
    }
}
</style>
