import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { i18n } from './locales/index';

import App from './App.vue'
import router from './router/index.js';

import './assets/css/main.scss'
import './assets/iconfont/iconfont.css'

const app = createApp(App);

app.use(i18n);
app.use(router);
app.use(createPinia());
app.mount('#app');
