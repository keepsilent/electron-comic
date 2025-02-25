<template>
    <div>This is test {{counter.count}}</div>

    <router-view />
</template>

<script lang="ts" setup>
import {ref } from 'vue'
import {useCounterStore} from '@/stores/counter'

const counter = useCounterStore();

counter.count++;
counter.increment();
console.log('counter.count',counter.count);
console.log('counter.doubleCount',counter.doubleCount);



//
// const name:string = ref('keepsilent')
// console.log(name.value)
//
console.log('test.count',test.count);
// test.increment();
// console.log('doubleCount',test.doubleCount);
</script>

<style scoped>

</style>
