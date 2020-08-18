<template>
    <van-swipe-cell class="fapiao_container">
        <van-cell clickable class="fapiao">
            <template #title>
                <div class="fapiao-title" @click="$emit('fp-click',fapiao)">
                    <div class="left">
                        <img :src="fapiao.imgurl" @click="onPreviewFapiao(fapiao.imgurl)" width="40" height="40" alt="">
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
                <van-button @click="$emit('fp-delete',fapiao)" native-type="button" type="danger" icon="cross">
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
    </van-swipe-cell>
</template>
<script>
    export default {
        data() {
            return {}
        },
        props: ['fapiao'],
        methods: {
            onFapiaoClick() {},
            onPreviewFapiao() {},
            onFapiaoFill() {},
            onFapiaoDelete() {},
            onFapiaoEdit(){
                this.$toast('暂未实现')
            }
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