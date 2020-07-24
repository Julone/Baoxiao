<template>
    <div class="danju-type-container" :style="{height: app_height +'px'}">
        <van-nav-bar title="请选择单据类型" left-text="返回" left-arrow @click-left="$store.dispatch('appGoback')" />
        <div class="main-content">
            <van-collapse v-model="activeCollpase" style="width:100%">
                <van-collapse-item v-for="el in collapseList" :key="el.title" :title="el.title" :name="el.id">
                    <van-cell v-for="d in el.children" :key="d.id" :to="{name: 'bill_get_new', query:{djlx: d.id}}"
                        is-link>
                        <van-button type="info" size="mini" icon="balance-list-o"></van-button>
                        {{d.mc}}
                    </van-cell>
                </van-collapse-item>
            </van-collapse>
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
                activeCollpase: [],
                collapseList: []
            }
        },
        computed: {
            ...mapGetters(['app_height'])
        },

        created() {
            this.collapseList = [{
                    title: '申请及借款',
                    id: 1,
                    children: [{
                            id: 234,
                            mc: '通用报销单'
                        },
                        {
                            id: 2334,
                            mc: '差旅费报销单'
                        }
                    ]
                }, {
                    title: '个人报销及还款',
                    id: 2,
                    children: [{
                            id: 234,
                            mc: '通用报销单'
                        },
                        {
                            id: 2334,
                            mc: '差旅费报销单'
                        }, {
                            id: 24,
                            mc: '话费报销单'
                        }, {
                            id: 23334,
                            mc: '还款单'
                        },
                        {
                            id: 323,
                            mc: '固定资产/低耗及装修报销单'
                        },
                    ]
                }
            ];
            this.activeCollpase = this.collapseList.map(el=>el.id);
        }
    }
</script>
<style lang="less">
    .danju-type-container {
        // .flex(@d:column;@j:space-around);
        height: 100vh;
        display: flex;
        overflow: hidden;
        flex-direction: column;

        .van-nav-bar {
            flex: none;
        }

        .main-content {
            .van-collapse-item__content {
                padding: 0
            }

        }

    }
</style>