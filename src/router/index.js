import Vue from 'vue'
import VueRouter from 'vue-router';
import RouterViewComponent from './router-view.vue'
Vue.use(VueRouter);
const routes = [{
    path: '/',
    name: 'home',
    component: () => import('../views/Home/Home.vue'),
    meta: {
      openTabbar: true
    }
  },
  {
    path: '/account',
    name: 'account',
    component: () => import('../views/Account/Account.vue'),
    meta: {
      openTabbar: true
    }
  },
  {
    path: '/shenpi',
    name: 'shenpi',
    component: () => import('../views/Shenpi/Shenpi.vue'),
    meta: {
      openTabbar: true
    }
  },{
    path: '/wode',
    name: 'wode',
    component: () => import('../views/Wode/Wode.vue'),
    meta: {
      openTabbar: true
    }
  },
  {
    path: '/bill',
    component: RouterViewComponent,
    children: [{
        path: 'add',
        name: 'bill_add',
        component: () => import('../views/Bill_Add/Bill_Add.vue'),
        children: [
          {
            name: 'bill_add_expense_type',
            path: 'expense_type',
            component: () => import('./../views/Bill_Add/Bill_Add_ExpenseType.vue')
          },
          {
            name: 'bill_add_hexiao',
            path: 'hexiao',
            component: () => import('./../views/Bill_Add/Bill_Add_Hexiao.vue')
          },
          {
            name: 'bill_add_wanlai_danwei',
            path: 'wanlai_danwei',
            component: () => import('./../views/Bill_Add/Bill_Add_WanLaiDanWei.vue')
          },
          {
            name: 'bill_add_fentang',
            path: 'fentang',
            component: () => import('./../views/Bill_Add/Bill_Add_FenTang.vue'),
            children: [
              {
                name: 'bill_add_dept',
                path: 'bill_add_dept',
                component: () => import('./../views/Bill_Add/Bill_Add_Dept.vue')
              }
            ]
          },
        ]
      },
      {
        path: 'get',
        name: 'bill_get',
        component: RouterViewComponent,
        children: [
          {
            path: '',
            name:'bill_get_new',
            component: () => import('../views/Bill_Get/Bill_Get.vue'),
            children:[
              {
                name: 'bill_get_dept',
                path: 'bill_get_dept',
                component: () => import('./../views/Bill_Add/Bill_Add_Dept.vue')
              },
              {
                name: 'bill_get_skzh',
                path: 'bill_get_skzh',
                component: () => import('./../views/Bill_Get/Bill_Get_ShouKuanZH.vue')
              },
              {
                name: 'bill_get_minxi_from_account',
                path: 'bill_get_minxi_from_account',
                component: () => import('./../views/Bill_Get/Bill_Get_MinxiFromAccount.vue')
              },
              {
                name: 'bill_get_jiekuandan',
                path: 'bill_get_jiekuandan',
                component: () => import('./../views/Bill_Get/Bill_Get_JieKuanDan.vue')
              }
              
            ]
          },
          {
            path: 'type',
            name:'bill_get_danju_type',
            component: () => import('../views/Bill_Get/Bill_Get_DanjuType.vue'),
          },
        
        ]
      }
    ]
  }
];

const router = new VueRouter({
  mode: process.env.NODE_ENV == 'development' ? 'history' : 'hash',
  routes,
})

export default router