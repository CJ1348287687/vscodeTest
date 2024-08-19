<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      size="small"
      :inline="true"
      v-show="showSearch"
      label-width="96px"
    >
      <el-form-item label="订单聚合编号" prop="orderNo">
        <el-input
          v-model="queryParams.orderNo"
          placeholder="请输入订单聚合编号"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="订单号" prop="elementOrderNo">
        <el-input
          v-model="queryParams.elementOrderNo"
          placeholder="请输入订单号"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="订单发展人" prop="fromUserName">
        <el-input
          v-model="queryParams.fromUserName"
          placeholder="请输入订单发展人"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="订单受理人" prop="toUserName">
        <el-input
          v-model="queryParams.toUserName"
          placeholder="请输入订单受理人"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="订单状态" prop="orderStatus">
        <el-input
          v-model="queryParams.orderStatus"
          placeholder="请输入订单状态"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="订单映射状态" prop="orderTrackStatus">
        <el-input
          v-model="queryParams.orderTrackStatus"
          placeholder="请输入订单映射状态"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="订单创建时间">
        <el-date-picker
          v-model="dateRange"
          style="width: 240px"
          value-format="yyyy-MM-dd HH:mm:ss"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="['00:00:00', '23:59:59']"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="组织名称" prop="tweetOrganizationName">
        <el-input
          v-model="queryParams.tweetOrganizationName"
          placeholder="请输入组织名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="推文编号" prop="tweetId">
        <el-input
          v-model="queryParams.tweetId"
          placeholder="请输入推文编号"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="推文名称" prop="tweetTitle">
        <el-input
          v-model="queryParams.tweetTitle"
          placeholder="请输入推文名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="推文类型" prop="tweetCommonFlag">
        <el-select
          v-model="queryParams.tweetCommonFlag"
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
          v-model="queryParams.targetType"
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
          v-model="queryParams.productName"
          placeholder="请输入产品名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="渠道类型" prop="channelType">
        <el-select
          v-model="queryParams.channelType"
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
          v-model="queryParams.channelName"
          placeholder="请输入渠道名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="渠道编码" prop="channelCode">
        <el-input
          v-model="queryParams.channelCode"
          placeholder="请输入渠道编码"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>

      <el-form-item label="受理备注" prop="remark">
        <el-input
          v-model="queryParams.remark"
          placeholder="请输入备注"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>

      <el-form-item>
        <el-button
          type="primary"
          icon="el-icon-search"
          size="mini"
          @click="handleQuery"
          >搜索</el-button
        >
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery"
          >重置</el-button
        >
        <el-button
          type="warning"
          icon="el-icon-download"
          v-hasPermi="['system:workBench:customerListExport']"
          size="mini"
          @click="handleProductList"
          >导出</el-button
        >
      </el-form-item>
      <right-toolbar
        :showSearch.sync="showSearch"
        @queryTable="getList"
      ></right-toolbar>
    </el-form>
    <!--列表-->
    <el-table
      v-loading="loading"
      :data="customerList"
      @selection-change="handleSelectionChange"
      @sort-change="handleSortChange"
      :header-cell-style="{ background: '#afccfd', color: '#333' }"
    >
      <el-table-column type="selection" min-width="50px" align="center" />
      <el-table-column
        label="订单聚合编号"
        width="200"
        prop="sic.orderNo"
        align="center"
        sortable="custom"
        :sort-orders="['descending', 'ascending']"
      >
        <template #default="scope">
          {{ scope.row.orderNo }}
        </template>
      </el-table-column>
      <el-table-column
        label="订单号"
        width="200"
        prop="sice.elementOrderNo"
        align="center"
        sortable="custom"
        :sort-orders="['descending', 'ascending']"
      >
        <template #default="scope">
          {{ scope.row.elementOrderNo }}
        </template>
      </el-table-column>
      <el-table-column
        label="订单发展人"
        min-width="110"
        prop="fromcustomeruser.nickName"
        align="center"
        sortable="custom"
        :sort-orders="['descending', 'ascending']"
      >
        <template #default="scope">
          {{ scope.row.fromUserName }}
        </template>
      </el-table-column>
      <el-table-column
        label="订单受理人"
        min-width="110"
        prop="tocustomeruser.nickName"
        align="center"
        sortable="custom"
        :sort-orders="['descending', 'ascending']"
      >
        <template #default="scope">
          {{ scope.row.toUserName }}
        </template>
      </el-table-column>
      <el-table-column
        label="订单甩单"
        min-width="80"
        prop="isForward"
        align="center"
      >
        <template #default="scope">
          {{ scope.row.isForward == 0 ? "否" : "是" }}
        </template>
      </el-table-column>
      <el-table-column
        label="订单状态"
        width="100"
        prop="sice.orderStatus"
        align="center"
        sortable="custom"
        :sort-orders="['descending', 'ascending']"
      >
        <template #default="scope">
          {{ scope.row.orderStatus }}
        </template>
      </el-table-column>
      <el-table-column
        label="订单映射状态"
        width="125"
        prop="sice.orderTrackStatus"
        align="center"
        sortable="custom"
        :sort-orders="['descending', 'ascending']"
      >
        <template #default="scope">
          {{ scope.row.orderTrackStatus }}
        </template>
      </el-table-column>
      <el-table-column
        label="订单创建时间"
        width="155"
        prop="sice.createTime"
        align="center"
        sortable="custom"
        :sort-orders="['descending', 'ascending']"
      >
        <template #default="scope">
          {{ scope.row.createTime }}
        </template>
      </el-table-column>
      <el-table-column
        label="组织名称"
        min-width="100"
        prop="tweetorg.organizationName"
        align="center"
        sortable="custom"
        :sort-orders="['descending', 'ascending']"
      >
        <template #default="scope">
          {{ scope.row.tweetOrganizationName }}
        </template>
      </el-table-column>
      <el-table-column
        label="推文编号"
        min-width="100"
        prop="st.tweetId"
        align="center"
        sortable="custom"
        :sort-orders="['descending', 'ascending']"
      >
        <template #default="scope">
          {{ scope.row.tweetId }}
        </template>
      </el-table-column>
      <el-table-column
        label="推文名称"
        min-width="200"
        prop="st.tweetTitle"
        align="left"
        sortable="custom"
        :sort-orders="['descending', 'ascending']"
      >
        <template #default="scope">
          {{ scope.row.tweetTitle }}
        </template>
      </el-table-column>
      <el-table-column
        label="推文类型"
        min-width="100"
        prop="st.tweetCommonFlag"
        align="center"
        sortable="custom"
        :sort-orders="['descending', 'ascending']"
      >
        <template #default="scope">
          {{ scope.row.tweetCommonFlag === "1" ? "公共" : "私有" }}
        </template>
      </el-table-column>
      <el-table-column
        label="产品类型"
        min-width="100"
        prop="sice.targetType"
        align="center"
        sortable="custom"
        :sort-orders="['descending', 'ascending']"
      >
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
      <el-table-column
        label="产品名称"
        min-width="100"
        prop="sice.productName"
        align="center"
        sortable="custom"
        :sort-orders="['descending', 'ascending']"
      >
        <template #default="scope">
          {{ scope.row.productName }}
        </template>
      </el-table-column>
      <el-table-column
        label="渠道类型"
        min-width="100"
        prop="stc.channelType"
        align="center"
        sortable="custom"
        :sort-orders="['descending', 'ascending']"
      >
        <template #default="scope">
          <dict-tag
            :options="dict.type.tweet_channel"
            :value="scope.row.channelType"
          />
        </template>
      </el-table-column>
      <el-table-column
        label="渠道名称"
        min-width="100"
        prop="stc.channelName"
        align="center"
        sortable="custom"
        :sort-orders="['descending', 'ascending']"
      >
        <template #default="scope">
          {{ scope.row.channelName }}
        </template>
      </el-table-column>
      <el-table-column
        label="渠道编码"
        min-width="100"
        prop="stc.channelCode"
        align="center"
        sortable="custom"
        :sort-orders="['descending', 'ascending']"
      >
        <template #default="scope">
          {{ scope.row.channelCode }}
        </template>
      </el-table-column>
      <el-table-column label="下单详情" min-width="200" align="center">
        <template #default="scope">
          <el-button
            size="mini"
            type="text"
            @click="handleFormPreview(scope.row)"
            v-if="scope.row.isForward == 0"
            >详情
          </el-button>
          <span v-if="scope.row.isForward != 0">{{
            scope.row.forwardStatusName
          }}</span>
        </template>
      </el-table-column>
      <el-table-column label="受理备注" width="100" align="center">
        <template #default="scope">
          <el-tooltip
            class="item"
            effect="dark"
            placement="top-start"
            v-if="
              scope.row.isForward == 0 &&
              scope.row.remark != null &&
              scope.row.remark.length > 5
            "
          >
            <div slot="content">{{ scope.row.remark }}</div>
            <span>{{ scope.row.remark.substring(0, 5) }}..</span>
          </el-tooltip>
          <span
            v-if="
              scope.row.isForward == 0 &&
              scope.row.remark != null &&
              scope.row.remark.length <= 5
            "
            >{{ scope.row.remark }}</span
          >
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        width="150"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-document"
            @click="handleTweetPreview(scope.row)"
            >推文预览
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-setting"
            @click="handleModuleLog(scope.row)"
            v-hasPermi="['system:workBench:logList']"
            >日志</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <!--分页工具栏-->
    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <el-dialog
      custom-class="tweet-preview-dialog"
      title="推文预览"
      :visible.sync="tweetPreview"
      width="1100px"
      append-to-body
      :close-on-click-modal="false"
      :show-close="false"
      :close-on-press-escape="false"
    >
      <div style="min-height: 580px">
        <tweet-preview v-if="tweetPreview" ref="tweetPreview"></tweet-preview>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="tweetPreview = false">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 表单/签到预览 -->
    <el-dialog
      title="预览"
      :visible.sync="formPreview"
      width="500px"
      append-to-body
      :close-on-click-modal="false"
      :show-close="false"
      :close-on-press-escape="false"
    >
      <form-preview ref="formPreview"></form-preview>
      <div slot="footer" class="dialog-footer">
        <el-button @click="formPreview = false">取 消</el-button>
      </div>
    </el-dialog>

    <!--操作日志列表-->
    <el-dialog
      title="日志列表"
      :visible.sync="openModuleLog"
      width="700px"
      append-to-body
      :close-on-click-modal="false"
      :show-close="true"
      @close="closeModuleLog"
    >
      <div class="block">
        <el-timeline>
          <el-timeline-item
            v-for="(log, index) in moduleLogList"
            :key="index"
            :timestamp="parseTime(log.createTime, '{y}-{m}-{d} {h}:{i}:{s}')"
            placement="top"
          >
            <el-card style="width: 550px">
              <h4>{{ log.createBy }}</h4>
              <p v-html="log.operTitle">{{ log.operTitle }}</p>
            </el-card>
          </el-timeline-item>
        </el-timeline>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeModuleLog">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 产品列表 -->
    <DialogProductList
      :openProduct="openProduct"
      :queryParamsProduct="queryParamsProduct"
      :dateRange="dateRange"
      @closeDialog="openProduct = false"
    />
  </div>
</template>

<script>
import {
  intentionCustomerList,
  customerLogList,
} from "../../../api/system/customer/index";
import tweetPreview from "@/components/tweet/tweetPreview.vue";
import formPreview from "@/components/tweet/formPreview.vue";
import DialogProductList from "@/views/components/DialogProductList";
import {
  organizationUser,
  userOrganization,
} from "../../../api/system/production/tweet";
export default {
  name: "myCustomer",
  dicts: ["tweet_channel", "sys_customer_type"],
  components: { tweetPreview, formPreview, DialogProductList },
  data() {
    return {
      openProduct: false,
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
      channelStatuss: [
        {
          value: "E",
          label: "上架",
        },
        {
          value: "J",
          label: "下架",
        },
        {
          value: "D",
          label: "删除",
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
      // 遮罩层
      loading: true,
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 日期范围
      dateRange: [],
      // 查询参数
      queryParams: {
        elementIds: [],
        pageNum: 1,
        pageSize: 10,
        elementId: undefined,
        orderNo: null,
        elementOrderNo: null,
        tweetId: undefined,
        tweetOrganizationName: "",
        tweetTitle: "",
        tweetCommonFlag: "",
        channelType: "",
        channelName: "",
        channelCode: "",
        channelStatus: "",
        targetType: "",
        productName: "",
        fromUserName: "",
        toUserName: "",
        elementPhone: "",
        orderStatus: "",
        orderTrackStatus: "",
        remark: "",
        searchType: this.$route.query.searchType,
        organizationId: sessionStorage.getItem("organizationId"),
      },
      //意向用户列表
      customerList: [],
      // 总条数
      total: 0,
      // 选中数组
      ids: [],
      // 是否显示弹出层
      open: false,
      // 弹出层标题
      title: "",
      //推文预览
      tweetPreview: false,
      //子表查询
      loadingChannel: false,
      loadingShare: false,
      //表单预览
      formPreview: false,
      //甩单
      openForward: false,
      organizationList: [],
      userList: [],
      elementId: null,
      toOrganizationId: null,
      toUserId: null,
      saveLoading: false,
      //日志
      moduleLogList: [],
      openModuleLog: false,
      //备注
      remark: "",
      openRemark: false,
      saveLoading: false,
    };
  },
  created() {
    this.getList();
  },
  activated() {
    this.getList();
  },
  mounted() {},
  methods: {
    // 搜索按钮操作
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    // 重置搜索按钮操作
    resetQuery() {
      this.dateRange = [];
      (this.queryParams = {
        elementIds: [],
        pageNum: 1,
        pageSize: 10,
        elementId: undefined,
        orderNo: null,
        elementOrderNo: null,
        tweetId: undefined,
        tweetOrganizationName: "",
        tweetTitle: "",
        tweetCommonFlag: "",
        createBy: "",
        channelType: "",
        channelName: "",
        channelCode: "",
        channelStatus: "",
        targetType: "",
        productName: "",
        fromUserName: "",
        toUserName: "",
        elementPhone: "",
        orderStatus: "",
        orderTrackStatus: "",
        remark: "",
        searchType: this.$route.query.searchType,
        organizationId: sessionStorage.getItem("organizationId"),
      }),
        (this.ids = []),
        this.handleQuery();
    },
    // 列表
    getList() {
      if (
        this.queryParams.tweetId != null &&
        this.queryParams.tweetId != undefined &&
        this.queryParams.tweetId != ""
      ) {
        if (
          !(
            !isNaN(parseFloat(this.queryParams.tweetId)) &&
            isFinite(this.queryParams.tweetId)
          )
        ) {
          this.$modal.msgError("推文编号请填写数字");
          return;
        }
      }
      (this.ids = []), (this.clickTweetIds = []);
      this.clickChannelIds = [];
      this.loading = true;
      this.queryParams.organizationId =
        sessionStorage.getItem("organizationId");
      intentionCustomerList(
        this.addDateRange(this.queryParams, this.dateRange)
      ).then((response) => {
        let customerList = [];
        let userId = sessionStorage.getItem("userId");
        let organizationId = sessionStorage.getItem("organizationId");
        response.rows.forEach((item, index) => {
          item.isForward = 0;
          item.forwardStatusName = "";
          if (item.toUserId == userId) {
            item.isForward = 0;
          } else {
            item.isForward = 1;
            item.forwardStatusName =
              "该订单由(" +
              item.fromOrganizationName +
              ")" +
              item.fromUserName +
              "甩单给(" +
              item.toOrganizationName +
              ")" +
              item.toUserName;
          }
          customerList.push(item);
        });
        this.customerList = customerList;
        this.total = response.total;
        this.loading = false;
      });
    },
    customerExport() {
      this.queryParams.organizationId =
        sessionStorage.getItem("organizationId");
      this.queryParams.elementIds = this.ids;
      this.download(
        "/system/customer/customerListExport",
        {
          ...this.addDateRange(this.queryParams, this.dateRange),
        },
        `意向用户列表_${new Date().getTime()}.xlsx`
      );
    },
    /** 产品列表-----开始 */
    handleProductList(row) {
      console.log(this.ids);
      this.queryParamsProduct = JSON.parse(JSON.stringify(this.queryParams));
      this.queryParamsProduct.elementIds = this.ids;
      this.queryParamsProduct.organizationId =
        sessionStorage.getItem("organizationId");
      this.openProduct = true;
    },
    /** 排序触发事件 */
    handleSortChange(column, prop, order) {
      this.queryParams.orderByColumn = column.prop;
      this.queryParams.isAsc = column.order;
      this.getList();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.elementId);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },
    // 推文预览
    handleTweetPreview(row) {
      this.tweetPreview = true;
      if (!this.$refs.tweetPreview) {
        setTimeout(() => {
          this.$refs.tweetPreview.getData(row.tweetId, row.channelId);
        }, 500);
      } else {
        this.$refs.tweetPreview.getData(row.tweetId, row.channelId);
      }
    },
    // 表单/签到预览
    handleFormPreview(row) {
      this.formPreview = true;
      this.$nextTick(() => {
        if (row.targetType == "SCENE_SIGN") {
          this.$refs.formPreview.getData(row.targetRecordId, "signRecord");
        } else if (row.targetType == "SCENE_FORM") {
          this.$refs.formPreview.getData(row.targetRecordId, "formRecord");
        }
      });
    },
    //日志
    handleModuleLog(row) {
      this.openModuleLog = true;
      customerLogList({ targetId: row.elementId }).then((response) => {
        this.moduleLogList = response.rows;
      });
    },
    //关闭日志弹窗
    closeModuleLog() {
      this.openModuleLog = false;
      this.moduleLogList = [];
    },
  },
};
</script>

<style>
.tweet-preview-dialog .el-dialog__body {
  padding: 10px 20px;
}
</style>
