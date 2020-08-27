export default {
    path: '/bill',
    component: ()=> import('./../bill-container.vue'),
    children: [{
        path: 'add',
        name: 'bill_add',
        alias: ['/account/bill/edit', '/account/bill/add'],
        component: () => import('@/views/Bill_Add/Bill_Add.vue'),
        children: [{
                name: 'bill_add_expense_type',
                path: 'expense_type',
                component: () => import('@/views/Bill_Add/Bill_Add_ExpenseType.vue')
            },
            {
                name: 'bill_add_hexiao',
                path: 'hexiao',
                component: () => import('@/views/Bill_Add/Bill_Add_Hexiao.vue')
            },
        
            {
                // name: 'bill_add_wanlai_danwei',
                path: 'wanlai_danwei',
                component: () => import('@/views/ShouKuan_WanLai/WanLaiDanWei.vue')
            },
            {
                name: 'bill_add_fentang',
                path: 'fentang',
                component: () => import('@/views/Bill_Add/Bill_Add_FenTang.vue'),
                children: [{
                    name: 'bill_add_dept',
                    path: 'bill_add_dept',
                    component: () => import('@/views/Bill_Add/Bill_Add_Dept.vue')
                }]
            },
        ]
    },
    
    {
        path: 'get',
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
        name: 'bill_split',
            path: 'split',
            component: () => import('@/views/Bill_Add/Bill_Add_Split.vue'),
        },
      {
        path: 'get_type',
        name:'bill_get_danju_type',
        component: () => import('@/views/Bill_Get/Bill_Type.vue'),
      },
    
]}