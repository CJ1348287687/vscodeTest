<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="100px">
      <el-form-item label="店铺名称" prop="shopName">
        <el-input
          v-model="queryParams.shopName"
          placeholder="请输入店铺名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="订单编号" prop="orderId">
        <el-input
          v-model="queryParams.orderId"
          placeholder="请输入订单编号"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="子订单编号" prop="detailsOrderId">
        <el-input
          v-model="queryParams.detailsOrderId"
          placeholder="请输入子订单编号"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="订单状态" prop="orderStatus2">
        <el-select
          v-model="queryParams.orderStatus2"
          placeholder="请选择订单状态"
          clearable
        >
          <el-option
            v-for="dict in orderStatus2s"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="预约时间">
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
      <el-form-item label="商品标题" prop="productName">
        <el-input
          v-model="queryParams.productName"
          placeholder="请输入商品标题"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="联系电话" prop="telNumber">
        <el-input
          v-model="queryParams.telNumber"
          placeholder="请输入联系电话"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="预约状态" prop="isUserId">
        <el-radio-group v-model="queryParams.isUserId">
          <el-radio label='0' style="margin-right: 10px;">未抢单</el-radio>
          <el-radio label='1' style="margin-right: 10px;">已抢单</el-radio>
          <el-radio label='' style="margin-right: 10px;">全部</el-radio>
        </el-radio-group>
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
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['system:order:export']"
          >导出</el-button
        >
      </el-form-item>
    </el-form>

    <el-table
      v-loading="loading"
      :data="orderList"
      @selection-change="handleSelectionChange"
      @sort-change="handleSortChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <!-- sortable="custom" :sort-orders="['descending', 'ascending']" -->
      <el-table-column label="店铺名称" align="center" prop="orderDetail.shopName" width="120"/>
      <el-table-column label="订单编号" align="center" prop="orderDetail.orderId" width="180"/>
      <el-table-column label="子订单编号" align="center" prop="orderDetail.detailsOrderId" width="180"/>
      <el-table-column label="联系电话" align="center" prop="telNumber" width="120"/>
      <el-table-column label="预约时间" align="center" prop="startTime" width="180">
        <template slot-scope="scope">
          <span>{{parseTime(scope.row.startTime, "{y}-{m}-{d}  {h}:{i}")}}-
            {{parseTime(scope.row.endTime, "{h}:{i}")}}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="预约门店" align="center" width="150">
        <template slot-scope="scop">
          <span v-if="scop.row.organizationId != null">
            {{ scop.row.organizationName }}
          </span>
          <span v-if="scop.row.userId != null">
            - {{ scop.row.userName }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="子订单状态" align="center" prop="orderDetail.detailsOrderStatusDesc" width="130"/>
      <el-table-column label="子订单类型" align="center" prop="orderDetail.orderType" width="130">
        <template slot-scope="scope">
          {{
            scope.row.orderDetail.detailsOrderType == '0' ? '普通订单' : 
            scope.row.orderDetail.detailsOrderType == '2' ? '虚拟商品订单' : 
            scope.row.orderDetail.detailsOrderType == '4' ? '平台发码订单' : 
            scope.row.orderDetail.detailsOrderType == '5' ? '商家发码订单' : ''}}
        </template>
      </el-table-column>
      <el-table-column label="下单时间" align="center" prop="orderDetail.createTime" width="180">
        <template slot-scope="scope">
          <span>{{
            parseTime(scope.row.orderDetail.createTime, "{y}-{m}-{d} {h}:{i}:{s}")
          }}</span>
        </template>
      </el-table-column>
      <el-table-column label="商品标题" align="center" prop="orderDetail.productName" width="300"/>
      <el-table-column label="商品图片" align="center" width="80">
        <template slot-scope="scope">
          <image-preview v-if="scope.row.orderDetail.productImg != null" :src="scope.row.orderDetail.productImg" :width="50" :height="50"/>
        </template>
      </el-table-column>
      <el-table-column label="商品规格" align="center" prop="orderDetail.specs" width="200" />
      <el-table-column label="商品数量" align="center" prop="orderDetail.itemNum" width="80" >
        <template slot-scope="scope">
          {{scope.row.orderDetail.itemNum}}
        </template>
      </el-table-column>
      <el-table-column label="买家实付(元)" align="center" prop="orderDetail.payAmount" width="100" >
        <template slot-scope="scope">
          {{scope.row.orderDetail.payAmount}}
        </template>
      </el-table-column>
      
      <el-table-column label="收件人姓名" align="center" prop="orderDetail.mmPostReceiver" width="120" />
      <el-table-column label="收件人手机" align="center" prop="orderDetail.mmMaskPostTel" width="120" />
      <el-table-column label="省市区" align="center" width="180">
        <template slot-scope="scope">
          <span>{{scope.row.orderDetail.province}}{{scope.row.orderDetail.city}}{{scope.row.orderDetail.town}}{{scope.row.orderDetail.street}}</span>
        </template>
      </el-table-column>
      <el-table-column label="详细地址" align="center" prop="orderDetail.mmAddrDetail" width="180" />
      <el-table-column label="身份证姓名" align="center" prop="orderDetail.mmEncryptIdCardName" width="120" />
      <el-table-column label="身份证号码" align="center" prop="orderDetail.mmEncryptIdCardNo" width="180"/>
      <el-table-column
        fixed="right"
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
        width="130">
        <template slot-scope="scope">
          <el-button
            v-if="searchType == 'org' && scope.row.userId == null"
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleCatch(scope.row)"
            >抢单</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleForward(scope.row)"
            >甩单</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-document"
            @click="handleDetail(scope.row)"
            >操作</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-setting"
            @click="handleModuleLog(scope.row)"
          >日志</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

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
      <div style="display: flex;align-items: flex-start; margin-top: 30px">
        <span>备注：</span>
        <el-input
          type="textarea"
          :rows="4"
          placeholder="请输入备注"
          v-model="forwardRemark"
          style="flex:1">
        </el-input>
      </div>
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
      title="预约详情"
      :visible.sync="openDetail"
      width="68%"
      append-to-body
      :close-on-click-modal="false"
      :show-close="true"
      @close="cancelDetail"
    >
      <el-card style="background: antiquewhite" class="order">
        <el-form label-width="130px">
          <el-row>
            <el-col :span="10">
              <el-form-item label="预约时间:">
                {{ detail.startTime }} - {{ detail.endTime }}
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="联系方式:">
                {{ detail.telNumber }}
                <el-button
                  v-if="
                    detail.telNumber != null &&
                    detail.telNumber != '' &&
                    detail.telNumber != undefined
                  "
                  type="success"
                  @click="toPhone(detail.id,detail.telNumber)"
                  >外 呼</el-button>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-if="detail.userAddress != null && detail.userAddress != '' && detail.userAddress != undefined ">
            <el-col :span="10">
              <el-form-item label="用户地址:">
                {{ detail.userAddress }}
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="10">
              <el-form-item label="归属门店:">
                {{ detail.organizationName }}
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="门店地址:">
                {{ detail.organizationAddress }}
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="10">
              <el-form-item label="营业时间:">
                {{ detail.businessHours }}
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="门店电话:">
                {{ detail.organizationMobile }}
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-if="detail.userId != null && detail.userId != '' ">
            <el-col :span="10">
              <el-form-item label="归属员工:">
                {{ detail.userName }}
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-if="detail.forwardRemark != null && detail.forwardRemark != '' ">
            <el-col :span="10">
              <el-form-item label="甩单备注:">
                {{ detail.forwardRemark }}
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-card>

      <el-card style="padding-left: 0px; margin-top: 12px; background: antiquewhite" class="order" v-if="detail.orderDetail!=null">
        <el-form label-width="130px">
          <el-row>
            <el-col :span="10">
              <el-form-item label="订单编号:">
                {{ detail.orderDetail.orderId }}
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="收件人:">
                {{ (detail.orderDetail.mmPostReceiver=="" || detail.orderDetail.mmPostReceiver==null) ? (detail.orderDetail.maskPostReceiver=='***' ? "" : detail.orderDetail.maskPostReceiver) : detail.orderDetail.mmPostReceiver }}
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="10">
              <el-form-item label="订单状态:">
                {{ detail.orderDetail.orderStatusDesc }}
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="收件人手机号:">
                {{ (detail.orderDetail.mmMaskPostTel=="" || detail.orderDetail.mmMaskPostTel==null) ? detail.orderDetail.maskPostTel : detail.orderDetail.mmMaskPostTel }}
                <el-button
                  v-if="
                    detail.orderDetail.mmMaskPostTel != null &&
                    detail.orderDetail.mmMaskPostTel != '' &&
                    detail.orderDetail.mmMaskPostTel != undefined &&
                    !detail.orderDetail.mmMaskPostTel.includes('看') &&
                    !detail.orderDetail.mmMaskPostTel.includes('解密')
                  "
                  type="success"
                  @click="toPhone(detail.orderDetail.orderId, detail.orderDetail.mmMaskPostTel)"
                  >外 呼</el-button
                >
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="10">
              <el-form-item label="订单类型:">
                {{ detail.orderDetail.orderType ==0 ? '普通订单' :
                  detail.orderDetail.orderType ==2 ? '虚拟商品订单':
                  detail.orderDetail.orderType ==4 ? '平台发码订单':
                  detail.orderDetail.orderType ==5 ? '商家发码订单' : ''
                }}
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="收件地址:">
                {{
                  detail.orderDetail.province +
                  detail.orderDetail.city +
                  detail.orderDetail.town +
                  detail.orderDetail.street
                }}
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="10">
              <el-form-item label="下单时间:">
                {{ detail.orderDetail.createTime }}
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="详细地址:">
                {{ detail.orderDetail.mmAddrDetail }}
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="10">
              <el-form-item label="商品数量:">
                {{ detail.orderDetail.productNum }}
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="身份证姓名:">
                {{ detail.orderDetail.mmEncryptIdCardName }} 
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="10">
              <el-form-item label="买家实付:">
                {{ detail.orderDetail.orderAmount }} (元)
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="身份证号:">
                {{ detail.orderDetail.mmEncryptIdCardNo }}
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-if="detail.orderDetail.buyerWords != null && detail.orderDetail.buyerWords != '' ">
            <el-col :span="10" >
              <el-form-item label="买家留言:">
                {{ detail.orderDetail.buyerWords }}
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="10">
              <el-form-item label="取消原因:"
                v-if="detail.orderDetail.cancelReason != null && detail.orderDetail.cancelReason != '' ">
                {{ detail.orderDetail.cancelReason }}
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-card>
      <el-card style="padding-left: 0px; margin-top: 12px; background: aliceblue" class="order" v-if="detail.orderDetail!=null">
        <el-form label-width="110px">
          <el-form-item label="子订单编号:">
            {{ detail.orderDetail.detailsOrderId }}
          </el-form-item>
          <el-form-item label="子订单类型:">
            {{ detail.orderDetail.detailsOrderType ==0 ? '普通订单' :
              detail.orderDetail.detailsOrderType ==2 ? '虚拟商品订单':
              detail.orderDetail.detailsOrderType ==4 ? '平台发码订单':
              detail.orderDetail.detailsOrderType ==5 ? '商家发码订单' : ''
            }}
          </el-form-item>
          <el-form-item label="子订单状态:">
            {{ detail.orderDetail.detailsOrderStatusDesc }}
          </el-form-item>
          <el-form-item label="">
          </el-form-item>
          <el-form-item label="订单发展人:">
            {{ detail.orderDetail.fromOrganizationName }} - {{ detail.orderDetail.fromUserName }}
            <span v-if="detail.orderDetail.fromJobNumber != null && detail.orderDetail.fromJobNumber != ''">({{ detail.orderDetail.fromJobNumber }})</span>
          </el-form-item>
          <el-form-item label="订单受理人:">
            {{ detail.orderDetail.toOrganizationName }} - {{ detail.orderDetail.toUserName }}
            <span v-if="detail.orderDetail.toJobNumber != null && detail.orderDetail.toJobNumber != ''"> ({{ detail.orderDetail.toJobNumber }}) </span>
          </el-form-item>

          <el-form-item label="商品名称:">
            {{ detail.orderDetail.productName }}
          </el-form-item>
          <el-form-item label="商品图片:">
            <image-preview
              v-if="detail.orderDetail.productImg != null"
              :src="detail.orderDetail.productImg"
              :width="50"
              :height="50"
            />
          </el-form-item>
          <el-form-item label="商品分类:">
            {{ detail.orderDetail.categoryDetail }}
          </el-form-item>
          <el-form-item label="商品规格:">
            {{ detail.orderDetail.specs }}
          </el-form-item>
          <el-form-item label="商品标签:">
            {{ detail.orderDetail.skuOrderTagUi }}
          </el-form-item>
          <el-form-item label="商品原价:">
            {{ detail.orderDetail.goodsPrice }}(元)
          </el-form-item>
          <el-form-item label="商品数量:">
            {{ detail.orderDetail.itemNum }}
          </el-form-item>
          <el-form-item label="商品现价:">
            {{ detail.orderDetail.originAmount }}(元)
          </el-form-item>
          <el-form-item label="买家实付:">
            {{ detail.orderDetail.payAmount }}(元)
          </el-form-item>
          <el-form-item label="">
          </el-form-item>
          <el-form-item label="达人UID:">
            {{ detail.orderDetail.authorId }}
          </el-form-item>
          <el-form-item label="达人名称:">
            {{ detail.orderDetail.authorName }}
          </el-form-item>
          <el-form-item label="下单来源:">
            {{ detail.orderDetail.themeTypeDesc }}
          </el-form-item>
          <el-form-item label="直播间ID:">
            {{ detail.orderDetail.roomId }}
          </el-form-item>
        </el-form>
        <div style="margin-top: 16px;text-align: center;">
          <span>
            <el-button
              style="margin-right: 40px"
              type="primary"
              v-loading="saveLoading"
              :disabled="saveLoading"
              @click="handleForward(detail)"
              >甩 单</el-button
            >
            <el-button
              v-if="searchType == 'org' && detail.userId == null"
              style="margin-right: 40px"
              type="warning"
              v-loading="saveLoading"
              :disabled="saveLoading"
              @click="handleCatch(detail)"
              >抢 单</el-button
            >
          </span>
        </div>
      </el-card>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelDetail">取 消</el-button>
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
    
  </div>
</template>

<script>
import qrCode from "@/components/tweet/qrCode";
import { appointList, catchToUserId, forwardUser, logList, getDetail } from '@/api/system/douyinUser/appoint';
import {
  organizationUser,
  manageUserOrganization,
} from "../../../api/system/production/tweet";

export default {
  name: "appoint",
  components: { qrCode },
  data() {
    return {
      orderStatus2s: [
        {
          value: null,
          label: "全部",
        },
        {
          value: 1,
          label: "待支付",
        },
        {
          value: 2,
          label: "待发货",
        },
        {
          value: 3,
          label: "已发货",
        },
        {
          value: 4,
          label: "售后中",
        },
        {
          value: 5,
          label: "已完成",
        },
        {
          value: 6,
          label: "已关闭",
        },
      ],
      searchType: this.$route.query.searchType,
      // 日期范围
      dateRange: [],
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 抖音订单表格数据
      orderList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      //表单
      form:{},
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        organizationId: sessionStorage.getItem("organizationId"),
        searchType: this.$route.query.searchType,
        isSelectElem: true,
        shopId: null,
        shopName: null,
        orderId: null,
        detailsOrderId:null,
        orderStatus: null,
        orderStatus2:null,
        orderStatusDesc: null,
        cancelReason: null,
        buyerWords: null,
        mmPostReceiver: null,
        mmMaskPostTel: null,
        auditingStatus: null,
        detailsOrderStatusDesc: null,
        authorId: null,
        authorName: null,
        productId:null,
        productName:null,
        name:null,
        telNumber: null,
        isUserId: '',
      },
      //甩单
      saveLoading: false,
      openForward: false,
      detail: null,
      organizationList: [],
      organizationListDefault: [],
      userList: [],
      toOrganizationId: null,
      toUserId: null,
      sdSearchValue: '',
      forwardRemark:'',
      //日志
      moduleLogList: [],
      openModuleLog: false,
      //外呼
      openPhone: false,
      phoneUrl: null,
      //详情
      openDetail: false,
      detail: {},
    };
  },
  created() {
    this.getList();
    this.getManageUserOrganization();
  },
  methods: {
    //获取纳管组织
    getManageUserOrganization() {
      manageUserOrganization().then((response) => {
        this.organizationListDefault = response.data;
      });
    },
    /** 排序触发事件 */
    handleSortChange(column, prop, order) {
      this.queryParams.pageNum = 1;
      this.queryParams.orderByColumn = column.prop;
      this.queryParams.isAsc = column.order;
      this.getList();
    },
    
    /** 查询抖音订单列表 */
    getList() {
      this.loading = true;
      appointList(this.addDateRange(this.queryParams, this.dateRange)).then(
        (response) => {
          this.orderList = response.rows;
          this.total = response.total;
          this.loading = false;
        }
      );
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.dateRange = [];
      this.queryParams.orderByColumn = undefined;
      this.queryParams.isAsc = undefined;
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.id);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },

    /** 导出按钮操作 */
    handleExport() {
      let queryParamsExport = JSON.parse(JSON.stringify(this.queryParams));
      console.log(this.ids)
      queryParamsExport.ids  = this.ids
      this.download(
        "system/douyin/user/appoint/export",
        {
          ...this.addDateRange(queryParamsExport, this.dateRange),
        },
        `预约单_${new Date().getTime()}.xlsx`
      );
    },

    //甩单
    handleForward(item) {
      console.log("item======",item)
      this.detail = item;
      this.organizationList = this.organizationListDefault;
      if (this.organizationList.length == 0) {
        this.$modal.msgError("组织列表为空");
        return;
      }
      this.toOrganizationId = item.organizationId!=null ? item.organizationId : this.organizationList[0].organizationId;
      let params = {
        organizationId: this.toOrganizationId,
      };
      organizationUser(params).then((response) => {
        if (response.data) {
          this.userList = response.data;
        }
      });
      this.forwardRemark = this.forwardRemark || item?.forwardRemark;
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
    sdSearchChange(value){
      this.organizationList = this.organizationListDefault.filter(item=>item.organizationName.includes(value));
    },
    closeForward() {
      this.saveLoading = false;
      this.toOrganizationId = null;
      this.toUserId = null;
      this.openForward = false;
      this.sdSearchValue = '';
      this.forwardRemark = '';
    },
    forwardUser() {
      this.saveLoading = true;
      if (this.detail == null || this.detail == '' || this.detail.id == null || this.detail.id =='') {
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
        id: this.detail.id,
        organizationId: this.toOrganizationId,
        userId: this.toUserId,
        forwardRemark: this.forwardRemark,
      };
      forwardUser(params).then((response) => {
        this.closeForward();
        this.$modal.msgSuccess("甩单成功");
        if(!this.openDetail){
          getDetail(this.detail.id).then(response => {
            this.detail = response.data;
          });
        }else if(this.openDetail){
          this.getList();
        }
      });
    },
    //抢单
    handleCatch(item) {
      let _this = this
      _this.$modal.confirm("确定抢单用户"+ item.telNumber).then(function() {
        _this.loading = true;
        catchToUserId({id:item.id}).then((response) => {
          _this.loading = false;
          _this.$modal.msgSuccess("抢单成功");

          if(!_this.openDetail){
            getDetail(_this.detail.id).then(response => {
              _this.detail = response.data;
            });
          }else if(_this.openDetail){
            _this.getList();
          }
        }).catch((response) => {
          _this.loading = false;
        })
      });
    },
    //日志
    handleModuleLog(row) {
      this.openModuleLog = true;
      logList({ targetId: row.id }).then((response) => {
        this.moduleLogList = response.rows;
      });
    },
    //关闭日志弹窗
    closeModuleLog() {
      this.openModuleLog = false;
      this.moduleLogList = [];
    },
    handleDetail(row){
      this.detail = {}
      const id = row.id || this.ids
      getDetail(id).then(response => {
        this.detail = response.data;
        this.openDetail = true;
      });
    },
    /** 详情页面 取消操作 */
    cancelDetail(){
      this.openDetail = false;
      this.detail = {}
    },

    //外呼
    toPhone(id,phone) {
      this.getConfigKey("customer_call_phone").then((response) => {
        let url =
          response.msg +
          "?elementId=" +
          encodeURIComponent(window.btoa(id)) +
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
    

  },
};
</script>

<style scoped>
  .order {
    margin-left: 20px;
    .el-form-item {
      margin-bottom: 0px;
      display: inline-block;
      width: 45%;
      vertical-align: top;
    }
    .el-form-item__label {
      font-weight: 666;
    }
    .el-form-item--medium .el-form-item__content{
      width:210%;
    }
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




