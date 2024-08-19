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
      <el-form-item label="买家留言" prop="buyerWords">
        <el-input
          v-model="queryParams.buyerWords"
          placeholder="请输入买家留言"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="下单时间">
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
      <el-form-item label="收件人姓名" prop="mmPostReceiver">
        <el-input
          v-model="queryParams.mmPostReceiver"
          placeholder="请输入收件人姓名"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="收件人手机" prop="mmMaskPostTel">
        <el-input
          v-model="queryParams.mmMaskPostTel"
          placeholder="请输入收件人手机"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <!-- <el-form-item label="发货审核状态" prop="auditingStatus">
        <el-select
          v-model="queryParams.auditingStatus"
          placeholder="请选择发货审核"
          clearable
        >
          <el-option
            v-for="dict in auditingStatuss"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item> -->
      <el-form-item label="商品标题" prop="productName">
        <el-input
          v-model="queryParams.productName"
          placeholder="请输入商品标题"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <!-- <el-form-item label="子订单状态" prop="detailsOrderStatusDesc">
        <el-input
          v-model="queryParams.detailsOrderStatusDesc"
          placeholder="请输入子订单状态"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item> -->
      <el-form-item label="达人UID" prop="authorId">
        <el-input
          v-model="queryParams.authorId"
          placeholder="请输入达人UID"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="达人名称" prop="authorName">
        <el-input
          v-model="queryParams.authorName"
          placeholder="请输入达人名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="核销码" prop="coupon">
        <el-input
          v-model="queryParams.coupon"
          placeholder="请输入核销码"
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
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['system:order:export']"
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
          @click="synchronous"
          v-hasPermi="['system:order:synchronous']"
          >同步抖店订单</el-button
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
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="manualJm()"
        >手动解密</el-button
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
            :data="scope.row.douYinOrderDetails"
          >
            <el-table-column label="子订单编号" align="center" prop="detailsOrderId" width="180" />
            <el-table-column label="子订单状态" align="center" prop="detailsOrderStatusDesc" width="100" />
            <el-table-column label="子订单类型" align="center" prop="orderType" width="150" >
              <template slot-scope="{ row }">
                <span v-if="row.orderType == 0">普通订单</span>
                <span v-if="row.orderType == 2">虚拟商品订单</span>
                <span v-if="row.orderType == 4">平台发码订单</span>
                <span v-if="row.orderType == 5">商家发码订单</span>
              </template>
            </el-table-column>
            <el-table-column label="下单时间" align="center" prop="createTime" width="180">
              <template slot-scope="scope">
                <span>{{
                  parseTime(scope.row.createTime, "{y}-{m}-{d} {h}:{i}:{s}")
                }}</span>
              </template>
            </el-table-column>
            <el-table-column label="商品标题" align="center" prop="productName" width="240" />
            <el-table-column label="商品图片" align="center" width="80">
              <template slot-scope="scope">
                <image-preview v-if="scope.row.productImg != null" :src="scope.row.productImg" :width="50" :height="50"/>
              </template>
            </el-table-column>
            <el-table-column label="商品规格" align="center" prop="specs" width="200" />
            <el-table-column label="商品标签" align="center" prop="skuOrderTagUi" width="200" />
            <el-table-column label="商品数量" align="center" prop="itemNum" width="80" >
              <template slot-scope="scope">
                {{scope.row.itemNum}}
              </template>
            </el-table-column>
            <el-table-column label="买家实付(元)" align="center" prop="payAmount" width="100" >
              <template slot-scope="scope">
                {{scope.row.payAmount}}
              </template>
            </el-table-column>
            <el-table-column label="达人UID" align="center" prop="authorId" width="120" />
            <el-table-column label="达人名称" align="center" prop="authorName" width="150" />
            <el-table-column label="下单来源" align="center" prop="themeTypeDesc" width="100" />
            <el-table-column label="直播间id" align="center" prop="roomId" width="120" />
            <!-- <el-table-column label="C端流量来源" align="center" prop="cBizDesc" width="120" /> -->
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
      <!-- <el-table-column label="店铺id" align="center" prop="shopId" width="100"/> -->
      <el-table-column label="店铺名称" align="center" prop="shopName" width="120" sortable="custom" :sort-orders="['descending', 'ascending']"/>
      <el-table-column label="订单编号" align="center" prop="orderId" width="180" sortable="custom" :sort-orders="['descending', 'ascending']"/>
      <el-table-column label="订单状态" align="center" prop="orderStatusDesc" width="100" sortable="custom" :sort-orders="['descending', 'ascending']"/>
      <el-table-column label="订单类型" align="center" prop="orderType" width="150" sortable="custom" :sort-orders="['descending', 'ascending']">
        <template slot-scope="{ row }">
          <span v-if="row.orderType == 0">普通订单</span>
          <span v-if="row.orderType == 2">虚拟商品订单</span>
          <span v-if="row.orderType == 4">平台发码订单</span>
          <span v-if="row.orderType == 5">商家发码订单</span>
        </template>
      </el-table-column>
      <el-table-column label="下单时间" align="center" prop="createTime" width="180" sortable="custom" :sort-orders="['descending', 'ascending']">
        <template slot-scope="scope">
          <span>{{
            parseTime(scope.row.createTime, "{y}-{m}-{d} {h}:{i}:{s}")
          }}</span>
        </template>
      </el-table-column>
      <el-table-column label="商品数量" align="center" prop="productNum" width="80" >
        <template slot-scope="scope">
          {{scope.row.productNum}}
        </template>
      </el-table-column>
      <el-table-column label="买家实付(元)" align="center" prop="orderAmount" width="100" >
        <template slot-scope="scope">
          {{scope.row.orderAmount}}
        </template>
      </el-table-column>
      <el-table-column label="收件人姓名" align="center" prop="mmPostReceiver" width="100" />
      <el-table-column label="收件人手机" align="center" prop="mmMaskPostTel" width="110" />
      <el-table-column label="省市区" align="center" prop="createTime" width="180">
        <template slot-scope="scope">
          <span>{{scope.row.province}}{{scope.row.city}}{{scope.row.town}}{{scope.row.street}}</span>
        </template>
      </el-table-column>
      <el-table-column label="详细地址" align="center" prop="mmAddrDetail" width="180" />
      <el-table-column label="身份证姓名" align="center" prop="mmEncryptIdCardName" width="100" />
      <el-table-column label="身份证号码" align="center" prop="mmEncryptIdCardNo" width="180" />
      <!-- <el-table-column label="是否解密" align="center" prop="jsStatus" width="80" >
        <template slot-scope="{ row }">
          <span v-if="row.jsStatus == 1">是</span>
          <span v-if="row.jsStatus == 0">否</span>
        </template>
      </el-table-column> -->
      <el-table-column label="券码" align="center" prop="coupon" width="150" sortable="custom" :sort-orders="['descending', 'ascending']"/>
      <el-table-column label="买家留言" align="center" prop="buyerWords" width="200"/>
      <el-table-column label="商家备注" align="center" prop="sellerWords" width="200">
        <template slot-scope="scope">
          <el-tooltip
            class="item"
            effect="dark"
            placement="top-start"
            v-if="scope.row.sellerWords != null && scope.row.sellerWords.length > 50">
            <div slot="content">{{ scope.row.sellerWords }}</div>
            <span>{{ scope.row.sellerWords.substring(0, 50) }}..</span>
          </el-tooltip>
          <span v-if="scope.row.sellerWords != null && scope.row.sellerWords.length <= 50">{{ scope.row.sellerWords }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column label="解密结果" align="center" prop="jsResult" width="180" /> -->
      <!-- <el-table-column label="发货审核状态" align="center" prop="auditingStatus" width="200" >
        <template slot-scope="{ row }">
          <span v-if="row.auditingStatus == 1">待审核</span>
          <span v-if="row.auditingStatus == 0">审核通过</span>
          <span v-if="row.auditingStatus == 200001"
            >下单身份信息180天内在该卡品运营商处重复下单，未通过审核</span
          >
          <span v-if="row.auditingStatus == 200002"
            >下单身份信息已在该卡品运营商处办理了5张电话卡，未通过审核</span
          >
          <span v-if="row.auditingStatus == 200003"
            >下单身份信息年龄不在16-60岁（部分卡品16-30岁），未通过审核</span
          >
          <span v-if="row.auditingStatus == 200004"
            >下单地址为该卡品运营商禁售地区，未通过审核</span
          >
          <span v-if="row.auditingStatus == 200005"
            >因其他原因，未能通过运营商审核，具体可联系商家</span
          >
        </template>
      </el-table-column> -->

      <el-table-column
        fixed="right"
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
        width="200">
        <template slot-scope="scope">
          <!--          <el-button-->
          <!--            size="mini"-->
          <!--            type="text"-->
          <!--            icon="el-icon-edit"-->
          <!--            @click="handleUpdate(scope.row)"-->
          <!--            v-hasPermi="['system:order:edit']"-->
          <!--          >修改</el-button>-->
          <!--          <el-button-->
          <!--            size="mini"-->
          <!--            type="text"-->
          <!--            icon="el-icon-delete"-->
          <!--            @click="handleDelete(scope.row)"-->
          <!--            v-hasPermi="['system:order:remove']"-->
          <!--          >删除</el-button>-->
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="datajm(scope.row)"
            v-hasPermi="['system:order:datajm']"
            v-if="(scope.row.mmMaskPostTel == null || scope.row.mmMaskPostTel.length != 11) && (scope.row.orderStatus == 105 || scope.row.orderStatus == 2 || scope.row.orderStatus == 101 || scope.row.orderStatus == 3)"
            >解密</el-button
          >
<!--          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="databz(scope.row)"
            v-hasPermi="['system:order:databz']"
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
          <el-button
            size="mini"
            type="text"
            icon="el-icon-setting"
            @click="pushOrderLog(scope.row)"
          >推送记录</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-document"
            @click="handleSendSms(scope.row)"
          >手动发送短信</el-button>
          <!-- <el-button
            size="mini"
            type="text"
            v-if="scope.row.auditingStatus == 1 && scope.row.orderStatus == 105"
            icon="el-icon-edit"
            @click="datash(scope.row)"
            v-hasPermi="['system:order:datash']"
          >发货前审核</el-button>
          <el-button
            size="mini"
            type="text"
            v-if="(scope.row.orderStatus == 2 || scope.row.orderStatus == 105) && scope.row.auditingStatus == 0"
            icon="el-icon-edit"
            @click="datafh(scope.row)"
            v-hasPermi="['system:order:datafh']"
          >发货</el-button>
          <el-button
            size="mini"
            type="text"
            v-if="scope.row.orderStatus == 1"
            icon="el-icon-edit"
            @click="datadzf(scope.row)"
            v-hasPermi="['system:order:datadzf']"
          >取消待支付</el-button> -->
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

    <!-- 添加或修改抖音订单对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
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
        <el-form-item label="开始时间">
          <el-date-picker
            clearable
            v-model="startTime"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="同步订单的开始时间"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="结束时间">
          <el-date-picker
            clearable
            v-model="endTime"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="同步订单的结束时间"
          >
          </el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 审核 -->
    <el-dialog title="审核" :visible.sync="shopen" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="审核结果">
          <el-select v-model="auditingStatus" placeholder="请选择审核结果">
            <el-option label="审核通过" value="0"></el-option>
            <el-option
              label="下单身份信息180天内在该卡品运营商处重复下单，未通过审核"
              value="200001"
            ></el-option>
            <el-option
              label="下单身份信息已在该卡品运营商处办理了5张电话卡，未通过审核"
              value="200002"
            ></el-option>
            <el-option
              label="下单身份信息年龄不在16-60岁（部分卡品16-30岁），未通过审核"
              value="200003"
            ></el-option>
            <el-option
              label="下单地址为该卡品运营商禁售地区，未通过审核"
              value="200004"
            ></el-option>
            <el-option
              label="因其他原因，未能通过运营商审核，具体可联系商家"
              value="200005"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitFormSh">确 定</el-button>
        <el-button @click="shopen = false">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 备注 -->
    <el-dialog
      title="商家备注"
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
          @click="bzopen = false;orderId = '';sellerWords = '';">取 消</el-button
        >
      </div>
    </el-dialog>

    <!-- 发货 -->
    <el-dialog title="发货" :visible.sync="fhopen" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="发货类型">
          <el-select
            v-model="expressType"
            placeholder="请选择发货类型"
            @change="expressType == 0 ? (ywuliu = false) : (ywuliu = true)"
          >
            <el-option label="无物流单号发货" value="0"></el-option>
            <el-option label="有物流单号发货" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="快递公司" v-if="ywuliu">
          <el-select
            v-model="expressCode"
            placeholder="请选择快递公司"
            filterable
            remote
          >
            <el-option
              v-for="dict in expressList"
              :key="dict.id"
              :label="dict.name"
              :value="dict.code + '_' + dict.name"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="快递单号" v-if="ywuliu">
          <el-input
            v-model="expressDh"
            placeholder="请输入快递单号"
            clearable
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitFormfh">确 定</el-button>
        <el-button @click="fhopen = false">取 消</el-button>
      </div>
    </el-dialog>


    <el-dialog title="核销" :visible.sync="hxopen" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="核销码">
          <el-input
            v-model="certNo"
            placeholder="请输入核销码"
            clearable
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitFormHx">确 定</el-button>
        <el-button @click="hxopen = false;shopId = '';certNo='';">取 消</el-button>
      </div>
    </el-dialog>

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
          <el-row>
            <el-col :span="10">
              <el-form-item label="订单编号:">
                {{ customerDetail.orderId }}
              </el-form-item>
            </el-col>
            <el-col :span="12">
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
          </el-row>
          <el-row>
            <el-col :span="10">
              <el-form-item label="订单状态:">
                {{ customerDetail.orderStatusDesc }}
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="收件人手机号:">
                <span v-if="customerDetail.editUserInfo == false">
                  {{ (customerDetail.mmMaskPostTel=="" || customerDetail.mmMaskPostTel==null) ? customerDetail.maskPostTel : customerDetail.mmMaskPostTel }}
                  <el-button
                    v-if="(customerDetail.mmMaskPostTel == null || customerDetail.mmMaskPostTel.length != 11) && (customerDetail.orderStatus == 105 || customerDetail.orderStatus == 2 || customerDetail.orderStatus == 101 || customerDetail.orderStatus == 3)"
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
                    @click="toPhone(customerDetail.orderId,customerDetail.mmMaskPostTel)"
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
          </el-row>
          <el-row>
            <el-col :span="10">
              <el-form-item label="订单类型:">
                {{ customerDetail.orderType ==0 ? '普通订单' :
                  customerDetail.orderType ==2 ? '虚拟商品订单':
                  customerDetail.orderType ==4 ? '平台发码订单':
                  customerDetail.orderType ==5 ? '商家发码订单' : ''
                }}
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="收件地址:">
                <span v-if="customerDetail.editUserInfo == false">
                  {{
                    customerDetail.province +
                    customerDetail.city +
                    customerDetail.town +
                    customerDetail.street
                  }}
                </span>
                <span v-if="customerDetail.editUserInfo == true" style="display: flex;flex-wrap: wrap;justify-content: space-between;">
                  <el-select v-model="customerDetail.province" @change="getCityList" filterable clearable placeholder="请选择省份" style="width:150px;padding-bottom: 5px;">
                    <el-option
                      v-for="dict in provinceList"
                      :key="dict.name"
                      :label="dict.name"
                      :value="dict.name"
                    ></el-option>
                  </el-select>
                  <el-select v-model="customerDetail.city"  @change="getAreaList" filterable clearable placeholder="请选择城市" style="width:150px;padding-bottom: 5px;">
                    <el-option
                      v-for="dict in cityList"
                      :key="dict.name"
                      :label="dict.name"
                      :value="dict.name"
                    ></el-option>
                  </el-select>
                  <el-select v-model="customerDetail.town" @change="getStreetList" filterable clearable placeholder="请选择区" style="width:150px;padding-bottom: 5px;">
                    <el-option
                      v-for="dict in areaList"
                      :key="dict.name"
                      :label="dict.name"
                      :value="dict.name"
                    ></el-option>
                  </el-select>
                  <el-select v-model="customerDetail.street" filterable clearable placeholder="请选择街道" style="width:150px;padding-bottom: 5px;">
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
            <el-col :span="10">
              <el-form-item label="下单时间:">
                {{ customerDetail.createTime }}
              </el-form-item>
            </el-col>
            <el-col :span="12">
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
          <el-row>
            <el-col :span="10">
              <el-form-item label="商品数量:">
                {{ customerDetail.productNum }}
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="身份证姓名:">
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
              <el-form-item label="买家实付:">
                {{ customerDetail.orderAmount }} (元)
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="身份证号:">
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
          <el-row v-if="customerDetail.buyerWords != null && customerDetail.buyerWords != '' ">
            <el-col :span="10" >
              <el-form-item label="买家留言:">
                {{ customerDetail.buyerWords }}
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="10">
              <el-form-item label="取消原因:"
                v-if="customerDetail.cancelReason != null && customerDetail.cancelReason != '' ">
                {{ customerDetail.cancelReason }}
              </el-form-item>
            </el-col>
            <el-col :span="12" style="text-align: center;margin-left: -15px;">
              <span v-if="customerDetail.editUserInfo == false">
                <el-button
                  style="margin-right: 40px"
                  type="primary"
                  :disabled="saveLoading"
                  @click="updateUserInfo(customerDetail)"
                  >补录信息</el-button
                >
                <el-button
                  style="margin-right: 40px"
                  type="primary"
                  :disabled="saveLoading"
                  @click="pushOrderBusiness(customerDetail)"
                >手动推送</el-button
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
          </el-col>
          </el-row>
        </el-form>
      </el-card>
      <el-card
        v-for="(item, index) in customerDetail.douYinOrderDetails"
        style="padding-left: 0px; margin-top: 12px; background: aliceblue"
        :key="index"
        class="order"
      >
        <el-form label-width="110px">
          <el-form-item label="子订单编号:">
            {{ item.detailsOrderId }}
          </el-form-item>
          <el-form-item label="子订单类型:">
            {{ item.orderType ==0 ? '普通订单' :
              item.orderType ==2 ? '虚拟商品订单':
              item.orderType ==4 ? '平台发码订单':
              item.orderType ==5 ? '商家发码订单' : ''
            }}
          </el-form-item>
          <el-form-item label="子订单状态:">
            {{ item.detailsOrderStatusDesc }}
          </el-form-item>
          <el-form-item label="">
          </el-form-item>
          <el-form-item label="订单发展人:">
            {{ item.fromOrganizationName }} - {{ item.fromUserName }}
            <span v-if="item.fromJobNumber != null && item.fromJobNumber != ''">({{ item.fromJobNumber }})</span>
          </el-form-item>
          <el-form-item label="订单受理人:">
            {{ item.toOrganizationName }} - {{ item.toUserName }}
            <span v-if="item.toJobNumber != null && item.toJobNumber != ''"> ({{ item.toJobNumber }}) </span>
          </el-form-item>

          <el-form-item label="商品名称:">
            {{ item.productName }}
          </el-form-item>
          <el-form-item label="商品图片:">
            <image-preview
              v-if="item.productImg != null"
              :src="item.productImg"
              :width="50"
              :height="50"
            />
          </el-form-item>
          <el-form-item label="商品分类:">
            {{ item.categoryDetail }}
          </el-form-item>
          <el-form-item label="商品规格:">
            {{ item.specs }}
          </el-form-item>
          <el-form-item label="商品标签:">
            {{ item.skuOrderTagUi }}
          </el-form-item>
          <el-form-item label="商品原价:">
            {{ item.goodsPrice }}(元)
          </el-form-item>
          <el-form-item label="商品数量:">
            {{ item.itemNum }}
          </el-form-item>
          <el-form-item label="商品现价:">
            {{ item.originAmount }}(元)
          </el-form-item>
          <el-form-item label="买家实付:">
            {{ item.payAmount }}(元)
          </el-form-item>


          <!-- <el-form-item label="甩单状态:" v-if="item.isForward != 0">
            {{ item.forwardStatusName }}
          </el-form-item> -->

          <!-- <el-form-item label="订单模板:">
            {{ item.productTemplateName }}
          </el-form-item> -->
          <el-form-item label="">
          </el-form-item>
          <el-form-item label="达人UID:">
            {{ item.authorId }}
          </el-form-item>
          <el-form-item label="达人名称:">
            {{ item.authorName }}
          </el-form-item>
          <el-form-item label="下单来源:">
            {{ item.themeTypeDesc }}
          </el-form-item>
          <el-form-item label="直播间ID:">
            {{ item.roomId }}
          </el-form-item>
          <!-- <el-form-item label="C端流量来源:">
            {{ item.cBizDesc }}
          </el-form-item> -->
        </el-form>

        <el-form label-width="110px" style="background: beige;padding: 10px 0px;" v-if="item.appoint!=null">
          <el-row>
            <el-col :span="11">
              <el-form-item label="预约时间:">
                {{ item.appoint.startTime }} - {{ item.appoint.endTime }}
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="联系方式:">
                {{ item.appoint.telNumber }}
                <el-button
                  v-if="
                    item.appoint.telNumber != null &&
                    item.appoint.telNumber != '' &&
                    item.appoint.telNumber != undefined
                  "
                  type="success"
                  @click="toPhone(item.appoint.id,item.appoint.telNumber)"
                  >外 呼</el-button>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-if="item.appoint.userAddress != null && item.appoint.userAddress != '' && item.appoint.userAddress != undefined ">
            <el-col :span="11">
              <el-form-item label="用户地址:">
                {{ item.appoint.userAddress }}
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="11">
              <el-form-item label="归属门店:">
                {{ item.appoint.organizationName }}
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="门店地址:">
                {{ item.appoint.organizationAddress }}
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="11">
              <el-form-item label="营业时间:">
                {{ item.appoint.businessHours }}
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="门店电话:">
                {{ item.appoint.organizationMobile }}
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-if="item.appoint.userId != null && item.appoint.userId != '' ">
            <el-col :span="11">
              <el-form-item label="归属员工:">
                {{ item.appoint.userName }}
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-if="item.appoint.forwardRemark != null && item.appoint.forwardRemark != '' ">
            <el-col :span="11">
              <el-form-item label="甩单备注:">
                {{ item.appoint.forwardRemark }}
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>

      </el-card>

      <el-card
        style="padding-left: 0px; margin-top: 12px; background: aliceblue"
        class="order"
      >
        <el-form label-width="110px">
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
          <el-form-item label="商家备注:" style="margin-top: 10px; width: 100%">
            <el-input
              :disabled="!customerDetail.editRemark"
              style="width: 80%"
              v-model="customerDetail.sellerWords"
              type="textarea"
              placeholder="请输入商家备注信息"
              maxlength="500"
              :autosize="{ minRows: 6 }"
              show-word-limit
            />
          </el-form-item>
          <div style="margin-top: 16px;text-align: center;">
            <span v-if="customerDetail.editRemark == false">

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
                @click="datash(customerDetail)"
                v-hasPermi="['system:order:datash']"
                v-if="
                  customerDetail.auditingStatus == 1 &&
                  customerDetail.orderStatus == 105
                "
                >发货前审核</el-button
              >
              <el-button
                style="margin-right: 40px"
                type="primary"
                v-loading="saveLoading"
                :disabled="saveLoading"
                @click="datafh(customerDetail)"
                v-hasPermi="['system:order:datafh']"
                v-if="customerDetail.orderStatus == 2 && customerDetail.orderType == 0"
                >发 货</el-button
              >
              <!-- v-hasPermi="['system:order:writeOff']" -->
              <el-button
                style="margin-right: 40px"
                type="primary"
                v-loading="saveLoading"
                :disabled="saveLoading"
                @click="hxopen = true;shopId = customerDetail.shopId;orderType=customerDetail.orderType;certNo = queryParams.coupon"
                v-if="customerDetail.orderStatus == 3 && (customerDetail.orderType == 4 || customerDetail.orderType == 5)"
                >卡券核销</el-button
              >

              <el-button
                style="margin-right: 40px"
                type="primary"
                v-loading="saveLoading"
                :disabled="saveLoading"
                v-if="customerDetail.orderStatus == 3 && customerDetail.orderType != 4 && customerDetail.orderType != 5"
                >已发货</el-button
              >

              <el-button
                style="margin-right: 40px"
                type="primary"
                v-loading="saveLoading"
                :disabled="saveLoading"
                v-if="customerDetail.orderStatus == 5 && (customerDetail.orderType == 4 || customerDetail.orderType == 5)"
                >已核销</el-button
              >

              <el-button
                style="margin-right: 40px"
                type="primary"
                v-loading="saveLoading"
                :disabled="saveLoading"
                @click="datadzf(customerDetail)"
                v-hasPermi="['system:order:datadzf']"
                v-if="customerDetail.orderStatus == 1"
              >取消待支付</el-button
              >
              <el-button
                style="margin-right: 40px"
                type="warning"
                :disabled="saveLoading"
                @click="updateRemarkOrder(customerDetail)"
                >商家备注</el-button
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
          v-model="sellerWords"
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

    <!--操作操作记录列表-->
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

    <!--操作操作记录列表-->
    <el-dialog
      title="订单推送记录"
      :visible.sync="openPushOrderLog"
      width="700px"
      append-to-body
      :close-on-click-modal="false"
      :show-close="true"
      @close="closeModuleLog"
    >
      <div class="block">
        <el-timeline>
          <el-timeline-item
            v-for="(log, index) in openPushOrderLogList"
            :key="index"
            :timestamp="parseTime(log.create_time, '{y}-{m}-{d} {h}:{i}:{s}')"
            placement="top"
          >
            <el-card style="width: 550px">
              <h4>{{ log.msg }}</h4>
              <p>已推送订单到【{{log.grant_name_type == 1?'内蒙':'其他'}}】业务系统</p>
            </el-card>
          </el-timeline-item>
        </el-timeline>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closePushOrderLog">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  listOrder,
  getOrder,
  delOrder,
  synchronousctOrder,
  datajm,
  dataSh,
  dataFh,
  selectExpressList,
  cancelOrder,
  writeOff,
  listOrderData,
  listOrderDetailsData,
  forwardUser,
  updateRemarkOrder,
  updateSellerWords,
  updateToOrgId,
  goManualJm,
  goSendSms,
  orderLogList,
  pustOrderLogList,
  updateUserInfo,
  getDataJmNoNum,
  pushOrderBusiness
} from "@/api/system/douyinOrder/order";
import { listAll } from '@/api/system/douyinShop/shop';
import qrCode from "@/components/tweet/qrCode";
import {
  organizationUser,
  manageUserOrganization,
} from "../../../api/system/production/tweet";
import {  addressList } from "@/api/system/address/index";
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
      //推送轨迹
      openPushOrderLogList:[],
      openPushOrderLog:false,
      //操作记录
      moduleLogList: [],
      openModuleLog: false,
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
      auditingStatuss: [
        {
          value: 1,
          label: "待审核",
        },
        {
          value: 0,
          label: "审核通过",
        },
        {
          value: 200001,
          label: "下单身份信息180天内在该卡品运营商处重复下单，未通过审核",
        },
        {
          value: 200002,
          label: "下单身份信息已在该卡品运营商处办理了5张电话卡，未通过审核",
        },
        {
          value: 200003,
          label: "下单身份信息年龄不在16-60岁（部分卡品16-30岁），未通过审核",
        },
        {
          value: 200004,
          label: "下单地址为该卡品运营商禁售地区，未通过审核",
        },
        {
          value: 200005,
          label: "因其他原因，未能通过运营商审核，具体可联系商家",
        },
      ],
      orderType:'',
      bzopen: false,
      hxopen:false,
      certNo:'',
      sellerWords: "",
      searchType: this.$route.query.searchType,
      expressDh: "",
      ywuliu: false,
      expressType: "",
      expressCode: "",
      expressList: [],
      fhopen: false,
      orderZjId: "",
      orderId: "",
      shopen: false,
      auditingStatus: "",
      shopList: "",
      shopId: "",
      startTime: "",
      endTime: "",
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
        orderStatus: null,
        orderStatus2:'',
        orderStatusDesc: null,
        cancelReason: null,
        buyerWords: null,
        mmPostReceiver: null,
        mmMaskPostTel: null,
        auditingStatus: null,
        productName: null,
        detailsOrderStatusDesc: null,
        authorId: null,
        authorName: null,
        coupon:null
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
      sdSearchValue: '',
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
    //获取纳管组织
    getManageUserOrganization() {
      manageUserOrganization().then((response) => {
        this.organizationListDefault = response.data;
      });
    },
    /** 同步商品 */
    synchronous() {
      this.reset();
      this.open = true;
      this.title = "同步抖店订单";
      let a = {};
      listAll(a).then((response) => {
        this.shopList = response.rows;
      });
    },
    /** 查询抖音订单列表 */
    getList() {
      this.loading = true;
      listOrderData(this.addDateRange(this.queryParams, this.dateRange)).then(
        (response) => {
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
        shopId: null,
        shopName: null,
        orderId: null,
        orderStatus: null,
        orderStatusDesc: null,
        createTime: null,
        updateTime: null,
        cancelReason: null,
        buyerWords: null,
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
      this.open = true;
      this.title = "添加抖音订单";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids;
      getOrder(id).then((response) => {
        this.form = response.data;
        this.open = true;
        this.title = "修改抖音订单";
      });
    },
    /** 提交按钮 */
    submitForm() {
      if (this.shopId == null || this.shopId == "") {
        this.$modal.msgError("请选择需要同步的店铺");
        return;
      }
      if (this.startTime == null || this.startTime == "") {
        this.$modal.msgError("请选择同步订单的开始时间");
        return;
      }
      if (this.endTime == null || this.endTime == "") {
        this.$modal.msgError("请选择同步订单的结束时间");
        return;
      }

      this.loading = true;
      this.open = false;
      let aa = {
        shopId: this.shopId,
        startTime: this.startTime,
        endTime: this.endTime,
      };
      synchronousctOrder(aa).then((response) => {
        this.loading = false;
        this.getList();
        this.$modal.msgSuccess("同步成功");
      });
    },
    /** 备注 */
    databz(row) {
      this.reset();
      this.bzopen = true;
      this.orderId = row.orderId;
      this.shopId = row.shopId;
      this.orderZjId = row.id;
    },
    submitFormBz() {
      if (this.orderId == null || this.orderId == "") {
        this.$modal.msgError("订单id不能为空");
        return;
      }

      if (this.sellerWords == null || this.sellerWords == "") {
        this.$modal.msgError("备注不能为空");
        return;
      }

      let aa = {
        id: this.orderZjId,
        shopId: this.shopId,
        orderId: this.orderId,
        sellerWords: this.sellerWords,
      };
      updateSellerWords(aa).then((response) => {
        this.getList();
        this.orderId = "";
        this.bzopen = false;
        this.orderZjId = "";
        this.sellerWords = "";
        this.$modal.msgSuccess("备注成功");
      });
    },
    pushOrderBusiness(row){
      const id = row.id || this.ids
      let datas = {"id":id}
      this.$modal.confirm('是否推送当前订单到业务系统？').then(function() {
        return pushOrderBusiness(datas);
      }).then(() => {
        this.$modal.msgSuccess("推送完成，在推送记录查看推送状态");
      }).catch(() => {});
    },
    /** 解密 */
    datajm(row) {
      this.reset();
      const id = row.id || this.ids
      const shopId = row.shopId
      let datas = {"id":id,shopId:shopId,"organizationId":sessionStorage.getItem('organizationId')}

      //先查询是否存在当天解密额度用完情况
      getDataJmNoNum(datas).then((response) => {
        if(response.data == 1){
          this.$modal.confirm('该店铺当天解密额度已用完，确认申请解密额度后解密！').then(function() {
            return ;
          }).then(() => {
            this.jiemi(datas);
          }).catch(() => {});
        }else{
          this.jiemi(datas);
        }
      });
    },
    jiemi(datas){
      this.$modal.confirm('是否确认解密当前数据项？').then(function() {
        return datajm(datas);
      }).then(() => {
        if(this.openOrder){
          //修改详情页的解密数据
          getOrder(id).then(response => {
            this.customerDetail.mmEncryptIdCardName = response.data.mmEncryptIdCardName;
            this.customerDetail.mmEncryptIdCardNo = response.data.mmEncryptIdCardNo;
            this.customerDetail.mmPostReceiver = response.data.mmPostReceiver;
            this.customerDetail.mmMaskPostTel = response.data.mmMaskPostTel;
            this.customerDetail.mmAddrDetail = response.data.mmAddrDetail;
          });
        }else{
          this.getList();
        }
        this.$modal.msgSuccess("解密完成");
      }).catch(() => {});
    },

    /** 审核 */
    datash(row) {
      this.reset();
      this.orderId = row.id || this.ids;
      this.shopen = true;
    },
    /** 审核提交按钮 */
    submitFormSh() {
      if (this.auditingStatus == null || this.auditingStatus == "") {
        this.$modal.msgError("请选择审核结果");
        return;
      }
      this.loading = true;
      this.shopen = false;
      let aa = {
        id: this.orderId,
        auditingStatus: this.auditingStatus,
      };
      dataSh(aa).then((response) => {
        this.loading = false;
        if(this.openOrder){
          if(this.auditingStatus=="0"){
            this.customerDetail.orderStatus = 2
            this.customerDetail.orderStatusDesc = "待发货"
            this.customerDetail.douYinOrderDetails.forEach(item => {
              item.detailsOrderStatusDesc = "待发货"
            })
          }
        }else{
          this.getList();
        }
        this.$modal.msgSuccess("审核成功");
      });
    },
    /** 发货 */
    datafh(row) {
      this.fhopen = true;
      this.orderId = row.id || this.ids;
      selectExpressList().then((response) => {
        this.expressList = response.rows;
      });
    },
    /** 取消待支付 */
    datadzf(row) {
      this.$modal
        .confirm(
          '是否确认取消待支付抖音订单编号为"' + row.orderId + '"的数据项？'
        )
        .then(function () {
          let d = {
            shopId: row.shopId,
            orderId: row.orderId,
          };
          return cancelOrder(d);
        })
        .then(() => {
          if(this.openOrder){
            this.customerDetail.orderStatus = 4
            this.customerDetail.orderStatusDesc = "已取消"
            this.customerDetail.douYinOrderDetails.forEach(item => {
              item.detailsOrderStatusDesc = "已取消"
            })
          }else{
            this.getList();
          }
          this.$modal.msgSuccess("取消成功");
        })
        .catch(() => {});
    },
    submitFormHx(){
      if (this.certNo == null || this.certNo == "") {
        this.$modal.msgError("请填写核销码");
        return;
      }

      let datas = {
        shopId: this.shopId,
        certNo: this.certNo,
        orderType:this.orderType,
        id:this.customerDetail.id,
        orderId:this.customerDetail.orderId
      };

      writeOff(datas).then((response) => {
        this.shopId = '';
        this.hxopen = false;
        this.certNo = '';
        this.customerDetail.orderStatus = 5
        this.customerDetail.orderStatusDesc = "已使用"
        this.customerDetail.douYinOrderDetails.forEach(item => {
          item.detailsOrderStatusDesc = "已使用"
        })
        this.$modal.msgSuccess("核销成功");
      });
    },
    submitFormfh() {
      if (this.expressType == null || this.expressType == "") {
        this.$modal.msgError("请选择发货类型");
        return;
      }
      if (this.expressType == 1) {
        if (this.expressCode == null || this.expressCode == "") {
          this.$modal.msgError("请选择快递公司");
          return;
        }
        if (this.expressDh == null || this.expressDh == "") {
          this.$modal.msgError("请选填写快递单号");
          return;
        }
      }
      this.reset();
      let datas = {
        id: this.orderId,
        expressType: this.expressType,
        expressCode: this.expressCode,
        expressDh: this.expressDh,
      };
      dataFh(datas).then((response) => {
        this.fhopen = false;
        if(this.openOrder){
          this.customerDetail.orderStatus = 3
          this.customerDetail.orderStatusDesc = "已发货"
          this.customerDetail.douYinOrderDetails.forEach(item => {
            item.detailsOrderStatusDesc = "已发货"
          })
        }else{
          this.getList();
        }
        this.$modal.msgSuccess("发货成功");
      });

      // this.reset();
      // this.$modal.confirm('是否确认发货当前数订单？').then(function() {
      //   let datas = {"id":this.orderId,"expressType":this.expressType,"expressCode":this.expressCode,"expressDh":this.expressDh}
      //   return dataFh(datas);
      // }).then(() => {
      //   this.fhopen = false;
      //   this.getList();
      //   this.$modal.msgSuccess("发货成功");
      // }).catch(() => {});
    },

    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$modal
        .confirm('是否确认删除抖音订单编号为"' + ids + '"的数据项？')
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
        "system/order/export",
        {
          ...this.addDateRange(queryParamsExport, this.dateRange),
        },
        `抖音订单_${new Date().getTime()}.xlsx`
      );
    },

    //用户操作弹框
    handleOrder(row) {
      this.saveLoading = false;
      row.elements = this.handelCustomerList(row.douYinOrderDetails);
      row.sellerWordsOld = row.sellerWords;
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
    handelCustomerList(response) {
      let elements = [];
      let userId = sessionStorage.getItem("userId");
      let organizationId = sessionStorage.getItem("organizationId");
      response.forEach((item, index) => {
        item.orderStatusOld = item.detailsOrderStatusDesc;
        item.editRemark = false;
        item.editUserInfo = false;
        elements.push(item);
      });
      return elements;
    },
    //关闭订单弹窗
    closeOrder() {
      //刷新订单列表
      this.getList();
      this.customerDetail = {};
      this.openOrder = false;
      this.sellerWords = '';
      this.sellerRemarkStars = '';
      this.areaList = []
      this.cityList  =[]
      this.streetList = []
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

    //甩单
    handleForward(item) {
      console.log("item======",item)
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
      this.detailsId = item.orderId;
      this.sellerWords = this.sellerWords || item?.sellerWords;
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
        douyinOrderId: this.detailsId,
        toOrganizationId: this.toOrganizationId,
        toUserId: this.toUserId,
        sellerWords: this.sellerWords,
        sellerRemarkStars: this.sellerRemarkStars,
      };
      forwardUser(params).then((response) => {
        this.$modal.msgSuccess("甩单成功");
        this.customerDetail.sellerWords = this.sellerWords;
        this.customerDetail.sellerRemarkStars = this.sellerRemarkStars;
        this.closeForward();
      });
    },
    updateRemarkOrder(item) {
      console.log("item===", item);
      item.editRemark = true;
    },
    cancelSubmit(item) {
      item.sellerWords = item.sellerWordsOld;
      item.sellerRemarkStars = item.sellerRemarkStarsOld;
      item.editRemark = false;
    },
    submit(item) {
      this.$modal
        .confirm("确定修改商家备注")
        .then((response) => {
          if (item.sellerRemarkStars !== 0) {
            if(item.sellerRemarkStars == null || item.sellerRemarkStars == ""){
              this.$modal.msgError("订单标记不能为空");
              return;
            }
          }
          if (item.sellerWords == null || item.sellerWords == "") {
            this.$modal.msgError("信息不能为空");
            return;
          }
          this.saveLoading = true;
          let aa = {
            id: item.id,
            shopId: item.shopId,
            orderId: item.orderId,
            sellerWords: item.sellerWords,
            sellerRemarkStars: item.sellerRemarkStars,
          };
          updateSellerWords(aa).then((response) => {
            this.getList();
            item.sellerWordsOld = item.sellerWords;
            item.sellerRemarkStarsOld = item.sellerRemarkStars;
            item.editRemark = false;
            this.saveLoading = false;
            this.$modal.msgSuccess("操作成功");
          });
        })
        .catch((response) => {});
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
    manualJm(isUpdate) {
      const ids = this.ids;
      if(ids.length < 1){
        this.$modal.msgError("请选择需要解密的订单 ");
        return;
      }
      let message = "确定手动解密选择的订单吗？";
      let _this = this
      _this.$modal.confirm(message).then(function() {
        _this.loading = true;
        goManualJm(ids).then((response) => {
          _this.loading = false;
          _this.getList();
          _this.$modal.msgSuccess("操作成功");
        }).catch((response) => {
          _this.loading = false;
        })
      });
    },
    handleSendSms(row) {
      const ids = row.id || this.ids;
      let message = "确定要手动发送短信吗？";
      let _this = this
      _this.$modal.confirm(message).then(function() {
        _this.loading = true;
        goSendSms(ids).then((response) => {
          _this.loading = false;
          _this.getList();
          _this.$modal.msgSuccess("操作成功");
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
      orderLogList({ targetId: row.id }).then((response) => {
        this.moduleLogList = response.rows;
      });
    },
    //关闭操作记录弹窗
    closeModuleLog() {
      this.openModuleLog = false;
      this.moduleLogList = [];
    },
    //推送轨迹
    pushOrderLog(row) {
      this.openPushOrderLog = true;
      pustOrderLogList({ orderId: row.orderId }).then((response) => {
        this.openPushOrderLogList = response.data;
      });
    },
    //关闭推送轨迹弹窗
    closePushOrderLog() {
      this.openPushOrderLog = false;
      this.openPushOrderLogList = [];
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
            id: item.id,
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
