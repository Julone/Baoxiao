<template>
    <div class="container">
        <van-nav-bar title="添加收款账户" left-text="返回" left-arrow @click-left="$store.dispatch('appGoback')" />
        <div class="main-content">
            <van-form ref="form" w100 @submit="onSubmit">
                <van-cell-group class="marginBottom">
                    <van-field v-model="form.zhlx" clickable readonly name="ywcj" @click="popupShow = true" required
                        is-link label="帐户类型">
                    </van-field>
                    <van-popup v-model="popupShow" position="bottom">
                        <van-picker show-toolbar :columns="zhlxList" @confirm="onPopupConfirm"
                            @cancel="popupShow = false">
                        </van-picker>
                    </van-popup>
                </van-cell-group>
                <van-cell-group v-if="form.zhlx == '银行账户'">
                    <van-field label="户名" v-model="form.hm" placeholder="请输入户名" required name="hm" :rules="[{ required: true, message: '此为必填项' }]"></van-field>
                    <van-field label="银行卡号" v-model="form.zh" placeholder="请输入帐号" required name="'zh" :rules="[{ required: true, message: '此为必填项' }]"></van-field>
                </van-cell-group>
                <van-cell-group v-if="form.zhlx == '支付宝'">
                    <van-field label="户名" v-model="form.hm" placeholder="请输入户名" required name="hm" :rules="[{ required: true, message: '此为必填项' }]"></van-field>
                    <van-field label="账号" v-model="form.zh" placeholder="请输入帐号" required name="'zh" :rules="[{ required: true, message: '此为必填项' }]"></van-field>
                </van-cell-group>
                <van-cell-group v-if="form.zhlx == '现金'">
                    <van-field label="现金名称" v-model="form.hm" placeholder="请输入现金名称" :rules="[{ required: true, message: '此为必填项' }]" required></van-field>
                </van-cell-group>
                <!-- 底部保存 -->

                <div class="van-tabbar--fixed bottom_saved_buttons">
                    <van-row>
                        <van-col span="24">
                            <van-button type="info" borderless block>
                                保存
                            </van-button>
                        </van-col>
                    </van-row>
                </div>
            </van-form>
        </div>


    </div>
</template>
<script>
    import {
        bill_set_skzh
    } from 'api'
    import {
        mapGetters
    } from 'vuex'

    export default {
        data() {
            return {
                popupShow: false,
                zhlxList: ['银行账户', '支付宝', '现金'],
                form: {
                    zhlx: '银行账户',
                    hm: "",
                    zh: '',
                }
            }
        },

        computed: {

        },
        methods: {
            onPopupConfirm(val, index) {
                this.form.zhlx = val;
                this.popupShow = false;
            },
            onSubmit() {
                var zhlx = this.zhlxList.indexOf(this.form.zhlx) + 1;
                bill_set_skzh({zhlx: zhlx,zhmc: this.form.hm,yhh:this.form.zh}).then(r=>{
                    this.$toast.success('添加收款账户成功!')
                    this.$store.dispatch('appGoback');
                })
            }
        },
        created() {


        },

        activated() {

        },
    }
</script>
<style lang="less" scoped>
    .container {
        height: 100%;
        display: flex;
        overflow: hidden;
        flex-direction: column;
        background: @app_bg_color;

        .van-nav-bar {
            flex: none;
        }

        .main-content {
            .flex(@a: strech);
            flex: 1;
            height: 100%;
            // overflow: auto;
            padding: 0 0px;
            ;

            .card {
                .wh100(@h: fit-content);
                padding: 10px 0px;
                ;
                background: rgb(50, 136, 221);
                color: white;
                padding: 10px 20px;
                font-size: 16px;
                border-radius: 5px;

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