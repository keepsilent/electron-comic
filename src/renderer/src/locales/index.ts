import { App } from 'vue';
import { createI18n, I18nOptions } from 'vue-i18n';
import en from './json/en.json';
import zh from './json/zh.json';


interface MessageSchema {
    welcome: string;
    message: {
        hello: string;
    };
    button: {
        submit: string;
        cancel: string;
    };
}

const messages: Record<string, MessageSchema> = {
    en:en,
    zh:zh,
};

const locale = localStorage.getItem('locale') || 'en';

const i18nOptions: I18nOptions = {
    locale: locale,
    fallbackLocale: 'en',
    messages: messages,
};

const i18n = createI18n(i18nOptions);

const setupI18n = {
    install(app: App) {
        app.use(i18n);
    }
}

export {
    i18n,
    i18nOptions,
    setupI18n
}
