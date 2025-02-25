export default [
    {
        path: '/recycle',
        name: 'recycleIndex',
        component: () => import('@renderer/views/Recycle/index.vue'),
        meta: {
            title: '回收站'
        }
    }
];
