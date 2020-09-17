<template>
    <div class="danju-type-container" >
        <van-nav-bar title="请选择单据类型" left-text="返回" left-arrow @click-left="$store.dispatch('appGoback')" />
        <div class="main-content">
            <van-cell v-for="el in collapseList" :key="el.id" @click="toDanju(el)" is-link>
                <van-button marginRight slot="icon" type="info" size="mini" icon="balance-list-o"></van-button>
                <div slot="title">{{el.mc}}</div>
            </van-cell>
        </div>
    </div>
</template>
<script>

    import {
      mapActions,
        mapGetters,
        mapState
    } from 'vuex'

    export default {
        data() {
            return {
                activeCollpase: [],
            }
        },
        computed: {
            ...mapState({
                collapseList: state => state.bill_get.danju_type
            }),
            ...mapGetters(['bill_get_type']),
        },
        methods: {
            ...mapActions(['bill_get_fetchType']),
            toDanju(el){
                this.$router.push({
                    name: 'bill_get_new', 
                    query:{
                        type_id: el.id,
                        fyList: this.$route.query.fyList
                    }
                })
            }
        },
        created() {
            this.bill_get_fetchType()
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