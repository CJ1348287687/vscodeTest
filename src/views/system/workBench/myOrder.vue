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
          placeholder="请输入受理备注"
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
      @expand-change="expandChange"
      :row-style="isRed"
    >
      <el-table-column type="selection" min-width="50px" align="center" />
      <el-table-column label="" type="expand" width="25">
        <template slot-scope="scope">
          <el-table
            :header-cell-style="{
              background: '#DDEBF7',
              color: '#333',
              padding: '3px',
            }"
            style="margin: 0 40px; box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1)"
            :cell-style="{ padding: '3px' }"
            :data="scope.row.elements"
            v-loading="loadingElement"
            @sort-change="
              (column, prop, order) =>
                handleSortChangeElement(column, prop, order, scope.row)
            "
          >
            <el-table-column label="序号" align="center" width="100">
              <template slot-scope="scop">
                {{ scop.$index + 1 }}
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
              <template #default="scop">
                {{ scop.row.elementOrderNo }}
              </template>
            </el-table-column>
            <el-table-column
              label="产品类型"
              width="120"
              prop="sice.targetType"
              align="center"
              sortable="custom"
              :sort-orders="['descending', 'ascending']"
            >
              <template #default="scop">
                {{
                  scop.row.targetType === "SCENE_FORM"
                    ? "表单"
                    : scop.row.targetType === "SCENE_SIGN"
                    ? "签到"
                    : scop.row.targetType === "PRODUCT_COUPON"
                    ? "优惠券"
                    : "其他"
                }}
              </template>
            </el-table-column>
            <el-table-column
              label="产品类型"
              width="120"
              prop="sice.targetType"
              align="center"
              sortable="custom"
              :sort-orders="['descending', 'ascending']"
            >
              <template #default="scop">
                {{
                  scop.row.targetType === "SCENE_FORM"
                    ? "表单"
                    : scop.row.targetType === "SCENE_SIGN"
                    ? "签到"
                    : scop.row.targetType === "PRODUCT_COUPON"
                    ? "优惠券"
                    : "其他"
                }}
              </template>
            </el-table-column>
            <el-table-column
              label="产品名称"
              width="120"
              prop="sice.productName"
              align="center"
              sortable="custom"
              :sort-orders="['descending', 'ascending']"
            >
              <template #default="scop">
                {{ scop.row.productName }}
              </template>
            </el-table-column>
            <el-table-column
              label="订单发展人"
              width="120"
              prop="fromcustomeruser.nickName"
              align="center"
              sortable="custom"
              :sort-orders="['descending', 'ascending']"
            >
              <template #default="scop">
                {{ scop.row.fromUserName }}
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
              <template #default="scop">
                {{ scop.row.toUserName }}
              </template>
            </el-table-column>
            <el-table-column
              label="订单甩单"
              min-width="80"
              prop="isForward"
              align="center"
            >
              <template #default="scop">
                {{ scop.row.isForward == 0 ? "否" : "是" }}
              </template>
            </el-table-column>
            <el-table-column
              label="订单状态"
              width="120"
              prop="sice.orderStatus"
              align="center"
              sortable="custom"
              :sort-orders="['descending', 'ascending']"
            >
              <template #default="scop">
                {{ scop.row.orderStatus }}
              </template>
            </el-table-column>
            <el-table-column
              label="订单映射状态"
              width="150"
              prop="sice.orderTrackStatus"
              align="center"
              sortable="custom"
              :sort-orders="['descending', 'ascending']"
            >
              <template #default="scop">
                {{ scop.row.orderTrackStatus }}
              </template>
            </el-table-column>
            <el-table-column label="下单详情" min-width="200" align="center">
              <template #default="scop">
                <el-button
                  size="mini"
                  type="text"
                  @click="handleFormPreview(scop.row)"
                  v-if="scop.row.isForward == 0"
                  >详情
                </el-button>
                <span v-if="scop.row.isForward != 0">{{
                  scop.row.forwardStatusName
                }}</span>
              </template>
            </el-table-column>
            <el-table-column label="受理备注" align="center">
              <template #default="scop">
                <el-tooltip
                  class="item"
                  effect="dark"
                  placement="top-start"
                  v-if="
                    scop.row.isForward == 0 &&
                    scop.row.remark != null &&
                    scop.row.remark.length > 20
                  "
                >
                  <div slot="content">{{ scop.row.remark }}</div>
                  <span>{{ scop.row.remark.substring(0, 20) }}..</span>
                </el-tooltip>
                <span
                  v-if="
                    scop.row.isForward == 0 &&
                    scop.row.remark != null &&
                    scop.row.remark.length <= 20
                  "
                  >{{ scop.row.remark }}</span
                >
              </template>
            </el-table-column>
            <el-table-column
              label="操作"
              align="left"
              class-name="small-padding fixed-width"
              width="220"
            >
              <template slot-scope="scop">
                <el-button
                  size="mini"
                  type="text"
                  icon="el-icon-setting"
                  @click="handleModuleLog(scop.row)"
                  v-hasPermi="['system:workBench:logList']"
                  >日志</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </template>
      </el-table-column>

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
        prop="sic.tweetId"
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
        prop="sic.tweetTitle"
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
      <el-table-column
        label="订单创建时间"
        width="155"
        prop="sic.browseTime"
        align="center"
        sortable="custom"
        :sort-orders="['descending', 'ascending']"
      >
        <template #default="scope">
          {{ scope.row.browseTime }}
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        width="140"
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
            icon="el-icon-document"
            @click="handleOrder(scope.row)"
            >操作
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

    <!-- 甩单 -->
    <el-dialog
      title="甩单"
      :visible.sync="openForward"
      width="500px"
      append-to-body
      :close-on-click-modal="false"
      :show-close="false"
      :close-on-press-escape="false"
    >
      <el-input
        placeholder="请输入组织名称"
        prefix-icon="el-icon-search"
        v-model="sdSearchValue"
        @input="sdSearchChange"
        style="width: 235px"
      >
      </el-input>
      <el-tabs
        tab-position="left"
        @tab-click="selectOrganization"
        v-model="toOrganizationId"
        style="height: 450px; margin-top: 20px;display: flex;"
      >
        <el-tab-pane
          v-for="(item, index) in organizationList"
          :key="item.organizationId"
          :label="item.organizationName"
          :name="item.organizationId"
        >
          <el-radio-group
            style="margin: 15px 0; text-align: left; min-width: 71%"
            v-model="toUserId"
          >
            <el-radio
              style="display: block; height: 25px"
              v-for="item2 in userList"
              :key="item2.userId"
              :label="item2.userId"
            >
              {{ item2.nickName }}
            </el-radio>
          </el-radio-group>
        </el-tab-pane>
      </el-tabs>
      <div slot="footer" class="dialog-footer">
        <el-button
          type="primary"
          v-loading="saveLoading"
          :disabled="saveLoading"
          @click="forwardUser"
          >甩 单</el-button
        >
        <el-button @click="closeForward">取 消</el-button>
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

    <!--操作-->
    <el-dialog
      title="用户详情"
      :visible.sync="openOrder"
      width="800px"
      append-to-body
      :close-on-click-modal="false"
      :show-close="true"
      @close="closeOrder"
    >
      <el-card style="background: antiquewhite" class="order">
        <span style="font-weight: 666">推文编号: </span>#{{
          customerDetail.tweetId
        }}
        <span style="font-weight: 666; margin: 0 5px 0 20px">推文名称: </span
        >{{ customerDetail.tweetTitle }}
      </el-card>
      <el-card
        v-for="(item, index) in customerDetail.elements"
        style="margin-top: 12px; background: aliceblue"
        :key="index"
        class="order"
      >
        <el-form label-width="110px">
          <el-form-item label="订单号:">
            {{ item.elementOrderNo }}
          </el-form-item>
          <el-form-item label="订单创建时间:">
            {{ item.createTime }}
            <el-button
              v-if="item.isForward == 0"
              style="margin: 0 20px"
              type="info"
              @click="handleFormPreview(item)"
              >产品详情</el-button
            ></el-form-item
          >
          <el-form-item label="甩单状态:" v-if="item.isForward != 0">
            {{ item.forwardStatusName }}
          </el-form-item>
          <el-form-item label="订单发展人:">
            {{ customerDetail.fromUserName }}
          </el-form-item>
          <el-form-item label="订单受理人:">
            {{ item.toUserName }}
          </el-form-item>
          <el-form-item label="产品名称:">
            {{ item.productName }}
          </el-form-item>
          <el-form-item label="产品模板:">
            {{ item.productTemplateName }}
          </el-form-item>
          <el-form-item label="产品类型:">
            {{
              item.targetType === "SCENE_FORM"
                ? "表单"
                : item.targetType === "SCENE_SIGN"
                ? "签到"
                : item.targetType === "PRODUCT_COUPON"
                ? "优惠券"
                : "其他"
            }}</el-form-item
          >

          <el-form-item label="手机号码:" v-if="item.isForward == 0">
            {{
              item.elementPhone == null || item.elementPhone == ""
                ? customerDetail.phone
                : item.elementPhone
            }}
          </el-form-item>
          <el-form-item
            label="地址:"
            v-if="
              item.isForward == 0 &&
              customerDetail.elementAddress != null &&
              customerDetail.elementAddress != ''
            "
          >
            {{ customerDetail.elementAddress }}
          </el-form-item>
          <el-form-item
            label="受理备注:"
            style="margin-top: 10px"
            v-if="item.isForward == 0"
          >
            <el-input
              :disabled="!item.editStatus"
              style="width: 60%"
              v-model="item.remark"
              type="textarea"
              placeholder="请输入受理备注信息"
              maxlength="200"
              :autosize="{ minRows: 6 }"
              show-word-limit
            />
          </el-form-item>
          <el-form-item
            label="订单状态:"
            v-if="item.isForward == 0 && item.sysProductMb == null"
            style="margin-top: 10px"
          >
            <el-radio-group v-model="item.orderStatus">
              <el-radio
                :disabled="!item.editStatus"
                v-for="dict in dict.type.sys_customer_default_type"
                :key="dict.value"
                :label="dict.value"
                >{{ dict.label }}</el-radio
              >
            </el-radio-group>
          </el-form-item>
          <el-form-item
            label="订单状态:"
            v-if="item.isForward == 0 && item.sysProductMb != null"
            style="margin-top: 10px"
          >
            <el-radio-group v-model="item.orderStatus">
              <el-radio
                :disabled="!item.editStatus"
                v-for="dict in item.sysProductMb.orderStatuss"
                :key="dict"
                :label="dict"
                >{{ dict }}</el-radio
              >
            </el-radio-group>
          </el-form-item>
          <el-form-item
            label="物流单号:"
            v-if="
              item.isForward == 0 &&
              item.sysProductMb != null &&
              item.sysProductMb.productRemark != null &&
              item.sysProductMb.productRemark.includes('物流单号')
            "
            style="margin-top: 10px"
          >
            <el-input
              v-model="item.kdNumber"
              :disabled="!item.editStatus"
              placeholder="请输入物流单号"
              style="width: 300px"
            />
          </el-form-item>
          <el-form-item
            style="margin-top: 20px; margin-left: 20px"
            v-if="item.isForward == 0 && item.editStatus == false"
          >
            <el-button
              style="margin-right: 40px"
              type="success"
              v-loading="saveLoading"
              :disabled="saveLoading"
              @click="toPhone(item)"
              >外 呼</el-button
            >
            <el-button
              style="margin-right: 40px"
              type="primary"
              v-loading="saveLoading"
              :disabled="saveLoading"
              v-hasPermi="['system:workBench:forwardUser']"
              @click="handleForward(item)"
              >甩 单</el-button
            >
            <el-button
              type="warning"
              :disabled="saveLoading"
              @click="updateStatus(item)"
              >受 理</el-button
            >
          </el-form-item>
          <el-form-item
            style="margin-top: 20px; margin-left: 80px"
            v-if="item.isForward == 0 && item.editStatus == true"
          >
            <el-button
              style="margin-right: 40px"
              type="warning"
              v-loading="saveLoading"
              :disabled="saveLoading"
              @click="submit(item)"
              >保 存</el-button
            >
            <el-button
              type="info"
              v-loading="saveLoading"
              :disabled="saveLoading"
              @click="cancelSubmit(item)"
              >取 消</el-button
            >
          </el-form-item>
        </el-form>
      </el-card>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeOrder">取 消</el-button>
      </div>
    </el-dialog>

    <el-dialog
      title="外呼"
      :visible.sync="openPhone"
      width="500px"
      append-to-body
      :close-on-click-modal="false"
      :show-close="false"
      :close-on-press-escape="false"
    >
      <div style="display: flex">
        <div style="width: 410px; padding: 0px 20px">
          <qr-code
            style="padding-bottom: 10px"
            :id="phoneUrl + ''"
            :text="phoneUrl"
            ref="qrCode"
          ></qr-code>
          <div style="padding-top: 20px; color: red; padding-left: 40px">
            注：请用手机摄像头扫描二维码 进行外呼操作
          </div>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closePhone">取 消</el-button>
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
  forwardUser,
  updateStatus,
  customerLogList,
  customerList,
  customerElementList,
} from "../../../api/system/customer/index";
import tweetPreview from "@/components/tweet/tweetPreview.vue";
import formPreview from "@/components/tweet/formPreview.vue";
import qrCode from "@/components/tweet/qrCode";
import DialogProductList from "@/views/components/DialogProductList";
import {
  organizationUser,
  manageUserOrganization,
} from "../../../api/system/production/tweet";
export default {
  name: "customerList",
  dicts: ["tweet_channel", "sys_customer_type", "sys_customer_default_type"],
  components: { qrCode, tweetPreview, formPreview, DialogProductList },
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
        customerId: undefined,
        customerIds: [],
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
        elementPhone: "",
        toUserName: "",
        orderStatus: "",
        orderTrackStatus: "",
        remark: "",
        searchType: "personAll",
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
      organizationListDefault: [],
      userList: [],
      elementId: null,
      toOrganizationId: null,
      toUserId: null,
      saveLoading: false,
      sdSearchValue: '',
      //日志
      moduleLogList: [],
      openModuleLog: false,
      //受理备注
      saveLoading: false,

      clickCustomerIds: [],
      loadingElement: false,
      parentRow: null,

      //用户操作
      openOrder: false,
      customerDetail: {},
      //外呼
      openPhone: false,
      phoneUrl: null,
      elementDetail: {},
    };
  },
  created() {
    this.getList();
    this.getManageUserOrganization();
  },
  activated() {
    this.getList();
  },
  mounted() {},
  methods: {
    //获取纳管组织
    getManageUserOrganization() {
      manageUserOrganization().then((response) => {
        this.organizationListDefault = response.data;
      });
    },
    handleSortChangeElement(column, prop, order, parentRow) {
      this.loadingElement = true;
      this.queryParamsElement.orderByColumn = column.prop;
      this.queryParamsElement.isAsc = column.order;
      customerElementList(this.queryParamsElement).then((response) => {
        parentRow.elements = this.handelCustomerList(response);
        this.loadingElement = false;
      });
    },
    //子记录点击变色
    expandChange(row) {
      if (this.clickCustomerIds.includes(row.customerId)) {
        this.clickCustomerIds.splice(
          this.clickCustomerIds.findIndex((item) => item === row.customerId),
          1
        );
      } else {
        this.clickCustomerIds.push(row.customerId);
      }
      //查询数据
      this.loadingElement = true;
      this.queryParamsElement = {
        customerId: row.customerId,
        elementOrderNo: this.queryParams.elementOrderNo,
        targetType: this.queryParams.targetType,
        productName: this.queryParams.productName,
        fromUserName: this.queryParams.fromUserName,
        elementPhone: this.queryParams.elementPhone,
        toUserName: this.queryParams.toUserName,
        orderStatus: this.queryParams.orderStatus,
        orderTrackStatus: this.queryParams.orderTrackStatus,
        remark: this.queryParams.remark,
        searchType: this.queryParams.searchType,
        organizationId: this.queryParams.organizationId,
      };
      this.queryParamsElement.orderByColumn = undefined;
      this.queryParamsElement.isAsc = undefined;
      customerElementList(this.queryParamsElement).then((response) => {
        row.elements = this.handelCustomerList(response);
        this.loadingElement = false;
      });
    },
    isRed({ row }) {
      if (this.clickCustomerIds.includes(row.customerId)) {
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
        customerIds: [],
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
        elementPhone: "",
        toUserName: "",
        orderStatus: "",
        orderTrackStatus: "",
        remark: "",
        searchType: "personAll",
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
      (this.ids = []), (this.clickCustomerIds = []);
      this.loading = true;
      this.queryParams.organizationId =
        sessionStorage.getItem("organizationId");
      customerList(this.addDateRange(this.queryParams, this.dateRange)).then(
        (response) => {
          this.customerList = response.rows;
          this.total = response.total;
          this.loading = false;
        }
      );
    },
    customerExport() {
      this.queryParams.organizationId =
        sessionStorage.getItem("organizationId");
      this.queryParams.customerIds = this.ids;
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
      this.queryParamsProduct.customerIds = this.ids;
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
      this.ids = selection.map((item) => item.customerId);
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
    //甩单
    handleForward(item) {
      this.elementDetail = item;
      this.organizationList = this.organizationListDefault;
      if (this.organizationList.length == 0) {
        this.$modal.msgError("组织列表为空");
        return;
      }
      this.toOrganizationId = item.toOrganizationId;
      this.toUserId = item.toUserId;
      let params = {
        organizationId: this.toOrganizationId,
      };
      organizationUser(params).then((response) => {
        if (response.data) {
          this.userList = response.data;
        }
      });
      this.elementId = item.elementId;
      this.openForward = true;
    },
    selectOrganization(row) {
      //切换组织
      this.toOrganizationId = row.$vnode.key;
      let params = {
        organizationId: this.toOrganizationId,
      };
      organizationUser(params).then((response) => {
        if (response.data) {
          this.userList = response.data;
        }
      });
    },
    closeForward() {
      this.saveLoading = false;
      this.toOrganizationId = null;
      this.toUserId = null;
      this.elementId = null;
      this.openForward = false;
      this.elementDetail = {};
      this.sdSearchValue = '';
    },
    forwardUser() {
      this.saveLoading = true;
      if (this.elementId == null || this.elementId == "") {
        this.$modal.msgError("意向用户参数丢失,请重新打开页面");
        this.saveLoading = false;
        return;
      }
      if (this.toOrganizationId == "" || this.toOrganizationId == null) {
        this.$modal.msgError("甩单组织不能为空");
        this.saveLoading = false;
        return;
      }
      if (this.toUserId == "" || this.toUserId == null) {
        this.$modal.msgError("甩单人员不能为空");
        this.saveLoading = false;
        return;
      }
      let params = {
        organizationId: sessionStorage.getItem("organizationId"),
        elementId: this.elementId,
        toOrganizationId: this.toOrganizationId,
        toUserId: this.toUserId,
      };
      forwardUser(params).then((response) => {
        this.$modal.msgSuccess("甩单成功");
        this.closeForward();
      });
    },
    updateStatus(item) {
      item.editStatus = true;
    },
    cancelSubmit(item) {
      item.remark = item.remarkOld;
      item.orderStatus = item.orderStatusOld;
      item.kdNumber = item.kdNumberOld;
      item.editStatus = false;
    },
    submit(item) {
      this.$modal
        .confirm("确定修改状态，添加受理备注")
        .then((response) => {
          this.saveLoading = true;
          let params = {
            organizationId: sessionStorage.getItem("organizationId"),
            elementId: item.elementId,
            productTemplate: item.productTemplate,
            orderStatus: item.orderStatus,
            remark: item.remark,
            kdNumber: item.kdNumber,
          };
          updateStatus(params).then((response) => {
            item.remarkOld = item.remark;
            item.orderStatusOld = item.orderStatus;
            item.kdNumberOld = item.kdNumber;
            item.editStatus = false;
            this.saveLoading = false;
            this.$modal.msgSuccess("操作成功");
          });
        })
        .catch((response) => {});
    },
    getCustomerElementList() {
      this.loadingElement = true;
      customerElementList(this.queryParamsElement).then((response) => {
        this.parentRow.elements = this.handelCustomerList(response);
        this.loadingElement = false;
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
    //用户操作弹框
    handleOrder(row) {
      this.saveLoading = false;
      if (
        row.elements == undefined ||
        row.elements == null ||
        row.elements.length == 0
      ) {
        //查询下子记录
        //查询数据
        this.queryParamsElement = {
          customerId: row.customerId,
          elementOrderNo: this.queryParams.elementOrderNo,
          targetType: this.queryParams.targetType,
          productName: this.queryParams.productName,
          fromUserName: this.queryParams.fromUserName,
          elementPhone: this.queryParams.elementPhone,
          toUserName: this.queryParams.toUserName,
          orderStatus: this.queryParams.orderStatus,
          orderTrackStatus: this.queryParams.orderTrackStatus,
          remark: this.queryParams.remark,
          searchType: this.queryParams.searchType,
          organizationId: this.queryParams.organizationId,
        };
        this.queryParamsElement.orderByColumn = undefined;
        this.queryParamsElement.isAsc = undefined;
        customerElementList(this.queryParamsElement).then((response) => {
          row.elements = this.handelCustomerList(response);
          this.customerDetail = row;
          this.openOrder = true;
        });
      } else {
        this.customerDetail = row;
        this.openOrder = true;
      }
      this.parentRow = row;
    },
    handelCustomerList(response) {
      let elements = [];
      let userId = sessionStorage.getItem("userId");
      let organizationId = sessionStorage.getItem("organizationId");
      response.rows.forEach((item, index) => {
        if (
          item.sysProductMb != null &&
          item.sysProductMb.orderStatus != null
        ) {
          if (item.sysProductMb.orderStatus != null) {
            item.sysProductMb.orderStatuss =
              item.sysProductMb.orderStatus.split(",");
          }
          if (item.sysProductMb.productRemark != null) {
            item.sysProductMb.productRemark =
              item.sysProductMb.productRemark.split(",");
          }
        }
        item.remarkOld = item.remark;
        item.orderStatusOld = item.orderStatus;
        item.kdNumberOld = item.kdNumber;
        item.editStatus = false;
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
        elements.push(item);
      });
      return elements;
    },
    //关闭日志弹窗
    closeOrder() {
      //刷新订单列表
      this.getList();
      this.customerDetail = {};
      this.openOrder = false;
    },
    //外呼
    toPhone(item) {
      let phone =
        item.elementPhone == null || item.elementPhone == ""
          ? this.customerDetail.phone
          : item.elementPhone;
      this.getConfigKey("customer_call_phone").then((response) => {
        let url =
          response.msg +
          "?elementId=" +
          encodeURIComponent(window.btoa(item.elementId)) +
          "&phone=" +
          encodeURIComponent(window.btoa(phone));
        this.phoneUrl = url;
        if (!this.$refs.qrCode) {
          setTimeout(() => {
            this.$refs.qrCode.updateCode(url);
          }, 500);
        } else {
          this.$refs.qrCode.updateCode(url);
        }
        this.openPhone = true;
      });
    },
    closePhone() {
      this.phoneUrl = undefined;
      this.openPhone = false;
    },
    sdSearchChange(value){
      this.organizationList = this.organizationListDefault.filter(item=>item.organizationName.includes(value));
    },
  },
};
</script>

<style scoped>
.order {
  margin-left: 20px;
  .el-form-item {
    margin-bottom: 0px;
  }
  .el-form-item__label {
    font-weight: 666;
  }
}
</style>

<style>
.tweet-preview-dialog .el-dialog__body {
  padding: 10px 20px;
}
</style>

<style>
  .el-tabs__content{
    overflow-y: scroll;
    height: 100%;
    min-width: 205px;
  }
  .el-tabs__nav-next{
    display: none;
  }
  .el-tabs__nav-prev{
    display: none;
  }
  .el-tabs__nav-scroll{
    overflow-y: scroll;
  }
  /* 修改垂直滚动条 */
  .el-tabs__nav-scroll::-webkit-scrollbar {
    width: 10px; /* 修改宽度 */
  }
   
  /* 修改滚动条轨道背景色 */
  .el-tabs__nav-scroll::-webkit-scrollbar-track {
    background-color: #f1f1f1;
  }
   
  /* 修改滚动条滑块颜色 */
  .el-tabs__nav-scroll::-webkit-scrollbar-thumb {
    background-color: #d0d6e3;
  }
  /* 修改滚动条滑块悬停时的颜色 */
  .el-tabs__nav-scroll::-webkit-scrollbar-thumb:hover {
    background-color: #555;
  }
  
  /* 修改垂直滚动条 */
  .el-tabs__content::-webkit-scrollbar {
    width: 10px!important; /* 修改宽度 */
  }
   
  /* 修改滚动条轨道背景色 */
  .el-tabs__content::-webkit-scrollbar-track {
    background-color: #f1f1f1!important; 
  }
   
  /* 修改滚动条滑块颜色 */
  .el-tabs__content::-webkit-scrollbar-thumb {
    background-color: #d0d6e3!important; 
  }
  /* 修改滚动条滑块悬停时的颜色 */
  .el-tabs__content::-webkit-scrollbar-thumb:hover {
    background-color: #555!important; 
  }
  .el-tabs__header{
    min-width: 245px!important; 
  }
  .el-tabs__nav-wrap{
    padding: 0px!important; 
  }
  </style>
