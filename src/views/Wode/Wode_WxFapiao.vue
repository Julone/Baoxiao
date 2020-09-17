<template>
    <div>
        <van-cell icon="paid" is-link title="发票导入" @click="importFapiao()"></van-cell>
    </div>
</template>
<script>
import {wx_get_ticket,bill_get_wx_fapiao} from 'api'
export default {
    methods: {
        importFapiao(){
            wx_get_ticket().then(res=>{
                llApp.importWXInvoice({
                    ticket: res.data,
                    success: function (res) {
                        bill_get_wx_fapiao(res.chooseInvoiceInfo).then(r=>{
                            alert("importWXInvoice callback:" + JSON.stringify(r));
                        })
                    }
                });
            })
        }
    }
}

</script>