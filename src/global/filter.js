import Vue from 'vue'
import {dateFormat} from '@/utils/utils.js'
Vue.filter('date', dateFormat);
