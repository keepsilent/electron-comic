<template>
    <div v-if="show" :class="page.show ? 'launch-mask opacity': 'launch-mask'"></div>
    <div v-if="show" :class="page.show ? 'launch-wrap opacity': 'launch-wrap'">
        <div class='launch-inner'>
            <div class="launch-main">
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
            <div class="launch-footer">App is running, Please wait.</div>
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
