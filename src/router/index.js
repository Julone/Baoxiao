import Vue from 'vue'
import VueRouter from 'vue-router';
import RouterViewComponent from './router-view.vue'
Vue.use(VueRouter);
const routes = [{
    path: '/',
    name: 'Home',
    component: () => import('../views/Home.vue'),
    redirect: '/bill/add'
  },
  {
    path: '/bill',
    component: RouterViewComponent,
    children: [{
        path: 'add',
        component: () => import('../views/Bill_Add.vue'),
        children: [
          {
            name: 'bill_add_expense_type',
            path: 'expense_type',
            component: () => import('./../views/Bill_Add_ExpenseType.vue')
          },
          {
            name: 'bill_add_expense_city',
            path: 'expense_city',
            component: () => import('./../views/Bill_Add_ExpenseCity.vue')
          },
          {
            name: 'bill_add_wanlai_danwei',
            path: 'wanlai_danwei',
            component: () => import('./../views/Bill_Add_WanLaiDanWei.vue')
          },
        ]
      },
      {
        path: 'get',
        name: 'get',
        alias: [''],
        component: () => import('../views/Bill_Get.vue')
      }
    ]
  }
];

const router = new VueRouter({
  mode: process.env.NODE_ENV == 'development' ? 'history' : 'hash',
  routes,
})

export default router