<template>
    <div class="expense-type-container" :style="{height: app_height +'px'}">
        <van-nav-bar title="费用类型" left-text="返回" left-arrow @click-left="$store.dispatch('appGoback')">
            <template #right>
                <!-- <van-button size="small" type="info" plain bgless borderless @click="onRefresh">刷新</van-button> -->
            </template>
        </van-nav-bar>
        <van-search v-model="qs" placeholder="请输入关键词" @search="onSearch" @input="onSearch" />
        <div class="recent-pick">
            <div class="title">最近使用</div>
            <div class="content">
                <template v-if="recentList.length > 0">
                 <van-tag plain v-for="el in recentList" :key="el.id" @click="onTypeClick(el)" size="medium">
                    {{el.fylxmc}}</van-tag>
                </template>
            </div>
        </div>

        <div class="main-content" v-if="!qs">
            <van-sidebar class="side-left" v-model="activeKey">
                <van-sidebar-item v-for="(el,i) in slidebar" :key="el" :title="i + 1 +' '+ el" @click="goTo(i)"/>
            </van-sidebar>
            <div class="side-right" @scroll="onScroll" @touchmove="onTouchEnd">
                <!-- curTypeList -->
                <!-- {{typeList}} -->
                <div v-for="(ele,index) in typeList" :key="index">
                    <div w100 class="sub_title " :class="{fixed:activeKey == index}" >{{ele[0].fydlmc}}</div>
    <van-cell v-for="el in ele" :key="el.id" @click="onTypeClick(el)"  :title="el.fylxmc"
                    :class="{isSelected: selectedItem.id == el.id}">
                    <template #right-icon class="flex">
                        <van-icon name="success" style="top:1.5vw" v-if="selectedItem.id == el.id" />
                        <div style="margin-left: 10px;">
                            <van-tag plain type="success" v-if="el.dgbs == 0">个人</van-tag>
                            <van-tag plain type="warning" v-if="el.dgbs == 1">对公</van-tag>
                            <van-tag plain type="primary" v-if="el.dgbs == 2">全部</van-tag>
                        </div>
                    </template>
                </van-cell>
                </div>
            
            </div>
        </div>
        <div class="main-content" v-if="qs">
            <div style="width:100%;height: 100%; overflow: auto;" >
                <van-cell v-for="el in queryList" :key="el.id" @click="onTypeClick(el)" :title="el.fylxmc"
                    :class="{isSelected: selectedItem.id == el.id}">
                    <template #right-icon class="flex">
                        <van-icon name="success" style="top:1.5vw" v-if="selectedItem.id == el.id" />
                        <div style="margin-left: 10px;">
                            <van-tag plain type="success" v-if="el.dgbs == 0">个人</van-tag>
                            <van-tag plain type="warning" v-if="el.dgbs == 1">对公</van-tag>
                            <van-tag plain type="primary" v-if="el.dgbs == 2">全部</van-tag>
                        </div>
                    </template>
                </van-cell>
            </div>

        </div>
    </div>
</template>
<script>
    import {
        bill_get_expense_type
    } from 'api'
    import {
        mapGetters
    } from 'vuex';
    import {
        getStorage,
        setStorage
    } from './../../utils/storage'
    import {createNamespacedHelpers} from 'vuex'
    var {mapState,mapMutations,mapActions}  = createNamespacedHelpers('bill_add/expenseType')
    // import {debounce, throttle} from 'lodash'
    export default {
        data() {
            return {
                // slidebar: [],
                // typeList: [],
                activeKey: 0,
                selectedItem: {},
                // recentList: getStorage({
                //     name: 'recent-xflx-list'
                // }) || [],
                qs: '',
                queryList: [],
                // rowList: [],
                objList: {}
            }
        },
        props: ['formdata'],
        computed: {
            curTypeList() {
                return this.typeList[this.activeKey]
            },
            ...mapGetters(['app_height']),
            ...mapState({
                rowList: s => s.list,
                recentList: s=>s.recent.filter((el,i) => i < 8)
            }),
            typeList(){
                return Object.values(this.objList);
            },
             slidebar(){
                return Object.keys(this.objList);
            }
        },
        methods: {
            onSearch() {
                var keyword = this.qs.toUpperCase();
                this.queryList = this.rowList.filter(el=>{
                    return el.fylxmc.includes(keyword) || el.pinyin.includes(keyword)
                })
            },
            ...mapMutations(['SET_RENCENT_XFLX','SET_LIST']),
            onTypeClick(el) {
                this.$emit('chooseXflx', el);
                this.SET_RENCENT_XFLX(el)
            },
            async onRefresh(){
                console.log('is Refreshing');
                var rowList = await bill_get_expense_type().then(r => r.data ).catch(e => [])
                await this.SET_LIST(rowList);
            },
            onScroll(e){
                console.log(e);
                // console.log(event);
                // console.log(arguments);
                var scrollTop= e.target.scrollTop;
                var offsetTop =e.target.offsetTop;
                var a = document.querySelectorAll('.side-right .sub_title');
                var b = [...a].filter( (el,i) =>{
                    return  el.offsetTop  - offsetTop - el.clientHeight <= scrollTop ;
                } );
                if(b.length >= 0){
                    this.activeKey = b.length - 1;
                    // document.querySelector('.side-left').scrollTop = document.querySelector('.van-sidebar-item--select').offsetTop - offsetTop;
                }
                console.log(b);
            },
            onTouchEnd(){
                var offsetTop = document.querySelector('.side-left').offsetTop;
                document.querySelector('.side-left').scrollTop = document.querySelector('.van-sidebar-item--select').offsetTop - offsetTop  - 100;
            },
            goTo(i){
                var container =document.querySelector('.side-right');
                var a = Array.from(document.querySelectorAll('.side-right .sub_title'))[i]
                container.scrollTop = a.offsetTop - container.offsetTop;
            },
            async handleData(){
                console.log('is Handling');
                this.objList = this.rowList.reduce((t, el) => {
                var key = el.fydlmc;
                if (el.id == this.selectedItem.id) {
                    this.activeKey = key;
                    }
                    t[key] ? (t[key].push(el)) : (t[key] = [el]);
                    return t;
                }, {});
                if (this.activeKey != 0) {
                    this.activeKey = this.slidebar.findIndex(el => el == this.activeKey);
                }
            }
        },
        async created() {
            this.selectedItem = { ...this.formdata.xflx }
            this.handleData();
        },
        mounted(){
            // this.onScroll = throttle(this.onScroll, 1000)
        }
    }
</script>
<style lang="less">
    .expense-type-container {
        // .flex(@d:column;@j:space-around);
        height: 100vh;
        display: flex;
        overflow: hidden;
        flex-direction: column;
        background: white;

        .van-nav-bar {
            flex: none;
        }

        .recent-pick {
            height: 90px;
            flex: none;
            padding: 7px 10px 10px;
            box-sizing: border-box;
            border-bottom: 1px solid #ebedf0;
            border-top: 1px solid #ebedf0;

            .title {
                color: gray;
                font-size: 10px;
                margin-bottom: 3px;
                font-weight: 700;
                padding-left: 2px;;
            }

            .content {
                overflow-y: hidden;
                .flex(@w:wrap;@j:flex-start);
                height: 60px;
                margin-top: 5px;;
                padding: 3px 0px 0;
            }

            .van-tag {
                margin-right: 8px;
                margin-bottom: 6px;
                height: 25px;
                box-sizing: border-box;
            }
        }

        .main-content {
            .flex(@a: strech; @j: space-between);
            flex: 1;
            // height: 100%;
            overflow: hidden;

            .van-sidebar {
                width: 130px;
                .van-sidebar-item--select::before{
                    background: @j_main_color;
                }
            }
            .side-left{
                transition: all ease 1s;
            }

            .side-right {
                width: calc(100vw - 100px);
                height: 100%;
                overflow-y: scroll;
                .fixed{
                    position: sticky;
                    top: -1px;
                    z-index: 10;
                }
                .sub_title{
                    padding: 8px 10px;
                    background: #f8f8f8;
                    .flex(@j:flex-start);
                    letter-spacing: 1px;
                    box-sizing: border-box;
                    // position: relative;
                    &::before{
                        content: '';
                        width: 5px;
                        height: 15px;
                        background: @j_main_color;
                        display: inline-block;
                        // position: absolute;
                        margin-right: 8px;
                    }
                }
                .van-cell__title {
                    padding-left: 10px;
                }

                .isSelected {
                    color:  @j_main_color;
                    background: #e6f3ff;
                }
            }

        }

    }
</style>