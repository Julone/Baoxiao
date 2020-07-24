<template>
    <div class="wanlai-danwei-container" :style="{height: app_height +'px'}">
   <van-nav-bar title="往来单位"  left-text="返回" left-arrow
            @click-left="$store.dispatch('appGoback')" />
            
        <div class="sklafjal">


<div style="width: 100%">
    <!-- {{curTypeList}} -->
    <!-- 42 -->
 <van-cell v-for="el in list" :key="el.id" clickable is-link :title="el.zhmc" @click="$emit('chooseWldw',el)" :label="el.khyh"  />
</div>
    </div>
    </div>
</template>
<script>
    import {
        bill_get_expense_wldw
    } from 'api'
    import {mapGetters} from 'vuex'
    
    export default {
        data(){
            return {
                list: []
            }
        },
    
        computed:{
            curTypeList(){
                console.log(this.typeList);
                return this.typeList[this.activeKey]
            },
            ...mapGetters(['app_height'])
        },
     
        created() {
            bill_get_expense_wldw().then(r => {
                if(r.errcode==0 && r.data.length){
                    this.list = r.data.map(el=>el)

                }
            })
            console.log(this.$route);
        },
    }
</script>
<style lang="less">
.wanlai-danwei-container{
    // .flex(@d:column;@j:space-around);
    height: 100vh;
    display: flex;
    overflow: hidden;
    flex-direction: column;
    .van-nav-bar{
        flex:none;
    }
    .sklafjal{
        .flex(@a: strech);
        flex:1;
        height: 100%;
        overflow: scroll;
    }

}

</style>