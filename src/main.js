import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './global/index'
// import './utils/flexible.js'
import './vant.js'
Vue.prototype.$eventBus = new Vue();
Vue.config.productionTip = false;
Vue.config.silent = true;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')