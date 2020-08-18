<template>
    <div class="account_gray_btn_group" @click="onDrop">
        <span :class="{red:filterOptions.status != 0 }">{{ cur_label('status') }}</span>
        <small>|</small>
        <span :class="{red:filterOptions.sortable != 1 }">{{ cur_label('sortable') }}</span>
        <small>|</small>
        <span :class="{red:filterOptions.publicType != 0 }">{{ cur_label('publicType')}}</span>
        <van-icon name="arrow-down" />
        <van-popup v-model="showDrop" safe-area-inset-bottom get-container="body" position="bottom" @open="openPopup" @close="closePopup">
            <van-form class="filter-form">
                <van-field name="radio" label="状态">
                    <template #input>
                        <van-radio-group v-model="filterOptions.status" direction="horizontal">
                            <van-radio class="btn_radio" v-for="o in filterOptionsLabel.status" :key="o.id" :name="o.id">
                                {{o.label}}</van-radio>
                        </van-radio-group>
                    </template>
                </van-field>
                <van-field name="radio" label="排序分组">
                    <template #input>
                        <van-radio-group v-model="filterOptions.sortable" direction="horizontal">
                            <van-radio class="btn_radio" v-for="o in filterOptionsLabel.sortable" :key="o.id" :name="o.id">
                                {{o.label}}</van-radio>
                        </van-radio-group>
                    </template>
                </van-field>
                <van-field :border="false" name="radio" label="对公对私">
                    <template #input>
                        <van-radio-group v-model="filterOptions.publicType" direction="horizontal">
                            <van-radio class="btn_radio"  v-for="o in filterOptionsLabel.publicType" :key="o.id"
                                :name="o.id">
                                {{o.label}}
                            </van-radio>
                        </van-radio-group>
                    </template>
                </van-field>
                <div class="bottom_btn">
                    <van-button native-type="button" @click="resetForm">重置</van-button>
                    <van-button native-type="button" @click="confirmForm" type="info">确定</van-button>
                </div>
            </van-form>

        </van-popup>
    </div>

</template>

<script>
    export default {
        data() {
            return {
                filterOptionsLabel: {
                    status: [{
                            id: 0,
                            label: '未报销'
                        },
                        {
                            id: 1,
                            label: '已报销'
                        }, {
                            id: 2,
                            label: '已移除'
                        },
                    ],
                    sortable: [{
                            id: 0,
                            label: '创建时间'
                        },
                        {
                            id: 1,
                            label: '消费时间'
                        }, {
                            id: 2,
                            label: '费用类型'
                        },
                    ],
                    publicType: [{
                            id: 0,
                            label: '全部'
                        },
                        {
                            id: 1,
                            label: '对公'
                        }, {
                            id: 2,
                            label: '对私'
                        }
                    ]
                },
                filterOptions: {
                    status: 0,
                    sortable: 1,
                    publicType: 0
                },
                showDrop:false
            }
        },
        props: ["filterData"],
        computed: {
               cur_label() {
                return function (group) {
                    return this.filterOptionsLabel[group].find(el => el.id == this.filterOptions[group]).label
                }
            },
        },
        created(){
            this.filterOptions = {...this.filterData}
        },
        methods: {
            onDrop() {
                this.showDrop = true;
            },
            openPopup(){
                this.oldFilterItems = {...this.filterOptions};
            },
            closePopup(){
                this.filterOptions = this.oldFilterItems
            },
            resetForm() {
                this.filterOptions = this.$options.data().filterOptions
            },
            confirmForm() {
                this.oldFilterItems = {...this.filterOptions};
                this.showDrop = false;
                // for(var el in this.oldFilterItems) {
                //     this.filterData[el] = this.oldFilterItems[el]
                // } 不推荐直接改
                this.$emit('confirmFilter', this.oldFilterItems)
            },
        }
    }
</script>
<style lang="less">
      .filter-form {
            .van-cell {
                flex-direction: column;
            }

            .van-cell__title.van-field__label {
                font-size: 80%;
            }

            .bottom_btn {
                .flex(@j: space-between);
                padding: 10px;

                .van-button {
                    height: 30px;
                    width: auto;
                }
            }
            .btn_radio{
                border: 1px solid #e7e7e7;
                padding: 4px 13px;
                .van-radio__icon{display:none};
                &[aria-checked="true"]{
                //    background: red; 
                border: 1px solid @j_main_color;
                position: relative;
                &::after{
                    content: '\F0C8';
                    font-family: 'vant-icon';
                    position: absolute;
                    right: 0;
                    bottom: 0;
                    width: 17px;
                    height: 17px;
                    background: linear-gradient(135deg,transparent 50%, @j_main_color 50%);
                    padding-left: 7px;
    box-sizing: border-box;
    line-height: 24px;
    font-size: 10px;
    color: white;
                    }
                }
                .van-radio__label{
                    margin-left: 0;
                }
            }
        }
         .account_gray_btn_group {
                display: inline-block;
               font-size: 85%;
                padding: 5px;
                background: rgb(241, 241, 241);
                margin-left: 20px;
                .flex(@f:inline-flex);

                span {
                    margin: 0 5px;
                    &.red{
                        color: rgb(208, 32, 32);
                    }
                }
                .van-icon{
                    margin-left: 5px;
                }
                small{
                    color:#999
                }
                
                
            }

</style>