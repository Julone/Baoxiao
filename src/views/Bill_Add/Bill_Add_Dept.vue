<template>
    <div class="wanlai-danwei-container" :style="{height: app_height +'px'}">
   <van-nav-bar title="部门选择"  left-text="返回" left-arrow
            @click-left="$store.dispatch('appGoback')" />
        <div class="main-content">
<div style="width: 100%">
 <van-cell v-for="el in list" :key="el.id" clickable is-link :title="el.name" @click="$emit('select_dept',el)" :label="el.khyh"  />
</div>
    </div>
    </div>
</template>
<script>
    import {
        bill_get_department
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
                return this.typeList[this.activeKey]
            },
            ...mapGetters(['app_height'])
        },
        created(){
             bill_get_department().then(r => {
                if(r.errcode==0 && r.data.length){
                    this.list = r.data.map(el=>el).filter((el,i)=>i<60)
                }
            })

        },
     
        activated() {
           
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
    background: white;
    .van-nav-bar{
        flex:none;
    }
    .main-content{
        .flex(@a: strech);
        flex:1;
        height: 100%;
        overflow: scroll;
    }

}

</style>