<template>
    <div v-if="show" :class="page.show ? 'loading-mask opacity': 'loading-mask'"></div>
    <div v-if="show" :class="page.show ? 'loading-wrap opacity': 'loading-wrap'">
        <div class='loading-inner'>
            <div class="rect"></div>
            <div class="rect rect-two"></div>
            <div class="rect rect-three"></div>

<!--            <div>-->
<!--                <div>-->
<!--                    <div>-->
<!--                        <div>-->
<!--                            <div>-->
<!--                                <div>-->
<!--                                    <div></div>-->
<!--                                </div>-->
<!--                            </div>-->
<!--                        </div>-->
<!--                    </div>-->
<!--                </div>-->
<!--            </div>-->
        </div>
    </div>
</template>

<script setup lang="ts">
import {reactive, watch} from "vue";

interface Props {
   show: boolean
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
.loading {
    &-mask {
        position: fixed;
        top:0;
        left: 0;
        z-index: 8;
        width: 100%;
        height: 100%;

        background: rgba(0,0,0,0.15);
        transition: opacity 0.25s ease-in-out;
        opacity: 0;
    }

    &-wrap {
        position: fixed;
        top: 50%;
        left: 50%;
        z-index: 9;

        display: flex;
        align-items: center;
        justify-content: center;

        width: 46px;
        height: 46px;

        margin-left: -25px;
        margin-top: -25px;

        background: #FFF;
        border-radius: 8px;
        box-shadow: 1px 1px 10px rgba(0,0,0,0.15);
        transition: opacity 0.25s ease-in-out;
        opacity: 0;
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
            background: var(--content-color-tertiary,#A6A6A6);
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

.opacity {
    opacity: 1;
}

@keyframes spinner-bounce {
    0%, 100% {
        transform: scaleY(0.4);
        opacity: 0.8;
    }

    50% {
        transform: scaleY(1);
        opacity: 1;
    }
}
</style>
