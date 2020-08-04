<template>
    <div class="shenpi_container">
        <van-nav-bar title="审批" />
        <nav class="nav-bar">
            <div class="left-item">
                <div class="gray-btn-group" @click="onDrop">
                    <span>未报销</span>
                    
                        <van-icon name="arrow-down" />
                </div>
                <van-popup v-model="showDrop" position="bottom">
                    <van-form class="filter-form">
                        <!-- {{filterOptions}} -->
                        <van-field name="radio" label="状态">
                            <template #input>
                                <van-radio-group v-model="filterOptions.status" direction="horizontal">
                                    <van-radio :name="0">未报销</van-radio>
                                    <van-radio :name="1">已报销</van-radio>
                                    <van-radio :name="2">已移除</van-radio>
                                </van-radio-group>
                            </template>
                        </van-field>
                        <van-field name="radio" label="排序分组">
                            <template #input>
                                <van-radio-group v-model="filterOptions.sortable" direction="horizontal">
                                    <van-radio :name="0">创建时间</van-radio>
                                    <van-radio :name="1">消费时间</van-radio>
                                    <van-radio :name="2">费用类型</van-radio>
                                </van-radio-group>
                            </template>
                        </van-field>
                        <van-field :border="false" name="radio" label="业务场景">
                            <template #input>
                                <van-radio-group v-model="filterOptions.ywcj" direction="horizontal">
                                    <van-radio :name="0">全部</van-radio>
                                    <van-radio :name="1">个人</van-radio>
                                    <van-radio :name="2">对公</van-radio>
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
                <van-button marginless :type="mode=='sp'? 'info':'default'" size="small" @click="mode='sp'">
                    审批
                </van-button>
                <van-button marginless :type="mode=='cs'? 'info':'default'" size="small" @click="mode='cs'">
                    抄送
                </van-button>
            </div>
        </nav>
        <van-divider marginless></van-divider>
        <van-search v-model="qs" placeholder="请输入搜索关键词" @search="onSearch" :show-action="isFocus" 
        @focus="isFocus=true" @blur="isFocus=false" @cancel="isFocus=false"/>
        <van-divider marginless></van-divider>
        
        
        <main v-show="mode == 'sp'">
            <van-empty>
                暂无待审批单据
            </van-empty>
        </main>


        <main v-show="mode == 'cs'">
            <van-empty>
                暂无抄送
            </van-empty>
        </main>
  

    </div>
</template>
<script>
    export default {
        data() {
            return {
                showDrop: false,
                filterOptions: {
                    status: 0,
                    sortable: 1,
                    ywcj: 0
                },
                qs: '',
                isFocus: false,
                mode: 'sp'
            }
        },
        watch: {
            checkMode(nVal, oVal) {
                this.onSelectAll(false);
            }
        },
        methods: {
            onSearch(){
                
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
            getData() {
                this.accountList = [{
                        title: '2020-07-15',
                        sortType: 1,
                        children: [{
                                id: 23424,
                                expenseType: '运输费',
                                money: '3.00',
                                expenseTime: '2020/07/15',
                                icon: 'logistics',
                                checked: false
                            },
                            {
                                id: 23424,
                                expenseType: '运输费',
                                money: '3.00',
                                expenseTime: '2020/07/15',
                                icon: 'logistics',
                                checked: false
                            },
                            {
                                id: 23424,
                                expenseType: '运输费',
                                money: '3.00',
                                expenseTime: '2020/07/15',
                                icon: 'logistics',
                                checked: false
                            }
                        ]
                    },
                    {
                        title: '2020-07-14',
                        sortType: 1,
                        children: [{
                                id: 23424,
                                expenseType: '运输费',
                                money: '3.00',
                                expenseTime: '2020/07/15',
                                icon: 'logistics',
                                checked: false
                            },
                            {
                                id: 23424,
                                expenseType: '运输费',
                                money: '3.00',
                                expenseTime: '2020/07/15',
                                icon: 'logistics',
                                checked: false
                            },

                        ]
                    }
                ]

                console.log(this.accountList);
                this.activeNames = this.accountList.map((el, i) => i)
            }
        },
        created() {
            this.getData();
        }
    }
</script>
<style lang="less">
    .shenpi_container {
        nav.nav-bar {
            padding: 5px 15px;
            background: white;
            min-height: 30px;
            .flex(@j: space-between);

            .gray-btn-group {
                display: inline-block;
                font-size: 12px;
                padding: 8px;
                background: rgb(241, 241, 241);

                span {
                    margin: 0 5px;
                }
            }
            .right-item{
                .van-button{
                    width: 60px;
                    zoom:.94;
                }
            }
        }

        .filter-form {

            // padding-bottom:30px;
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

        main {
            .van-collapse-item {
                &>.van-collapse-item__title {
                    background: #f1f1f1;
                    padding: 4px 20px;
                }
            }

            .van-collapse-item__content {
                padding: 0;
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
                        border: 1px solid rgb(100, 170, 255);
                        width: 30px;
                        color: rgb(100, 170, 255);
                        height: 30px;
                        border-radius: 100px;
                        .flex();
                        margin-right: 10px;
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