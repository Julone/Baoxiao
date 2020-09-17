import {  store, url,Axios,axiosSilent, axiosByJSON, axiosByFormData} from './../api-middle-page';
export function bill_get_expense_type() {
    return axiosByFormData({
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
    return axiosByFormData({
        url: url + "/getYwcj",
        method: "POST",
        data: {
            data: {
                "tzid": store.getters.activeAccount.khid,
            }
        }
    })
}


export function bill_set_feiyong(data) {
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
    if (data.edit_id) {
        formData.id = data.edit_id;
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

export function bill_del_feiyong(id) {
    return axiosByFormData({
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
    return axiosByFormData({
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
export function bill_get_feiyongInfo(id, multiple = false) {
    var idGroup = String(id).trim().split(',').filter(Boolean);
    var path = idGroup.length > 1  || multiple? '/getFyMsgByIdList' : '/getFyMsgById';
    console.log(idGroup)
    return axiosByFormData({
        url: url + path,
        method: 'POST',
        params: {
            data: {
                id: idGroup.join(','),
                "tzid": store.getters.activeAccount.khid,

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
    return axiosByFormData({
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