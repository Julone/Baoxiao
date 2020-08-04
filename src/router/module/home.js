export default {
    path: '/',
    name: 'home',
    component: () => import('@/views/Home/Home.vue'),
    meta: {
        openTabbar: true,
    }
}