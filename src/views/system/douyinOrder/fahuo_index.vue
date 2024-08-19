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
	
	<!-- orderList -->
	<div style="background: #f3f5f4;width: 100%; border-radius:10px" class="p-2 d-flex a-center">
		<div class="" style="width:50px">1 </div>
		<div class="span-5 font-14" style="">商品信息</div>
		<div class="span-2 font-14" style="">单价/数量</div>
		<div class="span-4 font-14" style="">子订单状态</div>
		<div class="span-2 font-14" style="">应付</div>
		<div class="span-4 font-14" style="">买家/收货人</div>
		<!-- <div class="span-2 font-14" style="">订单状态</div> -->
		<div class="span-2 font-14" style="">操作</div>
	</div>
	
	<div v-for="(a,aindex) in orderList" :key="aindex">
		<div class="mt-1 p-2" style="background: #f8faf9;width: 100%;" v-for="(item,index) in a.douYinOrderDetails" :key="index"> 
			<div class="d-flex a-center">
				<div class="" style="width:50px"></div>
				<div class="d-flex a-center"> 
					<div class="font-14" style="">订单编号:{{ item.detailsOrderId }}</div>
					<img class="ml-1" src="../../../assets/images/copyIcon.png" @click="copyText(item.detailsOrderId)" style="width: 18px;height: 18px;" alt="">
				</div>
				<div class="d-flex a-center ml-2 font-14">
					下单时间:{{  parseTime(item.createTime, "{y}-{m}-{d} {h}:{i}:{s}") }}
				</div>
			</div>
			<div class="d-flex mt-3">
				<div class="" style="width:50px">1</div>
				<div class="span-5 font-14 d-flex" style="">
					<image-preview
					  v-if="item.productImg != null"
					  :src="item.productImg"
					  :width="50"
					  :height="50"
					/>
					<div class="ml-2" style="width:60%">
						<div style="color:#333">{{ item.productName }}</div>
						<div class="font-12 my-1" style="color:#999">{{ item.specs }}</div>
						<!-- <div class="d-flx row" style="color:#999">
							<div style="background:#f3f4f6;padding:3px;border-radius: 2px;" class="mr-2 ">不支持7天</div>
							<div style="background:#f3f4f6;padding:3px;border-radius: 2px" class="mr-2 ">小店自卖</div>
						</div> -->
					</div>
				</div>
				<div class="span-2 font-14" style="">
					<div style="color:#333" v-if="item.goodsPrice">
						¥{{ item.goodsPrice }}
					</div>
					<div style="color:#999;margin-left:20px" v-if="item.itemNum">
						x{{ item.itemNum }}
					</div>
				</div>
				<div class="span-4 font-14" style="">
					{{ item.detailsOrderStatusDesc }}
				</div>
				<div class="span-2 font-14" style="color:#333" >
					<!-- <div >
						抖音支付
					</div> -->
					<div v-if="item.payAmount ">
						¥{{ item.payAmount }}
					</div>
				</div>
				<div class="span-4 font-14 d-flex j-sb" style="">
					<div>
						<!-- <div class="d-flex a-center">
							<img src="https://img1.baidu.com/it/u=2572795898,2432467619&fm=253&fmt=auto&app=138&f=JPEG?w=640&h=427" style="width: 20px;height: 20px;border-radius:50%" alt="">
							<div class="mx-1">2</div>
						</div> -->
						<div  style="margin-top:3px"> {{ a.mmPostReceiver }}</div>
						<div style="margin-top:3px"> {{ a.mmMaskPostTel }}</div>
						<div style="margin-top:3px">{{a.province}}{{a.city}}{{a.town}}{{a.street}}</div>
						<div>
							<!-- <div style="background:#f3f4f6;padding:3px;border-radius: 2px;color:#999;width:64px" class="mr-2">
								高频购买
							</div> -->
						</div>
					</div>
					<!-- <div style="border-radius: 2px" class="mr-3 ml-1">2</div> -->
				</div>
				<!-- <div class="span-2 font-14" style="">
					<div>
						已支付
					</div>
				</div> -->
				<div class="span-2 font-14 d-flex   flex-column" style="">
					<div style="background: #1866fb;padding:2px;color:#fff;width:60px;border-radius: 4px;height:30px" class=" d-flex a-center j-center" @click="handleOrder(a)">操作</div>
					<!-- <div style="color: #1866fb;" class="my-1">订单详情</div>
					<div style="color: #1866fb;">修改发货地址</div> -->
				</div>
			</div>
		</div>
	</div>
    

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
          <el-form-item label="订单编号:">
            {{ customerDetail.orderId }}
          </el-form-item>
          <el-form-item label="订单状态:">
            {{ customerDetail.orderStatusDesc }}
          </el-form-item>
          <el-form-item label="订单类型:">
            {{ customerDetail.orderType ==0 ? '普通订单' :
              customerDetail.orderType ==2 ? '虚拟商品订单':
              customerDetail.orderType ==4 ? '平台发码订单':
              customerDetail.orderType ==5 ? '商家发码订单' : ''
            }}
          </el-form-item>

          <el-form-item label="下单时间:">
            {{ customerDetail.createTime }}
          </el-form-item>
          <el-form-item label="身份证姓名:">
            {{ customerDetail.mmEncryptIdCardName }}
          </el-form-item>
          <el-form-item label="身份证号:">
            {{ customerDetail.mmEncryptIdCardNo }}
          </el-form-item>
          <el-form-item label="收件人:">
            {{ (customerDetail.mmPostReceiver=="" || customerDetail.mmPostReceiver==null) ? customerDetail.maskPostReceiver : customerDetail.mmPostReceiver }}
          </el-form-item>
          <el-form-item label="收件人手机号:">
            {{ (customerDetail.mmMaskPostTel=="" || customerDetail.mmMaskPostTel==null) ? customerDetail.maskPostTel : customerDetail.mmMaskPostTel }}
            <el-button
              v-if="customerDetail.mmMaskPostTel == null || 
                customerDetail.mmMaskPostTel == '' || 
                customerDetail.mmMaskPostTel == undefined ||
                customerDetail.mmMaskPostTel.includes('看') ||
                customerDetail.mmMaskPostTel.includes('解密')
              "
              style="margin: 0 20px"
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
              style="margin: 0 20px"
              type="success"
              @click="toPhone(customerDetail)"
              >外 呼</el-button
            >
          </el-form-item>
          <el-form-item label="收件地址:">
            {{
              customerDetail.province +
              customerDetail.city +
              customerDetail.town +
              customerDetail.street
            }}
          </el-form-item>
          <el-form-item label="详细地址:">
            {{ customerDetail.mmAddrDetail }}
          </el-form-item>

          <el-form-item label="商品数量:">
            {{ customerDetail.productNum }}
          </el-form-item>
          <el-form-item label="买家实付:">
            {{ customerDetail.orderAmount }} (元)
          </el-form-item>
          <el-form-item label="买家留言:">
            {{ customerDetail.buyerWords }}
          </el-form-item>
          <el-form-item label="取消原因:"
            v-if="customerDetail.cancelReason != null && customerDetail.cancelReason != '' ">
            {{ customerDetail.cancelReason }}
          </el-form-item>
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
  </div>
</template>

<script>
import Clipboard from 'clipboard';
import { listOrder, getOrder, delOrder ,synchronousctOrder,datajm,dataSh,dataFh,selectExpressList,cancelOrder,writeOff,
  listOrderData, listOrderDetailsData, forwardUser, updateRemarkOrder,updateSellerWords,updateToOrgId,goManualJm} from "@/api/system/douyinOrder/order";
import { listAll } from '@/api/system/douyinShop/shop';
import qrCode from "@/components/tweet/qrCode";
import {
  organizationUser,
  manageUserOrganization,
} from "../../../api/system/production/tweet";
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
      sellerWords: '',
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
    };
  },
  created() {
    this.getList();
    this.getManageUserOrganization();
  },
  methods: {
	copyText(val) {
		const clipboard = new Clipboard('.copy-button', {
		  text: () => val
		});

		clipboard.on('success', () => {
		  this.$message.success('复制成功')
		  clipboard.destroy();
		});

		clipboard.on('error', () => {
		 this.$message.error('复制失败')
		  clipboard.destroy();
		});

		clipboard.onClick(event);
	  },
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
    /** 解密 */
    datajm(row) {
      this.reset();
      const id = row.id || this.ids
      this.$modal.confirm('是否确认解密当前数据项？').then(function() {
        let datas = {"id":id}
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
          // //修改详情页
          // getOrder(this.customerDetail.id).then(response => {
          //   let row = response.data;
          //   row.elements = this.handelCustomerList(row.douYinOrderDetails);
          //   row.sellerWordsOld = row.sellerWords;
          //   row.editRemark = false;

          //   this.customerDetail = JSON.parse(JSON.stringify(row));
          // });
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
            // //修改详情页
            // getOrder(this.customerDetail.id).then(response => {
            //   let row = response.data;
            //   row.elements = this.handelCustomerList(row.douYinOrderDetails);
            //   row.sellerWordsOld = row.sellerWords;
            //   row.editRemark = false;

            //   this.customerDetail = JSON.parse(JSON.stringify(row));
            // });
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
          // //修改详情页
          // getOrder(this.customerDetail.id).then(response => {
          //   let row = response.data;
          //   row.elements = this.handelCustomerList(row.douYinOrderDetails);
          //   row.sellerWordsOld = row.sellerWords;
          //   row.editRemark = false;

          //   this.customerDetail = JSON.parse(JSON.stringify(row));
          // });
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

    // this.reset();
    // const id = row.id || this.ids
    // this.$modal.confirm('是否确认发货当前数订单？').then(function() {
    //   let datas = {"id":id}
    //   return dataFh(datas);
    // }).then(() => {
    //   this.getList();
    //   this.$modal.msgSuccess("发货成功");
    // }).catch(() => {});

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
      row.editRemark = false;

      this.customerDetail = JSON.parse(JSON.stringify(row));
      this.openOrder = true;
      this.parentRow = row;
    },
    handelCustomerList(response) {
		console.log(response,'response');
      let elements = [];
      let userId = sessionStorage.getItem("userId");
      let organizationId = sessionStorage.getItem("organizationId");
      response.forEach((item, index) => {
        item.orderStatusOld = item.detailsOrderStatusDesc;
        item.editRemark = false;
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
      item.editRemark = false;
      item.editStatus = false;
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
      let message = "确定手动解密失败订单吗？";
      let _this = this
      _this.$modal.confirm(message).then(function() {
        _this.loading = true;
        goManualJm().then((response) => {
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
