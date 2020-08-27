import axios, {axiosSilent, axiosByJSON} from './axios';
import {Toast} from 'vant'
var url1 = "http://webt.lilang.com/test-gw/demo";
var url2 = '/apicc';
var url3 = 'http://elilee.mynatapp.cc/api-proxy/receiptApi';
var url = process.env.NODE_ENV == 'development' ? url1 :process.env.VUE_APP_REMOTE_URL;

import store from '@/store'
export function bill_get_expense_type() {
    return axios({
        url: url + "/getFylx",
        method: "POST",
        data: {
            data: {
                "tzid": store.getters.activeAccount.khid,
            }
        }
    })
}
export function bill_get_ywcj() {
    return axios({
        url: url + "/getYwcj",
        method: "POST",
        data: {
            data: {
                "tzid": store.getters.activeAccount.khid,
            }
        }
    })
}
export function auth_get_user_info(apptoken = "") {
    if(!apptoken) return Toast.fail('身份失效, 请退出重试!')
    return axios({
        url: 'http://tm.lilanz.com/oa/api/lilanzimuser.ashx',
        method: 'GET',
        params: {
            apptoken: apptoken
        }
    })
}
export function bill_get_expense_wldw({keyword ="", page,limit} = {}) {
    return axiosSilent({
        url: url + "/getWldwByKhid",
        method: "POST",
        params: {
            data: {
                khid: store.getters.activeAccount.khid,
                "findName": keyword,
                page: page,
                limit: limit,
            }
        }
    })
}
export function bill_add_get_wldw_by_name(zhmc) { 
    return axiosSilent({
        url: url + '/getWldwSkzhByKhidAndZhmc',
        method: 'POST',
        data : {
            data: {
                khid: store.getters.activeAccount.khid,
                zhmc: zhmc,
            }
        }
    })
}

export function bill_set_data(data) {
    var formData = {
        "tzid": store.getters.activeAccount.khid,
        "khid": store.getters.activeAccount.khid,
        "zdr": store.getters.userinfo.cname,
        "userid": store.getters.userinfo.id,
        "ny": data.ny,
        "rq": data.rq,
        "yhzh": "",
        "khyh": "",
        "je": data.je,
        "bz": data.bz,
        xflx: {
            "fydlmc": data.fydlmc,
            "fylxmc": data.fylxmc,
            "id": data.fylxid
        },
        "fp_info": data.fp_info,
        "ft_info": data.ft_info,
        "ywcj": {
            "djlx": data.djlx,
            "id": data.djlb
        },
        wanlai_danwei: {
            "id": data.zhid,
            "zhmc": data.zhmc,
            "zhbj": data.zhbj,
        },
        zhbj: data.dgbs,
    }
    if (data.update_id) {
        formData.id = data.update_id;
    }
    if(data.split_id ){
        formData.pfyid = data.split_id
    }
    if(data.wdp_list.length > 0) {
        formData.wdp_list = data.wdp_list
    }
    return axiosByJSON({
        url: url + '/setFy',
        method: 'POST',
        data: {
            data: formData
        }
    })
}

export function bill_del_danju(id) {
    return axios({
        url: url + '/delFygById',
        method: 'POST',
        data: {
            data: {
                "tzid": store.getters.activeAccount.khid,
                id,
            }
        }
    })
}

export function bill_get_hexiao({zhmc,wdpje}) {
    return axios({
        url: url + '/chooseWdpfy',
        method: 'POST',
        params: {
            data: {
                "khid": store.getters.activeAccount.khid,
                "zhmc": zhmc,
                "dpje": wdpje,
                "userid": store.getters.userinfo.id,
            }
        }
    })
}

export function bill_get_department({
    page,
    limit,
    name = '',
    id ='',
    rq='202007'
}) {
    return axios({
        url: url + '/getDeptListByTzidAndRq',
        method: 'POST',
        params: {
            data: {
                tzid: store.getters.activeAccount.khid,
                rq,
                page,
                limit,
                name,
                id
            }
        }
    })

}
export function account_get_list({
    status,
    group,
    zhbj,
    page,
    limit
}) {
    return axios({
        url: url + '/getFyList',
        method: 'POST',
        data: {
            data: {
                "tzid": store.getters.activeAccount.khid,
                userid: store.getters.userinfo.id,
                status: status,
                group: group,
                zhbj: zhbj,
                page,
                limit
            }
        }
    })
}

export function bill_add_get_weidaopiao_money({
    zhmc
}) {
    return axiosSilent({
        url: url + '/getWdpje',
        method: 'POST',
        params: {
            data: {
                khid: store.getters.activeAccount.khid,
                userid: store.getters.userinfo.id,
                zhmc: zhmc,
            }
        }
    })
}
export function bill_edit_get_danjuInfo(id) {
    return axios({
        url: url + '/getFyMsgById',
        method: 'POST',
        params: {
            data: {
                id: id,
                "tzid": store.getters.activeAccount.khid,

            }
        }
    })
}
export function bill_edit_remove_danju(id) {
    return axios({
        url: url + '/getDjMsgById',
        method: 'POST',
        params: {
            data: {
                "tzid": store.getters.activeAccount.khid,
                id: id
            }
        }
    })
}

export function skzh_get_list() {
    return axios({
        url: url + '/getMySkzh',
        method: 'POST',
        data: {
            data: {
                khid: store.getters.activeAccount.khid,
                "tzid": store.getters.activeAccount.khid,
            }
        }
    })
}
export function skzh_del_by_id(id){
    return axios({
        url: url +'/delYhzlByid',
        method: 'POST',
        data: {
            data: {
                "tzid": store.getters.activeAccount.khid,
                id: id
            }
        }
    })
}
export function skzh_get_by_id(id) {
    return axios({
        url: url + '/getYhzlByid',
        method: 'POST',
        data: {
            data: {
                id: id,
                "tzid": store.getters.activeAccount.khid,
            }
        }
    })
}

export function parse_info_from_base64(base64Str) {
    return axiosByJSON({
        // http://192.168.35.136:15003/ORCSystem/PicRecognition
        // url: 'http://elilee.mynatapp.cc/api-proxy/receiptAI/ORCSystem/PicRecognition',
        url:'http://elilee.mynatapp.cc/api-proxy/receiptAI/ORCSystem/PicRecognition',
        method: 'POST',
        data: {
            base64Str: base64Str
        },
        timeout: 25000,
        timeoutErrorMessage: '上传超时, 请稍候再试!'
    })
}

export function skzh_get_khyh(findName = ""){
    return  axios({
        url: url + '/getKhyh',
        method: 'POST',
        data: {
            data:{
                findName: findName,
                "tzid": store.getters.activeAccount.khid,
            }
        }
    })
}

export function skzh_get_khss(){
    return axios({
        url: url + '/getShenOrShi',
        method: 'POST',
        data: {
            data: {
                "tzid": store.getters.activeAccount.khid,
            }
        }
    })
}
export function skzh_get_fzh(yhlb, shi){
    return axios({
        url: url +"/getFzhByYhlbAndShi",
        method: 'POST',
        data: {
            data: {
                yhlb, shi,
                "tzid": store.getters.activeAccount.khid,

            }
        }
    })
}
export function skzh_set_skzh_or_wldw(data, is_wldw = false) {
    var formData = {
        "khid":  store.getters.activeAccount.khid,
        "userid": store.getters.userinfo.id,
        "hm": data.hm,
        "yhkh": data.yhkh,
        "khyh": data.khyh,
        "khss": data.khss,
        "fzh": data.fzh,
        "zhbj": is_wldw? 1 : 2,
        "zhlx": is_wldw? 2 : 1
    }
    if(data.update_id) {
        formData.id = data.update_id
    }
    return axios({
        url: url + "/setYhzl",
        method: 'POST',
        data: {
            data:formData
        }
    })
}