export default {
    path: '/',
    name: 'home',
    components: {
        default:  () => import('@/views/Home/Home.vue'),
    },
    meta: {
        openTabbar: true,
    }
}