<template>
    <div class="account_container" ref="container">
        <van-nav-bar title="账本" />
        <nav class="nav-bar" v-if="!checkMode">
            <div class="left-item">
                <a class="blue-text" @click="checkMode = true">选择</a>
                <div class="gray-btn-group" @click="onDrop">
                    <span>{{ cur_label('status') }}</span>
                    <span>{{ cur_label('sortable') }}</span>
                    <span>{{ cur_label('publicType')}}
                        <van-icon name="arrow-down" /></span>
                </div>
                <van-popup v-model="showDrop" position="bottom">
                    <van-form class="filter-form">
                        <!-- {{filterOptions}} -->
                        <van-field name="radio" label="状态">
                            <template #input>
                                <van-radio-group v-model="filterOptions.status" direction="horizontal">
                                    <van-radio v-for="o in filterOptionsLabel.status" :key="o.id" :name="o.id">
                                        {{o.label}}</van-radio>
                                </van-radio-group>
                            </template>
                        </van-field>
                        <van-field name="radio" label="排序分组">
                            <template #input>
                                <van-radio-group v-model="filterOptions.sortable" direction="horizontal">
                                    <van-radio v-for="o in filterOptionsLabel.sortable" :key="o.id" :name="o.id">
                                        {{o.label}}</van-radio>
                                </van-radio-group>
                            </template>
                        </van-field>
                        <van-field :border="false" name="radio" label="对公对私">
                            <template #input>
                                <van-radio-group v-model="filterOptions.publicType" direction="horizontal">
                                    <van-radio style="padding:10px;" v-for="o in filterOptionsLabel.publicType"
                                        :key="o.id" :name="o.id">
                                        {{o.label}}
                                    </van-radio>
                                </van-radio-group>
                            </template>
                        </van-field>
                        <div class="bottom_btn">
                            <van-button @click="resetForm">重置</van-button>
                            <van-button @click="confirmForm" type="info">确定</van-button>
                        </div>
                    </van-form>

                </van-popup>
            </div>
            <div class="right-item">
                <van-button borderless marginless @click="$eventBus.$emit('refreshView')" size="small">
                    <big> <van-icon class="blue-text" name="replay" /></big>
                </van-button>
                <van-button borderless marginless :to="{name: 'bill_add'}" size="small">
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
            <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad" :error.sync="error"
                error-text="请求失败，点击重新加载" :immediate-check="true">
                <van-collapse v-model="activeNames" v-if="accountList.length > 0">
                    <van-collapse-item v-show="acc.children.length" v-for="(acc,index) in accountList" :key="index"
                        :name="index" :title="acc.title">
                        <van-swipe-cell v-for="(el,i) in acc.children" :key="i" :disabled="checkMode">
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
                                                    style="zoom:.8;margin-left:5px">对公</van-tag>
                                            </div>
                                            <small style="color:#aaa">{{el.wanlai_danwei.zhmc}}</small>
                                        </div>
                                    </div>
                                    <div class="right">
                                        <div class="top"><small>¥</small>{{el.money}}</div>
                                        <div class="bottom">消费时间 {{el.expenseTime }}</div>
                                    </div>
                                </div>
                                <div class="duigong" v-if="el.zhbj == 1">
                                    <div class="cell">
                                        <van-icon name="points" color="#1989fa" />
                                        {{el.ywcj.id == 7184? '本期到票': '未到票'}}:
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
                    </van-collapse-item>
                </van-collapse>
                <!-- <div style="height:400px" v-else></div> -->

                <div v-if="!loading && !refreshing && !error &&  accountList.length == 0"
                    class="flex marginTop marginBottom" style="padding:0 0 400px;">
                    <van-empty description="暂无消费记录" />
                </div>
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
        <!-- <van-popup :overlay="false" v-model="isErjiRoute" position="right" :style="{ width: '100%',height:'100%' }" >
            <transition name="van-fade">
                <router-view></router-view>
            </transition>
        </van-popup> -->
    </div>
</template>
<script>
    import {
        account_get_list,
        bill_del_danju,
        bill_edit_get_danjuInfo
    } from 'api'
    import {
        dateFormat
    } from './../../utils/utils';
    import {
        mapGetters
    } from 'vuex'
    export default {
        data() {
            return {
                refreshing: false,
                loading: false,
                error: false,
                showDrop: false,
                filterOptions: {
                    status: 0,
                    sortable: 1,
                    publicType: 0
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
                    ],
                    publicType: [{
                            id: 0,
                            label: '全部'
                        },
                        {
                            id: 1,
                            label: '对公'
                        }, {
                            id: 2,
                            label: '对私'
                        }
                    ]
                },
                accountList: [],
                activeNames: [],
                checkMode: false,
                isSelectAll: false,
                rowList: [],
                page: 1,
                limit: 3,
                finished: false
            }
        },
        watch: {
            checkMode(nVal, oVal) {
                this.onSelectAll(false);
            }
        },
        computed: {
            cur_label() {
                return function (group) {
                    return this.filterOptionsLabel[group].find(el => el.id == this.filterOptions[group]).label
                }
            },
            ...mapGetters({
                ywcjList: 'ywcjList'
            }),
            getYwcj() {
                if (this.filterOptions.ywcj == 0) return '全部';
                return this.ywcjList.find(el => el.id == this.filterOptions.ywcj).mc
            },
            isErjiRoute: {
                get() {
                    return this.$route.name != 'account'
                },
                set() {}
            },
        },
        methods: {
            onDelete(id) {
                this.$dialog.confirm({
                        title: '删除',
                        message: '是否删除?',
                    })
                    .then(() => {
                        return bill_del_danju(id).then(r => {
                            this.$toast.success('删除成功');
                            // this.silentCheck();
                            var i = this.rowList.findIndex(el => el.id == id);
                            if (i != -1) this.rowList.splice(i, 1);
                        }).catch(e => e).finally(() => {
                            this.handleData();
                        })
                    })
                    .catch(() => {
                        // on cancel
                    });
            },

            onItemClick(el, acc, bool) {
                if (this.checkMode) {
                    el.checked = !el.checked;
                } else {
                    if (bool) {
                        this.$router.push({
                            path: '/bill/edit',
                            query: {
                                dj_id: el.id,
                                from_route: this.$route.name
                            }
                        })
                    }
                }
            },
            onDrop() {
                this.showDrop = true;
            },
            onSelectDelete() {
                this.$dialog.confirm({
                    message: '确定要删除这些费用吗?',
                    title: '删除',
                }).then(r => {
                    this.accountList = this.accountList.map(el => {
                        el.children = el.children.filter(c => !c.checked)
                        return el;
                    });
                    this.checkMode = false;
                })
            },
            onSave() {},
            onSelectAll(tag) {
                this.accountList.forEach((acc) => {
                    acc.children.forEach((child) => {
                        child.checked = tag;
                    })
                })
                this.isSelectAll = tag;
            },
            resetForm() {
                this.filterOptions = this.$options.data().filterOptions
            },
            confirmForm() {
                this.showDrop = false
                this.getData();
            },

            handleData() {
                var data = this.rowList.reduce((t, ele) => {
                    ele.expenseType = ele.xflx.fylxmc;
                    ele.money = Number(ele.je).toFixed(2);
                    ele.checked = false;
                    ele.expenseTime = dateFormat(ele.rq, 'MM-dd');
                    ele.icon = 'balance-o';
                    var key = dateFormat(ele.rq, 'yyyy-MM-dd');
                    t[key] ? t[key].children.push(ele) : (t[key] = {
                        title: key,
                        children: [ele]
                    });
                    return t;
                }, {});
                this.accountList = Object.values(data);
                this.activeNames = this.accountList.map((el, i) => i);
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
                    this.rowList.push(...r.data);
                    this.handleData();
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
                    var newData = await bill_edit_get_danjuInfo(update_id).then(r => r.data)
                    var i = this.rowList.findIndex(el => el.id == update_id);
                    if (i != -1) this.rowList.splice(i, 1, newData);
                }
                this.handleData();
            }
        },
        created() {
            // this.getData();
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

            .gray-btn-group {
                display: inline-block;
                font-size: 12px;
                padding: 5px;
                background: rgb(241, 241, 241);
                margin-left: 20px;

                span {
                    margin: 0 5px;
                }
            }
        }

        .filter-form {
            .van-cell {
                flex-direction: column;
            }

            .van-cell__title.van-field__label {
                font-size: 80%;
            }

            .bottom_btn {
                .flex(@j: space-between);
                padding: 10px;

                .van-button {
                    height: 30px;
                    width: auto;
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
                    width: 90%;
                    padding: 2.66667vw;
                    .flex(@j: space-between; );
                    box-sizing: border-box;
                    float: right;
                    font-size: .8em;
                    border-top: 1px solid rgba(128, 128, 128, 0.143);
                    padding-left: 20px;

                    .cell {
                        .flex();

                        &>i {
                            margin-right: 4px;
                            ;
                        }

                        &>span {
                            margin-left: 5px;
                            ;
                        }

                        // letter-spacing: 1px;
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