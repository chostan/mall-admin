<template>
  <div class="trade-mark">
    <el-button
      :disabled="!$checkPermission('btn.Trademark.add')"
      type="primary"
      icon="el-icon-plus"
      style="margin: 10px 0"
      @click="showDialog"
    >
      添加
    </el-button>
    <!-- 表格 -->
    <el-table
      :data="list"
      v-loading="loading"
      stripe
      border
      style="width: 100%"
    >
      <el-table-column
        type="index"
        label="序号"
        width="80"
        align="center"
      ></el-table-column>
      <el-table-column prop="tmName" label="品牌名称"></el-table-column>
      <el-table-column prop="logoUrl" label="品牌LOGO">
        <template v-slot="{ row }">
          <el-image :src="row.logoUrl" style="height: 80px" />
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="{ row }">
          <el-button
            :disabled="!$checkPermission('btn.Trademark.update')"
            type="warning"
            icon="el-icon-edit"
            size="mini"
            @click="updateTradeMark(row)"
          >
            修改
          </el-button>
          <el-button
            :disabled="!$checkPermission('btn.Trademark.remove')"
            type="danger"
            icon="el-icon-delete"
            size="mini"
            @click="deleteTradeMark(row)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页器 -->
    <el-pagination
      style="margin: 20px 0; text-align: center"
      :current-page="page"
      :total="total"
      :page-size="limit"
      :pager-count="7"
      :page-sizes="[3, 5, 10]"
      layout="prev, pager, next, jumper, ->, sizes, total"
      @size-change="handleSizeChange"
      @current-change="getPageList"
    >
    </el-pagination>
    <!-- 添加/修改品牌 -->
    <el-dialog
      :title="tmForm.id ? '修改品牌' : '添加品牌'"
      :visible.sync="dialogFormVisible"
      @close="handleDialogClose"
    >
      <el-form
        ref="tmFormRef"
        :model="tmForm"
        :rules="rules"
        style="width: 80%"
      >
        <el-form-item label="品牌名称" label-width="100px" prop="tmName">
          <el-input v-model="tmForm.tmName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="品牌LOGO" label-width="100px" prop="logoUrl">
          <el-upload
            class="avatar-uploader"
            :action="$BASE_API + '/admin/product/fileUpload'"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="tmForm.logoUrl" :src="tmForm.logoUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <div slot="tip" class="el-upload__tip">
              只能上传jpg/png文件,且不超过2MB
            </div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button
          type="primary"
          :loading="saveLoading"
          @click="addOrUpdateTradeMark"
        >
          确 定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "tradeMark",
  data() {
    // 自定义校验规则
    var validateTmName = (rule, value, callback) => {
      if (value.length < 2 || value.length > 10) {
        callback(new Error("品牌名称2-10位"));
      } else {
        callback();
      }
    };
    return {
      // 分页器第几页
      page: 1,
      // 分页器展示数据条数
      limit: 3,
      // 总共数据条数
      total: 0,
      // 列表数据
      list: [],
      loading: false, //请求是否加载中
      dialogFormVisible: false,
      // 新增/修改品牌信息
      tmForm: {
        tmName: "",
        logoUrl: "",
      },
      saveLoading: false,
      // 表单验证规则
      rules: {
        tmName: [
          { required: true, message: "请输入品牌名称", trigger: "blur" },
          // 自定义校验规则
          { validator: validateTmName, trigger: "blur" },
        ],
        logoUrl: [{ required: true, message: "请选择品牌图片" }],
      },
    };
  },
  created() {
    // 获取列表数据
    this.getPageList();
  },
  methods: {
    // 获取品牌列表数据
    async getPageList(pager = 1) {
      this.loading = true;
      this.page = pager;
      const { page, limit } = this;
      try {
        const result = await this.$API.tradeMark.reqTradeMarkList(page, limit);
        this.total = result.data.total;
        this.list = result.data.records;
      } catch (error) {}
      this.loading = false;
    },
    handleSizeChange(limit) {
      this.limit = limit;
      this.getPageList();
    },
    // 添加品牌
    showDialog() {
      // 清除数据
      this.tmForm = {
        tmName: "",
        logoUrl: "",
      };
      this.dialogFormVisible = true;
    },
    // 修改品牌
    updateTradeMark(row) {
      this.tmForm = { ...row };
      this.dialogFormVisible = true;
    },
    // 图片上传成功的回调
    handleAvatarSuccess(res, file) {
      if (res.code == 200) {
        this.tmForm.logoUrl = res.data;
      } else {
        this.$message.error(res.data || "上传图片失败");
      }
    },
    beforeAvatarUpload(file) {
      const isJPGOrPNG =
        file.type === "image/jpeg" || file.type === "image/png";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPGOrPNG) {
        this.$message.error("上传头像图片只能是 JPG/PNG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPGOrPNG && isLt2M;
    },
    // 确定按钮(添加/修改品牌)
    addOrUpdateTradeMark() {
      this.$refs.tmFormRef.validate(async (valid) => {
        if (valid) {
          try {
            this.saveLoading = true;
            // 发请求
            await this.$API.tradeMark.reqAddOrUpdateTradeMark(this.tmForm);

            // 弹出信息
            this.$message({
              type: "success",
              message: this.tmForm.id ? "修改品牌成功" : "添加品牌成功",
            });
            this.dialogFormVisible = false;
            // 重新获取品牌列表信息
            this.getPageList(this.tmForm.id ? this.page : 1);
          } catch (error) {}
          this.saveLoading = false;
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // 删除品牌
    deleteTradeMark(row) {
      this.$confirm(`您确定删除${row.tmName}?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          const result = await this.$API.tradeMark.reqDeleteTradeMark(row.id);
          if (result.code === 200) {
            this.$message({
              type: "success",
              message: "删除成功!",
            });
            // 获取品牌列表数据
            this.getPageList(this.list.length > 1 ? this.page : this.page - 1);
          }
        })
        .catch((error) => {
          if (error === "cancel") {
            // 只有点击取消才提示
            this.$message({
              type: "info",
              message: "已取消删除",
            });
          }
        });
    },
    handleDialogClose() {
      this.$refs.tmFormRef.resetFields();
    },
  },
};
</script>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>

<style lang="scss" scoped>
</style>
