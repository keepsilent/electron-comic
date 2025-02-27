<template>
    <div class="empty-wrap tc">
        <div class="empty-inner">
            <p :class="['iconfont', icon]"></p>
            <p class="title">{{title}}</p>
            <p class="subtitle">{{subtitle}}</p>
        </div>
    </div>
</template>

<script setup lang="ts">
interface Props {
    icon: string,
    title: string,
    subtitle?: string
}
const props = defineProps<Props>()
// const props = defineProps({
//     icon: {
//         type: String,
//         default: 'icon-delete-fill',
//     },
//     title: {
//         type: String,
//         default: '您的回收站为空噢～'
//     },
//     subtitle: {
//         type: String,
//         default: '您的回收站为空噢～'
//     },
// });
</script>

<style scoped lang="scss">
.empty {
    &-wrap {
         position: absolute;
         top: 50%;
         left: 50%;
     }

    &-inner {
        width: 212px;
        height: 144px;

        margin-left: -101px;
        margin-top: -72px;

        .iconfont {
            width: 100px;
            height: 100px;
            margin: 0 auto;

            color: #FFF;
            font-size: 58px;
            line-height: 100px;

            background: rgba(0,0,0,0.1);
            border-radius: 100%;
        }

        .title {
            padding-top: 25px;
            color: #666;
            font-size: 14px;
        }

        .subtitle {
            padding-top: 5px;
            color: #999;
            font-size: 12px;
        }
    }
}
</style>
