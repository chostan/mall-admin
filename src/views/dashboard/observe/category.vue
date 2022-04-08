<template>
  <el-card>
    <div slot="header" class="category-header">
      <span>销售额类别占比</span>
      <el-radio-group v-model="saleType">
        <el-radio-button label="全部渠道"></el-radio-button>
        <el-radio-button label="线上"></el-radio-button>
        <el-radio-button label="门店"></el-radio-button>
      </el-radio-group>
    </div>
    <div class="charts" ref="chartsRef"></div>
  </el-card>
</template>

<script>
import * as echarts from "echarts";

export default {
  name: "category",
  data() {
    return {
      saleType: "全部渠道",
    };
  },
  mounted() {
    let myChart = echarts.init(this.$refs.chartsRef);
    myChart.setOption({
      title: {
        text: "视频",
        subtext: 1048,
        left: "center",
        top: "center",
      },
      tooltip: {
        trigger: "item",
      },
      series: [
        {
          name: "Access From",
          type: "pie",
          radius: ["40%", "70%"],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: "#fff",
            borderWidth: 2,
          },
          label: {
            show: true,
            position: "outside",
          },
          labelLine: {
            show: true,
          },
          data: [
            { value: 1048, name: '搜索引擎' },
            { value: 735, name: '直接访问' },
            { value: 580, name: '邮件营销' },
            { value: 484, name: '联盟广告' },
            { value: 300, name: '视频广告' }
          ],
        },
      ],
    });
    myChart.on("mouseover", (params) => {
      // 获取鼠标移上去的数据
      const { name, value } = params.data;
      // 重新设置标题
      myChart.setOption({
        title: {
          text: name,
          subtext: value,
        },
      });
    });
  },
  methods: {},
};
</script>

<style scoped>
.category-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.charts {
  width: 100%;
  height: 300px;
}
</style>
