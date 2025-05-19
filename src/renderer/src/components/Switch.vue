<template>
    <div class="toggle-switch-container" @click="onToggleSwitch">
        <div :class="toggle.value ? 'toggle-switch is-active' : 'toggle-switch'"></div>
        <div class="toggle-title">
            <span :class="toggle.value ? 'toggle-switch-text toggle-switch-text-on' : 'toggle-switch-text toggle-switch-text-off'">{{toggle.value ? toggle.options[0]: toggle.options[1]}}</span>
        </div>
    </div>
</template>

<script setup lang="ts">

import {reactive} from "vue";

interface Props {
    toggle?: {
        key?: string,
        value?: string,
        options?:object
    }
}

const props = defineProps<Props>()
const emit = defineEmits(['switch'])

const onToggleSwitch = function () {
    const { value } = props.toggle;
    props.toggle.value = !value;
    emit('switch',{key:props.toggle.key,value: !value})
}
</script>


<style scoped lang="scss">
.toggle-switch-container {
    display: flex;
    align-items: center;
    cursor: default;
    -webkit-user-select: none;
    user-select: none;
    cursor: pointer
}

.toggle-switch {
    position: relative;
    width: var(--size-m);
    height: var(--size-xs);
    background: transparent;
    border-radius: 8px;
    border: var(--border-width-default) var(--border-style-solid) var(--content-color-tertiary);
    box-sizing: border-box;

    &:before{
        content: " ";
        position: absolute;
        height: 12px;
        width: 12px;
        top: 1px;
        left: 1px;
        border-radius: 6px;
        background: var(--content-color-tertiary);
    }
}

.toggle-switch.is-active {
    background: var(--base-color-brand);
    border-color: transparent;
}

.toggle-switch.is-active:before {
    right: 1px;
    left: initial;
    background: var(--content-color-constant);
}

.toggle-switch-text {
    font-weight: var(--text-weight-regular);
    font-size: var(--text-size-m);
    line-height: var(--line-height-s);
    margin-left: var(--spacing-xs);

    &-on {
        color: var(--content-color-primary);
    }

    &-off {
        color: var(--content-color-secondary);
    }
}
</style>
