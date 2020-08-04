export default {
    path: '/bill/edit',
    name: 'bill_edit',
    component: () => import('@/views/Account/Bill_Edit.vue'),
    children: [
        {
        name: 'bill_edit_expense_type',
        path: 'expense_type',
        component: () => import('@/views/Bill_Add/Bill_Add_ExpenseType.vue')
        },
        {
        name: 'bill_edit_hexiao',
        path: 'hexiao',
        component: () => import('@/views/Bill_Add/Bill_Add_Hexiao.vue')
        },
        {
        name: 'bill_edit_wanlai_danwei',
        path: 'wanlai_danwei',
        component: () => import('@/views/Bill_Add/Bill_Add_WanLaiDanWei.vue')
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