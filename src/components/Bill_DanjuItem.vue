<template>
    <van-swipe-cell class="danju-item-container">
       <van-cell style="padding: 1vw 4.2vw"  :to="to">
        <template #title>
          <div>
            <van-tag type="primary">{{danju.djlx.mc || '未知报销单'}}</van-tag> {{danju.zhbz}}
          </div>
        </template>
        <template #label>
          <div>
            {{danju.zdrq | date('MM-dd')}}
          </div>
        </template>
        <div>
          <bill-money :money="danju.je"></bill-money>
        </div>
      </van-cell>
        <template #right>
            <div class="swipe-item" h100>
                <van-button @click="onDelete()" native-type="button" type="danger"
                    icon="cross" wh100>
                </van-button>
            </div>
        </template>
    </van-swipe-cell>
</template>
<script>
import { bill_del_danju } from 'api'
import {Cell} from 'vant'
export default {
    props: {
        danju: {
            required: true
        },
        ...Cell['props']
    },
    methods:{ 
        onDelete(){
            return bill_del_danju(this.danju.id).then(r=>{
                this.$toast.success('单据删除成功!');
                this.$emit('onDanjuRemove')
            }).catch(e=>{
                this.$toast.fail('单据删除失败!')
            })
        }
    },
    mounted(){
        console.log(Cell);
    }
}
</script>