<script setup lang="ts" name="Home">
import { ref } from 'vue'
// import type { TabsPaneContext } from 'element-plus'
// import { tabsConfig } from './config'
// import List from '@/components/List/index.vue'
// import Individual from './components/individual.vue'
// import SkeletonCard from '@/components/SkeletonCard/index.vue'
//
// const activeName = ref(tabsConfig[0].name)
//
// const handleClick = (tab: TabsPaneContext, event: Event) => {}
</script>

<template>
  <div class="padding-container">
    <Individual />
        <img alt="logo" class="logo" src="@renderer/assets/logo.svg" />
        <div class="creator">Powered by electron-vite</div>
        <div class="text">
          Build an Electron app with
          <span class="vue">Vue</span>
          and
          <span class="ts">TypeScript</span>
        </div>
        <p class="tip">Please try pressing <code>F12</code> to open the devTool</p>
        <div class="actions">
          <div class="action">
            <a href="https://electron-vite.org/" target="_blank" rel="noreferrer">Documentation</a>
          </div>
          <div class="action">
            <a target="_blank" rel="noreferrer" @click="ipcHandle">Send IPC</a>
          </div>
        </div>
  </div>
</template>

<style lang="less" scoped></style>
