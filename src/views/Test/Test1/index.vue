<template>
  <div>
    <el-button
      type="primary"
      v-show="$store.state.user.buttons.indexOf('btn.Add1') != -1"
      >添加按钮1</el-button
    >
  </div>
</template>

<script>
export default {
  name: "Test1",
  data() {
    return {};
  },
  methods: {},
};
</script>

<style scoped>
</style>
