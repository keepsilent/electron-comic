<template>
    <div v-if="pagination.show" class="pagination-wrap">
        <span v-for="(item,index) in page.data" :key="index" :class="item.scene" @click="onPage(item.value)">
            <template v-if="item.name == 'prev'">
                <i class="iconfont icon-prev"></i>
            </template>
            <template v-else-if="item.name == 'next'">
                <i class="iconfont icon-next"></i>
            </template>
             <template v-else-if="item.name == 'prev-double'">
                <i class="iconfont icon-prev-double"></i>
            </template>
             <template v-else-if="item.name == 'next-double'">
                <i class="iconfont icon-next-double"></i>
            </template>
            <template v-else>{{item.name}}</template>
        </span>
    </div>
</template>

<script setup lang="ts">

import {reactive, onMounted, watch} from "vue";
import {debounce, throttle} from "@renderer/utils/throttle";

interface Props {
    pagination: {
        show: boolean,
        page: number,
        totalPage: number,
    },
    set?: string
}

const emit = defineEmits(['chagePage'])
const props = defineProps<Props>()
const page:{data:{name?:string,scene?:string,value?:string}[]} = reactive({data:[]})


onMounted(() => {
    createPagination();
})

watch(() => props.pagination.page,(value)=>{
    page.data = [];
    createPagination();
})

watch(() => props.pagination.totalPage,(value)=>{
    page.data = [];
    createPagination();
})

const onPage = throttle((value) => {
    if(props.pagination.page == value) {
        return false
    }
    emit('chagePage',{value: value})
})

interface dataInter {
    name:string,
    value?:number,
    scene?:string
}
const createPagination = function () {
    let data:dataInter[] = [];
    const step:string = props.set as string || '10';
    const middle:number = parseInt((Number(step) / 2).toString());
    const {page, totalPage} = props.pagination

    if(page == totalPage && page == 1) {
        return false;
    }

    const begin = getBegin(page, middle);
    const end = getEnd(page, middle, totalPage);

    data = addPrevDoubleBtn(data, page, totalPage, middle);
    data = addPrevBtn(data, page);
    data = addPageBtn(data, begin, end, page)
    data = addNextBtn(data, page, totalPage);
    data = addNextDoubleBtn(data, page, totalPage, middle)
    //page.data = data;
    assignData(data);
}


const getBegin = function (page:number, middle:number):number {
    if(page <= middle) {
        return 1;
    }

    return page - middle;
}

const getEnd = function (page:number, middle:number, totalPage: number):number {
    if(page + middle > totalPage) {
        return totalPage;
    }

    return page + middle;
}

const addPageBtn = function(data:any[], begin:number, end:number, current:number):dataInter[] {
    for (let i = begin; i <= end; i++) {
        if (i == current) {
            data.push({ name: i, value: i, scene:'selected'});
        } else {
            data.push({ name: i, value: i, scene:''});
        }
    }

    return data;
}

const addPrevDoubleBtn = function(data:dataInter[],page:number, totalPage: number, middle:number):dataInter[] {
    if(totalPage <= middle) {
        return data;
    }

    if(page == 1) {
        return data;
    }

    data.push({ name: 'prev-double', value: 1, scene:''})
    return data;
}

const addPrevBtn = function(data:dataInter[],page:number):dataInter[] {
    if(page - 1 <= 0) {
        return data;
    }

    data.push({ name: 'prev', value: page - 1, scene:''})
    return data;
}

const addNextBtn = function(data:dataInter[], page:number, totalPage:number):dataInter[] {
    if(page + 1 > totalPage) {
        return data;
    }

    data.push({ name: 'next', value: page + 1, scene:''})
    return data;
}

const addNextDoubleBtn = function(data:dataInter[],page:number, totalPage:number,middle:number):dataInter[] {
    if(totalPage <= middle) {
        return data;
    }

    if(page == totalPage) {
        return data;
    }

    data.push({ name: 'next-double', value: totalPage, scene:''})
    return data;
}

const assignData = function (data):void {
    page.data = data;
}
</script>

<style scoped lang="scss">
.pagination {
    &-wrap {
        display: flex;
        align-items: center;
        justify-content: center;

        margin-top: var(--spacing-l);
        padding-bottom: var(--spacing-l);

        span {
            width: 28px;
            height: 28px;
            line-height: 28px;
            margin-right: var(--spacing-xxs);

            font-size: var(--text-size-m);
            text-align: center;
            font-weight: normal;
            border-radius: var(--border-radius-max);
            cursor: pointer;

            &.selected,&:hover {
                font-weight: bolder;
                background: var(--background-color-tertiary);
            }

            &.els {
                color: var(--content-color-tertiary);
                font-weight: normal;
                background: #FFF;
                cursor: inherit;
                &:hover {
                    color: var(--content-color-tertiary);
                    font-weight: normal;
                    background: #FFF;
                }
            }

            &.disabled {
                color: var(--content-color-tertiary);
                font-weight: normal;
                background: #FFF;
                cursor: inherit;

                &:hover {
                    color: var(--content-color-tertiary);
                    font-weight: normal;
                    background: #FFF;
                }
            }
        }
    }
}
</style>
