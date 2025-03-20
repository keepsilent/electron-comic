import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createI18n } from 'vue-i18n';
import {i18nOptions} from './locales';


import App from './App.vue'
import router from './router/index.js';

import './assets/main.css'
import './assets/iconfont/iconfont.css'

const i18n = createI18n(i18nOptions);

console.log('i18n',i18n);
console.log('i18n',i18n.global);
console.log('i18n',i18n.global.locale);
// i18n.global.locale.subscribe((newLocale) => {
//     localStorage.setItem('locale', newLocale);
// });

const app = createApp(App);
app.use(router);
app.use(i18n);
app.use(createPinia());
app.mount('#app');
