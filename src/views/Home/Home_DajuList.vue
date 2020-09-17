<template>
    <div>
        <van-cell class="marginTop" :border="false">
        <div slot="title">
            <span>我发起的 <van-tag type="primary" plain> 单据列表 </van-tag> </span>
        </div>
        </van-cell>
        <van-divider marginless></van-divider>
        <van-pull-refresh v-model="refreshing" success-text="刷新成功" @refresh="onRefresh" >
        <main>
            <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad" :error.sync="error"
            error-text="请求失败，点击重新加载" ref="vanList" :loading-text="refreshing? ' ': '加载中...'">
            <bill-danju-item v-for="(el,index) in djList" :key="el.id" :danju="el" @onDanjuRemove="onDanjuRemove(index)"
                :to="{path: '/bill/get',query: {edit_id: el.id}}"></bill-danju-item>
            </van-list>
        </main>
        </van-pull-refresh>
    </div>
</template>
<script>
  import {
    bill_get_danjuList
  } from 'api'
export default {
    name: 'danjuList',
    data(){
        return {
            djList: [],
            refreshing: false,
            loading: false,
            finished: false,
            error: false
        }
    },
    methods: {
        onDanjuRemove(index) {
            this.djList.splice(index, 1);
        },
        onLoad() {
            setTimeout(() => {
            bill_get_danjuList().then(r => {
                for(var i = 0;i<30;i++){
                // this.djList = r.data;
                // this.djList.push(...r.data)
                }
                this.djList = r.data;
            }).catch(e => {}).finally(() => {
                this.refreshing = false;
                this.loading = false;
                this.finished = true
            })
            }, 200)
        },
        onRefresh() {
            this.djList = [];
            this.finished = false;
        }
    }
}
</script>