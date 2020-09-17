<template>
    <div class="minxi-container" >
        <van-nav-bar title="从账本导入" fixed placeholder  left-text="返回" left-arrow @click-left="$store.dispatch('appGoback')" />
        <nav class="nav-bar"   v-if="!checkMode">
            <div class="left-item">
                <a class="blue-text" @click="checkMode = true">多选</a>
            </div>
        </nav>
            <nav class="nav-bar" v-if="checkMode" backBlur>
            <a class="blue-text" v-if="!isSelectAll" @click="onSelectAll(true)">全选</a>
            <a class="blue-text" v-if="isSelectAll" @click="onSelectAll(false)">取消全选</a>
            <a class="blue-text" @click="checkMode = false">取消</a>
        </nav>
        <transition name="van-slide-up">
            <van-notice-bar left-icon="hotel-o" color="#1989fa" background="#ecf9ff"  v-if="wanlai_danwei.zhmc">
                往来单位：{{wanlai_danwei.zhmc}}
            </van-notice-bar>
        </transition>
        <van-pull-refresh v-model="refreshing" success-text="刷新成功" @refresh="onRefresh">
            <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad" :error.sync="error"
                error-text="请求失败，点击重新加载" :immediate-check="false" ref="vanlist">
                <van-collapse v-model="activeNames">
                    <van-collapse-item v-show="acc.children.length" v-for="(acc,index) in accountList" :key="index"
                        :name="index" :title="acc.title">
                        <van-swipe-cell v-for="(el,i) in acc.children" :key="i" >
                            <account-item @click.native="onItemClick(el,acc, true)" :checkMode="checkMode" :item="el"></account-item>
                        </van-swipe-cell>
                    </van-collapse-item>
                </van-collapse>
            </van-list>
        </van-pull-refresh>
        <scrollTop dom=".minxi-container"></scrollTop>
      <div class="van-tabbar--fixed bottom_saved_buttons" v-if="checkMode" sticky @click.stop>
                <van-row w100>
                    <van-col span="24">
                        <van-button @click="onSave()" native-type="button" type="info" borderless block
                            icon="success">
                            确定选择
                        </van-button>
                    </van-col>
                </van-row>
            </div>
    </div>
</template>
<script>
    import {
        bill_get_fyListForDanju
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
                    publicType: 0
                },
                refreshing: false,
                loading: false,
                error: false,
                filterOptions: {
                    status: 0,
                    sortable: 1,
                    publicType: 0
                },
                accountList: [],
                activeNames: [],
                checkMode: false,
                isSelectAll: false,
                rowList: [],
                page: 1,
                limit: 8,
                finished: false,
            }
        },
        computed:{
             ...mapGetters({
                ywcjList: 'ywcjList'
            }),
            
        },
        props: ['minxiList','bill_type','wanlai_danwei'],
        mounted() {
            setTimeout(()=>{
                this.$refs.vanlist.check();
            }, 300)
        },
        methods: {
            onItemClick(el, acc){
                console.log(el,acc);
                // if(el.wanlai_danwei.id != this.wanlai_danwei.id) {
                //     return this.$toast('已导入, 请勿重复选择!')
                // }
                if (this.checkMode) {
                    el.checked = !el.checked;
                } else {
                    console.log(el.wanlai_danwei.id, this.wanlai_danwei.id);
                    if(this.wanlai_danwei.id && el.wanlai_danwei.id != this.wanlai_danwei.id) {
                        return this.$toast.fail('不能挑选不同的往来单位')
                    }else{
                        this.$emit('select_fyList',[el])
                    }
                }
            },
            onSave(){
                var multiple = [];
                this.accountList.forEach(el => {
                    var sl = el.children.filter(c => c.checked && !c.hasSelected);
                    multiple.push(...sl);
                })
                if(multiple.every((el,i,arr)=> el.wanlai_danwei.id == arr[0].wanlai_danwei.id)) {
                    this.$emit('select_fyList',multiple)
                }else {
                    this.$toast.fail('不能挑选不同的往来单位')
                }
                console.log(multiple);
            },
            onSelectAll(tag) {
                this.accountList.forEach((acc) => {
                    acc.children.forEach((child) => {
                        if(!child.hasSelected) {
                            child.checked = tag;
                        }
                    })
                })
                this.isSelectAll = tag;
            },
            onLoad(){
                var status = this.filterOptions.status;
                var group = this.filterOptions.sortable;
                var zhbj = this.filterOptions.publicType;
                if (this.refreshing) {
                    this.rowList = [];
                    this.accountList = [];
                    this.refreshing = false;
                }
                return bill_get_fyListForDanju({
                    status,
                    group,
                    zhbj,
                    page: this.page,
                    limit: this.limit,
                    dgbs: this.bill_type.dgbs,
                    wanlai_danwei: this.wanlai_danwei
                }).then(r => {
                    if (r.data.length == 0) {
                        return this.finished = true
                    }
                    var data = r.data.map(this.handleRowData)
                    this.rowList.push(...data);
                    this.handleViewData();
                    this.page = this.page + 1
                    return r;
                }).catch(e => {
                    this.error = true;
                }).finally(() => {
                    this.loading = false;
                })
            
            },
            onRefresh() {
                this.page = 1;
                this.finished = false;
                this.loading = true;
                console.log('刷新中');
                this.rowList = [];
                this.onLoad().then(r => {
                }).catch(e => {
                }).finally(() => {
                    this.refreshing = false
                })
            },
             handleViewData() {
                var data = this.rowList.reduce((t, ele) => {
                    var rq = this.filterOptions.sortable == 0 ? ele.zdrq : ele.rq;
                    var key = dateFormat(rq, 'yyyy-MM-dd');
                    if(!t[key]) {
                        t[key] = { title: key, children: [] }
                    }
                    if(ele.hasSelected == false){
                        t[key].children.push(ele)
                    }
                    return t;
                }, {});
                this.accountList = Object.values(data);
                this.activeNames = this.accountList.map((el, i) => i);
            },
            handleRowData(ele) {
                ele.expenseType = ele.xflx.fylxmc;
                ele.money = Number(ele.je).toFixed(2);
                ele.checked = Boolean(this.minxiList.find(el=>el.id == ele.id))? true:false;
                ele.expenseTime = dateFormat(ele.rq, 'MM-dd');
                ele.icon = ele.zhbj == 1 ? 'hotel-o' : 'user-o';
                ele.hasSelected= Boolean(this.minxiList.find(el=>el.id == ele.id ));
                return ele;
            },
        },
        
    }
</script>
<style lang="less">
    .minxi-container {
        width: 100%;
        height: 100%;
        background: rgb(240,242,245);
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
           
        nav.nav-bar {
            padding: 5px 15px;
            background: rgba(255, 255, 255, 0.8);

            min-height: 30px;
            position: sticky;
            top: 10vw;
            z-index: 100;
            border-bottom: 1px solid #e6e6e6;
            // box-shadow: 0px 10px 20px 0px #cfcfcf49;
            .flex(@j: space-between);
            font-size: 14px;

            .gray-btn-group {
                display: inline-block;
                font-size: 85%;
                padding: 5px;
                background: rgb(241, 241, 241);
                margin-left: 20px;

                span {
                    margin: 0 5px;
                }
            }
        }

        .van-list {
            min-height: 70vh;
            .van-collapse-item {
                &>.van-collapse-item__title {
                    background: #ecf3fa;
                    padding: 10px 20px;
                }
            }

            .van-collapse-item__content {
                padding: 0;
            }

            .account-item-container {
                border-bottom: 1px solid rgba(128, 128, 128, 0.143);
                overflow: hidden;
                &.hasSelected{
                    filter: grayscale(1);
                }
                .duigong {
                    width: 88%;
                    padding: 2.66667vw;
                    .flex(@j: space-between; );
                    box-sizing: border-box;
                    float: right;
                    font-size: .8em;
                    border-top: 1px dashed rgba(128, 128, 128, 0.1);
                    padding-left: 2%;

                    .cell {
                        .flex();

                        &>i {
                            margin-right: 4px;
                        }

                        &>span {
                            margin-left: 5px;
                        }
                    }
                }

            }

        }

    }
</style>