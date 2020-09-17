export default function (url_prefix = "") {
    return {
        path: url_prefix + '/bill/add',
        component: () => import('@/views/Bill_Add/Bill_Add.vue'),
        props: {
            url_prefix
        },
        children: [{
            path: 'expense_type',
            component: () => import('@/views/Bill_Add/Bill_Add_ExpenseType.vue')
          },
          {
            path: 'hexiao',
            component: () => import('@/views/Bill_Add/Bill_Add_Hexiao.vue')
          },
          {
            path: 'wanlai_danwei',
            component: () => import('@/views/ShouKuan_WanLai/WanLaiDanWei.vue')
          },
          {
            path: 'fentang',
            component: () => import('@/views/Bill_Add/Bill_Add_FenTang.vue'),
            children: [{
              path: 'bill_add_dept',
              component: () => import('@/views/Bill_Add/Bill_Add_Dept.vue')
            }]
          },
          {
            path: 'split',
            component: () => import('@/views/Bill_Add/Bill_Add_Split.vue'),
            props: {
                url_prefix
            },
          },
        ]
      }
}