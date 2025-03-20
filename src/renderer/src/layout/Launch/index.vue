<template>
    <div v-if="show" :class="page.show ? 'loading-mask opacity': 'loading-mask'"></div>
    <div v-if="show" :class="page.show ? 'loading-wrap opacity': 'loading-wrap'">
        <div class='loading-inner'>
            <div class="loading-main">
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

            <div class="loading-footer">App is running,Please wait.</div>
        </div>

    </div>
</template>

<script setup lang="ts">
import {reactive, watch} from "vue";

interface Props {
    show: boolean
}

interface Page {
    show: boolean
}

const props = defineProps<Props>()
const page:Page = reactive({show: true})

watch(() => props.show,(value)=>{
    //延时显示，动画效果更佳
    setTimeout(()=> {page.show = value},10)
})
</script>
<style lang="scss" scoped>
@use "./index.scss";
</style>
