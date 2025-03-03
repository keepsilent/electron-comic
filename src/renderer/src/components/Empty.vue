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

            background: var(--grey-30);
            border-radius: var(--border-radius-max)
        }

        .title {
            padding-top: var(--spacing-l);
            color: var(--content-color-secondary);
            font-size: var(--text-size-l);
        }

        .subtitle {
            padding-top: var(--spacing-xxs);
            color: var(--content-color-tertiary);
            font-size: var(--text-size-m);
        }
    }
}
</style>
