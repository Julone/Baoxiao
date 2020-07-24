<template>
    <div class="bill_get__container">
        <van-nav-bar title="新建通用报销单" left-text="返回" left-arrow @click-left="$store.dispatch('appGoback')" />
        <van-form v-if="initOK" ref="form" @submit="onSubmit">
            <van-field v-model="form.bxsy" clickable name="bxsy" required is-link label="报销事由" placeholder="请输入报销事由"
                :rules="[{ required: true, message: '请输入报销事由',trigger:'onBlur' }]">
            </van-field>
            <van-cell-group>
                <van-field v-model="form.gstt.name" label="公司抬头" clickable @click="go2sub({name: 'bill_get_gongsi'})"
                    required is-link name="gstt" placeholder="请选择公司抬头" readonly
                    :rules="[{ required: true, message: '请输入公司抬头',trigger:'onChange' }]">
                </van-field>
            </van-cell-group>
               <van-cell-group>
                <van-field v-model="form.cdr.name" label="承担人" clickable @click="go2sub({name: 'bill_get_gongsi'})"
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
                            <template #extra >
                                <div>
                                    <van-button size="mini" type="info">个人</van-button>
                                    <van-button size="mini">单位</van-button>
                                </div>
                            </template>
                            <template #input>
                                <div></div>
                            </template>
                        </van-field>
                        <div class="content" @click="go2sub({name: 'bill_get_skzh'})">
                            <van-button v-if="!form.skzh.account" native-type="button" block borderless type="info" plain 
                                >
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
                        <div class="content" >
                                  <van-row>
                                <van-col span="12">
                                    <van-button :to="{name: 'bill_add'}" native-type="button" type="default" borderless
                                     block>
                                     <a  class="blue-text">新建费用</a>
                                     </van-button>
                                </van-col>
                                <van-col span="1"></van-col>
                                <van-col span="11">
                                    <van-button @click="go2sub({name:'bill_get_minxi_from_account'})" native-type="button" type="default" borderless block>
                                     <a  class="blue-text">从账本导入</a>
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
                    <van-row >
                        <van-col span="12">
                            <van-button @click="onBaocun" native-type="button" type="default" borderless
                                style="background:rgb(247,247,247)" block>保存</van-button>
                        </van-col>
                        <van-col span="1"></van-col>
                        <van-col span="11">
                            <van-button @click="onTijiao" native-type="button" type="info" 
                            borderless block> 提交
                            </van-button>
                        </van-col>
                    </van-row>
                </div>
        </van-form>
        <transition name="van-slide-right">
            <div class="erji-view" v-if="isOpenErji">
                <keep-alive>
                    <router-view @select_dept="select_dept" @select_skzh="select_skzh"></router-view>
                </keep-alive>
            </div>
        </transition>
    </div>
</template>
<script>
    export default {
        data() {
            return {
                form: {
                    bxsy: "",
                    gstt: {name:'利郎(中国)有限公司'},
                    cdbm: {},
                    cdr: {name: '李祖龙'},
                    beizhu: "",
                    skzh: {}
                },
                initOK: true,

            }
        },
        computed: {
            isOpenErji() {
                console.log(this.$route.name);
                return this.$route.name != 'bill_get_new'
            }
        },
        methods: {
            afterRead(){

            },
            onSubmit() {

            },
            select_dept(dept) {
                this.form.cdbm = dept;
                this.$store.dispatch('appGoback')
            },
            select_skzh(skzh){
                // console.log(skzh);
                // var a = skzh;
                this.form.skzh = skzh;
                // this.$set(this.form, 'skzh' ,a)
                this.$store.dispatch('appGoback');
                console.log(this.form);

            },
            go2sub(route) {
                route = Object.assign(route, {
                    params: {
                        avoidRefresh: true
                    }
                })
                this.$router.push(route)
            },
            onBaocun(){
                this.$toast.success('保存成功');
                this.$router.push('/')
            },
            onTijiao(){
                  this.$toast.success('保存成功');
                this.$router.push('/')
            }
        }
    }
</script>
<style lang="less">
    .bill_get__container{
        padding-bottom: 100px;;
    }
</style>