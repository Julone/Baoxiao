<template>
    <div class="wo_container">
        <van-nav-bar title="我的" />
        <van-form :submit-on-enter="false">
            <van-cell is-link :border="false" class="user-card van-contact-card">
                <template #title>
                    <div class="title">
                        <van-image round width="13vw" height="13vw" src="https://img.yzcdn.cn/vant/cat.jpeg" />
                        <div class="info">
                            <span>{{userinfo.cname || '未登录'}}</span>
                            <small>{{activeAccount.khmc || '暂无套账'}}</small>
                        </div>
                    </div>
                </template>
                <template #right-icon>
                    <div h100>
                        <accountPicker :maxlen="6" size="mini" :zoom="1.25"></accountPicker>
                    </div>
                </template>
            </van-cell>
            <van-divider marginless></van-divider>
            <van-cell-group title="数据管理">
                <van-cell icon="debit-pay" is-link title="收款账号" :to="{path:'/wode/bill_get_skzh',query:{mode:'edit'}}"></van-cell>
                <van-cell icon="exchange" is-link title="往来单位" :to="{path:'/wode/bill_add_wanlai_danwei',query:{mode:'edit'}}">
                </van-cell>
            </van-cell-group>
            <van-cell-group title="系统设置">
                <van-cell title="用户身份" icon="contact">
                    <input type="text" w100 v-model="apptoken" @keyup.enter.prevent="appAuthStart({apptoken, reset: true})" 
                    placeholder="请输入Token" borderless style="text-align:right">
                </van-cell>
                <van-cell title="清除缓存" @click="appClearCache()" icon="delete"></van-cell>
                <van-cell title="退出应用" @click="appExit()" icon="close"></van-cell>
            </van-cell-group>
        </van-form>

        <van-popup :overlay="false" get-container="body" v-model="isErjiRoute" position="right"
            :style="{ width: '100%',height:'100%' }">
            <transition name="van-fade">
                <router-view></router-view>
            </transition>
        </van-popup>
    </div>
</template>
<script>
    import {
        clearStorage
    } from './../../utils/storage';
    import {
        copyText
    } from '@/utils/utils'
    import {
        mapGetters, mapActions
    } from 'vuex'
    export default {
        name: 'wode',
        data() {
            return {
                developMode: false,
            }
        },
        computed: {
            isErjiRoute: {
                get() {
                    return this.$route.path.startsWith('/wode/')
                },
                set(val) {

                }
            },
            apptoken: {
                get(){
                    return this.$store.getters.apptoken
                },
                set(val){
                    this.$store.commit('SET_APPTOKEN', val)
                }
            },
            ...mapGetters(['userinfo', 'activeAccount'])
        },
        watch: {

        },
        methods: {
            ...mapActions(['appAuthStart','appClearCache', 'appExit']),
           
            onCopy(data) {
                copyText(data);
                this.$toast.success('复制成功')
            }
        },
        created() {

        }
    }
</script>
<style lang="less">
    .wo_container {
        .user-card {
            padding: 10px 15px;
            align-items: center;

            .title {
                .flex(@j: flex-start);

                .info {
                    .flex(@d: column; @a: flex-start);
                    margin-left: 10px;
                    line-height: 17px;
                }
            }
        }

        .van-cell-group__title {
            padding: 10px 15px 7px;
            font-size: 80%;
        }

    }
</style>