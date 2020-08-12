<template>
    <div class="expense-type-container" :style="{height: app_height +'px'}">
        <van-nav-bar title="费用类型" left-text="返回" left-arrow @click-left="$store.dispatch('appGoback')">
            <template #right>
                <van-icon name="search" @click="showSearch =!showSearch" size="18" />
            </template>
        </van-nav-bar>
        <van-search v-model="qs" v-if="showSearch" placeholder="请输入搜索关键词" @search="onSearch" @input="onSearch" />
        <div class="recent-pick">
            <div class="title">最近使用</div>
            <div class="content">
                <template v-if="recentList.length > 0">
                 <van-tag plain v-for="el in recentList" :key="el.id" @click="onTypeClick(el)" size="medium">
                    {{el.fylxmc}}</van-tag>
                </template>
                <van-divider v-else>暂无数据</van-divider>
                
            </div>
        </div>

        <div class="main-content" v-if="!qs">
            <van-sidebar v-model="activeKey">
                <van-sidebar-item v-for="el in slidebar" :key="el" :title="el" />
            </van-sidebar>
            <div class="side-right">
                <van-cell v-for="el in curTypeList" :key="el.id" @click="onTypeClick(el)" :title="el.fylxmc"
                    :class="{isSelected: selectedItem.id == el.id}">
                    <template #right-icon class="flex">
                        <van-icon name="success" style="top:1.5vw" v-if="selectedItem.id == el.id" />
                        <div style="margin-left: 10px;">
                            <van-tag plain type="primary" v-if="el.dgbs == 0">个人</van-tag>
                            <van-tag plain type="warning" v-if="el.dgbs == 1">对公</van-tag>
                            <van-tag plain type="success" v-if="el.dgbs == 2">全部</van-tag>
                        </div>
                    </template>
                </van-cell>
            </div>
        </div>
        <div class="main-content" v-if="qs">
            <div style="width:100%;height: 100%; overflow: auto;">
                <van-cell v-for="el in queryList" :key="el.id" @click="onTypeClick(el)" :title="el.fylxmc"
                    :class="{isSelected: selectedItem.id == el.id}">
                    <template #right-icon class="flex">
                        <van-icon name="success" style="top:1.5vw" v-if="selectedItem.id == el.id" />
                        <div style="margin-left: 10px;">
                            <van-tag plain type="primary" v-if="el.dgbs == 0">个人</van-tag>
                            <van-tag plain type="warning" v-if="el.dgbs == 1">对公</van-tag>
                            <van-tag plain type="success" v-if="el.dgbs == 2">个人/对公</van-tag>
                        </div>
                    </template>
                </van-cell>
            </div>

        </div>
    </div>
</template>
<script>
    import {
        bill_get_expense_type
    } from 'api'
    import {
        mapGetters
    } from 'vuex';
    import {
        getStorage,
        setStorage
    } from './../../utils/storage'

    export default {
        data() {
            return {
                slidebar: [],
                typeList: [],
                activeKey: 0,
                selectedItem: {},
                recentList: getStorage({
                    name: 'recent-xflx-list'
                }) || [],
                qs: '',
                queryList: [],
                rowList: [],
                showSearch: true
            }
        },
        props: ['formdata'],
        computed: {
            curTypeList() {
                return this.typeList[this.activeKey]
            },
            ...mapGetters(['app_height'])
        },
        methods: {
            onSearch() {
                this.queryList = []
                this.queryList = this.rowList.reduce((t, el) => {
                    if (el.fylxmc.includes(this.qs)) {
                        t.push(el);
                    }
                    return t;
                }, []);;
            },

            onTypeClick(el) {
                this.$emit('chooseXflx', el);
                var l = getStorage({
                    name: 'recent-xflx-list'
                });
                if (l) {
                    var index = l.findIndex(i => i.id == el.id);
                    if (index != -1) {
                        l.splice(index, 1)
                    }
                    l.unshift(el);
                    setStorage({
                        name: 'recent-xflx-list',
                        content: l
                    });
                } else {
                    setStorage({
                        name: 'recent-xflx-list',
                        content: [el]
                    })
                }
            }
        },
        created() {
            console.log(this.formdata);
            this.selectedItem = {
                ...this.formdata.xflx
            }
            bill_get_expense_type().then(r => {
                this.rowList = r.data;
                var a = r.data.reduce((t, el) => {
                    var key = el.fydlmc;
                    if (el.id == this.selectedItem.id) {
                        this.activeKey = key;
                    }
                    t[key] ? (t[key].push(el)) : (t[key] = [el]);
                    return t;
                }, {});
                this.slidebar = Object.keys(a);
                this.typeList = Object.values(a);
                if (this.activeKey != 0) {
                    this.activeKey = this.slidebar.findIndex(el => el == this.activeKey);
                }
            })
        }
    }
</script>
<style lang="less">
    .expense-type-container {
        // .flex(@d:column;@j:space-around);
        height: 100vh;
        display: flex;
        overflow: hidden;
        flex-direction: column;
        background: white;

        .van-nav-bar {
            flex: none;
        }

        .recent-pick {
            height: 90px;
            flex: none;
            padding: 7px 10px 10px;
            box-sizing: border-box;
            border-bottom: 1px solid #ebedf0;
            border-top: 1px solid #ebedf0;

            .title {
                color: gray;
                font-size: 10px;
                 margin-bottom: 6px;
                font-weight: 700;
            }

            .content {
                overflow: hidden;
                height: 55px;
                padding: 1px;
            }

            .van-tag {
                margin-right: 5px;
                margin-bottom: 7px;
            }
        }

        .main-content {
            .flex(@a: strech; @j: space-between);
            flex: 1;
            // height: 100%;
            overflow: hidden;

            .van-sidebar {
                width: 100px;
            }

            .side-right {
                width: calc(100vw - 100px);
                height: 100%;
                overflow-y: scroll;

                .van-cell__title {
                    padding-left: 10px;
                }

                .isSelected {
                    color: red
                }
            }

        }

    }
</style>