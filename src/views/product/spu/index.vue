<template>
  <div class="spu-container">
    <el-card style="margin: 20px 0">
      <category-select
        @getCategoryId="getCategoryId"
        :show="scene != 0"
      ></category-select>
    </el-card>
    <el-card>
      <!-- 有三部分进行切换 -->
      <div v-show="scene == 0">
        <!-- 展示spu列表的结构 -->
        <el-button
          type="primary"
          icon="el-icon-plus"
          :disabled="!category3Id"
          @click="addSpu"
          style="margin-bottom: 10px"
        >
          添加SPU
        </el-button>
        <el-table :data="records" border style="width: 100%">
          <el-table-column type="index" label="序号" width="80" align="center">
          </el-table-column>
          <el-table-column prop="spuName" label="SPU名称"> </el-table-column>
          <el-table-column prop="description" label="SPU描述">
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="{ row }">
              <el-button
                type="success"
                icon="el-icon-plus"
                size="mini"
                title="添加sku"
                @click="addSku(row)"
              ></el-button>
              <el-button
                type="warning"
                icon="el-icon-edit"
                size="mini"
                title="修改spu"
                @click="updateSpu(row)"
              ></el-button>
              <el-button
                type="info"
                icon="el-icon-info"
                size="mini"
                title="查看当前spu全部sku列表"
                @click="handleShowSkuList(row)"
              ></el-button>
              <el-popconfirm
                title="这是一段内容确定删除吗？"
                style="margin-left: 10px"
                @onConfirm="deleteSpu(row)"
              >
                <el-button
                  slot="reference"
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  title="删除spu"
                ></el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页器 -->
        <el-pagination
          style="margin: 20px 0; text-align: center"
          :current-page="page"
          :page-sizes="[3, 5, 10]"
          :page-size="limit"
          layout="prev, pager, next, jumper, ->, sizes, total"
          :total="total"
          @current-change="getSpuList"
          @size-change="handleSizeChange"
        >
        </el-pagination>
      </div>
      <spu-form
        ref="spuFormRef"
        v-show="scene == 1"
        @changeScene="changeScene"
      ></spu-form>
      <sku-form
        v-show="scene == 2"
        ref="skuFormRef"
        @changeScenes="changeScenes"
      ></sku-form>
    </el-card>
    <el-dialog
      :title="`${spu.spuName}的sku列表`"
      :visible.sync="dialogTableVisible"
      :before-close="dialogBeforeClose"
    >
      <!-- table展示sku列表 -->
      <el-table :data="skuList" border style="width: 100%" v-loading="loading">
        <el-table-column prop="skuName" label="名称"> </el-table-column>
        <el-table-column prop="price" label="价格"> </el-table-column>
        <el-table-column prop="weight" label="重量"> </el-table-column>
        <el-table-column label="默认图片">
          <template slot-scope="{ row }">
            <img
              :src="row.skuDefaultImg"
              alt=""
              style="width: 100px; height: 100px"
            />
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import SpuForm from "./spuForm";
import SkuForm from "./skuForm";

export default {
  name: "Spu",
  components: {
    SpuForm,
    SkuForm,
  },
  data() {
    return {
      // 分类的id
      category1Id: "",
      category2Id: "",
      category3Id: "",
      page: 1, // 分页器当前第几页
      limit: 3, // 每页多少条数据
      records: [], // spu列表数据
      total: 0, // 分页器需要展示的数据条数
      scene: 0, //0代表展示SPU列表数据   1 添加SPU|修改SPU   2 添加SKU
      // 控制查看sku列表对话框的显示与隐藏
      dialogTableVisible: false,
      spu: {},
      // sku列表的数据
      skuList: [],
      loading: true,
    };
  },
  methods: {
    // 三级联动自定义事件
    getCategoryId({ categoryId, level }) {
      if (level == 1) {
        this.category1Id = categoryId;
        this.category2Id = "";
        this.category3Id = "";
        this.records = [];
      } else if (level == 2) {
        this.category2Id = categoryId;
        this.category3Id = "";
        this.records = [];
      } else {
        this.category3Id = categoryId;
        // 获取SPU列表数据
        this.getSpuList();
      }
    },
    // 获取SPU列表数据
    async getSpuList(pager = 1) {
      this.page = pager;
      const { page, limit, category3Id } = this;
      const result = await this.$API.spu.reqSpuList(page, limit, category3Id);
      if (result.code == 200) {
        this.total = result.data.total;
        this.records = result.data.records;
      }
    },
    // 分页器每一页数据条数发生变化的回调
    handleSizeChange(limit) {
      this.limit = limit;
      this.getSpuList();
    },
    // 添加Spu按钮的回调
    addSpu() {
      this.scene = 1;
      // 通知子组件SpuForm发请求
      this.$refs.spuFormRef.addSpuData(this.category3Id);
    },
    // 修改某一个Spu
    updateSpu(row) {
      this.scene = 1;
      // 获取SpuForm子组件发请求
      this.$refs.spuFormRef.initSpuData(row);
    },
    // SpuForm事件回调
    changeScene({ scene, flag }) {
      // flag区分添加还是修改
      this.scene = scene;
      // 重新获取数据
      if (flag == "修改") {
        this.getSpuList(this.page);
      } else {
        this.getSpuList();
      }
    },
    // 删除spu
    async deleteSpu(row) {
      const result = await this.$API.spu.reqDeleteSpu(row.id);
      if (result.code == 200) {
        this.$message.success("删除成功");
        this.getSpuList(this.records.length > 1 ? this.page : this.page - 1);
      }
    },
    addSku(row) {
      // 切换场景为2
      this.scene = 2;
      // 调用子组件skuFormRef发请求
      this.$refs.skuFormRef.resetFields();
      this.$refs.skuFormRef.getData(this.category1Id, this.category2Id, row);
    },
    // SkuForm通知父组件修改场景
    changeScenes(scene) {
      this.scene = 0;
    },
    // 查看sku按钮的回调
    async handleShowSkuList(spu) {
      this.dialogTableVisible = true;
      // 保存spu信息
      this.spu = spu;
      // 获取sku列表的数据
      const result = await this.$API.spu.reqSkuList(spu.id);
      if (result.code == 200) {
        this.skuList = result.data;
        // loading隐藏
        this.loading = false;
      }
    },
    // 关闭对话框的回调
    dialogBeforeClose(done) {
      this.loading = true;
      // 清除sku列表的数据
      this.skuList = [];
      // 关闭对话框
      done();
    },
  },
};
</script>

<style scoped>
</style>
