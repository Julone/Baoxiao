import { bill_get_danju_type } from 'api'
import {getStorage,setStorage} from '@/utils/storage.js'

export default {
    state: {
        danju_type: getStorage({name: 'danjuType'}) || []
    },
    actions: {
        bill_get_fetchType({state}){
            bill_get_danju_type().then(r=>{
                state.danju_type = r.data.map(el=>{
                    console.log(el)
                    return el
                });
                setStorage({name: 'danjuType',type:'session', content: state.danju_type})
            })
        }
    },
    getters: {
        bill_get_type: (state,getters) => (id) =>{
            return state.danju_type.find(el=>el.id == id);
        }
    }
}