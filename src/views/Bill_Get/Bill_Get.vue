<template>
    <div class="bill_get__container">
        <van-nav-bar title="新建通用报销单" fixed placeholder style="height:10vw" left-text="返回" left-arrow @click-left="$store.dispatch('appGoback')" />
        <div class="mainContent" ref="mainContent" >
            <van-form v-if="initOK" ref="form" @submit="onSubmit">
            <van-field v-model="form.bxsy" clickable name="bxsy" required is-link label="报销事由" placeholder="请输入报销事由"
                :rules="[{ required: true, message: '请输入报销事由',trigger:'onBlur' }]">
            </van-field>
            <van-cell-group>
                <van-field v-model="form.gstt.name" label="公司抬头" clickable 
                    required is-link name="gstt" placeholder="请选择公司抬头" readonly
                    :rules="[{ required: true, message: '请输入公司抬头',trigger:'onChange' }]">
                </van-field>
            </van-cell-group>
            <van-cell-group>
                <van-field v-model="form.cdr.name" label="承担人" clickable 
                    required is-link name="gstt" placeholder="请选择承担人" readonly
                    :rules="[{ required: true, message: '请输入承担人',trigger:'onChange' }]">
                </van-field>
            </van-cell-group>
            <van-cell-group>
                <van-field v-model="form.cdbm.name" label="承担部门" clickable @click="go2sub({name: 'bill_get_dept'})"
                    required is-link name="cdbm" placeholder="请选择承担部门" readonly
                    :rules="[{ required: true, message: '请选择承担部门',trigger:'onChange' }]">
                </van-field>
            </van-cell-group>
            <van-cell-group border>
                <van-field label="备注" border type="textarea" v-model="form.beizhu" name="liuyan" placeholder="请输入留言"
                    show-word-limit maxlength="300"
                    :rules="[{ pattern: /^[\s\S]{0,300}$/, message: '留言太长',trigger:'onBlur' }]">
                </van-field>
            </van-cell-group>
            <van-cell-group border class="marginTop cell-group">
                <!-- <div class="title">分摊信息</div> -->
                <van-field v-model="form.skzh.account" label="收款账户" required>
                    <template #extra>
                        <div>
                            <van-button native-type="button" size="mini" type="info">个人</van-button>
                            <van-button native-type="button" size="mini">单位</van-button>
                        </div>
                    </template>
                    <template #input>
                        <div></div>
                    </template>
                </van-field>
                <div class="content" @click="go2sub({path: '/bill/get/bill_get_skzh'})">
                    <van-button v-if="!form.skzh.account" native-type="button" block borderless type="info" plain>
                        选择收款账户</van-button>
                    <div style="padding:10px 20px;" v-else>
                        <div style="margin-bottom:10px">银行户名</div>
                        <van-cell paddingless :title="form.skzh.account" :label="form.skzh.label"></van-cell>
                    </div>
                </div>
            </van-cell-group>
            <van-cell-group border class="marginTop cell-group">
                <van-field v-model="form.skzh.account" label="费用明细" required>
                    <template #input>
                        <div></div>
                    </template>
                </van-field>
                <div class="content">
                    <div class="account-item" v-for="el in form.minxi" :key="el.id">
                        <div class="left">
                            <div class="icon">
                                <van-icon :name="el.icon"></van-icon>
                            </div>
                            <div class="title">
                                <div>{{el.expenseType}}</div>
                                <small style="color:#aaa">{{el.zhmc}}</small>
                            </div>
                        </div>
                        <div class="right">
                            <div class="top"><small>¥</small>{{el.money}}</div>
                            <div class="bottom">消费时间 {{el.expenseTime }}</div>
                        </div>
                    </div>
                    <van-row>
                        <van-col span="12" border-right>
                            <van-button :to="{name: 'bill_add',query:{from: $route.name}}" native-type="button"
                                type="default" borderless block>
                                <a class="blue-text">新建费用</a>
                            </van-button>
                        </van-col>
                        <van-col span="1"></van-col>
                        <van-col span="11">
                            <van-button @click="go2sub({name:'bill_get_minxi_from_account'})" native-type="button"
                                type="default" borderless block>
                                <a class="blue-text">从账本导入</a>
                            </van-button>
                        </van-col>
                    </van-row>
                </div>
            </van-cell-group>
            <van-cell-group border class="marginTop cell-group">
                <div class="title">核销借款</div>
                <div class="content">
                    <van-button @click="go2sub({name: 'bill_get_jiekuandan'})" native-type="button" block borderless
                        type="info" plain>选取借款核销</van-button>
                    <small align="center" style="padding-bottom:20px;width:100%;text-align:center;display:block">
                        当前往来单位下剩余: ￥0.00</small>
                </div>
            </van-cell-group>
            <van-cell-group border class="marginTop cell-group">
                <div class="title">附件</div>
                <div class="content" style="padding:10px">
                    <van-uploader :after-read="afterRead" />
                </div>
            </van-cell-group>

            <!-- 底部保存 -->
            <div class="van-tabbar--fixed bottom_saved_buttons">
                <div class="qyyf">
                    <div class="top">
                        企业应付: 
                    </div>
                </div>
                <van-row>
                    <van-col span="12">
                        <van-button @click="onBaocun" native-type="button" type="default" borderless
                            style="background:rgb(247,247,247)" block>保存</van-button>
                    </van-col>
                    <van-col span="1"></van-col>
                    <van-col span="11">
                        <van-button @click="onTijiao" native-type="button" type="info" borderless block> 提交
                        </van-button>
                    </van-col>
                </van-row>
            </div>
        </van-form>
        </div>
        <!-- <transition name="van-slide-right">
            <div class="erji-view" :style="{height: app_height +'px'}" v-if="isErjiRoute">
                <keep-alive>
                    <router-view @select_dept="select_dept" @select_skzh="select_skzh"></router-view>
                </keep-alive>
            </div>
        </transition> -->
        <van-popup :overlay="false" get-container="body" erji-view v-model="isErjiRoute" :lock-scroll="!isErjiRoute" position="right" :style="{ width: '100%',height:'100%' }" >
            <transition name="van-fade">
                <keep-alive>
                <router-view @select_dept="select_dept" @select_skzh="select_skzh" @select_minxi="select_minxi"></router-view>
                </keep-alive>
            </transition>
        </van-popup>
    </div>
</template>
<script>
    import {
        mapGetters
    } from 'vuex'
    export default {
        data() {
            return {
                form: {
                    bxsy: "",
                    gstt: {
                        name: '利郎(中国)有限公司'
                    },
                    cdbm: {},
                    cdr: {
                        name: '李祖龙'
                    },
                    beizhu: "",
                    skzh: {},
                    minxi: []
                },
                initOK: true,

            }
        },
        computed: {
            isErjiRoute:{
                get(){
                    return this.$route.name != 'bill_get_new'
                },
                set(val){}
             
            },
            ...mapGetters(['app_height']),
        },
        watch: {
            isErjiRoute: {
                immediate: true,
                async handler(val) {
                    await  this.$nextTick();
                }
            },
        },
        created() {
            if (this.isErjiRoute && !this.$route.params.avoidRefresh) {
                //二级路由处理
                this.$router.push({
                    name: 'bill_get_new'
                })
            }
        },
        methods: {
            afterRead() {

            },
            onSubmit() {

            },
            select_minxi(minxi){
               this.form.minxi.push(minxi);
                this.$store.dispatch('appGoback')
            },
            select_dept(dept) {
                this.form.cdbm = dept;
                this.$store.dispatch('appGoback')
            },
            select_skzh(skzh) {
                this.form.skzh = skzh;
                this.$store.dispatch('appGoback');
            },
            go2sub(route) {
                route = Object.assign(route, {
                    params: {
                        avoidRefresh: true
                    }
                })
                this.$router.push(route)
            },
            onBaocun() {
                this.$toast.success('保存成功');
                this.$router.push('/')
            },
            onTijiao() {
                this.$toast.success('保存成功');
                this.$router.push('/')
            }
        }
    }
</script>
<style lang="less">
    .bill_get__container {
        padding-bottom: 100px;
        .mainContent{
            overflow: hidden;
        }
    }
</style>