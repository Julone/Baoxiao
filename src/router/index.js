import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter);
const routes = [
  {
    path: '',
    name: 'Home',
    component: () => import('../views/Home.vue')
  },
  {
    path: 'about',
    name: 'About',
    component: () => import('../views/About.vue')
  }
];

const router = new VueRouter({
  mode: process.env.NODE_ENV == 'development' ? 'history' : 'hash',
  routes,
})

export default router