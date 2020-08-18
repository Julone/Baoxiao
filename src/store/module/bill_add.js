import {getStorage,setStorage} from '@/utils/storage.js'
import makePinyin from './../../utils/pinyin'
import {bill_get_expense_type} from 'api'
export default {
    namespaced: true,
    modules: {
        expenseType: {
            namespaced: true,
            state: {
                list: getStorage({name: 'expenseTypeList'}) || [],
                recent: getStorage({ name: 'recent-xflx-list' }) || []
            },
            mutations: {
                SET_LIST(state, val){
                    state.list = val.map(el => {
                        el.pinyin = makePinyin(el.fylxmc).toString();
                        return el;
                    });
                    setStorage({name: 'expenseTypeList', content: state.list});
                },
                SET_RENCENT_XFLX(state, el){
                    var l = state.recent;
                    var index = l.findIndex(i => i.id == el.id);
                    if (index != -1) {
                        l.splice(index, 1)
                    }
                    l.unshift(el);
                    setStorage({
                        name: 'recent-xflx-list',
                        content: l
                    });
                }
            },
            actions: {
                async init_expenseType({commit, state}){
                    if(state.list.length > 0 ) return;
                    var rowList = await bill_get_expense_type().then(r => r.data ).catch(e => [])
                    await commit('SET_LIST',rowList);
                }
            }
        }
    }
}