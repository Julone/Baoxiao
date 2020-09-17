export default {
    path: '/wode',
    name: 'wode',
    component: () => import('@/views/Wode/Wode.vue'),
    meta: {
      openTabbar: true,
    },
    children: [
      {
        path: 'bill_get_skzh',
        component: () => import('@/views/ShouKuan_WanLai/ShouKuanZhanhao.vue'),
        children: [
          {
            path: 'add',
            component: () => import('@/views/ShouKuan_WanLai/ShouKuan_WanLai_Add.vue'),
          }
        ]
      },
      {
        path: 'wanlai_danwei',
        component: () => import('@/views/ShouKuan_WanLai/WanLaiDanWei.vue'),
        children: [
          {
            path: 'add',
            component: () => import('@/views/ShouKuan_WanLai/ShouKuan_WanLai_Add.vue'),
          }
        ]
      },
    ]
}