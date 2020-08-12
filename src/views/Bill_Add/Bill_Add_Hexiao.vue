<template>
    <div class="container" :style="{height: app_height +'px'}">
        <van-nav-bar title="核销历史未到票费用" left-text="返回" left-arrow @click-left="$store.dispatch('appGoback')" />
        <div class="main-content">
            <div style="width: 100%">
                <van-cell v-for="el in list" :key="el.id" clickable :is-link="false" :title="el.fylxmc"
                    @click="chooseItem(el)" :label="el.khyh" >
                    <van-icon color="red" v-if=" el.checked" name="success" />
                    ￥{{el.je | moneyFormat }}
                </van-cell>
            <van-empty v-if="list.length == 0">暂无核销费用</van-empty>
            </div>

        </div>
        <div class="van-tabbar--fixed bottom_saved_buttons">
            <van-row>
                <van-col span="24">
                    <van-button @click="onSave" native-type="button" type="info" borderless block>保存
                    </van-button>
                </van-col>
            </van-row>
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
                wdpje: this.formdata.bcdp,
                zhmc: this.formdata.wanlai_danwei.zhmc,
                wdp_list: []
            }
        },
        props: ['formdata'],
        computed: {
            ...mapGetters(['app_height'])
        },
        methods: {
            onSave(){
                this.$emit('chooseHxfy',this.list.filter(el=> el.checked))
            },
            chooseItem(el){
                el.checked = !el.checked;

            }
        },
        created() {
            var wdp_list = [...this.formdata.wdp_list];
            bill_get_hexiao({wdpje: this.wdpje,zhmc:this.zhmc}).then(r => {
                if (r.errcode == 0 && r.data.length) {
                    this.list = r.data.map(el => {
                        el.checked = wdp_list.find(w => w.id == el.id)? true:false
                        return el;
                    })
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