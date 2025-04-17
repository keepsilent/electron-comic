<template>
    <div class="tooltip">
        <slot></slot>
        <i class="arrow"></i>
        <span class="tips">{{content}}</span>
    </div>
</template>

<script setup lang="ts">
import {reactive, watch} from "vue";

interface Props {
    content:string,
    effect?:string,
    placement?:string
}

const props = defineProps<Props>()
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
        top: -10px;
        right: 0;
        border: 8px solid transparent;
        border-top-color: var(--grey-70);
    }

    .tips {
        display: none;
        position: absolute;
        top: -36px;
        left: -180%;
        width: fit-content;
        white-space: nowrap;

        padding: var(--spacing-s) var(--spacing-s);
        color: #FFF;
        font-size: var(--text-size-m);
        background: var(--grey-70);
        border-radius: var(--border-radius-default);
    }

    &:hover {
        .tips,.arrow {
            display: block;
        }
    }
}
</style>
