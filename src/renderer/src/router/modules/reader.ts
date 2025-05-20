import Reader from '@renderer/views/Reader/index.vue';

export default [
    {
        path: '/reader',
        name: 'readerIndex',
        component: () => Reader,
        meta: {
            title: 'reader'
        }
    }
];
