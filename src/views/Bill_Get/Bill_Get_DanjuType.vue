<template>
    <div class="danju-type-container" :style="{height: app_height +'px'}">
        <van-nav-bar title="请选择单据类型" left-text="返回" left-arrow @click-left="$store.dispatch('appGoback')" />
        <div class="sklafjal">
            <van-collapse v-model="activeCollpase" style="width:100%">
              <van-collapse-item title="单据类型" name="1" >
                  <van-cell v-for="d in collapseList" :key="d.id" :to="{name: 'bill_get', query:{ke: d}}" is-link>{{d.mc}}</van-cell>
              </van-collapse-item>
            </van-collapse>
        </div>
    </div>
</template>
<script>
    import {
        bill_get_ywcj
    } from 'api'
    import {
        mapGetters
    } from 'vuex'

    export default {
        data() {
            return {
                activeCollpase: ['1'],
                collapseList: []
            }
        },
        computed: {
            ...mapGetters(['app_height'])
        },
    
        created() {
            bill_get_ywcj().then(r=>{
                this.collapseList =  r.data;

            })
            
          
        }
    }
</script>
<style lang="less">
    .danju-type-container {
        // .flex(@d:column;@j:space-around);
        height: 100vh;
        display: flex;
        overflow: hidden;
        flex-direction: column;

        .van-nav-bar {
            flex: none;
        }

        .sklafjal {
            .flex(@a: strech; @j: space-between);
            flex: 1;
            height: 100%;

            .van-sidebar {
                width: 100px;
            }

            .side-right {
                width: calc(100vw - 100px);
                height: 100%;
                overflow-y: auto;

                .van-cell__title {
                    padding-left: 10px;
                }
            }

        }

    }
</style>