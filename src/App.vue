<template>
  <div id="app">
    <!-- 顺序不能反 -->
    <!-- <transition name="van-fade" mode="out-in"> -->
      <keep-alive :include="['account']">
        <router-view :key="freshToken" :style="{minHeight: appHeight +'px'}"></router-view>
      </keep-alive>
    <!-- </transition> -->
    <!-- <transition name="van-fade" mode="out-in"> -->
      <!-- <router-view :key="freshToken" v-if="!$route.meta.keepAlive" :style="{minHeight: appHeight +'px'}"></router-view> -->
    <!-- </transition> -->
    <van-tabbar v-model="activeTabbar" v-if="isShowTabbar">
      <van-tabbar-item name="home" icon="home-o">首页</van-tabbar-item>
      <van-tabbar-item name="account" icon="balance-list-o">账本</van-tabbar-item>
      <van-tabbar-item name="shenpi" icon="friends-o">审批</van-tabbar-item>
      <van-tabbar-item name="wode" icon="setting-o">我的</van-tabbar-item>
</van-tabbar>
  </div>
</template>
<script>
import {mapGetters, mapActions, mapMutations} from 'vuex'
export default {
  data(){
    return {
      freshToken: 0,
    }
  },
  computed:{ 
    isShowTabbar(){
      return this.$route.meta && this.$route.meta.openTabbar
    },
    activeTabbar: {
      get(){
        return this.$route.name;
      },
      set(name){
        return this.$router.push({name})
      }
    },
    ...mapGetters(['appHeight'])
  },
  methods: {
    ...mapMutations(['set_appHeight']),
    onAppResize(){
      this.set_appHeight(window.innerHeight)
    }
  },
  created(){
    console.log(this.$route)
  },
  mounted(){
    this.onAppResize();
    window.addEventListener('resize', this.onAppResize);
    this.$eventBus.$on('refreshView', ()=> this.freshToken += 1);
  }
}
</script>

<style lang="less">
@import url('./App.less');
*{
  margin: 0;
  padding: 0;
  // border: 1px solid red;
  // box-sizing: border-box;
}
body{
  width: 100%;
  background-color: rgb(240,242,245);
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);
  overflow-x: hidden;
  overflow-y: auto;
}

#app{
    font-family: Helvetica Neue,Tahoma,Arial,PingFangSC-Regular,Hiragino Sans GB,Microsoft Yahei,sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    user-select: none;
    touch-action: manipulation;
    text-size-adjust: none;
}
</style>
