<template>
    <div class="bill_add_container">
        <div class="bill_add_wrapper">
            <!-- header -->
            <!-- left-text="返回" left-arrow @click-left="$store.dispatch('appGoback')" -->
            <van-nav-bar title="新建费用" fixed placeholder style="height:15vw">
                <template #right>
                    <accountPicker></accountPicker>
                </template>
            </van-nav-bar>
            <!-- expense_type -->
            <van-form v-if="initOK" ref="form" @submit="onSubmit">
                <van-field v-model="form.xflx.fylxmc" clickable readonly name="xflx"
                    @click="go2sub({name: 'bill_add_expense_type'})" required is-link placeholder="请选择消费类型"
                    left-icon="gold-coin-o" :rules="[{ required: true, message: '请选择消费类型',trigger:'onChange' }]">
                </van-field>

                <van-cell-group class="marginTop">
                    <van-field v-model="form.ywcj.mc" clickable readonly name="ywcj" @click="ywcjStatus = true" required
                        is-link label="业务场景">
                    </van-field>
                    <van-popup v-model="ywcjStatus" position="bottom">
                        <van-picker show-toolbar :columns="ywcjColumns" @confirm="onYwcjConfirm" value-key="mc"
                            @cancel="ywcjStatus = false">
                        </van-picker>
                    </van-popup>
                </van-cell-group>
                <!-- 对公全部到票业务 -->
                <template v-if="form.ywcj.id == 7187">
                    <van-field v-model="form.bcdp" label="本次到票" clickable required
                        :rules="[{ required: true, message: '请输入消费金额' }]" name="xfje">
                        <template #input>
                            <div class="bcdp-item">
                                <span>CNY</span>
                                <input type="number" placeholder="请输入金额" v-model="form.bcdp">
                            </div>
                        </template>
                    </van-field>
                    <van-cell title="到票日期" @click="openDatePopup" clickable required is-link>
                        {{form.dprq | date('yyyy-MM-dd')}}
                        <van-popup get-container="body" v-model="dprqStatus" position="bottom">
                            <van-datetime-picker v-model="dprq_popup" type="date" :min-date="minDate"
                                :max-date="maxDate" title="选择年月日" item-height="30vh" :formatter="formatter"
                                @confirm="onDateConfirm" @cancel="dprqStatus=false" />
                        </van-popup>
                    </van-cell>
                    <van-field label="费用金额" v-model="form.bcdp" readonly required>
                        <template #input>
                            <div class="bcdp-item">
                                <span>CNY</span>
                                <input type="number" v-model="form.bcdp" readonly placeholder="自动计算">
                            </div>
                        </template>
                    </van-field>
                    <van-cell-group :border="false">
                        <van-field v-model="form.wanlai_danwei.khyh" label="往来单位" clickable
                            @click="go2sub({name: 'bill_add_wanlai_danwei'})" required is-link name="wanlai_danwei"
                            placeholder="请选择往来单位" readonly
                            :rules="[{ required: true, message: '请输入往来单位',trigger:'onChange' }]">
                        </van-field>
                    </van-cell-group>
                </template>
                <!-- 对公未到票业务 -->
                <template v-if="form.ywcj.id == 7188">
                    <van-field v-model="form.bcdp" label="未到票" clickable required
                        :rules="[{ required: true, message: '请输入消费金额' }]" name="xfje">
                        <template #input>
                            <div class="bcdp-item">
                                <span>CNY</span>
                                <input type="text" placeholder="请输入金额" v-model="form.bcdp">
                            </div>
                        </template>
                    </van-field>
                    <van-cell title="预计到票日期" @click="openDatePopup" clickable required is-link>
                        {{form.dprq | date('yyyy-MM-dd')}}
                        <van-popup get-container="body" v-model="dprqStatus" position="bottom">
                            <van-datetime-picker v-model="dprq_popup" type="date" :min-date="minDate"
                                :max-date="maxDate" title="选择年月日" item-height="30vh" :formatter="formatter"
                                @confirm="onDateConfirm" @cancel="dprqStatus=false" />
                        </van-popup>
                    </van-cell>
                    <van-field label="费用金额" v-model="form.bcdp" readonly required>
                        <template #input>
                            <div class="bcdp-item">
                                <span>CNY</span>
                                <input type="text" v-model="form.bcdp" readonly placeholder="自动计算">
                            </div>
                        </template>
                    </van-field>
                    <van-cell-group :border="false">
                        <van-field v-model="form.wanlai_danwei.khyh" label="往来单位" clickable
                            @click="go2sub({name: 'bill_add_wanlai_danwei'})" required is-link name="wanlai_danwei"
                            placeholder="请选择往来单位" readonly
                            :rules="[{ required: true, message: '请输入往来单位',trigger:'onChange' }]">
                        </van-field>
                    </van-cell-group>

                </template>
                <!-- 对公全部到票业务 -->
                <template v-if="form.ywcj.id == 7189">
                    <van-field v-model="form.bcdp" label="本次到票" clickable required
                        :rules="[{ required: true, message: '请输入到票金额' }]" name="xfje">
                        <template #input>
                            <div class="bcdp-item">
                                <span>CNY</span>
                                <input type="number" placeholder="请输入金额" v-model="form.bcdp">
                            </div>
                        </template>
                    </van-field>
                    <van-cell title="到票日期" @click="openDatePopup" clickable required is-link>
                        {{form.dprq | date('yyyy-MM-dd')}}
                        <van-popup get-container="body" v-model="dprqStatus" position="bottom">
                            <van-datetime-picker v-model="dprq_popup" type="date" :min-date="minDate"
                                :max-date="maxDate" title="选择年月日" item-height="30vh" :formatter="formatter"
                                @confirm="onDateConfirm" @cancel="dprqStatus=false" />
                        </van-popup>
                    </van-cell>
                    <van-field v-model="form.bcdp" label="费用金额" clickable required>
                        <template #input>
                            <div class="bcdp-item">
                                <span>CNY</span>
                                <input type="number" v-model="bcdp" readonly placeholder="自动计算">
                            </div>
                        </template>
                    </van-field>
                    <van-cell-group :border="false">
                        <van-field v-model="form.wanlai_danwei.khyh" label="往来单位" clickable
                            @click="go2sub({name: 'bill_add_wanlai_danwei'})" required is-link name="wanlai_danwei"
                            placeholder="请选择往来单位" readonly
                            :rules="[{ required: true, message: '请输入往来单位',trigger:'onChange' }]">
                        </van-field>
                    </van-cell-group>
                    <van-cell-group border class="marginTop cell-group">
                        <div class="title">核销历史费用</div>
                        <div class="content">
                            <van-button @click="go2sub({name: 'bill_add_hexiao'})" native-type="button" block borderless
                                type="info" plain>选取核销历史费用</van-button>
                            <div align="center" style="padding-bottom:20px">当前往来单位下剩余: ￥0.00未到账</div>
                        </div>
                    </van-cell-group>
                </template>
                <van-cell-group border>
                    <van-field label="备注" border type="textarea" v-model="form.liuyan" name="liuyan" placeholder="请输入留言"
                        show-word-limit maxlength="300"
                        :rules="[{ pattern: /^[\s\S]{0,300}$/, message: '留言太长',trigger:'onBlur' }]">
                    </van-field>
                </van-cell-group>
                <template v-if="form.ywcj.id != 7188">
                    <!-- 发票 -->
                    <van-cell-group border class="marginTop cell-group">
                        <div class="title">发票</div>
                        <div class="content">
                            <van-button native-type="button" block borderless type="info" plain>上传发票</van-button>
                            <van-swipe-cell class="fapiao_list" v-for="el in fp_list" :key="el.id">
                                <van-cell clickable class="fapiao">
                                    <template #title>
                                        <div class="fapiao-title">
                                            <div class="left">
                                                <img :src="el.url" width="40" height="40" alt="">
                                            </div>
                                            <div class="right">
                                                <span class="sort">{{el.sort}}</span>
                                                <span class="date">{{el.date}}</span>
                                            </div>
                                        </div>
                                    </template>
                                    <span class="money"><small>￥</small>{{el.money}}</span>
                                </van-cell>
                                <template #right>
                                    <div class="right-swipe-item">
                                        <van-button round plain type="danger" icon="cross" class="delete-button" />
                                    </div>
                                </template>
                            </van-swipe-cell>
                        </div>
                    </van-cell-group>
                    <!-- 分摊 -->
                    <van-cell-group border class="marginTop cell-group">
                        <div class="title">分摊信息</div>
                        <div class="content">
                            <van-button native-type="button" block borderless type="info" plain @click="openFentang">
                                新建分摊</van-button>
                            <div>
                                {{form.ft_info}}
                            </div>
                        </div>
                    </van-cell-group>
                </template>
                <!-- 底部保存 -->
                <div class="van-tabbar--fixed bottom_saved_buttons">
                    <van-row>
                        <van-col span="12">
                            <van-button @click="onSaveAgain" native-type="button" type="default" borderless
                                style="background:rgb(247,247,247)" block>再记一笔</van-button>
                        </van-col>
                        <van-col span="1"></van-col>
                        <van-col span="11">
                            <van-button @click="onSave" native-type="button" type="info" borderless block>保存
                            </van-button>
                        </van-col>
                    </van-row>
                </div>
            </van-form>
        </div>
        <transition name="van-slide-right">
            <div class="erji-view" v-if="isErjiRoute">
                <router-view :formdata="form" @chooseXflx="chooseXflx" @chooseWldw="chooseWldw"></router-view>
            </div>
        </transition>
    </div>
</template>
<script>
    import {
        bill_get_ywcj,
        bill_set_data
    } from 'api'
    import {
        dateFormat
    } from '@/utils/utils'
    export default {
        data() {
            return {
                ywcjColumns: [],
                ywcjStatus: false,
                dprq_popup: new Date(),
                dprqStatus: false,
                minDate: new Date(2015, 0, 1),
                maxDate: new Date(),
                initOK: false,
                fp_list: [],
                form: {
                    xflx: {},
                    ywcj: {},
                    bcdp: "",
                    dprq: new Date(),
                    wanlai_danwei: {},
                    liuyan: '',
                    ft_info: []
                }
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
            },
            async 'form.ywcj.id'(val) {
                await this.$nextTick();
                this.$refs.form && this.$refs.form.resetValidation();
            }
        },
        computed: {
            isErjiRoute() {
                return this.$route.name != 'bill_add'
            }
        },
        created() {
            if (this.isErjiRoute && !this.$route.params.avoidRefresh) {
                //二级路由处理
                this.$router.push({
                    name: 'bill_add'
                })
            }
            Promise.all([this.getDataYwcj()]).then(r => {
                this.initOK = true;
            })
            this.fp_list = [{ url: 'https://img.yzcdn.cn/vant/ipad.jpeg', sort: '其他', date: '2020-07-12', money: '2300.00' }]

        },
        methods: {
            go2sub(route) {
                route = Object.assign(route, {
                    params: {
                        avoidRefresh: true
                    }
                })
                this.$router.push(route)
            },
            onSave() {
                this.$refs.form.validate().then(r => {
                    this.onSubmit().then(r => {
                    })
                })
            },
            openFentang() {
                return this.$refs.form.validate('xfje').then(r => {
                    this.$router.push({
                        name: 'bill_add_fentang'
                    })
                }).catch(e => {
                    this.$refs.form.scrollToField('xflx');
                    this.$toast.fail(e.message);
                })
            },
            async onSaveAgain() {
                this.$refs.form.validate().then(r => {
                    this.onSubmit().then(r => {
                        setTimeout(() => {
                            this.$eventBus.$emit('refreshView')
                        }, 300)
                    })
                })

            },
            onSubmit() {
                var djlx = this.form.xflx.id;
                var djlb = this.form.ywcj.id;
                var ny = dateFormat(this.form.dprq, 'yyyyMM');
                var rq = dateFormat(this.form.dprq, 'yyyy-MM-dd');
                console.log(this.form)
                var zhid = this.form.wanlai_danwei.id;
                var zhmc = this.form.wanlai_danwei.zhmc;
                var je = this.form.bcdp;
                var zhbj = '0';
                var bz = this.form.beizu;
                var fydlmc = this.form.xflx.fydlmc;
                var fylxmc = this.form.xflx.fylxmc;
                return new Promise((res, rej) => {
                    bill_set_data({
                        djlx,
                        djlb,
                        rq,
                        zhid,
                        je,
                        zhbj,
                        bz,
                        fydlmc,
                        fylxmc,
                        zhmc
                    }).then(r => {
                        console.log(r);
                        if (r.errcode == 0) {
                            this.$toast.success('保存成功!');
                            res(true);
                        } else {
                            this.$toast.fail('保存成功!');
                            rej(false)
                        }
                    })
                })
            },
            chooseXflx(val) {
                this.form.xflx = val;
                this.$store.dispatch('appGoback');
            },
            chooseWldw(val) {
                this.form.wanlai_danwei = val;
                console.log(val);
                this.$store.dispatch('appGoback');
            },
            onYwcjConfirm(value) {
                this.form.ywcj = value;
                this.ywcjStatus = false;
            },
            getDataYwcj() {
                return bill_get_ywcj().then(r => {
                    this.ywcjColumns = r.data;
                    this.form.ywcj = r.data[0];
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
                this.form.dprq = this.dprq_popup;
            },
            openDatePopup() {
                this.dprqStatus = true;
                this.dprq_popup = this.form.dprq;
            }
        }


    }
</script>
<style lang="less">
    .bcdp-item {
        .flex();

        span {
            padding-right: 10px;
            position: relative;
            color: #323233;

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

           

            .fapiao {
                border-top: 2px solid #f4f5f7;

                .van-cell__title {
                    flex: 2 !important;
                }

                .van-cell__value {
                    flex: 1;
                    text-align: right;
                }

                .fapiao-title {
                    .flex(@a: flex-start; @j: flex-start);
                    height: 40px;
                    overflow: hidden;

                    .left {
                        height: 40px;
                        ;
                    }

                    .right {
                        .flex(@d: column; @a: flex-start);
                        font-size: 10px;
                        line-height: 18px;
                        margin-left: 10px;
                        ;

                        .sort {
                            font-size: 14px;
                            ;
                        }

                    }
                }

                .money {
                    font-size: 20px;
                    line-height: 40px;
                    ;

                }
            }

            .right-swipe-item {
                width: 60px;
                height: 60px;
                ;
                .flex();

                .delete-button {
                    width: 45px;
                    height: 45px;
                    ;
                }
            }

        }

    
    }
</style>