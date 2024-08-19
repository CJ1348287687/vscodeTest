<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="130px" >
      <el-form-item label="店铺名称" prop="shopName">
        <el-input
          v-model="queryParams.shopName"
          placeholder="请输入店铺名称"
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
      <el-form-item label="商品标题" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入商品标题"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="商品类型" prop="productTypeAfter">
        <el-select
          v-model="queryParams.productTypeAfter"
          placeholder="请选择商品类型"
          clearable
        >
          <el-option
            v-for="dict in productTypes"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select
          v-model="queryParams.status"
          placeholder="请选择状态"
          clearable
        >
          <el-option
            v-for="dict in statuss"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="审核状态" prop="checkStatus">
        <el-select
          v-model="queryParams.checkStatus"
          placeholder="请选择审核状态"
          clearable
        >
          <el-option
            v-for="dict in checkStatuss"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="是否配置组织关系" prop="toOrganizationIdIsNull">
        <el-radio-group v-model="queryParams.toOrganizationIdIsNull">
          <el-radio label='0' style="margin-right: 10px;">否</el-radio>
          <el-radio label='1' style="margin-right: 10px;">是</el-radio>
          <el-radio label='' style="margin-right: 10px;">无</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="归属组织" prop="organizationName">
        <el-input
          v-model="queryParams.organizationName"
          placeholder="请输入归属组织"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>


      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery" >搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery" >重置</el-button>
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
          v-hasPermi="['system:product:synchronous']" >
          同步抖店商品</el-button>
          <el-button
          type="primary"
          plain
          icon="el-icon-document"
          :disabled="!ids.length"
          size="mini"
          @click="zzgxBatch"
          v-hasPermi="['system:product:addOrganization']" >
          组织关系</el-button>
          <el-button
          type="primary"
          plain
          icon="el-icon-setting"
          :disabled="!ids.length"
          size="mini"
          @click="clpzBatch">
          策略配置</el-button>
          <el-button
          type="primary"
          plain
          icon="el-icon-setting"
          :disabled="!ids.length"
          size="mini"
          @click="handleSyncOrderAcceptBatch(scope,0)">
          增量同步订单</el-button>
          <el-button
          type="primary"
          plain
          icon="el-icon-setting"
          :disabled="!ids.length"
          size="mini"
          @click="handleSyncOrderAcceptBatch(scope ,1)">
          全量同步订单</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch"  @queryTable="getList" ></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="productList" @selection-change="handleSelectionChange" @sort-change="handleSortChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="店铺名称" align="center" prop="shopName" width="120" sortable="custom" :sort-orders="['descending', 'ascending']"/>
      <el-table-column label="商品编码" align="center" prop="productId" width="180" sortable="custom" :sort-orders="['descending', 'ascending']"/>
      <el-table-column label="商品图片" align="center" prop="img" width="80">
        <template slot-scope="scope">
          <image-preview v-if="scope.row.img != null" :src="scope.row.img" :width="50" :height="50" />
        </template>
      </el-table-column>
      <el-table-column label="商品标题" align="center" prop="name" width="300" sortable="custom" :sort-orders="['descending', 'ascending']"/>
      <el-table-column label="商品类型" align="center" width="100" prop="productType" sortable="custom" :sort-orders="['descending', 'ascending']">
        <template slot-scope="{ row }">
          <!-- 提取方式新字段，推荐使用。0: 普通商品-使用物流发货, 1: 虚拟商品-无需物流与电子交易凭证, 2: 虚拟商品-使用电子交易凭证,  3: 虚拟商品-充值直连 -->
          <span v-if="row.productType == 0">普通商品</span>
          <span v-if="row.productType == 1">新客商品</span>
          <span v-if="row.productType == 3 && row.pickupMethod == '1'">虚拟商品</span>
          <span v-if="row.productType == 3 && row.pickupMethod == '2'">卡券商品</span>
          <span v-if="row.productType == 3 && row.pickupMethod == '3'">充值直连</span>
          <span v-if="row.productType == 6">玉石闪购</span>
          <span v-if="row.productType == 7">云闪购</span>
          <span v-if="row.productType == 127">其他类型</span>
        </template>
      </el-table-column>
      <el-table-column label="商品分类" align="center" prop="categoryDetail" width="260" sortable="custom" :sort-orders="['descending', 'ascending']"/>
      <el-table-column label="状态" align="center" prop="status" width="100" sortable="custom" :sort-orders="['descending', 'ascending']">
        <template slot-scope="{ row }">
          <span v-if="row.status == 2">删除</span>
          <span v-if="row.status == 1 || (row.checkStatus != 3 && row.status == 0)">下线</span>
          <span v-if="row.status == 0 && row.checkStatus == 3">在线</span>
        </template>
      </el-table-column>
      <el-table-column label="审核状态" align="center" prop="checkStatus" width="100" sortable="custom" :sort-orders="['descending', 'ascending']">
        <template slot-scope="{ row }">
          <span v-if="row.checkStatus == 7">审核通过待上架</span>
          <span v-if="row.checkStatus == 5">封禁</span>
          <span v-if="row.checkStatus == 4">审核未通过</span>
          <span v-if="row.checkStatus == 3">审核通过</span>
          <span v-if="row.checkStatus == 2">待审核</span>
          <span v-if="row.checkStatus == 1">未提交</span>
        </template>
      </el-table-column>
      <el-table-column label="销量" align="center" prop="sellNum" width="80"/>
      <el-table-column label="创建时间" align="center" prop="createTime" width="180" sortable="custom" :sort-orders="['descending', 'ascending']" />
      <el-table-column label="同步时间" align="center" prop="synchronousTime" width="100" sortable="custom" :sort-orders="['descending', 'ascending']">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.synchronousTime, "{y}-{m}-{d}") }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column label="归属店铺" align="center" prop="shopName" /> -->
      <el-table-column label="归属组织" align="center" prop="organizationName" width="150" sortable="custom" :sort-orders="['descending', 'ascending']"/>
      <el-table-column label="订单量" align="center" prop="orderDetailsCount" width="100">
        <template #default="scope">
          <el-button size="mini" type="text"
              @click="handleOrderDetailsList(scope.row)" >
              {{ scope.row.orderDetailsCount }}</el-button>
        </template>
      </el-table-column>
      <el-table-column label="售后订单量" align="center" prop="returnOrderDetailsCount" width="100">
        <template #default="scope">
          <el-button size="mini" type="text"
              @click="handleReturnOrderDetailsList(scope.row)" >
              {{ scope.row.returnOrderDetailsCount }}</el-button>
        </template>
      </el-table-column>
      <el-table-column
        v-if="searchType == 'org'"
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
        width="200"
        fixed="right"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-document"
            @click="handleOrganizationList(scope.row)"
            v-hasPermi="['system:product:addOrganization']"
            >组织关系</el-button
          >
          <el-button
            v-if="scope.row.organizationId != null"
            size="mini"
            type="text"
            icon="el-icon-setting"
            @click="handleElemTactic(scope.row)"
            >策略配置</el-button
          >
          <el-button
            v-if="scope.row.organizationId != null && scope.row.toOrganizationId != null"
            size="mini"
            type="text"
            icon="el-icon-setting"
            @click="handleSyncOrderAccept(scope.row,0)"
            >增量同步订单</el-button
          >
          <el-button
            v-if="scope.row.organizationId != null && scope.row.toOrganizationId != null"
            size="mini"
            type="text"
            icon="el-icon-setting"
            @click="handleSyncOrderAccept(scope.row,1)"
            >全量同步订单</el-button
          >
          <el-button
            v-if="scope.row.productType == 3 && scope.row.pickupMethod == '2'"
            size="mini"
            type="text"
            icon="el-icon-document"
            @click="mbopen = true;productId = scope.row.id;productTemplate = scope.row.couponTemplate+''"
          >券码模板</el-button>
          <el-button
            v-if="scope.row.productType == 3 && scope.row.pickupMethod == '2'"
            size="mini"
            type="text"
            icon="el-icon-document"
            @click="ordergrant(scope.row)"
          >订单推送配置</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-document"
            @click="toFlPz(scope.row)"
          >商品分类配置</el-button>
<!--          <el-button-->
<!--            v-if="scope.row.productType == 3 && scope.row.pickupMethod == '2'"-->
<!--            size="mini"-->
<!--            type="text"-->
<!--            icon="el-icon-document"-->
<!--            @click="mbopen = true;productId = scope.row.id;productTemplate = scope.row.couponTemplate+''"-->
<!--          >券码模板</el-button>-->
<!--          <el-button-->
<!--            size="mini"-->
<!--            type="text"-->
<!--            icon="el-icon-document"-->
<!--            @click="handleSmsTemplateList(scope.row)"-->
<!--          >短信模版</el-button>-->

<!--          <el-button
            size="mini"
            type="text"
            icon="el-icon-document"
            @click="handleOption(scope.row)"
          >评价列表</el-button>-->
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

    <!-- 添加或修改抖音商品对话框 -->
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
        <!--        <el-form-item label="同步到社区化平台时间" prop="synchronousTime">-->
        <!--          <el-date-picker clearable-->
        <!--            v-model="form.synchronousTime"-->
        <!--            type="date"-->
        <!--            value-format="yyyy-MM-dd"-->
        <!--            placeholder="请选择同步到社区化平台时间">-->
        <!--          </el-date-picker>-->
        <!--        </el-form-item>-->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <!--    待选组织关系列表-->
    <el-dialog
      title="待选组织关系列表"
      :visible.sync="organizationUnallocated.open"
      class="dsgxDialog"
      width="55%"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      @close="organizationClose"
    >
      <el-form
        :model="organizationUnallocated.queryParams"
        ref="organizationUnallocatedQueryForm"
        size="small"
        :inline="true"
      >
        <el-row>
          <el-col>
            <el-form-item label="组织编号" prop="organizationId">
              <el-input-number
                v-model="organizationUnallocated.queryParams.organizationId"
                :min="1"
                clearable
                :controls="false"
                placeholder="请输入组织编号"
              ></el-input-number>
            </el-form-item>
            <el-form-item label="组织名称" prop="organizationName">
              <el-input
                v-model="organizationUnallocated.queryParams.organizationName"
                placeholder="请输入组织名称"
                clearable
              />
            </el-form-item>
            <el-form-item>
              <el-button
                type="primary"
                icon="el-icon-search"
                size="mini"
                @click="handleQueryOrganization"
                >搜索</el-button
              >
              <el-button
                icon="el-icon-refresh"
                size="mini"
                @click="resetQueryOrganization"
                >重置</el-button
              >
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-table
        ref="organizationUnallocatedTable"
        v-loading="loading"
        :data="organizationUnallocated.list"
        :row-key="getRowKeys"
        @selection-change="handleSelectionChangeOrganization"
        height="440"
      >
        <el-table-column
          type="selection"
          width="55"
          align="center"
        ></el-table-column>
        <el-table-column
          label="组织编号"
          prop="organizationId"
          width="100"
          align="center"
        />
        <el-table-column
          label="组织名称"
          prop="organizationName"
          width="250"
          align="center"
        />
        <el-table-column
          label="所属部门"
          prop="dept.deptName"
          align="center"
        />
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="organizationClose">取 消</el-button>
        <el-button type="primary" @click="submitOrganization">添加</el-button>
      </span>
    </el-dialog>

    <!--    待选短信模板列表-->
    <el-dialog
      title="待选短信模板列表"
      :visible.sync="smsTemplateUnallocated.open"
      class="dsgxDialog"
      width="55%"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      @close="smsTemplateClose"
    >
      <el-form
        :model="smsTemplateUnallocated.queryParams"
        ref="smsTemplateUnallocatedQueryForm"
        size="small"
        :inline="true"
      >
        <el-row>
          <el-col>
            <el-form-item label="短信模板名称" prop="templateName">
              <el-input
                v-model="smsTemplateUnallocated.queryParams.templateName"
                placeholder="请输入短信模板名称"
                clearable
              />
            </el-form-item>
            <el-form-item>
              <el-button
                type="primary"
                icon="el-icon-search"
                size="mini"
                @click="handleQuerySmsTemplate"
              >搜索</el-button
              >
              <el-button
                icon="el-icon-refresh"
                size="mini"
                @click="resetQuerySmsTemplate"
              >重置</el-button
              >
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-table
        ref="smsTemplateUnallocatedTable"
        v-loading="loading"
        :data="smsTemplateUnallocated.list"
        :row-key="getSmsTemplateRowKeys"
        @selection-change="handleSelectionChangeSmsTemplate"
        height="440"
      >
        <el-table-column
          type="selection"
          width="55"
          align="center"
        ></el-table-column>
        <el-table-column
          label="模板名称"
          prop="templateName"
          width="200"
          align="center"
        />
<!--        <el-table-column-->
<!--          label="短信模板"-->
<!--          prop="smsTemplate"-->
<!--          width="200"-->
<!--          align="center"-->
<!--        />-->
<!--        <el-table-column-->
<!--          label="发送短信状态"-->
<!--          prop="sendStatus"-->
<!--          width="150"-->
<!--          align="center"-->
<!--        />-->
        <el-table-column
          label="链接"
          prop="link"
          width="250"
          align="center"
        />
        <el-table-column
          label="公司名称"
          prop="companyName"
          width="200"
          align="center"
        />
        <el-table-column
          label="电话号码"
          prop="phone"
          width="200"
          align="center"
        />
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="smsTemplateClose">取 消</el-button>
        <el-button type="primary" @click="submitSmsTemplate">添加</el-button>
      </span>
    </el-dialog>

    <!-- 策略配置 -->
    <div v-if="tacticsVisible">
      <tacticsDialog
        :visible="tacticsVisible"
        :setVisible="setTacticsVisible"
        :tacticsRow="tacticsRow"
        :resetFn="resetFn"
        :ids="ids"
        :isBatch="isBatch"
        :organizationTreeData="organizationTreeData"
      />
    </div>

    <!-- 订单列表 -->
    <el-dialog title="订单列表" :visible.sync="openOrder" width="1250px" append-to-body :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false">
      <el-form :model="queryParamsOrder" ref="queryFormOrder" size="small" :inline="true" v-show="showSearchOrder" label-width="100px">
        <el-form-item label="订单编号" prop="orderId">
          <el-input
            v-model="queryParamsOrder.orderId"
            placeholder="请输入订单编号"
            clearable
            @keyup.enter.native="handleQueryOrder"
          />
        </el-form-item>
        <el-form-item label="子订单编号" prop="detailsOrderId">
					<el-input
						v-model="queryParamsOrder.detailsOrderId"
						placeholder="请输入子订单编号"
						clearable
						@keyup.enter.native="handleQueryOrder"
					/>
				</el-form-item>
        <el-form-item label="下单时间">
          <el-date-picker
            v-model="dateRangeOrder"
            style="width: 250px"
            value-format="yyyy-MM-dd HH:mm:ss"
            type="daterange"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :default-time="['00:00:00', '23:59:59']"
          ></el-date-picker>
        </el-form-item>
        <!-- <el-form-item label="子订单状态" prop="detailsOrderStatusDesc">
          <el-input
            v-model="queryParamsOrder.detailsOrderStatusDesc"
            placeholder="请输入子订单状态"
            clearable
            @keyup.enter.native="handleQueryOrder"
          />
        </el-form-item> -->
        <el-form-item label="订单状态" prop="orderStatus2">
          <el-select
            v-model="queryParamsOrder.orderStatus2"
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
            v-model="queryParamsOrder.buyerWords"
            placeholder="请输入买家留言"
            clearable
            @keyup.enter.native="handleQueryOrder"
          />
        </el-form-item>

        <el-form-item label="达人UID" prop="authorId">
          <el-input
            v-model="queryParamsOrder.authorId"
            placeholder="请输入达人UID"
            clearable
            @keyup.enter.native="handleQueryOrder"
          />
        </el-form-item>
        <el-form-item label="达人名称" prop="authorName">
          <el-input
            v-model="queryParamsOrder.authorName"
            placeholder="请输入达人名称"
            clearable
            @keyup.enter.native="handleQueryOrder"
          />
        </el-form-item>

        <el-form-item label="收件人姓名" prop="mmPostReceiver">
          <el-input
            v-model="queryParamsOrder.mmPostReceiver"
            placeholder="请输入收件人姓名"
            clearable
            @keyup.enter.native="handleQueryOrder"
          />
        </el-form-item>
        <el-form-item label="收件人手机" prop="mmMaskPostTel">
          <el-input
            v-model="queryParamsOrder.mmMaskPostTel"
            placeholder="请输入收件人手机"
            clearable
            @keyup.enter.native="handleQueryOrder"
          />
        </el-form-item>
        <!-- <el-form-item label="发货审核状态" prop="auditingStatus">
          <el-select
            v-model="queryParamsOrder.auditingStatus"
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
					<el-button type="primary" icon="el-icon-search" size="mini" @click="handleQueryOrder">搜索</el-button>
					<el-button icon="el-icon-refresh" size="mini" @click="resetQueryOrder">重置</el-button>
          <el-button
            type="warning"
            plain
            icon="el-icon-download"
            size="mini"
            @click="handleExportOrder"
            v-hasPermi="['system:order:export']"
          >导出</el-button>
				</el-form-item>
			</el-form>

			<el-table v-loading="loadingOrder" :data="orderList" @sort-change="handleSortChangeOrder">
        <el-table-column label="序号" type="index" align="center" width="100">
          <template slot-scope="scope">
            <span>{{(queryParamsOrder.pageNum - 1) * queryParamsOrder.pageSize + scope.$index + 1}}</span>
          </template>
        </el-table-column>
        <el-table-column label="店铺名称" align="center" prop="shopName" width="120" sortable="custom" :sort-orders="['descending', 'ascending']"/>
        <el-table-column label="订单编号" align="center" prop="orderId" width="180" sortable="custom" :sort-orders="['descending', 'ascending']"/>
        <el-table-column label="子订单编号" align="center" prop="detailsOrderId" width="180" sortable="custom" :sort-orders="['descending', 'ascending']"/>
        <el-table-column label="下单时间" align="center" prop="createTime" width="180" sortable="custom" :sort-orders="['descending', 'ascending']">
          <template slot-scope="scope">
            <span>{{
              parseTime(scope.row.createTime, "{y}-{m}-{d} {h}:{i}:{s}")
            }}</span>
          </template>
        </el-table-column>
        <el-table-column label="子订单类型" align="center" prop="det.orderType" width="130" sortable="custom" :sort-orders="['descending', 'ascending']">
          <template slot-scope="scope">
            {{
              scope.row.detailsOrderType == '0' ? '普通订单' :
              scope.row.detailsOrderType == '2' ? '虚拟商品订单' :
              scope.row.detailsOrderType == '4' ? '平台发码订单' :
              scope.row.detailsOrderType == '5' ? '商家发码订单' : ''}}
          </template>
        </el-table-column>
        <el-table-column label="子订单状态" align="center" prop="detailsOrderStatusDesc" width="120" sortable="custom" :sort-orders="['descending', 'ascending']"/>
        <!-- <el-table-column label="订单应付金额" align="center" prop="orderAmount" width="100"/> -->
        <!-- <el-table-column label="优惠总金额" align="center" prop="promotionAmount" width="90"/> -->

        <el-table-column label="商品编码" align="center" prop="productId" width="180" />
        <el-table-column label="商品标题" align="center" prop="productName" width="300" />
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
        <el-table-column label="省市区" align="center" width="180">
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
				v-show="totalOrder>0"
				:total="totalOrder"
				:page.sync="queryParamsOrder.pageNum"
				:limit.sync="queryParamsOrder.pageSize"
				@pagination="getOrderList"
			/>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelOrder">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 售后订单列表 -->
    <el-dialog title="售后订单列表" :visible.sync="openReturnOrder" width="1250px" append-to-body :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false">
      <el-form :model="queryParamsReturnOrder" ref="queryFormReturnOrder" size="small" :inline="true" v-show="showSearchReturnOrder" label-width="100px">
        <el-form-item label="原订单编号" prop="shopOrderId">
          <el-input
            v-model="queryParamsReturnOrder.shopOrderId"
            placeholder="请输入原订单编号"
            clearable
            @keyup.enter.native="handleQueryReturnOrder"
          />
        </el-form-item>
        <el-form-item label="售后单号" prop="aftersaleId">
          <el-input
            v-model="queryParamsReturnOrder.aftersaleId"
            placeholder="请输入售后单号"
            clearable
            @keyup.enter.native="handleQueryReturnOrder"
          />
        </el-form-item>
        <el-form-item label="子订单编号" prop="detailsOrderId">
					<el-input
						v-model="queryParamsReturnOrder.detailsOrderId"
						placeholder="请输入子订单编号"
						clearable
						@keyup.enter.native="handleQueryReturnOrder"
					/>
				</el-form-item>
        <el-form-item label="售后类型" prop="aftersaleType">
          <el-select
            v-model="queryParamsReturnOrder.aftersaleType"
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
            v-model="queryParamsReturnOrder.aftersaleStatus"
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
            v-model="queryParamsReturnOrder.aftersaleRefundType"
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
            v-model="queryParamsReturnOrder.refundStatus"
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
            v-model="queryParamsReturnOrder.reasonText"
            placeholder="请输入售后理由"
            clearable
            @keyup.enter.native="handleQueryReturnOrder"
          />
        </el-form-item>
        <el-form-item label="售后商家备注" prop="remark">
          <el-input
            v-model="queryParamsReturnOrder.remark"
            placeholder="请输入售后商家备注"
            clearable
            @keyup.enter.native="handleQueryReturnOrder"
          />
        </el-form-item>
        <el-form-item label="订单状态" prop="orderStatus">
          <el-select
            v-model="queryParamsReturnOrder.orderStatus"
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
        <el-form-item label="下单时间">
          <el-date-picker
            v-model="dateRangeReturnOrder"
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
					<el-button type="primary" icon="el-icon-search" size="mini" @click="handleQueryReturnOrder">搜索</el-button>
					<el-button icon="el-icon-refresh" size="mini" @click="resetQueryReturnOrder">重置</el-button>
          <el-button
            type="warning"
            plain
            icon="el-icon-download"
            size="mini"
            @click="handleExportReturnOrder"
            v-hasPermi="['system:returnOrder:export']"
          >导出</el-button>
				</el-form-item>
			</el-form>

			<el-table v-loading="loadingReturnOrder" :data="returnOrderList" @sort-change="handleSortChangeReturnOrder">
        <el-table-column label="序号" type="index" align="center" width="50">
          <template slot-scope="scope">
            <span>{{(queryParamsOrder.pageNum - 1) * queryParamsOrder.pageSize + scope.$index + 1}}</span>
          </template>
        </el-table-column>
        <el-table-column label="原订单编号" align="center" prop="shopOrderId" width="180" sortable="custom" :sort-orders="['descending', 'ascending']"/>
        <!-- <el-table-column label="商品编码" align="center" prop="productId" width="180"/>
        <el-table-column label="商品图片" align="center" width="80">
          <template slot-scope="scope">
            <image-preview v-if="scope.row.productImage!=null" :src="scope.row.productImage" :width="50" :height="50"/>
          </template>
        </el-table-column>
        <el-table-column label="商品标题" align="center" prop="productName" width="300"/> -->
        <el-table-column label="售后单号" align="center" prop="aftersaleId" width="180" sortable="custom" :sort-orders="['descending', 'ascending']"/>
        <el-table-column label="售后类型" align="center" prop="aftersaleType" width="120" sortable="custom" :sort-orders="['descending', 'ascending']">
          <template slot-scope="{ row }">
            <span v-if=" row.aftersaleType==0">退货退款</span>
            <span v-if=" row.aftersaleType==1">已发货仅退款</span>
            <span v-if=" row.aftersaleType==2">未发货仅退款</span>
            <span v-if=" row.aftersaleType==3">换货</span>
            <span v-if=" row.aftersaleType==6">价保</span>
            <span v-if=" row.aftersaleType==7">补寄</span>
          </template>
        </el-table-column>
        <el-table-column label="售后状态" align="center" prop="aftersaleStatus"  width="120" sortable="custom" :sort-orders="['descending', 'ascending']">
          <template slot-scope="{ row }">
            <span v-if=" row.aftersaleStatus==3">换货待买家收货</span>
            <span v-if=" row.aftersaleStatus==6">待商家同意</span>
            <span v-if=" row.aftersaleStatus==7">待买家退货</span>
            <span v-if=" row.aftersaleStatus==8">待商家发货</span>
            <span v-if=" row.aftersaleStatus==11">待商家二次同意</span>
            <span v-if=" row.aftersaleStatus==12">售后成功</span>
            <span v-if=" row.aftersaleStatus==14">换货成功</span>
            <span v-if=" row.aftersaleStatus==27">商家一次拒绝</span>
            <span v-if=" row.aftersaleStatus==28">售后失败</span>
            <span v-if=" row.aftersaleStatus==29">商家二次拒绝</span>
          </template>
        </el-table-column>
        <el-table-column label="申请时间" align="center" prop="applyTime" width="150" sortable="custom" :sort-orders="['descending', 'ascending']" />
        <el-table-column label="售后数量" align="center" prop="aftersaleNum" />
        <el-table-column label="退款金额 (元)" align="center" prop="refundAmount" width="100"/>
        <el-table-column label="收件人姓名" align="center" prop="mmPostReceiver" width="120" />
        <el-table-column label="收件人手机" align="center" prop="mmMaskPostTel" width="120" />
        <el-table-column label="省市区" align="center" width="180">
          <template slot-scope="scope">
            <span>{{scope.row.province}}{{scope.row.city}}{{scope.row.town}}{{scope.row.street}}</span>
          </template>
        </el-table-column>
        <el-table-column label="详细地址" align="center" prop="mmAddrDetail" width="120" />
        <el-table-column label="身份证姓名" align="center" prop="mmEncryptIdCardName" width="120" />
        <el-table-column label="身份证号码" align="center" prop="mmEncryptIdCardNo" width="120"/>
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
        <el-table-column label="退款类型" align="center" prop="aftersaleRefundType" width="150" sortable="custom" :sort-orders="['descending', 'ascending']">
          <template slot-scope="{ row }">
            <span v-if=" row.aftersaleRefundType==-1">历史数据默认值</span>
            <span v-if=" row.aftersaleRefundType==0">订单货款/原路退款</span>
            <span v-if=" row.aftersaleRefundType==1">货到付款线下退款</span>
            <span v-if=" row.aftersaleRefundType==2">备用金</span>
            <span v-if=" row.aftersaleRefundType==3">保证金</span>
            <span v-if=" row.aftersaleRefundType==4">无需退款</span>
            <span v-if=" row.aftersaleRefundType==5">平台垫付</span>
          </template>
        </el-table-column>
        <el-table-column label="退款状态" align="center" prop="refundStatus" width="120" sortable="custom" :sort-orders="['descending', 'ascending']">
          <template slot-scope="{ row }">
            <span v-if=" row.refundStatus==1">待退款</span>
            <span v-if=" row.refundStatus==2">退款中</span>
            <span v-if=" row.refundStatus==3">退款成功</span>
            <span v-if=" row.refundStatus==4">退款失败</span>
            <span v-if=" row.refundStatus==5">追缴成功</span>
          </template>
        </el-table-column>
        <el-table-column label="买家是否收到货物" align="center" prop="gotPkg" width="150">
          <template slot-scope="{ row }">
          <span v-if=" row.gotPkg==0">未收到</span>
          <span v-if=" row.gotPkg==1">收到</span>
          </template>
        </el-table-column>
        <el-table-column label="售后理由" align="center" prop="reasonText" width="180"/>
        <el-table-column label="售后商家备注" align="center" prop="remark" width="150"/>
        <el-table-column label="售后原因" align="center" prop="reasonSecondLabelsName" />
        <el-table-column label="首次发货:物流单号" align="center" prop="trackingNo" />
        <el-table-column label="首次发货:物流公司" align="center" prop="companyName" />
        <el-table-column label="退货物流单号" align="center" prop="returnLogisticsCode" />
        <el-table-column label="退货物流公司" align="center" prop="returnLogisticsCompanyName" />
			</el-table>

			<pagination
				v-show="totalReturnOrder>0"
				:total="totalReturnOrder"
				:page.sync="queryParamsReturnOrder.pageNum"
				:limit.sync="queryParamsReturnOrder.pageSize"
				@pagination="getReturnOrderList"
			/>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelReturnOrder">取 消</el-button>
      </div>
    </el-dialog>


    <!-- 添加模板 -->
    <el-dialog title="券码模板" :visible.sync="mbopen" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="模板" prop="productId">
          <el-select v-model="productTemplate" placeholder="请选择模板">
            <el-option
              v-for="dict in dict.type.coupon_code_template"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            ></el-option>
          </el-select><span style="color: darkgrey;font-size: 13px;"> 注：默认发社区化券码</span>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitFormQmMb">确 定</el-button>
        <el-button @click="mbopen = false;productTemplate = '';productId = ''">取 消</el-button>
      </div>
    </el-dialog>


    <!-- 评价列表 -->
    <el-dialog title="状态列表" :visible.sync="openOptionList" width="55%" append-to-body :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false">
      <el-form :model="queryParamsOption" ref="queryParamsOption" size="small" :inline="true" v-show="showSearchOption" label-width="100px">
        <el-form-item label="订单状态值" prop="orderStatus">
          <el-input
            v-model="queryParamsOption.orderStatus"
            placeholder="请输入订单状态值"
            clearable
            @keyup.enter.native="handleQueryOption"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQueryOption">搜索</el-button>
          <!-- <el-button icon="el-icon-refresh" size="mini" @click="resetQueryOption">重置</el-button> -->
        </el-form-item>
      </el-form>

      <el-table v-loading="loadingOption" :data="optionList">
        <el-table-column label="序号" type="index" align="center" width="100">
          <template slot-scope="scope">
            <span>{{(queryParamsOption.pageNum - 1) * queryParamsOption.pageSize + scope.$index + 1}}</span>
          </template>
        </el-table-column>
        <el-table-column label="订单状态值" align="center" prop="orderStatus" />
        <el-table-column label="触发" align="center" prop="trigger" >
          <template slot-scope="{ row }">
            <span v-if=" row.trigger==0">手动</span>
            <span v-if=" row.trigger==1">自动</span>
          </template>
        </el-table-column>
        <el-table-column label="订单跟踪值" align="center" prop="orderTrackStatus" />
        <el-table-column label="是否为初始默认值" align="center" prop="defaultValue" >
          <template slot-scope="{ row }">
            <span v-if=" row.defaultValue==0">否</span>
            <span v-if=" row.defaultValue==1">是</span>
          </template>
        </el-table-column>
        <el-table-column label="排序" align="center" prop="sort" />
        <el-table-column label="服务跟踪" align="center" prop="remark" />
      </el-table>

      <pagination
        v-show="totalOption>0"
        :total="totalOption"
        :page.sync="queryParamsOption.pageNum"
        :limit.sync="queryParamsOption.pageSize"
        @pagination="getOptionList"
      />
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelOption">取 消</el-button>
      </div>
    </el-dialog>


    <!-- 状态列表 -->
    <el-dialog title="推送配置列表" :visible.sync="openOrdergrant" width="55%" append-to-body :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false">
      <el-row :gutter="10" class="mb8">
        <el-col :span="1.5">
          <el-button
            type="primary"
            plain
            icon="el-icon-plus"
            size="mini"
            v-if="productGrantList == null || productGrantList.length == 0"
            @click="openAddOption = true;formOption.grantNameType = '';formOption.productIdWb = '';formOption.productNameWb = '';"
            v-hasPermi="['system:mb:add','system:mb:edit']"
          >新增</el-button>
        </el-col>
      </el-row>

      <el-table v-loading="loadingOption" :data="productGrantList">
        <el-table-column label="序号" type="index" align="center" width="100">
          <template slot-scope="scope">
            <span>{{(queryParamsOption.pageNum - 1) * queryParamsOption.pageSize + scope.$index + 1}}</span>
          </template>
        </el-table-column>
        <el-table-column label="权益系统对接" align="center" prop="dictLabel" />
        <el-table-column label="关联的商品id" align="center" prop="productIdWb" />
        <el-table-column label="关联的商品名称" align="center" prop="productNameWb" />
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width" >
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              icon="el-icon-delete"
              @click="deletePushOption(scope.row)"
              v-hasPermi="['system:mb:add','system:mb:edit']"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="openOrdergrant=false">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 添加或修改选项对话框 -->
    <el-dialog title="添加推送配置" :visible.sync="openAddOption" width="550px" append-to-body :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false">
      <el-form ref="formOption" :model="formOption" :rules="rulesOption" label-width="130px">
        <el-form-item label="权益系统对接" prop="grantNameType">
          <el-select v-model="formOption.grantNameType" placeholder="请选择权益系统对接">
            <el-option
              v-for="dict in dict.type.grant_name_type"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="关联商品名称" prop="productNameWb" >
          <el-input v-model="formOption.productNameWb" placeholder="请输入关联的商品id" style="width:300px"/>
        </el-form-item>
        <el-form-item label="关联商品id" prop="productIdWb" >
          <el-input v-model="formOption.productIdWb" placeholder="请输入关联的商品id" style="width:300px"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitFormOption" >保 存</el-button>
        <el-button @click="openAddOption = false;">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 分类配置 -->
    <el-dialog title="商品分类配置" :visible.sync="flPzOpen" width="550px" append-to-body :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false">
      <el-form ref="formOption" :model="formOption" :rules="rulesOption" label-width="130px">
        <el-form-item label="商品分类" prop="pdoductClassification">
          <el-select v-model="formOption.pdoductClassification" placeholder="请选择商品分类" @change="formOption.pdoductClassification == 1?isJmPower = true:isJmPower=false">
            <el-option label="预约类" v-if="formOption.pdoductClassification != 3" value="1"></el-option>
            <el-option label="直连类" v-if="formOption.pdoductClassification != 3" value="2"></el-option>
            <el-option label="虚拟充值" v-if="formOption.pdoductClassification == 3" value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="解密权限" prop="jmPower" v-if="isJmPower && formOption.pdoductClassification != 3">
          <el-select v-model="formOption.jmPower" placeholder="请选择解密权限">
            <el-option label="可解密用户信息" value="1"></el-option>
            <el-option label="不可解密用户信息" value="2"></el-option>
          </el-select>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitFormFlPzOption" >保 存</el-button>
        <el-button @click="flPzOpen = false;">取 消</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import {
  listProduct,
  getProduct,
  delProduct,
  addProduct,
  updateProduct,
  synchronousctProd,
  addOrganization,
  addOrganizationBatch,
  tacticList,
  addTactic, addSmsTemplate, addSmsTemplateBatch,
  getGranrList,
  addGranrList,
  deletePush
} from "@/api/system/douyinProduct/product";

import {
  syncOrderAccept,
  syncOrderAcceptBatch,
  listOrderDetailsAllData,
} from "@/api/system/douyinOrder/order";

import {
  listOrderDetailsAllData as listReturnOrderDetailsAllData,
} from "@/api/system/douyinReturnOrder/order";

import {
  formatDate,
} from "@/utils/index";
import {
  listTemplate,
} from '@/api/system/smsTemplate/smsTemplate';

import { organizationUser, manageUserOrganizationSelect } from "@/api/system/production/tweet";
import { listAll } from "@/api/system/douyinShop/shop";
import TacticsDialog from "./tacticsDialog.vue";
import { getOptionList } from '@/api/system/mb/mb'
import Template from "@/views/system/smsTemplate/index.vue";
export default {
  name: "Product",
  dicts: ['coupon_code_template','sys_event_each_other','grant_name_type'],
  components: {Template, TacticsDialog },
  data() {
    return {
      isJmPower:false,
      flPzOpen:false,
      saveLoading:false,
      formOption:{
        id:'',
        productId:'',
        productIdWb:'',
        grantNameType:'',
        productNameWb:'',
        pdoductClassification:'',
        jmPower:''
      },
      // 表单校验
      rulesOption: {
        grantNameType: [
          { required: true, message: "订单状态值不能为空", trigger: "blur" }
        ],
        productIdWb: [
          { required: true, message: "订单跟踪值不能为空", trigger: "blur" }
        ],
        productNameWb: [
          { required: true, message: "订单跟踪值不能为空", trigger: "blur" }
        ],
      },
      openAddOption:false,
			organizationName:'',
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
      //状态列表弹出层
      openOptionList:false,
      // 显示搜索条件
      showSearchOption: true,
      // 遮罩层
      loadingOption: true,
      // 查询参数
      queryParamsOption: {
        pageNum: 1,
        pageSize: 10,
        productMbId: null,
        name: null,
      },
      // 总条数
      totalOption: 0,
      // 状态表格数据
      optionList: [],
      productTypes: [
        {
          value: 0,
          label: "普通商品",
        },
        {
          value: 1,
          label: "新客商品",
        },
        {
          value: 301,
          label: "虚拟商品",
        },
        {
          value: 302,
          label: "卡券商品",
        },
        {
          value: 303,
          label: "充值直连",
        },
        {
          value: 6,
          label: "玉石闪购",
        },
        {
          value: 7,
          label: "云闪购",
        },
        {
          value: 127,
          label: "其他类型",
        },
      ],
      statuss: [
        {
          value: 0,
          label: "在线",
        },
        {
          value: 1,
          label: "下线",
        },
        {
          value: 2,
          label: "删除",
        },
      ],
      checkStatuss: [
        {
          value: 1,
          label: "未提交",
        },
        {
          value: 2,
          label: "待审核",
        },
        {
          value: 3,
          label: "审核通过",
        },
        {
          value: 4,
          label: "审核未通过",
        },
        {
          value: 5,
          label: "封禁",
        },
        {
          value: 7,
          label: "审核通过待上架",
        },
      ],
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
      productTemplate:'',
      mbopen:false,
      searchType: this.$route.query.searchType,
      //售后订单列表--开始
      returnOrderList:[],
			openReturnOrder:false,
      loadingReturnOrder: true,
      // 显示搜索条件
      showSearchReturnOrder: true,
      totalReturnOrder: 0,
      queryParamsReturnOrder: {
        organizationId:sessionStorage.getItem("organizationId"),
        pageNum: 1,
        pageSize: 10,
        productId:null,
        detailsOrderId: null,
        shopOrderId: null,
        aftersaleId: null,
        aftersaleType: null,
        aftersaleStatus: null,
        aftersaleRefundType: null,
        refundStatus: null,
        reasonText: null,
        remark:null,
        orderStatus:null,
        detailsRemark:null,
      },
      //售后订单列表--结束
      //订单列表--开始
      orderList:[],
			openOrder:false,
      loadingOrder: true,
      // 显示搜索条件
      showSearchOrder: true,
      totalOrder: 0,
      queryParamsOrder: {
        organizationId:sessionStorage.getItem("organizationId"),
        pageNum: 1,
        pageSize: 10,
        productId:null,
        detailsOrderId: null,
        shopId: null,
        shopName: null,
        orderId: null,
        orderStatus: null,
        orderStatus2: null,
        orderStatusDesc: null,
        cancelReason: null,
        buyerWords: null,
        mmPostReceiver: null,
        mmMaskPostTel:null,
        auditingStatus:null,
        detailsOrderStatusDesc:null,
        authorId:null,
        authorName:null,
      },
      //订单列表--结束
      userId:sessionStorage.getItem('userId'),
      shopList: "",
      shopId: "",
      organizationUnallocated: {
        ids: [], //勾选的id
        open: false,
        total: 0,
        queryParams: {
          organizationId: undefined,
          organizationName: "",
        },
        list: [],
      },
      smsTemplateUnallocated: {
        ids: [], //勾选的id
        open: false,
        total: 0,
        queryParams: {
          id: undefined,
          templateName: "",
        },
        list: [],
      },
      queryParamsSmsTemplate: {
        id: null,
        templateName: "",
      },
      //组织关系列表
      organizationListDefault: [],
      smsTemplateNameListDefault: [],
      organizationList: [],
      loadingOrganization: true,
      showSearchOrganization: true,
      queryParamsOrganization: {
        organizationId: null,
        organizationName: "",
      },
      productId: null,
      dateRangeReturnOrder:[],
      dateRangeOrder:[],
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
      // 抖音商品表格数据
      productList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        searchType: this.$route.query.searchType,
        pageNum: 1,
        pageSize: 10,
        organizationId: sessionStorage.getItem("organizationId"),
        shopName: null,
        productId: null,
        status: null,
        checkStatus: null,
        img: null,
        name: null,
        productTypeAfter: null,
        pickupMethod: null,
        sellNum: null,
        synchronousTime: null,
        organizationName: null,
        templateName: null,
        toOrganizationIdIsNull:'',
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {},
      tacticsVisible: false,
      tacticsRow: "",
      isBatch: false,
      openOrdergrant:false,
      productGrantList:[],
      organizationTreeData: [],
    };
  },
  created() {
    this.getList();
    this.getManageUserOrganization();
    this.getSmsTemplate();
  },
  methods: {
    /** 查询状态列表 */
    ordergrant(row) {
      this.formOption.productId = row.productId;
      this.openOrdergrant = true;
      this.loadingOption = true;
      let datas={
          productId:row.productId
      }
      getGranrList(datas).then(response => {
        this.productGrantList = response.rows;
        this.loadingOption = false;
      });
    },

    toFlPz(row) {
      this.formOption.id = row.id;
      this.flPzOpen = true;

      //如果有值，那么说明已经配置过了
      if(row.pdoductClassification != null && row.pdoductClassification != ""){
        this.formOption.pdoductClassification=row.pdoductClassification+'';
        this.isJmPower = false;
        if(this.formOption.pdoductClassification == 1){
          this.formOption.jmPower=(row.jmPower==null || row.jmPower == ''?'':row.jmPower+'');
          this.isJmPower = true;
        }
      }else{
        //没值的情况下，如果商品为虚拟充值那么只能选择虚拟充值
        this.formOption.pdoductClassification = '';
        this.formOption.jmPower='';
        this.isJmPower = false;
      }

      //判断商品为虚拟充值的话，默认选中虚拟充值，并且只能选择虚拟充值
      if(row.pickupMethod == 3){
        this.formOption.pdoductClassification = '3';
        this.formOption.jmPower='';
        this.isJmPower = false;
      }

    },

    /** 查询项目任务记录列表 */
    getOptionList() {
      this.loadingOption = true;
      getOptionList(this.queryParamsOption).then(response => {
        this.optionList = response.rows;
        this.totalOption = response.total;
        this.loadingOption = false;
      });
    },
    /** 搜索按钮操作 */
    handleQueryOption() {
      this.queryParamsOption.pageNum = 1;
      this.getOptionList();
    },
    /** 售后订单列表-----开始 */
    handleReturnOrderDetailsList(row){
      this.productId = row.productId
      this.queryParamsReturnOrder.productId = this.productId
      this.getReturnOrderList();
      this.openReturnOrder = true;
    },
    /** 选项值列表取消按钮 */
    cancelReturnOrder() {
      this.openReturnOrder = false;
      this.productId = null;
      this.dateRangeReturnOrder = [];
      this.returnOrderList = [];
      this.totalReturnOrder = 0;
      this.resetForm("queryFormReturnOrder");
      this.getList();
    },
    getReturnOrderList(){
      this.loadingReturnOrder = true;
      this.returnOrderList = [];
      listReturnOrderDetailsAllData(this.addDateRange(this.queryParamsReturnOrder, this.dateRangeReturnOrder)).then((response) => {
        this.returnOrderList = response.rows;
        this.totalReturnOrder = response.total;
        this.loadingReturnOrder = false;
      });
    },
    /** 排序触发事件 */
    handleSortChangeReturnOrder(column, prop, order) {
      this.queryParamsReturnOrder.productId = this.productId
      this.queryParamsReturnOrder.pageNum = 1;
      this.queryParamsReturnOrder.orderByColumn = column.prop;
      this.queryParamsReturnOrder.isAsc = column.order;
      this.getReturnOrderList();
    },
    /** 重置按钮操作 */
    resetQueryReturnOrder(){
      this.dateRangeReturnOrder = []
      this.queryParamsReturnOrder.orderByColumn = undefined;
      this.queryParamsReturnOrder.isAsc = undefined;
      this.resetForm("queryFormReturnOrder");
      this.queryParamsReturnOrder.productId = this.productId
      this.getReturnOrderList();
    },
    /** 搜索按钮操作 */
    handleQueryReturnOrder(){
      this.queryParamsReturnOrder.pageNum = 1;
      this.getReturnOrderList();
    },
    /** 售后订单列表-----结束 */
    /** 订单列表-----开始 */
    handleOrderDetailsList(row){
      this.productId = row.productId
      this.queryParamsOrder.productId = this.productId
      this.getOrderList();
      this.openOrder = true;
    },
    /** 选项值列表取消按钮 */
    cancelOrder() {
      this.openOrder = false;
      this.productId = null;
      this.dateRangeOrder = [];
      this.orderList = [];
      this.totalOrder = 0;
      this.resetForm("queryFormOrder");
      this.getList();
    },
    /** 查询状态列表 */
    handleOption(row) {
      this.productId = row.productId;
      this.getOptionList();
      this.openOptionList = true;
    },
    /** 状态列表取消按钮 */
    cancelOption() {
      this.productId = null
      this.openOptionList = false;
      this.getList()
    },
    getOrderList(){
      this.loadingOrder = true;
      listOrderDetailsAllData(this.addDateRange(this.queryParamsOrder, this.dateRangeOrder)).then((response) => {
        this.orderList = response.rows;
        this.totalOrder = response.total;
        this.loadingOrder = false;
      });
    },
    /** 排序触发事件 */
    handleSortChangeOrder(column, prop, order) {
      this.queryParamsOrder.productId = this.productId
      this.queryParamsOrder.pageNum = 1;
      this.queryParamsOrder.orderByColumn = column.prop;
      this.queryParamsOrder.isAsc = column.order;
      this.getOrderList();
    },
    /** 重置按钮操作 */
    resetQueryOrder(){
      this.dateRangeOrder = []
      this.queryParamsOrder.orderByColumn = undefined;
      this.queryParamsOrder.isAsc = undefined;
      this.resetForm("queryFormOrder");
      this.queryParamsOrder.productId = this.productId
      this.getOrderList();
    },
    /** 搜索按钮操作 */
    handleQueryOrder(){
      this.queryParamsOrder.pageNum = 1;
      this.getOrderList();
    },
    /** 订单列表-----结束 */
    //刷新list
    resetFn(){
      this.getList();
    },
    /** 选择组织-----开始 */
    //获取纳管组织
    getManageUserOrganization() {
      manageUserOrganizationSelect(
        this.organizationUnallocated.queryParams
      ).then((response) => {
        this.organizationListDefault = response.data;

        //获取所以成员数据-策略弹框树结构用
        if (Array.isArray(response?.data)) {
          let allOrganization = [];
          response.data.forEach(item=>{
            organizationUser({organizationId: item.organizationId,}).then((value) => {
              if (Array.isArray(value.data)) {
                const userList = value.data.map(userItem=>{
                  return({
                    id: userItem.userId,
                    ids: `${userItem.userId}-${item.organizationId}`,
                    label: userItem.nickName,
                    children: [],
                    text: `${userItem.nickName}-${item.organizationName}`,
                    checkUserId: userItem.userId,
                    checkOrganizationId: item.organizationId,
                  })
                })
                allOrganization.push({
                  id: item.organizationId,
                  label: item.organizationName,
                  children: userList,
                })
              }
            })
          })
          this.organizationTreeData = [
            {
              id: -1,
              ids: -1,
              label: '全部',
              children: allOrganization,
            }
          ];
          console.log("organizationTreeData", this.organizationTreeData);
        }
      });
    },
    getRowKeys(row) {
      return row.organizationId;
    },
    //选中操作
    submitOrganization() {
      if (
        this.organizationUnallocated.ids == null ||
        this.organizationUnallocated.ids.length == 0
      ) {
        this.$modal.msgWarning("请选择要添加的组织");
        return;
      }
      //添加组织
      //非批量
      if(!this.isBatch){
        let parm = {
          id: this.productId,
          organizationIds: this.organizationUnallocated.ids,
        };
        addOrganization(parm).then((response) => {
          this.$modal.msgSuccess("新增成功");
          this.organizationUnallocated.open = false;
          this.organizationUnallocated.ids = [];
          this.getList();
        });
      }
      //批量
      if(this.isBatch){
        let parm = {
          ids: this.ids,
          organizationIds: this.organizationUnallocated.ids,
        };
        addOrganizationBatch(parm).then((response) => {
          this.$modal.msgSuccess("批量新增成功");
          this.organizationUnallocated.open = false;
          this.organizationUnallocated.ids = [];
          this.getList();
        });
        this.isBatch = false;
      }
    },
    handleSelectionChangeOrganization(selection) {
      if (selection.length > 1) {
        // clearSelection 用于多选表格，清空用户的选择
        this.$refs.organizationUnallocatedTable.clearSelection();
        this.$refs.organizationUnallocatedTable.toggleRowSelection(
          selection.pop()
        );
        return;
      }
      if (selection.length == 1) {
        // 选中的行对像放进数组，方便后续对数据进行操作
        this.organizationUnallocated.ids = selection.map(
          (item) => item.organizationId
        );
      } else if (selection.length == 0) {
        this.organizationUnallocated.ids = [];
      }
    },
    // 取消组织关系框
    organizationClose() {
      this.organizationUnallocated.ids = [];
      this.organizationUnallocated.open = false;
      //取消批量
      this.isBatch = false;
    },
    /** 查询列表 */
    getOrganizationList() {
      this.loadingOrganization = true;
      manageUserOrganizationSelect(
        this.organizationUnallocated.queryParams
      ).then((response) => {
        this.organizationUnallocated.list = response.data;
		this.loadingOrganization = false;
		this.multipleSelection = [];
		this.$nextTick(() => {
		  setTimeout(() => {
			response.data.forEach((item) => {
				if(item.organizationName){
					if (item.organizationName == this.organizationName) {
						this.$refs.organizationUnallocatedTable.toggleRowSelection(item, true);
						this.multipleSelection.push(item);
					}
				}
			});
		  }, 0);
		});
      });
    },
    /** 搜索按钮操作 */
    handleQueryOrganization() {
      this.getOrganizationList();
    },
    /** 重置按钮操作 */
    resetQueryOrganization() {
      this.organizationUnallocated.queryParams.organizationId = undefined;
      this.organizationUnallocated.queryParams.organizationName = "";
      this.handleQueryOrganization();
    },
    //纳管组织关系--处理已选择的
    handleOrganizationList(row) {
      this.productId = row.id;
      this.organizationUnallocated.open = true;
      this.organizationUnallocated.queryParams.organizationId = undefined;
      this.organizationUnallocated.queryParams.organizationName = "";
      this.organizationUnallocated.list = this.organizationListDefault;
	  this.organizationName = row.organizationName
      this.setOrganizationUnallocatedTableSelect(row);
    },
    //表单选项回显
    setOrganizationUnallocatedTableSelect(row) {
		this.multipleSelection = [];
		this.$nextTick(()=>{
			if (this.$refs.organizationUnallocatedTable) {
			    this.$refs.organizationUnallocatedTable?.clearSelection();
			    if (this.organizationUnallocated.list) {
			      this.organizationUnallocated.list.forEach((item) => {
			        if (item.organizationId == row.organizationId) {
						this.$refs.organizationUnallocatedTable.toggleRowSelection(item, true);
						this.multipleSelection.push(item);
			        }
			      });
			    }
			  }
		})
    },
    /** 选择组织-----结束 */

    /** 选择短信模板-----开始 */
    getSmsTemplate() {
      listTemplate(
        this.smsTemplateUnallocated.queryParams
      ).then((response) => {
        this.smsTemplateNameListDefault = response.rows;
      });
    },
    getSmsTemplateRowKeys(row) {
      return row.id;
    },
    //选中操作
    submitSmsTemplate() {
      if (
        this.smsTemplateUnallocated.ids == null ||
        this.smsTemplateUnallocated.ids.length === 0
      ) {
        this.$modal.msgWarning("请选择要添加的短信模板");
        return;
      }
      //添加短信模板
      //非批量
      if(!this.isBatch){
        let parm = {
          id: this.productId,
          smsTemplateIds: this.smsTemplateUnallocated.ids,
        };
        addSmsTemplate(parm).then((response) => {
          this.$modal.msgSuccess("新增成功");
          this.smsTemplateUnallocated.open = false;
          this.smsTemplateUnallocated.ids = [];
          this.getList();
        });
      }
      //批量
      if(this.isBatch){
        let parm = {
          ids: this.ids,
          smsTemplateIds: this.smsTemplateUnallocated.ids,
        };
        addSmsTemplateBatch(parm).then((response) => {
          this.$modal.msgSuccess("批量新增成功");
          this.smsTemplateUnallocated.open = false;
          this.smsTemplateUnallocated.ids = [];
          this.getList();
        });
        this.isBatch = false;
      }
    },
    handleSelectionChangeSmsTemplate(selection) {
      if (selection.length > 1) {
        // clearSelection 用于多选表格，清空用户的选择
        this.$refs.smsTemplateUnallocatedTable.clearSelection();
        this.$refs.smsTemplateUnallocatedTable.toggleRowSelection(
          selection.pop()
        );
        return;
      }
      if (selection.length === 1) {
        // 选中的行对像放进数组，方便后续对数据进行操作
        this.smsTemplateUnallocated.ids = selection.map(
          (item) => item.id
        );
      } else if (selection.length === 0) {
        this.smsTemplateUnallocated.ids = [];
      }
    },
    // 取消组织关系框
    smsTemplateClose() {
      this.smsTemplateUnallocated.ids = [];
      this.smsTemplateUnallocated.open = false;
      //取消批量
      this.isBatch = false;
    },
    /** 查询列表 */
    getSmsTemplateList() {
      this.loadingOrganization = true;
      listTemplate(
        this.smsTemplateUnallocated.queryParams
      ).then((response) => {
        this.smsTemplateUnallocated.list = response.rows;
        this.loadingOrganization = false;
      });
    },
    /** 搜索按钮操作 */
    handleQuerySmsTemplate() {
      this.getSmsTemplateList();
    },
    /** 重置按钮操作 */
    resetQuerySmsTemplate() {
      this.smsTemplateUnallocated.queryParams.templateName = "";
      this.handleQuerySmsTemplate();
    },
    //纳管组织关系--处理已选择的
    handleSmsTemplateList(row) {
      this.productId = row.id;
      this.smsTemplateUnallocated.open = true;
      this.smsTemplateUnallocated.queryParams.id = undefined;
      this.smsTemplateUnallocated.queryParams.templateName = "";
      this.smsTemplateUnallocated.list = this.smsTemplateNameListDefault;
      this.setSmsTemplateUnallocatedTableSelect(row);
    },
    //表单选项回显
    setSmsTemplateUnallocatedTableSelect(row) {
      if (this.$refs.smsTemplateUnallocatedTable) {
        this.$refs.smsTemplateUnallocatedTable?.clearSelection();
        if (this.smsTemplateUnallocated.list) {
          this.smsTemplateUnallocated.list.forEach((item) => {
            if (item.organizationId == row.organizationId) {
              if (!this.$refs.smsTemplateUnallocatedTable) {
                setTimeout(() => {
                  this.$refs.smsTemplateUnallocatedTable?.toggleRowSelection(
                    item
                  );
                }, 500);
              } else {
                this.$refs.smsTemplateUnallocatedTable?.toggleRowSelection(
                  item
                );
              }
            }
          });
        }
      }
    },
    /** 选择短信模板-----结束 */

    /** 查询抖音商品列表 */
    getList() {
      this.loading = true;
      this.queryParams.productType = this.queryParams.productTypeAfter
      this.queryParams.pickupMethod = null
      if(this.queryParams.productTypeAfter!=null){
        if(this.queryParams.productTypeAfter=='301'){
          this.queryParams.productType = 3
          this.queryParams.pickupMethod = '1'
        }else if(this.queryParams.productTypeAfter=='302'){
          this.queryParams.productType = 3
          this.queryParams.pickupMethod = '2'
        }else if(this.queryParams.productTypeAfter=='303'){
          this.queryParams.productType = 3
          this.queryParams.pickupMethod = '3'
        }
      }
      listProduct(this.queryParams).then((response) => {
        this.productList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
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
        productId: null,
        status: null,
        checkStatus: null,
        img: null,
        name: null,
        createTime: null,
        updateTime: null,
        sellNum: null,
        synchronousTime: null,
        shopId: null,
      };
      this.resetForm("form");
    },
    /** 排序触发事件 */
    handleSortChange(column, prop, order) {
      this.queryParams.pageNum = 1;
      this.queryParams.orderByColumn = column.prop;
      this.queryParams.isAsc = column.order;
      this.getList();
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
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
    /** 同步商品 */
    synchronous() {
      this.reset();
      this.open = true;
      this.title = "同步抖店商品";
      let a = {};
      listAll(a).then((response) => {
        this.shopList = response.rows;
      });
    },
    /** 组织关系 */
    zzgxBatch(){
      this.isBatch = true;
      this.handleOrganizationList({id:null});
    },

    /** 短信模板配置 */
    smsTemplateConfiguration(){
      this.isBatch = true;
      this.handleSmsTemplateList({id:null});
    },

    submitFormQmMb(){
      if(this.productTemplate == null || this.productTemplate == ""){
        this.$modal.msgError("请选择需要配置得券码模板");
        return;
      }

      let aa = {
        couponTemplate: this.productTemplate,
        id:this.productId
      };
      updateProduct(aa).then((response) => {
        this.mbopen = false;
        this.productTemplate = '';
        this.productId = '';
        this.getList();
        this.$modal.msgSuccess("配置成功");
      });
    },
    submitFormFlPzOption(){
        if(this.formOption.pdoductClassification == null || this.formOption.pdoductClassification == ""){
          this.$modal.msgError("请选择商品分类");
          return;
        }else{
          if(this.formOption.pdoductClassification == 1 && (this.formOption.jmPower == null || this.formOption.jmPower == "")){
            this.$modal.msgError("请选择解密权限");
            return;
          }
        }
      updateProduct(this.formOption).then((response) => {
        this.flPzOpen = false;
        this.isJmPower = false;
        this.formOption.id = '';
        this.formOption.pdoductClassification = '';
        this.formOption.jmPower = '';
        this.getList();
        this.$modal.msgSuccess("配置成功");
      });
    },
    submitFormOption(){
      if(this.formOption.grantNameType == null || this.formOption.grantNameType == ""){
        this.$modal.msgError("请选择推送方");
        return;
      }
      if(this.formOption.productNameWb == null || this.formOption.productNameWb == ""){
        this.$modal.msgError("关联商品名称不能为空");
        return;
      }
      if(this.formOption.productIdWb == null || this.formOption.productIdWb == ""){
        this.$modal.msgError("关联商品id不能为空");
        return;
      }
      this.saveLoading = true;
      addGranrList(this.formOption).then((response) => {
        let datas={
          productId:this.formOption.productId
        }
        getGranrList(datas).then(response => {
          this.productGrantList = response.rows;
          this.loadingOption = false;
        });
        this.saveLoading = false;
        this.openAddOption = false;
        this.formOption.productId = '';
        this.formOption.grantNameType = '';
        this.formOption.productIdWb = '';
        this.formOption.productNameWb = '';
        this.$modal.msgSuccess("配置成功");
      });
    },
    /** 提交按钮 */
    submitForm() {
      if (this.shopId == null || this.shopId == "") {
        this.$modal.msgError("请选择需要同步的店铺");
        return;
      }
      this.loading = true;
      this.open = false;
      let aa = {
        shopId: this.shopId,
      };
      synchronousctProd(aa).then((response) => {
        this.open = false;
        this.loading = false;
        this.getList();
        this.$modal.msgSuccess("同步成功");
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$modal
        .confirm('是否确认删除抖音商品编号为"' + ids + '"的数据项？')
        .then(function () {
          return delProduct(ids);
        })
        .then(() => {
          this.getList();
          this.$modal.msgSuccess("删除成功");
        })
        .catch(() => {});
    },
    deletePushOption(row) {
      this.$modal
        .confirm('是否确认删除关该联配置？')
        .then(function () {
          return deletePush(row.id);
        })
        .then(() => {
          let datas={
            productId:this.formOption.productId
          }
          getGranrList(datas).then(response => {
            this.productGrantList = response.rows;
            this.loadingOption = false;
          });
          this.$modal.msgSuccess("删除成功");
        })
        .catch(() => {});
    },


    //增量--全量同步订单
    handleSyncOrderAccept(row,isUpdate){
      this.loading = true;
      syncOrderAccept({
        id:row.id,
        isUpdate:isUpdate
      }).then((response) => {
        this.loading = false;
        this.$modal.msgSuccess("同步成功");
      }).catch(() => {
        this.loading = false;
      });;
    },

    //批量---增量--全量同步订单
    handleSyncOrderAcceptBatch(row,isUpdate){
      this.loading = true;
      syncOrderAcceptBatch({
        ids:this.ids,
        isUpdate:isUpdate
      }).then((response) => {
        this.loading = false;
        this.$modal.msgSuccess("批量同步成功");
      }) .catch(() => {
        this.loading = false;
      });;
    },

    /** 商品策略配置 */
    handleElemTactic(row) {
      this.tacticsVisible = true;
      this.tacticsRow = row;
    },

    /** 商品策略配置 */
    clpzBatch(){
      getProduct(this.ids[0]).then((response) => {
        this.tacticsRow = response.data;
        this.isBatch = true;
        this.tacticsVisible = true;
      });
    },

    /** 商品策略配置显示 */
    setTacticsVisible() {
      this.tacticsVisible = !this.tacticsVisible;
    },

    /** 导出按钮操作 */
    handleExportOrder() {
      this.download('system/order/export', {
        ...this.addDateRange(this.queryParamsOrder, this.dateRangeOrder)
      }, `抖音订单_${new Date().getTime()}.xlsx`)
    },

    /** 导出按钮操作 */
    handleExportReturnOrder() {
      this.download('system/returnOrder/export', {
        ...this.addDateRange(this.queryParamsReturnOrder, this.dateRangeReturnOrder)
      }, `抖音售后订单_${new Date().getTime()}.xlsx`)
    },

  },
};
</script>
<style lang="scss">
  .dsgxDialog{
		.el-table__header, .el-table__body, .el-table__footer{
			width: 100% !important;
		}
	}
</style>
