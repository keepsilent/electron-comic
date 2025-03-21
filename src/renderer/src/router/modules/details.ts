export default [
    {
        path: '/details',
        name: 'detailsIndex',
        component: () => import('@renderer/views/details/index.vue'),
        meta: {
            title: '详情'
        }
    }
];
