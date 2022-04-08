<template>
  <el-card class="box-card" style="margin-bottom: 10px">
    <div slot="header" class="box-header">
      <!--  @tab-click="handleClick" -->
      <el-tabs class="tab" v-model="activeName">
        <el-tab-pane label="销售额" name="sale"></el-tab-pane>
        <el-tab-pane label="访问量" name="visite"></el-tab-pane>
      </el-tabs>
      <div class="right">
        <span @click="setDay">今日</span>
        <span @click="setWeek">本周</span>
        <span @click="setMonth">本月</span>
        <span @click="setYear">本年</span>
        <!-- v-model="value1" -->
        <el-date-picker
          class="date"
          v-model="date"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          size="mini"
          value-format="yyyy-MM-dd"
        >
        </el-date-picker>
      </div>
    </div>
    <div>
      <el-row :gutter="10">
        <el-col :span="18">
          <bar-chart :title="title"></bar-chart>
        </el-col>
        <el-col :span="6" class="ranking">
          <h3 class="title">门店{{ title }}排名</h3>
          <ul>
            <li v-for="(item, index) in rankingList" :key="index">
              <span class="rindex">{{ index + 1 }}</span>
              <span>{{ item.name }}</span>
              <span class="rvalue">{{ item.value }}</span>
            </li>
          </ul>
        </el-col>
      </el-row>
    </div>
  </el-card>
</template>

<script>
import BarChart from "./barChart.vue";
import dayjs from "dayjs";


export default {
  name: "sale",
  components: {
    BarChart,
  },
  data() {
    return {
      activeName: "sale",
      rankingList: [
        { name: "肯德基", value: "323,234" },
        { name: "麦当劳", value: "299,132" },
        { name: "海底捞", value: "283,998" },
        { name: "华莱士", value: "226,223" },
        { name: "西贝筱面村", value: "223,445" },
        { name: "汉堡王", value: "219,663" },
        { name: "真功夫", value: "200,997" },
      ],
      // 日历的数据
      date: [],
    };
  },
  computed: {
    title() {
      return this.activeName == "sale" ? "销售额" : "访问量";
    }
  },
  methods: {
    // 本天
    setDay() {
      const day = dayjs().format("YYYY-MM-DD");
      this.date = [day, day];
    },
    setWeek() {
      const start = dayjs().day(1).format("YYYY-MM-DD");
      const end = dayjs().day(7).format("YYYY-MM-DD");
      this.date = [start, end];
    },
    setMonth() {
      const start = dayjs().startOf("month").format("YYYY-MM-DD");
      const end = dayjs().endOf("month").format("YYYY-MM-DD");
      this.date = [start, end];
    },
    setYear() {
      const start = dayjs().startOf("year").format("YYYY-MM-DD");
      const end = dayjs().endOf("year").format("YYYY-MM-DD");
      this.date = [start, end];
    },
  },
};
</script>

<style lang="scss" scoped>
.box-card {
  ::v-deep .el-card__header {
    border-bottom: none;
  }
  ::v-deep .el-card__body {
    padding-top: 0;
  }
  .box-header {
    position: relative;
    .tab {
      width: 100%;
      ::v-deep .el-tabs__item {
        font-size: 18px;
      }
    }
    .right {
      position: absolute;
      top: 0;
      right: 0;
      display: flex;
      align-items: center;
      span {
        margin: 0 10px;
        cursor: pointer;
      }
      .date {
        width: 220px;
        margin: 0 20px;
      }
    }
  }
  .ranking {
    .title {
      margin: 0;
    }
    ul {
      list-style: none;
      width: 100%;
      height: 300px;
      padding: 0;
      li {
        margin: 10px 0;
        height: 8%;
        span {
          margin: 0 20px;
        }
        .rindex {
          float: left;
          width: 20px;
          height: 20px;
          text-align: center;
        }
        .rvalue {
          float: right;
        }
      }
      li:nth-child(-n + 3) {
        .rindex {
          border-radius: 50%;
          background-color: black;
          color: white;
        }
      }
    }
  }
}
</style>
