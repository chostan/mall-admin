<template>
  <div class="attr-container">
    <el-card style="margin: 20px 0">
      <category-select
        @getCategoryId="getCategoryId"
        :show="!isShowTable"
      ></category-select>
    </el-card>
    <el-card>
      <div v-show="isShowTable">
        <el-button
          type="primary"
          icon="el-icon-plus"
          style="margin-bottom: 10px"
          :disabled="!category3Id"
          @click="addAttr"
        >
          添加属性
        </el-button>
        <!-- 表格 -->
        <el-table :data="attrList" border style="width: 100%">
          <el-table-column type="index" label="序号" width="80" align="center">
          </el-table-column>
          <el-table-column prop="attrName" label="属性名称" width="150">
          </el-table-column>
          <el-table-column prop="name" label="属性值列表">
            <template slot-scope="{ row }">
              <el-tag
                type="success"
                v-for="attrValue in row.attrValueList"
                :key="attrValue.id"
                style="margin-right: 20px"
              >
                {{ attrValue.valueName }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="150">
            <template slot-scope="{ row }">
              <hint-button
                title="编辑"
                type="warning"
                icon="el-icon-edit"
                size="mini"
                @click="updateAttr(row)"
              >
              </hint-button>
              <hint-button
                title="删除"
                type="danger"
                icon="el-icon-delete"
                size="mini"
                @click="deleteAttr(row)"
              >
              </hint-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 添加|修改属性的结构 -->
      <div v-show="!isShowTable">
        <el-form :model="attrInfo" :inline="true" style="margin-left: 5px">
          <el-form-item label="属性名">
            <el-input
              v-model.trim="attrInfo.attrName"
              placeholder="请输入属性名"
            ></el-input>
          </el-form-item>
        </el-form>
        <el-button
          type="primary"
          icon="el-icon-plus"
          :disabled="!attrInfo.attrName"
          @click="addAttrValue"
        >
          添加属性值
        </el-button>
        <el-button @click="isShowTable = true">取消</el-button>
        <!-- 表格 -->
        <el-table
          :data="attrInfo.attrValueList"
          border
          style="width: 100%; margin: 20px 0"
        >
          <el-table-column type="index" label="序号" width="80" align="center">
          </el-table-column>
          <el-table-column prop="" label="属性值名称">
            <template slot-scope="{ row, $index }">
              <el-input
                :ref="$index"
                v-model.trim="row.valueName"
                placeholder="请输入属性值名称"
                size="mini"
                v-if="row.flag"
                @blur="toLook(row, $index)"
                @keyup.native.enter="toLook(row,$index)"
              >
              </el-input>
              <span v-else @click="toEdit(row, $index)" style="display: block">
                {{ row.valueName }}
              </span>
            </template>
          </el-table-column>
          <el-table-column prop="" label="操作">
            <template slot-scope="{ row, $index }">
              <el-popconfirm
                :title="`确定删除${row.valueName}？`"
                @onConfirm="deleteAttrValue($index)"
              >
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  slot="reference"
                >
                </el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <el-button
          type="primary"
          :disabled="attrInfo.attrValueList.length < 1"
          @click="addOrUpdate"
          >保存</el-button
        >
        <el-button @click="isShowTable = true">取消</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
import cloneDeep from "lodash/cloneDeep";

export default {
  name: "Attr",
  data() {
    return {
      category1Id: "",
      category2Id: "",
      category3Id: "",
      // 平台属性列表
      attrList: [],
      // 控制table显示与隐藏
      isShowTable: true,
      // 收集新增|修改属性
      attrInfo: {
        attrName: "", //属性名
        //属性值，因为属性值可以有多个因此用数组，每一个属性值都是一个对象需要attrId，valueName
        attrValueList: [],
        categoryId: 0, //三级分类的id
        categoryLevel: 3, //因为服务器也需要区分几级id
      },
    };
  },
  methods: {
    getCategoryId({ categoryId, level }) {
      if (level == 1) {
        this.category1Id = categoryId;
        this.category2Id = "";
        this.category3Id = "";
        this.attrList = [];
      } else if (level == 2) {
        this.category2Id = categoryId;
        this.category3Id = "";
        this.attrList = [];
      } else {
        this.category3Id = categoryId;
        // 获取平台属性数据
        this.getAttrList();
      }
    },
    // 获取平台属性数据
    async getAttrList() {
      const { category1Id, category2Id, category3Id } = this;
      const result = await this.$API.attr.reqAttrList(
        category1Id,
        category2Id,
        category3Id
      );
      if (result.code == 200) {
        this.attrList = result.data;
      }
    },
    // 添加属性值
    addAttrValue() {
      // 向属性值数组添加元素
      if (
        this.attrInfo.attrValueList.length > 0 &&
        this.attrInfo.attrValueList[this.attrInfo.attrValueList.length - 1]
          .valueName == ""
      )
        return;
      this.attrInfo.attrValueList.push({
        attrId: this.attrInfo.id, //对于修改某一个属性的时候，可以在已有的属性值基础之上新增新的属性值（新增属性值的时候，需要把已有的属性的id带上）
        valueName: "",
        flag: true,
      });
      //flag属性：给每一个属性值添加一个标记flag，用户切换查看模式与编辑模式，好处，每一个属性值可以控制自己的模式切换
      this.$nextTick(() => {
        this.$refs[this.attrInfo.attrValueList.length - 1].focus();
      });
    },
    // 添加属性按钮点击事件
    addAttr() {
      // 清除数据
      const category3Id = this.category3Id;
      this.attrInfo = {
        attrName: "", //属性名
        //属性值，因为属性值可以有多个因此用数组，每一个属性值都是一个对象需要attrId，valueName
        attrValueList: [],
        categoryId: category3Id, //三级分类的id
        categoryLevel: 3, //因为服务器也需要区分几级id
      };
      // 切换table显示与隐藏
      this.isShowTable = false;
    },
    updateAttr(row) {
      // 将选中的属性赋值给attrInfo
      this.attrInfo = cloneDeep(row);
      this.attrInfo.attrValueList.forEach((item) => {
        this.$set(item, "flag", false);
      });
      // 切换table显示与隐藏
      this.isShowTable = false;
    },
    // 失去焦点的事件
    toLook(row, index) {
      // 如果属性值为空不能作为新的属性值，需要给用户提示，让他输入一个其他的属性值
      if (row.valueName.trim() === "") {
        // this.$message("请您输入一个正常的属性值");
        this.$nextTick(() => {
          if (index < this.attrInfo.attrValueList.length) {
            //解决当添加到最后一个属性是空的话,被过滤后索引值出错
            this.$refs[index].focus();
          }
        });
        return;
      }
      //新增的属性值不能与已有的属性值重复
      let isRepeat = this.attrInfo.attrValueList.some((item) => {
        // 需要将row从数组里面判断的时候去除
        //row最新新增的属性值【数组的最后一项元素】
        //判断的时候，需要把已有的数组当中新增的这个属性值去除
        if (row !== item) {
          return row.valueName === item.valueName;
        }
      });
      if (isRepeat) {
        this.$message.closeAll();
        this.$message("新增的属性值不能与已有的属性值重复");
        this.$nextTick(() => {
          if (this.$refs[index]) {
            this.$refs[index].focus();
          }
        });
        return;
      }
      // row：形参是当前用户添加的最新的属性值
      // 当前编辑模式变为查看模式【让input消失，显示span】
      row.flag = false;
    },
    // 点击span的回调，变为编辑模式
    toEdit(row, index) {
      if (row.hasOwnProperty("flag")) {
        row.flag = true;
      } else {
        this.$set(row, "flag", true);
      }
      // 获取input，实现自动聚焦
      this.$nextTick(() => {
        this.$refs[index].focus();
      });
    },
    // 气泡确认框确认按钮的回调
    deleteAttrValue(index) {
      this.attrInfo.attrValueList.splice(index, 1);
    },
    //保存按钮：进行添加属性或者修改属性的操作
    async addOrUpdate() {
      //整理参数:1,如果用户添加很多属性值，且属性值为空的不应该提交给服务器
      //提交给服务器数据当中不应该出现flag字段
      this.attrInfo.attrValueList = this.attrInfo.attrValueList.filter(
        (item) => {
          //过滤掉属性值不是空的
          if (item.valueName !== "") {
            // 删除掉flag属性
            delete item.flag;
            // 去重
            return true;
          }
        }
      );
      // 数组嵌套对象去重
      const removeDuplicateObj = (arr) => {
        let obj = {};
        arr = arr.reduce((newArr, next) => {
          obj[next.valueName]
            ? ""
            : (obj[next.valueName] = true && newArr.push(next));
          return newArr;
        }, []);
        return arr;
      };

      this.attrInfo.attrValueList = removeDuplicateObj(
        this.attrInfo.attrValueList
      );
      try {
        // 发请求
        await this.$API.attr.reqAddOrUpdateAttr(this.attrInfo);
        //展示平台属性数据
        this.isShowTable = true;
        this.$message.closeAll();
        this.$message({
          type: "success",
          message: "保存成功",
        });
        //保存成功以后需要再次获取平台属性进行展示
        this.getAttrList();
      } catch (error) {
        this.isShowTable = true;
      }
    },

    deleteAttr(row) {
      this.$confirm(`您确定删除${row.attrName}该属性吗?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          const result = await this.$API.attr.reqDeleteAttrById(row.id);
          if (result.code === 200) {
            this.$message({
              type: "success",
              message: "删除成功!",
            });
            this.getAttrList();
          }
        })
        .catch((err) => {
          if (err == "cancel") {
            this.$message({
              type: "info",
              message: "已取消删除",
            });
          }
        });
    },
  },
};
</script>

<style>
/* body {
  padding-right: 0px !important;
} */
</style>

<style scoped>
</style>
