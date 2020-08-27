export default {
    money: [{
            required: true,
            message: '请输入消费金额!',
            trigger: 'onBlur'
        },
        {
            validator: (value, rule) => {
                var i = value.indexOf('.');
                if (i != -1) {
                    return value.substr(i + 1).length <= 2

                } else {
                    return true
                }
            },
            message: '金额精度为0.01元, 请修改金额!',
            trigger: 'onBlur'
        },
        {
            pattern: /^([\+ \-]?(([1-9]\d*)|(0)))([.]\d{0,2})?$/,
            message: '金额格式不正确',
            trigger: 'onBlur'
        },
        {
            validator: (value, rule) => Number(value) > 0,
            message: '金额不能小于或等于0元',
            trigger: 'onBlur'
        },
    ],
    percent: [
        {
            required: true,
            message: '请输入比例范围!',
            trigger: 'onBlur'
        },
        {
            validator: (value, rule) => {
               var d = Number(value);
               if(d > 100 || d <= 0) {
                   return false
               }else {
                   return true
               }
            },
            message: '比例范围应该大于0%且小于等于100%',
            trigger: 'onBlur'
        },
    ],
    wanlai_danwei: [{ required: true, message: '请输入往来单位',trigger:'onChange' }],
    expenseType:[{ required: true, message: '请选择消费类型',trigger:'onChange' }]
}