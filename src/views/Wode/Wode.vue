<template>
    <div class="wo_container">
        <van-nav-bar title="我的" />
        <van-form>
            <van-cell is-link :border="false" class="user-card van-contact-card">
                <template #title>
                    <div class="title">
                        <van-image round width="13vw" height="13vw" src="https://img.yzcdn.cn/vant/cat.jpeg" />
                        <div class="info">
                            <span>{{userinfo.cname}}</span>
                            <small>{{activeAccount.khmc}}</small>
                        </div>
                    </div>
                </template>
                <template #right-icon>
                    <div h100>
                        <accountPicker size="mini"></accountPicker>
                    </div>
                </template>
            </van-cell>
            <van-divider marginless></van-divider>
            <van-cell-group title="数据管理">
                <van-cell is-link title="收款账号" :to="{path:'/wode/bill_get_skzh',query:{mode:'edit'}}"></van-cell>
                <van-cell is-link title="往来单位" :to="{path:'/wode/bill_add_wanlai_danwei',query:{mode:'edit'}}">
                </van-cell>
            </van-cell-group>
            <van-cell-group title="系统设置">
                <van-cell title="用户身份" @click="onCopy(apptoken)">{{apptoken}}</van-cell>
                <van-cell title="清除缓存" @click="clearCache"></van-cell>
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
        mapGetters
    } from 'vuex'
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
                    return this.$route.path.startsWith('/wode/')
                },
                set(val) {

                }
            },
            ...mapGetters(['apptoken', 'userinfo', 'activeAccount'])
        },
        watch: {

        },
        methods: {
            clearCache() {
                this.$dialog.confirm({
                    title: '确定',
                    message: '是否要清除缓存?',
                }).then(r => {
                    clearStorage({
                        type: 'all'
                    });
                    this.$toast.success('缓存清除成功!');
                    this.$router.push('/')
                })

            },
            exitApp() {

            },
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
                }
            }
        }

        .van-cell-group__title {
            padding: 10px 15px 7px;
            font-size: 80%;
        }

    }
</style>