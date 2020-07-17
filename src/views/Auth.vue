<template >
    <div>
        登录中...
    </div>
</template>
<script>
import  {auth_get_user_info} from 'api'
export default {
    created(){
        auth_get_user_info().then(r=>{
            console.log(r);
            this.$store.commit('SET_APPTOKEN', r)
        })
    }
}

</script>