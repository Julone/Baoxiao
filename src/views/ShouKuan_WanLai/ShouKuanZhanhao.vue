<template>
    <div class="skzh-container">
        <van-nav-bar :title="isEditMode? '收款账号' : '选择收款账户'" left-text="返回" left-arrow @click-left="$store.dispatch('appGoback')" />
        <div class="main-content">
            <div v-for="(el,index) in card" :key="index" class="card" @click="onCardClick(el)">
                <div class="title">
                    {{el.zhmc}}
                </div>
                <div class="account">
                    {{el.yhzh}}
                </div>
                <div class="divider"></div>
                <div class="label">{{el.khyh}}</div>
                <van-icon class="icon" name="coupon-o" />
            </div>
        </div>
        <!-- 底部保存 -->
        <div class="van-tabbar--fixed bottom_saved_buttons">
            <van-row>
                <van-col span="24">
                    <van-button :to="{path: './bill_get_skzh/add'}" native-type="button" type="info" borderless block>
                        添加收款账号
                    </van-button>
                </van-col>
            </van-row>
        </div>
        <!-- 子路由 -->
        <!-- <transition name="van-slide-right">
            <div class="erji-view" v-if="isOpenErji">
                <keep-alive>
                    <router-view ></router-view>
                </keep-alive>
            </div>
        </transition> -->
        <van-popup :overlay="false" get-container="body"  v-model="isErjiRoute" position="right" :style="{ width: '100%',height:'100%' }" >
            <transition name="van-fade">
                <router-view @remove_done="removeDone()" @save_done="saveDone()"></router-view>
            </transition>
        </van-popup>
    </div>
</template>
<script>
    import {
        skzh_get_list
    } from 'api'
    import {
        mapGetters
    } from 'vuex'

    export default {
        data() {
            return {
                card: [],
                mode: this.$route.query.mode || 'select'
            }
        },

        computed: {
            isErjiRoute: {
                get(){
                    return this.$route.name == 'bill_get_skzh_add'
                },
                set(){}
            },
            isEditMode(){
                return this.$route.query.mode == 'edit'
            },
            ...mapGetters(['appHeight'])
        },
        methods: {
            onCardClick(el){
                if(this.isEditMode){
                    console.log(this.$route);
                    this.$router.push({path: './bill_get_skzh/add', query: {mode: 'edit',id: el.id}})
                }else {
                             this.$emit('select_skzh', el)
                
                }
            },
            getData(){
                return skzh_get_list().then(r => {
                    if (r.errcode == 0 && r.data.length) {
                        this.card = r.data.map(el => {
                            return el
                        })
                    }
                })
            },
            saveDone(){
                this.getData();
                this.$store.dispatch('appGoback')
            },
            removeDone(){
                this.getData();
                this.$store.dispatch('appGoback')
            }
        },
        created() {
            this.getData();     
       
        },
        activated() {

        },
    }
</script>
<style lang="less" scoped>
    .skzh-container {
        height: 100%;
        display: flex;
        overflow: hidden;
        flex-direction: column;
        background: @app_bg_color;

        .van-nav-bar {
            flex: none;
        }

        .main-content {
            // .flex(@a: strech);
            // flex: 1;
            height: auto;
            overflow: auto;
            padding: 15px;
            padding-bottom: 70px;
            .card {
                .wh100(@h: fit-content);
                padding: 10px 0px;
                margin-bottom:10px;
                background: rgb(50, 136, 221);
                color: white;
                padding: 10px 20px;
                font-size: 16px;
                border-radius: 5px;
                overflow:hidden;
                box-sizing:border-box;
                // .createBox(@p: 10px 20px;);
                .title {
                    line-height: 2em;
                }

                .account {
                    line-height: 1.5em;
                }

                .divider {
                    border: 1px dashed rgba(255, 255, 255, 0.265);
                }

                .label {
                    font-size: .6em;
                    line-height: 2em;;
                }

                .icon {
                    position: absolute;
                    right: -30px;
                    bottom: -30px;
                    font-size: 7em;
                    pointer-events: none;
                    opacity: .7;
                }

            }
        }

    }
 
</style>