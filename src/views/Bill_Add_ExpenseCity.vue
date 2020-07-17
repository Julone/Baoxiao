<template>
    <div class="expense-type-container" :style="{height: app_height +'px'}">
        <van-nav-bar title="消费城市" left-text="返回" left-arrow @click-left="$store.dispatch('appGoback')" />
        <div class="sklafjal">
            <!-- <van-sidebar v-model="activeKey">
                <van-sidebar-item v-for="el in slidebar" :key="el" :title="el" />
            </van-sidebar>
            <div style="width: calc(100vw - 85px);height:100%;overflow-y:auto">
                <van-cell v-for="el in curTypeList" :key="el.id" :title="el.fylxmc" value="内容" />
            </div> -->
            实现中...
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
                innerHeight: 0
            }
        },
        computed: {
            curTypeList() {
                console.log(this.typeList);
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
        },
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
            .flex(@a: strech;@j:space-between);
            flex: 1;
            height: 100%;
            overflow-y: auto;
            
        }

    }
</style>