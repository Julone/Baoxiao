export default {
    path: '/wode',
    name: 'wode',
    component: () => import('@/views/Wode/Wode.vue'),
    meta: {
      openTabbar: true,
    },
    children: [
      {
        name: 'bill_get_skzh',
        path: 'bill_get_skzh',
        component: () => import('@/views/Bill_Get/Bill_Get_ShouKuanZH.vue'),
        children: [
          {
            path: 'add',
            name: 'bill_get_skzh_add',
            component: () => import('@/views/Bill_Get/Bill_Get_ShouKuanZH_Add.vue'),
          }
        ]
      },
    ]
}