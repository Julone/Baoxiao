<template>
    <div>
        <van-button :size="size" borderless bgless :round="round" 
            type="info" :plain="!white" @click="onClick" style="zoom:1.1">
            <span v-if="activeAccount" class="flex">
               {{activeAccount.khlbmc}} <van-icon v-if="!disabled" name="arrow-down" size="3vw" style="margin-left:1vw"/>
            </span>
            <span v-else>
                选择套账 <van-icon name="arrow-down"  size="3vw" style="margin-left:1vw"/>
            </span>
        </van-button>
        <van-popup v-model="show" get-container="body" position="bottom">
            <van-picker :key="refreshToken" title="套账切换" show-toolbar visible-item-count="10" item-height="34" :default-index="activeIndex"
                :columns="accountColumns" @confirm="onConfirm" @cancel="onCancel" @change="onChange" />
        </van-popup>
    </div>
</template>
<script>
    import {
        mapGetters
    } from 'vuex'
    export default {
        data() {
            return {
                show: false,
                refreshToken: 0
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
                return this.accountList.map(el => ` [${el.khlbmc}] ${el.khdm}.${el.khmc}`)
            },
            activeIndex(){
                var index = this.accountList.findIndex(acc => acc.khid == this.activeAccount.khid);
                return index == -1? 0 : index;
            }
        },
        methods: {
            onClick(){
                if(this.disabled) return this.$toast( { message: this.activeAccount.khmc, icon: 'cluster-o' });
                this.show = true;
            },
            onConfirm(value, index) {
                this.$store.dispatch('choose_active_account', this.accountList[index]);
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