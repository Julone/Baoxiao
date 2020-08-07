import axios, {axiosSilent} from './axios';
var url = process.env.NODE_ENV == 'development' ? '/api' : 'http://webt.lilang.com/api-proxy/cost-api';
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
        url: 'http://tm.lilanz.com/oa/api/lilanzimuser.ashx',
        method: 'GET',
        params: {
            apptoken: apptoken
        }

    })
}
export function bill_get_expense_wldw() {
    return axios({
        url: url + "/getWldwByKhid",
        method: "POST",
        params: {
            data: {
                khid: store.getters.activeAccount.khid
            }
        }
    })
}
export function bill_set_data(data) {
    // var postMessage = {
    //     "tzid": 1,
    //     "khid": 1,
    //     "zdr": "phq",
    //     "xflx": {
    //         "fydlmc": "办公",
    //         "fylxmc": "鼠标"
    //     },
    //     "ywcj": {
    //         "djlx": 12611,
    //         "id": 7187
    //     },
    //     "wanlai_danwei": {
    //         "zhmc": "上海科才企业管理咨询有限公司",
    //         "zhbj": 0,
    //         "zhid": 123
    //     },
    //     "ft_info": [],
    //     "ny": "202006",
    //     "rq": "2020-06-06",
    //     "yhzh": "",
    //     "khyh": "",
    //     "je": 30,
    //     "bz": "备注"
    // }
    var formData = {
        "wdpId": 140,
        "wdplx": 12611,
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
        },
        "ft_info": data.ft_info,
        "ywcj": {
            "djlx": data.djlx,
            "id": data.djlb
        },
        wanlai_danwei: {
            "zhid": data.zhid,
            "zhmc": data.zhmc,
            "zhbj": data.zhbj,
        },
        zhbj: data.dgbs
    }
    if (data.update_id) {
        formData.id = data.update_id;
    }
    return axios({
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
                id
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
                "tzid": store.getters.activeAccount.khid,
                "zhmc": zhmc,
                "dpje": wdpje
            }
        }
    })
}

export function bill_get_department({
    page,
    limit,
    name =''
}) {
    return axios({
        url: url + '/getDeptListByTzidAndRq',
        method: 'POST',
        params: {
            data: {
                tzid: store.getters.activeAccount.khid,
                rq: "202007",
                page,
                limit,
                name
            }
        }
    })

}
export function account_get_danjuList({
    status,
    group,
    zhbj
}) {
    return axios({
        url: url + '/getFyList',
        method: 'POST',
        params: {
            data: {
                userid: store.getters.userinfo.id,
                status: status,
                group: group,
                zhbj: zhbj
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
                tzid: store.getters.activeAccount.khid,
                zhmc: zhmc
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
                id: id
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
                id: id
            }
        }
    })
}

export function bill_get_skzh() {
    return axios({
        url: url + '/getSkzhByKhid',
        method: 'POST',
        data: {
            data: {
                // khid: store.getters.userinfo.id
                khid: 9
            }
        }
    })
}

export function bill_set_skzh({
    zhlx,
    zhmc,
    yhh
}) {
    // var a = {
    //     "tzid": 1,
    //     "khid": 1,
    //     "name": "phq_test",
    //     "zhbj": 0,
    //     "zhmc": "phq_test",
    //     "yhzh": "123456",
    //     "khyh": "测试银行",
    //     "yhhh": "222",
    //     "bankProvince": "福建",
    //     "bankCity": "晋江",
    //     "zhlx": 2
    // }
    // {
    //     tzid:m,
    //     wldw: {

    //     },
    //     skzh: {

    //     }
    // }
    return axios({
        url: url + '/setWldw',
        method: 'POST',
        data: {
            data: {
                "tzid": store.getters.activeAccount.khid,
                "userid": store.getters.userinfo.id,
                "zhlx": zhlx,
                "zhmc": zhmc,
                "yhhh": yhh,

            }
        }
    })
}

