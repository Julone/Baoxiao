<template>
    <div>
        <van-button size="small" borderless bgless type="info" plain @click="show = true">
            <span v-if="activeAccount" class="flex">
                <van-icon name="cluster-o" size="4vw" style="margin-right:1vw"/>{{activeAccount.khlbmc}}</span>
            <span v-else>选择套账</span>
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