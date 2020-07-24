<template>
  <div class="home">
    <header>
      <div class="h_title">首页</div>
      <div class="h_button_group">
        <div class="h_button" @click="$router.push(el.to)" v-for="el in h_button" :key="el.icon">
          <div class="icon"> <van-icon :name="el.icon" /> </div>
          <div class="label">{{el.label}}</div>
        </div>
      </div>
    </header>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        h_button: [{
            icon: 'gold-coin-o',
            label: '记费用',
            to: {
              path: '/bill/add'
            }
          },
          {
            icon: 'scan',
            label: '智能识别',
            to: {
              path: '/bill/add'
            }
          },
          {
            icon: 'bill-o',
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
  .home {
    header {
      background: linear-gradient(120deg, #1989fa, #24a8ff);
      color: white;

      .h_title {
        .flex();
        padding: 10px 0;
        font-weight: 700;
        letter-spacing: 2px;
        font-size: 14px;;
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


  }
</style>