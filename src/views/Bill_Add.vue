<template>
    <div class="bill_add_container">
        <div class="bill_add_wrapper">
            <!-- header -->
            <van-nav-bar title="新建费用" fixed placeholder style="height:15vw" left-text="返回" left-arrow
                @click-left="$store.dispatch('appGoback')" />
            <!-- expense_type -->
            <van-form v-if="initOK">
                <van-cell class="flex-cell" :title="expenseType.label" clickable :to="{name: 'bill_add_expense_type'}"
                    required is-link>
                </van-cell>

                <van-cell-group class="marginTop">
                    <van-cell title="业务场景" @click="ywcjStatus = true" clickable required is-link>
                        {{ywcj.mc}}
                    </van-cell>
                    <van-popup v-model="ywcjStatus" position="bottom">
                        <van-picker show-toolbar :columns="ywcjColumns" @confirm="onConfirm" value-key="mc"
                            @cancel="ywcjStatus = false">
                        </van-picker>
                    </van-popup>
                </van-cell-group>
                <!-- 对公全部到票业务 -->
                <template v-if="ywcj.id == 7187">
                    <van-field label="本次到票" clickable required>
                        <template #input>
                            <div class="bcdp">
                                <span>CNY</span>
                                <input type="text" placeholder="请输入金额" v-model="bcdp">
                            </div>
                        </template>
                    </van-field>
                    <van-cell title="到票日期" @click="openDatePopup" clickable required is-link>
                        {{dprq | date('yyyy-MM-dd')}}
                        <van-popup get-container="body" v-model="dprqStatus" position="bottom">
                            <van-datetime-picker v-model="dprq_popup" type="date" :min-date="minDate"
                                :max-date="maxDate" title="选择年月日" item-height="30vh" :formatter="formatter"
                                @confirm="onDateConfirm" @cancel="dprqStatus=false" />
                        </van-popup>
                    </van-cell>
                    <van-field label="费用金额" clickable required>
                        <template #input>
                            <div class="bcdp">
                                <span>CNY</span>
                                <input type="text" v-model="bcdp" placeholder="自动计算">
                            </div>
                        </template>
                    </van-field>
                    <van-cell-group :border="false">
                        <!-- <van-field v-model="expense_city" label="消费城市" clickable
                            @click="$router.push({name: 'bill_add_expense_city'})" required is-link
                            placeholder="请选择消费城市" readonly>
                        </van-field> -->
                        <van-field v-model="wanlai_danwei" label="往来单位" clickable
                            @click="$router.push({name: 'bill_add_wanlai_danwei'})" required is-link
                            placeholder="请选择往来单位" readonly>
                        </van-field>
                    </van-cell-group>
                    <van-cell-group border>
                        <van-field label="备注" border type="textarea" v-model="liuyan" placeholder="请输入留言"
                            show-word-limit maxlength="300">
                        </van-field>
                    </van-cell-group>
                    <!-- 发票 -->
                    <van-cell-group border class="marginTop cell-group">
                        <div class="title">发票</div>
                        <div class="content">
                            <van-button native-type="button" block borderless type="info" plain>上传发票</van-button>
                        </div>
                    </van-cell-group>
                    <!-- 分摊 -->
                    <van-cell-group border class="marginTop cell-group">
                        <div class="title">分摊信息</div>
                        <div class="content">
                            <van-button native-type="button" block borderless type="info" plain>新建分摊</van-button>
                        </div>
                    </van-cell-group>

                </template>
                <!-- 对公未到票业务 -->
                <template v-if="ywcj.id == 7188">
                    <van-field label="未到票" clickable required>
                        <template #input>
                            <div class="bcdp">
                                <span>CNY</span>
                                <input type="text" placeholder="请输入金额" v-model="bcdp">
                            </div>
                        </template>
                    </van-field>
                    <van-cell title="预计到票日期" @click="openDatePopup" clickable required is-link>
                        {{dprq | date('yyyy-MM-dd')}}
                        <van-popup get-container="body" v-model="dprqStatus" position="bottom">
                            <van-datetime-picker v-model="dprq_popup" type="date" :min-date="minDate"
                                :max-date="maxDate" title="选择年月日" item-height="30vh" :formatter="formatter"
                                @confirm="onDateConfirm" @cancel="dprqStatus=false" />
                        </van-popup>
                    </van-cell>
                    <van-field label="费用金额" clickable required>
                        <template #input>
                            <div class="bcdp">
                                <span>CNY</span>
                                <input type="text" v-model="bcdp" placeholder="自动计算">
                            </div>
                        </template>
                    </van-field>
                    <van-cell-group :border="false">
                        <!-- <van-field v-model="expense_city" label="消费城市" clickable
                            @click="$router.push({name: 'bill_add_expense_city'})" required is-link
                            placeholder="请选择消费城市" readonly>
                        </van-field> -->
                        <van-field v-model="wanlai_danwei" label="往来单位" clickable
                            @click="$router.push({name: 'bill_add_wanlai_danwei'})" required is-link
                            placeholder="请选择往来单位" readonly>
                        </van-field>
                    </van-cell-group>
                    <van-cell-group border>
                        <van-field label="备注" border type="textarea" v-model="liuyan" placeholder="请输入留言"
                            show-word-limit maxlength="300">
                        </van-field>
                    </van-cell-group>
                </template>
                <!-- 对公全部到票业务 -->
                <template v-if="ywcj.id == 7189">
                    <van-field label="本次到票" clickable required>
                        <template #input>
                            <div class="bcdp">
                                <span>CNY</span>
                                <input type="text" placeholder="请输入金额" v-model="bcdp">
                            </div>
                        </template>
                    </van-field>
                    <van-cell title="到票日期" @click="openDatePopup" clickable required is-link>
                        {{dprq | date('yyyy-MM-dd')}}
                        <van-popup get-container="body" v-model="dprqStatus" position="bottom">
                            <van-datetime-picker v-model="dprq_popup" type="date" :min-date="minDate"
                                :max-date="maxDate" title="选择年月日" item-height="30vh" :formatter="formatter"
                                @confirm="onDateConfirm" @cancel="dprqStatus=false" />
                        </van-popup>
                    </van-cell>
                    <van-field label="费用金额" clickable required>
                        <template #input>
                            <div class="bcdp">
                                <span>CNY</span>
                                <input type="text" v-model="bcdp" placeholder="自动计算">
                            </div>
                        </template>
                    </van-field>
                    <van-cell-group :border="false">
                        <!-- <van-field v-model="expense_city" label="消费城市" clickable
                            @click="$router.push({name: 'bill_add_expense_city'})" required is-link
                            placeholder="请选择消费城市" readonly>
                        </van-field> -->
                        <van-field v-model="wanlai_danwei" label="往来单位" clickable
                            @click="$router.push({name: 'bill_add_wanlai_danwei'})" required is-link
                            placeholder="请选择往来单位" readonly>
                        </van-field>
                    </van-cell-group>
                    <van-cell-group border class="marginTop cell-group">
                        <div class="title">核销历史费用</div>
                        <div class="content">
                            <van-button native-type="button" block borderless type="info" plain>选取核销历史费用</van-button>
                            <div align="center" style="padding-bottom:20px">当前往来单位下剩余: $0.00未到账</div>
                        </div>
                    </van-cell-group>
                    <van-cell-group border>
                        <van-field label="备注" border type="textarea" v-model="liuyan" placeholder="请输入留言"
                            show-word-limit maxlength="300">
                        </van-field>
                    </van-cell-group>
                    <!-- 发票 -->
                    <van-cell-group border class="marginTop cell-group">
                        <div class="title">发票</div>
                        <div class="content">
                            <van-button native-type="button" block borderless type="info" plain>上传发票</van-button>
                        </div>
                    </van-cell-group>
                    <!-- 分摊 -->
                    <van-cell-group border class="marginTop cell-group">
                        <div class="title">分摊信息</div>
                        <div class="content">
                            <van-button native-type="button" block borderless type="info" plain>新建分摊</van-button>
                        </div>
                    </van-cell-group>

                </template>

                <!-- 底部保存 -->
                <div class="van-tabbar--fixed bottom_saved_buttons">
                    <van-row>
                        <van-col span="12">
                            <van-button native-type="button" type="default" borderless
                                style="background:rgb(247,247,247)" block>再记一笔</van-button>
                        </van-col>
                        <van-col span="1"></van-col>
                        <van-col span="11">
                            <van-button native-type="button" type="info" borderless block>保存</van-button>
                        </van-col>
                    </van-row>
                </div>
            </van-form>
        </div>

        <transition name="van-slide-right">
            <div class="erji-view" v-if="isErjiRoute">
                <router-view></router-view>
            </div>
        </transition>



    </div>
</template>
<script>
    import {
        bill_get_ywcj
    } from 'api'
    export default {
        data() {
            return {
                expenseType: {
                    label: '意向金',
                    id: 243
                },
                ywcj: {},
                ywcjColumns: [],
                ywcjStatus: false,
                bcdp: "",
                dprq: new Date(),
                dprq_popup: new Date(),
                dprqStatus: false,
                minDate: new Date(2015, 0, 1),
                maxDate: new Date(),
                expense_city: '晋江市',
                wanlai_danwei: '',
                liuyan: '',
                initOK: false
            }
        },
        watch: {
            isErjiRoute: {
                immediate: true,
                handler(val) {
                    if (val == true) {
                        document.body.style.overflowY = "hidden"
                    } else {
                        document.body.style.overflowY = "auto"
                    }
                }

            }
        },
        computed: {
            isErjiRoute() {
                return this.$route.path != '/bill/add';
            }
        },
        created() {
            Promise.all([this.getDataYwcj()]).then(r => {
                console.log(r);
                this.initOK = true;
            })
        },
        methods: {
            onConfirm(value) {
                console.log(value);
                this.ywcj = value;
                this.ywcjStatus = false;
            },
            getDataYwcj() {
                return bill_get_ywcj().then(r => {
                    this.ywcjColumns = r.data;
                    this.ywcj = r.data[0];
                    return true
                }).catch(e => false)
            },
            formatter(type, val) {
                if (type === 'year') {
                    return `${val}年`;
                } else if (type === 'month') {
                    return `${val}月`;
                } else {
                    return `${val}日`
                }
                return val;
            },
            onDateConfirm() {
                this.dprqStatus = false;
                this.dprq = this.dprq_popup;
            },
            openDatePopup() {
                this.dprqStatus = true;
                this.dprq_popup = this.dprq;
            }
        }


    }
</script>
<style lang="less">
    .bill_add_container {

        .bill_add_wrapper {
            .van-form {
                padding-bottom: 100px;
            }

            .van-cell:not(.flex-cell) {
                .van-cell__title,
                .van-field__label {
                    margin-right: 0;
                    width: 100px;
                    flex: none;
                }
            }

            .van-cell__value {
                flex: 3;
                text-align: left;
                color: #323233
            }

            .marginTop {
                margin-top: 10px;
            }

            .bcdp {
                .flex();

                span {
                    padding-right: 10px;
                    position: relative;

                    &::after {
                        content: '';
                        width: 2px;
                        height: 20px;
                        background: rgba(128, 128, 128, 0.313);
                        display: block;
                        position: absolute;
                        right: 0;
                        top: 50%;
                        margin-top: -10px;
                    }
                }

                input {
                    border: none;
                    padding-left: 10px;
                    background: transparent;
                    width: 100%;
                }
            }

            .cell-group {
                .title {
                    font-weight: 700;
                    font-size: 14px;
                    line-height: 40px;
                    height: 40px;
                    padding-left: 20px;
                    border-bottom: 1px solid #ebedf0;
                }

                .content {
                    // height: 60px;;
                }
            }

            .bottom_saved_buttons {
                padding: 10px;
                background: white;
                right: 0;
            }
        }

        .erji-view {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            z-index: 10;
            ;
            background: white;
        }
    }
</style>