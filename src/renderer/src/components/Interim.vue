<template>
    <div v-if="page.show" :class="page.space ? 'loading-wrap space': 'loading-wrap'">
        <div class="loading-inner">
            <div class="rect"></div>
            <div class="rect rect-two"></div>
            <div class="rect rect-three"></div>
        </div>
    </div>
</template>

<script setup lang="ts">
import {reactive, watch} from "vue";

interface Props {
    interim: {
        show: {
            type: boolean,
            default: true
        },
        space: {
            type: boolean,
            default: true
        }
    }
}

interface Page {
    show: boolean,
    space: boolean
}

const props = defineProps<Props>()
const page:Page = reactive({show: true, space: true})

watch(() => props.interim.show,(value) => {
    page.show = value
})

watch(() => props.interim.space,(value) => {
    page.space = value
})
</script>

<style scoped lang="scss">
.loading {
    &-wrap {
        display: flex;
        align-items: center;
        justify-content: center;
    }


    &-inner {
        display: flex;
        justify-content: space-between;

        width: var(--size-xs,16px);
        height: var(--size-xs,16px);
        font-size: var(--text-size-xs,10px);
        opacity: 0.75;

        .rect {
            width: 4px;
            height: 100%;

            border-radius: 8px;
            background: var(--content-color-tertiary);
            animation: spinner-bounce 0.6s infinite ease-in-out;
            transform-origin: center;
            opacity: 0.2;
        }

        .rect-two {
            animation-delay: 0.15s;
        }

        .rect-three {
            animation-delay: 0.3s;
        }
    }
}

.space {
    padding-top: 10%;
}
</style>
