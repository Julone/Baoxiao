
<template>
    <div class="wanlai-danwei-container" :style="{height: app_height +'px'}">
        <van-nav-bar title="选择开户银行" left-text="返回" left-arrow @click-left="$emit('closed')" />
        <div class="main-content" ref="mainContent">
            <div style="width: 100%">
                <van-search v-model="keyword" @input="onSearch()" placeholder="输入关键字查询" />
                <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad"
                    :error.sync="error" error-text="请求失败，点击重新加载">
                    <van-cell v-for="el in yh_list" :key="el.yhlb" clickable :is-link="false" :title="el.yhname"
                        @click="$emit('choose_khyh',el)" :label="el.khyh" />
                </van-list>
            </div>
        </div>
    </div>
</template>
<script>
    import {
        skzh_get_khyh
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

        computed: {
            ...mapGetters(['app_height']),
            yh_list(){
                return this.list.filter(el => el.yhname.includes(this.keyword))
            }
        },
        methods: {
            onLoad() {
                return skzh_get_khyh(this.keyword).then(r => {
                    if (r.errcode == 0) {
                        if (r.data.length > 0) {
                            var data = r.data.map(el => el);
                            this.list.push(...data);
                        } else {
                            this.finished = true;
                        }
                            this.finished = true;

                    } else {
                        this.error = true;
                    }
                }).catch(e => {
                    this.error = true;
                }).finally(() => {
                    this.loading = false;
                })
            },
            onSearch(){
                // this.list = [];
                // this.onLoad();
            }
        },
        created() {

        },
        async mounted(){
               await this.$nextTick()
            this.keyword = "";
            console.log(this.$refs.mainContent.scrollTop);
            this.$refs.mainContent.scrollTop = 0
        },

        async activated() {
            await this.$nextTick()
            this.keyword = "";
            console.log(this.$refs.mainContent.scrollTop);
            this.$refs.mainContent.scrollTop = 0
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
            overflow: auto;
        }

    }
</style>