<template>
    <div class="wanlai-danwei-container" :style="{height: appHeight +'px'}">
        <van-nav-bar title="往来单位" left-text="返回" left-arrow @click-left="$store.dispatch('appGoback')">
            <template #right>
                <van-button @click="show_wldw = true" type="info" plain icon="plus" size="small" bgless borderless>添加</van-button>
            </template>
        </van-nav-bar>
        <van-search v-model="keyword" placeholder="请输入往来单位关键词" @search="onSearch" @input="onSearch" />
        
        <div class="main-content">
            <van-list
                v-model="loading"
                :error.sync="error"
                :finished="finished"
                finished-text="没有更多了"
                error-text="请求失败，点击重新加载"
                @load="onLoad"
                w100
            >
            <van-swipe-cell v-for="(el,index) in list" :key="el.id">
                <van-cell :class="{selected_cell: activeId == el.id,isUser: el.zhbj == 2}" 
                clickable  @click="onCellClick(el)" >
                        <template #title>
                            <div class="wldw-item " >
                                <van-icon :name="el.zhbj == 2? 'user-o': 'hotel-o' " size="22"/><span>{{el.zhmc}}</span>
                            </div>
                        </template>
                        <template #extra>
                            <div class="flex" v-if="activeId == el.id">
                                <van-icon name="success" />
                            </div>
                        </template>
               
                </van-cell>
                <template #right>
                    <van-button square type="danger" @click="onDelete(el.id, index)" text="删除" />
                </template>
            </van-swipe-cell>

            </van-list>
       
        </div>
          <van-popup :overlay="false" v-model="show_wldw" position="right" :style="{ width: '100%',height:'100%' }" :lock-scroll="!show_wldw">
            <transition name="van-fade">
                <wanlai-danwei is_wldw @save_done="save_done" ></wanlai-danwei>
            </transition>
        </van-popup>
    </div>
</template>
<script>
    import {
        bill_get_expense_wldw,
        skzh_del_by_id
    } from 'api'
    import {
        mapGetters
    } from 'vuex'

    export default {
        data() {
            return {
                list: [],
                show_wldw: false,
                page:1,
                limit: 10,
                loading: false,
                error: false,
                finished: false,
                keyword: ''
            }
        },
        components: {
            wanlaiDanwei:()=>import('@/views/ShouKuan_WanLai/ShouKuan_WanLai_Add.vue')
        },
        props: ['formdata'],
        computed: {
            ...mapGetters(['appHeight']),
            isEditMode(){
                return this.$route.query.mode == 'edit' || false
            },
            activeId(){
                return !this.isEditMode && this.formdata? this.formdata.wanlai_danwei.id: null
            }
        },
        methods: {
            handleData(el){
                el.zhmc = el.zhmc.trim();
                return el
            },
            onSearch(){
                if(this.keyword) {
                    bill_get_expense_wldw({
                        keyword: this.keyword
                    }).then(r=>{
                        this.resetParams();
                        this.list = r.data.map(this.handleData);
                        this.finished = true
                    })
                }else {
                    this.resetParams();
                }
            },
            onLoad(){
               return bill_get_expense_wldw({
                   page: this.page,
                   limit: this.limit,
               }).then(r => {
                    if (r.errcode == 0 && r.data.length == 0) {
                        this.finished = true
                    }
                    var data = r.data.map(this.handleData);
                    this.list.push(...data);
                    this.page += 1
                }).catch(e=>{
                    this.error = true
                }).finally(()=>{
                    this.loading = false;
                })
            },
            resetParams(){
                this.list = [];
                this.page = 1;
                this.finished = false;
            },
            save_done(data){
                this.resetParams();
                // this.onLoad();
                this.show_wldw = false;
            },
            onCellClick(el){
                if(this.isEditMode) {
                    return;
                } 
                this.$emit('chooseWldw',el)
            },
            onDelete(id, index){
                this.$dialog.confirm({
                    title: '删除',
                    message: '是否删除?',
                })
                .then(() => {
                    return skzh_del_by_id(id).then(r => {
                        this.$toast.success('删除成功');
                        this.list.splice(index, 1);
                    }).catch(e => this.$toast.fail('删除失败'))
                })
                .catch(e=>e)
            }
        },

        created() {
            console.log(this.formdata);
            // this.getData();
        },
    }
</script>
<style lang="less">
    .wanlai-danwei-container {
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
            .wldw-item{
                .flex(@j:flex-start);
                span{
                    margin-left: 5px;;
                }
               
            }
            .selected_cell{
                background: #ecf5ff;
                color:#0691ff
            }
        }

    }
</style>