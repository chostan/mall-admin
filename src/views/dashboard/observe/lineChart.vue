<template>
  <div>
    <div class="header">
      <span class="title">搜索用户数</span>
      <svg
        t="1649075930151"
        class="icon"
        viewBox="0 0 1024 1024"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        p-id="1248"
        width="26"
        height="26"
      >
        <path
          d="M536 480v192a16 16 0 0 1-16 16h-16a16 16 0 0 1-16-16V480a16 16 0 0 1 16-16h16a16 16 0 0 1 16 16z m-32-128h16a16 16 0 0 1 16 16v32a16 16 0 0 1-16 16h-16a16 16 0 0 1-16-16v-32a16 16 0 0 1 16-16z m8 448c159.056 0 288-128.944 288-288s-128.944-288-288-288-288 128.944-288 288 128.944 288 288 288z m0 48c-185.568 0-336-150.432-336-336s150.432-336 336-336 336 150.432 336 336-150.432 336-336 336z"
          p-id="1249"
          fill="#8a8a8a"
        ></path>
      </svg>
    </div>
    <div class="content">
      <span class="title1">12321</span>
      <span class="title2">17.1</span>
      <i class="el-icon-caret-top" style="color: #1afa29"></i>
      <i class="el-icon-caret-bottom" style="color: red"></i>
    </div>
    <div class="footer">
      <div class="charts" ref="chartRef"></div>
    </div>
  </div>
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
            color: "#5a8de6",
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
                  color: "#5a8de6", // 0% 处的颜色
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
.header {
  display: flex;
  align-items: center;
}
.header .title {
  margin-right: 20px;
}
.content {
  margin: 10px 0;
}
.content .title1 {
  margin-right: 30px;
}
.content .title2 {
  margin-right: 30px;
}
.charts {
  width: 100%;
  height: 50px;
}
</style>
