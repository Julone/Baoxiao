<template>
    <div class="wo_container">
        <van-nav-bar title="我的" />
        <van-form>

            <van-cell is-link class="user-card">
                <template #title>
                    <div class="title">
                        <van-image round width="13vw" height="13vw" src="https://img.yzcdn.cn/vant/cat.jpeg" />
                        <div class="info">
                            <span>{{$store.getters.userinfo.cname}}</span>
                            <small>{{$store.getters.activeAccount.khmc}}</small>
                        </div>
                    </div>
                </template>
                <template #right-icon>
        <accountPicker   size="mini" ></accountPicker>
                </template>
            </van-cell>
            <van-divider marginless></van-divider>
            <van-cell-group class="marginTop">
                <van-cell is-link title="收款账号" :to="{path:'/wode/bill_get_skzh',query:{mode:'edit'}}"></van-cell>
                <van-cell is-link title="往来单位" :to="{path:'/wode/bill_add_wanlai_danwei',query:{mode:'edit'}}"></van-cell>
            </van-cell-group>
            <van-cell-group class="marginTop">
                <van-cell title="用户身份" v-if="developMode">{{$store.getters.apptoken}}</van-cell>
                <van-cell is-link title="收款账号" :to="{path:'/wode/bill_get_skzh',query:{mode:'manage'}}"></van-cell>
                <van-cell is-link title="清除缓存" @click="clearCache"></van-cell>
                <van-field name="switch" label="开发者模式">
                    <template #input>
                        <van-switch v-model="developMode" size="20" />
                    </template>
                </van-field>
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
    } from './../../utils/storage'
    export default {
        name: 'wode',
        data() {
            return {
                developMode: false
            }
        },
        computed: {
            isErjiRoute: {
                get() {
                    var index = this.$route.matched.findIndex(el => el.name == 'wode');
                    return this.$route.matched[index + 1] ? true : false
                },
                set(val) {

                }
            },
        },
        watch: {

        },
        methods: {
            clearCache() {
                clearStorage({
                    type: 'session'
                });
                clearStorage();
                setTimeout(() => {
                    this.$toast.success('缓存清除成功!');
                }, 300)
            },
            exitApp() {

            }
        },
        created() {

        }
    }
</script>
<style lang="less">
    .wo_container {
        .user-card {
            padding: 12px 15px;
            align-items: center;

            .title {
                .flex(@j: flex-start);

                .info {
                    .flex(@d: column);
                    margin-left: 10px;
                }
            }
        }

    }
</style>