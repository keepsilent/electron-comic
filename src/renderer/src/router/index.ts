import type { App } from 'vue';
// 引入 login.ts
import LoginRouter from './modules/login';
// 引入 test.ts
import TestRouter from './modules/test';
import StoreRouter from './modules/store';
// import { close, start } from '@/utils/nprogress';
import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';


export const publicRoutes: Array<RouteRecordRaw> = [
    // ...LoginRouter,
    // ...TestRouter,
    // ...StoreRouter,
    {
        path: '/',
        name: 'homeIndex',
        component: () => import('@renderer/views/home/index.vue')
    }
];

const router = createRouter({
    history: createWebHashHistory(),
    routes: publicRoutes
});

// 路由前置后卫
// router.beforeEach(() => {
//     // 开启进度条
//     start();
// });
// // 路由后置后卫
// router.afterEach(() => {
//     // 关闭进度条
//     close();
// });

/* 初始化路由表 */
export function resetRouter() {
    router.getRoutes().forEach((route) => {
        const { name } = route;
        if (name) {
            router.hasRoute(name) && router.removeRoute(name);
        }
    });
}


export default router;
// /* 导出 setupRouter */
// export const setupRouter = (app: App<Element>) => {
//     app.use(router);
// };
