<template>
  <div id="app">
    <router-view/>
  </div>
</template>
<script>
export default {
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
