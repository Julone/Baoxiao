<template>
    <div class="fengtang-container" :style="{height: app_height +'px'}">
        <van-nav-bar title="分摊金额" left-text="返回" left-arrow @click-left="$store.dispatch('appGoback')" />
        <div class="main">
            <van-cell>
                <template #title>
                    <div>
                        1条费用,金额 ￥{{ft_money}}
                    </div>
                </template>
                <a class="blue-text" @click="avgMoney"> 平均分摊</a>
            </van-cell>
            <div style="width: 100%" v-for="(el,index) in fentang_list" :key="el.id">
                <div class="ft_title"><span>分摊({{index+1}}) </span>
                    <van-icon size="16" name="delete" @click="remove_item(index)" />
                </div>
                <van-field v-model="el.cdje" label="承担金额" clickable required
                    :rules="[{ required: true, message: '请输入承担金额' }]">
                    <template #input>
                        <div class="bcdp-item">
                            <div class="bcdp-item-left">
                                <span>CNY</span>
                                <input type="number" placeholder="请输入承担金额" @focus="curMoney = el.cdje"
                                    @blur="validateRange(el)" v-model="el.cdje">
                            </div>
                            <a class="blue-text" @click="fill_money(el,index)"><small>填充金额</small></a>
                        </div>
                    </template>
                </van-field>
                <van-field v-model="el.cdbl" label="承担比例" type="number" clickable required
                    :rules="[{ required: true, message: '请输入承担比例' }]">
                    <template #input>
                        <van-stepper v-model="el.cdbl" min="0" max="100" step="10" @change="changePercent(el)" />  
                        <span style="margin-left:10px">%</span>
                    </template>
            
                </van-field>
                <van-field v-model="el.cdbm.name" label="承担部门" clickable required
                    :rules="[{ required: true, message: '请选择承担部门' }]" is-link readonly @click="selectStart(el)">
                </van-field>
            </div>
            <van-row style="margin-top:10px;">
                <van-col span="12">
                    <van-button type="danger" @click="removeAll" plain borderless block>删除全部</van-button>
                </van-col>
                <van-col span="12">
                    <van-button type="info" @click="addFengtang" plain borderless block>添加分摊</van-button>
                </van-col>
            </van-row>
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
        <transition name="van-slide-right">
            <div class="erji-view" v-if="isOpenErji">
                <keep-alive>
                    <router-view @select_dept="select_dept"></router-view>
                </keep-alive>
            </div>
        </transition>
    </div>
</template>
<script>
    import {
        mapGetters
    } from 'vuex'
    import {accSub,accAdd,accMul,accDiv} from './../../utils/math';
    export default {
        data() {
            return {
                fentang_list: [],
                ft_money: this.formdata.bcdp,
                curMoney: 0,
                activeItem: -1,
            }
        },
        props: ['formdata'],
        computed: {
            ...mapGetters(['app_height']),
            isOpenErji() {
                return this.$route.name != 'bill_add_fentang'
            }
        },
        created(){
            this.fentang_list = Array.from(this.formdata.ft_info);
        },
        methods: {
            onSave(){
                this.formdata.ft_info = this.fentang_list;
                var bool = this.validateRange();
                bool && this.$store.dispatch('appGoback');
            },
            changePercent(item){
                item.cdje = (this.ft_money * 0.01 * item.cdbl).toFixed(2);
            },
            select_dept(dept) {
                console.log(dept);
                if(this.activeItem == -1) this.$store.dispatch('appGoback');
                this.activeItem.cdbm = dept;
                this.$store.dispatch('appGoback')
            },
            selectStart(item) {
                this.activeItem = item;
                this.$router.push({
                    name: 'bill_add_dept'
                });
            },
            remove_item(index) {
                console.log(index);
                this.fentang_list.splice(index, 1);
                this.updateRate();
            },
            fill_money(el, index) {
                var leftMoney = this.fentang_list.reduce((t, el, i) => {
                    // if (index != i) t -= el.cdje;
                    if(index != i) t = accSub(t,el.cdje);
                    return t;
                }, this.ft_money)
                this.fentang_list[index].cdje = leftMoney;
                this.updateRate();
            },
            removeAll() {
                this.fentang_list = [];
                this.updateRate();
            },
            avgMoney() {
                var leftMoney = this.ft_money;
                var leftRate = 100;
                this.fentang_list = this.fentang_list.map((el, index, arr) => {
                    if((arr.length - 1) == index) { //zuihouyige
                        el.cdje = leftMoney;
                        el.cdbl = leftRate
                    }else{
                        var m = accDiv(this.ft_money, this.fentang_list.length).toFixed(2);
                        console.log(m);
                        el.cdje = m;
                        el.cdbl = ((1 / arr.length) * 100).toFixed(2);
                        leftRate = accSub(leftRate,el.cdbl);
                        leftMoney = accSub(leftMoney,m);
                        console.log(leftRate,leftMoney);
                    }
                    console.log(el);
                    return el;
                })
                console.log(this.fentang_list);
            },
            validateRange(el) {
                var leftMoney = this.fentang_list.reduce((t, el, i) => {
                    // t -= el.cdje;
                    t = accSub(t,el.cdje)
                    return t;
                }, this.ft_money);
                if (leftMoney < 0) {
                    this.$toast('合计金额不能超过总金额');
                    return false;
                };
                this.updateRate();
                return true;
            },
            updateRate() {
                this.fentang_list = this.fentang_list.map(el => {
                    // el.cdbl = ((el.cdje / this.ft_money) * 100).toFixed(2);
                    el.cdbl = (accDiv(el.cdje, this.ft_money) * 100).toFixed(2)
                    return el;
                })
            },
            addFengtang() {
                this.fentang_list.push({
                    cdje: 0,
                    cdbl: 0,
                    cdbm: {}
                })
            }
        }

    }
</script>
<style lang="less">
    .fengtang-container {
        overflow: auto;
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

        .main {
            padding-bottom: 100px;;
        }
       .bottom_saved_buttons {
                padding: 10px;
                background: white;
                right: 0;
            }
    }
</style>