<template>
    <div class="bill_get__container">
        <van-nav-bar :title="navTitle" fixed placeholder left-text="返回" left-arrow
            @click-left="$store.dispatch('appGoback')" />
        <div class="mainContent">
            <van-form v-if="bill_type.alias == 'jiekuan'" ref="form" :show-error="false">
                <van-field v-model="form.jkyy" clickable name="jkyy" required label="借款原因" placeholder="请输入借款原因"
                    :rules="[{ required: true, message: '请输入借款原因',trigger:'onBlur' }]">
                </van-field>
                <van-field v-model="form.jkje" type="number" clickable name="jkje" required label="借款金额" placeholder="请输入借款金额"
                    :rules="[{ required: true, message: '请输入借款金额',trigger:'onBlur' }]">
                </van-field>
                <van-field v-model="form.cdbm.name" label="部门" clickable @click="openDeptPopup()" required is-link
                    name="cdbm" placeholder="请选择部门" readonly
                    :rules="[{ required: true, message: '请选择部门',trigger:'onChange' }]">
                </van-field>
               <van-cell-group>
                    <van-field :border="false" v-model="form.ghrq" name="ghrq" label="预计归还日期" @click="ghrqStatus=true" clickable required is-link>
                        <template #input>
                            {{form.ghrq | date('yyyy-MM-dd')}}
                        </template>
                    </van-field>
                    <van-popup get-container="body" v-model="ghrqStatus" position="bottom" @closed="onDateClosed">
                        <van-datetime-picker type="date" :min-date="minDate" title="选择年月日" item-height="50vh" 
                            @confirm="onDateConfirm" @cancel="ghrqStatus=false" ref="datePicker"/>
                    </van-popup>
               </van-cell-group>
                <van-field v-model="form.cdr" label="借款人" clickable required name="gstt" placeholder="请选择借款人"
                    readonly :rules="[{ required: true, message: '请输入借款人',trigger:'onChange' }]">
                </van-field>
                <van-field v-model="form.hkjh" type="textarea" clickable name="hkjh" required label="还款计划" placeholder="请输入还款计划"
                    :rules="[{ required: true, message: '请输入还款计划',trigger:'onBlur' }]" show-word-limit maxlength="300" 
                    :autosize="{ maxHeight: 100, minHeight: 50 }">
                </van-field>
                <van-cell-group border class="marginTop cell-group">
                    <billGetSkzh v-bind="{ form, bill_type, go2sub}" ></billGetSkzh>
                </van-cell-group>


            </van-form>

            <van-form v-else ref="form" :show-error="false">
                <van-field v-model="form.zhbz" clickable name="zhbz" required label="报销事由" placeholder="请输入报销事由"
                    :rules="[{ required: true, message: '请输入报销事由',trigger:'onBlur' }]">
                </van-field>
                <van-field v-model="form.cdr" label="承担人" clickable required name="gstt" placeholder="请选择承担人"
                    readonly :rules="[{ required: true, message: '请输入承担人',trigger:'onChange' }]">
                </van-field>
                <van-field v-model="form.cdbm.name" label="承担部门" clickable @click="openDeptPopup()" required is-link
                    name="cdbm" placeholder="请选择承担部门" readonly
                    :rules="[{ required: true, message: '请选择承担部门',trigger:'onChange' }]">
                </van-field>
                <van-field v-if="bill_type.config.showWLDW" v-model="form.wanlai_danwei.zhmc" label="往来单位" clickable
                    @click="go2sub({path: '/bill/get/wanlai_danwei'})" required is-link name="wanlai_danwei"
                    placeholder="请选择往来单位" readonly :rules="regRules.wanlai_danwei">
                </van-field>
                <van-field label="备注" border type="textarea" v-model="form.bz" name="liuyan" placeholder="请输入留言"
                    show-word-limit maxlength="300"
                    :rules="regRules.beizhu">
                </van-field>
                <van-cell-group border class="marginTop cell-group" v-if="bill_type.config.showSKZH">
                    <billGetSkzh v-bind="{ form, bill_type, go2sub}" ></billGetSkzh>
                </van-cell-group>
                <van-cell-group border class="marginTop cell-group "> 
                    <!-- feiyongMinxi -->
                    <van-field v-model="fyListCount" label="费用明细" required :rules="regRules.fyList"
                    input-align="right"
                    >
                        <van-button slot="input"  type="danger" size="mini" native-type="button" plain hairline
                        icon="delete" @click="onFyListClear()"
                        >清除所有</van-button>
                    </van-field>
                    <div class="content">
                        <van-swipe-cell v-for="(el) in form.fyList" :key="el.id">
                            <account-item @click.native="onMinxiItemClick(el, null, true)" :checkMode="false" :item="el">
                            </account-item>
                            <template #right>
                                <van-button style="height:100%" square text="编辑" type="info"
                                    @click="onMinxiItemClick(el, null, true)" />
                                <van-button style="height:100%" square text="删除" type="danger"
                                    @click="onMinxiItemDelete(el.id)" />
                            </template>
                        </van-swipe-cell>
                        <van-row>
                            <van-col span="12" border-right>
                                <van-button :to="{path: '/bill/get/bill/add'}" tag="div" type="default" borderless
                                    block>
                                    <a class="blue-text">新建费用</a>
                                </van-button>
                            </van-col>
                            <van-col span="1"></van-col>
                            <van-col span="11">
                                <van-button @click="go2sub({path:'/bill/get/bill_get_account'})" tag="div"
                                    type="default" borderless block>
                                    <a class="blue-text">从账本导入</a>
                                </van-button>
                            </van-col>
                        </van-row>
                    </div>
                </van-cell-group>
                <van-cell-group border class="marginTop cell-group" hidden>
                    <div class="title">核销借款</div>
                    <div class="content">
                        <van-button @click="go2sub({path: '/bill/get/bill_get_jiekuandan'})" tag="div" block borderless
                            type="info" plain>选取借款核销</van-button>
                        <small align="center" style="padding-bottom:20px;width:100%;text-align:center;display:block">
                            当前往来单位下剩余: ￥0.00</small>
                    </div>
                </van-cell-group>
                <van-cell-group border class="marginTop cell-group" hidden>
                    <div class="title">附件</div>
                    <div class="content" style="padding:10px">
                        <van-uploader :after-read="afterRead" />
                    </div>
                </van-cell-group>
                
            </van-form>
                <!-- 底部保存 -->
            <div class="van-tabbar--fixed bottom_saved_buttons">
                    <div class="qyyf">
                        <div class="top">
                            <small>企业应付:</small> <bill-money>{{fyListTotal}}</bill-money>
                        </div>
                    </div>
                    <van-row>
                        <van-col span="12">
                            <van-button @click="onBaocun" tag="div" type="default" borderless
                                style="background:rgb(247,247,247)" block>保存</van-button>
                        </van-col>
                        <van-col span="1"></van-col>
                        <van-col span="11">
                            <van-button @click="onTijiao" tag="div" type="info" borderless block>
                                {{edit_id? '更新': '提交'}}
                            </van-button>
                        </van-col>
                    </van-row>
                </div>
        </div>
        <van-popup :overlay="false" v-model="isErjiRoute" position="right" class="popup-fullsize" get-container="body" :lock-scroll="false">
            <transition leave-active-class="van-fade-leave-active">
                <router-view @select-dept="select_dept" :activeItem="form" @select_skzh="select_skzh"
                    @select_fyList="select_fyList" :minxiList="form.fyList" @bill_get_add_item="bill_get_add_item"
                    @chooseWldw="chooseWldw" :bill_type="bill_type" :wanlai_danwei="form.wanlai_danwei"></router-view>
            </transition>
        </van-popup>
    </div>
</template>
<script>
    import {
        mapGetters
    } from 'vuex'
    import {
        bill_set_danju,
        bill_get_feiyongInfo,
        bill_get_danju,
        bill_get_computeJE
    } from 'api'
    import {
        dateFormat,
        dialogConfirm
    } from './../../utils/utils';
    export default {
        data() {
            return {
                form: {
                    zhbz: "",
                    cdbm: {},
                    bz: "",
                    skzh: {},
                    fyList: [],
                    cdr: '',
                    djlx: {},
                    wanlai_danwei: {},
                    //个人借款单，
                    jkyy: '',
                    jkje: '',
                    ghrq: new Date(),
                    hkjh: ''
                },
                type_id: this.$route.query.type_id || null,
                fyListTotal: 0,
                ghrqStatus: false,
                minDate: new Date(),
            }
        },
        computed: {
            isErjiRoute: {
                get() {
                    return this.$route.path.includes('/bill/get/')
                },
                set(val) {}
            },
            ...mapGetters(['appHeight', 'bill_get_type', 'userinfo', 'regRules']),
            bill_type() {
                return this.bill_get_type(this.type_id) || {}
            },
            edit_id() {
                return this.$route.query.edit_id || null
            },
            navTitle(){
                return `${this.edit_id? '编辑':'新建'}【${this.bill_type.mc || '未知单据类型'}】`
            },
            fyListInRoute(){
                var fyList = this.$route.query.fyList || '';
                return fyList
            },
            fyListCount: {
                get(){
                    return this.form.fyList.length
                },
                set(){

                }
            },
        },
        watch: {
            isErjiRoute: {
                immediate: true,
                handler(val) {
                    if (val) {
                        document.body.classList.add('van-overflow-hidden');
                    } else {
                        document.body.classList.remove('van-overflow-hidden');
                    }
                }
            },
            "form.fyList.length"(val, val2){
                this.firstFillWanlai();
                bill_get_computeJE(this.form.fyList).then(r=>{
                    console.log(r);
                    this.fyListTotal = r.data.je;
                })
            }
        },
        async created() {
            if (this.edit_id) { //编辑
                await bill_get_danju(this.edit_id).then(r => {
                    var data = r.data;
                    data.fyList = data.fyList.map(this.handleRowData);
                    this.form = data;
                    this.type_id = r.data.djlx.id || null;
                })
            }else{ //新建
                if(this.fyListInRoute.length){
                    await bill_get_feiyongInfo(this.fyListInRoute,true).then(r=>{
                        this.form.fyList = r.data.map(this.handleRowData);
                    })
                }
            }
            this.form.cdr = this.userinfo.cname;
            this.form.djlx = this.bill_type;
        },
        methods: {
            firstFillWanlai(force = false){
                if(!this.form.wanlai_danwei.zhmc && this.form.fyList.length > 0 && this.bill_type.dgbs == 1 || force) {
                    this.form.wanlai_danwei = this.form.fyList[0].wanlai_danwei;
                }
            },
            afterRead() {

            },
            async onDateClosed(){
                await this.$nextTick();
                var p = this.$refs.datePicker.getPicker();
                var d = this.$options.filters.date(this.form.ghrq,'yyyy-MM-dd')
                p.setValues(d.split('-'))
            },
            onDateConfirm(val){
                this.form.ghrq = val;
                this.ghrqStatus = false
            },
            openDeptPopup() {
                var route = {
                    path: '/bill/get/bill_get_dept',
                    query: {
                        breadcrumb: this.form.cdbm.breadcrumb,
                        keyword: this.form.cdbm.keyword,
                    }
                }
                this.go2sub(route)
            },
            select_fyList(fyListList) {
                this.form.fyList.push(...fyListList);
                this.firstFillWanlai(true);
                this.$store.dispatch('appGoback')
            },
            select_dept({
                dept
            }) {
                this.form.cdbm = dept;
                this.$store.dispatch('appGoback')
            },
            bill_get_add_item({
                saved_id
            }) {
                bill_get_feiyongInfo(saved_id).then(r => {
                    this.form.fyList.push(this.handleRowData(r.data));
                })
                this.$store.dispatch('appGoback');
            },
            handleRowData(ele) {
                ele.expenseType = ele.xflx.fylxmc;
                ele.money = Number(ele.je).toFixed(2);
                ele.expenseTime = dateFormat(ele.rq, 'MM-dd');
                ele.icon = ele.zhbj == 1 ? 'hotel-o' : 'user-o';
                ele.hasSelected = true;
                return ele;
            },
            select_skzh(skzh) {
                console.log(skzh);
                this.form.skzh = skzh;
                this.$store.dispatch('appGoback');
            },
            chooseWldw(val) {
                this.form.wanlai_danwei = val;
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
             onFyListClear:dialogConfirm(function(){
                this.form.fyList = [];
                this.form.wanlai_danwei = {};
            }),
            onMinxiItemDelete(id) {
                var i = this.form.fyList.findIndex(el => el.id == id);
                if (i != -1) {
                    this.form.fyList.splice(i, 1);
                } else {
                    this.$toast.fail('删除失败!');
                };
                if(this.form.fyList.length == 0) {
                    this.form.wanlai_danwei = {};
                }
            },
            onTijiao() {
                this.onSubmit().then(r=>{
                    this.$toast.success('提交成功!')
                    this.$router.push('/')
                }).catch(e=>{
                    console.warn(e)
                })
            },
            onBaocun() {
                this.onSubmit().then(r=>{
                    this.$toast.success('提交成功!');
                    this.$eventBus.$emit('refreshView')
                }).catch(e=>{
                    console.warn(e)
                })
            },
            onSubmit() {
                return new Promise( (resolve, reject) => {
                    this.$refs.form.validate().then(r => {
                        if (this.edit_id) {
                            Object.assign(this.form, {
                                id: this.edit_id
                            })
                        }
                        bill_set_danju(this.form).then(res => {
                            resolve(res)
                        }).catch(e => {
                            reject(e)
                        })
                    }).catch(e => {
                        reject(e)
                    })
                });
            },
            onMinxiItemClick(el, acc, bool) {
                if (bool) {
                    this.$router.push({
                        path: '/bill/get/bill/add',
                        query: {
                            edit_id: el.id
                        }
                    })
                }
            }
        }
    }
</script>
<style lang="less">
    .bill_get__container {

        .van-form {
            // overflow: hidden;
            padding-bottom: 120px;

        }

        .qyyf {
            .top {
                font-size: 14px;
                margin-bottom: 15px;
            }
        }
        .feiyongMinxi{
            .van-field__body{
                display: none;
            }
        }
    }
</style>