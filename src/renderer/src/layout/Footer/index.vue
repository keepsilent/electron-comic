<template>
    <div>
        I am Aside
    </div>

</template>

<!--<script>-->
<!--export default {-->
<!--    name: "index"-->
<!--}-->
<!--</script>-->

<!--<style scoped>-->

<!--</style>-->


<script setup lang="ts">
import {onMounted, onUnmounted, ref} from "vue";
import {test} from './index.ts'
// const {test} = index


console.log('a')

onMounted(()=>{
    test()
})
</script>
<style lang="scss" scoped>
@use "./index.scss";
</style>
