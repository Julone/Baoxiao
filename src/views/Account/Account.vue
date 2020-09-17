<template>
    <div class="account_container savedPosition_container" :style="{height: appHeight +'px',overflow:'auto'}" ref="container" v-cloak>
        <van-nav-bar title="账本" />
        <nav class="nav-bar" v-if="!checkMode">
            <div class="left-item">
                <a class="blue-text" @click="checkMode = true">选择</a>
                <filterOptionsPicker :filterData="filterOptions" @confirmFilter="confirmFilter"></filterOptionsPicker>
            </div>
            <div class="right-item">
                <van-button borderless marginless @click="onRefreshView" size="small">
                    <big><van-icon class="blue-text" name="replay" /></big>
                </van-button>
                <van-button borderless marginless :to="{path: '/account/bill/add'}" size="small">
                    <big>
                        <van-icon class="blue-text" name="plus" /></big>
                </van-button>
            </div>
        </nav>
        <nav class="nav-bar" v-if="checkMode">
            <a class="blue-text" v-if="!isSelectAll" @click="onSelectAll(true)">全选</a>
            <a class="blue-text" v-if="isSelectAll" @click="onSelectAll(false)">取消全选</a>
            <a class="blue-text" @click="checkMode = false">取消</a>
        </nav>
        <van-pull-refresh v-model="refreshing" success-text="刷新成功" @refresh="onRefresh">
            <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad" :error.sync="error"
                error-text="请求失败，点击重新加载" :immediate-check="true">
                <van-collapse v-model="activeNames">
                    <van-collapse-item v-show="acc.children.length" v-for="(acc,index) in accountList" :key="acc.title"
                        :name="index" :title="acc.title">
                        <transition-group name="van-slide-left" enter-active-class="" mode="out-in">
                            <van-swipe-cell v-for="(el) in acc.children" :key="el.id" :disabled="checkMode">
                                <account-item @click.native="onItemClick(el,acc, true)" :checkMode="checkMode" :item="el"></account-item>
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
                <van-button @click="onCreateDanju" native-type="button" type="info" borderless block>创建报销单
                </van-button>
            </div>
        </div>
        <scrollTop dom=".savedPosition_container"></scrollTop>
        <van-popup class="popup-fullsize" v-model="isErjiRoute" position="right" :lock-scroll="false" :overlay="false">
            <transition leave-active-class="van-fade-leave-active">
                <router-view :style="{height:appHeight+'px'}" style="overflow-y: auto;" @account_async_update="account_async_update" ></router-view>
            </transition>
        </van-popup>
    </div>
</template>
<script>
    import {
        account_get_list,
        bill_del_feiyong,
        bill_get_feiyongInfo
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
                limit: 50,
                finished: false,
            }
        },
        components: {
            filterOptionsPicker: () => import('./../../components/Account_FilterPicker')
        },
        watch: {
            checkMode(nVal, oVal) {
                this.onSelectAll(false);
            },
            isErjiRoute:{
                immediate: true,
                handler(val){
                    if(val) {
                        document.body.classList.add('van-overflow-hidden');
                    }else{
                        document.body.classList.remove('van-overflow-hidden');
                    }
                }
            }
        },
        computed: {
            ...mapGetters({
                ywcjList: 'ywcjList',
                appHeight:'appHeight'
            }),
            getYwcj() {
                if (this.filterOptions.ywcj == 0) return '全部';
                return this.ywcjList.find(el => el.id == this.filterOptions.ywcj).mc
            },
            isErjiRoute: {
                get() {
                    return this.$route.path.startsWith('/account/')
                },
                set(val) {
                }
            },
        },
        methods: {
            onRefreshView() {
                this.$route.meta.savedPosition = {
                    x: 0,
                    y: 0
                };
                this.$eventBus.$emit('refreshView');
            },
            onDelete: dialogConfirm(function (id) {
                bill_del_feiyong(id).then(r => {
                this.$toast.success('删除成功');
                    var i = this.rowList.findIndex(el => el.id == id);
                    if (i != -1) this.rowList.splice(i, 1);
                }).catch(e => e).finally(() => {
                this.handleViewData();
                })
            }),
            onItemClick(el, acc, bool) {
                console.log(el.checked, acc, bool);
                if (this.checkMode) {
                    el.checked = !el.checked;
                } else {
                    if (bool) {
                        this.$router.push({
                            path: '/account/bill/add',
                            query: {
                                edit_id: el.id,
                                from_route: this.$route.path
                            }
                        })
                    }
                }
            },
            onSelectDelete: dialogConfirm(function () {
                var id = this.accountList.map(el => {
                    return el.children.filter(c => c.checked).map(ele => ele.id).join(',');
                }).filter(el => el.length)
                bill_del_feiyong(id.join(',')).then(r => {
                    this.$toast.success('删除成功');
                    id.forEach(el => {
                        var i = this.rowList.findIndex(ele => ele.id == el);
                        if (i != -1) {
                            this.rowList.splice(i, 1)
                        };
                    })
                    this.checkMode = false;
                }).catch(e => e).finally(() => {
                    this.handleViewData();
                })
            }, {
                message: '确定要删除这些费用吗?',
                title: '删除',
            }),
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
            onCreateDanju(){
                var selected = [];
                this.accountList.forEach((acc) => {
                    acc.children.forEach((child) => {
                        if(child.checked) {
                            selected.push(child.id)
                        }
                    })
                });
                console.log(selected);
                this.$router.push({path: '/bill/get_type', query: {fyList: selected.join(',')}})
            },
            handleViewData() {
                var data = this.rowList.reduce((t, ele) => {
                    var rq = this.filterOptions.sortable == 0 ? ele.zdrq : ele.rq;
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
            handleRowData(ele) {
                ele.expenseType = ele.xflx.fylxmc;
                ele.money = Number(ele.je).toFixed(2);
                ele.checked = false;
                ele.expenseTime = dateFormat(ele.rq, 'MM-dd');
                ele.icon = ele.zhbj == 1 ? 'hotel-o' : 'user-o';
                return ele;
            },
            onRefresh() {
                this.checkMode = false;
                this.page = 1;
                this.finished = false;
                this.loading = true;
                console.log('刷新中');
                this.onLoad().then(r => {
                }).catch(e => {
                }).finally(() => {
                    this.refreshing = false
                })
            },
            onLoad() {
                var status = this.filterOptions.status;
                var group = this.filterOptions.sortable;
                var zhbj = this.filterOptions.publicType;
                if (this.refreshing) {
                    this.rowList = [];
                    this.accountList = [];
                    this.refreshing = false;
                }
                return account_get_list({
                    status,
                    group,
                    zhbj,
                    page: this.page,
                    limit: this.limit
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
            async asyncDataCheck({del_id = '', edit_id = ''} = {}) {
                console.log('account_async_update');
                if (del_id != '') {
                    var arr = del_id.split(',');
                    await new Promise(res => {
                        arr.forEach(ele => {
                            var i = this.rowList.findIndex(el => el.id == ele);
                            if (i != -1) {
                                this.rowList.splice(i, 1);
                            }
                        })
                        setTimeout(()=>{
                            res('ok')
                        },700)
                    })            
                }
                if (edit_id != '') {
                    var newData = await bill_get_feiyongInfo(edit_id).then(r => this.handleRowData(r.data))
                    var i = this.rowList.findIndex(el => el.id == edit_id);
                    if (i != -1) this.rowList.splice(i, 1, newData);
                }
                this.handleViewData();
            },
            account_async_update(obj){
                this.$store.dispatch('appGoback').then(r=>{
                this.asyncDataCheck(obj);

                })
            }
        },
        created() {
            // this.$eventBus.$on('account_async_update', (obj) => {
            //     this.asyncDataCheck(obj);
            //     this.$store.dispatch('appGoback');
            // })
        },
        activated() {
            this.$nextTick(() => {
                if (this.$route.meta.savedPosition) {
                    var t = this.$refs.container;
                    this.$scrollTopTo(t, this.$route.meta.savedPosition.y, 0)
                }
            });
        }
    }
</script>
<style lang="less">
    .account_container {
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
            padding-bottom: 15vw;
            .van-collapse-item {
                &>.van-collapse-item__title {
                    background: #ecf3fa;
                    padding: 10px 20px;
                }
            }
            .van-collapse-item__content {
                padding: 0;
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