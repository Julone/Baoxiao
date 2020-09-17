<template>
    <div class="app-account-switch">
        <van-button native-type="button" :size="size" borderless bgless :round="round" 
            type="info" :plain="!white" @click="onClick" :style="{zoom: zoom * 1}">
            <span class="flex" nowrap>
                <span v-if="activeAccount.khmc" :class="{'t-overflow': activeAccount.khmc.length > maxlen * 1}" >
                    {{activeAccount.khmc | subStr(0,maxlen * 1)}}
                </span>
                <span v-else class="flex" nowrap>暂无套账</span>
                <van-icon v-if="!disabled"  name="arrow-down" size="3vw" style="margin-left:1vw"/>
            </span>
        </van-button>
        <van-popup v-model="show" @open="openPopup" safe-area-inset-bottom get-container="body" position="bottom" :lazy-render="false">
            <van-picker ref="picker" title="套账切换" show-toolbar visible-item-count="10" item-height="32"
            swipe-duration="450" :default-index="activeIndex" confirm-button-text="确认更改" cancel-button-text="暂不更改"
                :columns="accountColumns" value-key="text" @confirm="onConfirm" @cancel="onCancel" @change="onChange" >
                <template #columns-bottom>
                    <van-search v-model.lazy="keyword" :show-action="false" placeholder="请输入关键词" clear-trigger="always" >
                            <template #action>
                                <van-button size="small" type="info" plain borderless @click="show = false">关闭</van-button>
                            </template>
                    </van-search>
                </template>
            </van-picker>
        </van-popup>
    </div>
</template>
<script>
    import {
        mapGetters,
        mapState,
        mapMutations
    } from 'vuex'
    export default {
        data() {
            return {
               
                refreshToken: 0,
                keyword: '',
                cIndex: 0
            }
        },
        props: {
            white: {
                default: false,
                type:Boolean
            },
            size: {
                default: 'small',
                type: String
            },
            round: {
                default: false,
                type:Boolean
            },
            disabled: {
                default: false,
                type: Boolean
            },
            zoom: {
                default: 1.1,
                type: [Number,String]
            },
            maxlen: {
                default: 4,
                type: [Number,String]
            }
        },
        computed: {
            ...mapGetters(['accountList', 'activeAccount', 'accountPickerStatus']),
            accountColumns() {
                var keyword = this.keyword.toUpperCase();
                return this.accountList.filter(el => el.text && (el.text + el.pinyin).includes(keyword))
            },
            activeIndex(){
                var index = this.accountColumns.findIndex(acc => acc.data.khid == this.activeAccount.khid);
                return index == -1? 0 : index;
            },
            show: {
                get(){
                    return this.accountPickerStatus
                },
                set(val){
                    this.set_accountPickerStatus(val);
                }
            }
        },
        methods: {
            ...mapMutations(['set_accountPickerStatus']),
            async openPopup(){
                await this.$nextTick();
                console.log('popup', this.activeIndex);
                this.$refs.picker.setColumnIndex(0,this.activeIndex)
            },
            onClick(){
                if(this.disabled) return this.$toast( { message: this.activeAccount.khmc, icon: 'cluster-o' });
                this.show = true;
            },
            onConfirm(value, index) {
                console.log(value,index);
                if( !value ){
                    return this.$toast.fail('未选择套账, 请更换选择!')
                }
                this.cIndex = index;
                this.$store.dispatch('choose_active_account', this.accountColumns[index].data);
                this.show = false;
            },
            onChange(picker, value, index) {
                // console.log(picker,value,index);
            },
            onCancel() {
                this.show = false;
            },
        }
    }
</script>
<style lang="less">
.app-account-switch{
    .t-overflow{
   mask-image: linear-gradient(to right, white 10px, white 75%, transparent)
}

}

</style>