import {  store, url,Axios,axiosSilent, axiosByJSON, axiosByFormData} from './../api-middle-page';
import {Toast} from 'vant'
export function auth_get_user_info(apptoken = "") {
    if(!apptoken) return Toast.fail('身份失效, 请退出重试!')
    return axiosByFormData({
        url: 'http://tm.lilanz.com/oa/api/lilanzimuser.ashx',
        method: 'GET',
        params: {
            apptoken: apptoken
        }
    })
}
export function wx_get_ticket (param) {  
    return axiosByFormData({
        url: '/wxSystemPars.ashx',
        method: 'GET',
        params: {
            action: 'getWXjsTicket',
            configkey: '7',
            configtype: 'QY'
        }
    })
}