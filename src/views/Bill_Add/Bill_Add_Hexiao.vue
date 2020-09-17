<template>
    <div class="container" :style="{height: appHeight +'px'}">
        <van-nav-bar title="核销历史未到票费用" left-text="返回" left-arrow @click-left="$store.dispatch('appGoback')" >
            <template #right>
                <accountPicker ></accountPicker>
            </template>
        </van-nav-bar>
        <div class="main-content">
            <div class="contents">
                 <van-empty :image="error? 'error' : 'search'" @click.native="onLoad" v-if="list.length == 0">
                     {{error? errmsg : '暂无核销费用'}}
                     </van-empty>
                <van-list v-model="loading" :finished="finished" :finished-text="!error? '没有更多了' : ''" @load="onLoad"
                    :error.sync="error" error-text="" ref="vanlist">
                    <van-cell class="hexiao-cell" v-for="el in list" :key="el.id" clickable :is-link="false"
                :label="$options.filters.date(el.rq)"
                 :title="el.fylxmc" 
                    @click="chooseItem(el)"  >
                    <van-checkbox shape="square" v-model="el.checked" style="margin-right:12px" slot="icon"/>
                    <div class="money_date">
                        <span class="money">
                              <small>￥</small>{{el.je | moneyFormat }}
                        </span>
                        <small>
                            <small>剩余金额:</small><small>￥</small>{{el.syje | moneyFormat }}
                        </small>
                    </div>
                </van-cell>
                </van-list>
               
            </div>
        </div>
        <div class="van-tabbar--fixed bottom_saved_buttons">
            <van-row>
                <van-col span="5">
                    <van-button @click="onSelectAll()" native-type="button" type="" borderless block>
                        {{selectToggle? '反选':'全选' }}
                    </van-button>
                </van-col>
                <van-col span="1">
                </van-col>
                <van-col span="18">
                    <van-button @click="onSave()" native-type="button" type="info" borderless block>确定核销
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
                wdp_list: [],
                loading: false,
                finished: false,
                error: false,
                errmsg: '',
                selectToggle: false
            }
        },
        props: ['formdata'],
        computed: {
            ...mapGetters(['appHeight'])
        },
        methods: {
            onSave(){
                this.$emit('chooseHxfy',this.list.filter(el=> el.checked))
            },
            onSelectAll(){
                this.selectToggle = !this.selectToggle;
                this.list.forEach(el=>{
                    el.checked = this.selectToggle;
                })
            },
            chooseItem(el){
                console.log(el);
                el.checked = !el.checked;
            },
            onLoad(){
                var wdp_list = [...this.formdata.wdp_list];
                bill_get_hexiao({wdpje: this.wdpje,zhmc:this.zhmc}).then(r => {
                    this.list = r.data.map(el => {
                        el.checked = wdp_list.find(w => w.id == el.id)? true:false
                        return el;
                    })
                }).catch(e=>{
                    this.errmsg = e;
                    this.error = true;
                }).finally(()=>{
                    this.loading =  false,
                    this.finished=  true
                })
            }
        },
        created() {
            console.log(this.$options);
            console.log(this.$route);
            console.log(this.formdata);
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
            overflow: auto;
            div.contents{
                height: fit-content;
                padding-bottom: 70px;
                width: 100%;
            }
        }

    }
</style>