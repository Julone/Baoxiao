import { getStorage,setStorage,validatenull} from './../../utils/storage'
import {auth_get_user_info} from 'api'
import {Toast} from 'vant'
export default {
    state: {
        apptoken: getStorage({name: 'apptoken'}) || "", // 103ac4c22bcc8a71 //4c8f9c243b7954cd
        activeAccount: getStorage({name: 'activeAccount'}) || {},
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
         // {
        //     onoff: 1, id: 25604, cname: "李祖龙"
        // }
    },
    mutations:{
        SET_APPTOKEN(state, apptoken){
            state.apptoken = apptoken;
            setStorage({name: 'apptoken',type: 'session', content: apptoken})
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
            setStorage({name: 'userinfo',type: 'session', content: userinfo});
        }
    },
    actions:{
        auth_getUserInfo({state,commit, dispatch}, apptoken){
            if(validatenull(state.userinfo)) {
                apptoken = process.env.NODE_ENV =='development'? '4c8f9c243b7954cd' : apptoken
                return auth_get_user_info(apptoken).then(r=>{
                    commit('SET_APPTOKEN', apptoken);
                    commit('SET_ACCOUNT',r.data.account );
                    commit('SET_USERINFO',r.data.info[0]);
                    dispatch('choose_active_account',r.data.account[0]);
                    Toast('欢迎您, '+ state.userinfo.cname);
                    return Promise.resolve(true);
                }).catch(e => {
                    return Promise.reject(false);
                })
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