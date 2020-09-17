import { getStorage, setStorage, validatenull } from "./../../utils/storage";
import { auth_get_user_info,bill_get_ywcj } from "api";
import { Toast } from "vant";
import makePinyin from "./../../utils/pinyin";
export default {
  state: {
    apptoken: getStorage({ name: "apptoken", }) || "", // 103ac4c22bcc8a71 //4c8f9c243b7954cd
    activeAccount: getStorage({ name: "activeAccount", }) || {},
    accountList: getStorage({ name: "accountList", }) || [],
    userinfo: getStorage({ name: "userinfo", }) || {},
    ywcjList: getStorage({ name: 'ywcjList' }) || [],
    isUserInfoLoading: false,
  },
  mutations: {
    SET_APPTOKEN(state, apptoken) {
      state.apptoken = apptoken;
      setStorage({
        name: "apptoken",
        type: "session",
        content: apptoken,
      });
    },
    SET_ACTIVE_ACCOUNT(state, account) {
      state.activeAccount = account;
      setStorage({
        name: "activeAccount",
        content: account,
      });
    },
    SET_ACCOUNT(state, value) {
      console.log(value);
      state.accountList = value.map((el) => ({
        text: `[${el.khlbmc}] ${el.khdm}.${el.khmc}`,
        pinyin: makePinyin(`[${el.khlbmc}] ${el.khdm}.${el.khmc}`).toString(),
        data: el,
      }));
      setStorage({
        name: "accountList",
        content: state.accountList,
      });
    },
    SET_USERINFO(state, userinfo) {
      state.userinfo = userinfo;
      setStorage({
        name: "userinfo",
        type: "session",
        content: userinfo,
      });
    },
    SET_YWCJ_LIST(state, ywcjList) {
      state.ywcjList = ywcjList;
      setStorage({ name: 'ywcjList', content: ywcjList })
    }
  },
  actions: {
    auth_getUserInfo({ state, commit, dispatch }, apptoken) {
      if (validatenull(state.userinfo)) {
        apptoken = process.env.NODE_ENV == "development" ? "a5eadf424fde93a" : apptoken;
        return auth_get_user_info(apptoken)
          .then((r) => {
            commit("SET_APPTOKEN", apptoken);
            commit("SET_ACCOUNT", r.data.account);
            commit("SET_USERINFO", r.data.info[0]);
            validatenull(state.activeAccount) &&
            dispatch("choose_active_account", r.data.account[0]);
            Toast("欢迎您, " + state.userinfo.cname);
            return Promise.resolve(true);
          })
          .catch((e) => {
            return Promise.reject(false);
          });
      }
      var windowWidth = window.innerWidth;
      if(windowWidth >= 640){
        window.location.href = './index-pc.html'
      }
    },
    updateAccountList({ state, commit }) {
      state.isUserInfoLoading = true;
      return auth_get_user_info(state.apptoken)
        .then(async (r) => {
          await commit("SET_ACCOUNT", r.data.account);
          await commit("SET_USERINFO", r.data.info[0]);
          return Promise.resolve(true);
        })
        .catch((e) => {
          return Promise.reject(false);
        })
        .finally(() => {
          setTimeout(() => {
            state.isUserInfoLoading = false;
          }, 1000);
        });
    },
    choose_active_account({ state, commit }, val) {
      commit("SET_ACTIVE_ACCOUNT", val);
    },
    ywcj_get_ywcl_list({ state, commit, dispatch }, params) {
      if ( !validatenull(state.ywcjList) ) return Promise.resolve(true);
      return bill_get_ywcj().then(r => { commit('SET_YWCJ_LIST', r.data); return true; }).catch(e => { return false; })
    }
  },
  getters: {
    apptoken: (state) => state.apptoken || "",
    activeAccount: (state) => state.activeAccount || [],
    accountList: (state) => state.accountList || {},
    userinfo: (state) => state.userinfo || {},
    ywcjList: state => state.ywcjList.filter(el => el.id != 7190) || [],
  },
};
