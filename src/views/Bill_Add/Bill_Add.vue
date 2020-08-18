<template>
    <div class="bill_add_container">
        <div class="bill_add_wrapper" ref="mainContent">
            <van-nav-bar :title="edit_mode?'费用明细':'新建费用'" fixed placeholder left-text="返回" left-arrow
                @click-left="$store.dispatch('appGoback')">
                <template #right>
                    <!-- <accountPicker disabled></accountPicker> -->
                </template>
            </van-nav-bar>
            <!-- expense_type -->
            <van-form ref="form" @submit="onSubmit" novalidate>
                <van-field v-model="form.xflx.fylxmc" clickable readonly name="xflx" class="xflx marginBottom"
                    @click="go2sub({name: 'bill_add_expense_type'})" required :is-link="false" placeholder="请选择消费类型"
                    left-icon="gold-coin-o" :rules="[{ required: true, message: '请选择消费类型',trigger:'onChange' }]">
                    <template #right-icon>
                        <div>
                            <van-tag plain type="success" v-if="form.xflx.dgbs == 0">个人</van-tag>
                            <van-tag plain type="warning" v-if="form.xflx.dgbs == 1">对公</van-tag>
                            <van-tag plain type="primary" v-if="form.xflx.dgbs == 2">全部</van-tag>
                        </div>
                    </template>
                </van-field>
                <div class="switch-cell marginTop" v-if="form.xflx.fylxmc">
                    <div class="left">
                        <span v-if="form.duisi == true">个人费用</span>
                        <span v-if="form.duisi == false">对公业务</span>
                    </div>
                    <div class="right">
                        <!-- v-if="form.xflx.dgbs == 2" -->
                        <van-button v-if="form.xflx.dgbs == 2" native-type="button" size="mini" type="info" plain 
                            @click="form.duisi = !form.duisi" icon="exchange" >
                            切换为<span>{{form.duisi?'对公业务费用':'个人费用' }}</span>
                        </van-button>
                    </div>
                </div>
           
                <!-- 对私业务 -->
                <template v-if="form.duisi">
                    <van-field v-model="form.bcdp" label="消费金额" clickable required :rules="regRules.money" name="xfje">
                        <template #input>
                            <div class="bcdp-item">
                                <span>CNY</span>
                                <input type="number" step="0.01" placeholder="请输入金额" v-model="form.bcdp" @blur="onMoneyBlur">
                            </div>
                        </template>
                    </van-field>
                    <van-cell title="消费日期" @click="openDatePopup" clickable required is-link>
                        {{form.dprq | date('yyyy-MM-dd')}}
                        <van-popup get-container="body" v-model="dprqStatus" position="bottom">
                            <van-datetime-picker v-model="dprq_popup" type="date" :min-date="minDate"
                                :max-date="maxDate" title="选择年月日" item-height="50vh" :formatter="dataFormatter"
                                @confirm="onDateConfirm" @cancel="dprqStatus=false" />
                        </van-popup>
                    </van-cell>
                </template>
                <!-- 对公全部到票业务 -->
                <template v-if="!form.duisi">
                    <van-cell-group>
                    <van-field v-model="form.ywcj.mc" clickable readonly name="ywcj" @click="ywcjStatus = true" required
                        is-link label="业务场景" placeholder="请选择业务场景">
                    </van-field>
                    <van-popup v-model="ywcjStatus" position="bottom">
                        <van-picker show-toolbar :columns="ywcjColumns" @confirm="onYwcjConfirm" value-key="mc"
                            @cancel="ywcjStatus = false">
                        </van-picker>
                    </van-popup>
                </van-cell-group>
                    <template v-if="form.ywcj.id == 7184">
                        <van-field v-model="form.bcdp" label="本次到票" clickable required :rules="regRules.money"
                            name="xfje">
                            <template #input>
                                <div class="bcdp-item">
                                    <span>CNY</span>
                                    <input type="number" placeholder="请输入金额" v-model="form.bcdp" @blur="onMoneyBlur">
                                </div>
                            </template>
                        </van-field>
                        <van-cell title="到票日期" @click="openDatePopup" clickable required is-link>
                            {{form.dprq | date('yyyy-MM-dd')}}
                            <van-popup get-container="body" v-model="dprqStatus" position="bottom">
                                <van-datetime-picker v-model="dprq_popup" type="date" :min-date="minDate"
                                    :max-date="maxDate" title="选择年月日" item-height="50vh" :formatter="dataFormatter"
                                    @confirm="onDateConfirm" @cancel="dprqStatus=false" />
                            </van-popup>
                        </van-cell>
                        <van-field label="费用金额" v-model="form.bcdp" readonly required>
                            <template #input>
                                <div class="bcdp-item">
                                    <span>CNY</span>
                                    <input type="number" v-model="form.bcdp" readonly placeholder="自动计算">
                                </div>
                            </template>
                        </van-field>
                        <van-cell-group :border="false">
                            <van-field v-model="form.wanlai_danwei.zhmc" label="往来单位" clickable
                                @click="go2sub({path: '/bill/add/wanlai_danwei'})" required is-link name="wanlai_danwei"
                                placeholder="请选择往来单位" readonly
                                :rules="[{ required: true, message: '请输入往来单位',trigger:'onChange' }]">
                            </van-field>
                        </van-cell-group>
                    </template>
                    <!-- 对公未到票业务 -->
                    <template v-if="form.ywcj.id == 7185">
                        <van-field v-model="form.bcdp" label="未到票" clickable required :rules="regRules.money"
                            name="xfje">
                            <template #input>
                                <div class="bcdp-item">
                                    <span>CNY</span>
                                    <input type="text" placeholder="请输入金额" v-model="form.bcdp" @blur="onMoneyBlur">
                                </div>
                            </template>
                        </van-field>
                        <van-cell title="预计到票日期" @click="openDatePopup" clickable required is-link>
                            {{form.dprq | date('yyyy-MM-dd')}}
                            <van-popup get-container="body" v-model="dprqStatus" position="bottom">
                                <van-datetime-picker v-model="dprq_popup" type="date" :min-date="minDate"
                                    :max-date="maxDate" title="选择年月日" item-height="30vh" :formatter="dataFormatter"
                                    @confirm="onDateConfirm" @cancel="dprqStatus=false" />
                            </van-popup>
                        </van-cell>
                        <van-field label="费用金额" v-model="form.bcdp" readonly required>
                            <template #input>
                                <div class="bcdp-item">
                                    <span>CNY</span>
                                    <input type="text" v-model="form.bcdp" readonly placeholder="自动计算">
                                </div>
                            </template>
                        </van-field>
                        <van-cell-group :border="false">
                            <van-field v-model="form.wanlai_danwei.zhmc" label="往来单位" clickable
                                @click="go2sub({path: '/bill/add/wanlai_danwei'})" required is-link name="wanlai_danwei"
                                placeholder="请选择往来单位" readonly
                                :rules="[{ required: true, message: '请输入往来单位',trigger:'onChange' }]">
                            </van-field>
                        </van-cell-group>
                    </template>
                    <!-- 对公到票核销业务 -->
                    <template v-if="form.ywcj.id == 7186">
                        <van-field v-model="form.bcdp" label="本次到票" clickable required :rules="regRules.money"
                            name="xfje">
                            <template #input>
                                <div class="bcdp-item">
                                    <span>CNY</span>
                                    <input type="number" placeholder="请输入金额" v-model="form.bcdp" @blur="onMoneyBlur">
                                </div>
                            </template>
                        </van-field>
                        <van-cell title="到票日期" @click="openDatePopup" clickable required is-link>
                            {{form.dprq | date('yyyy-MM-dd')}}
                            <van-popup get-container="body" v-model="dprqStatus" position="bottom">
                                <van-datetime-picker v-model="dprq_popup" type="date" :min-date="minDate"
                                    :max-date="maxDate" title="选择年月日" item-height="30vh" :formatter="dataFormatter"
                                    @confirm="onDateConfirm" @cancel="dprqStatus=false" />
                            </van-popup>
                        </van-cell>
                        <van-field v-model="form.bcdp" label="费用金额" clickable required>
                            <template #input>
                                <div class="bcdp-item">
                                    <span>CNY</span>
                                    <input type="number" v-model="form.bcdp" readonly placeholder="自动计算">
                                </div>
                            </template>
                        </van-field>
                        <van-cell-group :border="false">
                            <van-field v-model="form.wanlai_danwei.zhmc" label="往来单位" clickable
                                @click="go2sub({path: '/bill/add/wanlai_danwei'})" required is-link name="wanlai_danwei"
                                placeholder="请选择往来单位" readonly
                                :rules="[{ required: true, message: '请输入往来单位',trigger:'onChange' }]">
                            </van-field>
                        </van-cell-group>
                        <van-cell-group border class="marginTop cell-group marginBottom">
                            <div class="title">核销历史费用</div>
                            <div class="content" v-if="form.wanlai_danwei.zhmc">
                                <!-- {{wdp_list}} -->
                                <van-button @click="open_hexiao()" native-type="button" block
                                    borderless type="info" plain>选取核销历史费用</van-button>
                                <div align="center" style="padding-bottom:20px;font-size:80%">当前往来单位下剩余: ￥{{form.wdpje}} 未到账</div>
                                <div v-if="form.wdp_list.length > 0">
                                    <van-divider marginless></van-divider>
                                    <van-swipe-cell  v-for="(el,si) in form.wdp_list" :key="el.id">
                                        <van-cell class="avg_cell" :title="el.fylxmc" :label="el.fydlmc" >
                                            ￥{{el.je | money}}
                                        </van-cell>
                                        <template #right>
                                            <van-button @click="form.wdp_list.splice(si,1)" h100 square text="删除" type="danger" class="delete-button" />
                                        </template>
                                    </van-swipe-cell>
                                </div>
                            </div>
                            <div class="content" v-else>
                                <div class="hexiao-tip">
                                    <van-notice-bar color="#1989fa" background="transparent" left-icon="info-o" >      
                                        请先选择到票金额和往来单位!
                                    </van-notice-bar>
                                </div>
                            </div>
                        </van-cell-group>
                    </template>
                </template>
                <van-cell-group border>
                    <van-field label="备注" border type="textarea" v-model="form.liuyan" name="liuyan" placeholder="请输入留言"
                        show-word-limit maxlength="300"
                        :rules="[{ pattern: /^[\s\S]{0,300}$/, message: '留言太长',trigger:'onBlur' }]">
                    </van-field>
                </van-cell-group>

                <template v-if="form.ywcj.id != 7185">
                    <!-- 发票 -->
                    <van-cell-group border class="marginTop cell-group">
                        <div class="title">发票上传 <div class="right" @click="$toast('1.发票上传功能需要选择消费类型\n2.左滑发票可以填充或删除')"><van-icon size="20px" name="info-o" /></div></div>
                        <div class="content">
                            <van-uploader :after-read="afterRead" :before-read="beforeRead" accept="image/*" :disabled="uploading || !form.xflx.fylxmc">
                                <van-button native-type="button" bgless style="width:100%" 
                                :loading="uploading" loading-text="正在上传中..."
                                block borderless type="info" plain icon="photograph">上传发票
                                </van-button>
                            </van-uploader>
                            <div v-for="el in fp_info" :key="el.id">
                                <fapiao-item  :fapiao="el" @fp-fill="onFapiaoFill" @fp-delete="onFapiaoDelete" @fp-click="onFapiaoClick" > </fapiao-item>
                            </div>
                            <div class="fapiao_total" v-if="fp_info.length > 0">
                                <div class="left" @click="onCopyMoney()">
                                    <small>总计:</small>￥
                                    <big>{{totalFapiaoMoney}}</big>
                                </div>
                                <div class="right">
                                    <van-button type="info" native-type="button" @click="fillTotalMoney" size="mini">填充总金额</van-button>
                                </div>
                            </div>
                        </div>
                    </van-cell-group>
                    <!-- 分摊 -->
                    <van-cell-group border class="marginTop cell-group" v-if="form.ywcj.id != 7188">
                        <div class="title">分摊信息</div>
                        <div class="content" @click="openFentang()">
                            <van-button v-if="!form.ft_info.length" native-type="button" block borderless type="info"
                                plain @click="openFentang()" icon='balance-list'>
                                新建分摊</van-button>
                            <div v-if="form.ft_info.length">
                                <van-cell class="avg_cell" border :title="el.cdbm.name" v-for="el in form.ft_info"
                                    :key="el.cdbl.id">
                                    <span>￥{{el.cdje}}</span>
                                    <span>({{el.cdbl}}%)</span>
                                </van-cell>
                            </div>
                        </div>
                    </van-cell-group>
                </template>
                <!-- 底部保存 -->
                <div class="van-tabbar--fixed bottom_saved_buttons" v-if="!edit_mode">
                    <van-row>
                        <van-col span="10">
                            <van-button @click="onAddSaveAgain" native-type="button" type="default" borderless
                                style="background:rgb(247,247,247)" block icon="certificate">再记一笔</van-button>
                        </van-col>
                        <van-col span="1"></van-col>
                        <van-col span="13">
                            <van-button @click="onAddSave" native-type="button" type="info" borderless block icon="success">确认保存
                            </van-button>
                        </van-col>
                    </van-row>
                </div>
                 <div class="van-tabbar--fixed bottom_saved_buttons" v-if="edit_mode">
                    <van-row>
                        <van-col span="7">
                            <van-button @click="onEditRemove" native-type="button" type="default" borderless
                                style="background:rgb(247,247,247)" block icon="delete">移除</van-button>
                        </van-col>
                        <van-col span="1"></van-col>
                        <van-col span="16">
                            <van-button @click="onEditSave" native-type="button" type="info" borderless block icon="edit">确认保存
                            </van-button>
                        </van-col>
                    </van-row>
                </div>
            </van-form>
        </div>
        <van-popup :overlay="false" v-model="isErjiRoute" position="right" :style="{ width: '100%',height:'100%' }"
            get-container="body" :lock-scroll="!isErjiRoute">
            <transition name="van-fade">
                <router-view :formdata="form" @chooseXflx="chooseXflx" @chooseWldw="chooseWldw" @chooseHxfy="chooseHxfy" ></router-view>
            </transition>
        </van-popup>
    </div>
</template>
<script>
    import {
        bill_get_ywcj,
        bill_set_data,
        bill_add_get_weidaopiao_money,
        bill_edit_get_danjuInfo,
        parse_info_from_base64,
        bill_del_danju,
        bill_add_get_wldw_by_name
    } from 'api'
    import {
        dateFormat,
        dialogConfirm,
        copyText
    } from '@/utils/utils'
    import {
        mapGetters
    } from 'vuex'
    import pictureCompress from 'picture-compressor-plus';
    import { ImagePreview } from 'vant';
    import fapiaoHandler from './../../utils/fapiao';
    export default {
        data() {
            return {
                // ywcjColumns: [],
                ywcjStatus: false,
                dprq_popup: new Date(),
                dprqStatus: false,
                minDate: new Date(2015, 0, 1),
                maxDate: new Date(),
                initOK: false,
                fp_info: [],
                form: {
                    xflx: {},
                    duisi: true,
                    ywcj: {},
                    bcdp: "",
                    dprq: new Date(),
                    wanlai_danwei: {},
                    liuyan: '',
                    ft_info: [],
                    wdpje:0,
                    wdp_list: [],
                    fp_info:[]
                },
                saveId: [],
                update_id: this.$route.query.dj_id || null,
                uploading:false
            }
        },
        components:{
            fapiaoItem:()=>import('./../../components/Bill_FapiaoItem')
        },
        watch: {
            async 'form.ywcj.id'(val) {
                await this.$nextTick();
                this.$refs.form && this.$refs.form.resetValidation();
                this.getHexiaoFeiyong();
            },
            async 'form.xflx.id'(val) {
                await this.$nextTick();
                this.$refs.form && this.$refs.form.resetValidation();
            },
        },
        computed: {
            isErjiRoute: {
                get() {
                    return this.$route.path.startsWith('/bill/add/')
                },
                set(val) {}
            },
            ...mapGetters({
                ywcjColumns: 'ywcjList',
                regRules: 'regRules'
            }),
            edit_mode(){
                return this.$route.query.hasOwnProperty('dj_id') || false
            },
            totalFapiaoMoney(){
                return this.fp_info.reduce((t, el) =>{
                    t += Number(el.invoice_money);
                    return t;
                }, 0).toFixed(2)
            }
        },
        created() {
            if (this.isErjiRoute && !this.$route.params.avoidRefresh) {
                //二级路由处理
                // this.$router.push({
                //     name: 'bill_add'
                // })
            }
            this.form.ywcj = this.ywcjColumns[0];
            if(this.update_id) {
                var loading = this.$toast.loading({message:'加载费用',duration:0})
                bill_edit_get_danjuInfo(this.update_id).then(r=>{
                    var data = r.data || {};
                    this.form = {
                        bcdp: Number(data.je).toFixed(2),
                        dprq: new Date(data.rq),
                        ft_info: data.ft_info.map(el=>{
                            el.cdje = Number(el.je).toFixed(2);
                            return el
                        }),
                        liuyan: data.bz || "",
                        wanlai_danwei: data.wanlai_danwei || {},
                        xflx: data.xflx,
                        ywcj: data.ywcj,
                        wdpje: 0,
                        duisi: data.zhbj == 2,
                        wdp_list: data.wdp_list.filter(Boolean)
                    };
                    this.fp_info = data.fp_info.map(el => {
                        var obj = JSON.parse(el.imgjson_info);
                        for(var o in obj){
                            el[o] = obj[o]
                        }
                        el.imgurl = el.imgurl;
                        el.id = el.id;
                        return el
                    });
                    this.getHexiaoFeiyong();
                }).catch(e=>e).finally(()=>{
                    loading.close();
                })
            }
        },
        methods: {
            open_hexiao(){
                this.$refs.form.validate('xfje').then(r=>{
                    this.go2sub({name: 'bill_add_hexiao'})
                })
            },
            onPreviewFapiao(el){
                ImagePreview({
                    images: [el],
                    closeable: true,
                });
            },
            fillTotalMoney(){
                this.form.bcdp = this.totalFapiaoMoney;
                this.$refs.form.scrollToField('xfje',false);
                this.$toast.success('填充金额成功!');
            },
            async beforeRead(file){
                if(!file.type.includes('image'))  return this.$toast('暂时只支持图片文件!');
            },
            onCopyMoney(){
                copyText(this.totalFapiaoMoney);
                this.$toast.success('已复制总金额');
            },
            afterRead(object){
                this.uploading = true;
                pictureCompress({
                    img: object.content,
                    width: 1200,
                    height: 1200,
                    fit: 'scale',
                    type: 'jpg'
                }).then(res => {
                    parse_info_from_base64(res.img.replace(/^data:image\/\w+;base64,/, "")).then(r=>{
                        try{
                            var json = JSON.parse(r.data.data);
                            var imgurl = r.data.imgPath;
                            var ret = json.data.ret.find(el=> el.templateSign != 'others') || json.data.ret[0];
                            var obj = fapiaoHandler(ret);
                            if(this.fp_info.length == 0) {
                                this.onFapiaoFill(obj, false);
                            }
                            console.log(ret);
                            obj.imgurl = imgurl.replace('../','http://webt.lilang.com:9001/');
                            obj.imgjson_row = JSON.stringify(ret);
                            obj.imgjson_info = JSON.stringify(obj);
                            this.fp_info.push(obj);
                            console.log(json)
                        }catch(e){
                            console.error(e);
                            this.$toast.fail('发票格式错误!')
                        }
                    }).catch(e=>{
                        var errmsg = e.message || '识别失败, 请稍后重试!'
                        errmsg = errmsg.replace('Error:', '');
                        this.$toast.fail(errmsg)
                    }).finally(()=>{
                        this.uploading = false
                    })
                }).catch(e=> {
                    // console.log(e);
                    this.$toast.fail('图片压缩失败, 请稍后重试!')
                })
       
            },
            onFapiaoClick(el){
                console.log(el);
                this.onPreviewFapiao(el.imgurl)
            },
            onFapiaoDelete: dialogConfirm(function(i){
                this.fp_info.splice(i, 1)
            }),
            async onFapiaoFill(obj, showToast = true){
                if(obj.type == 'others') {
                   showToast && this.$toast('暂不支持未知发票!')
                   return false;
                }
                this.form.bcdp = obj.invoice_money;
                this.form.dprq = obj.invoice_date;
                var zhmc = obj.invoice_wanlai;
                if(!this.form.duisi && zhmc) {
                    bill_add_get_wldw_by_name(zhmc).then(r=>{
                        if(r.data.length > 0) {
                            this.form.wanlai_danwei = r.data[0];
                            showToast && this.$toast.success('智能填充完成!')     
                        }else {
                            return Promise.reject(false);
                        }
                    }).catch(e=> {
                        copyText(zhmc);
                        this.$toast('找不到此往来单位,请手动查找!');
                        return false;
                    })
                }else {
                    showToast && this.$toast.success('智能填充完成!')                    
                }
            },
            getHexiaoFeiyong(){
                 if(this.form.ywcj.id == 7189 || this.form.ywcj.id == 7186) {
                    var zhmc = this.form.wanlai_danwei.zhmc;
                    bill_add_get_weidaopiao_money({zhmc}).then(r=>{
                        console.log(r);
                        this.form.wdpje = Number(r.data).toFixed(2);
                    }).catch(e=>{
                        console.log(e);
                    })
                }
            },
            go2sub(route) {
                route = Object.assign(route, {
                    params: {
                        avoidRefresh: true
                    }
                })
                this.$router.push(route)
            },
            onMoneyBlur(){
                this.$refs.form.validate('xfje').then(r => {
                    this.form.bcdp = Number(this.form.bcdp).toFixed(2);
                }).catch(e => {
                    this.$toast.fail(e.message);
                })
            },
            
            async onEditRemove(){
                var isDelete = await this.$dialog.confirm({ title: '删除', message: '是否删除?', }) .then(r => true).catch(e=>false);
                if( !isDelete ) return;
                bill_del_danju(this.update_id).then(r => {
                    this.$toast.success('删除成功');
                    this.$router.push({
                        name: 'account',
                        params: {
                            del_id: this.update_id
                        }
                    })
                }).catch(e => e)
            },
            async onEditSave(){
                this.$refs.form.validate().then(r => {
                    this.onSubmit(this.update_id).then(async r => {
                        this.$router.push({
                            name: 'account',
                            params: {
                                update_id: this.update_id
                            }
                        })
                    })
                })
            },
            async onAddSave() {
                this.$refs.form.validate().then(r => {
                    this.onSubmit().then(r => {
                            this.$router.push({
                                name: 'account',
                            }).then(r=>{
                                this.$eventBus.$emit('refreshView')
                            })
                    })
                })
            },
            async onAddSaveAgain() {
                this.$refs.form.validate().then(r => {
                    this.onSubmit().then(async r => {
                        this.$eventBus.$emit('refreshView')
                    })
                })
            },
            onSubmit(update_id) {
                var djlx = this.form.ywcj.djlx;
                var djlb = this.form.ywcj.id;
                var ny = dateFormat(this.form.dprq, 'yyyyMM');
                var rq = dateFormat(this.form.dprq, 'yyyy-MM-dd');
                var zhid = this.form.wanlai_danwei.id;
                var zhmc = this.form.wanlai_danwei.zhmc;
                var je = this.form.bcdp;
                var zhbj = '0';
                var bz = this.form.liuyan;
                var fydlmc = this.form.xflx.fydlmc;
                var fylxmc = this.form.xflx.fylxmc;
                var fylxid = this.form.xflx.id;
                var dgbs = this.form.duisi? 2 : 1;
                var ft_info = this.form.ft_info;
                var fp_info = this.fp_info;
                var wdp_list = this.form.wdp_list;
                var obj = { djlx, djlb, rq, zhid, je, zhbj, bz, fydlmc, fylxmc, fylxid, zhmc, dgbs, ny, ft_info, wdp_list, fp_info }
                if(update_id) {
                    obj.update_id = update_id
                }
                return new Promise((res, rej) => {
                   return bill_set_data(obj).then(r => {
                        if (r.errcode == 0) {
                            this.saveId.push(r.data.id);
                            this.$toast.success('保存成功!');
                            res(true);
                        } else {
                            this.$toast.fail('保存失败!');
                            rej(false)
                        }
                    })
                })
            },
            openFentang() {
                return this.$refs.form.validate('xfje').then(r => {
                    this.$router.push({
                        name: 'bill_add_fentang'
                    })
                }).catch(e => {
                    this.$refs.form.scrollToField('xflx');
                    this.$toast.fail(e.message);
                })
            },
            chooseXflx(val) {
                this.form.xflx = val;
                this.form.duisi = val.dgbs == 0;
                this.$store.dispatch('appGoback');
            },
            chooseWldw(val) {
                this.form.wanlai_danwei = val;
                this.$store.dispatch('appGoback');
                this.getHexiaoFeiyong();
            },
            chooseHxfy(val){
                this.form.wdp_list = val;
                this.$store.dispatch('appGoback');
            },
            onYwcjConfirm(value) {
                this.form.ywcj = value;
                this.ywcjStatus = false;
            },
            dataFormatter(type, val) {
                return type === 'year'? `${val}年`: type === 'month' ?  `${val}月`: type==='day' ? `${val}日`: val;
            },
            onDateConfirm() {
                this.dprqStatus = false;
                this.form.dprq = this.dprq_popup;
            },
            openDatePopup() {
                this.dprqStatus = true;
                this.dprq_popup = this.form.dprq;
            }
        }
    }
</script>
<style lang="less">
    .bcdp-item {
        .flex();

        span {
            padding-right: 10px;
            position: relative;
            color: #323233;

            &::after {
                content: '';
                width: 2px;
                height: 20px;
                background: rgba(128, 128, 128, 0.313);
                display: block;
                position: absolute;
                right: 0;
                top: 50%;
                margin-top: -10px;
            }
        }

        input {
            border: none;
            padding-left: 10px;
            background: transparent;
            width: 100%;
        }
    }

    .bill_add_container {
        .bill_add_wrapper {
            .van-form {
                padding-bottom: 100px;
                .van-cell--required::before{
                    left: 6px;
                    margin-top: 3px;;
                }
            }

            .xflx {
                .van-field__left-icon i {
                    font-size: 26px;
                    color: #777;
                    margin-left: 5px;
                }
            }

            .switch-cell {
                .flex(@j: space-between; );
                padding: 10px 5px 10px;
                background: white;
                margin-botttom: -10px;
                font-size: 13px;

                .left {
                    border-left: 5px solid @j_main_color;
                    padding-left: 6px;
                    font-size: 600;
                }
            }

            .van-cell:not(.avg_cell) {

                .van-cell__title,
                .van-field__label {
                    margin-right: 0;
                    width: 100px;
                    flex: none;
                }

                .van-cell__value {
                    flex: 1;
                    text-align: left;
                    color: #323233
                }
            }

            .avg_cell {
                .van-cell__title {
                    .textRowOverflow(1);
                }
            }

            .marginTop {
                margin-top: 10px;
            }



            .cell-group {
                .title {
                    @height: 36px;
                    font-weight: 700;
                    font-size: @height /2.8;
                    line-height: @height;
                    height: @height;
                    padding-left: 18px;
                    border-bottom: 1px solid #ebedf0;
                    position: relative;
                    &::before{
                        content: '';
                        width: 5px;
                        height: 36%;
                        background: @j_main_color;
                        display: block;
                        position: absolute;
                        top: 32%;
                        left:6px;
                    }
                    .right{
                        float:right;
                        padding-right: 18px;
                        .flex();
                        height: 100%;
                    }
                }

                .content {
                    // height: 60px;;
                    .hexiao-tip{
                        padding:10px 5px ;
                        font-size:90%;
                        text-align: center;
                        .van-notice-bar{
                            width: 220px;
                            margin: 0 auto;
                        }
                    }
                }
            }
            .van-uploader{
                width: 100%;;
            }
            .van-uploader__input-wrapper{
                flex:1;
            }
            .fapiao_total{
                .flex(@j:space-between);
                .border(top);
                padding: 8px 10px;
            }

            

        }


    }
</style>