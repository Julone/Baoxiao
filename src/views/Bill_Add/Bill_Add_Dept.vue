<template>
    <div class="department-container" :style="{height: appHeight +'px'}">
        <van-nav-bar title="部门选择" left-text="返回" left-arrow @click-left="$store.dispatch('appGoback')" />
        <van-search v-model="keyword" @input="onSearch" @search="onSearch"></van-search>
        <div class="breadcrumb">
            <van-button size="mini" native-type="button" @click="onRootClick()">通讯录</van-button>
            <van-icon class="divider-icon" name="arrow" size="12" v-if="breadcrumb.length" />
            <div class="div-item" v-for="(el,index) in breadcrumb" :key="el.id">
                <van-button size="mini" native-type="button" :type="index == breadcrumb.length -1 ? 'info': 'default' "
                    @click="onTagClick(el,index)">{{el.name}}</van-button>
                <van-icon class="divider-icon" name="arrow" v-if="index != breadcrumb.length -1" size="12" />
            </div>
        </div>
        <div class="main-content">
            <div style="width: 100%">
                <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad"
                    :error.sync="error" error-text="请求失败，点击重新加载" ref="vanlist">
                    <van-cell v-for="el in list" :key="el.id" clickable :is-link="false" :title="el.name"
                        @click="onCellClick(el)" :label="el.parent" >
                        <van-checkbox slot="icon" shape="square" :disabled="el.hasChecked" v-model="el.checked"
                            style="margin-right:10px" />
                        <van-button @click.stop="openSubDept(el)" native-type="button" slot="right-icon" size="mini"
                            icon="cluster-o" v-if="el.lx == 2 && !keyword">下级</van-button>
                    </van-cell>
                </van-list>
                    <div class="van-tabbar--fixed bottom_saved_buttons" v-if="multiple" style="position:absolute;z-index:100">
            <van-row>
                <van-col span="24">
                    <van-button @click="onMultipleClick()" native-type="button" type="info" borderless block>创建分摊
                    </van-button>
                </van-col>
            </van-row>
        </div>
            </div>
        </div>
    
    </div>
</template>
<script>
    import {
        bill_get_department
    } from 'api'
    import {
        mapGetters
    } from 'vuex'
    import {
        dateFormat
    } from '@/utils/utils'
    export default {
        data() {
            return {
                list: [],
                loading: false,
                finished: false,
                page: 1,
                limit: 50,
                error: false,
                keyword: '',
                breadcrumb: [],
                cur_id: ''
            }
        },

        computed: {
            ...mapGetters(['appHeight']),
            curTypeList() {
                return this.typeList[this.activeKey]
            },
            multiple() {
                return this.$route.query.multiple || false
            },
            selectedDept() {
                return [...this.list.filter(el => el.checked && !el.hasChecked)]
            },
            haveSelectedDept() {
                if (this.multiple) {
                    return [...this.fentang_list].map(el => el.cdbm.id)
                } else {
                    var id = this.activeItem.cdbm ? this.activeItem.cdbm.id : null;
                    console.log(id);
                    return [...this.fentang_list].map(el => el.cdbm.id).filter(el => el != id)
                }
            },
            postDate() {
                return dateFormat(this.rq, 'yyyyMM');
            }
        },
        props: {
            fentang_list: {
                type: Array,
                default: () => []
            },
            activeItem: {
                type: Object,
                default: () => ({})
            },
            rq: {
                type: Date,
                default: () => new Date()
            }
        },
        methods: {
            onRootClick() {
                this.breadcrumb = [];
                this.cur_id = "";
                this.keyword = "";
                this.initParams();
            },
            onTagClick(el, index) {
                this.breadcrumb.splice(index);
                this.openSubDept(el);
            },
            openSubDept(el) {
                this.keyword && (this.keyword = "");
                this.breadcrumb.push({
                    id: el.id,
                    name: el.name
                });
                this.cur_id = el.id;
                this.initParams();
            },
            onSearch() {
                this.initParams();
            },
            initParams() {
                this.list = [];
                this.page = 1;
                this.finished = false;
                this.$nextTick(() => {
                    this.$refs.vanlist.check()
                })
            },
            handleData(el) {
                el.hasChecked = this.haveSelectedDept.includes(el.id);
                if (this.multiple) {
                    el.checked = this.haveSelectedDept.includes(el.id);

                } else {
                    var id = this.activeItem.cdbm ? this.activeItem.cdbm.id : null;
                    el.checked = el.id == id || this.haveSelectedDept.includes(el.id);
                }
                return el;
            },
            onCellClick(el) {
                console.log(el);
                el.breadcrumb = JSON.stringify(this.breadcrumb),
                el.keyword = this.keyword
                if (this.multiple) {
                    if (!el.hasChecked) {
                        el.checked = !el.checked;
                    }
                } else {
                    if (el.hasChecked) return this.$toast('该部门已选, 请选择其他部门!')
                    this.$emit('select-dept', {
                        dept: el,
                        breadcrumb: JSON.stringify(this.breadcrumb),
                        keyword: this.keyword
                    })
                }
            },
            onMultipleClick() {
                this.$emit('select-multiple-dept', {
                    depts: this.selectedDept,
                    breadcrumb: JSON.stringify(this.breadcrumb),
                    keyword: this.keyword
                })
            },
            onLoad() {
                return bill_get_department({
                    page: this.page,
                    limit: this.limit,
                    rq: this.postDate,
                    id: this.cur_id,
                    name: this.keyword
                }).then(r => {
                    if (r.errcode == 0) {
                        if (r.data.length > 0) {
                            var data = r.data.map(this.handleData);
                            this.list.push(...data);
                            this.page = this.page + 1;
                        } else {
                            this.finished = true;
                        }
                    } else {
                        this.error = true;
                    }
                }).catch(e => {
                    this.error = true;
                }).finally(() => {
                    this.loading = false;
                })
            }
        },
        created() {
            this.keyword = this.$route.query.keyword;
            if (this.$route.query.breadcrumb) {
                try {
                    this.breadcrumb = JSON.parse(this.$route.query.breadcrumb);
                    if (this.breadcrumb.length > 0) {
                        var lastIndex = this.breadcrumb.length - 1;
                        this.onTagClick(this.breadcrumb[lastIndex], lastIndex);
                    }
                } catch (e) {
                    this.breadcrumb = [];
                }
            }
        }
    }
</script>
<style lang="less">
    .department-container {
        // .flex(@d:column;@j:space-around);
        height: 100vh;
        display: flex;
        overflow: hidden;
        flex-direction: column;
        background: white;

        .van-nav-bar {
            flex: none;
        }

        .breadcrumb {
            padding: 3px 0px 15px 13px;
            .border(bottom);
            .van-button{
                zoom:1.1
            }
            .flex(@a:center;@j:flex-start);
            .div-item{
            .flex(@a:center;@f:inline-flex);
            }

            .divider-icon {
                margin: 0 3px;
            }
        }

        .main-content {
            .flex(@a: strech);
            flex: 1;
            height: 100%;
            overflow: scroll;
           .van-list{
                padding-bottom: 15vw;
           }
            .van-cell__label{
                margin-top: 0;;
                line-height: 14px;
            }
        }

    }
</style>