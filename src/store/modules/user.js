import { login, logout, getInfo } from "@/api/user";
import { getToken, setToken, removeToken } from "@/utils/auth";
import { resetRouter, asyncRoutes, constantRoutes, anyRoutes } from "@/router";
import computedAsyncRoutes from "@/utils/computedAsyncRoutes";
import router from "@/router";

const getDefaultState = () => {
  return {
    token: getToken(),
    name: "",
    avatar: "",
    // 服务器返回的菜单信息
    routes: [],
    // 角色信息
    roles: [],
    // 按钮权限信息
    buttons: [],
    // 用户最终需要展示的全部路由
    resultAllRoutes: [],
  };
};

const state = getDefaultState();

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState());
  },
  SET_TOKEN: (state, token) => {
    state.token = token;
  },
  // 存储用户信息
  SET_USERINFO: (state, userInfo) => {
    // 用户名
    state.name = userInfo.name;
    // 用户头像
    state.avatar = userInfo.avatar;
    // 菜单权限标记
    state.routes = userInfo.routes;
    // 按钮权限标记
    state.buttons = userInfo.buttons;
    // 角色
    state.roles = userInfo.roles;
  },
  // 最终计算出来的异步路由
  SET_RESULTASYNCROUTES: (state, routes) => {
    // 保存当前用户的异步路由
    const filerAsyncRoutes = computedAsyncRoutes(asyncRoutes, routes);
    // 计算出当前用户需要展示的所有路由
    state.resultAllRoutes = constantRoutes.concat(filerAsyncRoutes, anyRoutes);
    // 给路由器添加新的路由
    // router.addRoutes(state.resultAllRoutes);
    router.addRoutes([...filerAsyncRoutes, anyRoutes]);
  },
};

const actions = {
  // user login
  async login({ commit }, userInfo) {
    const { username, password } = userInfo;
    const result = await login({
      username: username.trim(),
      password: password,
    });
    if (result.code == 20000) {
      //vuex存储token
      commit("SET_TOKEN", result.data.token);
      //本地持久化存储token
      setToken(result.data.token);
      return Promise.resolve();
    } else {
      return Promise.reject(new Error("faile"));
    }
  },

  // get user info
  async getInfo({ commit }) {
    const response = await getInfo();
    // 获取用户信息,返回数据包含用户名name,用户头像avatar,routes,roles,buttons
    const { data } = response;
    // 存储用户信息
    commit("SET_USERINFO", data);
    commit("SET_RESULTASYNCROUTES", data.routes);
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token)
        .then(() => {
          removeToken(); // must remove  token  first
          resetRouter();
          commit("RESET_STATE");
          resolve();
        })
        .catch((error) => {
          reject(error);
        });
    });
  },

  // remove token
  resetToken({ commit }) {
    return new Promise((resolve) => {
      removeToken(); // must remove  token  first
      resetRouter();
      commit("RESET_STATE");
      resolve();
    });
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
