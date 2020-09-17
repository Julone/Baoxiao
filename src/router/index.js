import Vue from 'vue'
import VueRouter from 'vue-router';

import home from './module/home';
import account from './module/account';
import shenpi from './module/shenpi';
import bill from './module/bill';
import wode from './module/wode';
import others from './module/_others';

Vue.use(VueRouter);
const routes = [ home, account, shenpi, wode, ...bill,...others ];
const router = new VueRouter({
  mode: process.env.NODE_ENV == 'development' ? 'history' : 'hash',
  routes,
})

router.beforeEach(async (to,from,next) => {
  if(from.meta.savedPosition) {
    var scroll_container = document.querySelector('.savedPosition_container') || document.querySelector('html,body');
    console.log('savedPosition', from.meta.savedPosition)
    from.meta.savedPosition = {x:0,y:scroll_container.scrollTop};
  }
  next();
})

router.afterEach((to,from) => {
  if( !to.meta.savedPosition && !to.meta.noAutoScrollTop) {
    window.scrollTo(0,0)
  }
})
const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push (location) {
return originalPush.call(this, location).catch(err => err)
}
export default router