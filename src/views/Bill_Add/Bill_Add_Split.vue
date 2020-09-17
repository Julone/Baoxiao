<template>
    <div class="split_container" ref="ftContainer" >
        <van-nav-bar title="费用拆分" fixed placeholder left-text="返回" left-arrow @click-left="$store.dispatch('appGoback')" />
        <div class="main" ref="main" >
            <van-cell-group>
                <div slot="title">
                    拆分总金额: <a class="blue-text"><small>￥</small>{{split_parent.zje | moneyFormat(2)}}</a>
                </div>
                <van-cell >
                    <template #title>
                        <div wh100>
                            1. {{split_parent.fylxmc}}
                        </div>
                    </template>
                    <div class="moneyPanel">
               
                            <span>未拆分金额:</span> <small>￥</small>
                            <big>{{split_parent.zje - split_parent.cfje | moneyFormat(2)}} </big>
                 
                    </div>
                </van-cell>
            </van-cell-group>
            <!-- {{split_list}} -->
            <van-form ref="form" style="position:relative" :show-error="false" :show-error-message="show_error" v-cloak
                novalidate>
                <van-divider style="padding:5vw 0" v-if="split_list.length ==0">暂无拆分, 请添加拆分</van-divider>
              
                <van-cell clickable is-link v-for="(el,index) in [...split_list]" :key="el.id"  @click="onEditSplit(el)">
                    <template #title>
                        <div wh100>
                            {{index + 2}}. {{el.fylxmc}}
                        </div>
                    </template>
                    <small>￥</small>{{el.cfje | moneyFormat(2)}} 
                </van-cell>
       
                <van-row class="marginTop marginBottom">
                    <van-col span="24" class="border-right">
                        <van-button native-type="button" type="info" @click="onAddSplit()" plain borderless block>
                            添加拆分</van-button>
                    </van-col>
             
                </van-row>
            </van-form>

            <!-- 底部保存 -->
            <div class="van-tabbar--fixed bottom_saved_buttons">
                <van-row>
                    <van-col span="12">
                        <van-button to="/account" native-type="button" type="default" borderless
                            style="background:rgb(247,247,247)" block>返回账本</van-button>
                    </van-col>
                    <van-col span="1"></van-col>
                    <van-col span="11">
                        <van-button @click="onSave" native-type="button" type="info" borderless block>前往费用
                        </van-button>
                    </van-col>
                </van-row>
            </div>
        </div>
    </div>
</template>
<script>
    import {
        mapGetters
    } from 'vuex'
    import {
        accSub,
        accAdd,
        accMul,
        accDiv
    } from '@/utils/math';
    import {
        dialogConfirm,
        randomString
    } from '@/utils/utils'
    import {bill_get_feiyongInfo} from 'api'
    export default {
        name: 'bill_split',
        data() {
            return {
                split_list: [],
                split_money:  0,
                show_error: true,
                split_parent: {}
            }
        },
        // props: ['formdata'],
        props: {
            formdata:{
                required: true
            },
            url_prefix:{
                default: ''
            }
        },
        computed: {
            ...mapGetters(['appHeight', 'regRules']),
            curSum() {
                return this.split_list.reduce((t, el) => {
                    t = accAdd(t, el.cdje);
                    return t;
                }, 0)
            },
            split_id(){
                return this.$route.query.id || null;
            }
        },

        methods: {
            onSave() {
                this.$router.push({name: 'bill_add', query: {
                    edit_id: this.split_id
                }})
            },
            removeItem: dialogConfirm(function (id) {
                var index = this.split_list.findIndex(el => el.id == id)
                index != -1 && this.split_list.splice(index, 1);
            }),
            onEditSplit(item) {
                 var params = {
                    path: this.url_prefix + '/bill/add',
                    query: {
                        split_id: this.split_id,
                    }
                }
                if(item.id) {
                    params.query.edit_id= item.id
                }
                this.$router.push(params).then(r=>{
                    this.$eventBus.$emit('refreshView')
                })
            },
            onAddSplit(){
                this.$router.replace({
                    path: this.url_prefix + '/bill/add',
                    query: {
                        split_id: this.split_id
                    }
                }).then(r=>{
                    this.$eventBus.$emit('refreshView')
                })
            },
            getSplitInfo(){
                bill_get_feiyongInfo(this.split_id).then(r=>{
                console.log(r);
                this.split_list= r.data.cf_list.filter(el => el.cfbs == 2);
                this.split_parent = r.data.cf_list.find(el => el.cfbs == 1);
                this.split_money = r.data.je;
                if(!this.split_parent) {
                    this.split_parent = {
                        fylxmc: r.data.xflx.fylxmc,
                        zje: r.data.je,
                        cfje: 0,
                        id: r.data.id
                    }
                }
            })
            }
        },
        created() {
            this.getSplitInfo();
        },
        activated(){
            this.getSplitInfo();
            console.log('activeated');
        }
    }
</script>
<style lang="less">
    .split_container {
        overflow: auto;
        overflow-x: hidden;
        background-color: rgb(240, 242, 245);

        .bcdp-item {
            width: 100%;
            .flex(@j: space-between);

            .bcdp-item-left {}

            input {
                width: 100px;
            }
        }

        .ft_title {
            line-height: 30px;
            padding: 2px 10px;
            color: gray;
            font-size: 12px;
            .flex(@j: space-between);
        }

        .cdbl_input {
            &::placeholder {
                color: rgb(202, 203, 206);
            }
        }
        .moneyPanel{
            .flex(@a:center;@j:flex-end);
                span{
                    font-size: 80%;
                }

                big{
                    color: #555;
                    font-size: 100%;
                    margin-left: 3px;;
                }
        }

        .van-form {
            min-height: calc(100vh - 40vw);
            padding-bottom: 80px;;
        }

   
    }
</style>