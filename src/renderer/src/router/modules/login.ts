export default [
    {
        path: '/login',
        name: 'loginIndex',
        component: () => import('@renderer/views/login/index.vue'),
        meta: {
            title: '登录页'
        }
    }
];
