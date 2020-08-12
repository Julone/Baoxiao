<template>
    <div class="wanlai-danwei-container" :style="{height: app_height +'px'}">
        <van-nav-bar title="往来单位" left-text="返回" left-arrow @click-left="$store.dispatch('appGoback')">
            <template #right>
                <van-button @click="show_wldw = false" icon="plus" size="small" bgless borderless>添加</van-button>
            </template>
        </van-nav-bar>
        <div class="main-content">
            <div w100 v-if="list.length > 0">
                <van-cell v-for="el in list" :key="el.id" clickable is-link :title="el.zhmc"
                    @click="$emit('chooseWldw',el)" :label="el.khyh" />
            </div>
            <van-empty v-else description="暂无数据"></van-empty>
        </div>
          <van-popup :overlay="false" v-model="show_wldw" position="right" :style="{ width: '100%',height:'100%' }">
            <transition name="van-fade">
                <wanlai-danwei></wanlai-danwei>
            </transition>
        </van-popup>
    
    </div>
</template>
<script>
    import {
        bill_get_expense_wldw
    } from 'api'
    import {
        mapGetters
    } from 'vuex'

    export default {
        data() {
            return {
                list: [],
                show_wldw: false
            }
        },
        components: {
            wanlaiDanwei:()=>import('./../../views/Bill_Get/Bill_Get_ShouKuanZH_Add')
        },

        computed: {
            curTypeList() {
                console.log(this.typeList);
                return this.typeList[this.activeKey]
            },
            ...mapGetters(['app_height'])
        },

        created() {
            bill_get_expense_wldw().then(r => {
                if (r.errcode == 0 && r.data.length) {
                    this.list = r.data.map(el => el)
                }
            })
        },
    }
</script>
<style lang="less">
    .wanlai-danwei-container {
        // .flex(@d:column;@j:space-around);
        // height: 100vh;
        display: flex;
        overflow: hidden;
        flex-direction: column;
        background: white;

        .van-nav-bar {
            flex: none;
        }

        .main-content {
            .flex(@a: strech);
            flex: 1;
            height: 100%;
            overflow: auto;
        }

    }
</style>