<template>
  <div id="app">
    <router-view :key="freshToken"></router-view>
    <van-tabbar v-model="activeTabbar" v-if="isShowTabbar">
      <van-tabbar-item name="home" icon="home-o">首页</van-tabbar-item>
      <van-tabbar-item name="account" icon="balance-list-o">账本</van-tabbar-item>
      <van-tabbar-item name="shenpi" icon="friends-o">审批</van-tabbar-item>
      <van-tabbar-item name="wode" icon="setting-o">我的</van-tabbar-item>
</van-tabbar>
  </div>
</template>
<script>
export default {
  data(){
    return {
      freshToken: 0
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
    }
  },
  methods: {
    onAppResize(){
      this.$store.commit('set_appHeight', window.innerHeight);
    },
    onAppStart(){
      this.onAppResize();
    }
  },
  created(){
    this.$store.dispatch('auth_getUserInfo')
  },
  mounted(){
    this.onAppStart();
    window.addEventListener('resize', this.onAppResize);
    this.$eventBus.$on('refreshView', ()=> this.freshToken++ )
  }
}
</script>

<style lang="less">
@import url('./App.less');
*{
  margin: 0;
  padding: 0;
}
body{
  width: 100%;
  background-color: rgb(240,242,245);
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);

}
</style>
