//class
import Vue from 'vue'
import Vuex from 'vuex'

import { sync } from 'vuex-router-sync'
import router from './../router'
//data
import regRules from '../utils/regRules';
//module
import auth from './module/auth';
import bill_get from './module/bill_get';
import bill_add from './module/bill_add';
//utils
import {Toast,Dialog} from 'vant';
import {clearStorage} from './../utils/storage';

Vue.use(Vuex)
var store = new Vuex.Store({
  state: {
    appHeight: 0,
    appRefreshToken: 0,
    regRules: regRules,
    accountPickerStatus: false 
  },
  getters: {
    appHeight: state => state.appHeight,
    regRules: state => state.regRules,
    appRefreshToken: state => state.appRefreshToken,
    accountPickerStatus: state => state.accountPickerStatus
  },
  mutations: {
    set_appHeight(state, appHeight){
      state.appHeight = appHeight;
    },
    set_accountPickerStatus(state, accountPickerStatus){
      state.accountPickerStatus = accountPickerStatus;
    }
  },
  actions: {
    appGoback({state}){
      return new Promise((res,rej)=>{
        router.go(-1);
        setTimeout(()=>{
          res(1) 
        }, 300)
      });
    },
    appAuthStart({dispatch, commit}, {apptoken, reset= false} = {}){
      if(reset) {
        dispatch('appClearCache', {confirm:false, silent: true})
      }
      dispatch('auth_getUserInfo', apptoken).then(r=>{
        dispatch('ywcj_get_ywcl_list');
        dispatch('bill_add/expenseType/init_expenseType')
      }).catch( e => {
        Toast('鉴权失败, 请退出重试!')
      })
    },
    async appClearCache({commit, dispatch}, {confirm= true, silent = false, redirect = null} = {}){
      if(confirm) {
        var r = await Dialog.confirm({ title: '确定', message: '是否要清除缓存?', }).then(r => true).catch(e=>false);
        if( r == false) {return false;} 
      }
        commit('SET_YWCJ_LIST' , []);
        commit('SET_ACTIVE_ACCOUNT' , {});
        commit('SET_ACCOUNT' , []);
        commit('SET_USERINFO' , {});
        commit('SET_APPTOKEN' , '');
        clearStorage({ type: 'all' });
        !silent && Toast.success('缓存清除成功, 请退出重试');
        if(redirect) {
          redirect && router.push(redirect)
        }
    },
    appExit(){
      try{
        llApp.closeWKView();
      }catch(e){
        window.location.reload();
      }
    }
  },
  modules: { auth, bill_get, bill_add }
})
sync( store, router );
export default store;