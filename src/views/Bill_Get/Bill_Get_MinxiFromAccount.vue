<template>
    <div class="minxi-container" >
        <van-nav-bar title="从账本导入" left-text="返回" left-arrow @click-left="$store.dispatch('appGoback')" />
        <div class="main-content">
              <van-collapse v-model="activeNames">
                    <van-collapse-item v-show="acc.children.length" v-for="(acc,index) in accountList" :key="index"
                        :name="index" :title="acc.title">
                        <van-swipe-cell  v-for="(el,i) in acc.children" :key="i" >
                            <div class="account-item" @click="onItemClick(el,acc)">
                                <div class="left">
                                    <div class="icon">
                                        <van-icon :name="el.icon"></van-icon>
                                    </div>
                                    <div class="title">
                                        <div>{{el.expenseType}}</div>
                                        <small style="color:#aaa">{{el.zhmc}}</small>
                                    </div>
                                </div>
                                <div class="right">
                                    <div class="top"><small>¥</small>{{el.money}}</div>
                                    <div class="bottom">消费时间 {{el.expenseTime }}</div>
                                </div>
                            </div>
                        </van-swipe-cell>
                    </van-collapse-item>
                </van-collapse>
        </div>
    </div>
</template>
<script>
    import {
        account_get_danjuList
    } from 'api'
    import {
        mapGetters
    } from 'vuex'
    import {
        dateFormat
    } from './../../utils/utils';

    export default {
        data() {
            return {
                activeNames: ['1'],
                accountList: [],
                 filterOptions: {
                    status: 0,
                    sortable: 1,
                    ywcj: 0
                },
                    filterOptionsLabel: {
                    status: [{
                            id: 0,
                            label: '未报销'
                        },
                        {
                            id: 1,
                            label: '已报销'
                        }, {
                            id: 2,
                            label: '已移除'
                        },
                    ],
                    sortable: [{
                            id: 0,
                            label: '创建时间'
                        },
                        {
                            id: 1,
                            label: '消费时间'
                        }, {
                            id: 2,
                            label: '费用类型'
                        },
                    ]
                },
            }
        },
        computed:{
             ...mapGetters({
                ywcjList: 'ywcjList'
            }),
        },
        methods: {
            onItemClick(el, acc){
                console.log(el,acc);
                this.$emit('select_minxi',el)
            },
            getData(){
                var status = this.filterOptions.status;
                var group = this.filterOptions.sortable;
                var djlb = this.filterOptions.ywcj
                return account_get_danjuList({
                    status,
                    group,
                    djlb
                }).then(r => {
                    var data = r.data.reduce((t, ele) => {
                        ele.expenseType = ele.Fydlmc + " " + ele.Fylxmc;
                        ele.money = Number(ele.je).toFixed(2);
                        ele.checked = false;
                        ele.expenseTime = dateFormat(ele.rq, 'MM-dd');
                        ele.icon = 'balance-o'
                        var key = dateFormat(ele.rq, 'yyyy-MM-dd');
                        t[key] ? t[key].children.push(ele) : (t[key] = {
                            title: key,
                            children: [ele]
                        });
                        return t;
                    }, {});
                    this.accountList = Object.values(data);
                    this.activeNames = this.accountList.map((el, i) => i);
                    return r;
                }).catch(e => e)
            }
        },
    
        created() {
            this.getData();
          
        }
    }
</script>
<style lang="less">
    .minxi-container {
        width: 100%;
        height: 100%;
        display: flex;
        overflow: hidden;
        flex-direction: column;
        background: white;
        .van-nav-bar {
            flex: none;
        }

        .main-content {
            .flex(@a: strech; @j: center);
            flex: 1;
            height: 100%;
            overflow: auto;
            .van-sidebar {
                width: 100px;
            }
            .van-collapse-item__content{
                padding: 0 10px;;
            }
            .side-right {
                width: calc(100vw - 100px);
                height: 100%;
                overflow-y: auto;
                .van-cell__title {
                    padding-left: 10px;
                }
            }
             .account-item {
                padding: 5px 10px;
                ;
                .flex(@j: space-between);
                color: black;
                border-bottom: 1px solid rgba(128, 128, 128, 0.143);

                .left {
                    .checkbox {
                        margin-right: 10px;
                        ;
                    }

                    .flex(@j: flex-start);

                    .icon {
                        border: 1px dashed rgb(119, 132, 148);
                        width: 30px;
                        color: rgb(135, 149, 167);
                        height: 30px;
                        border-radius: 100px;
                        .flex();
                        font-size: 20px;
                        margin-right: 10px;
                        zoom: .9;
                    }
                }

                .right {
                    .flex(@d: column; @a: flex-end);

                    .bottom {
                        font-size: 70%;
                        color: gray;
                    }

                    .top {}
                }
            }

        }

    }
</style>