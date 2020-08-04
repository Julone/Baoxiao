<template>
    <div>
        <van-button :size="size" borderless bgless :round="round" 
            type="info" :plain="!white" @click="show = true" style="zoom:1.1">
            <span v-if="activeAccount" class="flex">
               {{activeAccount.khlbmc}}  <van-icon name="arrow-down" size="3vw" style="margin-left:1vw"/>
            </span>
            <span v-else>
                选择套账 <van-icon name="arrow-down" size="3vw" style="margin-left:1vw"/>
            </span>
        </van-button>
        <van-popup v-model="show" get-container="body" position="bottom">
            <van-picker title="套账切换" show-toolbar visible-item-count="10" item-height="34" default-index="0"
                :columns="columns" @confirm="onConfirm" @cancel="onCancel" @change="onChange" />
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
                show: false
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
        },
        computed: {
            ...mapGetters(['accountList', 'activeAccount']),
            columns() {
                return this.accountList.map(el => ` [${el.khlbmc}] ${el.khdm}.${el.khmc}`)
            }
        },
        methods: {
            onConfirm(value, index) {
                this.$store.dispatch('choose_active_account', this.accountList[index]);
                this.show = false;
            },
            onChange(picker, value, index) {

            },
            onCancel() {
                this.show = false;
            },
        }
    }
</script>