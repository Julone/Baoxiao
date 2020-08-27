<template>
    <div class="account_container" ref="container">
        <van-nav-bar title="账本" />
        <nav class="nav-bar" v-if="!checkMode">
            <div class="left-item">
                <a class="blue-text" @click="checkMode = true">选择</a>
                <filterOptionsPicker :filterData="filterOptions" @confirmFilter="confirmFilter"></filterOptionsPicker>
            </div>
            <div class="right-item">
                <van-button borderless marginless @click="onRefreshView" size="small">
                    <big> <van-icon class="blue-text" name="replay" /></big>
                </van-button>
                <van-button borderless marginless :to="{path: '/account/bill/add'}" size="small">
                    <big> <van-icon class="blue-text" name="plus" /></big>
                </van-button>
            </div>
        </nav>
        <nav class="nav-bar" v-if="checkMode">
            <a class="blue-text" v-if="!isSelectAll" @click="onSelectAll(true)">全选</a>
            <a class="blue-text" v-if="isSelectAll" @click="onSelectAll(false)">取消全选</a>
            <a class="blue-text" @click="checkMode = false">取消</a>
        </nav>
        <van-pull-refresh v-model="refreshing" success-text="刷新成功" @refresh="onRefresh">
            <!-- <main style="min-height:80vh"> -->
            <van-list v-model="loading" :finished="finished" finished-text="没有更多了"
                @load="onLoad" :error.sync="error" error-text="请求失败，点击重新加载" :immediate-check="true">
                <van-collapse v-model="activeNames" v-if="accountList.length > 0">
                    <van-collapse-item v-show="acc.children.length" v-for="(acc,index) in accountList" :key="index"
                        :name="index" :title="acc.title">
                        <transition-group name="van-slide-left">
                        <van-swipe-cell v-for="(el) in acc.children" :key="el.id" :disabled="checkMode">
                            <div class="account-item-container" @click="onItemClick(el,acc, true)">
                                <div class="account-item">
                                    <div class="left">
                                        <van-checkbox class="checkbox" v-if="checkMode" v-model="el.checked">
                                        </van-checkbox>
                                        <div class="icon">
                                            <van-icon :name="el.icon"></van-icon>
                                        </div>
                                        <div class="title">
                                            <div class="flex">
                                                {{el.expenseType}}
                                                <van-tag v-if="el.zhbj == 1" plain type="primary"
                                                    style="zoom:.9;margin-left:5px">{{el.ywcj.mc}}</van-tag>
                                                <van-tag v-if="el.cfbs" :plain="el.cfbs ==2" type="success"
                                                    style="zoom:.9;margin-left:5px" >
                                                    {{el.cfbs==1? '拆分': '拆分子项'}}
                                                    </van-tag>
                                            </div>
                                            <small style="color:#aaa">{{el.zhbj == 1?el.wanlai_danwei.zhmc: ''}}</small>
                                        </div>
                                    </div>
                                    <div class="right">
                                        <div class="top" v-if="el.cfbs != 1"><small>¥</small> {{el.ywcj.id == 7186? '0.00' : el.money}}</div>
                                        <div class="top" v-if="el.cfbs == 1"><small>¥</small> {{el.zje - el.cfje | moneyFormat(2)}}</div>
                                        <div class="bottom" v-if="el.zje">总 <small>¥</small>{{el.zje | moneyFormat(2)}}</div>
                                        <div class="bottom">消费时间 {{el.expenseTime }}</div>
                                    </div>
                                </div>
                                <div class="duigong" v-if="el.zhbj == 1">
                                    <div class="cell">
                                        <van-icon name="points" color="#1989fa" />
                                        {{el.ywcj.id == 7184? '本期到票': el.ywcj.id == 7186 ?'核销金额':'未到票'}}:
                                        <span><small>¥</small>{{el.money}}</span>
                                    </div>
                                    <div class="cell">
                                        <van-icon name="calender-o" color="#1989fa" />
                                        {{el.ywcj.id == 7184?'到票日期': '预计到票'}}:
                                        <span>{{el.rq | date('yyyy-MM-dd')}}</span>
                                    </div>
                                </div>
                            </div>
                            <template #right>
                                <van-button style="height:100%" square text="编辑" type="info"
                                    @click="onItemClick(el,acc, true)" />
                                <van-button style="height:100%" square text="删除" type="danger"
                                    @click="onDelete(el.id)" />
                            </template>
                            <template #left>
                                <van-button style="height:100%" square text="复制" type="primary" />
                            </template>
                        </van-swipe-cell>
                        </transition-group>

                    </van-collapse-item>
                </van-collapse>
                <template #loading>
                   <van-loading type="spinner" size="24px" />
                </template>
                
            </van-list>
            <!-- </main> -->
        </van-pull-refresh>
        <!-- 底部保存 -->
        <div v-if="checkMode" class="van-tabbar--fixed bottom_saved_buttons">
            <div class="icon-button">
                <div class="icon">
                    <van-icon name="discount" />
                </div>
                <div class="label">分摊</div>
            </div>
            <div class="icon-button" @click="onSelectDelete">
                <div class="icon">
                    <van-icon name="delete" />
                </div>
                <div class="label">移除</div>
            </div>
            <div class="create-button">
                <van-button @click="onSave" native-type="button" type="info" borderless block>创建报销单
                </van-button>
            </div>
        </div>
        <!-- <transition name="van-slide-right">
            <div class="erji-view" v-if="isErjiRoute">
                <router-view></router-view>
            </div>
        </transition> -->
        <van-popup :overlay="false" v-model="isErjiRoute" position="right" :style="{ width: '100%',height:'100%' }"
        :lock-scroll="!isErjiRoute" 
         >
            <transition name="van-fade">
                <router-view></router-view>
            </transition>
        </van-popup>
    </div>
</template>
<script>
    import {
        account_get_list,
        bill_del_danju,
        bill_edit_get_danjuInfo
    } from 'api'
    import {
        dateFormat,
        dialogConfirm
    } from './../../utils/utils';
    import {
        mapGetters
    } from 'vuex'
    export default {
        name: 'account',
        data() {
            return {
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
                limit: 25,
                finished: false
            }
        },
        components: {
            filterOptionsPicker: ()=> import('./../../components/Account_FilterPicker')
        },
        watch: {
            checkMode(nVal, oVal) {
                this.onSelectAll(false);
            },
        },
        computed: {
            ...mapGetters({
                ywcjList: 'ywcjList'
            }),
            getYwcj() {
                if (this.filterOptions.ywcj == 0) return '全部';
                return this.ywcjList.find(el => el.id == this.filterOptions.ywcj).mc
            },
            isErjiRoute: {
                get() {
                    return this.$route.path.startsWith('/account/')
                },
                set(val) {}
            },
        },
        methods: {
            onRefreshView(){
                this.$route.meta.savedPosition = {x:0,y:0};
                this.$eventBus.$emit('refreshView');
            },
            onDelete: dialogConfirm(function(id){
                bill_del_danju(id).then(r => {
                    this.$toast.success('删除成功');
                    var i = this.rowList.findIndex(el => el.id == id);
                    if (i != -1) this.rowList.splice(i, 1);
                }).catch(e => e).finally(() => {
                    this.handleViewData();
                })
            }),
            onItemClick(el, acc, bool) {
                console.log(el.checked,acc,bool);
                if (this.checkMode) {
                    el.checked = !el.checked;
                } else {
                    if (bool) {
                        this.$router.push({
                            path: '/account/bill/edit',
                            query: {
                                edit_id: el.id,
                                from_route: this.$route.path
                            }
                        })
                    }
                }
            },

            // onSelectDelete() {
            //     this.$dialog.confirm({
            //         message: '确定要删除这些费用吗?',
            //         title: '删除',
            //     }).then(r => {
            //         this.accountList = this.accountList.map(el => {
            //             el.children = el.children.filter(c => !c.checked)
            //             return el;
            //         });
            //         this.checkMode = false;
            //     })
            //     bill_del_danju(id).then(r => {
            //         this.$toast.success('删除成功');
            //         var i = this.rowList.findIndex(el => el.id == id);
            //         if (i != -1) this.rowList.splice(i, 1);
            //     }).catch(e => e).finally(() => {
            //         this.handleViewData();
            //     })
            // },
            onSelectDelete: dialogConfirm(function(){
                // var id = el.children.filter(c => c.checked).map(el=>el.id);
                // console.log(id);
                var id = this.accountList.map(el => {
                    return el.children.filter(c => c.checked).map(ele=>ele.id).join(',');
                }).filter(el=>el.length)
                bill_del_danju(id.join(',')).then(r => {
                    this.$toast.success('删除成功');
                    id.forEach(el => {
                        var i = this.rowList.findIndex(ele => ele.id == el);
                        if (i != -1){
                            this.rowList.splice(i, 1)
                        };
                    })
                    this.checkMode = false;
                }).catch(e => e).finally(() => {
                    this.handleViewData();
                })
            }, { message: '确定要删除这些费用吗?', title: '删除', }),
            onSelectAll(tag) {
                this.accountList.forEach((acc) => {
                    acc.children.forEach((child) => {
                        child.checked = tag;
                    })
                })
                this.isSelectAll = tag;
            },
            confirmFilter(newFilter) {
                this.filterOptions = newFilter;
                this.refreshing = true;
                this.onRefresh();
            },

            handleViewData() {
                var data = this.rowList.reduce((t, ele) => {
                    var rq = this.filterOptions.sortable == 0? ele.zdrq : ele.rq;
                    var key = dateFormat(rq, 'yyyy-MM-dd');
                    t[key] ? t[key].children.push(ele) : (t[key] = {
                        title: key,
                        children: [ele]
                    });
                    return t;
                }, {});
                this.accountList = Object.values(data);
                this.activeNames = this.accountList.map((el, i) => i);
            },
            handleRowData(ele){
                ele.expenseType = ele.xflx.fylxmc;
                ele.money = Number(ele.je).toFixed(2);
                ele.checked = false;
                ele.expenseTime = dateFormat(ele.rq, 'MM-dd');
                ele.icon = ele.zhbj == 1? 'hotel-o' :'user-o';
                return ele;
            },
            onLoad() {
                this.getData();
            },
            onRefresh() {
                this.checkMode = false;
                this.page = 1;
                this.finished = false;
                this.loading = true;
                console.log('刷新中');
                this.getData().then(r => {
                    
                }).catch(e => {

                }).finally(() => {
                    this.refreshing = false
                })
            },
            getData() {
                var status = this.filterOptions.status;
                var group = this.filterOptions.sortable;
                var zhbj = this.filterOptions.publicType;
                if (this.refreshing) {
                    this.rowList = [];
                    this.accountList= [];
                    this.refreshing = false;
                }
                return account_get_list({
                    status,
                    group,
                    zhbj,
                    page: this.page,
                    limit: this.limit
                }).then(r => {
                    // if(r.data.length == 0){
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
            async silentCheck() {
                console.log('silent check');
                var del_id = this.$route.params.del_id;
                var update_id = this.$route.params.update_id;
                if (del_id >= 0) {
                    var i = this.rowList.findIndex(el => el.id == del_id);
                    if (i != -1) this.rowList.splice(i, 1);
                }
                if (update_id >= 0) {
                    var newData = await bill_edit_get_danjuInfo(update_id).then(r => this.handleRowData(r.data))
                    var i = this.rowList.findIndex(el => el.id == update_id);
                    if (i != -1) this.rowList.splice(i, 1, newData);
                }
                this.handleViewData();
            }
        },
        created() {
            
        },
        activated() {
            this.silentCheck();
            this.$nextTick(() => {
                if (this.$route.meta.savedPosition) {
                    window.scrollTo(0, this.$route.meta.savedPosition.y)
                }
            });
        }
    }
</script>
<style lang="less">
    .account_container {
        padding-bottom: 16vw;

        nav.nav-bar {
            padding: 5px 15px;
            background: white;
            min-height: 30px;
            position: sticky;
            top: 0;
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

            .account-item {
                padding: 5px 10px;
                .flex(@j: space-between);
                color: black;
                border-bottom: none;

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

        .bottom_saved_buttons {
            z-index: 100;
            .flex(@j: space-around);

            .common() {
                margin-bottom: 10px;
                user-select: none;
            }

            .icon-button {
                flex: 1;
                ;
                .flex(@d: column);
                .common();

                .label {
                    font-size: 12px;
                }

                .icon {
                    font-size: 24px;
                    ;
                }
            }

            .create-button {
                flex: 3.5;
                .common();
            }
        }
    }
</style>