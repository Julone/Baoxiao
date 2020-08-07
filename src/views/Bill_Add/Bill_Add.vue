<template>
    <div class="bill_add_container">
        <div class="bill_add_wrapper" ref="mainContent">
            <van-nav-bar :title="edit_mode?'单据明细':'新建费用'" fixed placeholder style="height:12vw" left-text="返回" left-arrow
                @click-left="$store.dispatch('appGoback')">
                <template #right>
                    <accountPicker></accountPicker>
                </template>
            </van-nav-bar>
            <!-- expense_type -->
            <van-form ref="form" @submit="onSubmit" novalidate>
                <van-field v-model="form.xflx.fylxmc" clickable readonly name="xflx" class="xflx"
                    @click="go2sub({name: 'bill_add_expense_type'})" required :is-link="false" placeholder="请选择消费类型"
                    left-icon="gold-coin-o" :rules="[{ required: true, message: '请选择消费类型',trigger:'onChange' }]">
                </van-field>
                <div class="switch-cell marginTop">
                    <div class="left">
                        <span v-if="form.duisi == true">个人费用</span>
                        <span v-if="form.duisi == false">对公业务</span>
                    </div>
                    <div class="right">
                        <!-- v-if="form.xflx.dgbs == 2" -->
                        <van-button v-if="form.xflx.dgbs == 2" native-type="button" size="mini" type="info" plain 
                            @click="form.duisi = !form.duisi" icon="exchange" >
                            切换为<span>{{form.duisi?'对公业务费用':'个人费用' }}</span>
                        </van-button>
                    </div>
                </div>
           
                <!-- 对私业务 -->
                <template v-if="form.duisi">
                    <van-field v-model="form.bcdp" label="消费金额" clickable required :rules="regRules.money" name="xfje">
                        <template #input>
                            <div class="bcdp-item">
                                <span>CNY</span>
                                <input type="number" step="0.01" placeholder="请输入金额" v-model="form.bcdp" @blur="onMoneyBlur">
                            </div>
                        </template>
                    </van-field>
                    <van-cell title="消费日期" @click="openDatePopup" clickable required is-link>
                        {{form.dprq | date('yyyy-MM-dd')}}
                        <van-popup get-container="body" v-model="dprqStatus" position="bottom">
                            <van-datetime-picker v-model="dprq_popup" type="date" :min-date="minDate"
                                :max-date="maxDate" title="选择年月日" item-height="50vh" :formatter="formatter"
                                @confirm="onDateConfirm" @cancel="dprqStatus=false" />
                        </van-popup>
                    </van-cell>
                </template>
                <!-- 对公全部到票业务 -->
                <template v-if="!form.duisi">
                    <van-cell-group class="">
                    <van-field v-model="form.ywcj.mc" clickable readonly name="ywcj" @click="ywcjStatus = true" required
                        is-link label="业务场景">
                    </van-field>
                    <van-popup v-model="ywcjStatus" position="bottom">
                        <van-picker show-toolbar :columns="ywcjColumns" @confirm="onYwcjConfirm" value-key="mc"
                            @cancel="ywcjStatus = false">
                        </van-picker>
                    </van-popup>
                </van-cell-group>
                    <template v-if="form.ywcj.id == 7187">
                        <van-field v-model="form.bcdp" label="本次到票" clickable required :rules="regRules.money"
                            name="xfje">
                            <template #input>
                                <div class="bcdp-item">
                                    <span>CNY</span>
                                    <input type="number" placeholder="请输入金额" v-model="form.bcdp" @blur="onMoneyBlur">
                                </div>
                            </template>
                        </van-field>
                        <van-cell title="到票日期" @click="openDatePopup" clickable required is-link>
                            {{form.dprq | date('yyyy-MM-dd')}}
                            <van-popup get-container="body" v-model="dprqStatus" position="bottom">
                                <van-datetime-picker v-model="dprq_popup" type="date" :min-date="minDate"
                                    :max-date="maxDate" title="选择年月日" item-height="50vh" :formatter="formatter"
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
                            <van-field v-model="form.wanlai_danwei.zhmc" label="往来单位" clickable
                                @click="go2sub({name: 'bill_add_wanlai_danwei'})" required is-link name="wanlai_danwei"
                                placeholder="请选择往来单位" readonly
                                :rules="[{ required: true, message: '请输入往来单位',trigger:'onChange' }]">
                            </van-field>
                        </van-cell-group>
                    </template>
                    <!-- 对公未到票业务 -->
                    <template v-if="form.ywcj.id == 7188">
                        <van-field v-model="form.bcdp" label="未到票" clickable required :rules="regRules.money"
                            name="xfje">
                            <template #input>
                                <div class="bcdp-item">
                                    <span>CNY</span>
                                    <input type="text" placeholder="请输入金额" v-model="form.bcdp" @blur="onMoneyBlur">
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
                            <van-field v-model="form.wanlai_danwei.zhmc" label="往来单位" clickable
                                @click="go2sub({name: 'bill_add_wanlai_danwei'})" required is-link name="wanlai_danwei"
                                placeholder="请选择往来单位" readonly
                                :rules="[{ required: true, message: '请输入往来单位',trigger:'onChange' }]">
                            </van-field>
                        </van-cell-group>
                    </template>
                    <!-- 对公全部到票业务 -->
                    <template v-if="form.ywcj.id == 7189">
                        <van-field v-model="form.bcdp" label="本次到票" clickable required :rules="regRules.money"
                            name="xfje">
                            <template #input>
                                <div class="bcdp-item">
                                    <span>CNY</span>
                                    <input type="number" placeholder="请输入金额" v-model="form.bcdp" @blur="onMoneyBlur">
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
                                    <input type="number" v-model="form.bcdp" readonly placeholder="自动计算">
                                </div>
                            </template>
                        </van-field>
                        <van-cell-group :border="false">
                            <van-field v-model="form.wanlai_danwei.zhmc" label="往来单位" clickable
                                @click="go2sub({name: 'bill_add_wanlai_danwei'})" required is-link name="wanlai_danwei"
                                placeholder="请选择往来单位" readonly
                                :rules="[{ required: true, message: '请输入往来单位',trigger:'onChange' }]">
                            </van-field>
                        </van-cell-group>
                        <van-cell-group border class="marginTop cell-group">
                            <div class="title">核销历史费用</div>
                            <div class="content">
                                <van-button @click="go2sub({name: 'bill_add_hexiao'})" native-type="button" block
                                    borderless type="info" plain>选取核销历史费用</van-button>
                                <div align="center" style="padding-bottom:20px;font-size:80%">当前往来单位下剩余: ￥{{form.wdpje}}未到账</div>
                            </div>
                        </van-cell-group>
                    </template>
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
                                        <van-button style="height:100%"  type="danger" icon="cross" class="delete-button" />
                                    </div>
                                </template>
                            </van-swipe-cell>
                        </div>
                    </van-cell-group>
                    <!-- 分摊 -->
                    <!-- {{form.ft_info}} -->
                    <van-cell-group border class="marginTop cell-group">
                        <div class="title">分摊信息</div>
                        <div class="content" @click="openFentang">
                            <van-button v-if="!form.ft_info.length" native-type="button" block borderless type="info"
                                plain @click="openFentang">
                                新建分摊</van-button>
                            <div v-if="form.ft_info.length">
                                <van-cell class="avg_cell" border :title="el.cdbm.name" v-for="el in form.ft_info"
                                    :key="el.cdbl.id">
                                    <span>￥{{el.cdje}}</span>
                                    <span>({{el.cdbl}}%)</span>
                                </van-cell>
                            </div>
                        </div>
                    </van-cell-group>
                </template>
                <!-- 底部保存 -->
                <div class="van-tabbar--fixed bottom_saved_buttons" v-if="!edit_mode">
                    <van-row>
                        <van-col span="12">
                            <van-button @click="onAddSaveAgain" native-type="button" type="default" borderless
                                style="background:rgb(247,247,247)" block>再记一笔</van-button>
                        </van-col>
                        <van-col span="1"></van-col>
                        <van-col span="11">
                            <van-button @click="onAddSave" native-type="button" type="info" borderless block>保存
                            </van-button>
                        </van-col>
                    </van-row>
                </div>
                 <div class="van-tabbar--fixed bottom_saved_buttons" v-if="edit_mode">
                    <van-row>
                        <van-col span="7">
                            <van-button @click="onEditRemove" native-type="button" type="default" borderless
                                style="background:rgb(247,247,247)" block>移除</van-button>
                        </van-col>
                        <van-col span="1"></van-col>
                        <van-col span="16">
                            <van-button @click="onEditSave" native-type="button" type="info" borderless block>保存
                            </van-button>
                        </van-col>
                    </van-row>
                </div>
            </van-form>
        </div>
        <!-- <transition name="van-slide-right">
            <div class="erji-view" v-if="isErjiRoute" >
                <router-view :formdata="form" @chooseXflx="chooseXflx" @chooseWldw="chooseWldw"></router-view>
            </div>
        </transition> -->
        <van-popup :overlay="false" v-model="isErjiRoute" position="right" :style="{ width: '100%',height:'100%' }">
            <transition name="van-fade">
                <router-view :formdata="form" @chooseXflx="chooseXflx" @chooseWldw="chooseWldw"></router-view>
            </transition>
        </van-popup>
    </div>
</template>
<script>
    import {
        bill_get_ywcj,
        bill_set_data,
        bill_add_get_weidaopiao_money,
        bill_edit_get_danjuInfo
    } from 'api'
    import {
        dateFormat
    } from '@/utils/utils'
    import {
        mapGetters
    } from 'vuex'
    export default {
        data() {
            return {
                // ywcjColumns: [],
                ywcjStatus: false,
                dprq_popup: new Date(),
                dprqStatus: false,
                minDate: new Date(2015, 0, 1),
                maxDate: new Date(),
                initOK: false,
                fp_list: [],
                form: {
                    xflx: {},
                    duisi: true,
                    ywcj: {},
                    bcdp: "",
                    dprq: new Date(),
                    wanlai_danwei: {},
                    liuyan: '',
                    ft_info: [],
                    wdpje:0
                },
                saveId: [],
            }
        },
        watch: {
            isErjiRoute: {
                immediate: true,
                async handler(val) {
                    await this.$nextTick()
                }
            },
            async 'form.ywcj.id'(val) {
                await this.$nextTick();
                this.$refs.form && this.$refs.form.resetValidation();
                this.getHexiaoFeiyong();
            }
        },
        computed: {
            isErjiRoute: {
                get() {
                    return this.$route.name != 'bill_add'
                },
                set(val) {}
            },
            ...mapGetters({
                ywcjColumns: 'ywcjList',
                regRules: 'regRules'
            }),
            edit_mode(){
                return this.$route.query.hasOwnProperty('dj_id')
            }
        },
        created() {
            if (this.isErjiRoute && !this.$route.params.avoidRefresh) {
                //二级路由处理
                this.$router.push({
                    name: 'bill_add'
                })
            }
            // Promise.all([this.getDataYwcj()]).then(r => {
            // this.initOK = true;
            // })
            if(this.$route.query.dj_id) {
                bill_edit_get_danjuInfo(this.$route.query.dj_id).then(r=>{
                    console.log(r);
                    var data = r.data || {};
                    this.form = {
                        bcdp: Number(data.je).toFixed(2),
                        dprq: new Date(data.rq),
                        ft_info: data.ft_info.map(el=>{
                            el.cdje = Number(el.je).toFixed(2);
                            return el
                        }),
                        liuyan: data.bz || "",
                        wanlai_danwei: data.wanlai_danwei || {},
                        xflx: data.xflx,
                        ywcj: data.ywcj,
                        wdpje: 0,
                        duisi: data.zhbj == 2
                    };
                    this.getHexiaoFeiyong();
                }).catch(e=>e)
            }
            this.form.ywcj = this.ywcjColumns[0]
            this.fp_list = [{
                url: 'https://img.yzcdn.cn/vant/ipad.jpeg',
                sort: '其他',
                date: '2020-07-12',
                money: '2300.00'
            }]

        },
        methods: {
            getHexiaoFeiyong(){
                 if(this.form.ywcj.id == 7189) {
                    var zhmc = this.form.wanlai_danwei.zhmc;
                    bill_add_get_weidaopiao_money({zhmc}).then(r=>{
                        console.log(r);
                        this.form.wdpje = Number(r.data).toFixed(2);
                    }).catch(e=>{
                        console.log(e);
                    })
                }
            },
            go2sub(route) {
                route = Object.assign(route, {
                    params: {
                        avoidRefresh: true
                    }
                })
                this.$router.push(route)
            },
            onMoneyBlur(){
                this.$refs.form.validate('xfje').then(r => {
                    this.form.bcdp = Number(this.form.bcdp).toFixed(2);
                }).catch(e => {
                    this.$toast.fail(e.message);
                })
            },
            onAddSave() {
                this.$refs.form.validate().then(r => {
                    this.onSubmit().then(r => {
                        if (this.$route.query.from) {
                            this.$router.push({
                                name: this.$route.query.from,
                                query: {
                                    fyid: this.saveId.join('_')
                                }
                            });
                        }else{
                             this.$router.push({
                                name: 'account',
                                query: {
                                    _: +new Date()
                                }
                            })
                        }
                    })
                })
            },
            onEditRemove(){

            },
            onEditSave(){

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
            async onAddSaveAgain() {
                this.$refs.form.validate().then(r => {
                    this.onSubmit().then(async r => {
                        this.form = Object.assign(this.form, {
                            xflx: {},
                            bcdp: "",
                            dprq: new Date(),
                            liuyan: '',
                            wanlai_danwei: {},
                            ft_info: []
                        })
                        await this.$nextTick();
                        this.$refs.form && this.$refs.form.resetValidation();
                    })
                })

            },
            onSubmit() {
                var djlx = this.form.ywcj.djlx;
                var djlb = this.form.ywcj.id;
                var ny = dateFormat(this.form.dprq, 'yyyyMM');
                var rq = dateFormat(this.form.dprq, 'yyyy-MM-dd');
                var zhid = this.form.wanlai_danwei.id;
                var zhmc = this.form.wanlai_danwei.zhmc;
                var je = this.form.bcdp;
                var zhbj = '0';
                var bz = this.form.liuyan;
                var fydlmc = this.form.xflx.fydlmc;
                var fylxmc = this.form.xflx.fylxmc;
                var dgbs = this.form.duisi? 2 : 1;
                var ft_info = this.form.ft_info;
                return new Promise((res, rej) => {
                   return bill_set_data({
                        djlx,
                        djlb,
                        rq,
                        zhid,
                        je,
                        zhbj,
                        bz,
                        fydlmc,
                        fylxmc,
                        zhmc,
                        dgbs,
                        ny,
                        ft_info
                    }).then(r => {
                        console.log(r);
                        if (r.errcode == 0) {
                            this.saveId.push(r.data.id);
                            this.$toast.success('保存成功!');
                            res(true);
                        } else {
                            this.$toast.fail('保存失败!');
                            rej(false)
                        }
                    })
                })
            },
            chooseXflx(val) {
                this.form.xflx = val;
                this.form.duisi = val.dgbs == 0;
                this.$store.dispatch('appGoback');
            },
            chooseWldw(val) {
                console.log(val);
                this.form.wanlai_danwei = val;
                this.$store.dispatch('appGoback');
                this.getHexiaoFeiyong();
            },
            onYwcjConfirm(value) {
                this.form.ywcj = value;
                this.ywcjStatus = false;
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

            .xflx {
                .van-field__left-icon i {
                    font-size: 26px;
                    color: #777;
                    margin-left: 5px;
                }
            }

            .switch-cell {
                .flex(@j: space-between; );
                padding: 10px 5px 10px;
                background: white;
                margin-botttom: -10px;
                font-size: 13px;

                .left {
                    border-left: 5px solid @j_main_color;
                    padding-left: 6px;
                    font-size: 600;
                }
            }

            .van-cell:not(.avg_cell) {

                .van-cell__title,
                .van-field__label {
                    margin-right: 0;
                    width: 100px;
                    flex: none;
                }

                .van-cell__value {
                    flex: 1;
                    text-align: left;
                    color: #323233
                }
            }

            .avg_cell {
                .van-cell__title {
                    .textRowOverflow(1);
                }
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
                width: 100%;
                // height: 60px;
                height: 100%;;
                .flex();

                .delete-button {
                    // width: 45px;
                    // height: 45px;
                    // ;
                }
            }

        }


    }
</style>