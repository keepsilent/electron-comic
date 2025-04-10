export default [
    {
        path: '/reader',
        name: 'readerIndex',
        component: () => import('@renderer/views/reader/index.vue'),
        meta: {
            title: '详情'
        }
    }
];
