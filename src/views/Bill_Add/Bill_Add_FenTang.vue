<template>
    <div class="fengtang-container" :style="{height: app_height +'px'}">
        <van-nav-bar title="分摊金额" fixed placeholder style="height:10vw" left-text="返回" left-arrow @click-left="$store.dispatch('appGoback')" />
        <div class="main" ref="main">
       
                <van-cell class="sticky" style="top:10vw">
                    <template #title>
                        <div>
                            1条费用,金额 ￥{{ft_money}}
                        </div>
                    </template>
                    <a class="blue-text" @click="avgMoney"> 平均分摊</a>
                </van-cell>
     
            <van-form ref="form" :show-error="show_error"  :show-error-message="show_error">
            
                <div style="width: 100%" v-for="(el,index) in fentang_list" :key="el.id">
                    <div class="ft_title"><span>分摊({{index+1}}) </span>
                        <van-button size="small" bgless borderless>
                            <van-icon size="16" name="delete" @click="remove_item(index)" />
                        </van-button>
                    </div>
                    <van-field v-model="el.cdje" label="承担金额" clickable required
                        :rules="[{ required: true, message: '请输入承担金额' }]">
                        <template #input>
                            <div class="bcdp-item">
                                <div class="bcdp-item-left">
                                    <span>CNY</span>
                                    <input type="number" step="0.01" placeholder="请输入承担金额" v-model="el.cdje">
                                </div>
                                <a class="blue-text" @click="fill_money(el,index)"><small>填充金额</small></a>
                            </div>
                        </template>
                    </van-field>
                    <van-field v-model="el.cdbl" label="承担比例" type="number" clickable required
                        :rules="[{ required: true, message: '请输入承担比例' }]">
                        <template #input>
                            <input type="number" borderless v-model="el.cdbl" min="0" max="100" step="10"
                                @blur="changePercent(el)" style="width:80px;" />
                            <span style="margin-left:10px">%</span>
                        </template>
                    </van-field>
                    <van-field v-model="el.cdbm.name" label="承担部门" clickable required placeholder="请选择承担部门"
                        :rules="[{ required: true, message: '请选择承担部门',trigger: 'onChange' }]" is-link readonly
                        @click="selectStart(el)">
                    </van-field>
                </div>
                <van-row class="marginTop">
                    <van-col span="12" class="border-right">
                        <van-button native-type="button" type="danger" @click="removeAll" plain borderless block>删除全部</van-button>
                    </van-col>
                    <van-col span="12">
                        <van-button native-type="button" type="info" @click="addFengtang" plain borderless block>添加分摊</van-button>
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
        <!-- <transition name="van-slide-right">
            <div class="erji-view" v-if="isOpenErji">
                <keep-alive>
                    <router-view @select_dept="select_dept"></router-view>
                </keep-alive>
            </div>
        </transition> -->
         <van-popup :overlay="false" v-model="isErjiRoute" position="right" :style="{ width: '100%',height:'100%' }" >
            <transition name="van-fade">
                <router-view @select_dept="select_dept"></router-view>
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
    } from './../../utils/math';
    export default {
        data() {
            return {
                fentang_list: [],
                ft_money: this.formdata.bcdp,
                activeItem: -1,
                show_error: true
            }
        },
        props: ['formdata'],
        computed: {
            ...mapGetters(['app_height']),
            isOpenErji() {
                return this.$route.name != 'bill_add_fentang'
            },
             isErjiRoute:{
                get(){
                    return this.$route.name != 'bill_add_fentang'
                },
                set(val){}
            },
            curSum() {
                return this.fentang_list.reduce((t, el) => {
                    t = accAdd(t, el.cdje);
                    return t;
                }, 0)
            }
        },
        created() {
            this.fentang_list = Array.from(this.formdata.ft_info);
            if(this.fentang_list == 0) {
                this.addFengtang();
            }
        },
        methods: {
            onCd(){
                alert(1)
            },
            onSave() {
                this.show_error = true;
                this.$refs.form.validate();
                if (this.validateForm()) {
                    this.formdata.ft_info = Array.from(this.fentang_list);
                    this.$store.dispatch('appGoback');
                }
            },
            changePercent(item) {
                item.cdje = (this.ft_money * 0.01 * item.cdbl).toFixed(2);
            },
            select_dept(dept) {
                console.log(dept);
                if (this.activeItem == -1) this.$store.dispatch('appGoback');
                this.activeItem.cdbm = dept;
                this.$store.dispatch('appGoback')
            },
            selectStart(item) {
                this.activeItem = item;
                this.$router.push({
                    path: this.$route.path + '/bill_add_dept'
                });
            },
            remove_item(index) {
                this.fentang_list.splice(index, 1);
            },
            fill_money(el, index) {
                var leftMoney = this.fentang_list.reduce((t, el, i) => {
                    if (index != i) t = accSub(t, el.cdje);
                    return t;
                }, this.ft_money)
                this.fentang_list[index].cdje = leftMoney;
                this.updateRate();
            },
            removeAll() {
                this.fentang_list = [];
            },
            avgMoney() {
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
            validateForm(el) {
                var leftMoney = this.fentang_list.reduce((t, el, i) => {
                    t = accSub(t, el.cdje)
                    return t;
                }, this.ft_money);
                if (leftMoney < 0) {
                    this.$toast('合计金额不能超过总金额');
                    return false;
                };
                var el = this.fentang_list.filter(el=>!el.cdbm.id);
                if(el.length) {
                      this.$toast('请选择承担部门');
                    return false;
                }
                return true;
            },
            updateRate() {
                this.fentang_list = this.fentang_list.map(el => {
                    el.cdbl = (accDiv(el.cdje, this.ft_money) * 100).toFixed(2);
                    return el;
                })
            },
             addFengtang() {
                this.fentang_list.push({
                    cdje: 0,
                    cdbl: 0,
                    cdbm: { }
                });
                this.show_error = false
            }
        }

    }
</script>
<style lang="less">
    .fengtang-container {
        overflow: auto;
        background-color: rgb(240, 242, 245);
        &>*{
        z-index: 100000;

        }
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

        .main {
            padding-bottom: 100px;
            ;
        }

        .bottom_saved_buttons {
            padding: 10px;
            background: white;
            right: 0;
        }
    }
</style>