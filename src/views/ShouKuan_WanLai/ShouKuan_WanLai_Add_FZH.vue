
<template>
    <div class="wanlai-danwei-container" :style="{height: app_height +'px'}">
        <van-nav-bar title="选择分支行" left-text="返回" left-arrow @click-left="$emit('closed')" />
        <div class="main-content">
            <div style="width: 100%">
                <van-search v-model="keyword" @input="onSearch()" placeholder="输入关键字查询" />
                <van-list v-model="loading" :finished="finished" finished-text="暂无数据" @load="onLoad"
                    :error.sync="error" error-text="请求失败，点击重新加载" :immediate-check="false">
                    <van-cell v-for="el in list" :key="el.id" clickable :is-link="false" :title="el.khyh"
                        @click="$emit('choose_fzh',el)" :label="el.yhhh" />
                </van-list>
            </div>
        </div>
    </div>
</template>
<script>
    import {
        skzh_get_fzh
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
                error: false,
                keyword: ''
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
            onLoad() {
                var yhlb = this.formdata.khyh.yhlb;
                var khss = this.formdata.khss.shi;
                var keyword = this.keyword;
                return skzh_get_fzh(yhlb,khss, keyword).then(r => {
                    if (r.errcode == 0) {
                            var data = r.data.map(el => el);
                            this.list = data;
                    } else {
                        this.error = true;
                    }
                }).catch(e => {
                    this.error = true;
                }).finally(() => {
                    this.loading = false;
                    this.finished = true;
                })
            },
            onSearch(){
                this.list = [];
                this.onLoad();
            }
        },
        created() {
            // this.onLoad();
        },
        activated() {
            this.onLoad();
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