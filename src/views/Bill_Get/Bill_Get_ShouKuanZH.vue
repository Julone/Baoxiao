<template>
    <div class="wanlai-danwei-container" :style="{height: app_height +'px'}">
        <van-nav-bar title="选择收款账户" left-text="返回" left-arrow @click-left="$store.dispatch('appGoback')" />
        <div class="main-content">
            <div v-for="el in card" :key="el.id" class="card" @click="$emit('select_skzh', el)">
                <div class="title">
                    银行户名
                </div>
                <div class="account">
                    {{el.account}}
                </div>
                <div class="divider"></div>
                <div class="label">{{el.label}}</div>
           
                    <van-icon class="icon" name="coupon-o" />
            
            </div>
        </div>
    </div>
</template>
<script>
    import {
        bill_get_department
    } from 'api'
    import {
        mapGetters
    } from 'vuex'

    export default {
        data() {
            return {
                list: [],
                card: [{
                    id:2342,
                    account: '62290815306223598741',
                    label: '未填写支行信息'
                    
                }]
            }
        },

        computed: {
            curTypeList() {
                return this.typeList[this.activeKey]
            },
            ...mapGetters(['app_height'])
        },
        created() {
            bill_get_department().then(r => {
                if (r.errcode == 0 && r.data.length) {
                    this.list = r.data.map(el => el)
                }
            })

        },

        activated() {

        },
    }
</script>
<style lang="less">
    .wanlai-danwei-container {
        // .flex(@d:column;@j:space-around);
        height: 100vh;
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
            overflow: scroll;
            padding: 20px;;
            .card{
                .wh100(@h:fit-content);
                padding: 10px 0px;;
                background: rgb(50, 136, 221);
                color: white;
                padding: 10px 20px;
                font-size: 16px;
                border-radius: 5px;
                // .createBox(@p: 10px 20px;);
                .title{
                    line-height: 2em;
                }
                .account{
                    line-height: 1.5em;
                }
                .divider{
                    border: 1px dashed rgba(255, 255, 255, 0.265);
                }
                .label{
                    font-size: .6em;
                }
                .icon{
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