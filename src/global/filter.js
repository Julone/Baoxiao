import Vue from 'vue'
import {dateFormat} from '@/utils/utils.js'
Vue.filter('date', dateFormat);
Vue.filter('moneyFormat', (money, fixed = 2)=>{
    return Number(money).toFixed(fixed)
});
Vue.filter('subStr',(val = "", start, end) => {
    return String(val).substr(start,end)
})