import {  store, url,Axios,axiosSilent, axiosByJSON, axiosByFormData} from './../api-middle-page';
export function account_get_list({
    status,
    group,
    zhbj,
    page,
    limit
}) {
    return axiosByFormData({
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

