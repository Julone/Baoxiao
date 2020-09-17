import NProgress from 'nprogress'; // progress bar
import 'nprogress/nprogress.css';
import Axios from "axios";
import {axios_dataToFormdata } from './utils'
import { Toast, } from 'vant';
var axiosInitialConfig = {
  timeout: 10000,
  withCredentials: false,
  validateStatus: function (status) {
    return status >= 200 && status <= 500
  }
}
NProgress.configure({
  showSpinner: false,
  speed: 800,
  trickle: true
});
var axiosBase = Axios.create(axiosInitialConfig);
// HTTPrequest拦截
axiosBase.interceptors.request.use(config => {
  NProgress.remove();
  NProgress.start();
  return config;
}, error => {
  return Promise.reject(error)
})

// HTTPresponse拦截
axiosBase.interceptors.response.use(res => {
  NProgress.done()
  const status = Number(res.status) || 200
  const errmsg = res.data.errmsg || '抱歉,服务器崩溃了';
  const errcode = res.data.errcode;
  if (errcode != 0 || status != 200) {
      Toast({ message: errmsg + "\n\n" + JSON.stringify(res.data), type: 'fail', forbidClick: false, duration: 4000 ,className: 'apiError'});
    return Promise.reject(res.data);
  } else {
    return Promise.resolve(res.data);
  }
}, error => {
  NProgress.done();
  Toast({ message: error.message, type: 'text', forbidClick: false, duration: 1000});
  return Promise.reject({errcode: -1, errmsg: error.message})
})

export const axiosByFormData = (params) => {
  var config = {
    headers: {
      'content-type': 'application/x-www-form-urlencoded'
    },
    data: axios_dataToFormdata(params.data)
  }
  return axiosBase(Object.assign(params, config))
}
export const axiosByJSON = (params) => {
  var config = {
    data: params.data
  }
  return axiosBase(Object.assign(params, config))
}
export const axiosSilent = (config) => {
    let axiosInstance = Axios.create(axiosInitialConfig);
    axiosInstance.interceptors.request.use(config => { return config; }, error => { return Promise.reject(error) });
    axiosInstance.interceptors.response.use(res => {
      const status = Number(res.status) || 200;
      const errcode = res.data.errcode;
      if (errcode != 0 || status != 200) { return Promise.reject(res.data); } else { return Promise.resolve(res.data); }
    }, error => {
      return Promise.reject(error)
    })
    config.data = axios_dataToFormdata(config.data);
    return axiosInstance({...config});
}
export default Axios;