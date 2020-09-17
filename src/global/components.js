import Vue from 'vue';
import accountPicker from './../components/App_AccountSwitchPicker.vue';
import billMoney from './../components/Bill_Money.vue'
import scrollTop from './../components/App_ScrollTop.vue';
import accountItem from './../components/Account_Item.vue';
import billDanjuItem from './../components/Bill_DanjuItem.vue'
Vue.component('accountPicker',accountPicker);
Vue.component('accountItem', accountItem);
Vue.component('billMoney', billMoney);
Vue.component('scrollTop', scrollTop);
Vue.component('billDanjuItem', billDanjuItem)