<template>
    <van-swipe-cell class="fapiao_container" :disabled="isUploading">
        <van-cell clickable class="fapiao" v-if="isUploading">
            <div class="fapiao-title" @click="onPreviewFapiao(uploading_info.imgurl)" slot="title">
                <div class="left">
                    <img :src="uploading_info.imgurl" alt="">
                </div>
                <div class="right">
                    <span class="fp-title"><b>{{uploading_info.success? '发票上传中':'上传出错'}}</b></span>
                    <span class="date" v-if="uploading_info.success">智能识别信息中, 请稍候... </span>
                    <span class="date" style="color: red"
                        v-if="!uploading_info.success">{{uploading_info.errmsg}}</span>
                </div>
            </div>
            <div class="btns">
                <van-button tag="div" icon="replay" type="primary" vertical v-if="!uploading_info.success"
                    @click="$emit('retryUpload')">重试</van-button>
                <van-button tag="div" icon="cross" type="danger" vertical @click="$emit('cancelUpload')">取消</van-button>
            </div>
        </van-cell>
        <van-cell clickable class="fapiao" v-if="!isUploading">
            <template #title>
                <div class="fapiao-title" @click="onFapiaoClick()">
                    <div class="left">
                        <img :src="fapiao.imgurl" @click.stop="onPreviewFapiao(fapiao.imgurl)" alt="">
                    </div>
                    <template v-if="templateIncludes(['vat_invoice', 'roll_ticket'])" type="增值税|卷票">
                        <div class="right">
                            <span class="fp-title">{{fapiao.templateName}}({{fapiao.fplx_name}})</span>
                            <span class="date">{{fapiao.invoice_date | date('yyyy年MM月dd日')}}</span>
                            <span class="seller">{{fapiao.invoice_wanlai}}</span>
                        </div>
                    </template>
                    <template v-else-if="fapiao.templateSign=='taxi'" type="出租车">
                        <div class="right">
                            <span class="fp-title">{{fapiao.templateName}}</span>
                            <span class="date">{{fapiao.invoice_date | date('yyyy年MM月dd日')}}</span>
                            <span class="seller">{{fapiao.Time || '未知时间'}}</span>
                        </div>
                    </template>
                    <template v-else-if="fapiao.templateSign=='train_ticket'" type="火车票">
                        <div class="right">
                            <span class="fp-title">{{fapiao.templateName}}</span>
                            <span class="date">始发地: {{fapiao.starting_station}}</span>
                            <span class="seller">目的地: {{fapiao.destination_station}}</span>
                        </div>
                    </template>
                    <template v-else-if="fapiao.templateSign=='travel_itinerary'" type="行程单">
                        <div class="right">
                            <span class="fp-title">{{fapiao.templateName}}</span>
                            <span class="date">{{fapiao.invoice_date | date('yyyy年MM月dd日')}}</span>
                            <span class="seller">{{fapiao.issued_by}}</span>
                        </div>
                    </template>
                    <template v-else>
                        <div class="right">
                            <span class="fp-title">其它未知发票</span>
                            <span class="date">未知发票日期</span>
                            <span class="seller">未知往来单位</span>
                        </div>
                    </template>
                </div>
            </template>
            <div class="money">
                <template v-if="templateIncludes(['vat_invoice', 'roll_ticket'])">
                    <div class="total">
                        <bill-money>{{fapiao.invoice_money}}</bill-money>
                    </div>
                    <div class="shui">价税:<bill-money>{{fapiao.se}}</bill-money>
                    </div>
                    <div class="yanzhen" @click="checkFapiao(fapiao)">
                        <van-tag v-if="fapiao.isChecking" type="info" size="mini"> 验真中 </van-tag>
                        <template v-else>
                            <van-tag v-if="fapiao.cybs" type="success" size="mini">已验真</van-tag>
                            <van-tag v-if="!fapiao.cybs" type="danger" size="mini">未验真</van-tag>
                        </template>
                    </div>
                </template>
                <template v-else-if="templateIncludes(['taxi'])">
                    <div class="total">
                        <bill-money>{{fapiao.invoice_money}}</bill-money>
                    </div>
                    <div class="shui"></div>
                </template>

                <template v-else>
                    <div class="total">
                        <bill-money>{{fapiao.invoice_money}}</bill-money>
                    </div>
                    <div class="shui"></div>
                </template>
            </div>
        </van-cell>
        <template #right>
            <div class="swipe-item">
                <van-button @click="$emit('fp-fill',fapiao)" native-type="button" type="primary" icon="edit">
                    填充
                </van-button>
                <van-button :disabled="readonly" @click="$emit('fp-delete')" native-type="button" type="danger"
                    icon="cross">
                    移除
                </van-button>
            </div>
        </template>
        <template #left>
            <div class="swipe-item">
                <van-button :disabled="readonly" @click="onFapiaoEdit()" native-type="button" type="info" icon="edit">
                    编辑
                </van-button>
            </div>
        </template>
        <van-popup v-model="showDialog" safe-area-inset-bottom get-container="body" position="bottom"
            :style="{ height: '90%' }" @open="asyncVerify()">
            <van-form class="fapiao-detail" v-if="rowJSON">
                <h3 class="fapiao-title" align="center">{{fapiao.templateName}}
                    <span v-if="fapiao.fplx_name">
                        ({{fapiao.fplx_name}})
                    </span>
                </h3>
                <template v-if="rowJSON.fpxx">
                    <div class="baseInfo cardBox" marginTop title="基本信息">
                        <van-cell title="发票代码">{{rowJSON.fpxx.fpdm}}</van-cell>
                        <van-cell title="发票号码">{{rowJSON.fpxx.fphm}}</van-cell>
                        <van-cell title="开票日期">{{rowJSON.fpxx.kprq}}</van-cell>
                        <van-cell title="校验码">{{rowJSON.fpxx.jym}}</van-cell>
                        <van-cell title="发票总额">{{rowJSON.fpxx.jshj}}</van-cell>
                        <van-cell title="税前金额">{{rowJSON.fpxx.je}}</van-cell>
                        <van-cell title="税额">{{rowJSON.fpxx.se}}</van-cell>
                    </div>
                    <div class="goumaifang cardBox" marginTop title="购买方">
                        <van-cell title="名称">{{rowJSON.fpxx.gfmc}}</van-cell>
                        <van-cell title="税号">{{rowJSON.fpxx.gfsh}}</van-cell>
                    </div>
                    <div class="xiaoshoufang cardBox" marginTop title="销售方">
                        <van-cell title="名称">{{rowJSON.fpxx.xfmc}}</van-cell>
                        <van-cell title="地址">{{rowJSON.fpxx.xfdzdh}}</van-cell>
                    </div>
                    <div class="yingshuimingxi cardBox" marginTop title="应税明细">
                        <div class="yingshuimingxi-wrapper">
                            <table class="ysmx" style="width: 100%">
                                <tr align="left">
                                    <th class="mc">名称</th>
                                    <th class="je">金额</th>
                                    <th class="se">税额</th>
                                    <th class="slv">税率</th>
                                </tr>
                                <tr v-for="el in rowJSON.fpxx.sph" :key="el.xh">
                                    <td class="mc">{{el.spmc}}</td>
                                    <td class="je">{{el.je}}</td>
                                    <td class="se">{{el.se}}</td>
                                    <td class="slv">{{el.slv}}%</td>
                                </tr>
                            </table>
                        </div>
                    </div>
                    <div class="yanzhen cardBox" marginTop title="验证结果">
                        <van-cell title="验证结果">{{rowJSON.jfbz == 'Y'?'真':'假'}}</van-cell>
                    </div>
                </template>
                <template v-else>
                    <div class="baseInfo cardBox" marginTop title="基本信息">
                        <van-cell :title="el.word_name" v-for="el in rowJSON" :key="el.word_name">{{el.word}}</van-cell>
                    </div>
                </template>
                <!-- <pre style="font-size:80%">
                    {{fapiao}}
                </pre> -->
            </van-form>
        </van-popup>
    </van-swipe-cell>
</template>
<script>
    import {
        ImagePreview
    } from 'vant';
    import {
        bill_check_fapiao
    } from 'api'

    export default {
        data() {
            return {
                showDialog: false,
                rowJSON: null
            }
        },
        props: {
            fapiao: {
                type: Object,
                required: true,
                default: () => ({})
            },
            readonly: {
                type: Boolean,
                default: false
            },
            isUploading: {
                type: Boolean,
                default: false
            },
            uploading_info: {
                type: Object
            },
            checkFapiao: {
                required: false
            }
        },
        computed: {
            templateIncludes() {
                return function (typeArray) {
                    return typeArray.includes(this.fapiao.templateSign)
                }
            }
        },
        methods: {
            getItem(name) {
                return this.fapiao.detail.find(el => el.word_name == name)

            },
            asyncVerify() {
                if (this.fapiao.needCheck) {
                    bill_check_fapiao(this.fapiao).then(r1 => {
                        this.rowJSON = JSON.parse(r1.data.rowJSON).message.content[0];
                    }).catch(e => {
                        this.rowJSON = JSON.parse(this.fapiao.rowJSON).ret;
                        this.fapiao.cybs = false;
                    })
                } else {
                    this.rowJSON = JSON.parse(this.fapiao.rowJSON).ret;
                }
            },
            onFapiaoClick() {
                this.showDialog = true;
                console.log(this.fapiao);
            },
            onPreviewFapiao(el) {
                ImagePreview({
                    images: [el],
                    closeable: true,
                });
            },
            onFapiaoFill() {},
            onFapiaoDelete() {},
            onFapiaoEdit() {
                this.$toast('暂未实现')
            },
        }
    }
</script>
<style lang="less" scoped>
    .fapiao_container {
        .fapiao {
            border-top: 2px solid #f4f5f7;
            padding: 8px 12px;

            .van-cell__title {
                flex: 2 !important;
            }

            .van-cell__value {
                flex: none;
                width: 30%;
            }

            .fapiao-title {
                .flex(@a: flex-start; @j: flex-start);
                height: auto;
                overflow: hidden;

                .left {
                    height: 43px;
                    width: 43px;
                    background: #f3f3f3;

                    img {
                        height: 43px;
                        width: 43px;
                        object-fit: cover;
                    }
                }

                .right {
                    .flex(@d: column; @a: flex-start; @j: space-around);
                    font-size: 10px;
                    line-height: 14px;
                    margin-left: 10px;
                    align-self: stretch;

                    .fp-title {
                        font-size: 12px;
                        margin-bottom: 2px;
                        ;
                    }
                }
            }

            .money {
                font-size: 10px;
                line-height: 13px;

                .total {
                    font-size: 13px;
                    font-weight: 700;
                    text-align: right;
                }

                .shui {
                    color: gray;
                    text-align: right;
                }

                .yanzhen {
                    zoom: .8;
                    text-align: right;
                }
            }

            .btns {
                .flex(@a: flex-start; @j: flex-end);

                .van-button {
                    width: 48px;
                    height: 43px;
                    margin-left: 10px;
                }
            }
        }

        .swipe-item {
            width: 100%;
            height: 100%;
            .flex();

            button {
                width: 80px;
                height: 100%;
                border-radius: 0;
                font-size: 18px;
                padding: 0;

                .van-button__content {
                    .flex(@d: column);

                    .van-button__text {
                        font-size: 10px;
                        margin: 0;
                    }
                }
            }
        }

    }

    .fapiao-detail {
        background: #f7f7f7;
        padding-bottom: 20px;
        min-height: 100%;

        .fapiao-title {
            color: #4c4c4c;
            padding:15px 0;
            position: sticky;
            top: 0;
        }

        .cardBox {
            background: #fff;
            width: 94%;
            margin: 0 auto;
            border-radius: 5px;
            ;
            position: relative;

            &::before {
                content: attr(title);
                width: 100%;
                height: 32px;
                font-size: 14px;
                line-height: 32px;
                padding-left: 20px;
                .border();
                display: block;
                box-sizing: border-box;
                font-weight: 600;
            }

            .yingshuimingxi-wrapper {
                padding: 0 20px;
                box-sizing: border-box;
            }

            .ysmx {
                color: #323233;
                border-collapse: collapse;

                th {
                    color: #797979;
                    font-size: 13px;
                }

                th,
                td {
                    height: 26px;
                    line-height: 20px;
                    vertical-align: middle;
                    padding: 3px 0;
                }

                tr {
                    .border();
                }

                td.mc {
                    width: 50%;
                    font-size: 12px;
                    color: black
                }

                td.je {
                    width: 20%;
                    font-size: 12px;
                    color: @j_main_color;
                }

                td.se {
                    width: 20%;
                    font-size: 12px;
                    color: @j_success_color;
                }

                td.slv {
                    width: 10%;
                    font-size: 12px;
                    color: @j_main_color;

                }
            }

            .border();

            .van-cell {
                padding: 7px 20px;
                ;
                background: transparent;

                .van-cell__value {
                    flex: 2;
                }
            }
        }
    }
</style>