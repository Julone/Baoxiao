import Vue from 'vue'
import VueRouter from 'vue-router';

import home from './module/home'
import account from './module/account'
import shenpi from './module/shenpi'
import bill_add from './module/bill_add'
import bill_get from './module/bill_get'
import wode from './module/wode';
import others from './module/others'

Vue.use(VueRouter);
const routes = [ home, account, shenpi, wode, bill_add, ...bill_get,...others ];
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

const router = new VueRouter({
  mode: process.env.NODE_ENV == 'development' ? 'history' : 'hash',
  routes,
})
router.beforeEach((to,from,next) => {
  var y = document.documentElement.scrollTop || document.body.scrollTop;
  if(from.meta.savedPosition) {
    from.meta.savedPosition = {x:0,y:y};
  }
  next();
})
router.afterEach((to,from) => {
  if( !to.meta.savedPosition && !to.meta.noAutoScrollTop) {
    window.scrollTo(0,0)
  }
})
export default router