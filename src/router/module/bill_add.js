export default {
    path: '/bill/add',
    name: 'bill_add',
    alias: ['/bill/edit'],
    component: () => import('@/views/Bill_Add/Bill_Add.vue'),
    children: [
        {
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
        name: 'bill_add_wanlai_danwei',
        path: 'wanlai_danwei',
        component: () => import('@/views/ShouKuan_WanLai/WanLaiDanWei.vue')
        },
        {
        name: 'bill_add_fentang',
        path: 'fentang',
        component: () => import('@/views/Bill_Add/Bill_Add_FenTang.vue'),
        children: [
            {
            name: 'bill_add_dept',
            path: 'bill_add_dept',
            component: () => import('@/views/Bill_Add/Bill_Add_Dept.vue')
            }
        ]
        },
    ]
    
}