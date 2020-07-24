<template>
    <div class="container" :style="{height: app_height +'px'}">
        <van-nav-bar title="选取借款单" left-text="返回" left-arrow @click-left="$store.dispatch('appGoback')" />
        <div class="main-content">
            <van-empty>
                暂无数据
            </van-empty>
        </div>
    </div>
</template>
<script>
    import {
        bill_get_ywcj
    } from 'api'
    import {
        mapGetters
    } from 'vuex'

    export default {
        data() {
            return {
                activeCollpase: ['1'],
                collapseList: []
            }
        },
        computed: {
            ...mapGetters(['app_height'])
        },
    
        created() {
   
          
        }
    }
</script>
<style lang="less">
    .container {
        height: 100vh;
        display: flex;
        overflow: hidden;
        flex-direction: column;
        background: white;
        .van-nav-bar {
            flex: none;
        }

        .main-content {
            .flex(@a: strech; @j: center);
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