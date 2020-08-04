export default {
    state :{
        regRules: {
            money: [
                { required: true, message: '请输入消费金额!', trigger:'onBlur' },
                { validator: (value, rule) => {
                    var i = value.indexOf('.');
                    if(i != -1)
                    return value.substr(i + 1).length <= 2 
                    else return true
                } , message: '金额精度为0.01元, 请修改金额', trigger:'onBlur'},
                { pattern: /^([\+ \-]?(([1-9]\d*)|(0)))([.]\d{0,2})?$/ , message: '金额格式不正确', trigger:'onBlur'},
                { validator: (value, rule) => Number(value) > 0, message: '金额不能小于0元', trigger:'onBlur'},
            ]
        }
    },
    getters:{
        regRules(state){
            return state.regRules
        }
    }
}