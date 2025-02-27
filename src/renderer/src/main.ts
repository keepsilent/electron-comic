import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router/index.js';

import './assets/main.css'
import './assets/iconfont/iconfont.css'

const app = createApp(App);
app.use(router);
app.use(createPinia());
app.mount('#app');
