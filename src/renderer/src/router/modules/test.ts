export default [
    {
        path: '/test',
        name: 'testIndex',
        component: () => import('@renderer/views/test/index.vue'),
        meta: {
            title: '测试页面'
        }
    }
];
