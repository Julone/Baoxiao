<template>
    <div class="wanlai-danwei-container" :style="{height: app_height +'px'}">
        <van-nav-bar title="部门选择" left-text="返回" left-arrow @click-left="$store.dispatch('appGoback')" />
        <div class="main-content">
            <div style="width: 100%">
                <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad"
                    :error.sync="error" error-text="请求失败，点击重新加载">
                    <van-cell v-for="el in list" :key="el.id" clickable is-link :title="el.name"
                        @click="$emit('select_dept',el)" :label="el.khyh" />
                </van-list>
            </div>
        </div>
    </div>
</template>
<script>
    import {
        bill_get_department
    } from 'api'
    import {
        mapGetters
    } from 'vuex'

    export default {
        data() {
            return {
                list: [],
                loading: false,
                finished: false,
                page: 1,
                limit: 50,
                error: false
            }
        },

        computed: {
            curTypeList() {
                return this.typeList[this.activeKey]
            },
            ...mapGetters(['app_height'])
        },
        methods: {
            onLoad() {
                return bill_get_department({
                    page: this.page,
                    limit: this.limit
                }).then(r => {
                    if (r.errcode == 0) {
                        if (r.data.length > 0) {
                            var data = r.data.map(el => el);
                            this.list.push(...data);
                            this.page = this.page + 1;
                        } else {
                            this.finished = true;
                        }
                    } else {
                        this.error = true;
                    }
                }).catch(e => {
                    this.error = true;
                }).finally(() => {
                    this.loading = false;
                })
            }
        },
        created() {

        },

        activated() {

        },
    }
</script>
<style lang="less">
    .wanlai-danwei-container {
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