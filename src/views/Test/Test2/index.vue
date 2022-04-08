<template>
  <div>
    <el-button
      type="primary"
      v-show="$store.state.user.buttons.indexOf('btn.Add2') != -1"
      >添加按钮2</el-button
    >
    <el-button
      type="primary"
      v-show="$store.state.user.buttons.indexOf('btn.Add3') != -1"
      >添加按钮3</el-button
    >
  </div>
</template>

<script>
export default {
  name: "Test2",
  data() {
    return {};
  },
  methods: {},
};
</script>

<style scoped>
</style>
