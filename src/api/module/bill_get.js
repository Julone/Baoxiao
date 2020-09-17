import {  store, url,Axios,axiosSilent, axiosByJSON, axiosByFormData} from './../api-middle-page';
export function bill_set_danju(data){
     return axiosByFormData({
        url: url + "/setDj",
        method: "POST",
        data: {
            data: {
                "khid": store.getters.activeAccount.khid,
                "userid": store.getters.userinfo.id,
                "zdr": store.getters.userinfo.cname,
                "zhbz": data.zhbz,
                "cdr": store.getters.userinfo.cname,
                "cdbm": data.cdbm,
                "bz":data.bz,
                "zhbj": 1,
                "fyList": data.fyList,
                "skzh": data.skzh,
                "djlx": data.djlx,
                "id": data.id,
                "wanlai_danwei": data.wanlai_danwei
            }
        }
    })
}
export function bill_get_fyListForDanju({
    status,
    group,
    zhbj,
    page,
    limit,
    dgbs,
    wanlai_danwei
}) {
    return axiosByFormData({
        url: url + '/getFyListForDj',
        method: 'POST',
        data: {
            data: {
                "tzid": store.getters.activeAccount.khid,
                userid: store.getters.userinfo.id,
                status: status,
                group: group,
                zhbj: zhbj,
                dgbs:dgbs,
                wanlai_danwei:wanlai_danwei,
                page,
                limit
            }
        }
    })
}

export function bill_get_danjuList(){
    return axiosByFormData({
        url: url + '/getDjListByUserid',
        method: 'POST',
        data: {
            data: {
                "tzid": store.getters.activeAccount.khid,
                "userid": store.getters.userinfo.id,
            }
        }
    })
}

export function bill_get_danju(dj_id){
    return axiosByFormData({
        url: url + '/getDjMsgById',
        method: 'POST',
        data: {
            data: {
                "tzid": store.getters.activeAccount.khid,
                "userid": store.getters.userinfo.id,
                "id": dj_id
            }
        }
    })
}

export function bill_del_danju(dj_id){
    return axiosByFormData({
        url: url + '/delDjById',
        method: 'POST',
        data: {
            data: {
                "tzid": store.getters.activeAccount.khid,
                "userid": store.getters.userinfo.id,
                "id": dj_id
            }
        }
    })
}

export function bill_get_danju_type(){
    return axiosByFormData({
        url: url + '/getDjlxList',
        method: 'POST',
        data: {
            data: {
                "tzid": store.getters.activeAccount.khid,
            }
        }
    })
}

export function bill_get_computeJE(data){
    return axiosByFormData({
        url: url + '/computeJe',
        method: 'POST',
        data: {
            data: JSON.stringify(data)
        }
    })
}