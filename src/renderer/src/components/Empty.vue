<template>
    <div v-if="empty.show" class="empty-wrap">
        <div class="empty-inner">
            <div class="icon-wrap">
                <div class="icon-inner">
                     <span class="left">
                        <i :class="['iconfont', empty.icon]"></i>
                    </span>
                    <span class="right">
                        <i :class="['iconfont', empty.icon]"></i>
                    </span>
                </div>
            </div>
            <p class="title">{{empty.title}}</p>
            <p class="subtitle">{{empty.subtitle}}</p>
        </div>
    </div>
</template>

<script setup lang="ts">
import {reactive, watch} from "vue";

interface Props {
    empty: {
        show: boolean,
        icon: string,
        title: string,
        subtitle?: string
    }
}

const props = defineProps<Props>()
</script>

<style scoped lang="scss">
.empty {
    &-wrap {
        display: flex;
        justify-content: center;

        width: 400px;
        margin: 0 auto;
        margin-top: 8vh;
        text-align: center;
     }

    &-inner {
        .icon {
            &-wrap {
                width: 155px;
                height: 145px;
                margin: 0 auto;
            }

            &-inner {
                position: relative;
                width: 100px;
                height: 100px;

                background: var(--grey-10);
                border-radius: var(--border-radius-max);

                .iconfont {
                    display: block;
                    width: 100px;
                    height: 100px;

                    color: rgba(0,0,0,0.10);

                    font-size: 88px;
                    line-height: 100px;
                    z-index: 1;
                }

                .left {
                    position: absolute;
                    top: 25px;
                    left: 25px;
                    width: 50px;
                    z-index: 2;
                    overflow: hidden;
                }

                .right {
                    position: absolute;
                    top: 25px;
                    left: 75px;
                    width: 50px;

                    z-index: 2;
                    overflow: hidden;
                    .iconfont {
                        color: rgba(0,0,0,0.15);
                        margin-left: -50px;
                    }
                }

                &::after {
                    content: '';
                    position: absolute;
                    top: 25%;
                    left: 30%;
                    width: 120px;
                    height: 120px;
                    background: var(--grey-10);
                    border-radius: var(--border-radius-max);
                }

                &::before {
                    content: '';
                    position: absolute;
                    top: 50%;
                    left: -10%;
                    width: 70px;
                    height: 70px;
                    background: var(--grey-10);
                    border-radius: var(--border-radius-max);
                }
            }
        }

        .title {
            padding-top: var(--spacing-l);
            color: var(--content-color-secondary);
            font-size: var(--text-size-l);
            font-weight: bolder;
        }

        .subtitle {
            padding-top: var(--spacing-m);
            color: var(--content-color-tertiary);
            font-size: var(--text-size-m);
            font-weight: bolder;
        }
    }
}
</style>
