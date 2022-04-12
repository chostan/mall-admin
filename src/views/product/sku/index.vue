<template>
  <div class="sku-container" style="margin-top: 20px">
    <!-- 表格 -->
    <el-table :data="skuList" border style="width: 100%">
      <el-table-column
        type="index"
        label="序号"
        width="80"
        align="center"
      ></el-table-column>
      <el-table-column prop="skuName" label="名称"> </el-table-column>
      <el-table-column prop="skuDesc" label="描述"> </el-table-column>
      <el-table-column label="默认图片" width="110">
        <template slot-scope="{ row }">
          <el-image
            :src="row.skuDefaultImg"
            style="width: 80px; height: 80px"
          />
        </template>
      </el-table-column>
      <el-table-column prop="weight" label="重量" width="80"> </el-table-column>
      <el-table-column prop="price" label="价格" width="80"> </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="{ row }">
          <el-button
            v-if="row.isSale == 1"
            type="success"
            icon="el-icon-bottom"
            size="mini"
            title="下架该商品"
            :loading="row.saleButtonLoading"
            @click="cancel(row)"
          ></el-button>
          <el-button
            v-else
            type="success"
            icon="el-icon-top"
            size="mini"
            title="上架该商品"
            :loading="row.saleButtonLoading"
            @click="sale(row)"
          ></el-button>
          <!-- <el-button
            type="primary"
            icon="el-icon-edit"
            size="mini"
            title="编辑"
            @click="edit()"
          ></el-button> -->
          <el-button
            type="info"
            icon="el-icon-info"
            size="mini"
            title="查看详情"
            @click="getSkuInfo(row)"
          ></el-button>
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            title="删除"
            @click="deleteById(row)"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页器 -->
    <el-pagination
      :current-page="page"
      :page-sizes="[3, 5, 10]"
      :page-size="limit"
      layout="prev, pager, next, jumper, ->, sizes, total"
      :total="total"
      style="text-align: center; margin: 10px 0"
      @current-change="getSkuList"
      @size-change="handleSizeChange"
    >
    </el-pagination>
    <!-- 抽屉效果 -->
    <el-drawer
      :visible.sync="drawer"
      :show-close="false"
      size="50%"
      :before-close="drawerClose"
    >
      <el-row>
        <el-col :span="5">名称</el-col>
        <el-col :span="16">{{ skuInfo.skuName }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">描述</el-col>
        <el-col :span="16">{{ skuInfo.skuDesc || "无" }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">价格</el-col>
        <el-col :span="16">{{ skuInfo.price }}元</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">平台属性</el-col>
        <el-col :span="16">
          <el-tag
            v-for="attr in skuInfo.skuAttrValueList"
            :key="attr.id"
            style="margin: 0 10px 10px 0"
          >
            {{ attr.attrName }}-{{ attr.valueName }}
          </el-tag>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="5">商品图片</el-col>
        <el-col :span="16">
          <el-image
            v-if="
              skuInfo &&
              skuInfo.skuImageList &&
              skuInfo.skuImageList.length == 1
            "
            style="width: 100%"
            :src="skuInfo.skuImageList[0].imgUrl"
            fit="cover"
          ></el-image>
          <el-carousel
            v-else-if="
              skuInfo && skuInfo.skuImageList && skuInfo.skuImageList.length > 1
            "
            height="300px"
            :interval="2000"
            arrow="always"
          >
            <el-carousel-item
              v-for="item in skuInfo.skuImageList"
              :key="item.id"
            >
              <el-image
                style="width: 100%"
                :src="item.imgUrl"
                fit="cover"
              ></el-image>
            </el-carousel-item>
          </el-carousel>
        </el-col>
      </el-row>
    </el-drawer>
  </div>
</template>

<script>
export default {
  name: "Sku",
  data() {
    return {
      // 当前第几页
      page: 1,
      // 当前页面有几条数据
      limit: 10,
      // sku列表数据
      skuList: [],
      // 数据总条数
      total: 0,
      // sku详情数据
      skuInfo: {},
      // 抽屉显示与隐藏
      drawer: false,
    };
  },
  created() {
    // 获取sku列表的数据
    this.getSkuList();
  },
  methods: {
    // 获取sku列表的数据
    async getSkuList(pager = 1) {
      this.page = pager;
      const { page, limit } = this;
      const result = await this.$API.sku.reqSkuList(page, limit);
      if (result.code == 200) {
        this.total = result.data.total;
        const records = result.data.records.map((item) => {
          item.saleButtonLoading = false;
          return item;
        });
        this.skuList = records;
      }
    },
    handleSizeChange(limit) {
      this.limit = limit;
      this.getSkuList();
    },
    // 上架
    async sale(row) {
      row.saleButtonLoading = true;
      try {
        let result = await this.$API.sku.reqSale(row.id);
        // console.log(result);
        if (result.code == 200) {
          this.$message.success("上架成功");
        }
        this.getSkuList(this.page);
      } catch (error) {
        this.$message.error("上架失败");
      }
      row.saleButtonLoading = false;
    },
    // 下架
    async cancel(row) {
      row.saleButtonLoading = true;
      try {
        let result = await this.$API.sku.reqCancel(row.id);
        // console.log(result);
        if (result.code == 200) {
          this.$message.success("下架成功");
        }
        this.getSkuList(this.page);
      } catch (error) {
        this.$message.error("下架失败");
      }
      row.saleButtonLoading = false;
    },
    edit() {
      this.$message("正在开发中");
    },
    // 获取sku详情
    async getSkuInfo(sku) {
      // 展示抽屉
      this.drawer = true;
      const result = await this.$API.sku.reqSkuById(sku.id);
      if (result.code == 200) {
        this.skuInfo = result.data;
      }
    },
    drawerClose(done) {
      this.skuInfo = {};
      done();
    },
    // 删除sku
    deleteById(row) {
      this.$confirm(`是否删除 ${row.skuName}?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          let res = await this.$API.sku.reqDeleteSkuById(row.id);
          if (res.code == 200) {
            this.$message({
              type: "success",
              message: "删除成功!",
            });
          }
          this.getSkuList(this.skuList.length > 1 ? this.page : this.page - 1);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
  },
};
</script>

<style>
.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}
</style>

<style lang="scss" scoped>
.el-row {
  .el-col {
    margin: 10px 10px;
  }
  .el-col-5 {
    font-size: 18px;
    text-align: right;
  }
  ::v-deep .el-carousel__button {
    width: 10px;
    height: 10px;
    background-color: red;
    border-radius: 50%;
  }
}
</style>
