<template>
  <div class="home_container">
    <header stickyTop>
      <div class="h_title">
        <div transparent></div>
        <span>首页</span>
        <accountPicker :maxlen='6' class="account-picker" white size="mini"></accountPicker>
      </div>
      <div class="h_button_group">
        <div class="h_button" @click="onHbtnClick(el)" v-for="el in h_button" :key="el.icon">
          <div class="icon">
            <van-icon :name="el.icon" />
          </div>
          <div class="label">{{el.label}}</div>
        </div>
      </div>
    </header>
    <danjuList></danjuList>
    <!-- <van-cell class="marginTop" title="清除缓存" @click="appClearCache()" disabled clickable is-link icon="delete">
    </van-cell> -->
  </div>
</template>
<script>
  import {
    mapActions,
    mapGetters
  } from 'vuex'

  export default {

    data() {
      return {
        h_button: [{
            icon: 'gold-coin',
            label: '记费用',
            to: {
              path: '/bill/add'
            }
          },

          {
            icon: 'photograph',
            label: '智能识别',
            to: {
              path: '/bill/add'
            },
            func: function(){
              llApp.WebCallWechatInvoices()
            }
          },
          {
            icon: 'bill',
            label: '提单据',
            to: {
              path: '/bill/get_type'
            }
          }
        ],
    
      }
    },
    computed: {
      ...mapGetters(['userinfo'])
    },
    components:{
      danjuList: ()=>import('./Home_DajuList.vue')
    },
    methods: {
      ...mapActions(['appAuthStart', 'appClearCache']),
      onHbtnClick(el) {
        if (el.func) return el.func();
        this.$router.push(el.to);
      },
      
    },
    created() {
      this.appAuthStart({
        apptoken: this.$route.query.apptoken
      });
    }
  }
</script>
<style lang="less">
  .home_container {
    header {
      background: linear-gradient(120deg, #1989fa, #24a8ff);
      color: white;

      .h_title {
        .flex(@j: center);
        padding: 10px 15px 5px;
        font-weight: 700;
        letter-spacing: 2px;
        font-size: 14px;
        position: relative;

        &>div {
          flex: 1;
        }

        .account-picker {
          text-align: right;
        }

        &>span {
          flex: 1;
          text-align: center;
        }
      }

      .h_button_group {
        .flex(@j: space-around);
        user-select: none;

        .h_button {
          width: 100px;
          .flex(@j: space-around; @d: column);
          padding: 20px 0;

          &:active {
            background: rgba(255, 255, 255, 0.211);
          }

          .icon {
            font-size: 30px;
          }

          .label {
            margin-top: 3px;
            font-size: 12px;
          }
        }

      }
    }

    main {
      padding: 0px 0px 100px;

      .van-grid-item__content {
        // padding:12px 10px;
        zoom: .9;
      }

      .my-swipe .van-swipe-item {
        color: #fff;
        font-size: 20px;
        line-height: 60px;
        text-align: center;
        background-color: #39a9ed;
      }
    }


  }
</style>