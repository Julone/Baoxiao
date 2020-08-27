export default {
    state: {
        danju_type: [{
            title: '通用报销单',
            id: 1,
            children: [{
                    id: 1001,
                    mc: '通用报销单'
                }
            ]
        }, {
            title: '对公报销单',
            id: 2,
            children: [
                {
                    id: 1002,
                    mc: '对公报销单'
                },
            ]
        }]
    },
    getters: {
        bill_get_type: (state,getters) => (id) =>{
            return state.danju_type.map(el=>{
                return el.children.find(el=>el.id == id) ;
            }).find(Boolean)
        }
    }
}