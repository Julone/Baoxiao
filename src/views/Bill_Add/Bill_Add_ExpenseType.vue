<template>
  <div class="expense-type-container" :style="{ height: appHeight + 'px' }">
    <van-nav-bar
      title="费用类型"
      left-text="返回"
      left-arrow
      @click-left="$store.dispatch('appGoback')"
    >
      <template #right>
        <van-button
          size="small"
          type="info"
          icon="replay"
          plain
          bgless
          borderless
          @click="onRefresh"
          >更新数据</van-button
        >
      </template>
    </van-nav-bar>

    <van-search
      v-model="keyword"
      placeholder="请输入关键词"
      @search="onSearch"
      @input="onSearch"
      clear-trigger="always"
    />
    <div class="recent-pick">
      <div class="title">最近使用</div>
      <div class="content">
        <template>
          <van-tag
            plain
            v-for="el in recentList"
            :key="el.id"
            @click="onTypeClick(el)"
            size="medium"
          >
            {{ el.fylxmc }}</van-tag
          >
        </template>
      </div>
    </div>

    <div class="main-content" v-if="!keyword">
      <van-sidebar class="side-left" v-model="activeKey">
        <van-sidebar-item
          v-for="(el, i) in cateList"
          :key="el"
          :title="i + 1 + ' ' + el"
          @click="onLeftPanelClick(i)"
        />
      </van-sidebar>
      <div
        class="side-right"
        @scroll="onScroll"
        @touchstart="lockLeft = true"
        @click="lockLeft = true"
      >
        <div v-for="(ele, index) in typeList" :key="index">
          <div w100 class="sub_title " :class="{ fixed: activeKey == index }">
            {{ ele[0].fydlmc }}
          </div>
          <van-cell
            v-for="el in ele"
            :key="el.id"
            @click="onTypeClick(el)"
            :title="el.fylxmc"
            :class="{ 'isSelected-cell': selectedItem.id == el.id }"
          >
            <template #right-icon class="flex">
              <van-icon
                name="success"
                style="top:1.5vw"
                v-if="selectedItem.id == el.id"
              />
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
    <div class="main-content" v-if="keyword">
      <div
        style="width:100%;height: 100%; overflow: auto;"
        v-if="queryList.length"
      >
        <van-cell
          v-for="el in queryList"
          :key="el.id"
          @click="onTypeClick(el)"
          :title="el.fylxmc"
          :class="{ 'isSelected-cell': selectedItem.id == el.id }"
          clickable
        >
          <template #right-icon class="flex">
            <van-icon
              name="success"
              style="top:1.5vw"
              v-if="selectedItem.id == el.id"
            />
            <div style="margin-left: 10px;">
              <van-tag plain type="success" v-if="el.dgbs == 0">个人</van-tag>
              <van-tag plain type="warning" v-if="el.dgbs == 1">对公</van-tag>
              <van-tag plain type="primary" v-if="el.dgbs == 2">全部</van-tag>
            </div>
          </template>
        </van-cell>
      </div>
      <van-empty v-else w100>未找到相关的费用类型</van-empty>
    </div>
  </div>
</template>
<script>
import { bill_get_expense_type } from "api";
import { mapGetters } from "vuex";
import { getStorage, setStorage } from "./../../utils/storage";
import { createNamespacedHelpers } from "vuex";
var { mapState, mapMutations, mapActions } = createNamespacedHelpers(
  "bill_add/expenseType"
);
export default {
  data() {
    return {
      activeKey: 0,
      selectedItem: {},
      keyword: "",
      queryList: [],
      dataList: {},
      lockLeft: true,
    };
  },
  props: ["formdata"],
  computed: {
    ...mapGetters(["appHeight"]),
    ...mapState({
      rowList: (s) => s.list,
      recentList: (s) => s.recent.filter((el, i) => i < 8),
    }),
    typeList() {
      return Object.values(this.dataList);
    },
    cateList() {
      return Object.keys(this.dataList);
    },
  },
  methods: {
    ...mapMutations(["SET_RENCENT_XFLX", "SET_LIST"]),
    ...mapActions(["init_expenseType"]),
    onSearch() {
      var keyword = this.keyword.toUpperCase();
      this.queryList = this.rowList.filter((el) => {
        return el.fylxmc.includes(keyword) || el.pinyin.includes(keyword);
      });
    },
    onTypeClick(el) {
      this.$emit("chooseXflx", el);
      this.SET_RENCENT_XFLX(el);
    },
    async onRefresh() {
      this.activeKey = 0;
      await this.init_expenseType(true);
      this.handleData();
    },
    onScroll: function(event) {
      if (this.lockLeft) {
        var rightContainer = document.querySelector(".side-right");
        var scrollTop = rightContainer.scrollTop;
        var offsetTop = rightContainer.offsetTop;
        var subTitles = document.querySelectorAll(".side-right .sub_title");
        var pastArray = Array.from(subTitles).filter((el, i) => {
          return el.offsetTop - offsetTop - el.clientHeight <= scrollTop;
        });
        this.activeKey = pastArray.length >= 0 ? pastArray.length - 1 : 0;
        var leftElement = document.querySelectorAll(".van-sidebar-item")[
          this.activeKey
        ];
        var top =
          leftElement.offsetTop -
          offsetTop -
          (rightContainer.clientHeight / 2 - leftElement.clientHeight);
        document.querySelector(".side-left").scrollTop = top;
      }
    },
    onLeftPanelClick(i) {
      this.lockLeft = false;
      var container = document.querySelector(".side-right");
      var a = Array.from(document.querySelectorAll(".side-right .sub_title"))[
        i
      ];
      this.$scrollTopTo( container, a.offsetTop - container.offsetTop, 300)
    },
    async handleData() {
      console.log("正在处理数据格式");
      this.dataList = this.rowList.reduce((t, el) => {
        var key = el.fydlmc;
        if (el.id == this.selectedItem.id) {
          this.activeKey = key;
        }
        t[key] ? t[key].push(el) : (t[key] = [el]);
        return t;
      }, {});
      if (this.activeKey != 0) {
        this.activeKey = this.cateList.findIndex((el) => el == this.activeKey);
      }
    },
  },
  async created() {
    this.selectedItem = { ...this.formdata.xflx };
    this.handleData();
  },
  mounted() {
    var selectedCell = document.querySelector(".side-right .isSelected-cell");
    if (selectedCell) {
      var rightContainer = document.querySelector(".side-right");
      var scrollTop = rightContainer.scrollTop;
      var offsetTop = rightContainer.offsetTop;
      var top =
        selectedCell.offsetTop -
        offsetTop -
        (rightContainer.clientHeight / 2 - selectedCell.clientHeight);
      rightContainer.scrollTop = top;
    }
  },
};
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
      padding-left: 2px;
    }

    .content {
      overflow-y: hidden;
      .flex(@w: wrap; @j: flex-start; @a: flex-start);
      height: 60px;
      margin-top: 5px;
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
    .isSelected-cell {
      color: @j_main_color;
      background: #e6f3ff;
    }
    .flex(@a: strech; @j: space-between);
    flex: 1;
    // height: 100%;
    overflow: hidden;

    .van-sidebar {
      width: 130px;
      .van-sidebar-item--select::before {
        background: @j_main_color;
      }
    }
    .van-sidebar-item:not(.van-sidebar-item--select) {
      .border(right);
    }

    .van-sidebar-item--select {
      .border(top);
      .border(bottom);
    }

    .side-right {
      width: calc(100vw - 100px);
      height: 100%;
      overflow-y: auto;
      .fixed {
        position: sticky;
        top: -1px;
        z-index: 100;
        font-weight: 700;
        // background: white !important;
        .border(bottom);
      }

      .sub_title {
        padding: 8px 10px;
        background: #f8f8f8;
        .flex(@j: flex-start);
        letter-spacing: 1px;
        font-size: 15px;
        box-sizing: border-box;
        // position: relative;
        &::before {
          content: "";
          width: 4px;
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
    }
  }
}
</style>
