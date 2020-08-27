<template>
    <van-swipe-cell class="fapiao_container">
        <van-cell clickable class="fapiao">
            <template #title>
                <div class="fapiao-title" @click="onFapiaoClick()">
                    <div class="left">
                        <img :src="fapiao.imgurl" @click.stop="onPreviewFapiao(fapiao.imgurl)" width="40" height="40" alt="">
                    </div>
                    <div class="right">
                        <span class="fp-title">{{fapiao.title}}</span>
                        <span class="date">{{fapiao.left_title1}}</span>
                        <span class="seller">{{fapiao.left_title2}}</span>
                    </div>
                </div>
            </template>
            <div class="money">
                <div class="total" v-text="fapiao.right_title1"></div>
                <div class="shui" v-text="fapiao.right_title2"></div>
            </div>
        </van-cell>
        <template #right>
            <div class="swipe-item">
                <van-button @click="$emit('fp-fill',fapiao)" native-type="button" type="primary" icon="edit">
                    填充
                </van-button>
                <van-button @click="$emit('fp-delete')" native-type="button" type="danger" icon="cross">
                    删除
                </van-button>
            </div>
        </template>
        <template #left>
            <div class="swipe-item">
                <van-button @click="onFapiaoEdit()" native-type="button" type="info" icon="edit">
                    编辑
                </van-button>
            </div>
        </template>
        <van-popup v-model="showDialog" closeable safe-area-inset-bottom get-container="body" position="bottom" :style="{ height: '80%' }">
            <van-form  class="fapiao-detail">
                <h2 class="marginTop" align="center">发票信息预览</h2>
                <van-divider></van-divider>
                <!-- <template v-if="fapiao.type == 'vat_invoice'">
                   <div class="fapiao-info">
                        <h1>{{fapiao.title}}</h1>
                        <van-field label="发票代码" input-align="right" v-model="getItem('InvoiceCode').word"></van-field>
                        <van-field label="发票号码" input-align="right" v-model="getItem('InvoiceNum').word"></van-field>
                        <van-field label="开票日期" input-align="right" v-model="getItem('InvoiceDate').word"></van-field>
                        <van-field label="校验码" input-align="right" v-model="getItem('CheckCode').word"></van-field>
                        <van-field label="发票总额" input-align="right" v-model="getItem('AmountInFiguers').word"></van-field>
                        <van-field label="税前金额" input-align="right" v-model="getItem('TotalAmount').word"></van-field>
                        <van-field label="税额" input-align="right" v-model="getItem('TotalTax').word"></van-field>
                   </div>
                   <div class="fapiao-info">
                        <h1>购买方</h1>
                        <van-field label="发票代码" input-align="right" v-model="getItem('InvoiceCode').word"></van-field>
                        <van-field label="发票号码" input-align="right" v-model="getItem('InvoiceNum').word"></van-field>
                        <van-field label="开票日期" input-align="right" v-model="getItem('InvoiceDate').word"></van-field>
                        <van-field label="校验码" input-align="right" v-model="getItem('CheckCode').word"></van-field>
                        <van-field label="发票总额" input-align="right" v-model="getItem('AmountInFiguers').word"></van-field>
                        <van-field label="税前金额" input-align="right" v-model="getItem('TotalAmount').word"></van-field>
                        <van-field label="税额" input-align="right" v-model="getItem('TotalTax').word"></van-field>
                   </div>
                </template> -->
                <!-- <pre>
                    <div v-for="el in fapiao.detail" :key="el.word_name" v-html="el.word_name + ' : ' + el.word">
                    </div>
                </pre> -->
                <van-field style="zoom:.9"  input-align="right" size="mini" readonly label-width="10em" autosize clickable 
                v-for="el in fapiao.detail" :key="el.word_name" :label="el.word_name" v-model="el.word">
                </van-field>
            </van-form>
        </van-popup>
    </van-swipe-cell>
</template>
<script>
  import {
        ImagePreview
    } from 'vant';
    export default {
        data() {
            return {
                showDialog: false
            }
        },
        props: ['fapiao'],
        methods: {
            getItem(name){
                return this.fapiao.detail.find(el=>el.word_name == name)

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
            onFapiaoEdit(){
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
                    height: 40px;
                }

                .right {
                    .flex(@d: column; @a: flex-start);
                    font-size: 10px;
                    line-height: 13px;
                    margin-left: 10px;

                    .fp-title {
                        font-size: 12px;
                    }
                }
            }

            .money {
                font-size: 10px;
                line-height: 15px;

                .total {
                    font-size: 14px;
                    text-align: right;
                }

                .shui {
                    color: gray;
                    text-align: right;
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
</style>