<template>
    <div class="container" :style="{height: app_height +'px'}">
        <van-nav-bar title="核销历史未到票费用" left-text="返回" left-arrow @click-left="$store.dispatch('appGoback')" />
        <div class="main-content">
            <div style="width: 100%">
                <van-cell v-for="el in list" :key="el.id" clickable is-link :title="el.zhmc"
                    @click="$emit('chooseWldw',el)" :label="el.khyh" />
            <van-empty v-if="list.length == 0">暂无数据</van-empty>

            </div>

        </div>
    </div>
</template>
<script>
    import {
        bill_get_hexiao
    } from 'api'
    import {
        mapGetters
    } from 'vuex'

    export default {
        data() {
            return {
                list: [],
                wdpje: this.formdata.wdpje,
                zhmc: this.formdata.wanlai_danwei.zhmc
            }
        },
        props: ['formdata'],

        computed: {
            curTypeList() {
                console.log(this.typeList);
                return this.typeList[this.activeKey]
            },
            ...mapGetters(['app_height'])
        },

        created() {
            bill_get_hexiao({wdpje: this.wdpje,zhmc:this.zhmc}).then(r => {
                if (r.errcode == 0 && r.data.length) {
                    this.list = r.data.map(el => el)

                }
            })
            console.log(this.$route);
        },
    }
</script>
<style lang="less">
    .container {
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
            .flex(@a: strech);
            flex: 1;
            height: 100%;
            overflow: scroll;
        }

    }
</style>