import { getStorage,setStorage} from './../../utils/storage'
export default {
    state: {
        apptoken: getStorage({name: 'apptoken'}) || ""
    },
    mutations:{
        SET_APPTOKEN({state}, apptoken){
            state.apptoken = apptoken;
            setStorage({name: 'apptoken', content: apptoken})
        }
    },
    getters: {
        apptoken: state => state.apptoken
    }
}