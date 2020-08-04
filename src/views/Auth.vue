<template >
    <div>
        登录中...
    </div>
</template>
<script>
import {auth_get_user_info} from 'api'
export default {
    props: [],
    async created(){
        var s = await this.$store.dispatch('auth_getUserInfo');
        // setTimeout(()=>{
            this.$router.push('/');
        // },300)
    }
}

</script>