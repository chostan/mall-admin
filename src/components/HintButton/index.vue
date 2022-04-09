<template>
  <el-tooltip effect="dark" :content="title" placement="top">
    <!-- 将接收的所有属性和监听方法都传递给button -->
    <el-button v-bind="$attrs" v-on="$listeners"></el-button>
  </el-tooltip>
</template>

<script>
export default {
  name: "HintButton",
  props: ["title"],
};
</script>

<style scoped>
</style>
