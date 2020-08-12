<template>
    <div class="wo_container">
        <van-nav-bar title="我的" />
        <van-cell is-link class="user-card">
            <template #title>
                <div class="title">
                    <van-image
                        round
                        width="13vw"
                        height="13vw"
                        src="https://img.yzcdn.cn/vant/cat.jpeg"
                    />
                    <div class="info">
                        <span>{{$store.getters.userinfo.cname}}</span>
                        <small>{{$store.getters.activeAccount.khmc}}</small>
                    </div>
                </div>
            </template>
        </van-cell>
        <van-divider marginless></van-divider>
        <van-cell-group class="marginTop">
            <van-cell is-link title="收款账号" :to="{path:'/wode/bill_get_skzh',query:{mode:'manage'}}"></van-cell>
            <van-cell is-link title="清除缓存" @click="clearCache"></van-cell>
            <van-cell is-link title="退出应用" @click="exitApp"></van-cell>
            <van-cell is-link title="关于我们"></van-cell>
        </van-cell-group>
        <van-popup :overlay="false" get-container="body" v-model="isErjiRoute" position="right" :style="{ width: '100%',height:'100%' }" >
            <transition name="van-fade">
                <router-view ></router-view>
            </transition>
        </van-popup>
    </div>
</template>
<script>
import {clearStorage} from './../../utils/storage'
    export default {
        name: 'wode',
        data() {
            return {
            
            }
        },
        computed: {
            isErjiRoute:{
                get(){
                    var index = this.$route.matched.findIndex(el=>el.name == 'wode');
                    return this.$route.matched[index + 1]? true:false
                },
                set(val){
                    
                }
            },
        },
        watch: {
            
        },
        methods: {
            clearCache(){
                clearStorage({type:'session'});
                clearStorage();
                setTimeout(()=>{
                    this.$toast.success('缓存清除成功!');
                },300)
            },
            exitApp(){
                
            }

   
        },
        created() {

        }
    }
</script>
<style lang="less">
    .wo_container {
        .user-card{
            padding: 20px 30px;
            align-items: center;
            .title{
                .flex(@j:flex-start);
                .info{
                    .flex(@d:column);
                    margin-left: 10px;
                }
            }
        }
        
    }
</style>