import mockRequest from "@/utils/mockRequest";

const state = {
  list: {},
};
const getters = {};
const mutations = {
  getData(state, list) {
    state.list = list;
  },
};
const actions = {
  // 获取首页的mock数据
  async getDataAction({ commit }) {
    const res = await mockRequest.get("/home/list");
    if (res.code == 20000) {
      commit("getData", res.data);
    }
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
