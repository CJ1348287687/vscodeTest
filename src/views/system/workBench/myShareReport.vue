<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      size="small"
      :inline="true"
      v-show="showSearch"
      label-width="68px"
    >
      <el-form-item label="推文编号" prop="tweetId">
        <el-input
          v-model="queryParams.tweetId"
          placeholder="请输入推文编号"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="推文来源" prop="tweetOrganizationName">
        <el-input
          v-model="queryParams.tweetOrganizationName"
          placeholder="请输入推文来源"
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
      <el-form-item label="推文状态" prop="tweetStatuss">
        <el-select
          v-model="queryParams.tweetStatus"
          placeholder="请选择推文状态"
          clearable
        >
          <el-option
            v-for="dict in tweetStatuss"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="创建时间">
        <el-date-picker
          v-model="dateRange"
          style="width: 250px"
          value-format="yyyy-MM-dd HH:mm:ss"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="['00:00:00', '23:59:59']"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="创建人" prop="createBy">
        <el-input
          v-model="queryParams.createBy"
          placeholder="请输入用户名"
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
      <el-form-item label="上架状态" prop="channelStatus">
        <el-select
          v-model="queryParams.channelStatus"
          placeholder="请选择上架状态"
          clearable
        >
          <el-option
            v-for="dict in channelStatuss"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
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
      </el-form-item>
      <right-toolbar
        :showSearch.sync="showSearch"
        @queryTable="getList"
      ></right-toolbar>
    </el-form>
    <!--列表-->
    <el-table
      v-loading="loading"
      :data="tweetList"
      @selection-change="handleSelectionChange"
      @sort-change="handleSortChange"
      :header-cell-style="{ background: '#afccfd', color: '#333' }"
    >
      <el-table-column
        label="推文来源"
        min-width="100"
        prop="org.organizationName"
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
        label="推文状态"
        min-width="100"
        prop="st.tweetStatus"
        align="center"
        sortable="custom"
        :sort-orders="['descending', 'ascending']"
      >
        <template #default="scope">
          {{ scope.row.tweetStatus === "1" ? "入库" : "出库" }}
        </template>
      </el-table-column>
      <el-table-column
        label="创建人"
        min-width="100"
        prop="st.createBy"
        align="center"
        sortable="custom"
        :sort-orders="['descending', 'ascending']"
      >
        <template #default="scope">
          {{ scope.row.tweetCreateBy }}
        </template>
      </el-table-column>
      <el-table-column
        label="创建时间"
        prop="st.createTime"
        align="center"
        width="155"
        sortable="custom"
        :sort-orders="['descending', 'ascending']"
      >
        <template #default="scope">
          {{ scope.row.tweetCreateTime }}
        </template>
      </el-table-column>

      <el-table-column
        label="渠道类型"
        prop="channelType"
        width="100"
        align="center"
        sortable="custom"
        :sort-orders="['descending', 'ascending']"
      >
        <template #default="scop">
          <dict-tag
            :options="dict.type.tweet_channel"
            :value="scop.row.channelType"
          />
        </template>
      </el-table-column>
      <el-table-column
        label="渠道名称"
        prop="stc.channelName"
        width="150"
        align="center"
        sortable="custom"
        :sort-orders="['descending', 'ascending']"
      >
        <template #default="scop">
          {{ scop.row.channelName }}
        </template>
      </el-table-column>
      <el-table-column
        label="渠道编码"
        prop="stc.channelCode"
        width="150"
        align="center"
        sortable="custom"
        :sort-orders="['descending', 'ascending']"
      >
        <template #default="scop">
          {{ scop.row.channelCode }}
        </template>
      </el-table-column>
      <el-table-column
        label="上架状态"
        prop="stc.status"
        align="center"
        width="100"
        sortable="custom"
        :sort-orders="['descending', 'ascending']"
      >
        <template #default="scop">
          <el-tag
            :type="
              scop.row.channelStatus === 'E'
                ? 'success'
                : scop.row.channelStatus === 'J'
                ? 'danger'
                : ''
            "
          >
            {{
              scop.row.channelStatus === "E"
                ? "上架"
                : scop.row.channelStatus === "J"
                ? "下架"
                : "删除"
            }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column label="浏览量" align="center" prop="pvCount" width="60">
        <template #default="scope">
          {{ scope.row.pvCount == null ? 0 : scope.row.pvCount }}
        </template>
      </el-table-column>
      <el-table-column
        label="浏览人数"
        align="center"
        prop="uvCount"
        width="80"
      >
        <template #default="scope">
          {{ scope.row.uvCount == null ? 0 : scope.row.uvCount }}
        </template>
      </el-table-column>
      <el-table-column
        v-for="(item, index) in templateTypeList"
        :key="index"
        :label="item.templateType + '量'"
        align="center"
        width="100"
      >
        <template #default="scope">
          <el-button
            size="mini"
            type="text"
            @click="handleTargetList(scope.row, item.templateType, '')"
          >
            {{ getValue(scope.row.countList, item.templateType) }}</el-button
          >
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
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

    <!-- 推文下表单/签到列表 -->
    <el-dialog
      :title="targetTitle"
      :visible.sync="openTarget"
      width="1200px"
      append-to-body
      @close="closeTarget"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
    >
      <el-form
        :model="queryParamsTarget"
        ref="queryTarget"
        size="small"
        :inline="true"
        v-show="showSearchTarget"
        label-width="68px"
      >
        <el-form-item label="产品名称" prop="productName">
          <el-input
            style="width: 160px"
            v-model="queryParamsTarget.productName"
            placeholder="请输入产品名称"
            clearable
            @keyup.enter.native="handleQueryTarget"
          />
        </el-form-item>
        <el-form-item
          label="标题"
          prop="targetTitle"
          v-if="targetTitle == '签到列表' || targetTitle == '表单列表'"
        >
          <el-input
            style="width: 160px"
            v-model="queryParamsTarget.targetTitle"
            placeholder="请输入标题"
            clearable
            @keyup.enter.native="handleQueryTarget"
          />
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            icon="el-icon-search"
            size="mini"
            @click="handleQueryTarget"
            >搜索</el-button
          >
          <el-button
            icon="el-icon-refresh"
            size="mini"
            @click="resetQueryTarget"
            >重置</el-button
          >
        </el-form-item>
      </el-form>

      <el-row :gutter="10" class="mb8">
        <right-toolbar
          :showSearch.sync="showSearchTarget"
          @queryTable="getTargetList"
        ></right-toolbar>
      </el-row>

      <el-table
        v-loading="loadingTarget"
        :data="targetList"
        @sort-change="handleSortChangeTarget"
      >
        <el-table-column label="序号" type="index" align="center">
          <template slot-scope="scope">
            <span>{{
              (queryParamsTarget.pageNum - 1) * queryParamsTarget.pageSize +
              scope.$index +
              1
            }}</span>
          </template>
        </el-table-column>
        <el-table-column label="产品名称" align="center">
          <template slot-scope="scope">
            {{ scope.row.productName }}
          </template>
        </el-table-column>
        <el-table-column label="产品模板" align="center">
          <template slot-scope="scope">
            {{ scope.row.templateName }}
          </template>
        </el-table-column>
        <el-table-column
          label="标题"
          v-if="targetTitle == '签到列表' || targetTitle == '表单列表'"
          align="center"
          prop="target.title"
          sortable="custom"
          :sort-orders="['descending', 'ascending']"
        >
          <template slot-scope="scope">
            {{ scope.row.targetTitle }}
          </template>
        </el-table-column>
        <el-table-column
          label="开始时间"
          v-if="targetTitle == '签到列表'"
          align="center"
          prop="target.start_time"
          sortable="custom"
          :sort-orders="['descending', 'ascending']"
        >
          <template slot-scope="scope">
            <span>{{
              parseTime(scope.row.targetStartTime, "{y}-{m}-{d}")
            }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="结束时间"
          v-if="targetTitle == '签到列表'"
          align="center"
          prop="target.end_time"
          sortable="custom"
          :sort-orders="['descending', 'ascending']"
        >
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.targetEndTime, "{y}-{m}-{d}") }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="是否核销"
          v-if="targetTitle == '签到列表'"
          align="center"
          prop="targetCheckoutType"
        >
          <template #default="scope">
            {{ scope.row.targetCheckoutType === 1 ? "是" : "否" }}
          </template>
        </el-table-column>
        <el-table-column label="状态" align="center" key="targetStatus">
          <template #default="scope">
            <el-tag
              :type="scope.row.targetStatus === '1' ? 'success' : 'danger'"
            >
              {{ scope.row.targetStatus === "1" ? "使用中" : "删除" }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="用户数" align="center" prop="userCount" />
        <el-table-column label="记录数" align="center" prop="recordCount">
          <template #default="scope">
            <span v-if="scope.row.recordCount == null"></span>
            <span v-if="scope.row.recordCount == 0" style="color: #46a6ff"
              >0</span
            >
            <el-button
              v-if="scope.row.recordCount != 0 && scope.row.recordCount != null"
              size="mini"
              type="text"
              @click="handleCustomerList(scope.row)"
            >
              {{ scope.row.recordCount }}</el-button
            >
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          align="center"
          class-name="small-padding fixed-width"
          width="100"
        >
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              icon="el-icon-download"
              v-hasPermi="['system:workBench:customerListExport']"
              @click="handleCustomerExport(scope.row)"
              >导出
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        v-show="totalTarget > 0"
        :total="totalTarget"
        :page.sync="queryParamsTarget.pageNum"
        :limit.sync="queryParamsTarget.pageSize"
        @pagination="getTargetList"
      />
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="closeTarget()">取 消</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 意向用户列表 -->
    <el-dialog
      title="意向用户"
      :visible.sync="openCustomer"
      width="1200px"
      append-to-body
      @close="closeCustomer"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
    >
      <el-form
        :model="queryParamsCustomer"
        ref="queryCustomer"
        size="small"
        :inline="true"
        v-show="showSearchCustomer"
        label-width="96px"
      >
        <el-form-item label="订单聚合编号" prop="orderNo">
          <el-input
            v-model="queryParamsCustomer.orderNo"
            placeholder="请输入订单聚合编号"
            clearable
            @keyup.enter.native="handleQueryCustomer"
          />
        </el-form-item>
        <el-form-item label="订单号" prop="elementOrderNo">
          <el-input
            v-model="queryParamsCustomer.elementOrderNo"
            placeholder="请输入订单号"
            clearable
            @keyup.enter.native="handleQueryCustomer"
          />
        </el-form-item>
        <el-form-item label="订单发展人" prop="fromUserName">
          <el-input
            v-model="queryParamsCustomer.fromUserName"
            placeholder="请输入订单发展人"
            clearable
            @keyup.enter.native="handleQueryCustomerv"
          />
        </el-form-item>
        <el-form-item label="订单受理人" prop="toUserName">
          <el-input
            v-model="queryParamsCustomer.toUserName"
            placeholder="请输入订单受理人"
            clearable
            @keyup.enter.native="handleQueryCustomer"
          />
        </el-form-item>
        <el-form-item label="订单状态" prop="orderStatus">
          <el-input
            v-model="queryParamsCustomer.orderStatus"
            placeholder="请输入订单状态"
            clearable
            @keyup.enter.native="handleQueryCustomer"
          />
        </el-form-item>
        <el-form-item label="订单映射状态" prop="orderTrackStatus">
          <el-input
            v-model="queryParamsCustomer.orderTrackStatus"
            placeholder="请输入订单映射状态"
            clearable
            @keyup.enter.native="handleQueryCustomer"
          />
        </el-form-item>
        <el-form-item label="订单创建时间">
          <el-date-picker
            v-model="dateRangeCustomer"
            style="width: 240px"
            value-format="yyyy-MM-dd HH:mm:ss"
            type="daterange"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :default-time="['00:00:00', '23:59:59']"
          ></el-date-picker>
        </el-form-item>

        <el-form-item>
          <el-button
            type="primary"
            icon="el-icon-search"
            size="mini"
            @click="handleQueryCustomer"
            >搜索</el-button
          >
          <el-button
            icon="el-icon-refresh"
            size="mini"
            @click="resetQueryCustomer"
            >重置</el-button
          >
          <el-button
            type="warning"
            icon="el-icon-download"
            v-hasPermi="['system:workBench:customerListExport']"
            size="mini"
            @click="customerExport"
            >导出</el-button
          >
        </el-form-item>
      </el-form>

      <el-row :gutter="10" class="mb8">
        <right-toolbar
          :showSearch.sync="showSearchCustomer"
          @queryTable="getCustomerList"
        ></right-toolbar>
      </el-row>

      <el-table
        v-loading="loadingCustomer"
        :data="customerList"
        @sort-change="handleSortChangeCustomer"
        @selection-change="handleSelectionChangeCustomer"
      >
        <el-table-column type="selection" min-width="50px" align="center" />
        <el-table-column label="序号" type="index" align="center">
          <template slot-scope="scope">
            <span>{{
              (queryParamsCustomer.pageNum - 1) * queryParamsCustomer.pageSize +
              scope.$index +
              1
            }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="订单聚合编号"
          width="215"
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
          width="215"
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
          width="115"
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
          width="135"
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
        <el-table-column label="受理详情" min-width="200" align="center">
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
      </el-table>

      <pagination
        v-show="totalCustomer > 0"
        :total="totalCustomer"
        :page.sync="queryParamsCustomer.pageNum"
        :limit.sync="queryParamsCustomer.pageSize"
        @pagination="getCustomerList"
      />
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="closeCustomer()">取 消</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 表单/签到预览 -->
    <el-dialog
      title="产品详情"
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
  </div>
</template>

<script>
import {
  sharePersonReport,
  sharePhoneReport,
  targetReport,
  customerList,
} from "../../../api/system/share/tweetReport";
import { mbTypeListByManage } from "@/api/system/mb/mb";
import tweetPreview from "@/components/tweet/tweetPreview.vue";
import formPreview from "@/components/tweet/formPreview.vue";
export default {
  name: "myShareReport",
  dicts: ["tweet_channel", "sys_customer_type"],
  components: { tweetPreview, formPreview },
  data() {
    return {
      tweetStatuss: [
        {
          value: "1",
          label: "入库",
        },
        {
          value: "0",
          label: "出库",
        },
      ],
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
        delFlag: this.$route.query.delFlag,
        pageNum: 1,
        pageSize: 10,
        tweetStatus: "",
        tweetId: undefined,
        tweetOrganizationName: "",
        tweetTitle: "",
        tweetCommonFlag: "",
        createBy: "",
        channelType: "",
        channelName: "",
        channelCode: "",
        channelStatus: "",
        organizationId: sessionStorage.getItem("organizationId"),
      },
      //推文列表
      tweetList: [],
      // 总条数
      total: 0,
      // 选中数组
      ids: [],
      elementIds: [],
      // 是否显示弹出层
      open: false,
      // 弹出层标题
      title: "",
      //推文预览
      tweetPreview: false,
      //子表查询
      loadingChannel: false,
      loadingShare: false,
      loadingSharePhone: false,
      clickTweetIds: [],
      clickChannelIds: [],
      clickShareIds: [],

      /** ===============推文下表单/签到列表页面===================*/
      // 查询参数
      targetTitle: "",
      openTarget: false,
      loadingTarget: true,
      showSearchTarget: true,
      totalTarget: 0,
      targetList: [],
      dateRangeTarget: [],
      queryParamsTarget: {
        searchType: "person",
        tweetId: null,
        channelId: null,
        tweetUserId: null,
        targetType: null,
        pageNum: 1,
        pageSize: 10,
        targetTitle: null,
        productName: null,
        organizationId: sessionStorage.getItem("organizationId"),
      },
      /** ===============推文下表单/签到列表页面===================*/
      /** ===============意向用户列表页面===================*/
      openCustomer: false,
      loadingCustomer: true,
      showSearchCustomer: true,
      totalCustomer: 0,
      customerList: [],
      dateRangeCustomer: [],
      queryParamsCustomer: {
        searchType: "personFrom",
        elementIds: [],
        tweetId: null,
        channelId: null,
        shareUserId: null,
        targetId: null,
        targetType: null,
        productTemplate: null,
        channelType: null,
        channelName: null,
        channelCode: null,
        elementPhone: null,
        orderNo: null,
        elementOrderNo: null,
        fromUserName: null,
        toUserName: null,
        orderStatus: null,
        orderTrackStatus: null,
        pageNum: 1,
        pageSize: 10,
        organizationId: sessionStorage.getItem("organizationId"),
      },
      /** ===============意向用户列表页面===================*/

      //推文预览
      formPreview: false,
      templateTypeList: [],
    };
  },
  created() {
    //查询下拉数据
    mbTypeListByManage().then((response) => {
      this.templateTypeList = [];
      this.templateTypeList = response.data;
    });
    this.getList();
  },
  activated() {
    this.getList();
  },
  mounted() {},
  methods: {
    getValue(list, labelName) {
      let count;
      list.forEach((item) => {
        if (item.templateType == labelName) {
          count = item.recordCount;
        }
      });
      return count;
    },
    expandChangeShare(row) {
      if (this.clickShareIds.includes(row.tweetId)) {
        this.clickShareIds.splice(
          this.clickShareIds.findIndex((item) => item === row.tweetId),
          1
        );
      } else {
        this.clickShareIds.push(row.tweetId);
      }
      //查询数据
      this.loadingSharePhone = true;
      sharePhoneReport({
        pageNum: 1,
        pageSize: 1000,
        tweetId: row.tweetId,
        channelId: row.channelId,
        shareUserId: row.shareUserId,
        searchType: "person",
        organizationId: sessionStorage.getItem("organizationId"),
      }).then((response) => {
        row.sharePhoneList = response.rows;
        this.loadingSharePhone = false;
      });
    },

    shareColor({ row }) {
      if (this.clickShareIds.includes(row.tweetId)) {
        return {
          backgroundColor: "rgb(226, 227, 231)",
        };
      }
    },
    // 搜索按钮操作
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    // 重置搜索按钮操作
    resetQuery() {
      this.dateRange = [];
      (this.queryParams = {
        delFlag: this.$route.query.delFlag,
        pageNum: 1,
        pageSize: 10,
        tweetStatus: "",
        tweetId: undefined,
        tweetOrganizationName: "",
        tweetTitle: "",
        tweetCommonFlag: "",
        createBy: "",
        channelType: "",
        channelName: "",
        channelCode: "",
        channelStatus: "",
        organizationId: sessionStorage.getItem("organizationId"),
      }),
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
      this.clickTweetIds = [];
      this.clickChannelIds = [];
      this.loading = true;
      this.queryParams.organizationId =
        sessionStorage.getItem("organizationId");
      sharePersonReport(
        this.addDateRange(this.queryParams, this.dateRange)
      ).then((response) => {
        this.tweetList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    /** 排序触发事件 */
    handleSortChange(column, prop, order) {
      this.queryParams.orderByColumn = column.prop;
      this.queryParams.isAsc = column.order;
      this.getList();
    },
    handleSortChangeSharePhone(column, prop, order, parentRow) {
      this.loadingSharePhone = true;
      sharePhoneReport({
        pageNum: 1,
        pageSize: 1000,
        tweetId: parentRow.tweetId,
        channelId: parentRow.channelId,
        shareUserId: parentRow.shareUserId,
        searchType: "manage",
        organizationId: sessionStorage.getItem("organizationId"),
        orderByColumn: column.prop,
        isAsc: column.order,
      }).then((response) => {
        parentRow.sharePhoneList = response.rows;
        this.loadingSharePhone = false;
      });
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.tweetId);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },

    handleSelectionChangeCustomer(selection) {
      this.elementIds = selection.map((item) => item.elementId);
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

    /** ===============推文下表单/签到列表===================*/
    /** 表单/签到数 操作 */
    handleTargetList(row, templateType, type) {
      let count = this.getValue(row.countList, templateType);
      if (count == 0 || count == null || count == undefined) {
        this.$modal.msgSuccess("推文下无" + templateType + "数据");
        return;
      }
      this.targetTitle = templateType + "列表";
      if (type == "sharePhone") {
        this.queryParamsTarget.sharePhone = row.sharePhone;
      } else {
        this.queryParamsTarget.sharePhone = null;
      }
      this.queryParamsTarget.templateType = templateType;
      this.queryParamsTarget.organizationId =
        sessionStorage.getItem("organizationId");
      this.queryParamsTarget.tweetId = row.tweetId;
      this.queryParamsTarget.channelId = row.channelId;
      this.queryParamsTarget.shareUserId = row.shareUserId;
      this.queryParamsTarget.orderByColumn = "";
      this.queryParamsTarget.isAsc = "";
      //展示推文下表单/签到列表
      this.openTarget = true;
      this.handleQueryTarget();
    },
    /** 推文下表单/签到列表 搜索按钮操作 */
    handleQueryTarget() {
      this.queryParamsTarget.pageNum = 1;
      this.getTargetList();
    },
    /** 推文下表单/签到列表 取消操作 */
    closeTarget() {
      this.dateRangeTarget = [];
      this.resetForm("queryTarget");
      this.targetList = [];
      this.totalTarget = 0;
      this.loadingTarget = false;
      this.openTarget = false;
      this.targetTitle = "";
      this.queryParamsTarget = {
        searchType: "person",
        tweetId: null,
        channelId: null,
        tweetUserId: null,
        targetType: null,
        pageNum: 1,
        pageSize: 10,
        targetTitle: null,
        productName: null,
        organizationId: sessionStorage.getItem("organizationId"),
      };
    },
    /** 查询推文下表单/签到列表 */
    getTargetList() {
      this.loadingTarget = true;
      targetReport(
        this.addDateRange(this.queryParamsTarget, this.dateRangeTarget)
      ).then((response) => {
        this.targetList = response.rows;
        this.totalTarget = response.total;
        this.loadingTarget = false;
      });
    },

    /** 推文下表单/签到列表 重置按钮操作 */
    resetQueryTarget() {
      this.queryParamsTarget.targetTitle = "";
      this.queryParamsTarget.orderByColumn = "";
      this.queryParamsTarget.isAsc = "";
      this.dateRangeTarget = [];
      this.resetForm("queryTarget");
      this.handleQueryTarget();
    },
    /** 推文下表单/签到列表 排序触发事件 */
    handleSortChangeTarget(column, prop, order) {
      this.queryParamsTarget.orderByColumn = column.prop;
      this.queryParamsTarget.isAsc = column.order;
      this.getTargetList();
    },
    /** ===============推文下表单/签到列表===================*/

    /** ===============意向用户列表===================*/
    /** 签到数 操作 */
    handleCustomerList(row) {
      if (row.recordCount == 0 || row.recordCount == null) {
        this.$modal.msgSuccess("无意向用户");
      } else {
        this.elementIds = [];
        this.queryParamsCustomer.orderByColumn = "";
        this.queryParamsCustomer.isAsc = "";
        //展示推文下意向用户列表
        this.openCustomer = true;
        this.queryParamsCustomer.tweetId = this.queryParamsTarget.tweetId;
        this.queryParamsCustomer.channelId = this.queryParamsTarget.channelId;
        this.queryParamsCustomer.shareUserId =
          this.queryParamsTarget.shareUserId;
        this.queryParamsCustomer.targetType = row.targetType;
        this.queryParamsCustomer.sharePhone = this.queryParamsTarget.sharePhone;
        this.queryParamsCustomer.targetId = row.targetId;
        this.handleQueryCustomer();
      }
    },

    handleCustomerExport(row) {
      if (row.recordCount == 0 || row.recordCount == null) {
        this.$modal.msgSuccess("无意向用户");
      } else {
        this.elementIds = [];
        this.queryParamsCustomer.orderByColumn = "";
        this.queryParamsCustomer.isAsc = "";
        //展示推文下意向用户列表
        this.queryParamsCustomer.tweetId = this.queryParamsTarget.tweetId;
        this.queryParamsCustomer.channelId = this.queryParamsTarget.channelId;
        this.queryParamsCustomer.shareUserId =
          this.queryParamsTarget.shareUserId;
        this.queryParamsCustomer.targetType = row.targetType;
        this.queryParamsCustomer.productTemplate = row.productTemplate;
        this.queryParamsCustomer.sharePhone = this.queryParamsTarget.sharePhone;
        this.queryParamsCustomer.targetId = row.targetId;
        this.download(
          "/system/customer/customerListExport",
          {
            ...this.queryParamsCustomer,
          },
          row.productName + `意向用户列表_${new Date().getTime()}.xlsx`
        );
      }
    },

    customerExport() {
      this.queryParamsCustomer.elementIds = this.elementIds;
      console.log("this.queryParamsCustomer", this.queryParamsCustomer);
      this.download(
        "/system/customer/customerListExport",
        {
          ...this.addDateRange(
            this.queryParamsCustomer,
            this.dateRangeCustomer
          ),
        },
        `意向用户列表_${new Date().getTime()}.xlsx`
      );
    },

    /** 意向用户列表 取消操作 */
    closeCustomer() {
      this.dateRangeCustomer = [];
      this.resetForm("queryCustomer");
      this.customerList = [];
      this.totalCustomer = 0;
      this.loadingCustomer = false;
      this.openCustomer = false;
      (this.queryParamsCustomer = {
        searchType: "personFrom",
        elementIds: [],
        tweetId: null,
        channelId: null,
        shareUserId: null,
        targetId: null,
        targetType: null,
        productTemplate: null,
        channelType: null,
        channelName: null,
        channelCode: null,
        elementPhone: null,
        orderNo: null,
        elementOrderNo: null,
        fromUserName: null,
        toUserName: null,
        orderStatus: null,
        orderTrackStatus: null,
        pageNum: 1,
        pageSize: 10,
        organizationId: sessionStorage.getItem("organizationId"),
      }),
        (this.elementIds = []);
    },
    /** 查询意向用户 */
    getCustomerList() {
      this.loadingCustomer = true;
      customerList(
        this.addDateRange(this.queryParamsCustomer, this.dateRangeCustomer)
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
        this.totalCustomer = response.total;
        this.loadingCustomer = false;
      });
    },
    /** 意向用户列表 搜索按钮操作 */
    handleQueryCustomer() {
      this.queryParamsCustomer.elementIds = [];
      this.queryParamsCustomer.pageNum = 1;
      this.getCustomerList();
    },
    /** 意向用户列表 重置按钮操作 */
    resetQueryCustomer() {
      this.queryParamsCustomer.orderByColumn = "";
      this.queryParamsCustomer.isAsc = "";
      this.dateRangeCustomer = [];
      this.resetForm("queryCustomer");
      this.handleQueryCustomer();
    },
    /** 意向用户列表 排序触发事件 */
    handleSortChangeCustomer(column, prop, order) {
      this.queryParamsCustomer.orderByColumn = column.prop;
      this.queryParamsCustomer.isAsc = column.order;
      this.getCustomerList();
    },
    /** ===============意向用户列表===================*/
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
  },
};
</script>

<style>
.tweet-preview-dialog .el-dialog__body {
  padding: 10px 20px;
}
</style>
