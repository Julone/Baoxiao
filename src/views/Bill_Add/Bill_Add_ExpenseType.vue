<template>
    <div class="expense-type-container" :style="{height: app_height +'px'}">
        <van-nav-bar title="费用类型" left-text="返回" left-arrow @click-left="$store.dispatch('appGoback')" />
        <div class="sklafjal">
            <van-sidebar v-model="activeKey">
                <van-sidebar-item v-for="el in slidebar" :key="el" :title="el" />
            </van-sidebar>
            <div class="side-right">
                <van-cell v-for="el in curTypeList" :key="el.id" is-link @click="$emit('chooseXflx',el)"
                    :title="el.fylxmc" />
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
            }
        },
        computed: {
            curTypeList() {
                return this.typeList[this.activeKey]
            },
            ...mapGetters(['app_height'])
        },
    
        created() {
            bill_get_expense_type().then(r => {
                var a = r.data.reduce((t, el) => {
                    var key = el.fydlmc;
                    t[key] ? (t[key].push(el)) : (t[key] = [el])
                    return t;
                }, {});
                this.slidebar = Object.keys(a);
                this.typeList = Object.values(a);
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

        .van-nav-bar {
            flex: none;
        }

        .sklafjal {
            .flex(@a: strech; @j: space-between);
            flex: 1;
            height: 100%;

            .van-sidebar {
                width: 100px;
            }

            .side-right {
                width: calc(100vw - 100px);
                height: 100%;
                overflow-y: auto;

                .van-cell__title {
                    padding-left: 10px;
                }
            }

        }

    }
</style>