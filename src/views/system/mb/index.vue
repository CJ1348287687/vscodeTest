<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="模板类型" prop="productMbTypeId">
        <el-select v-model="queryParams.productMbTypeId" placeholder="请选择模板类型">
          <el-option
            v-for="dict in mbtypeList"
            :key="dict.id"
            :label="dict.templateType"
            :value="dict.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="模版名称" prop="templateName">
        <el-input
          v-model="queryParams.templateName"
          placeholder="请输入模版名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
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
          v-hasPermi="['system:mb:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['system:mb:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['system:mb:remove']"
        >删除</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="mbList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />

      <el-table-column label="模版类型名称" align="center" prop="mbTypeName" />
      <el-table-column label="模版名称" align="center" prop="templateName" />
      <el-table-column label="系统内置" align="center" prop="builtIn" >
        <template slot-scope="{ row }">
          <span v-if=" row.builtIn==1">是</span>
          <span v-if=" row.builtIn==0">否</span>
        </template>
      </el-table-column>
      <el-table-column label="订单枚举值" align="center" prop="orderStatus" />
      <el-table-column label="跟踪枚举值" align="center" prop="orderTrackStatus" />
      <el-table-column label="产品添加字段" align="center" prop="productRemark" />
      <el-table-column label="默认产品图" align="center" prop="productImage" width="100">
        <template slot-scope="scope">
          <image-preview v-if="scope.row.productImage!=null" :src="scope.row.productImage" :width="50" :height="50"/>
        </template>
      </el-table-column>
      <el-table-column label="表单结果图" align="center" prop="bdResultImage" width="100">
        <template slot-scope="scope">
          <image-preview v-if="scope.row.bdResultImage!=null" :src="scope.row.bdResultImage" :width="50" :height="50"/>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.status"
            active-value="0"
            inactive-value="1"
            @change="handleStatusChange(scope.row)"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="250">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['system:mb:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-document"
            @click="handleOrganizationList(scope.row.id)"
            v-hasPermi="['system:mb:addOrganization']"
            v-if="scope.row.builtIn=='0'"
          >组织关系</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-document"
            @click="handleOption(scope.row)"
          >状态列表</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:mb:remove']"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改产品模版对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-form-item label="模板类型" prop="productMbTypeId">
          <el-select v-model="form.productMbTypeId" placeholder="请选择模板类型">
            <el-option
              v-for="dict in mbtypeList"
              :key="dict.id"
              :label="dict.templateType"
              :value="dict.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="模版名称" prop="templateName">
          <el-input v-model="form.templateName" placeholder="请输入模版名称" />
        </el-form-item>
        <el-form-item label="系统内置" prop="builtIn">
          <el-radio-group v-model="form.builtIn">
            <el-radio label="1">是</el-radio>
            <el-radio label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="产品添加字段" prop="productRemarkArray">
          <el-checkbox-group v-model="form.productRemarkArray">
            <el-checkbox v-for="dict in dict.type.product_remark"
              :key="dict.value" :label="dict.value">
              {{dict.label}}
            </el-checkbox>
          </el-checkbox-group>
          <!-- <el-input v-model="form.productRemark" placeholder="请输入产品添加字段" /> -->
        </el-form-item>
        <el-form-item label="默认产品图片" prop="productImage">
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
        <el-form-item label="默认表单结果页" prop="bdResultImage">
          <el-row>
            <el-col v-if="bdResultImage.wcQrc.url != ''">
              <img
                :src="bdResultImage.wcQrc.url"
                style="width: 148px;height: 148px ;border:1px solid"
                @click="imagePreview(bdResultImage.wcQrc.url,2)"
              />
              <img src="../../../assets/images/delete.png"
                   style="width: 20px;height: 20px;position: relative;top: -120px;left: -25px;"
                   @click="imageRemove(bdResultImage.wcQrc.name,2)"
              >
            </el-col>
            <el-col v-if="bdResultImage.wcQrc.url == ''">
              <div tabindex="0" class="el-upload el-upload--picture-card" style="width: 148px;height: 148px"
                   @click="uploadTypeOpen(bdResultImage.wcQrc.name,2)"
              >
                <i class="el-icon-plus"></i>
              </div>
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>


    <!-- 状态列表 -->
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
          <el-button icon="el-icon-refresh" size="mini" @click="resetQueryOption">重置</el-button>
        </el-form-item>
      </el-form>
      <el-row :gutter="10" class="mb8">
        <el-col :span="1.5">
          <el-button
            type="primary"
            plain
            icon="el-icon-plus"
            size="mini"
            @click="handleAddOption"
            v-hasPermi="['system:mb:add','system:mb:edit']"
          >新增</el-button>
        </el-col>
        <right-toolbar :showSearch.sync="showSearchOption" @queryTable="getOptionList"></right-toolbar>
      </el-row>

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
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width" >
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              icon="el-icon-edit"
              @click="handleUpdateOption(scope.row)"
              v-hasPermi="['system:mb:add','system:mb:edit']"
            >修改</el-button>
            <el-button
              size="mini"
              type="text"
              icon="el-icon-delete"
              @click="handleDeleteOption(scope.row)"
              v-hasPermi="['system:mb:add','system:mb:edit']"
            >删除</el-button>
          </template>
        </el-table-column>
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

    <!-- 添加或修改选项对话框 -->
    <el-dialog :title="title" :visible.sync="openAddOption" width="550px" append-to-body :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false">
      <el-form ref="formOption" :model="formOption" :rules="rulesOption" label-width="130px">
        <el-form-item label="订单状态值" prop="orderStatus" >
          <el-input v-model="formOption.orderStatus" placeholder="请输入订单状态枚举值" style="width:300px"/>
        </el-form-item>
        <el-form-item label="订单跟踪值" prop="orderTrackStatus" width="250px">
          <el-input v-model="formOption.orderTrackStatus" placeholder="请输入订单跟踪枚举值" style="width:300px"/>
        </el-form-item>
        <el-form-item label="触发" prop="trigger">
          <el-radio-group v-model="formOption.trigger">
            <el-radio label="0">手动</el-radio>
            <el-radio label="1">自动</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="是否为初始默认值" prop="defaultValue">
          <el-radio-group v-model="formOption.defaultValue">
            <el-radio label="0">否</el-radio>
            <el-radio label="1">是</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input-number v-model="formOption.sort" :min="0" placeholder="请输入排序" />
        </el-form-item>
        <el-form-item label="服务跟踪" prop="remark" width="250px">
          <el-input type="textarea" v-model="formOption.remark" placeholder="请输入服务跟踪与状态映射" style="width:300px"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitFormOption" v-loading="saveLoading" :disabled="saveLoading" >保 存</el-button>
        <el-button @click="cancelAddOption">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 组织列表 -->
    <el-dialog title="组织列表" :visible.sync="openOrganizationList" width="50%" append-to-body :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false">
      <el-form :model="queryParamsOrganization" ref="queryParamsOrganization" size="small" :inline="true" v-show="showSearchOrganization" label-width="68px">
        <el-form-item label="组织名称" prop="organizationName">
          <el-input
            v-model="queryParamsOrganization.organizationName"
            placeholder="请输入组织名称"
            clearable
            @keyup.enter.native="handleQueryOrganization"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQueryOrganization">搜索</el-button>
          <el-button icon="el-icon-refresh" size="mini" @click="resetQueryOrganization">重置</el-button>
        </el-form-item>
      </el-form>
      <el-row :gutter="10" class="mb8">
        <el-col :span="1.5">
          <el-button
            type="primary"
            plain
            icon="el-icon-plus"
            size="mini"
            @click="handleAddOrganization"
            v-hasPermi="['system:type:addOrganization']"
          >新增</el-button>
        </el-col>
        <right-toolbar :showSearch.sync="showSearchOrganization" @queryTable="getOrganizationList"></right-toolbar>
      </el-row>

      <el-table v-loading="loadingOrganization" :data="organizationList" height="430">
        <el-table-column label="序号" type="index" align="center" width="100">
          <template slot-scope="scope">
            <span>{{(queryParamsOrganization.pageNum - 1) * queryParamsOrganization.pageSize + scope.$index + 1}}</span>
          </template>
        </el-table-column>
        <el-table-column label="组织编号" prop="organizationId" align="center" />
        <el-table-column label="组织名称" prop="organizationName" align="center" />
        <el-table-column label="所属部门" prop="deptName" align="center" />
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width" >
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              icon="el-icon-delete"
              @click="handleDeleteOrganization(scope.row)"
              v-hasPermi="['system:type:addOrganization']"
            >移除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        v-show="totalOrganization>0"
        :total="totalOrganization"
        :page.sync="queryParamsOrganization.pageNum"
        :limit.sync="queryParamsOrganization.pageSize"
        @pagination="getOrganizationList"
      />
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelOrganizationList">取 消</el-button>
      </div>
    </el-dialog>

    <!--    待选组织关系列表-->
    <el-dialog title="待选组织关系列表" :visible.sync="organizationUnallocated.open" class="dsgxDialog" width="55%"
               :close-on-click-modal="false" :close-on-press-escape="false" @close="organizationClose">
      <el-form :model="organizationUnallocated.queryParams" ref="organizationUnallocatedQueryForm" size="small" :inline="true" >
        <el-row>
          <el-col>
            <el-form-item label="组织编号" prop="organizationId">
              <el-input-number v-model="organizationUnallocated.queryParams.organizationId" :min="1" clearable :controls="false" placeholder="请输入组织编号"></el-input-number>
            </el-form-item>
            <el-form-item label="组织名称" prop="organizationName">
              <el-input v-model="organizationUnallocated.queryParams.organizationName" placeholder="请输入组织名称" clearable/>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" icon="el-icon-search" size="mini" @click="getOrganizationUnallocatedList">搜索</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-table height="439" ref="organizationUnallocatedTable" v-loading="loading" :data="organizationUnallocated.list" :row-key="getRowKeys" @selection-change="handleSelectionChangeOrganization">
        <el-table-column type="selection" width="55" align="center"></el-table-column>
        <el-table-column label="组织编号" prop="organizationId" width="100" align="center" />
        <el-table-column label="组织名称" prop="organizationName" width="250"
                         align="center" />
        <el-table-column label="所属部门" prop="deptName" width="250"
                         align="center" />
      </el-table>
      <!--				<pagination v-show="organizationUnallocated.total>0" :total="organizationUnallocated.total"-->
      <!--					:page.sync="organizationUnallocated.queryParams.pageNum"-->
      <!--					:limit.sync="organizationUnallocated.queryParams.pageSize"-->
      <!--					@pagination="getOrganizationUnallocatedList" />-->
      <span slot="footer" class="dialog-footer">
					<el-button @click="organizationClose">取 消</el-button>
					<el-button type="primary" @click="submitOrganization">添加</el-button>
				</span>
    </el-dialog>
    
  </div>
</template>

<script>
import { listMb, getMb, delMb, addMb, updateMb,mbTypeListByOrganizationId,updateTypeStatus,
  addOrganization,deleteOrganization,getOrganizationList,
  getOptionList,addOption,getOption,delOption,updateOption} from "@/api/system/mb/mb";
import { userUpload } from '@/api/system/user'
import { unallocatedOrganizationList } from '@/api/tool/tweetArticle'

export default {
  name: "Mb",
  dicts: ['product_remark'], 
  data() {
    return {
      organizationId: (sessionStorage.getItem("organizationId") == null || sessionStorage.getItem("organizationId") == ""?-1:sessionStorage.getItem("organizationId")),
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
      // 产品模版表格数据
      mbList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      mbtypeList:[],
      image: {
        wcQrc: {//产品默认图
          name: 'wcQrc',
          url: ''
        },
        url: '',
        visible: false
      },
      bdResultImage: {
        wcQrc: {//产品默认图
          name: 'wcQrc',
          url: ''
        },
        url: '',
        visible: false
      },
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        templateName: null,
        builtIn: null,
        status: null,
        productRemark: null,
        productImage: null,
        productMbTypeId: null
      },
      // 表单参数
      form: {
        
      },
      // 表单校验
      rules:{
        productMbTypeId: [
          { required: true, message: "模板类型不能为空", trigger: "change" }
        ],
        templateName: [
          { required: true, message: "模板名称不能为空", trigger: "blur" }
        ],
        productImage: [
          { required: true, message: "默认产品图片不能为空", trigger: "blur" }
        ],
      },
      //状态列表弹出层
      openOptionList:false,
      // 遮罩层
      loadingOption: true,
      // 显示搜索条件
      showSearchOption: true,
      // 总条数
      totalOption: 0,
      // 状态表格数据
      optionList: [],
      // 查询参数
      queryParamsOption: {
        pageNum: 1,
        pageSize: 10,
        productMbId: null,
        name: null,
      },
      // 状态添加弹出层
      openAddOption:false,
      saveLoading:false,
      // 表单参数
      formOption: {
        id:null,
        orderStatus:null,
        orderTrackStatus:null,
        trigger:"0",
        defaultValue:"0",
        sort:0,
        remark:null,
        productMbId:null,
      },
      // 表单校验
      rulesOption: {
        orderStatus: [
          { required: true, message: "订单状态值不能为空", trigger: "blur" }
        ],
        orderTrackStatus: [
          { required: true, message: "订单跟踪值不能为空", trigger: "blur" }
        ],
      },
      organizationUnallocated: {
        ids: [], //勾选的id
        open: false,
        total: 0,
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          organizationId:undefined,
          organizationName:'',
          allocatedOrganizationIds:[]
        },
        list: []
      },
      //组织关系列表
      openOrganizationList:false,
      loadingOrganization: true,
      showSearchOrganization: true,
      totalOrganization: 0,
      organizationList: [],
      queryParamsOrganization: {
        pageNum: 1,
        pageSize: 10,
        id: null,
        organizationName: '',
      },
      productMbId:null,
    };
  },
  created() {
    this.getList();
    //查询下拉数据
    let organizationId = sessionStorage.getItem('organizationId')
    organizationId = organizationId!=null ? organizationId : -1
    mbTypeListByOrganizationId(organizationId).then(response => {
      this.mbtypeList = response.data;
    });
  },
  methods: {
    // 文件列表移除文件时的钩子
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
          if(type == 1){
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
          }
          if(type == 2){
            if (name == _this.bdResultImage.wcQrc.name) {
              _this.bdResultImage.wcQrc.url = response.data.fileVirtualPath
              _this.form.bdResultImage = response.data.fileVirtualPath
              _this.form.wcQrcId2 = response.data.fileId
              _this.$modal.closeLoading()
            } else if (name == _this.bdResultImage.entWcQrc.name) {
              _this.bdResultImage.entWcQrc.url = response.data.fileVirtualPath
              _this.form.entWcQrcId2 = response.data.fileId
              _this.$modal.closeLoading()
            }
          }
        })
      })
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
    /** 查询产品模版列表 */
    getList() {
      this.loading = true;
      listMb(this.queryParams).then(response => {
        this.mbList = response.rows;
        console.log(response.rows[0])
        this.total = response.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
      this.imageRemove(this.image.wcQrc.name,1);
      this.imageRemove(this.image.wcQrc.name,2);
    },
    // 表单重置
    reset() {
      this.image={
        wcQrc: {//产品默认图
          name: 'wcQrc',
          url: ''
        },
        url: '',
        visible: false
      },
      this.bdResultImage={
        wcQrc: {//产品默认图
          name: 'wcQrc',
          url: ''
        },
        url: '',
        visible: false
      },
      this.form = {
        id: null,
        templateName: null,
        builtIn: '0',
        status: null,
        productRemark: null,
        productRemarkArray:[],
        productImage: null,
        createBy: null,
        updateBy: null,
        createTime: null,
        updateTime: null,
        productMbTypeId: null
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
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getMb(id).then(response => {
        response.data.productRemarkArray = (response.data.productRemark != null && response.data.productRemark != '') ? response.data.productRemark.split(",") : []
        this.form = response.data;
        this.image.wcQrc.url = response.data.productImage!=null ? response.data.productImage : ""
        this.bdResultImage.wcQrc.url = response.data.bdResultImage!=null ? response.data.bdResultImage : ""
        this.form.builtIn = response.data.builtIn+"";
        this.open = true;
        this.title = "修改";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if(this.form.productRemarkArray!=null){
          this.form.productRemark = this.form.productRemarkArray.join(",")
        }else{
          this.form.productRemark = ''
        }
        if (valid) {
          if (this.form.id != null) {
            updateMb(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addMb(this.form).then(response => {
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    // 状态修改
    handleStatusChange(row) {
      let text = row.status === '0' ? '启用' : '停用'
      this.$modal.confirm('确认要"' + text + '""' + row.templateName + '"类型吗？').then(function() {
        return updateTypeStatus(row.id, row.status)
      }).then(() => {
        this.$modal.msgSuccess(text + '成功')
      }).catch(function() {
        row.status = row.status === '0' ? '1' : '0'
      })
      // updateType(this.form).then(response => {
      //   this.$modal.msgSuccess("修改成功");
      //   this.getList();
      // });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$modal.confirm('是否确认删除产品模版编号为"' + ids + '"的数据项？').then(function() {
        return delMb(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('system/mb/export', {
        ...this.queryParams
      }, `mb_${new Date().getTime()}.xlsx`)
    },
    
    /** 查询状态列表 */
    handleOption(row) {
      this.productMbId = row.id;
      this.getOptionList();
      this.openOptionList = true;
    },

    /** 状态列表取消按钮 */
    cancelOption() {
      this.productMbId = null
      this.openOptionList = false;
      this.getList()
    },

    /** 搜索按钮操作 */
    handleQueryOption() {
      this.queryParamsOption.pageNum = 1;
      this.getOptionList();
    },
    /** 重置按钮操作 */
    resetQueryOption() {
      this.resetForm("queryParamsOption");
      this.handleQueryOption();
    },

    /** 查询项目任务记录列表 */
    getOptionList() {
      this.queryParamsOption.productMbId = this.productMbId;
      this.loadingOption = true;
      getOptionList(this.queryParamsOption).then(response => {
        this.optionList = response.rows;
        this.totalOption = response.total;
        this.loadingOption = false;
      });
    },
    /** 新增按钮操作 */
    handleAddOption() {
      this.resetOption();
      this.openAddOption = true;
      this.title = "添加状态";
    },
    // 表单重置
    resetOption() {
      this.formOption = {
        id:null,
        orderStatus:null,
        orderTrackStatus:null,
        trigger:"0",
        defaultValue:"0",
        sort:0,
        remark:null,
        productMbId:this.productMbId,
      };
      this.resetForm("formOption");
    },
    // 取消按钮
    cancelAddOption() {
      this.saveLoading = false;
      this.openAddOption = false;
      this.resetOption();
    },
    /** 提交按钮 */
    submitFormOption() {
      this.$refs["formOption"].validate(valid => {
        this.saveLoading = true;
        if(this.formOption.productMbId==null || this.formOption.productMbId==""){
          this.$modal.msgError("请刷新页面重试");
          this.saveLoading = false;
          return false;
        }
        if (valid) {
          if (this.formOption.id != null) {
            updateOption(this.formOption).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.cancelAddOption();
              this.getOptionList();
            });
          } else {
            this.formOption.productMbId = this.productMbId
            addOption(this.formOption).then(response => {
              this.$modal.msgSuccess("新增成功");
              this.cancelAddOption();
              this.getOptionList();
            });
          }
        }else{
          this.saveLoading = false;
        }
      });
    },
    /** 删除按钮操作 */
    handleDeleteOption(row) {
      const ids = row.id || this.ids;
      this.$modal.confirm('是否确认删除该状态？').then(function() {
        return delOption(ids);
      }).then(() => {
        this.getOptionList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 修改按钮操作 */
    handleUpdateOption(row) {
      this.resetOption();
      const id = row.id || this.ids
      getOption(id).then(response => {
        this.formOption = response.data;
        this.formOption.productMbId = response.data.productMbId;
        this.openAddOption = true;
        this.title = "修改状态";
      });
    },


    //已选择组织关系
    handleOrganizationList(id){
      this.productMbId = id
      this.openOrganizationList = true
      this.resetQueryOrganization();
    },
    /** 查询列表 */
    getOrganizationList() {
      this.loadingOrganization = true;
      this.queryParamsOrganization.id = this.productMbId
      getOrganizationList(this.queryParamsOrganization).then(response => {
        this.organizationList = response.rows;
        this.totalOrganization = response.total;
        this.loadingOrganization = false;
      });
    },
    // 取消按钮
    cancelOrganizationList() {
      this.productMbId = null
      this.openOrganizationList = false;
      this.resetForm("queryParamsOrganization");
    },
    /** 搜索按钮操作 */
    handleQueryOrganization() {
      this.queryParamsOrganization.pageNum = 1;
      this.getOrganizationList();
    },
    /** 重置按钮操作 */
    resetQueryOrganization() {
      this.resetForm("queryParamsOrganization");
      this.handleQueryOrganization();
    },

    /** 新增组织 **/
    handleAddOrganization() {
      this.organizationUnallocated.open = true;
      this.organizationUnallocated.queryParams.organizationId= undefined;
      this.organizationUnallocated.queryParams.organizationName= '';
      this.organizationUnallocated.ids = []
      this.getOrganizationUnallocatedList();
    },
    // 新增组织关系框
    organizationClose() {
      this.organizationUnallocated.ids = []
      this.organizationUnallocated.open = false
    },
    // 待选组织关系数据
    getOrganizationUnallocatedList() {
      this.loading = true
      //清空并获取已添加的组织id
      this.organizationUnallocated.queryParams.allocatedOrganizationIds = []
      for (let i = 0; i < this.organizationList.length; i++) {
        this.organizationUnallocated.queryParams.allocatedOrganizationIds.push(this.organizationList[i].organizationId)
      }
      console.log("queryParams",this.organizationUnallocated.queryParams)
      unallocatedOrganizationList(this.organizationUnallocated.queryParams).then(
        response => {
          this.organizationUnallocated.list = response.data
          this.loading = false
        })
    },
    getRowKeys(row) {
      return row.organizationId
    },
    handleDeleteOrganization(row){
      const ids = row.objectId;
      this.$modal.confirm('是否确认移除该组织？').then(function() {
        return deleteOrganization(ids);
      }).then(() => {
        this.getOrganizationList();
        this.$modal.msgSuccess("移除成功");
      }).catch(() => {});
    },
    submitOrganization() {
      if(this.organizationUnallocated.ids == null || this.organizationUnallocated.ids.length == 0){
        this.$modal.msgWarning('请选择要添加的组织')
        return;
      }
      //添加组织
      let parm = {
        "id":this.productMbId,
        "organizationIds": this.organizationUnallocated.ids
      }
      addOrganization(parm).then(response => {
        this.$modal.msgSuccess("新增成功");
        this.organizationUnallocated.open = false;
        this.getOrganizationList();
      });
    },
    handleSelectionChangeOrganization(selection) {
      this.organizationUnallocated.ids = selection.map(item => item.organizationId)
    },
    
  }
};
</script>
<style lang="scss">
  .dsgxDialog{
		.el-table__header, .el-table__body, .el-table__footer{
			width: 100% !important;
		}
	}
</style>