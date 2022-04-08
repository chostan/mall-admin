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
          type: "line",
          data: [10, 7, 33, 12, 48, 11, 29, 16],
          // 拐点样式
          itemStyle: {
            opacity: 0,
          },
          lineStyle: {
            color: "#936bd9",
          },
          smooth: true,
          areaStyle: {
            color: {
              type: "linear",
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                {
                  offset: 0,
                  color: "#936bd9", // 0% 处的颜色
                },
                {
                  offset: 1,
                  color: "white", // 100% 处的颜色
                },
              ],
              global: false, // 缺省为 false
            },
          },
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
