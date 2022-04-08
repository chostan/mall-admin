<template>
  <div class="chart" ref="chartRef"></div>
</template>

<script>
import * as echarts from "echarts";

export default {
  name: "lineChart",
  data() {
    return {};
  },
  mounted() {
    const lineChart = echarts.init(this.$refs.chartRef);
    lineChart.setOption({
      xAxis: {
        show: false,
        type: "category",
      },
      yAxis: {
        show: false,
      },
      series: [
        {
          type: "bar",
          data: [10, 7, 33, 12, 48, 11, 29, 16, 33, 22, 8],
          color: "skyblue",
        },
      ],
      grid: {
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
      },
    });
  },
  methods: {},
};
</script>

<style scoped>
.chart {
  width: 100%;
  height: 100%;
}
</style>
