<template>
    <div class="input-wrap">
        <div class="input-inner">
            <input type="text" class="input-name"  readonly="true">
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

</script>


<style scoped lang="scss">
.input {
    &-wrap {
        padding-left: 10px;
        padding-right: 10px;
        border-radius: var(--border-radius-default);
        border: var(--border-width-default) var(--border-style-solid) var(--border-color-default);
        background-color: var(--background-color-primary);
    }

    &-inner {
        position: relative;

        input {
            width: 100%;
            height: var(--controls-size-default);

            color: var(--content-color-primary);
            font-size: var(--text-size-m);
            line-height: var(--line-height-m);
            font-family: var(--text-family-default);

            border-width: 0;
            background: transparent;
        }
    }
}
</style>
