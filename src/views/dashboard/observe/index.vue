<template>
  <div>
    <el-row :gutter="10">
      <el-col :span="12">
        <hot-search></hot-search>
      </el-col>
      <el-col :span="12">
        <category></category>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import HotSearch from "./hotSearch.vue";
import Category from "./category.vue";

export default {
  name: "observe",
  components: {
    HotSearch,
    Category,
  },
  data() {
    return {};
  },
  methods: {},
};
</script>

<style scoped>
</style>
