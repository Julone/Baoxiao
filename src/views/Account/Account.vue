<template>
    <div class="account_container">
        <van-nav-bar title="账本" />
        <nav class="nav-bar">
            <div class="left-item">
                <a class="blue-text">选择</a>
                <div class="gray-btn-group" @click="value1 = true">
                    <span>未报销</span>
                    <span>消费时间</span>
                    <span>全部
                        <van-icon name="arrow-down" /></span>
                </div>
                <van-dropdown-menu>
  <van-dropdown-item v-model="value1" :options="option" />
</van-dropdown-menu>
            </div>
            <div class="right-item">
                <van-button borderless marginless size="small">
                    <a class="blue-text">
                        <van-icon name="plus" /></a>
                </van-button>
            </div>
        </nav>
        <main>

        </main>

    </div>
</template>
<script>
export default {
    data(){
        return {
            value1: ',',
              option: [
        { text: '全部商品', value: 0 },
        { text: '新款商品', value: 1 },
        { text: '活动商品', value: 2 },
      ],
        }
    }
}
</script>
<style lang="less">
    .account_container {
        nav.nav-bar {
            padding: 5px 15px;
            background: white;
            .flex(@j: space-between);

            .gray-btn-group {
                display: inline-block;
                font-size: 12px;
                padding: 5px;
                background: rgb(241, 241, 241);
                margin-left: 20px;

                span {
                    margin: 0 5px;

                }
            }
        }
    }
</style>