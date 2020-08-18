export default [{
    path: '/bill/get',
    name:'bill_get_new',
    component: () => import('@/views/Bill_Get/Bill_Get.vue'),
    children: [
          {
            name: 'bill_get_dept',
            path: 'bill_get_dept',
            component: () => import('@/views/Bill_Add/Bill_Add_Dept.vue')
          },
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
            name: 'bill_get_minxi_from_account',
            path: 'bill_get_minxi_from_account',
            component: () => import('@/views/Bill_Get/Bill_Get_MinxiFromAccount.vue')
          },
          {
            name: 'bill_get_jiekuandan',
            path: 'bill_get_jiekuandan',
            component: () => import('@/views/Bill_Get/Bill_Get_JieKuanDan.vue')
          },
          
    ]
  },

  {
    path: '/bill/get_type',
    name:'bill_get_danju_type',
    component: () => import('@/views/Bill_Get/Bill_Type.vue'),
  },
]