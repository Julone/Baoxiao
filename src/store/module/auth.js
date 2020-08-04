import { getStorage,setStorage,validatenull} from './../../utils/storage'
import {auth_get_user_info} from 'api'
import {Toast} from 'vant'
export default {
    state: {
        apptoken: getStorage({name: 'apptoken'}) || "103ac4c22bcc8a71",
        accountList: getStorage({name: 'accountList'}) || [],
        // {
        //     khdm: "C36221"
        //     khid: 11355
        //     khlb: "L"
        //     khlbmc: "领航"
        //     khmc: "1领航营销管理有限公司"
        //     zbid: 1
        // }
        userinfo: getStorage({name: 'userinfo'}) || {},
        activeAccount: getStorage({name: 'activeAccount'}) || {}
        // {
        //     onoff: 1, id: 25604, cname: "李祖龙"
        // }
    },
    mutations:{
        SET_APPTOKEN(state, apptoken){
            state.apptoken = apptoken;
            setStorage({name: 'apptoken', content: apptoken})
        },
        SET_ACTIVE_ACCOUNT(state,account){
            state.activeAccount = account;
            setStorage({name: 'activeAccount', content: account})
        },
        SET_ACCOUNT(state,value){
            state.accountList = value
            setStorage({name: 'accountList', content: value})
        },
        SET_USERINFO(state,userinfo){
            state.userinfo = userinfo;
            setStorage({name: 'userinfo', content: userinfo});
        }
    },
    actions:{
        auth_getUserInfo({state,commit, dispatch}, val){
            if(validatenull(state.userinfo) || validatenull(state.accountList) || validatenull(state.activeAccount)){
                return auth_get_user_info(state.apptoken).then(r=>{
                    if(r.errcode == 0) {
                        commit('SET_ACCOUNT',r.data.account );
                        commit('SET_USERINFO',r.data.info[0]);
                        dispatch('choose_active_account',r.data.account[0]);             
                        return true;
                    }else {
                        return false;
                    }
                }).catch(e => {
                    return false;
                })
            }else{
                return Promise.resolve(true)
            }
        },
        choose_active_account({state,commit}, val){
            commit('SET_ACTIVE_ACCOUNT', val);
        }
    },
    getters: {
        apptoken: state => state.apptoken || '',
        activeAccount: state => state.activeAccount || [],
        accountList: state => state.accountList || {},
        userinfo: state => state.userinfo || {}
    }
}