<template>
  <div class="home_container">
    <header>
      <div class="h_title">
        <div transparent>LILANZ</div>
        <span>首页</span>
        <accountPicker  white size="mini" ></accountPicker></div>

      <div class="h_button_group">
        <div class="h_button" @click="onHbtnClick(el)" v-for="el in h_button" :key="el.icon">
          <div class="icon">
            <van-icon :name="el.icon" />
          </div>
          <div class="label">{{el.label}}</div>
        </div>
      </div>
    </header>
    <main>
      <van-grid :border="false" clickable>
        <van-grid-item icon="description" text="发票抬头" />
        <van-grid-item icon="after-sale" text="里程补贴" />
        <van-grid-item icon="records" text="发票导入" />
        <van-grid-item icon="paid" text="第三方消费" />
      </van-grid>
    </main>

  </div>
</template>
<script>
  export default {
    methods: {
      onHbtnClick(el){
        if(el.disabled) return this.$toast('正在维护');
        this.$router.push(el.to);
      }
    },
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
            disabled: true
          },
          {
            icon: 'bill',
            label: '提单据',
            to: {
              path: '/bill/get/type'
            }
          }
        ]
      }
    }

  }
</script>
<style lang="less">
  .home_container {
    header {
      background: linear-gradient(120deg, #1989fa, #24a8ff);
      color: white;

      .h_title {
        .flex(@j:space-between);
        padding: 10px 10px 5px;
        font-weight: 700;
        letter-spacing: 2px;
        font-size: 14px;
        position: relative;
        & > div{
          flex: 1;
        }
        &>span{
          flex:4;
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
      padding: -10px 20px;

      .van-grid-item__content {
        // padding:12px 10px;
        zoom: .9;
      }
    }


  }
</style>