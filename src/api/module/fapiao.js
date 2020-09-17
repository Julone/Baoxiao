import {  store, url,Axios,axiosSilent, axiosByJSON, axiosByFormData} from './../api-middle-page';
import NProgress from 'nprogress'; // progress bar
export function parse_info_from_base64(base64Str) {
    return axiosByJSON({
        // http://192.168.35.136:15003/ORCSystem/PicRecognition
        // url: 'http://elilee.mynatapp.cc/api-proxy/receiptAI/ORCSystem/PicRecognition',
        url:'http://elilee.mynatapp.cc/api-proxy/receiptAI/ORCSystem/PicRecognition',
        method: 'POST',
        data: {
            "base64Str": base64Str,
        },
        timeout: 25000,
        timeoutErrorMessage: '上传超时, 请稍候再试!'
    })
}
 
export function bill_upload_fapiao(base64Str, that) {
    base64Str = base64Str.replace(/^data:image\/\w+;base64,/, "");
    return axiosByJSON({
        url:url + '/fpsb',
        method: 'POST',
        data: {
            data:{
                "base64Str": base64Str,
                "tzid": store.getters.activeAccount.khid,
            }
        },
        cancelToken: new Axios.CancelToken(function executor(c) { // 设置 cancel token
            that.cancelRequest = c;
        }),
        timeout: 20000,
        timeoutErrorMessage: '上传超时, 请稍候再试',
        onUploadProgress: progressEvent=>{
            NProgress.inc(0.7);
        }
    })
}
export function bill_check_fapiao(fapiao) {
    return axiosByJSON({
        url:url + '/checkFp',
        method: 'POST',
        data: {
            data:{
                "tzid": store.getters.activeAccount.khid,
                "id": fapiao.id,
                "fpdm": fapiao.fpdm,
                "fphm": fapiao.fphm,
                "kprq":fapiao.kprq,
                "fplx_code": fapiao.fplx_code,
                "totalAmount": fapiao.totalAmount,
                "jym": fapiao.jym
            }
        },
        timeout: 20000,
        timeoutErrorMessage: '验真超时, 请稍候再试',
    })
}

export function bill_get_wx_fapiao(choose_invoice_info) {
    return axiosByJSON({
        url:url + '/getWxFpMsg',
        method: 'POST',
        data: {
            data:{
                "tzid": store.getters.activeAccount.khid,
                "choose_invoice_info": choose_invoice_info
            }
        },
        timeout: 20000,
        timeoutErrorMessage: '验真超时, 请稍候再试',
    })
}