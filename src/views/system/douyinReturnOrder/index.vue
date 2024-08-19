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
      <el-form-item label="原订单编号" prop="shopOrderId">
        <el-input
          v-model="queryParams.shopOrderId"
          placeholder="请输入原订单编号"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="售后单号" prop="aftersaleId">
        <el-input
          v-model="queryParams.aftersaleId"
          placeholder="请输入售后单号"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="售后类型" prop="aftersaleType">
        <el-select
          v-model="queryParams.aftersaleType"
          placeholder="请选择售后类型"
          clearable
        >
          <el-option
            v-for="dict in aftersaleTypes"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="售后状态" prop="aftersaleStatus">
        <el-select
          v-model="queryParams.aftersaleStatus"
          placeholder="请选择售后状态"
          clearable
        >
          <el-option
            v-for="dict in aftersaleStatuss"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="退款类型" prop="aftersaleRefundType">
        <el-select
          v-model="queryParams.aftersaleRefundType"
          placeholder="请选择退款类型"
          clearable
        >
          <el-option
            v-for="dict in aftersaleRefundTypes"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="退款状态" prop="refundStatus">
        <el-select
          v-model="queryParams.refundStatus"
          placeholder="请选择退款状态"
          clearable
        >
          <el-option
            v-for="dict in refundStatuss"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="售后理由" prop="reasonText">
        <el-input
          v-model="queryParams.reasonText"
          placeholder="请输入售后理由"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="售后商家备注" prop="remark">
        <el-input
          v-model="queryParams.remark"
          placeholder="请输入售后商家备注"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="商品id" prop="productId">
        <el-input
          v-model="queryParams.productId"
          placeholder="请输入商品id"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="商品标题" prop="productName">
        <el-input
          v-model="queryParams.productName"
          placeholder="请输入商品标题"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="订单状态" prop="orderStatus">
        <el-select
          v-model="queryParams.orderStatus"
          placeholder="请选择订单状态"
          clearable
        >
          <el-option
            v-for="dict in orderStatuss"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <!-- <el-form-item label="备注" prop="detailsRemark">
        <el-input
          v-model="queryParams.detailsRemark"
          placeholder="请输入备注"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item> -->
      <el-form-item label="申请时间">
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
          v-hasPermi="['system:returnOrder:export']"
          >导出</el-button
        >
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['system:returnOrder:synchronous']"
          >同步抖店售后单</el-button
        >
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleSyncOrderAccept(0)"
          >增量同步订单</el-button
        >
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleSyncOrderAccept(1)"
          >全量同步订单</el-button
        >
      </el-col>
      <right-toolbar
        :showSearch.sync="showSearch"
        @queryTable="getList"
      ></right-toolbar>
    </el-row>

    <el-table
      v-loading="loading"
      :data="orderList"
      @selection-change="handleSelectionChange"
      @sort-change="handleSortChange"
    >
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
            :data="scope.row.douyinReturnOrderDetails"
          >
            <el-table-column label="商品id" align="center" width="220">
              <template slot-scope="scop">
                {{ scop.row.productId }}
              </template>
            </el-table-column>
            <el-table-column label="商品图片" align="center" width="80">
              <template slot-scope="scope">
                <image-preview
                  v-if="scope.row.productImage != null"
                  :src="scope.row.productImage"
                  :width="50"
                  :height="50"
                />
              </template>
            </el-table-column>
            <el-table-column label="商品标题" align="center" width="260">
              <template slot-scope="scop">
                {{ scop.row.productName }}
              </template>
            </el-table-column>
            <el-table-column label="商品规格" align="center" prop="specs" width="150" />
            <el-table-column label="商品标签" align="center" prop="skuOrderTagUi" width="150" />
            <el-table-column label="订单类型" align="center" prop="orderTypeDesc" width="150" />
            <el-table-column label="订单状态" align="center" width="120">
              <template slot-scope="scop">
                {{
                  scop.row.orderStatus == 2
                    ? "未发货"
                    : scop.row.orderStatus == 3
                    ? "已发货"
                    : scop.row.orderStatus == 5
                    ? "已收货或已完成"
                    : "已完成"
                }}
              </template>
            </el-table-column>
            <el-table-column label="购买数量" align="center" width="100">
              <template slot-scope="scop">
                {{ scop.row.itemNum }}
              </template>
            </el-table-column>
            <el-table-column label="付款金额 (元)" align="center" width="120">
              <template slot-scope="scop">
                {{ scop.row.payAmount }}
              </template>
            </el-table-column>
            <!-- <el-table-column label="下单时间" align="center" width="200">
              <template slot-scope="scop">
                {{ scop.row.createTime }}
              </template>
            </el-table-column> -->
            <el-table-column label="订单发展人" align="center" width="150">
              <template slot-scope="scop">
                <span v-if="scop.row.fromOrganizationId != null">
                  {{ scop.row.fromOrganizationName }} - {{ scop.row.fromUserName }}
                </span>
              </template>
            </el-table-column>
            <el-table-column label="订单受理人" align="center" width="150">
              <template slot-scope="scop">
                <span v-if="scop.row.toOrganizationId != null">
                  {{ scop.row.toOrganizationName }} - {{ scop.row.toUserName }}
                </span>
              </template>
            </el-table-column>
          </el-table>
        </template>
      </el-table-column>
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="店铺名称" align="center" prop="shopName" width="120" sortable="custom" :sort-orders="['descending', 'ascending']"/>
      <el-table-column label="原订单编号" align="center" prop="shopOrderId" width="180" sortable="custom" :sort-orders="['descending', 'ascending']"/>
      <el-table-column label="售后单号" align="center" prop="aftersaleId" width="180" sortable="custom" :sort-orders="['descending', 'ascending']"/>

      <el-table-column label="售后类型" align="center" prop="aftersaleType" width="120" sortable="custom" :sort-orders="['descending', 'ascending']">
        <template slot-scope="{ row }">
          <span v-if="row.aftersaleType == 0">退货退款</span>
          <span v-if="row.aftersaleType == 1">已发货仅退款</span>
          <span v-if="row.aftersaleType == 2">未发货仅退款</span>
          <span v-if="row.aftersaleType == 3">换货</span>
          <span v-if="row.aftersaleType == 6">价保</span>
          <span v-if="row.aftersaleType == 7">补寄</span>
        </template>
      </el-table-column>
      <el-table-column label="售后状态" align="center" prop="aftersaleStatus" width="120" sortable="custom" :sort-orders="['descending', 'ascending']">
        <template slot-scope="{ row }">
          <span v-if="row.aftersaleStatus == 3">换货待买家收货</span>
          <span v-if="row.aftersaleStatus == 6">待商家同意</span>
          <span v-if="row.aftersaleStatus == 7">待买家退货</span>
          <span v-if="row.aftersaleStatus == 8">待商家发货</span>
          <span v-if="row.aftersaleStatus == 11">待商家二次同意</span>
          <span v-if="row.aftersaleStatus == 12">售后成功</span>
          <span v-if="row.aftersaleStatus == 14">换货成功</span>
          <span v-if="row.aftersaleStatus == 27">商家一次拒绝</span>
          <span v-if="row.aftersaleStatus == 28">售后失败</span>
          <span v-if="row.aftersaleStatus == 29">商家二次拒绝</span>
        </template>
      </el-table-column>
      <el-table-column label="申请时间" align="center" prop="applyTime" width="180" sortable="custom" :sort-orders="['descending', 'ascending']"/>
      <el-table-column label="售后数量" align="center" prop="aftersaleNum" width="80"/>
      <el-table-column label="退款金额 (元)" align="center" prop="refundAmount" width="100"/>
      <!-- <el-table-column label="下单时间" align="center" prop="oldCreateTime" width="180">
        <template slot-scope="scope">
          <span>{{
            parseTime(scope.row.oldCreateTime, "{y}-{m}-{d} {h}:{i}:{s}")
          }}</span>
        </template>
      </el-table-column> -->
      <el-table-column label="收件人姓名" align="center" prop="mmPostReceiver" width="120" />
      <el-table-column label="收件人手机" align="center" prop="mmMaskPostTel" width="120" />
      <el-table-column label="省市区" align="center" prop="createTime" width="180">
        <template slot-scope="scope">
          <span>{{scope.row.province}}{{scope.row.city}}{{scope.row.town}}{{scope.row.street}}</span>
        </template>
      </el-table-column>
      <el-table-column label="详细地址" align="center" prop="mmAddrDetail" width="180" />
      <el-table-column label="身份证姓名" align="center" prop="mmEncryptIdCardName" width="120" />
      <el-table-column label="身份证号码" align="center" prop="mmEncryptIdCardNo" width="180"/>

      <el-table-column label="退款类型" align="center" prop="aftersaleRefundType" width="180" sortable="custom" :sort-orders="['descending', 'ascending']">
        <template slot-scope="{ row }">
          <span v-if="row.aftersaleRefundType == -1">历史数据默认值</span>
          <span v-if="row.aftersaleRefundType == 0">订单货款/原路退款</span>
          <span v-if="row.aftersaleRefundType == 1">货到付款线下退款</span>
          <span v-if="row.aftersaleRefundType == 2">备用金</span>
          <span v-if="row.aftersaleRefundType == 3">保证金</span>
          <span v-if="row.aftersaleRefundType == 4">无需退款</span>
          <span v-if="row.aftersaleRefundType == 5">平台垫付</span>
        </template>
      </el-table-column>
      <el-table-column label="退款状态" align="center" prop="refundStatus"  width="100" sortable="custom" :sort-orders="['descending', 'ascending']">
        <template slot-scope="{ row }">
          <span v-if="row.refundStatus == 1">待退款</span>
          <span v-if="row.refundStatus == 2">退款中</span>
          <span v-if="row.refundStatus == 3">退款成功</span>
          <span v-if="row.refundStatus == 4">退款失败</span>
          <span v-if="row.refundStatus == 5">追缴成功</span>
        </template>
      </el-table-column>
      <el-table-column label="买家是否收到货物" align="center" prop="gotPkg"  width="140" >
        <template slot-scope="{ row }">
          <span v-if="row.gotPkg == 0">未收到</span>
          <span v-if="row.gotPkg == 1">收到</span>
        </template>
      </el-table-column>
      <el-table-column label="售后理由" align="center" prop="reasonText" width="240"/>
      <el-table-column label="买家留言" align="center" prop="buyerWords" width="200"/>
      <el-table-column label="商家备注" align="center" prop="sellerWords" width="200">
        <template slot-scope="scope">
          <el-tooltip
            class="item"
            effect="dark"
            placement="top-start"
            v-if="
              scope.row.sellerWords != null &&
              scope.row.sellerWords.length > 50
            "
            >
            <div slot="content">{{ scope.row.sellerWords }}</div>
            <span>{{ scope.row.sellerWords.substring(0, 50) }}..</span>
          </el-tooltip>
          <span
            v-if="
              scope.row.sellerWords != null &&
              scope.row.sellerWords.length <= 50
            "
            >{{ scope.row.sellerWords }}</span
          >
        </template>
      </el-table-column>

      <el-table-column label="售后商家备注" align="center" prop="remark" width="180" />
      <el-table-column label="售后原因" align="center" prop="reasonSecondLabelsName" width="180" />
      <el-table-column label="首次发货:物流单号" align="center" prop="trackingNo" width="180" />
      <el-table-column label="首次发货:物流公司" align="center" prop="companyName" width="180" />
      <el-table-column label="退货物流单号" align="center" prop="returnLogisticsCode" width="180" />
      <el-table-column label="退货物流公司" align="center" prop="returnLogisticsCompanyName" width="180" />

      <el-table-column fixed="right" label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <!-- <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-if="
              scope.row.aftersaleStatus == 6 || scope.row.aftersaleStatus == 11
            "
            v-hasPermi="['system:returnOrder:afterOrder']"
            >售后操作</el-button
          > -->
<!--          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="databz(scope.row)"
            v-hasPermi="['system:returnOrder:databz']"
            >商家备注</el-button
          >-->
          <el-button
            size="mini"
            type="text"
            icon="el-icon-document"
            @click="handleOrder(scope.row)"
            >操作</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-setting"
            @click="handleModuleLog(scope.row)"
          >操作记录</el-button>
          <!--          <el-button-->
          <!--            size="mini"-->
          <!--            type="text"-->
          <!--            icon="el-icon-delete"-->
          <!--            @click="handleDelete(scope.row)"-->
          <!--            v-hasPermi="['system:returnOrder:remove']"-->
          <!--          >删除</el-button>-->
        </template>
      </el-table-column>
    </el-table>

    <!-- 同步 -->
    <el-dialog
      :title="title"
      :visible.sync="openTb"
      width="500px"
      append-to-body
    >
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="店铺" prop="productId">
          <el-select v-model="shopId" placeholder="请选择店铺">
            <el-option
              v-for="dict in shopList"
              :key="dict.id"
              :label="dict.shopName"
              :value="dict.shopId"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitFormTb">确 定</el-button>
        <el-button @click="openTb = false">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 添加或修改抖音订单对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="结果" prop="productId">
          <el-select v-model="afterType" @change="xzshouhou()" placeholder="请选择售后结果">
            <el-option
              v-if="
                afterSaleType == 0 &&
                (afterSaleStatus == 6 || afterSaleStatus == 27)
              "
              value="101"
              label="同意退货申请（一次审核）"
            ></el-option>
            <el-option
              v-if="afterSaleType == 0 && afterSaleStatus == 6"
              value="102"
              label="拒绝退货申请（一次审核）"
            ></el-option>
            <el-option
              v-if="
                afterSaleType == 0 &&
                (afterSaleStatus == 7 ||
                  afterSaleStatus == 11 ||
                  afterSaleStatus == 29)
              "
              value="111"
              label="同意退货（二次审核）"
            ></el-option>
            <el-option
              v-if="afterSaleType == 0 && afterSaleStatus == 11"
              value="112"
              label="拒绝退货 (二次审核)"
            ></el-option>
            <el-option
              v-if="
                afterSaleType == 0 &&
                (afterSaleStatus == 6 || afterSaleStatus == 27)
              "
              value="121"
              label="退货转退款"
            ></el-option>
            <el-option
              v-if="
                afterSaleType == 1 &&
                (afterSaleStatus == 6 || afterSaleStatus == 27)
              "
              value="201"
              label="同意仅退款"
            ></el-option>
            <el-option
              v-if="afterSaleType == 1 && afterSaleStatus == 6"
              value="202"
              label="拒绝仅退款"
            ></el-option>
            <el-option
              v-if="afterSaleType == 1 && afterSaleStatus == 6"
              value="203"
              label="同意拒签后退款"
            ></el-option>
            <el-option
              v-if="
                afterSaleType == 3 &&
                (afterSaleStatus == 6 || afterSaleStatus == 27)
              "
              value="301"
              label="同意换货申请（一次审核)"
            ></el-option>
            <el-option
              v-if="afterSaleType == 3 && afterSaleStatus == 6"
              value="302"
              label="拒绝换货申请（一次审核）"
            ></el-option>
            <el-option
              v-if="
                afterSaleType == 3 &&
                (afterSaleStatus == 7 ||
                  afterSaleStatus == 11 ||
                  afterSaleStatus == 29)
              "
              value="311"
              label="同意换货（二次审核）"
            ></el-option>
            <el-option
              v-if="afterSaleType == 3 && afterSaleStatus == 11"
              value="312"
              label="拒绝换货（二次审核）"
            ></el-option>
            <el-option
              v-if="
                afterSaleType == 3 &&
                (afterSaleStatus == 6 ||
                  afterSaleStatus == 7 ||
                  afterSaleStatus == 11 ||
                  afterSaleStatus == 29)
              "
              value="321"
              label="换货转退款"
            ></el-option>
            <el-option
              v-if="afterSaleType == 2 && afterSaleStatus == 6"
              value="401"
              label="同意售前退申请(拒绝售前退款请使用发货接口)"
            ></el-option>
            <el-option
              v-if="
                afterSaleType == 7 &&
                (afterSaleStatus == 6 || afterSaleStatus == 27)
              "
              value="501"
              label="同意补寄"
            ></el-option>
            <el-option
              v-if="afterSaleType == 7 && afterSaleStatus == 6"
              value="502"
              label="拒绝补寄"
            ></el-option>
            <el-option
              v-if="
                afterSaleType == 8 &&
                (afterSaleStatus == 6 || afterSaleStatus == 27)
              "
              value="601"
              label="同意维修申请，需买家退货（一次审核）"
            ></el-option>
            <el-option
              v-if="
                afterSaleType == 8 &&
                (afterSaleStatus == 6 || afterSaleStatus == 27)
              "
              value="602"
              label="同意维修申请，无需买家退货（一次审核）"
            ></el-option>
            <el-option
              v-if="afterSaleType == 8 && afterSaleStatus == 6"
              value="603"
              label="拒绝维修申请（一次审核）"
            ></el-option>
            <el-option
              v-if="
                afterSaleType == 8 &&
                (afterSaleStatus == 7 ||
                  afterSaleStatus == 11 ||
                  afterSaleStatus == 8)
              "
              value="611"
              label="同意维修申请，立即发货（二次审核）"
            ></el-option>
            <el-option
              v-if="afterSaleType == 8 && afterSaleStatus == 11"
              value="612"
              label="拒绝维修申请（二次审核）"
            ></el-option>
            <el-option
              v-if="
                afterSaleType == 8 &&
                (afterSaleStatus == 6 ||
                  afterSaleStatus == 7 ||
                  afterSaleStatus == 8 ||
                  afterSaleStatus == 11 ||
                  afterSaleStatus == 27 ||
                  afterSaleStatus == 29)
              "
              value="621"
              label="维修转退款"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="退货地址" v-if="returnAddressOpen">
          <el-select
            v-model="returnAddressId"
            placeholder="请选择退货地址"
          >
            <el-option
              v-for="dict in returnAddressList"
              :key="dict.addressId"
              :label="dict.recieverName + ' ' + dict.receiverProvinc +  dict.receiverCity + dict.receiverDistrict +  dict.receiverStreet +  dict.receiverDetail"
              :value="dict.addressId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="拒绝原因" v-if="returnReasonOpen">
          <el-select
            v-model="returnReasonId"
            placeholder="请选择拒绝原因"
            @change="jujueyy()"
          >
            <el-option
              v-for="dict in returnReasonList"
              :key="dict.rejectReasonCode+'_'+dict.evidenceNeed"
              :label="dict.reason"
              :value="dict.rejectReasonCode+'_'+dict.evidenceNeed"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="凭证图片" prop="productImage" v-if="returnReasonOpenY">
          <el-row>
            <el-col v-if="image.wcQrc.url != ''">
              <img
                :src="image.wcQrc.url"
                style="width: 148px;height: 148px ;border:1px solid"
                @click="imagePreview(image.wcQrc.url,1)"
              />
              <img src="../../../assets/images/delete.png"
                   style="width: 20px;height: 20px;position: relative;top: -120px;left: -25px;"
                   @click="imageRemove(image.wcQrc.name,1)"
              >
            </el-col>
            <el-col v-if="image.wcQrc.url == ''">
              <div tabindex="0" class="el-upload el-upload--picture-card" style="width: 148px;height: 148px"
                   @click="uploadTypeOpen(image.wcQrc.name,1)"
              >
                <i class="el-icon-plus"></i>
              </div>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="拒绝描述" style="margin-top: 10px; width: 100%" v-if="returnReasonOpenY">
          <el-input
            style="width: 80%"
            v-model="returnReasonRemark"
            type="textarea"
            placeholder="请输入拒绝描述"
            maxlength="50"
            :autosize="{ minRows: 3 }"
            show-word-limit
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitFormSh">确 定</el-button>
        <el-button @click="open = false;returnReasonId = '';image.wcQrc.url = '';returnReasonRemark='';afterType = '';returnReasonOpenY = false;returnReasonOpen=false;">取 消</el-button>
      </div>
    </el-dialog>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!--操作-->
    <el-dialog
      title="订单详情"
      :visible.sync="openOrder"
      width="68%"
      append-to-body
      :close-on-click-modal="false"
      :show-close="true"
      @close="closeOrder"
    >
      <el-card style="background: antiquewhite" class="order">
        <el-form label-width="130px">
          <el-form-item label="原订单编号:">
            {{ customerDetail.shopOrderId }}
          </el-form-item>
          <el-form-item label="创建时间:">
            {{ customerDetail.createTime }}
          </el-form-item>
          <el-form-item label="售后单号:">
            {{ customerDetail.aftersaleId }}
          </el-form-item>
          <el-form-item label="售后状态:">
            {{ getEnumLabel(customerDetail.aftersaleStatus, aftersaleStatuss) }}
          </el-form-item>
          <el-form-item label="售后类型:">
            {{ getEnumLabel(customerDetail.aftersaleType, aftersaleTypes) }}
          </el-form-item>
          <el-form-item label="售后退款金额:">
            {{ customerDetail.refundAmount }} (元)
          </el-form-item>
          <el-form-item label="退货物流单号:">
            {{ customerDetail.returnLogisticsCode }}
          </el-form-item>
          <el-form-item label="退款状态:">
            {{ getEnumLabel(customerDetail.refundStatus, refundStatuss) }}
          </el-form-item>
          <el-form-item label="售后退款类型:">
            {{
              getEnumLabel(customerDetail.aftersaleRefundType, refundType)
            }}
          </el-form-item>
          <el-form-item label="售后退运费金额:">
            {{ customerDetail.refundPostAmount }} (元)
          </el-form-item>
          <el-form-item label="退货物流公司名称:">
            {{ customerDetail.returnLogisticsCompanyName }}
          </el-form-item>
          <el-form-item label="买家是否收到货物:">
            {{ getEnumLabel(customerDetail.gotPkg, isCargo) }}
          </el-form-item>
        </el-form>
      </el-card>
      <el-card style="padding-left: 0px; margin-top: 12px; background: antiquewhite" class="order" v-if="customerDetail.oldId!=null">
        <el-form label-width="130px">
          <el-row>
            <el-col :span="10">
              <el-form-item label="收件人:">
                <span v-if="customerDetail.editUserInfo == false"> 
                  {{ (customerDetail.mmPostReceiver=="" || customerDetail.mmPostReceiver==null) ? (customerDetail.maskPostReceiver=='***' ? "" : customerDetail.maskPostReceiver) : customerDetail.mmPostReceiver }}
                </span>
                <span v-if="customerDetail.editUserInfo == true"> 
                  <el-input
                    v-model="customerDetail.mmPostReceiver"
                    placeholder="请输入收件人"
                    clearable
                    style="padding-bottom: 5px;"
                  />  
                </span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="身份证姓名:" >
                <span v-if="customerDetail.editUserInfo == false"> {{ customerDetail.mmEncryptIdCardName }} </span>
                <span v-if="customerDetail.editUserInfo == true"> 
                  <el-input
                    v-model="customerDetail.mmEncryptIdCardName"
                    placeholder="请输入身份证姓名"
                    clearable
                    style="padding-bottom: 5px;"
                  />  
                </span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="10">
              <el-form-item label="收件人手机号:" >
                <span v-if="customerDetail.editUserInfo == false"> 
                  {{ (customerDetail.mmMaskPostTel=="" || customerDetail.mmMaskPostTel==null) ? customerDetail.maskPostTel : customerDetail.mmMaskPostTel }}
                  <el-button
                    v-if="customerDetail.mmMaskPostTel == null || 
                      customerDetail.mmMaskPostTel == '' || 
                      customerDetail.mmMaskPostTel == undefined ||
                      customerDetail.mmMaskPostTel.includes('看') ||
                      customerDetail.mmMaskPostTel.includes('解密')
                    "
                    type="info"
                    @click="datajm(customerDetail)"
                    v-hasPermi="['system:order:datajm']"
                    >解 密</el-button
                  >
                  <el-button
                    v-if="
                      customerDetail.mmMaskPostTel != null &&
                      customerDetail.mmMaskPostTel != '' &&
                      customerDetail.mmMaskPostTel != undefined &&
                      !customerDetail.mmMaskPostTel.includes('看') &&
                      !customerDetail.mmMaskPostTel.includes('解密')
                    "
                    type="success"
                    @click="toPhone(customerDetail)"
                    >外 呼</el-button
                  >
                </span>
                <span v-if="customerDetail.editUserInfo == true"> 
                  <el-input
                    v-model="customerDetail.mmMaskPostTel"
                    placeholder="请输入收件人手机号"
                    clearable
                    style="padding-bottom: 5px;"
                  />  
                </span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="身份证号:" >
                <span v-if="customerDetail.editUserInfo == false"> {{ customerDetail.mmEncryptIdCardNo }} </span>
                <span v-if="customerDetail.editUserInfo == true"> 
                  <el-input
                    v-model="customerDetail.mmEncryptIdCardNo"
                    placeholder="请输入身份证号"
                    clearable
                    style="padding-bottom: 5px;"
                  />  
                </span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="20">
              <el-form-item label="收件地址:">
                <span v-if="customerDetail.editUserInfo == false"> 
                  {{
                    customerDetail.province +
                    customerDetail.city +
                    customerDetail.town +
                    customerDetail.street
                  }}
                </span>
                <span v-if="customerDetail.editUserInfo == true" style="display: flex;flex-wrap: wrap;justify-content: start;"> 
                  <el-select v-model="customerDetail.province" @change="getCityList" filterable clearable placeholder="请选择省份" style="width:150px; padding-bottom: 5px;">
                    <el-option
                      v-for="dict in provinceList"
                      :key="dict.name"
                      :label="dict.name"
                      :value="dict.name"
                    ></el-option>
                  </el-select>
                  <el-select v-model="customerDetail.city"  @change="getAreaList" filterable clearable placeholder="请选择城市" style="width:150px;; padding-bottom: 5px; margin-left: 40px;">
                    <el-option
                      v-for="dict in cityList"
                      :key="dict.name"
                      :label="dict.name"
                      :value="dict.name"
                    ></el-option>
                  </el-select>
                  <el-select v-model="customerDetail.town" @change="getStreetList" filterable clearable placeholder="请选择区" style="width:150px; padding-bottom: 5px;">
                    <el-option
                      v-for="dict in areaList"
                      :key="dict.name"
                      :label="dict.name"
                      :value="dict.name"
                    ></el-option>
                  </el-select>
                  <el-select v-model="customerDetail.street" filterable clearable placeholder="请选择街道" style="width:150px; padding-bottom: 5px; margin-left: 40px;">
                    <el-option
                      v-for="dict in streetList"
                      :key="dict.name"
                      :label="dict.name"
                      :value="dict.name"
                    ></el-option>
                  </el-select>
                </span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="20">
              <el-form-item label="详细地址:">
                <span v-if="customerDetail.editUserInfo == false"> {{ customerDetail.mmAddrDetail }} </span>
                <span v-if="customerDetail.editUserInfo == true"> 
                  <el-input
                    v-model="customerDetail.mmAddrDetail"
                    placeholder="请输入详细地址"
                    clearable
                    style="padding-bottom: 5px;"
                  />  
                </span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-if="customerDetail.buyerWords != null && customerDetail.buyerWords != '' ">
            <el-col :span="20">
              <el-form-item label="买家留言:">
                {{ customerDetail.buyerWords }}
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-if="customerDetail.sellerWords != null && customerDetail.sellerWords != '' ">
            <el-col :span="20">
              <el-form-item label="商家备注:">
                {{ customerDetail.sellerWords }}
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-if="customerDetail.cancelReason != null && customerDetail.cancelReason != '' ">
            <el-col :span="20">
              <el-form-item label="取消原因:">
                {{ customerDetail.cancelReason }}
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>

        <div style="text-align: center;margin-left: -15px;">
          <span v-if="customerDetail.editUserInfo == false">
            <el-button
              style="margin-right: 40px"
              type="primary"
              :disabled="saveLoading"
              @click="updateUserInfo(customerDetail)"
              >补录信息</el-button
            >
          </span>
          <span v-if="customerDetail.editUserInfo == true">
            <el-button
              v-if="customerDetail.editUserInfo == true"
              style="margin-right: 40px"
              type="warning"
              v-loading="saveLoading"
              :disabled="saveLoading"
              @click="submitUserInfo(customerDetail)"
              >保 存</el-button
            >
            <el-button
              v-if="customerDetail.editUserInfo == true"
              type="info"
              v-loading="saveLoading"
              :disabled="saveLoading"
              @click="cancelUserInfo(customerDetail)"
              >取 消</el-button
            >
          </span>
        </div>
      </el-card>
      <el-card
        v-for="(item, index) in customerDetail.douyinReturnOrderDetails"
        style="padding-left: 0px; margin-top: 12px; background: aliceblue"
        :key="index"
        class="order"
      >
        <el-form label-width="130px">
          <el-form-item label="商品名称:">
            {{ item.productName }}
          </el-form-item>
          <el-form-item label="商品图片:">
            <image-preview
              v-if="item.productImage != null"
              :src="item.productImage"
              :width="50"
              :height="50"
            />
          </el-form-item>
          <el-form-item label="原订单编号:">
            {{ item.shopOrderId }}
          </el-form-item>
          <el-form-item label="下单时间:">
            {{ item.createTime }}
          </el-form-item>
          <el-form-item label="子订单状态:">
            {{ getEnumLabel(item.orderStatus, orderStatuss) }}
          </el-form-item>
          <el-form-item label="购买数量:">
            {{ item.itemNum }}
          </el-form-item>
          <el-form-item label="订单发展人:">
            {{ item.fromOrganizationName }} - {{ item.fromUserName }}
            <span v-if="item.fromJobNumber != null && item.fromJobNumber != ''">({{ item.fromJobNumber }})</span>
          </el-form-item>
          <el-form-item label="订单受理人:">
            {{ item.toOrganizationName }} - {{ item.toUserName }}
            <span v-if="item.toJobNumber != null && item.toJobNumber != ''"> ({{ item.toJobNumber }}) </span>
          </el-form-item>
          <el-form-item label="订单模板:">
            {{ item.productTemplateName }}
          </el-form-item>
          <el-form-item label="付款金额:">
            {{ item.payAmount }} (元)
          </el-form-item>
          <el-form-item label="付运费金额:">
            {{ item.postAmount }} (元)
          </el-form-item>
          <el-form-item label="甩单状态:" v-if="!showButton">
            {{ item.forwardStatusName }}
          </el-form-item>
        </el-form>
      </el-card>
      <el-card
        style="padding-left: 0px; margin-top: 12px; background: aliceblue"
        class="order"
      >
        <el-form label-width="110px" >
          <el-form-item label="订单标记:" style="margin-top: 10px; width: 100%;">
            <el-radio-group
              style="margin: 15px 0; display: flex; transform: translateY(-7px);"
              v-model="customerDetail.sellerRemarkStars"
              :disabled="!customerDetail.editRemark"
            >
              <el-radio
                style="display: flex; align-items: center;"
                v-for="obj in markerList"
                :key="obj.id"
                :label="obj.id"
              >
                <img :src="obj.url" style="display: inline-block; width: 20px; height: 20px;"/>
              </el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="售后商家备注:" style="margin-top: 10px; width: 100%">
            <el-input
              :disabled="!customerDetail.editRemark"
              style="width: 80%"
              v-model="customerDetail.remark"
              type="textarea"
              placeholder="请输入售后商家备注信息"
              maxlength="500"
              :autosize="{ minRows: 6 }"
              show-word-limit
            />
          </el-form-item>
          <div style="margin-top: 16px;text-align: center;"
            v-if="showButton">
            <span
                v-if="customerDetail.editRemark == false"
              >
                <el-button
                  style="margin-right: 40px"
                  type="primary"
                  v-loading="saveLoading"
                  :disabled="saveLoading"
                  @click="handleForward(customerDetail)"
                  >甩 单</el-button
                >
                <el-button
                  style="margin-right: 40px"
                  type="primary"
                  v-loading="saveLoading"
                  :disabled="saveLoading"
                  @click="handleUpdate(customerDetail)"
                  v-hasPermi="['system:returnOrder:afterOrder']"
                  v-if="
                    (customerDetail.aftersaleStatus == 6 ||
                    customerDetail.aftersaleStatus == 11)
                  "
                  >售后操作</el-button
                >
                <el-button
                  style="margin-right: 40px"
                  type="primary"
                  v-loading="saveLoading"
                  :disabled="saveLoading"
                  v-if="
                    (customerDetail.aftersaleStatus != 6 && customerDetail.aftersaleStatus != 11)
                  "
                  >{{getEnumLabel(customerDetail.aftersaleStatus, aftersaleStatuss)}}</el-button
                >
                <el-button
                  style="margin-right: 40px"
                  type="warning"
                  :disabled="saveLoading"
                  @click="updateRemarkOrder(customerDetail)"
                  >售后商家备注</el-button
                >
            </span>

            <span v-if="customerDetail.editRemark == true">
              <el-button
                style="margin-right: 40px"
                type="warning"
                v-loading="saveLoading"
                :disabled="saveLoading"
                @click="submit(customerDetail)"
                >保 存</el-button
              >
              <el-button
                type="info"
                v-loading="saveLoading"
                :disabled="saveLoading"
                @click="cancelSubmit(customerDetail)"
                >取 消</el-button
              >
            </span>
          </div>
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
      <div style="display: flex;align-items: center; justify-content: space-between; margin-top: 30px">
        <span style="white-space: nowrap; margin-bottom: 20px">订单标记：</span>
        <el-radio-group
          style="margin: 15px 0; display: flex; transform: translateY(-7px);"
          v-model="sellerRemarkStars"
        >
          <el-radio
            style="display: flex; align-items: center; margin-right: 24px;"
            v-for="obj in markerList"
            :key="obj.id"
            :label="obj.id"
          >
            <img :src="obj.url" style="display: inline-block; width: 20px; height: 20px;"/>
          </el-radio>
        </el-radio-group>
      </div>
      <div style="display: flex;align-items: flex-start; margin-top: 30px">
        <span>甩单备注：</span>
        <el-input
          type="textarea"
          :rows="4"
          placeholder="请输入内容"
          v-model="remark"
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

    <!-- 备注 -->
    <el-dialog
      title="售后商家备注"
      :visible.sync="bzopen"
      width="500px"
      append-to-body
    >
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="备注">
          <el-input v-model="sellerWords" placeholder="请输入备注" clearable />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitFormBz">确 定</el-button>
        <el-button
          @click="
            bzopen = false;
            aftersaleId = '';
            aftersaleZjId = '';
            sellerWords = '';
          "
          >取 消</el-button
        >
      </div>
    </el-dialog>

    <!--操作记录列表-->
    <el-dialog
      title="操作记录列表"
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
  </div>
</template>

<script>
import { listOrder, getOrder, delOrder, addOrder, updateOrder,synchronousctOrder,afterOrder,returnOrderLogList,
  listOrderData, listOrderDetailsData, forwardUser, updateRemarkOrder ,updateSellerWords, updateToOrgId,getReturnAddress,selectJjShList} from "@/api/system/douyinReturnOrder/order";
import { listAll } from '@/api/system/douyinShop/shop'
import qrCode from "@/components/tweet/qrCode";

import { getOrder as getOldOrder, datajm, selectExpressList, updateUserInfo } from '@/api/system/douyinOrder/order'
import { formatDate } from "@/utils/index";

import {
  organizationUser,
  manageUserOrganization,
} from "../../../api/system/production/tweet";
import {  addressList } from "@/api/system/address/index";
import { userUpload } from '@/api/system/user'
import marker0 from '@/assets/images/marker0.png';
import marker1 from '@/assets/images/marker1.png';
import marker2 from '@/assets/images/marker2.png';
import marker3 from '@/assets/images/marker3.png';
import marker4 from '@/assets/images/marker4.png';
import marker5 from '@/assets/images/marker5.png';


export default {
  name: "Order",
  components: { qrCode },
  data() {
    return {
      //操作记录
      moduleLogList: [],
      openModuleLog: false,
      aftersaleTypes: [
        {
          value: 0,
          label: "退货退款",
        },
        {
          value: 1,
          label: "已发货仅退款",
        },
        {
          value: 2,
          label: "未发货仅退款",
        },
        {
          value: 3,
          label: "换货",
        },
        {
          value: 6,
          label: "价保",
        },
        {
          value: 7,
          label: "补寄",
        },
      ],
      aftersaleStatuss: [
        {
          value: 3,
          label: "换货待买家收货",
        },
        {
          value: 6,
          label: "待商家同意",
        },
        {
          value: 7,
          label: "待买家退货",
        },
        {
          value: 8,
          label: "待商家发货",
        },
        {
          value: 11,
          label: "待商家二次同意",
        },
        {
          value: 12,
          label: "售后成功",
        },
        {
          value: 14,
          label: "换货成功",
        },
        {
          value: 27,
          label: "商家一次拒绝",
        },
        {
          value: 28,
          label: "售后失败",
        },
        {
          value: 29,
          label: "商家二次拒绝",
        },
      ],
      aftersaleRefundTypes: [
        {
          value: 0,
          label: "订单货款/原路退款",
        },
        {
          value: 1,
          label: "货到付款线下退款",
        },
        {
          value: 2,
          label: "备用金",
        },
        {
          value: 3,
          label: "保证金",
        },
        {
          value: 4,
          label: "无需退款",
        },
        {
          value: 5,
          label: "平台垫付",
        },
      ],
      refundStatuss: [
        {
          value: 1,
          label: "待退款",
        },
        {
          value: 2,
          label: "退款中",
        },
        {
          value: 3,
          label: "退款成功",
        },
        {
          value: 4,
          label: "退款失败",
        },
        {
          value: 5,
          label: "追缴成功",
        },
      ],
      orderStatuss: [
        {
          value: 2,
          label: "未发货",
        },
        {
          value: 3,
          label: "已发货",
        },
        {
          value: 5,
          label: "已收货或已完成",
        },
        {
          value: 4,
          label: "已完成",
        },
      ],
      isCargo: [
        {
          value: 0,
          label: "未收到",
        },
        {
          value: 1,
          label: "收到",
        },
      ],
      refundType:[
      {
          value: 0,
          label: "订单货款/原路退款",
        },
        {
          value: 1,
          label: "货到付款线下退款",
        },
        {
          value: 2,
          label: "备用金",
        },
        {
          value: 3,
          label: "保证金",
        },
        {
          value: 4,
          label: "无需退款",
        },
        {
          value: 5,
          label: "平台垫付",
        },
      ],
      image: {
        wcQrc: {//产品默认图
          name: 'wcQrc',
          url: ''
        },
        url: '',
        visible: false
      },
      returnReasonRemark:'',
      returnReasonOpenY:false,
      returnReasonList:[],
      returnReasonOpen:false,
      returnReasonId:'',
      returnAddressList:[],
      returnAddressOpen:false,
      returnAddressId:'',
      sellerWords: "",
      bzopen: false,
      searchType: this.$route.query.searchType,
      sessionOrgId: sessionStorage.getItem("organizationId"),
      openTb: false,
      shopList: [],
      shopId: "",
      aftersaleZjId: "",
      aftersaleId: "",
      afterSaleType: "",
      afterSaleStatus: "",
      afterType: "",
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
      // 售后订单表格数据
      orderList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        organizationId: sessionStorage.getItem("organizationId"),
        searchType: this.$route.query.searchType,
        isSelectElem: true,
        pageNum: 1,
        pageSize: 10,
        shopName:null,
        shopOrderId: null,
        aftersaleId: null,
        aftersaleType: null,
        aftersaleStatus: null,
        aftersaleRefundType: null,
        refundStatus: null,
        reasonText: null,
        remark: null,
        productId: null,
        productName: null,
        orderStatus: null,
        detailsRemark: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {},
      //订单操作
      //商家备注
      saveLoading: false,
      parentRow: null,
      //用户操作
      openOrder: false,
      customerDetail: {},
      //外呼
      openPhone: false,
      phoneUrl: null,
      //甩单
      elementDetail: {},
      openForward: false,
      organizationList: [],
      organizationListDefault: [],
      userList: [],
      detailsId: null,
      toOrganizationId: null,
      toUserId: null,
      showButton: true,
      sdSearchValue: '',
      remark: '',
      sellerRemarkStars: '',
      markerList: [
        {
          id: 0,
          url: marker0,
        },
        {
          id: 1,
          url: marker1,
        },
        {
          id: 2,
          url: marker2,
        },
        {
          id: 3,
          url:marker3,
        },
        {
          id: 4,
          url: marker4,
        },
        {
          id: 5,
          url: marker5,
        },
      ],
      //三级地址
      provinceList:[],
      cityList:[],
      areaList:[],
      streetList:[],
    };
  },
  created() {
    this.getList();
    this.getManageUserOrganization();
    this.getProvinceList();
  },
  methods: {
    /** 排序触发事件 */
    handleSortChange(column, prop, order) {
      this.queryParams.orderByColumn = column.prop;
      this.queryParams.isAsc = column.order;
      this.queryParams.pageNum = 1;
      this.getList();
    },
    // 文件上传相关 start ======
    imagePreview(url,type) {
      if(type == 1){
        //产品默认图
        this.image.url = url
        this.image.visible = true
      }
      if(type == 2){
        //表单结果图
        this.bdResultImage.url = url
        this.bdResultImage.visible = true
      }
    },
    imageRemove(name,type) {
      if(type == 1){
        //产品默认图
        if (name == this.image.wcQrc.name) {
          this.image.wcQrc.url = ''
          this.form.wcQrcId = undefined
        } else if (name == this.image.entWcQrc.name) {
          this.image.entWcQrc.url = ''
          this.form.entWcQrcId = undefined
        }
      }
      if(type == 2){
        //表单结果图
        if (name == this.bdResultImage.wcQrc.name) {
          this.bdResultImage.wcQrc.url = ''
          this.form.wcQrcId2 = undefined
        } else if (name == this.bdResultImage.entWcQrc.name) {
          this.bdResultImage.entWcQrc.url = ''
          this.form.entWcQrcId2 = undefined
        }
      }

    },
    uploadTypeOpen(name,type) {
      let _this = this
      const inputFile = document.createElement('input')
      inputFile.type = 'file'
      inputFile.style.display = 'none'
      document.body.appendChild(inputFile)
      inputFile.click()
      //图片
      const fileType = ['jpg', 'jpeg', 'png']
      inputFile.addEventListener('change', function() {
        const file = inputFile.files[0]
        console.log(file)
        if (file.size > 5242880) {
          _this.$message.warning('图库文件大小不能超过5MB')
          document.body.removeChild(inputFile)
          return false
        }
        const fileSuffix = file.name.substring(file.name.lastIndexOf('.') + 1)
        if (!fileType.includes(fileSuffix)) {
          _this.$message.warning('上传的文件格式只能是' + fileType)
          document.body.removeChild(inputFile)
          return false
        }
        _this.$modal.loading('正在上传图片，请稍候...')
        const formData = new FormData()
        formData.append('file', file)
        formData.append('source', name)
        userUpload(formData).then(response => {
          if (name == _this.image.wcQrc.name) {
            _this.image.wcQrc.url = response.data.fileVirtualPath
            _this.form.productImage = response.data.fileVirtualPath
            _this.form.wcQrcId = response.data.fileId
            _this.$modal.closeLoading()
          } else if (name == _this.image.entWcQrc.name) {
            _this.image.entWcQrc.url = response.data.fileVirtualPath
            _this.form.entWcQrcId = response.data.fileId
            _this.$modal.closeLoading()
          }
        })
      })
    },
    //获取枚举名称
    getEnumLabel(value, enumData) {
      if (!enumData) return;
      const enumObj = enumData.find((item) => item.value == value);
      return enumObj ? enumObj.label : "";
    },
    //获取纳管组织
    getManageUserOrganization() {
      manageUserOrganization().then((response) => {
        this.organizationListDefault = response.data;
      });
    },
    jujueyy(){
      if(this.returnReasonId.split("_")[1] == "Y"){
          this.returnReasonOpenY = true;
      }else{
        this.returnReasonOpenY = false;
      }

    },
    xzshouhou(){
      this.returnReasonId = '';
      this.image.wcQrc.url = '';
      this.returnReasonRemark='';
      this.returnReasonOpenY = false;
      this.returnAddressOpen = false
      this.returnReasonOpen = false
      if(this.afterType == 101){
        this.returnAddressOpen = true
        //查询地址
        this.getReturnAddressList();
      }else if(this.afterType == 102 || this.afterType == 202){
        this.returnReasonOpen = true;
        //查询原因
        this.getReturnReasonList();
      }
    },
    getReturnAddressList() {
      let datas = {
        shopId : this.customerDetail.shopId
      }
      getReturnAddress(datas).then((response) => {
        this.returnAddressList = response.rows;
      });
    },
    getReturnReasonList() {
      let datas = {
        shopId : this.customerDetail.shopId,
        aftersaleId : this.customerDetail.aftersaleId
      }
      selectJjShList(datas).then((response) => {
        this.returnReasonList = response.rows;
      });
    },
    /** 查询售后订单列表 */
    getList() {
      this.loading = true;
      listOrderData(this.addDateRange(this.queryParams, this.dateRange)).then(
        (response) => {
          this.orderList = [];
          this.orderList = response.rows;
          this.total = response.total;
          this.loading = false;
        }
      );
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        id: null,
        shopOrderId: null,
        aftersaleId: null,
        aftersaleType: null,
        aftersaleStatus: null,
        refundAmount: null,
        refundPostAmount: null,
        aftersaleNum: null,
        aftersaleRefundType: null,
        createTime: null,
        returnLogisticsCode: null,
        refundStatus: null,
        returnLogisticsCompanyName: null,
        remark: null,
        gotPkg: null,
        trackingNo: null,
        companyName: null,
        reasonSecondLabelsName: null,
        reasonText: null,
      };
      this.resetForm("form");
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
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.openTb = true;
      this.title = "同步售后订单";
      let a = {};
      listAll(a).then((response) => {
        this.shopList = response.rows;
      });
    },
    submitFormTb() {
      if (this.shopId == null || this.shopId == "") {
        this.$modal.msgError("请选择需要同步的店铺");
        return;
      }
      this.loading = true;

      let aa = {
        shopId: this.shopId,
      };
      synchronousctOrder(aa).then((response) => {
        this.loading = false;
        this.openTb = false;
        this.$modal.msgSuccess("同步成功");
        this.getList();
      });
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      this.aftersaleId = row.aftersaleId;
      this.title = "售后操作";
      this.open = true;
      this.afterSaleType = row.aftersaleType;
      this.afterSaleStatus = row.aftersaleStatus;
      this.shopId = row.shopId;
      this.shopOrderId = row.shopOrderId;
    },
    submitFormSh() {
      if (this.afterType == null || this.afterType == "") {
        this.$modal.msgError("请选择售后结果");
        return;
      }else{
          if(this.afterType == 101 && (this.returnAddressId == null || this.returnAddressId == "")){
            this.$modal.msgError("请选择退货地址");
            return;
          }else if(this.afterType == 102 && (this.returnReasonId == null || this.returnReasonId == "")){
            this.$modal.msgError("请选择拒绝原因");
            return;
          }

          if(this.returnReasonId.split("_")[1] == "Y" && (this.image.wcQrc.url == null || this.image.wcQrc.url == "")){
            this.$modal.msgError("请上传凭证图片");
            return;
          }

          if(this.returnReasonId.split("_")[1] == "Y" && (this.returnReasonRemark == null || this.returnReasonRemark == "")){
            this.$modal.msgError("请上输入拒绝描述");
            return;
          }
      }
      if(this.shopOrderId == null || this.shopOrderId == ""){
        this.$modal.msgError("原订单编号不能为空")
        return;
      }
      let shData = {
        afterType: this.afterType,
        aftersaleId: this.aftersaleId,
        shopId: this.shopId,
        returnAddressId:this.returnAddressId,
        returnReasonId:this.returnReasonId,
        pzImage:this.image.wcQrc.url,
        returnReasonRemark:this.returnReasonRemark
      };
      afterOrder(shData).then((response) => {
        this.$modal.msgSuccess("售后操作成功");
        this.open = false;
        this.returnAddressId = "";
        this.afterType = '';
        this.aftersaleId = '';
        this.returnAddressOpen = false;
        this.returnReasonOpenY = false;
        this.image.wcQrc.url = '';
        this.returnReasonRemark = '';
        this.returnAddressList = [];
        this.returnReasonId = "";
        this.returnReasonOpen = false;
        this.returnReasonList = [];
        this.shopOrderId = "";
        this.afterSaleType = "";
        this.afterSaleStatus = "";
        this.shopId = "";
        if(this.openOrder){
          this.customerDetail.afterType = this.afterType
          this.customerDetail.aftersaleStatus = 12
        }else{
          this.getList();
        }
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.id != null) {
            updateOrder(this.form).then((response) => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addOrder(this.form).then((response) => {
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$modal
        .confirm('是否确认删除售后原订单编号为"' + ids + '"的数据项？')
        .then(function () {
          return delOrder(ids);
        })
        .then(() => {
          this.getList();
          this.$modal.msgSuccess("删除成功");
        })
        .catch(() => {});
    },

    /** 导出按钮操作 */
    handleExport() {
      let queryParamsExport = JSON.parse(JSON.stringify(this.queryParams));
      queryParamsExport.orderIds  = this.ids
      this.download(
        "system/returnOrder/export",
        {
          ...this.addDateRange(queryParamsExport, this.dateRange),
        },
        `抖音售后订单_${new Date().getTime()}.xlsx`
      );
    },

    //用户操作弹框
    handleOrder(row) {
      this.saveLoading = false;
      row.elements = this.handelCustomerList(row.douyinReturnOrderDetails);
      row.remarkOld = row.remark;
      row.sellerRemarkStarsOld = row.sellerRemarkStars;
      row.editRemark = false;

      row.mmEncryptIdCardNameOld = row.mmEncryptIdCardName;
      row.mmEncryptIdCardNoOld = row.mmEncryptIdCardNo;
      row.mmPostReceiverOld = row.mmPostReceiver;
      row.mmMaskPostTelOld = row.mmMaskPostTel;
      row.mmAddrDetailOld = row.mmAddrDetail;
      row.provinceOld = row.province;
      row.cityOld = row.city;
      row.townOld = row.town;
      row.streetOld = row.street;
      this.areaList = []
      this.cityList  =[]
      this.streetList = []
      if(row.province!=null && row.province!=''){
        this.getCityList(row.province)
      }
      if(row.city!=null && row.city!=''){
        this.getAreaList(row.city)
      }
      if(row.town!=null && row.town!=''){
        this.getStreetList(row.town)
      }
      row.editUserInfo = false;

      this.customerDetail = JSON.parse(JSON.stringify(row));
      this.openOrder = true;
      this.parentRow = row;
    },
    /** 备注 */
    databz(row) {
      this.reset();
      this.bzopen = true;
      this.shopId = row.shopId;
      this.aftersaleId = row.aftersaleId;
      this.aftersaleZjId = row.id;
    },
    submitFormBz() {
      if (this.aftersaleId == null || this.aftersaleId == "") {
        this.$modal.msgError("售后单id不能为空");
        return;
      }

      if (this.sellerWords == null || this.sellerWords == "") {
        this.$modal.msgError("备注不能为空");
        return;
      }

      let aa = {
        id: this.aftersaleZjId,
        shopId: this.shopId,
        aftersaleId: this.aftersaleId,
        remark: this.sellerWords,
      };
      updateSellerWords(aa).then((response) => {
        this.getList();
        this.aftersaleId = "";
        this.bzopen = false;
        this.aftersaleZjId = "";
        this.sellerWords = "";
        this.$modal.msgSuccess("备注成功");
      });
    },
    handelCustomerList(response) {
      this.showButton = true;
      let elements = [];
      let userId = sessionStorage.getItem("userId");
      let organizationId = sessionStorage.getItem("organizationId");
      response.forEach((item, index) => {
        if(this.searchType=='orgAll'){
          if(this.sessionOrgId!=null && item.toOrganizationId != this.sessionOrgId){
            this.showButton = false
            item.forwardStatusName =
              "该订单已甩单给(" +
              item.toOrganizationName +
              ")" +
              item.toUserName;
          }
        }
        item.remarkOld = item.remark;
        item.orderStatusOld = item.detailsOrderStatusDesc;
        item.editRemark = false;
        item.editUserInfo = false;
        elements.push(item);
      });
      return elements;
    },
    //关闭订单弹窗
    closeOrder() {
      this.showButton = true;
      //刷新订单列表
      this.getList();
      this.customerDetail = {};
      this.openOrder = false;
      this.remark = '';
      this.sellerRemarkStars = '';
      this.areaList = []
      this.cityList  =[]
      this.streetList = []
    },
    //外呼
    toPhone(item) {
      let phone = item.mmMaskPostTel;
      this.getConfigKey("customer_call_phone").then((response) => {
        let url =
          response.msg +
          "?elementId=" +
          encodeURIComponent(window.btoa(item.orderId)) +
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

    //甩单
    handleForward(item) {
      this.elementDetail = item;
      this.organizationList = this.organizationListDefault;
      if (this.organizationList.length == 0) {
        this.$modal.msgError("组织列表为空");
        return;
      }
      this.toOrganizationId = item.toOrganizationId!=null ? item.toOrganizationId : this.organizationList[0].organizationId;
      let params = {
        organizationId: this.toOrganizationId,
      };
      organizationUser(params).then((response) => {
        if (response.data) {
          this.userList = response.data;
        }
      });
      this.detailsId = item.shopOrderId;
      this.remark = this.remark || item?.remark;
      this.sellerRemarkStars = this.sellerRemarkStars || item?.sellerRemarkStars;
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
      this.detailsId = null;
      this.openForward = false;
      this.elementDetail = {};
      this.sdSearchValue = '';
    },
    forwardUser() {
      this.saveLoading = true;
      if (this.detailsId == null || this.detailsId == "") {
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
        shopOrderId: this.detailsId,
        toOrganizationId: this.toOrganizationId,
        toUserId: this.toUserId,
        remark: this.remark,
        sellerRemarkStars: this.sellerRemarkStars,
      };
      forwardUser(params).then((response) => {
        this.$modal.msgSuccess("甩单成功");
        this.customerDetail.remark = this.remark;
        this.customerDetail.sellerRemarkStars = this.sellerRemarkStars;
        this.closeForward();
      });
    },
    updateRemarkOrder(item) {
      console.log("item===", item);
      item.editRemark = true;
    },
    cancelSubmit(item) {
      item.remark = item.remarkOld;
      item.editRemark = false;
    },
    submit(item) {
      if (item.sellerRemarkStars !== 0) {
        if(item.sellerRemarkStars == null || item.sellerRemarkStars == ""){
          this.$modal.msgError("订单标记不能为空");
          return;
        }
      }
      if (item.remark == null || item.remark == "") {
        this.$modal.msgError("备注不能为空");
        return;
      }
      this.$modal
        .confirm("确定修改售后商家备注")
        .then((response) => {
          this.saveLoading = true;
          let aa = {
            id: item.id,
            shopId: item.shopId,
            aftersaleId: item.aftersaleId,
            remark: item.remark,
            sellerRemarkStars: item.sellerRemarkStars,
          };
          updateSellerWords(aa).then((response) => {
            item.remarkOld = item.remark;
            item.editRemark = false;
            this.saveLoading = false;
            this.$modal.msgSuccess("操作成功");
          });
        })
        .catch((response) => {});
    },

    /** 解密 */
    datajm(row) {
      this.reset();
      const id = row.oldId
      this.$modal.confirm('是否确认解密当前数据项？').then(function() {
        let datas = {"id":id}
        return datajm(datas);
      }).then(() => {
        //修改详情页的解密数据
        getOldOrder(id).then(response => {
          this.customerDetail.mmEncryptIdCardName = response.data.mmEncryptIdCardName;
          this.customerDetail.mmEncryptIdCardNo = response.data.mmEncryptIdCardNo;
          this.customerDetail.mmPostReceiver = response.data.mmPostReceiver;
          this.customerDetail.mmMaskPostTel = response.data.mmMaskPostTel;
          this.customerDetail.mmAddrDetail = response.data.mmAddrDetail;
        });
        this.$modal.msgSuccess("解密完成");
      }).catch(() => {});

    },

    handleSyncOrderAccept(isUpdate) {
      let queryParamsSync = JSON.parse(JSON.stringify(this.queryParams));
      queryParamsSync.orderIds  = this.ids
      queryParamsSync.isUpdate = isUpdate;
      let message = "";
      if(this.ids == []){
        message = "确定"+ (isUpdate==0 ? "增量" :"全量") +"同步查询到全部的订单数据？"
      }else{
        message = "确定"+ (isUpdate==0 ? "增量" :"全量") +"同步选中的订单数据？"
      }
      let _this = this
      _this.$modal.confirm(message).then(function() {
        _this.loading = true;
        updateToOrgId(queryParamsSync).then((response) => {
          _this.loading = false;
          _this.getList();
          _this.$modal.msgSuccess("同步成功");
        }).catch((response) => {
          _this.loading = false;
        })
      });
    },
    sdSearchChange(value){
      this.organizationList = this.organizationListDefault.filter(item=>item.organizationName.includes(value));
    },

    //操作记录
    handleModuleLog(row) {
      this.openModuleLog = true;
      returnOrderLogList({ targetId: row.id }).then((response) => {
        this.moduleLogList = response.rows;
      });
    },
    //关闭操作记录弹窗
    closeModuleLog() {
      this.openModuleLog = false;
      this.moduleLogList = [];
    },

    updateUserInfo(item) {
      item.editUserInfo = true;
    },
    cancelUserInfo(item) {
      item.mmEncryptIdCardName = item.mmEncryptIdCardNameOld;
      item.mmEncryptIdCardNo = item.mmEncryptIdCardNoOld;
      item.mmPostReceiver = item.mmPostReceiverOld;
      item.mmMaskPostTel = item.mmMaskPostTelOld;
      item.mmAddrDetail = item.mmAddrDetailOld;
      item.province = item.provinceOld;
      item.city = item.cityOld;
      item.town = item.townOld;
      item.street = item.streetOld;
      item.editUserInfo = false;
    },
    submitUserInfo(item) {
      this.$modal
        .confirm("确定修改用户信息")
        .then((response) => {
          if (item.sellerRemarkStars !== 0) {
            if(item.sellerRemarkStars == null || item.sellerRemarkStars == ""){
              this.$modal.msgError("订单标记不能为空");
              return;
            }
          }
          this.saveLoading = true;
          let aa = {
            id: item.oldId,
            mmEncryptIdCardName: item.mmEncryptIdCardName,
            mmEncryptIdCardNo: item.mmEncryptIdCardNo,
            mmPostReceiver: item.mmPostReceiver,
            mmMaskPostTel: item.mmMaskPostTel,
            mmAddrDetail: item.mmAddrDetail,
            province: item.province,
            city: item.city,
            town: item.town,
            street: item.street,
          };
          updateUserInfo(aa).then((response) => {
            this.getList();
            item.mmEncryptIdCardNameOld = item.mmEncryptIdCardName;
            item.mmEncryptIdCardNoOld = item.mmEncryptIdCardNo;
            item.mmPostReceiverOld = item.mmPostReceiver;
            item.mmMaskPostTelOld = item.mmMaskPostTel;
            item.mmAddrDetailOld = item.mmAddrDetail;
            item.provinceOld = item.province;
            item.cityOld = item.city;
            item.townOld = item.town;
            item.streetOld = item.street;
            item.editUserInfo = false;
            this.saveLoading = false;
            this.$modal.msgSuccess("操作成功");
          });
        })
        .catch((response) => {});
    },
    
    getProvinceList(){
      this.cityList=[]
      this.areaList=[]
      this.streetList=[]
      addressList({selectType:'0'}).then(response=>{
        console.log("response.rows",response.rows)
        this.provinceList = response.rows;
      })
    },
    getCityList(province){
      this.customerDetail.city = null
      this.customerDetail.town = null
      this.customerDetail.street = null
      if(province==null || province==undefined || province==''){
        this.$modal.msgError("请先选择省份");
      }
      addressList({selectType:'1',name:province}).then(response=>{
        this.cityList = response.rows;
      })
    },
    getAreaList(city){
      this.customerDetail.town = null
      this.customerDetail.street = null
      if(city==null || city==undefined || city==''){
        this.$modal.msgError("请先选择城市");
      }
      addressList({selectType:'2',name:city}).then(response=>{
        this.areaList = response.rows;
      })
    },
    getStreetList(area){
      this.customerDetail.street = null
      if(area==null || area==undefined || area==''){
        this.$modal.msgError("请先选择地区");
      }
      addressList({selectType:'3',name:area}).then(response=>{
        this.streetList = response.rows;
      })
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
    width:100%;
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
