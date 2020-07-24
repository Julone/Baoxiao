import axios from './axios';
var url = '/api';
import store from '@/store'

export function bill_get_expense_type() {
    return axios({
        url: url + "/getFylx",
        method: "POST",
    })
}
export function bill_get_ywcj() {
    return axios({
        url: url + "/getYwcj",
        method: "POST",
    })
}
export function auth_get_user_info(apptoken) {
    return axios({
        url: '/oa',
        method: 'GET',
        params: {
            apptoken: apptoken
        }

    })
}
export function bill_get_expense_wldw(khid = 2) {
    return axios({
        url: url + "/getWldw",
        method: "POST",
        params: {
            data: {
                khid
            }
        }
    })
}
export function bill_set_data(data) {
    console.log(store)
    return axios({
        url: url + '/setDj',
        method: 'POST',
        params: {
            data: {
                "wdpId": 140,
                "wdplx": 12611,
                "tzid": store.getters.activeAccount.khid,
                "khid": store.getters.activeAccount.khid,
                "djlx": data.djlx,
                "djlb": data.djlb,
                "zdr": store.getters.userinfo.cname,
                "ny": data.ny,
                "rq": data.rq,
                "yhzh": "",
                "khyh": "",            
                "zhmc":data.zhmc,
                "zhid": data.zhid,
                "je": data.je,
                "zhbj": data.zhbj,
                "bz": data.bz,
                "fydlmc": data.fydlmc,
                "fylxmc": data.fylxmc
            }
        }
    })
}

export function bill_get_hexiao(){
    return axios({
        url: url + '/chooseWdpfy',
        method: 'POST',
        params: {
            data: {
                "tzid":store.getters.activeAccount.khid,
                "zhmc":store.getters.userinfo.cname,
                "dpje":50
            }
        }
    })
}

export function bill_get_department(){
    return axios({
        url: url + '/getDeptListByTzidAndRq',
        method: 'POST',
        params: {
            data: {
                tzid: 10,
                rq: "202007"
            }
        }
    })

}