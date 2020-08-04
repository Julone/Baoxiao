import { getStorage,setStorage,validatenull} from './../../utils/storage'
import {bill_get_ywcj} from 'api'
import {Toast} from 'vant'
export default {
    state: {
        ywcjList: getStorage({name: 'ywcjList'}) || [],
    },
    mutations:{
        SET_YWCJ_LIST(state, ywcjList){
            state.ywcjList = ywcjList;
            setStorage({name: 'ywcjList', content: ywcjList})
        }
    },
    actions:{
        ywcj_get_ywcl_list({state,commit, dispatch}, val){
            if(validatenull(state.ywcjList)){
                return bill_get_ywcj().then(r=>{
                    if(r.errcode == 0) {
                        commit('SET_YWCJ_LIST',r.data );
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
        }
    },
    getters: {
        ywcjList: state => state.ywcjList || [],

    }
}