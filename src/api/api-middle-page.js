import Axios, {axiosSilent, axiosByJSON, axiosByFormData} from './axios';
import store from '@/store'
//url config
var url1 = "http://webt.lilang.com/test-gw/svr-reimbursement";
var url2 = '/apicc';
var url3 = 'http://elilee.mynatapp.cc/api-proxy/receiptApi';
var url = process.env.NODE_ENV == 'development'? url1 : process.env.VUE_APP_REMOTE_URL;

export * from './module/auth';
export * from './module/bill_add';
export * from './module/bill_get';
export * from './module/fapiao';
export * from './module/skzh';
export * from './module/account';

export { url,Axios,axiosSilent, axiosByJSON, axiosByFormData, store };