<template>
  <div class="card-container">
    <el-row :gutter="10">
      <el-col :span="6">
        <el-card>
          <detail title="总销售额" count="¥ 126560">
            <template #charts>
              <span>
                周同比&nbsp;&nbsp;56.67%
                <i class="el-icon-caret-top" style="color: #1afa29"></i>
              </span>
              &nbsp;&nbsp;
              <span>
                日同比&nbsp;&nbsp;19.96% &nbsp;
                <i class="el-icon-caret-bottom" style="color: red"></i>
              </span>
            </template>
            <template #footer>
              <span>日销售额￥ 12423</span>
            </template>
          </detail>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <detail title="访问量" count="88460">
            <template #charts>
              <line-chart></line-chart>
            </template>
            <template slot="footer">
              <span>日访问量 1234</span>
            </template>
          </detail>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <detail title="支付笔数" count="88460">
            <template #charts>
              <bar-chart></bar-chart>
            </template>
            <template slot="footer">
              <span>转换率64%</span>
            </template>
          </detail>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <detail title="运营活动效果" count="78%">
            <template #charts>
              <progress-chart></progress-chart>
            </template>
            <template #footer>
              <span>
                周同比&nbsp;&nbsp;56.67%
                <i class="el-icon-caret-top" style="color: #1afa29"></i>
              </span>
              &nbsp;&nbsp;
              <span>
                日同比&nbsp;&nbsp;19.96% &nbsp;
                <i class="el-icon-caret-bottom" style="color: red"></i>
              </span>
            </template>
          </detail>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import Detail from "./detail";
import LineChart from "./lineChart";
import BarChart from "./barChart";
import ProgressChart from "./progressChart";

export default {
  name: "card",
  components: {
    Detail,
    LineChart,
    BarChart,
    ProgressChart,
  },
  data() {
    return {};
  },
  methods: {},
};
</script>

<style scoped>
.card-container {
  margin: 10px 0;
}
</style>
