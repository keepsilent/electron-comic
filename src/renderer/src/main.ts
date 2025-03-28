import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createI18n } from 'vue-i18n';
import { i18nOptions} from './locales';

import App from './App.vue'
import router from './router/index.js';

import './assets/css/main.scss'
import './assets/iconfont/iconfont.css'

const app = createApp(App);
const i18n = createI18n(i18nOptions);

app.use(i18n);
app.use(router);
app.use(createPinia());
app.mount('#app');
