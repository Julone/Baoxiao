import Vue from "vue";
import { dateFormat } from "@/utils/utils.js";
Vue.filter("date", (val, format)=>{
  if(!val) return '未知日期';
  return dateFormat(val,format)

});
Vue.filter("moneyFormat", (money, fixed = 2) => {
  return isNaN(Number(money)) ? money : Number(money).toFixed(fixed);
});
Vue.filter("subStr", (val = "", start, end) => {
  return String(val).substr(start, end);
});
Vue.filter('replace', (val, reg, str) => {
  return String(val).replace(reg, str)
})