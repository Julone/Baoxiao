<template>
    <div>
        <van-nav-bar title="新建通用报销单" left-text="返回" left-arrow @click-left="$store.dispatch('appGoback')" />
            <van-form v-if="initOK" ref="form" @submit="onSubmit">
                <van-field v-model="form.bxsy" clickable name="bxsy" required is-link
                    label="报销事由" placeholder="请输入报销事由"
                    :rules="[{ required: true, message: '请输入报销事由',trigger:'onBlur' }]"
                    >
                </van-field>
                <van-cell-group >
                    <van-field v-model="form.gstt.name" label="公司抬头" clickable
                        @click="go2sub({name: 'bill_get_gongsi'})" required is-link name="gstt"
                        placeholder="请选择公司抬头" readonly
                        :rules="[{ required: true, message: '请输入公司抬头',trigger:'onChange' }]">
                    </van-field>
                </van-cell-group>
                 <van-cell-group>
                    <van-field v-model="form.cdmb.name" label="承担部门" clickable
                        @click="go2sub({name: 'bill_add_dept'})" required is-link name="cdbm"
                        placeholder="请选择承担部门" readonly
                        :rules="[{ required: true, message: '请选择承担部门',trigger:'onChange' }]">
                    </van-field>
                </van-cell-group>

                <!-- 底部保存 -->
                <!-- <div class="van-tabbar--fixed bottom_saved_buttons">
                    <van-row>
                        <van-col span="12">
                            <van-button @click="onSaveAgain" native-type="button" type="default" borderless
                                style="background:rgb(247,247,247)" block>再记一笔</van-button>
                        </van-col>
                        <van-col span="1"></van-col>
                        <van-col span="11">
                            <van-button @click="onSave" native-type="button" type="info" borderless block>保存
                            </van-button>
                        </van-col>
                    </van-row>
                </div> -->
            </van-form>
              <!-- <transition name="van-slide-right">
            <div class="erji-view" v-if="isOpenErji">
                <keep-alive>
                    <router-view @select_dept="select_dept"></router-view>
                </keep-alive>
            </div>
        </transition> -->
    </div>
</template>
<script>
export default {
    data(){
        return  {
            form: {
                bxsy: "",
                gstt: {},
                cdmb:{}
            },
            initOK:true,

        }
    },
    computed:{
         isOpenErji() {
             console.log(this.$route.name);
                return this.$route.name != 'bill_get_new'
            }
    },
    methods: {
        onSubmit(){

        },
         select_dept(dept) {
                console.log(dept);
                this.form.cdbm = dept;
                this.$store.dispatch('appGoback')
            },
                 go2sub(route) {
                route = Object.assign(route, {
                    params: {
                        avoidRefresh: true
                    }
                })
                this.$router.push(route)
            },
    }
}

</script>