export default [
    {
        path: '/taxonomy',
        name: 'taxonomyIndex',
        component: () => import('@renderer/views/taxonomy/index.vue'),
        meta: {
            title: 'taxonomy'
        }
    }
];
