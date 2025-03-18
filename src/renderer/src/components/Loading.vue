<template>
    <div v-if="show" :class="page.show ? 'loading-mask opacity': 'loading-mask'"></div>
    <div v-if="show" :class="page.show ? 'loading-wrap opacity': 'loading-wrap'">
        <div class='loading-inner'>
            <div>
                <div>
                    <div>
                        <div>
                            <div>
                                <div>
                                    <div></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
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

        width: 60px;
        height: 60px;
        padding: 5px;
        margin-left: -30px;
        margin-top: -30px;

        background: #FFF;
        border-radius: 8px;
        box-shadow: 1px 1px 10px rgba(0,0,0,0.15);
        transition: opacity 0.25s ease-in-out;
        opacity: 0;
    }

    &-inner {
        display: block;
        box-sizing: border-box;
        width: 60px;
        height: 60px;
        overflow: hidden;

        div {
            box-sizing: border-box;
            height: 100%;
            padding: 1px;

            border: 2px solid transparent;
            border-top-color: rgba(0, 0, 0, .12);
            border-bottom-color: rgba(255,165,0,0.35);
            border-radius: 50%;
            animation: rotate linear 3.5s infinite;

            will-change: transform;
        }
    }
}

.opacity {
    opacity: 1;
}

@keyframes rotate {
    0% {  transform: rotate(0deg);  }
    50% {  transform: rotate(180deg);  }
    100% {  transform: rotate(360deg);  }
}
</style>
