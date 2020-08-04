<template>
    <div class="expense-type-container" :style="{height: app_height +'px'}">
        <van-nav-bar title="费用类型" left-text="返回" left-arrow @click-left="$store.dispatch('appGoback')" />
        <div class="main-content">
            <van-sidebar v-model="activeKey">
                <van-sidebar-item v-for="el in slidebar" :key="el" :title="el" />
            </van-sidebar>
            <div class="side-right">
                <van-cell v-for="el in curTypeList" :key="el.id" @click="$emit('chooseXflx',el)" :title="el.fylxmc"
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
    } from 'vuex'

    export default {
        data() {
            return {
                slidebar: [],
                typeList: [],
                activeKey: 0,
                selectedItem: {}
            }
        },
        props: ['formdata'],
        computed: {
            curTypeList() {
                return this.typeList[this.activeKey]
            },
            ...mapGetters(['app_height'])
        },

        created() {
            console.log(this.formdata);
            this.selectedItem = {
                ...this.formdata.xflx
            }
            bill_get_expense_type().then(r => {
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

        .main-content {
            .flex(@a: strech; @j: space-between);
            flex: 1;
            height: 100%;

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