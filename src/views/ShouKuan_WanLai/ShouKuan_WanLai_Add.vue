<template>
    <div class="container">
        <van-nav-bar :title="c_title" left-text="返回" left-arrow @click-left="$store.dispatch('appGoback')" />
        <div class="main-content">
            <van-form ref="form" w100 @submit="onSubmit" :show-error="false">
                <van-cell-group class="marginBottom">
                    <van-field v-model="zhlx" clickable readonly name="ywcj" @click="popupShow = true" required
                        is-link label="帐户类型">
                    </van-field>
                    <van-popup v-model="popupShow" position="bottom">
                        <van-picker show-toolbar :columns="zhlxList" @confirm="onPopupConfirm"
                            @cancel="popupShow = false">
                        </van-picker>
                    </van-popup>
                </van-cell-group>
                <van-cell-group v-if="zhlx == '银行账户'">
                    <van-field label="户名" v-model="form.hm" placeholder="请输入户名" required name="hm" :rules="[{ required: true, message: '请输入户名' }]"></van-field>
                    <van-field label="银行卡号" v-model="form.yhkh" placeholder="请输入帐号" required name="'zh" :rules="[{ required: true, message: '请输入帐号' }]"></van-field>
                </van-cell-group>
                  <van-cell-group class="marginTop" v-if="zhlx == '银行账户'">
                    <van-field label="开户银行" v-model="form.khyh.yhname" is-link  required 
                    name="khyh" :rules="[{ required: true, message: '请选择开户银行', trigger: 'onChange' }]"
                    readonly placeholder="请选择开户银行" 
                    @click="go2SubPage('khyh')"
                    >

                    </van-field>
                    <van-field label="开户省市" v-model="form.khss.shi" is-link  required 
                    name="khss" :rules="[{ required: true, message: '请选择开户省市',trigger: 'onChange' }]"
                    readonly placeholder="请选择开户省市" 
                    @click="go2SubPage('khss')"
                    >

                    </van-field>
                    <van-field label="分支行" v-model="form.fzh.khyh" is-link  required 
                    name="fzh" :rules="[{ required: true, message: '请选择分支行',trigger: 'onChange' }]"
                    readonly placeholder="请选择分支行"
                    @click="go2SubPage('fzh')"
                    >

                    </van-field>
                </van-cell-group>
               
                <!-- 底部保存 -->

                <div class="van-tabbar--fixed bottom_saved_buttons">
                    <van-row v-if="!is_editmode">
                        <van-col span="24">
                            <van-button type="info" borderless block>
                                保存
                            </van-button>
                        </van-col>
                    </van-row>
                     <van-row v-if="is_editmode">
                        <van-col span="8">
                            <van-button type="" native-type="button"
                            @click="removeItem()"
                             borderless block icon="delete">
                                移除
                            </van-button>
                        </van-col>
                        <van-col span="1" ></van-col>
                        <van-col span="15">
                            <van-button type="info" borderless block icon="success">
                                保存
                            </van-button>
                        </van-col>
                    </van-row>
                </div>
            </van-form>
        </div>
        <van-popup :overlay="false" get-container="body"  v-model="isSubPage" :lock-scroll="!isSubPage" position="right" :style="{ width: '100%',height:'100%' }" >
            <transition name="van-fade">
                <keep-alive>
                    <component :is="curComponent" @closed="isSubPage=false"
                    @choose_khyh="choose_khyh" @choose_khss="choose_khss" @choose_fzh="choose_fzh" :formdata="form"
                    ></component>
                </keep-alive>
            </transition>
        </van-popup>
    </div>
</template>
<script>
    import {
        skzh_set_skzh_or_wldw,
        skzh_get_by_id,
        skzh_del_by_id
    } from 'api'
    import {
        mapGetters
    } from 'vuex'

    export default {
        data() {
            return {
                popupShow: false,
                zhlxList: ['银行账户'],
                zhlx: '银行账户',
                form: {
                    hm: '',
                    yhkh: '',
                    khyh: {},
                    khss: {},
                    fzh: {}
                },
                query_id: this.$route.query.id || null,
                curComponent: '',
                isSubPage: false,
            }
        },
        props: {
            is_wldw: {
                default: false,
                type:Boolean
            }
        },
        components: {
            khyh: ()=> import('./ShouKuan_WanLai_Add_KHYH'),
            khss: ()=> import('./ShouKuan_WanLai_Add_KHSS'),
            fzh: () => import('./ShouKuan_WanLai_Add_FZH')
        },
        computed: {
        
            is_editmode(){
                return this.$route.query.id || false
            },
            c_title(){
                if(this.is_wldw) {
                    return (this.is_editmode? '修改': '添加') + '往来单位';
                }else {
                    return (this.is_editmode? '修改': '添加') + '收款账号'
                }
            }
        },
        methods: {
            choose_khyh(val){
                this.form.khyh = val;
                this.isSubPage = false
            },
            choose_fzh(val){
                this.form.fzh = val;
                this.isSubPage = false
            },
            choose_khss(val){
                this.form.khss = {
                    shen: val[0],
                    shi: val[1]
                };
                this.isSubPage = false
            },
           
            async go2SubPage(view){
                console.log(view)
                if(view == 'fzh') {
                    var proArr = ['khyh','khss'].map(el=> this.$refs.form.validate(el));
                    var rs = await Promise.all(proArr).then(r=>true).catch(e=>false);
                    if(rs == false) return this.$toast.fail('请先选择开户银行和省市!')
                }
                this.isSubPage = true;
                this.curComponent = view
            },
            onPopupConfirm(val, index) {
                this.form.zhlx = val;
                this.popupShow = false;
            },
             removeItem(){
                 this.$dialog.confirm({
                        title: '删除',
                        message: '是否删除?',
                    })
                    .then(() => {
                        return skzh_del_by_id(this.query_id).then(r => {
                            this.$toast.success('删除成功!');
                            this.$emit('remove_done')
                        }).catch(e => e)
                    })
                    .catch(() => {
                        // on cancel
                    });
            },
            onSubmit() {
                var data = this.form;
                if(this.is_editmode) data.update_id = this.query_id;
                skzh_set_skzh_or_wldw(data,this.is_wldw).then(r=>{
                    this.$toast.success(this.c_title + '成功!')
                    this.$emit('save_done');
                })
            }
        },
        created() {
            if(this.query_id) {
                skzh_get_by_id(this.query_id).then(r=>{
                    console.log(r)
                    this.form = r.data;
                })
            }
        },
    }
</script>
<style lang="less" scoped>
    .container {
        height: 100%;
        display: flex;
        overflow: hidden;
        flex-direction: column;
        background: @app_bg_color;

        .van-nav-bar {
            flex: none;
        }

        .main-content {
            .flex(@a: strech);
            flex: 1;
            height: 100%;
            // overflow: auto;
            padding: 0 0px;
            ;

            .card {
                .wh100(@h: fit-content);
                padding: 10px 0px;
                ;
                background: rgb(50, 136, 221);
                color: white;
                padding: 10px 20px;
                font-size: 16px;
                border-radius: 5px;

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