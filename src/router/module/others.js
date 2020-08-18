export default [
    {
        path: '/auth',
        component: () => import('./../../views/Auth.vue')
    },
    // {
    //     name: 'bill_get_skzh',
    //     path: '/bill/get/bill_get_skzh',
    //     alias: ['/wode/bill_get_skzh'],
    //     component: () => import('@/views/ShouKuan_WanLai/ShouKuanZhanhao.vue'),
    //     children: [
    //       {
    //         path: 'add',
    //         name: 'bill_get_skzh_add',
    //         component: () => import('@/views/ShouKuan_WanLai/ShouKuan_WanLai_Add.vue'),
    //       }
    //     ]
    //   },
    
    
    
    {
        path: '*',
        component: ()=> import('@/views/Error/Error.vue'),
    }
]