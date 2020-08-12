import Vue from 'vue'
import Vuex from 'vuex'
import home from './module/home'
import router from './../router'
import auth from './module/auth';
import ywcj from './module/ywcj';
import reg from './module/reg'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    appHeight: 0
  },
  mutations: {
    set_appHeight(state, appHeight){
      state.appHeight = appHeight;
    }
  },
  actions: {
    appGoback({}){
      router.go(-1);
    },
    appStart({dispatch}){
      dispatch('auth_getUserInfo').then(r=>{
        dispatch('ywcj_get_ywcl_list');
      }).catch( e=> {
        this.$toast('用户鉴权失败!')
      })
    }
  },
  getters: {
    app_height: state => state.appHeight
  },
  modules: {
    home,auth,ywcj,
    reg
  }
})
