<template>
    <div class="fengtang-container" ref="ftContainer" :style="{height: appHeight +'px'}">
        <van-nav-bar title="分摊金额" placeholder left-text="返回" left-arrow @click-left="$store.dispatch('appGoback')" />
        <div class="main" ref="main">
            <van-cell class="sticky" style="top:0">
                <template #title>
                    <div>
                        1条费用，金额 ￥{{ft_money}}
                    </div>
                </template>
                <a class="blue-text" @click="avgMoney"> 平均分摊</a>
            </van-cell>
            <!-- {{fentang_list}} -->
            <van-form ref="form" style="position:relative" :show-error="false" :show-error-message="show_error"
                novalidate>
                <van-divider style="padding:5vw 0" v-if="fentang_list.length ==0">暂无分摊, 请添加分摊</van-divider>
                <transition-group name="van-slide-right" mode="out-in" >
                    <div style="width: 100%" v-for="(el,index) in fentang_list" :key="el.id">
                        <div class="ft_title"><span>分摊({{index+1}}) {{el.id}}</span>
                            <van-button native-type="button" size="small" bgless borderless icon="delete"
                                @click="removeItem(el.id)">
                            </van-button>
                        </div>
                        <van-field v-model="el.cdje" label="承担金额" clickable required :rules="regRules.money">
                            <template #input>
                                <div class="bcdp-item">
                                    <div class="bcdp-item-left">
                                        <span>CNY</span>
                                        <input type="number" step="0.01" @focus="inputFocus(el, 'cdje')"
                                            @blur="updateRate" @keyup.enter="updateRate" placeholder="请输入承担金额"
                                            v-model="el.cdje">
                                    </div>
                                    <a class="blue-text" @click="fill_money(el,index)"><small>填充金额</small></a>
                                </div>
                            </template>
                        </van-field>
                        <van-field v-model="el.cdbl" label="承担比例" clickable required :rules="regRules.percent">
                            <template #input>
                                <div v-if="!el.focus && el.cdbl" @click="onCdblClick(el)" w100>
                                    {{el.cdbl}}%
                                </div>
                                <input class="cdbl_input" ref="cdbl_input" v-if="el.focus || !el.cdbl" type="number"
                                    placeholder="请输入承担比例(0 ~ 100)" borderless v-model.number.lazy="el.cdbl" min="0"
                                    max="100" step="10" @blur="changePercent(el)" w100
                                    @focus="inputFocus(el, 'cdbl')" />
                            </template>
                        </van-field>
                        <van-field v-model="el.cdbm.name" label="承担部门" clickable required placeholder="请选择承担部门"
                            :rules="[{ required: true, message: '请选择承担部门',trigger: 'onChange' }]" is-link readonly
                            @click="onDeptClick(el)">
                        </van-field>
                    </div>
                </transition-group>


                <van-cell-group class="marginTop" v-if="fentang_list.length > 0">
                    <van-button native-type="button" type="danger" @click="removeAll()" plain borderless block>删除全部
                    </van-button>
                </van-cell-group>

                <van-row class="marginTop marginBottom">
                    <van-col span="12" class="border-right">
                        <van-button native-type="button" type="info" @click="addFengtangOne()" plain borderless block>
                            添加分摊</van-button>
                    </van-col>
                    <van-col span="12">
                        <van-button native-type="button" type="info" @click="addFengtangMultiple()" plain borderless
                            block>多选分摊</van-button>
                    </van-col>
                </van-row>
            </van-form>

            <!-- 底部保存 -->
            <div class="van-tabbar--fixed bottom_saved_buttons">
                <van-row>
                    <van-col span="12">
                        <van-button @click="$store.dispatch('appGoback')" native-type="button" type="default" borderless
                            style="background:rgb(247,247,247)" block>取消</van-button>
                    </van-col>
                    <van-col span="1"></van-col>
                    <van-col span="11">
                        <van-button @click="onSave" native-type="button" type="info" borderless block>确定
                        </van-button>
                    </van-col>
                </van-row>
            </div>
        </div>
        <van-popup :overlay="false" v-model="isErjiRoute" position="right" :style="{ width: '100%',height:'100%' }">
            <transition name="van-fade">
                <router-view :fentang_list="fentang_list" :activeItem="activeItem" @select-dept="selectDept"
                    @select-multiple-dept="selectMultipleDept" :rq="formdata.dprq"></router-view>
            </transition>
        </van-popup>
    </div>
</template>
<script>
    import {
        mapGetters
    } from 'vuex'
    import {
        accSub,
        accAdd,
        accMul,
        accDiv
    } from '@/utils/math';
    import {
        dialogConfirm,
        randomString
    } from '@/utils/utils'
    export default {
        data() {
            return {
                fentang_list: [],
                ft_money: this.formdata.bcdp || 0,
                activeItem: {},
                show_error: true
            }
        },
        props: ['formdata'],
        computed: {
            ...mapGetters(['appHeight', 'regRules']),
            isErjiRoute: {
                get() {
                    return this.$route.path.startsWith('/bill/add/fentang/')
                },
                set(val) {}
            },
            curSum() {
                return this.fentang_list.reduce((t, el) => {
                    t = accAdd(t, el.cdje);
                    return t;
                }, 0)
            }
        },

        methods: {
            async onCdblClick(el) {
                el.focus = true;
                await this.$nextTick();
                this.$refs.cdbl_input && this.$refs.cdbl_input[0].focus();
            },
            inputFocus(el, key) {
                if (Number(el[key]) == 0) {
                    el[key] = "";
                }
            },
            onSave() {
                this.show_error = true;
                this.$refs.form.validate().then(r => {
                    if (this.validateForm()) {
                        this.formdata.ft_info = Array.from(this.fentang_list);
                        this.$store.dispatch('appGoback');
                    }
                }).catch(e => {
                    console.log(e);
                    this.$toast.fail(e[0].message)
                })
            },
            changePercent(item) {
                item.focus = false;
                item.cdbl = Number(item.cdbl);
                item.cdje = (this.ft_money * 0.01 * item.cdbl).toFixed(2);
            },



            removeItem: dialogConfirm(function (id) {
                var index = this.fentang_list.findIndex(el => el.id == id)
                index != -1 && this.fentang_list.splice(index, 1);
            }),
            removeAll: dialogConfirm(function () {
                this.fentang_list = [];
            }, {
                title: '删除全部',
                message: '是否删除全部?'
            }),
            avgMoney() {
                if (this.ft_money <= 0) {
                    return this.$toast.fail('分摊金额不能为' + this.ft_money + "元");
                }
                var leftMoney = this.ft_money;
                var leftRate = 100;
                var arrLen = this.fentang_list.length;
                this.fentang_list = this.fentang_list.map((el, index, arr) => {
                    var m = accDiv(this.ft_money, arrLen).toFixed(2);
                    if ((arr.length - 1) == index) { //zuihouyige
                        el.cdje = Number(leftMoney).toFixed(2);
                        el.cdbl = leftRate
                    } else {
                        el.cdje = m;
                        el.cdbl = ((1 / arr.length) * 100).toFixed(2);
                        leftRate = accSub(leftRate, el.cdbl);
                        leftMoney = Number(accSub(leftMoney, m)).toFixed(2)
                    }
                    return el;
                })
            },
            fill_money(el, index) {
                if (this.ft_money <= 0) {
                    return this.$toast.fail('分摊金额不能为' + this.ft_money + "元");
                }
                var leftMoney = this.fentang_list.reduce((t, el, i) => {
                    if (index != i) t = accSub(t, el.cdje);
                    return t;
                }, this.ft_money)
                this.fentang_list[index].cdje = leftMoney;
                this.updateRate();
            },
            validateForm(el) {
                var leftMoney = this.fentang_list.reduce((t, el, i) => {
                    t = accSub(t, el.cdje)
                    return t;
                }, this.ft_money);
                if (leftMoney < 0) {
                    this.$toast.fail('合计金额不能超过总金额');
                    return false;
                }
                return true;
            },
            updateRate() {
                this.fentang_list = this.fentang_list.map(el => {
                    el.cdbl = (accDiv(el.cdje, this.ft_money) * 100).toFixed(2);
                    el.cdje = Number(el.cdje).toFixed(2);
                    return el;
                })
            },
            async addFengtangMultiple() {
                this.$router.push({
                    path: this.$route.path + '/bill_add_dept',
                    query: {
                        multiple: true
                    }
                });
            },
            onDeptClick(item) {
                this.activeItem = item;
                this.$router.push({
                    path: this.$route.path + '/bill_add_dept',
                    query: {
                        breadcrumb: item.breadcrumb,
                        keyword: item.keyword
                    }
                });
            },
            async addFengtangOne() {
                this.fentang_list.push({
                    cdje: 0,
                    cdbl: 0,
                    cdbm: {},
                    focus: false,
                    id: randomString()
                });
            },
            selectDept({
                dept,
                breadcrumb = [],
                keyword = ""
            }) {
                if (this.activeItem == -1) this.$store.dispatch('appGoback');
                this.activeItem.cdbm = dept;
                this.activeItem.breadcrumb = breadcrumb
                this.$store.dispatch('appGoback')
            },
            async selectMultipleDept({
                depts,
                breadcrumb = [],
                keyword =""
            }) {
                this.$store.dispatch('appGoback');
                console.log(depts);
                this.show_error = false;
                depts.forEach(el => {
                    this.fentang_list.push({
                        cdje: 0,
                        cdbl: 0,
                        cdbm: el,
                        focus: false,
                        id: randomString(),
                        breadcrumb: breadcrumb,
                        keyword: keyword
                    });
                })
            }
        },
        created() {
            this.fentang_list = Array.from(this.formdata.ft_info.map(el => {
                el.id = el.id ? el.id : randomString();
                el.breadcrumb = el.breadcrumb ? el.breadcrumb : [];
                return el
            }));
        }
    }
</script>
<style lang="less">
    .fengtang-container {
        overflow: auto;
        overflow-x: hidden;
        background-color: rgb(240, 242, 245);

        .bcdp-item {
            width: 100%;
            .flex(@j: space-between);

            .bcdp-item-left {}

            input {
                width: 100px;
            }
        }

        .ft_title {
            line-height: 30px;
            padding: 2px 10px;
            color: gray;
            font-size: 12px;
            .flex(@j: space-between);
        }

        .cdbl_input {
            &::placeholder {
                color: rgb(202, 203, 206);
            }
        }

        .van-form {
            min-height: calc(100vh - 40vw);
        }

        .bottom_saved_buttons {
            position: sticky;
            padding-bottom: 10px;
        }
    }
</style>