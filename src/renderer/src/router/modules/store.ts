export default [
    {
        path: '/store',
        name: 'storeIndex',
        component: () => import('@renderer/views/store/index.vue'),
        meta: {
            title: 'Pinia store'
        }
    }
];
