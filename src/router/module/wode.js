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
        component: () => import('@/views/ShouKuan_WanLai/ShouKuanZhanhao.vue'),
        children: [
          {
            path: 'add',
            name: 'bill_get_skzh_add',
            component: () => import('@/views/ShouKuan_WanLai/ShouKuan_WanLai_Add.vue'),
          }
        ]
      },
      {
        name: 'bill_add_wanlai_danwei',
        path: 'bill_add_wanlai_danwei',
        component: () => import('@/views/ShouKuan_WanLai/WanLaiDanWei.vue')
        },
    ]
}