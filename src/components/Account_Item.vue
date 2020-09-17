<template>
    <div class="account-item-container van-cell--clickable" :class="{hasSelected: item.hasSelected}">
        <div class="account-item">
            <div class="left">
                <van-checkbox class="checkbox" v-if="checkMode" v-model="item.checked"></van-checkbox>
                <div class="icon">
                    <van-icon :name="item.icon"></van-icon>
                </div>
                <div class="title">
                    <div class="title-top">
                        <span class="expenseType">{{item.expenseType}}</span>
                        <van-tag v-if="item.zhbj == 1" plain type="primary" style="zoom:.9;margin-left:5px">
                            {{item.ywcj.mc | replace("业务", "")}}</van-tag>
                        <van-tag v-if="item.cfbs" :plain="item.cfbs ==2" type="success" style="zoom:.9;margin-left:5px">
                            {{item.cfbs==1? '拆分父项': '拆分子项'}}
                        </van-tag>
                    </div>
                    <small style="color:#aaa">{{item.zhbj == 1? '往来单位：' + item.wanlai_danwei.zhmc: ''}}</small>
                </div>
            </div>
            <div class="right">
                <div class="top" v-if="item.cfbs != 1"><small>¥</small>
                    {{item.ywcj.id == 7186? '0.00' : item.money}}</div>
                <div class="top" v-if="item.cfbs == 1"><small>¥</small>
                    {{item.zje - item.cfje | moneyFormat(2)}}</div>
                <div class="bottom" v-if="item.zje">总
                    <small>¥</small>{{item.zje | moneyFormat(2)}}</div>
                <div class="bottom">消费时间 {{item.expenseTime }}</div>
            </div>
        </div>
        <div class="duigong" v-if="item.zhbj == 1">
            <div class="cell">
                <van-icon name="points" color="#1989fa" />
                {{item.ywcj.id == 7184? '本期到票': item.ywcj.id == 7186 ?'核销金额':'未到票'}}:
                <span><small>¥</small>{{item.money}}</span>
            </div>
            <div class="cell">
                <van-icon name="calender-o" color="#1989fa" />
                {{item.ywcj.id == 7184?'到票日期': '预计到票'}}:
                <span>{{item.rq | date('yyyy-MM-dd')}}</span>
            </div>
        </div>
    </div>
</template>
<script>
    export default {
        props: ['item', 'checkMode'],
        watch: {
            checkMode(val) {}
        },
        created() {}
    }
</script>
<style lang="less">
    .account-item-container {
         font-size: 14px;
        border-bottom: 1px solid rgba(128, 128, 128, 0.143);
        overflow: hidden;
        .duigong {
            width: 88%;
            padding: 2.66667vw;
            .flex(@j: space-between; );
            box-sizing: border-box;
            float: right;
            font-size: 70%;
            border-top: 1px dashed rgba(128, 128, 128, 0.1);
            padding-left: 2%;

            .cell {
                .flex();
                color:rgb(173, 174, 176);

                &>i {
                    margin-right: 4px;
                    color: #1989fa;
                }

                &>span {
                    margin-left: 5px;
                }
            }
        }

        .account-item {
            padding: 6px 10px;
            .flex(@j: space-between);
            color: black;
            border-bottom: none;

            .left {
                .checkbox {
                    margin-right: 6px;
                    flex: none;
                }

                .flex(@j: flex-start);

                .icon {
                    border: 1px dashed rgb(119, 132, 148);
                    width: 30px;
                    color: rgb(135, 149, 167);
                    height: 30px;
                    border-radius: 100px;
                    .flex();
                    font-size: 20px;
                    margin-right: 10px;
                    zoom: .9;
                    flex: none
                }

                .title {
                    border-bottom: none !important;
                    padding:0 10px;
                    height: unset !important;
                    line-height: initial !important;
                    .title-top{
                        .flex(@j:flex-start);
                        .expenseType{
                            .textRowOverflow(1)
                        }
                        .van-tag{
                            flex: none
                        }
                    }
                    
                }
            }

            .right {
                .flex(@d: column; @a: flex-end);
                flex: none;
                .bottom {
                    font-size: 65%;
                    color: gray;
                }
            }
        }
    }
</style>