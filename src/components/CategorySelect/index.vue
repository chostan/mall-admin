<template>
  <div class="category-select">
    <el-form :model="cForm" :inline="true" class="demo-form-inline">
      <el-form-item label="一级分类">
        <el-select
          placeholder="请选择"
          v-model="cForm.category1Id"
          @change="handle1"
          :disabled="show"
        >
          <el-option
            :label="c1.name"
            :value="c1.id"
            v-for="c1 in list1"
            :key="c1.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="二级分类">
        <el-select
          placeholder="请选择"
          v-model="cForm.category2Id"
          @change="handle2"
          :disabled="show"
        >
          <el-option
            :label="c2.name"
            :value="c2.id"
            v-for="c2 in list2"
            :key="c2.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="三级分类">
        <el-select
          placeholder="请选择"
          v-model="cForm.category3Id"
          @change="handle3"
          :disabled="show"
        >
          <el-option
            :label="c3.name"
            :value="c3.id"
            v-for="c3 in list3"
            :key="c3.id"
          ></el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "CategorySelect",
  props: {
    show: {
      type: Boolean,
    },
  },
  data() {
    return {
      // 一级分类数据
      list1: [],
      // 二级分类数据
      list2: [],
      // 三级分类数据
      list3: [],
      // 对应分类的id
      cForm: {
        category1Id: "",
        category2Id: "",
        category3Id: "",
      },
    };
  },
  created() {
    // 获取一级分类数据
    this.getCategory1List();
  },
  methods: {
    // 获取一级分类数据
    async getCategory1List() {
      const result = await this.$API.attr.reqCategory1List();
      this.list1 = result.data;
    },
    // 一级分类change事件
    async handle1() {
      // 清除数据
      this.list2 = [];
      this.list3 = [];
      this.cForm.category2Id = "";
      this.cForm.category3Id = "";
      const { category1Id } = this.cForm;
      this.$emit("getCategoryId", { categoryId: category1Id, level: 1 });
      const result = await this.$API.attr.reqCategory2List(category1Id);
      this.list2 = result.data;
    },
    // 二级分类change事件
    async handle2() {
      // 清除数据
      this.list3 = [];
      this.cForm.category3Id = "";
      const { category2Id } = this.cForm;
      this.$emit("getCategoryId", { categoryId: category2Id, level: 2 });
      const result = await this.$API.attr.reqCategory3List(category2Id);
      this.list3 = result.data;
    },
    async handle3() {
      const { category3Id } = this.cForm;
      this.$emit("getCategoryId", { categoryId: category3Id, level: 3 });
    },
  },
};
</script>

<style scoped>
</style>
