<!-- 产品列表 -->
<template>
  <el-dialog
    title="产品列表"
    :visible.sync="openProduct"
    width="1250px"
    append-to-body
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :show-close="false"
  >
    <el-form
      :model="queryParamsProduct"
      ref="queryFormProduct"
      size="small"
      :inline="true"
      v-show="showSearchProduct"
      label-width="100px"
    >
      <el-form-item label="推文编号" prop="tweetId">
        <el-input
          v-model="queryParamsProduct.tweetId"
          placeholder="请输入推文编号"
          clearable
          @keyup.enter.native="handleQueryProduct"
        />
      </el-form-item>
      <el-form-item label="推文名称" prop="tweetTitle">
        <el-input
          v-model="queryParamsProduct.tweetTitle"
          placeholder="请输入推文名称"
          clearable
          @keyup.enter.native="handleQueryProduct"
        />
      </el-form-item>
      <el-form-item label="推文类型" prop="tweetCommonFlag">
        <el-select
          v-model="queryParamsProduct.tweetCommonFlag"
          placeholder="请选择推文类型"
          clearable
        >
          <el-option
            v-for="dict in tweetCommonFlags"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="产品类型" prop="targetType">
        <el-select
          v-model="queryParamsProduct.targetType"
          placeholder="请选择产品类型"
          clearable
        >
          <el-option
            v-for="dict in targetTypes"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="产品名称" prop="productName">
        <el-input
          v-model="queryParamsProduct.productName"
          placeholder="请输入产品名称"
          clearable
          @keyup.enter.native="handleQueryProduct"
        />
      </el-form-item>
      <el-form-item label="渠道类型" prop="channelType">
        <el-select
          v-model="queryParamsProduct.channelType"
          placeholder="请选择渠道类型"
          clearable
        >
          <el-option
            v-for="dict in dict.type.tweet_channel"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="渠道名称" prop="channelName">
        <el-input
          v-model="queryParamsProduct.channelName"
          placeholder="请输入渠道名称"
          clearable
          @keyup.enter.native="handleQueryProduct"
        />
      </el-form-item>
      <el-form-item label="渠道编码" prop="channelCode">
        <el-input
          v-model="queryParamsProduct.channelCode"
          placeholder="请输入渠道编码"
          clearable
          @keyup.enter.native="handleQueryProduct"
        />
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          icon="el-icon-search"
          size="mini"
          @click="handleQueryProduct"
          >搜索</el-button
        >
      </el-form-item>
    </el-form>

    <el-table v-loading="loadingProduct" :data="productList">
      <el-table-column label="序号" type="index" align="center" width="50">
        <template slot-scope="scope">
          <span>{{
            (queryParamsProduct.pageNum - 1) * queryParamsProduct.pageSize +
            scope.$index +
            1
          }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="组织名称"
        align="center"
        prop="tweetOrganizationName"
      />
      <el-table-column
        label="推文编号"
        align="center"
        prop="tweetId"
        width="80"
      />
      <el-table-column label="推文名称" align="center" prop="tweetTitle" />
      <el-table-column
        label="推文类型"
        align="center"
        prop="tweetCommonFlag"
        width="80"
      >
        <template #default="scope">
          {{ scope.row.tweetCommonFlag === "1" ? "公共" : "私有" }}
        </template>
      </el-table-column>
      <el-table-column
        label="渠道类型"
        align="center"
        prop="detailsOrderStatusDesc"
        width="80"
      >
        <template #default="scope">
          <dict-tag
            :options="dict.type.tweet_channel"
            :value="scope.row.channelType"
          />
        </template>
      </el-table-column>
      <el-table-column label="渠道名称" align="center" prop="channelName" />
      <el-table-column label="渠道编码" align="center" prop="channelCode" />
      <el-table-column label="产品类型" align="center" prop="targetType">
        <template #default="scope">
          {{
            scope.row.targetType === "SCENE_FORM"
              ? "表单"
              : scope.row.targetType === "SCENE_SIGN"
              ? "签到"
              : scope.row.targetType === "PRODUCT_COUPON"
              ? "优惠券"
              : "其他"
          }}
        </template>
      </el-table-column>
      <el-table-column label="产品名称" align="center" prop="productName" />
      <el-table-column
        label="订单量"
        align="center"
        prop="allElementOrder"
        width="80"
      />
      <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
        width="80"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-download"
            @click="customerExport2(scope.row)"
            >导出
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="totalProduct > 0"
      :total="totalProduct"
      :page.sync="queryParamsProduct.pageNum"
      :limit.sync="queryParamsProduct.pageSize"
      @pagination="getProductList"
    />
    <div slot="footer" class="dialog-footer">
      <el-button @click="cancelProduct">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { productList } from "@/api/system/customer/index";
export default {
  name: "DialogProductList",
  dicts: ["tweet_channel", "sys_customer_type", "sys_customer_default_type"],
  props: {
    //弹框visible默认值
    openProduct: {
      type: Boolean,
      default: false,
    },
    //列表参数
    queryParamsProduct: {
      type: Object,
      default: null,
    },
    //时间区间
    dateRange: {
      type: Array,
      default: [],
    },
  },
  data() {
    return {
      queryParams:{},
      //产品列表--开始
      productList: [],
      loadingProduct: true,
      totalProduct: 0,
      // 显示搜索条件
      showSearchProduct: true,
      tweetCommonFlags: [
        {
          value: "1",
          label: "公共",
        },
        {
          value: "0",
          label: "私有",
        },
      ],
      targetTypes: [
        {
          value: "SCENE_FORM",
          label: "表单",
        },
        {
          value: "SCENE_SIGN",
          label: "签到",
        },
        {
          value: "PRODUCT_COUPON",
          label: "优惠券",
        },
      ],
    };
  },
  watch: {
    // 监听props的变化
    openProduct(newValue, oldValue) {
      // 当openProduct变化时，可以执行一些逻辑
      console.log(`Switch value changed from ${oldValue} to ${newValue}`);
      if (newValue) {
        this.queryParamsProduct.pageNum = 1
        this.getProductList();
        this.queryParams = JSON.parse(JSON.stringify(this.queryParamsProduct));
      }
    },
  },
  methods: {
    getProductList() {
      if (
        this.queryParamsProduct.tweetId != null &&
        this.queryParamsProduct.tweetId != undefined &&
        this.queryParamsProduct.tweetId != ""
      ) {
        if (
          !(
            !isNaN(parseFloat(this.queryParamsProduct.tweetId)) &&
            isFinite(this.queryParamsProduct.tweetId)
          )
        ) {
          this.$modal.msgError("推文编号请填写数字");
          return;
        }
      }
      this.loadingProduct = true;
      productList(
        this.addDateRange(this.queryParamsProduct, this.dateRange)
      ).then((response) => {
        this.productList = response.rows;
        this.totalProduct = response.total;
        this.loadingProduct = false;
      });
    },
    /** 搜索按钮操作 */
    handleQueryProduct() {
      this.queryParamsProduct.pageNum = 1;
      this.getProductList();
    },
    customerExport2(row) {
      let params = JSON.parse(JSON.stringify(this.queryParams));
      params.organizationId = sessionStorage.getItem("organizationId");

      params.tweetId = row.tweetId;
      params.channelId = row.channelId;
      params.targetId = row.targetId;
      params.targetType = row.targetType;
      params.productName = row.productName;
      this.download(
        "/system/customer/customerListExport",
        {
          ...this.addDateRange(params, this.dateRange),
        },
        `意向用户列表_${new Date().getTime()}.xlsx`
      );
    },
    /** 选项值列表取消按钮 */
    cancelProduct() {
      this.$emit("closeDialog");
      this.productList = [];
      this.totalProduct = 0;
      this.resetForm("queryFormProduct");
    },
  },
};
</script>

<style lang="scss" scoped></style>
