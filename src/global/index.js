import Vue from 'vue';
import './components';
import './filter';
import './directives';
import {scrollTopTo, scrollLeftTo} from '@/utils/utils.js'
Vue.prototype.$scrollTopTo = scrollTopTo
Vue.prototype.$scrollLeftTo = scrollLeftTo