export default [
    {
        path: '/auth',
        component: () => import('./../../views/Auth.vue')
    }
    ,{
        path: '*',
        component: ()=> import('@/views/Error/Error.vue'),
    }
]