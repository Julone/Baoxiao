import {  store, url,Axios,axiosSilent, axiosByJSON, axiosByFormData} from './../api-middle-page';

export function skzh_get_khyh(findName = ""){
    return  axiosByFormData({
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
    return axiosByFormData({
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
    return axiosByFormData({
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
    return axiosByFormData({
        url: url + "/setYhzl",
        method: 'POST',
        data: {
            data:formData
        }
    })
}
export function bill_get_wldw({keyword ="", page,limit} = {}) {
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
export function bill_get_wldw_by_name(zhmc) { 
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

export function skzh_get_list() {
    return axiosByFormData({
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
    return axiosByFormData({
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
    return axiosByFormData({
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