import axios from './axios';
var url = '/api';

export function bill_get_expense_type(){
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
export function auth_get_user_info (apptoken = '79bd3cea21feaff9'){
    // http://tm.lilanz.com/oa/api/lilanzimuser.ashx?apptoken=79bd3cea21feaff9
    return axios({
        url: '/oa',
        method: 'GET',
        params: {
            apptoken: apptoken
        }
        
    })
}
export function bill_get_expense_wldw(khid = 2){
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

