<template>
    <div class="danju-type-container" >
        <van-nav-bar title="请选择单据类型" fixed placeholder left-text="返回" left-arrow @click-left="$store.dispatch('appGoback')" />
        <div class="main-content">
            <div v-for="(value,key) in collapseList2" :key="key">
                <div class="title" >{{key}}</div>
                <van-cell v-for="(el) in value" :key="el.id" @click="toDanju(el)" is-link>
                    <van-button marginRight slot="icon" type="info" size="mini" icon="balance-list-o"></van-button>
                    <div slot="title">{{el.mc}}</div>
                </van-cell>
            </div>
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
            collapseList2(){
                return this.collapseList.reduce((t,el) =>{
                    t[el.group]? t[el.group].push(el): (t[el.group] = [el]);
                    return t;
                }, {})
            }
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
        height: 100%;
        display: flex;
        overflow: hidden;
        flex-direction: column;
        .van-nav-bar {
            flex: none;
        }

        .main-content {
            padding-bottom: 30px;;
            .van-collapse-item__content {
                padding: 0
            }
            .title{
                line-height: 10vw;
                font-size: 13px;
                padding-left: 16px;
            }
        }

    }
</style>