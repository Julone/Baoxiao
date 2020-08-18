<template>
    <div class="danju-type-container" >
        <van-nav-bar title="请选择单据类型" left-text="返回" left-arrow @click-left="$store.dispatch('appGoback')" />
        <div class="main-content">
            <van-collapse v-model="activeCollpase" style="width:100%">
                <van-collapse-item v-for="el in collapseList" :key="el.title" :title="el.title" :name="el.id">
                    <van-cell v-for="d in el.children" :key="d.id" :to="{name: 'bill_get_new', query:{id: d.id}}"
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
        mapGetters,
        mapState
    } from 'vuex'

    export default {
        data() {
            return {
                activeCollpase: [],
                // collapseList: []
            }
        },
        computed: {
            ...mapState({
                collapseList: state => state.bill_get.danju_type
            }),
            ...mapGetters(['bill_get_type']),
        },
        methods: {
            

        },

  
        created() {
            console.log(this.bill_get_type(1001));
            // this.collapseList = [
            // ];
            this.activeCollpase = this.collapseList.map(el=>el.id);
        }
    }
</script>
<style lang="less">
    .danju-type-container {
        // .flex(@d:column;@j:space-around);
        height: 100%;
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