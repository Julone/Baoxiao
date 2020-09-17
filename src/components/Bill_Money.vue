<template>
    <div class="bill-money-tag" :style="{color}">
        <span class="sign" v-if="sign">￥</span><span>{{ rowMoney | moneyFormat(accuracy)}}</span>
    </div>
</template>
<script>
export default {
    data(){
        return {
            rowMoney: ''
        }
    },
    props: {
        sign: {
            default: true,
            type: Boolean
        },
        color: {
            default: 'inherit',
            type: String
        },
        accuracy: {
            default: 2,
            type: [Number, String]
        },
        money: {
            default: 0,
            type: [Number, String]
        },
        blueText:{
            default: false,
            type:Boolean
        }
    },
    methods: {
        updateMoney(){
        if(this.$slots.default){
                    this.rowMoney = this.$slots.default[0].text.trim();
                }else{
                    this.rowMoney = this.money;
                }
        }
    },
    created(){
        this.blueText && (this.color = "#1989fa");
        this.updateMoney();
    },
    updated(){
        this.updateMoney();
    }
}
</script>
<style lang="less">
.bill-money-tag{
    display: inline;
    span.sign{
        font-size: 80%;
    }
}

</style>