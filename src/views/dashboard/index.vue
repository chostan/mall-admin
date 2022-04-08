<template>
  <div class="dashboard-container">
    <card></card>
    <sale></sale>
    <observe></observe>
  </div>
</template>

<script>
import Card from "./card";
import Sale from "./sale";
import Observe from "./observe";

export default {
  name: "Dashboard",
  components: {
    Card,
    Sale,
    Observe,
  },
  created() {
    this.$store.dispatch("home/getDataAction");
  },
};
</script>

<style lang="scss" scoped>
</style>
