<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch">
      <el-form-item label="优惠券名称" prop="couponName">
        <el-input
          v-model="queryParams.couponName"
          placeholder="请输入优惠券名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="创建时间">
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
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
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
          v-hasPermi="['system:coupon:add']"
        >新增
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDeletes"
          v-hasPermi="['system:coupon:remove']"
        >删除
        </el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>
    <!--列表-->
    <el-table v-loading="loading" :data="couponList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="编号" prop="couponId" width="100" align="center"/>
      <el-table-column label="名称" prop="couponName" width="200" align="center"/>
      <el-table-column label="类型" prop="couponType" width="100" align="center">
        <template slot-scope="{ row }">
          <span v-if=" row.couponType==1">手动领取</span>
          <span v-if=" row.couponType==2">自动发放</span>
        </template>
      </el-table-column>
      <el-table-column label="领取有效期" prop="isFixedReceive" width="120" align="center">
        <template slot-scope="{ row }">
          <span v-if=" row.isFixedReceive==0">不限时</span>
          <span v-if=" row.isFixedReceive==1">限时</span>
        </template>
      </el-table-column>
      <el-table-column label="使用有效期" prop="isFixedUse" width="120" align="center">
        <template slot-scope="{ row }">
          <span v-if=" row.isFixedUse==0">天数</span>
          <span v-if=" row.isFixedUse==1">时间段</span>
        </template>
      </el-table-column>
      <el-table-column label="是否限量" prop="isLimited" width="120" align="center">
        <template slot-scope="{ row }">
          <span v-if=" row.isLimited==0">不限量</span>
          <span v-if=" row.isLimited==1">限量</span>
        </template>
      </el-table-column>
      <el-table-column label="券总量" prop="total" width="120" align="center">
        <template slot-scope="{ row }">
          <span v-if="row.isLimited==1">{{ row.total }}</span>
        </template>
      </el-table-column>
      <el-table-column label="券余量" prop="lastTotal" width="120" align="center">
        <template slot-scope="{ row }">
          <span v-if="row.isLimited==1">{{ row.lastTotal }}</span>
        </template>
      </el-table-column>
      <el-table-column label="开启状态" prop="couponUsingFlag" width="120" align="center">
        <template slot-scope="{ row }">
          <span v-if=" row.couponUsingFlag==0">开启</span>
          <span v-if=" row.couponUsingFlag==1">关闭</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="checkoutPage(scope.row)"
          >核销列表
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['system:coupon:edit']"
          >修改
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="logOpen(scope.row)"
            v-hasPermi="['system:coupon:logList']"
          >日志
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:coupon:remove']"
          >删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--分页工具栏-->
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />
    <!-- 添加或修改图库对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="850px" append-to-body :close-on-click-modal="false" :show-close="false" :close-on-press-escape="false">
      <el-form ref="couponForm" :model="couponForm" :rules="couponRules" label-width="150px">
        <el-form-item label="优惠劵名称" prop="couponName">
          <el-input v-model="couponForm.couponName" placeholder="请输入优惠券名称"></el-input>
        </el-form-item>
	      <el-form-item label="优惠劵点击前" prop="gainBeforeImg">
		      <el-row>
			      <el-col v-if="couponForm.gainBeforeImg != ''">
				      <img
						      :src="couponForm.gainBeforeImg"
						      style="width: 148px;height: 148px ;border:1px solid"
						      @click="backgroundPreview(couponForm.gainBeforeImg)"
				      />
				      <img src="../../../../assets/images/delete.png" style="width: 20px;height: 20px;position: relative;top: -120px;left: -25px;"
				           @click="backgroundRemove('PRODUCT_COUPON_BEFORE_IMG')"
				      >
			      </el-col>
			      <el-col v-if="couponForm.gainBeforeImg == ''">
				      <div tabindex="0" class="el-upload el-upload--picture-card" style="width: 148px;height: 148px"
				           @click="uploadTypeOpen('PRODUCT_COUPON_BEFORE_IMG')"
				      >
					      <i class="el-icon-plus"></i>
				      </div>
			      </el-col>
		      </el-row>
	      </el-form-item>
	      <el-form-item label="优惠劵点击后" prop="gainAfterImg">
		      <el-row>
			      <el-col v-if="couponForm.gainAfterImg != ''">
				      <img
						      :src="couponForm.gainAfterImg"
						      style="width: 148px;height: 148px ;border:1px solid"
						      @click="backgroundPreview(couponForm.gainAfterImg)"
				      />
				      <img src="../../../../assets/images/delete.png" style="width: 20px;height: 20px;position: relative;top: -120px;left: -25px;"
				           @click="backgroundRemove('PRODUCT_COUPON_AFTER_IMG')"
				      >
			      </el-col>
			      <el-col v-if="couponForm.gainAfterImg == ''">
				      <div tabindex="0" class="el-upload el-upload--picture-card" style="width: 148px;height: 148px"
				           @click="uploadTypeOpen('PRODUCT_COUPON_AFTER_IMG')"
				      >
					      <i class="el-icon-plus"></i>
				      </div>
			      </el-col>
		      </el-row>
	      </el-form-item>

        <el-form-item label="" prop="couponType">
          <span slot="label">
                <el-tooltip content="手动领取需用户自己操作领取,自动放发在规定时间会自动给用户发放" placement="top">
                  <i class="el-icon-question"></i>
                </el-tooltip>
                类型
              </span>
          <el-radio-group v-model="couponForm.couponType">
            <el-radio :label="1">手动领取</el-radio>
            <el-radio :label="2">自动发放</el-radio>
<!--            <el-radio :label="3">赠送券</el-radio>-->
            <!--<el-radio :label="4">付费会员卷</el-radio>-->
          </el-radio-group>
        </el-form-item>
        <el-form-item label="领取限时" prop="isFixedReceive" v-if="couponForm.couponType != 2">
          <el-radio-group v-model="couponForm.isFixedReceive">
            <el-radio :label="0">不限时</el-radio>
            <el-radio :label="1">限时</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="领取时间" v-if="couponForm.isFixedReceive == 1 && couponForm.couponType != 2">
          <el-date-picker
            style="width: 550px"
            v-model="fixedReceiveTime"
            type="datetimerange"
            range-separator="至"
            value-format="yyyy-MM-dd HH:mm:ss"
            :picker-options="pickerOptions"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="使用限时">
          <el-radio-group v-model="couponForm.isFixedUse">
            <el-radio :label="0">天数</el-radio>
            <el-radio :label="1">时间段</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="使用有效期限" prop="useDay" v-if="couponForm.isFixedUse==0">
          <el-input-number v-model="couponForm.useDay" :min="0" :max="999" :controls="false" label="描述文字"
          ></el-input-number>
          <span>   天</span>
        </el-form-item>
        <el-form-item label="使用有效期限" prop="resource" v-if="couponForm.isFixedUse==1">
          <el-date-picker
            style="width: 550px"
            v-model="fixedUseTime"
            type="datetimerange"
            range-separator="至"
            value-format="yyyy-MM-dd HH:mm:ss"
            start-placeholder="开始日期"
            :picker-options="pickerOptions"
            end-placeholder="结束日期"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="是否限量" prop="isLimited">
          <el-radio-group v-model="couponForm.isLimited">
            <el-radio :label="0">不限量</el-radio>
            <el-radio :label="1">限量</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="发布数量" prop="total" v-if="couponForm.isLimited==1">
          <el-input-number v-model="couponForm.total" :min="0" :controls="false" label="发布数量" :disabled="couponFormShow.disabledTotal"></el-input-number>
        </el-form-item>
        <el-form-item label="剩余数量" prop="total" v-if="couponForm.isLimited==1 && couponFormShow.ifLastTotal">
          <el-input-number v-model="couponForm.lastTotal" :controls="false" label="剩余数量" disabled></el-input-number>
        </el-form-item>
        <el-form-item label="增加数量" prop="total" v-if="couponForm.isLimited==1 && couponFormShow.ifAddTotal">
          <el-input-number v-model="couponForm.addTotal" :min="0" :controls="false" label="增加数量" :disabled="couponFormShow.disabledAddTotal" ></el-input-number>
        </el-form-item>
        <el-form-item label="状态" prop="couponUsingFlag">
          <el-radio-group v-model="couponForm.couponUsingFlag">
            <el-radio :label="0">开启</el-radio>
            <el-radio :label="1">关闭</el-radio>
          </el-radio-group>
        </el-form-item>
	      <el-form-item label="内容" prop="couponContent">
		      <editor v-model="couponForm.couponContent" :min-height="200"/>
	      </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="couponSubmit">保 存</el-button>
        <el-button @click="couponCancel">取 消</el-button>
      </div>
    </el-dialog>

    <!--图片显示弹出层-->
    <el-dialog :visible.sync="couponBackground.visible" width="850px" height="37.5rem"  append-to-body :close-on-click-modal="false" :close-on-press-escape="false"
               :show-close="true" :center="true"  @close="backgroundPreviewClose"
    >
      <img  :src="couponBackground.url" class="el_dialog_img" alt="">
      <!-- width="100vh" -->
    </el-dialog>

<!--    日志相关-->
    <el-dialog :title="log.title" :visible.sync="log.open" width="850px" append-to-body
               :close-on-click-modal="false" :close-on-press-escape="false"
               :show-close="true" @close="logClose"
    >
      <el-form :model="log.queryParams" ref="logQueryFrom" size="small" :inline="true" v-show="showSearch">
        <el-form-item label="操作人" prop="createBy">
          <el-input
            v-model="log.queryParams.createBy"
            placeholder="请输入操作人名称"
            clearable
            @keyup.enter.native="logQuery"
          />
        </el-form-item>
        <el-form-item label="创建时间">
          <el-date-picker
            v-model="log.dateRange"
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
          <el-button type="primary" icon="el-icon-search" size="mini" @click="logQuery">搜索</el-button>
          <!--          <el-button icon="el-icon-refresh" size="mini" @click="logQueryReset">重置</el-button>-->
        </el-form-item>
      </el-form>
      <el-table :data="log.list">
        <el-table-column label="操作人" prop="createBy" align="center"/>
        <el-table-column label="操作" prop="operTitle" align="center"/>
        <el-table-column label="操作时间" prop="createTime" align="center"/>
      </el-table>
      <!--分页工具栏-->
      <pagination
        v-show="log.total>0"
        :total="log.total"
        :page.sync="log.queryParams.pageNum"
        :limit.sync="log.queryParams.pageSize"
        @pagination="getLogList"
      />
    </el-dialog>
  </div>
</template>

<script>


import {
  couponAdd,
  couponEdit,
  couponInfo,
  couponList, couponLogList,
  couponRemove,
  couponRemoves, couponUpload
} from '../../../../api/system/product/coupon/index'

export default {
  name: 'coupon',
  dicts: [],
  components: {},
  data() {
    return {
      pickerOptions: {
        disabledDate(time) {
          // return time.getTime() < new Date().setTime(new Date().getTime() - 3600 * 1000 * 24); //不限制未来时间
          return time.getTime() < Date.now() - 8.64e7 || time.getTime() > Date.now() + 600 * 8.64e7 //限制未来时间
        }
      },
      // 遮罩层
      loading: true,
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 是否显示弹出层
      open: false,
      // 弹出层标题
      title: '',
      // 弹出层禁用
      disable: false,
      // 日期范围
      dateRange: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        couponName: '',
        organizationId: undefined
      },
      //优惠券列表
      couponList: [],
      // 总条数
      total: 0,
      // 选中数组
      ids: [],
      fixedUseTime: [],//固定使用时间
      fixedReceiveTime: [],//固定领取时间
      couponBackground:{
        url:'',
        visible:false,
      },
      couponFormShow: {
        // money: false,//面值
        // discount: false,//折扣
        // hasThreshold:false,//是否有门槛
        // threshold: false,//最低门槛
        // maxOut: false//满减
        disabledTotal : false,//券发布数量禁用
        ifLastTotal:false,//券余量显示开关
        ifAddTotal:false,//券增量显示开关
        disabledAddTotal:false //券增加数量
      },
      couponForm: {
        couponId: undefined,//id
        couponName: '',//名称
        couponType: 1,//类型
        // couponUseType: 1,//使用类型
        // money: 0,//面值
        // discount: 0.99,//折扣
        // moMax: 0,//满
        // moOut: 0,//减
        // minPrice: 0,//最低消费
	      gainBeforeImg:"",// 领取前图url
	      gainAfterImg:"",//领取后图url
	      couponContent:"",//优惠券内容
        isFixedReceive: 0,//领取时是否固定
        receiveStartTime: '',//领取开始时间
        receiveEndTime: '',//领取结束时间
        isFixedUse: 0,//使用时是否固定   天数还是时间段
        useDay: 0,//天数
        useStartTime: '',//使用开始时间
        useEndTime: '',//使用结束时间
        isLimited: 0,//是否限量
        total: 0,//发放数量
        lastTotal: 0,//剩余数量
        addTotal:0,//增加量
        sort: 0,//排序
        couponUsingFlag: undefined,//优惠券启用状态
        organizationId: undefined,
        // couponBgId:undefined,//背景图片
      },
      couponRules: {
        couponName: [
          { required: true, message: '优惠券名称不能为空', trigger: 'blur' },
          { min: 2, max: 20, message: '优惠券名称长度在 2 到 20 个字符', trigger: 'blur' }
        ],
        // couponType: [
        //   { required: true, message: '请选择优惠券类型', trigger: 'change' }
        // ],
        // couponUseType: [
        //   { required: true, message: '请选择优惠券使用类型', trigger: 'change' }
        // ]
        // couponBgId:[
        //   { required: true, message: '请上传优惠券背景图', trigger: 'blur' }
        // ],
	      gainBeforeImg:[
		      { required: true, message: '请上传优惠券点击前背景图', trigger: 'blur' }
	      ],
	      gainAfterImg:[
		      { required: true, message: '请上传优惠券点击后背景图', trigger: 'blur' }
	      ],
	      couponContent: [
		      { required: true, message: '优惠券内容不能为空', trigger: 'blur' }
	      ]
      },
      log: {
        open: false,
        title: '',
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          targetId: undefined
        },
        // 日期范围
        dateRange: [],
        list: [],
        // 总条数
        total: 0
      },
    }
  },
  created() {
    this.getList()
  },
  activated() {
    this.getList()
  },
  methods: {
    // 搜索按钮操作
    handleQuery() {
      this.queryParams.pageNum = 1
      this.getList()
    },
    // 重置搜索按钮操作
    resetQuery() {
      this.queryParams.couponName = ''
      this.dateRange = []
      this.resetForm('queryForm')
      this.handleQuery()
    },
    // 列表
    getList() {
      this.loading = true
      this.queryParams.organizationId = sessionStorage.getItem('organizationId')
      couponList(this.addDateRange(this.queryParams, this.dateRange)).then(response => {
        this.couponList = response.rows
        this.total = response.total
        this.loading = false
      })
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.couponId)
      this.single = selection.length != 1
      this.multiple = !selection.length
    },
    // 表单重置
    reset() {

      this.couponForm.couponId = undefined
      this.couponForm.couponName = ''
      this.couponForm.couponType = 1
      this.couponForm.isFixedReceive = 0
      this.couponForm.receiveStartTime = ''
      this.couponForm.receiveEndTime = ''
      this.couponForm.isFixedUse = 0
      this.couponForm.useDay = 0
      this.couponForm.useStartTime = ''
      this.couponForm.useEndTime = ''
      this.couponForm.isLimited = 0
      this.couponForm.total = 0
      this.couponForm.lastTotal = 0
      this.couponForm.addTotal = 0
      this.couponForm.couponUsingFlag = 0
      this.couponForm.organizationId = undefined

      this.fixedUseTime = []
      this.fixedReceiveTime = []

	    this.couponForm.couponContent = ''

      this.couponBackground.url = ''
	    this.couponForm.gainBeforeImg = ''
	    this.couponForm.gainAfterImg = ''

      // this.resetForm('couponForm')
    },
    // 新增按钮
    handleAdd() {
      this.reset()
      this.open = true
      this.title = '添加优惠券'
      this.disable = false

      this.couponFormShow.disabledTotal = false // 新增时发布数量不禁用
      this.couponFormShow.ifLastTotal = false  // 新增时剩余数量不显示
      this.couponFormShow.ifAddTotal = false  // 新增时增加数量不显示
    },
    //核销列表
    checkoutPage(row){
      let couponId = row.couponId
      let params  = {
        c : couponId
      }
      this.$router.push({
        path: '/sqh/product/coupon/checkout', query: params
      })
    },
    // 修改按钮
    handleUpdate(row) {
      this.reset()
      this.couponForm.couponId = row.couponId
      let params = {
        couponId: this.couponForm.couponId
      }
      couponInfo(params).then(response => {
        let coupon = response.data
        this.couponForm.couponName = coupon.couponName
        this.couponForm.couponType = Number(coupon.couponType)

				if(coupon.gainBeforeImg){
					this.couponForm.gainBeforeImg = coupon.gainBeforeImg
				}
				if(coupon.gainAfterImg){
					this.couponForm.gainAfterImg = coupon.gainAfterImg
				}

        //领取限时
        this.couponForm.isFixedReceive = Number(coupon.isFixedReceive)
        if (coupon.isFixedReceive != 0) {
          this.couponForm.receiveStartTime = coupon.receiveStartTime
          this.couponForm.receiveEndTime = coupon.receiveEndTime
          this.fixedReceiveTime.push(coupon.receiveStartTime)
          this.fixedReceiveTime.push(coupon.receiveEndTime)
        }
        //使用限时
        this.couponForm.isFixedUse = Number(coupon.isFixedUse)
        if (coupon.isFixedUse == 0) {
          this.couponForm.useDay = Number(coupon.useDay)
        }else if(coupon.isFixedUse == 1){
          this.couponForm.useStartTime = coupon.useStartTime
          this.couponForm.useEndTime = coupon.useEndTime
          this.fixedUseTime.push(coupon.useStartTime)
          this.fixedUseTime.push(coupon.useEndTime)
        }
        //限量
        this.couponForm.isLimited = Number(coupon.isLimited)
        if (coupon.isLimited == 0) {
          //不限量
          this.couponFormShow.disabledTotal = false // 发布数量不禁用
          this.couponFormShow.ifLastTotal = false // 不显示余量
          this.couponFormShow.ifAddTotal = false // 不显示添加数量
        }else if(coupon.isLimited == 1){
          // 限量
          if(coupon.total> 0){
            this.couponForm.total = coupon.total
            this.couponFormShow.disabledTotal = true
          }
          if(coupon.lastTotal > 0){
            this.couponForm.lastTotal = coupon.lastTotal
            this.couponFormShow.ifLastTotal = true // 显示余量
          }
          this.couponFormShow.ifAddTotal = true
        }
        //排序
        // this.couponForm.sort = coupon.sort
	      if(coupon.couponContent){
		      this.couponForm.couponContent = coupon.couponContent
	      }
        //状态
        this.couponForm.couponUsingFlag = Number(coupon.couponUsingFlag)
        this.open = true
      })
    },
    // 表单提交
    couponSubmit() {
      if (this.couponForm.isFixedReceive == 0) {
        this.couponForm.receiveStartTime = ''
        this.couponForm.receiveEndTime = ''
      } else {
        this.couponForm.receiveStartTime = this.fixedReceiveTime[0]
        this.couponForm.receiveEndTime = this.fixedReceiveTime[1]
      }
      if (this.couponForm.isFixedUse == 0) {
        this.couponForm.useStartTime = ''
        this.couponForm.useEndTime = ''
      } else {
        this.couponForm.useStartTime = this.fixedUseTime[0]
        this.couponForm.useEndTime = this.fixedUseTime[1]
      }

      this.$refs['couponForm'].validate(valid => {
        if (valid) {
          // console.log(this.couponForm)
          this.couponForm.organizationId = sessionStorage.getItem('organizationId')
          // console.log(this.couponForm.organizationId, 'this.couponForm.organizationId')
          if (this.couponForm.couponId) {
            couponEdit(this.couponForm).then(response => {
              this.$modal.msgSuccess('修改成功')
              this.open = false
              this.getList()
            })
          } else {
            couponAdd(this.couponForm).then(response => {
              this.$modal.msgSuccess('新增成功')
              this.open = false
              this.getList()
            })
          }
        }
      })
    },
    // 弹出层取消
    couponCancel() {
      this.open = false
    },
    // 图库删除按钮
    handleDelete(row) {
      this.reset()
      let params = {
        couponId: row.couponId
      }
      this.$modal.confirm('是否确认删除优惠券编号为"' + row.couponId + '"的数据项？').then(function() {
        return couponRemove(params)
      }).then(() => {
        this.getList()
        this.$modal.msgSuccess('删除成功')
      }).catch((e) => {
        console.log(e)
      })
    },
    // 图库批量删除按钮
    handleDeletes() {
      this.reset()
      let params = {
        couponIds: this.ids
      }
      this.$modal.confirm('是否确认删除优惠券编号为"' + this.ids + '"的数据项？').then(function() {
        return couponRemoves(params)
      }).then(() => {
        this.getList()
        this.$modal.msgSuccess('删除成功')
      }).catch(() => {
        console.log(e)
      })
    },
    // =========== 优惠券日志操作 start===========
    logQuery() {
      this.log.queryParams.pageNum = 1
      this.getLogList()
    },
    logQueryReset() {
      this.log.dateRange = []
      this.resetForm('logQueryFrom')
      this.log.queryParams.targetId = undefined
      this.log.list = []
    },
    getLogList() {
      this.$modal.loading('正在更新日志数据，请稍候...')
      couponLogList(this.addDateRange(this.log.queryParams, this.log.dateRange)).then(response => {
        this.log.list = response.rows
        this.log.total = response.total
        this.$modal.closeLoading()
      })
    },
    logOpen(row) {
      this.logQueryReset()
      this.log.queryParams.targetId = row.couponId
      this.logQuery()
      this.log.open = true
    },
    logClose() {
      this.log.open = false
    },
    // =========== 优惠券日志操作 end===========
    // 文件上传相关 start
    backgroundPreview(url) {
      this.couponBackground.url = url
      this.couponBackground.visible = true
    },
    backgroundPreviewClose() {
      this.couponBackground.visible = false
    },
    // 文件列表移除文件时的钩子
    backgroundRemove(imgSource) {
			if(imgSource == 'PRODUCT_COUPON_BEFORE_IMG'){
					this.couponForm.gainBeforeImg = ''
			} else if(imgSource == 'PRODUCT_COUPON_AFTER_IMG'){
				this.couponForm.gainAfterImg = ''
			}

    },
    uploadTypeOpen(imgSource) {
      let _this = this
      const inputFile = document.createElement('input')
      inputFile.type = 'file'
      inputFile.style.display = 'none'
      document.body.appendChild(inputFile)
      inputFile.click()
      //图片
      const fileType = ['jpg', 'jpeg', 'png','gif']
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
        couponUpload(formData).then(response => {
	        if(imgSource == 'PRODUCT_COUPON_BEFORE_IMG'){
		        _this.couponForm.gainBeforeImg = response.data.fileVirtualPath
		        _this.$modal.closeLoading()
	        } else if(imgSource == 'PRODUCT_COUPON_AFTER_IMG'){
		        _this.couponForm.gainAfterImg = response.data.fileVirtualPath
		        _this.$modal.closeLoading()
	        }

        })
      })
    },
    // 文件上传相关 end

  }
}
</script>

<style>
.el_dialog_img{
  max-height: 28rem;margin: auto;
  max-width: 50rem;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
