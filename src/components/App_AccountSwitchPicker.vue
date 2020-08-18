<template>
    <div>
        <van-button :size="size" borderless bgless :round="round" 
            type="info" :plain="!white" @click="onClick" style="zoom:1.1">
            <span v-if="activeAccount" class="flex" nowrap>
               {{activeAccount.khmc | subStr(0,5)}} <van-icon v-if="!disabled" name="arrow-down" size="3vw" style="margin-left:1vw"/>
            </span>
            <span v-else>
                选择套账 <van-icon name="arrow-down" size="3vw" style="margin-left:1vw"/>
            </span>
        </van-button>
        <van-popup v-model="show" safe-area-inset-bottom  get-container="body" position="bottom">
        
            <van-picker :key="refreshToken" title="套账切换" show-toolbar visible-item-count="10" item-height="34"
            swipe-duration="400" :default-index="activeIndex" 
                :columns="accountColumns" value-key="text" @confirm="onConfirm" @cancel="onCancel" @change="onChange" >
                </van-picker>
                    <van-search v-model.lazy="keyword" show-action  placeholder="请输入关键词">
                                    <!-- <template #action>
                        <van-button size="small" type="info"
                        :loading="isUserInfoLoading"
                        loading-text="正在更新"
                        loading-size="14"
                        @click="$store.dispatch('updateAccountList')">更新套账</van-button>
                    </template> -->
            </van-search>
        </van-popup>
    </div>
</template>
<script>
    import {
        mapGetters,
        mapState
    } from 'vuex'
    export default {
        data() {
            return {
                show: false,
                refreshToken: 0,
                keyword: ''
            }
        },
        props: {
            white: {
                default: false,
                type:Boolean
            },
            size: {
                default:'small',
                type: String
            },
            round: {
                default: false,
                type:Boolean
            },
            disabled: {
                default: false,
                type: Boolean
            }
        },
        computed: {
            ...mapGetters(['accountList', 'activeAccount']),
            accountColumns() {
                var keyword = this.keyword.toUpperCase();
                return this.accountList.filter(el => (el.text + el.pinyin).includes(keyword))
            },
            activeIndex(){
                var index = this.accountColumns.findIndex(acc => acc.data.khid == this.activeAccount.khid);
                return index == -1? 0 : index;
            },
            ...mapState({
                isUserInfoLoading: s=>{
                    return s.auth.isUserInfoLoading
                }
            })
        },
        methods: {
            onClick(){
                if(this.disabled) return this.$toast( { message: this.activeAccount.khmc, icon: 'cluster-o' });
                this.show = true;
            },
            onConfirm(value, index) {
                this.$store.dispatch('choose_active_account', this.accountColumns[index].data);
                this.show = false;
            },
            onChange(picker, value, index) {
                console.log(picker,value,index);
            },
            onCancel() {
                this.show = false;
                this.refreshToken = this.refreshToken + 1;
            },
        }
    }
</script>