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
                    var recent = state.recent;
                    var index = recent.findIndex(i => i.id == el.id);
                    index != -1 && recent.splice(index, 1);
                    recent.unshift(el);
                    recent = recent.filter((el,i)=> i + 1 <= 10);
                    setStorage({
                        name: 'recent-xflx-list',
                        content: recent
                    });
                }
            },
            actions: {
                async init_expenseType({commit, state}, force = false){
                    if(state.list.length > 0 && !force) return console.log('费用类型列表已加载!');
                    var rowList = await bill_get_expense_type().then(r => r.data ).catch(e => [])
                    await commit('SET_LIST',rowList);
                    console.log('现在的费用类型列表: ', state.list);
                }
            }
        }
    }
}