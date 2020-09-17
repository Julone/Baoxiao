import createBillAddRoute from './bill_add';
export default [
    createBillAddRoute(),
    {
      path: '/bill/get',
      name: 'bill_get_new',
      component: () => import('@/views/Bill_Get/Bill_Get.vue'),
      children: [
        createBillAddRoute('/bill/get'),
        {
          path: 'bill_get_dept',
          component: () => import('@/views/Bill_Add/Bill_Add_Dept.vue')
        },
        {
          path: 'bill_get_skzh',
          component: () => import('@/views/ShouKuan_WanLai/ShouKuanZhanhao.vue'),
          children: [{
            path: 'add',
            component: () => import('@/views/ShouKuan_WanLai/ShouKuan_WanLai_Add.vue'),
          }]
        },
        {
          path: 'wanlai_danwei',
          component: () => import('@/views/ShouKuan_WanLai/WanLaiDanWei.vue'),
          children: [{
            path: 'add',
            component: () => import('@/views/ShouKuan_WanLai/ShouKuan_WanLai_Add.vue'),
          }]
        },
        {
          path: 'bill_get_account',
          component: () => import('@/views/Bill_Get/Bill_Get_Account.vue')
        },
        {
          path: 'bill_get_jiekuandan',
          component: () => import('@/views/Bill_Get/Bill_Get_JieKuanDan.vue')
        },

      ]
    },
    {
      path: '/bill/get_type',
      component: () => import('@/views/Bill_Get/Bill_Type.vue'),
    },
  ]