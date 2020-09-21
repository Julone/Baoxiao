<template>
    <van-cell-group border class="marginTop cell-group" >
        <van-field v-model="form.skzh.account" required>
            <div slot="label" nowrap>收款账户</div>
            <div noEvent nowrap slot="extra">
                <van-button tag="div" size="mini" :type="bill_type.dgbs == 2? 'info': 'default'">个人</van-button>
                <van-button tag="div" size="mini" :type="bill_type.dgbs == 1? 'info': 'default'">单位</van-button>
            </div>
            <div slot="input"></div>
        </van-field>
        <div class="content" @click="go2sub({path: '/bill/get/bill_get_skzh'})">
            <van-button v-if="!form.skzh.yhzh" tag="div" block borderless type="info" plain>
                选择收款账户</van-button>
            <div style="padding:2vw 4vw;" v-else>
                <div style="margin-bottom:1vw; font-weight: 400;font-size:4vw;color:gray">{{form.skzh.zhmc}}
                </div>
                <van-cell paddingless :label="form.skzh.khyh">
                    <h3 style="letter-spacing:.1vw" v-text="form.skzh.yhzh" slot="title"></h3>
                </van-cell>
            </div>
        </div>
    </van-cell-group>
</template>

<script>
export default {
    props: ['form', 'bill_type', 'go2sub']
}

</script>