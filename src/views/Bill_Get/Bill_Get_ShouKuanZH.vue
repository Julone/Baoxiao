<template>
    <div class="skzh-container">
        <van-nav-bar title="选择收款账户" left-text="返回" left-arrow @click-left="$store.dispatch('appGoback')" />
        <div class="main-content">
            <div v-for="el in card" :key="el.id" class="card" @click="$emit('select_skzh', el)">
                <div class="title">
                    银行户名
                </div>
                <div class="account">
                    {{el.account}}
                </div>
                <div class="divider"></div>
                <div class="label">{{el.label}}</div>
                <van-icon class="icon" name="coupon-o" />
            </div>
        </div>
        <!-- 底部保存 -->
        <div class="van-tabbar--fixed bottom_saved_buttons">
            <van-row>
                <van-col span="24">
                    <van-button :to="{path: './bill_get_skzh/add'}" native-type="button" type="info" borderless block>
                        添加收款账号
                    </van-button>
                </van-col>
            </van-row>
        </div>
        <!-- 子路由 -->
        <!-- <transition name="van-slide-right">
            <div class="erji-view" v-if="isOpenErji">
                <keep-alive>
                    <router-view ></router-view>
                </keep-alive>
            </div>
        </transition> -->
        <van-popup :overlay="false" get-container="body" sanji-view v-model="isErjiRoute" position="right" :style="{ width: '100%',height:'100%' }" >
            <transition name="van-fade">
                <router-view ></router-view>
            </transition>
        </van-popup>
    </div>
</template>
<script>
    import {
        bill_get_skzh
    } from 'api'
    import {
        mapGetters
    } from 'vuex'

    export default {
        data() {
            return {
                list: [],
                card: [{
                    id: 2342,
                    account: '62290815306223598741',
                    label: '未填写支行信息'
                }]
            }
        },

        computed: {
            curTypeList() {
                return this.typeList[this.activeKey]
            },
            isErjiRoute: {
                get(){
                    return this.$route.name == 'bill_get_skzh_add'
                },
                set(){}
            },
            ...mapGetters(['app_height'])
        },
        created() {
            bill_get_skzh().then(r => {
                if (r.errcode == 0 && r.data.length) {
                    this.list = r.data.map(el => {
                        return {
                            
                        }
                    })
                }
            })
            for(var i =0;i<10;i++){
                this.card.push(this.card[0])
            }
        },
        activated() {

        },
    }
</script>
<style lang="less" scoped>
    .skzh-container {
        height: 100%;
        display: flex;
        overflow: hidden;
        flex-direction: column;
        background: @app_bg_color;

        .van-nav-bar {
            flex: none;
        }

        .main-content {
            // .flex(@a: strech);
            // flex: 1;
            height: auto;
            overflow: auto;
            padding: 15px;
            padding-bottom: 70px;
            .card {
                .wh100(@h: fit-content);
                padding: 10px 0px;
                margin-bottom:10px;
                background: rgb(50, 136, 221);
                color: white;
                padding: 10px 20px;
                font-size: 16px;
                border-radius: 5px;
                overflow:hidden;
                box-sizing:border-box;
                // .createBox(@p: 10px 20px;);
                .title {
                    line-height: 2em;
                }

                .account {
                    line-height: 1.5em;
                }

                .divider {
                    border: 1px dashed rgba(255, 255, 255, 0.265);
                }

                .label {
                    font-size: .6em;
                }

                .icon {
                    position: absolute;
                    right: -30px;
                    bottom: -30px;
                    font-size: 7em;
                    pointer-events: none;
                    opacity: .7;
                }

            }
        }

    }
 
</style>