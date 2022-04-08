<template>
  <el-card>
    <div class="search-header" slot="header">
      <span>线上热门搜索</span>
      <el-dropdown>
        <span>
          <i class="el-icon-more"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item>黄金糕</el-dropdown-item>
          <el-dropdown-item>狮子头</el-dropdown-item>
          <el-dropdown-item>螺蛳粉</el-dropdown-item>
          <el-dropdown-item>双皮奶</el-dropdown-item>
          <el-dropdown-item>蚵仔煎</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <div>
      <el-row :gutter="10">
        <el-col :span="12">
          <line-chart></line-chart>
        </el-col>
        <el-col :span="12">
          <line-chart></line-chart>
        </el-col>
      </el-row>
    </div>
    <!-- 表格 -->
    <el-table :data="tableData" style="width: 100%; margin: 10px 0" border>
      <el-table-column type="index" label="排名" width="80"> </el-table-column>
      <el-table-column prop="name" label="搜索关键字" width="180">
      </el-table-column>
      <el-table-column prop="address" label="用户数" sortable>
      </el-table-column>
      <el-table-column prop="address" label="周涨幅" sortable>
      </el-table-column>
    </el-table>
    <!-- 分页器 -->
    <el-pagination
      style="text-align: center"
      layout="prev, pager, next"
      :total="1000"
    >
    </el-pagination>
  </el-card>
</template>

<script>
import LineChart from "./lineChart.vue";

export default {
  name: "hotSearch",
  components: {
    LineChart,
  },
  data() {
    return {
      tableData: [{}],
    };
  },
  methods: {},
};
</script>

<style scoped>
.search-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
