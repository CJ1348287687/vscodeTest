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
      <el-form-item label="商品编码" prop="productId">
        <el-input
          v-model="queryParams.productId"
          placeholder="请输入商品编码"
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
      <el-table-column type="selection" width="55" align="center" />

      <el-table-column label="店铺名称" align="center" prop="shopName" width="120" sortable="custom" :sort-orders="['descending', 'ascending']"/>
      <el-table-column label="订单编号" align="center" prop="orderId" width="180" sortable="custom" :sort-orders="['descending', 'ascending']"/>
      <el-table-column label="子订单编号" align="center" prop="detailsOrderId" width="180" sortable="custom" :sort-orders="['descending', 'ascending']"/>
      <el-table-column label="子订单状态" align="center" prop="detailsOrderStatusDesc" width="120" sortable="custom" :sort-orders="['descending', 'ascending']"/>
      <el-table-column label="子订单类型" align="center" prop="orderType" width="130" sortable="custom" :sort-orders="['descending', 'ascending']">
        <template slot-scope="scope">
          {{
            scope.row.detailsOrderType == '0' ? '普通订单' : 
            scope.row.detailsOrderType == '2' ? '虚拟商品订单' : 
            scope.row.detailsOrderType == '4' ? '平台发码订单' : 
            scope.row.detailsOrderType == '5' ? '商家发码订单' : ''}}
        </template>
      </el-table-column>
      <el-table-column label="下单时间" align="center" prop="createTime" width="180" sortable="custom" :sort-orders="['descending', 'ascending']">
        <template slot-scope="scope">
          <span>{{
            parseTime(scope.row.detailsCreateTime, "{y}-{m}-{d} {h}:{i}:{s}")
          }}</span>
        </template>
      </el-table-column>
      <el-table-column label="商品编码" align="center" prop="productId" width="180" sortable="custom" :sort-orders="['descending', 'ascending']"/>
      <el-table-column label="商品标题" align="center" prop="productName" width="300" sortable="custom" :sort-orders="['descending', 'ascending']"/>
      <el-table-column label="商品图片" align="center" width="80">
        <template slot-scope="scope">
          <image-preview v-if="scope.row.productImg != null" :src="scope.row.productImg" :width="50" :height="50"/>
        </template>
      </el-table-column>
      <el-table-column label="商品规格" align="center" prop="specs" width="200" sortable="custom" :sort-orders="['descending', 'ascending']"/>
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
      <!-- <el-table-column label="是否解密" align="center" prop="jsStatus" width="80" >
        <template slot-scope="{ row }">
          <span v-if="row.jsStatus == 1">是</span>
          <span v-if="row.jsStatus == 0">否</span>
        </template>
      </el-table-column> -->
      <!-- <el-table-column label="C端流量来源" align="center" prop="cBizDesc" width="150" /> -->
      <el-table-column label="下单来源" align="center" prop="themeTypeDesc" width="150" sortable="custom" :sort-orders="['descending', 'ascending']"/>
      <el-table-column label="直播间ID" align="center" prop="roomId" width="180" sortable="custom" :sort-orders="['descending', 'ascending']"/>
      <el-table-column label="达人UID" align="center" prop="authorId" width="150" sortable="custom" :sort-orders="['descending', 'ascending']"/>
      <el-table-column label="达人名称" align="center" prop="authorName" width="150" sortable="custom" :sort-orders="['descending', 'ascending']"/>
      <el-table-column label="订单发展人" align="center" width="150" prop="fromusername" sortable="custom" :sort-orders="['descending', 'ascending']">
        <template slot-scope="scop">
          <span v-if="scop.row.fromOrganizationId != null">
            {{ scop.row.fromOrganizationName }} - {{ scop.row.fromUserName }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="订单受理人" align="center" width="150" prop="tousername" sortable="custom" :sort-orders="['descending', 'ascending']">
        <template slot-scope="scope">
          <span v-if="scope.row.toOrganizationId != null">
            {{ scope.row.toOrganizationName }} - {{ scope.row.toUserName }}
          </span>
        </template>
      </el-table-column>
      
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
      <el-table-column label="取消原因" align="center" prop="cancelReason" width="120"/>
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
    
  </div>
</template>

<script>
import { getOrder ,synchronousctOrder, datajm, selectExpressList, listOrderDetailsAllData, updateToOrgId} from "@/api/system/douyinOrder/order";
import { listAll } from '@/api/system/douyinShop/shop';

export default {
  name: "Order",
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
      searchType: this.$route.query.searchType,
      //同步订单数据
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
        detailsOrderId:null,
        orderStatus: null,
        orderStatus2:null,
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
        productId:null,
        productName:null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {},
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 排序触发事件 */
    handleSortChange(column, prop, order) {
      this.queryParams.pageNum = 1;
      this.queryParams.orderByColumn = column.prop;
      this.queryParams.isAsc = column.order;
      this.getList();
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
      listOrderDetailsAllData(this.addDateRange(this.queryParams, this.dateRange)).then(
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
      this.ids = selection.map((item) => item.detailsId);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
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
    /** 解密 */
    datajm(row) {
      this.reset();
      const id = row.id || this.ids
      this.$modal.confirm('是否确认解密当前数据项？').then(function() {
        let datas = {"id":id}
        return datajm(datas);
      }).then(() => {
        //修改详情页的解密数据
        getOrder(id).then(response => {
          row.mmEncryptIdCardName = response.data.mmEncryptIdCardName;
          row.mmEncryptIdCardNo = response.data.mmEncryptIdCardNo;
          row.mmPostReceiver = response.data.mmPostReceiver;
          row.mmMaskPostTel = response.data.mmMaskPostTel;
          row.mmAddrDetail = response.data.mmAddrDetail;
        });
        this.$modal.msgSuccess("解密完成");
      }).catch(() => {});
    },

    /** 导出按钮操作 */
    handleExport() {
      let queryParamsExport = JSON.parse(JSON.stringify(this.queryParams));
      queryParamsExport.detailsIds  = this.ids
      this.download(
        "system/order/export",
        {
          ...this.addDateRange(queryParamsExport, this.dateRange),
        },
        `抖音订单_${new Date().getTime()}.xlsx`
      );
    },

    handleSyncOrderAccept(isUpdate) {
      let queryParamsSync = JSON.parse(JSON.stringify(this.queryParams));
      queryParamsSync.detailsIds  = this.ids
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
}
</style>




