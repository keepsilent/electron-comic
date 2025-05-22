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
            <div class="launch-footer">{{t('launch')}}</div>
        </div>
    </div>
</template>

<script setup lang="ts">
import {useI18n} from "vue-i18n";
import {reactive, watch} from "vue";

interface Props {
    show: boolean
}

interface Page {
    show: boolean
}

const { t } = useI18n();
const props = defineProps<Props>()
const page = reactive<Page>({show: true})

watch(() => props.show,(value)=>{
    setTimeout(()=> {page.show = value},10)
})
</script>
<style src="./index.scss" lang="scss" scoped></style>
