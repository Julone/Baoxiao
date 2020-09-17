import createBillAddRoute from './bill_add';
export default {
    path: '/account',
    name: 'account',
    component: () => import('@/views/Account/Account.vue'),
    meta: {
        openTabbar: true,
        keepAlive: true,
        savedPosition: {x:0,y:0},
    },
    children: [
        createBillAddRoute('/account')
    ]
}