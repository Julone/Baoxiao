<template>
    <div class="app-backTop">
        <transition mode="ou-in" enter-active-class="van-slide-up2-leave-active"
            leave-active-class="van-slide-down2-leave-active">
            <van-button v-moveable v-show="isShow" type="info" native-type="button" @click="onClick" icon="back-top"
                round size="small"></van-button>
        </transition>
    </div>
</template>
<script>
    export default {
        data() {
            return {
                scrollTop: 0,
            }
        },
        props: {
            dom: {
                default: 'html,body'
            },
            duration: {
                default: '300',
                type: [Number, String]
            },
            showDistance: {
                default: '200'
            }
        },
        computed: {
            isShow() {
                return this.scrollTop > this.showDistance
            }
        },
        methods: {
            onScroll(event) {
                this.scrollTop = this.domEL.scrollTop || this.domEL.scrollY;
            },
            onClick() {
                this.$scrollTopTo(this.domEL, 0, this.duration)
            },
        },
        mounted() {
            this.domEL = document.querySelector(this.dom);
            if (this.dom === 'html,body') {
                this.domEL = window
            }
            this.domEL.addEventListener('scroll', this.onScroll, false);
        },
        beforeDestroy() {
            this.domEL.removeEventListener('scroll', this.onScroll);
        }
    }
</script>

<style lang="less">
    .app-backTop {
        position: fixed;
        bottom: 100px;
        right: 30px;
        z-index: 200;
    }
</style>