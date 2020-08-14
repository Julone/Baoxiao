
<template>
    <div class="wanlai-danwei-container" :style="{height: app_height +'px'}">
        <van-nav-bar title="城市选择" left-text="返回" left-arrow @click-left="$emit('closed')" />
         <div class="picker">
               <a class="blue-text" @click="back_china">中国大陆</a> <div class="shen" v-if="shen"><van-icon name="arrow" />{{shen}}</div>
               <van-icon name="location-o" />
            </div>
        <div class="main-content">
            <div style="width: 100%">
                <van-list v-model="loading" :finished="finished" finished-text="仅限中国大陆" @load="onLoad"
                    :error.sync="error" error-text="请求失败，点击重新加载">
                    <van-cell v-for="el in cur_list" :key="el.id" clickable :is-link="el.children.length > 0" :title="el.name"
                        @click="onCellClick(el)" :label="el.khyh" />
                </van-list>
            </div>
        </div>
    </div>
</template>
<script>
    import {
        skzh_get_khss
    } from 'api'
    import {
        mapGetters
    } from 'vuex'

    export default {
        data() {
            return {
                list: [],
                loading: false,
                page: 1,
                limit: 50,
                error: false,
                finished:false,
                shen: '',
                shi: '',
                cur_list: []
            }
        },

        computed: {
            curTypeList() {
                return this.typeList[this.activeKey]
            },
            ...mapGetters(['app_height'])
        },
        methods: {
            back_china(){
                this.cur_list= [ ...this.list ];
                this.shen = ''

            },
            onCellClick(el){
                this[el.cate] = el.name;
                if(el.children.length > 0) {
                    // this.cur_list = this.list.find(ele=>ele.name == el.name).children;
                    var cur_list = this.list.find(ele=>ele.name == el.name).children;
                    this.cur_list= cur_list
                    console.log(cur_list);
                }else{
                    if(el.cate == 'shen'){
                        this.$emit('choose_khss', [this.shen,this.shen])
                    } else{
                    this.$emit('choose_khss', [this.shen,this.shi])
                    }
                }
                console.log(this.shen,this.shi);
            },
            onLoad() {
                return skzh_get_khss().then(r => {
          
                            var data = r.data.map((el) => {
                                var obj = {}
                                obj.name = el.shen;
                                obj.cate = 'shen'
                                obj.children = el.shiList.map(el2 => ({name:el2,children:[],cate: 'shi'}));
                                return obj;
                            });
                            console.log(data);
                            this.list = data;
                            this.cur_list=  data;
            
                }).catch(e => {
                    this.error = true;
                }).finally(() => {
                            this.finished = true;
                    this.loading = false;
                })
            }
        },
        created() {

        },

        activated() {

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
        .picker{
            padding: 15px 12px ;
            .flex(@j:flex-start);
            border-bottom: 1px solid #ebedf0;
             i{
                    margin: 0 5px;
                }
            .shen{
                .flex(@j:flex-start;@f:inline-flex;);
                font-size: 90%;
               
            }
        }

        .main-content {
            .flex(@a: strech);
            flex: 1;
            height: 100%;
            overflow: scroll;
        }

    }
</style>