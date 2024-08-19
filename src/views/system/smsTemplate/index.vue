<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="模版名称" prop="templateName">
        <el-input
          v-model="queryParams.templateName"
          placeholder="请输入短信模版名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="链接" prop="link">
        <el-input
          v-model="queryParams.link"
          placeholder="请输入链接"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="公司名称" prop="companyName">
        <el-input
          v-model="queryParams.companyName"
          placeholder="请输入公司名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="电话号码" prop="phone">
        <el-input
          v-model="queryParams.phone"
          placeholder="请输入电话号码"
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
          v-hasPermi="['system:template:add']"
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
          v-hasPermi="['system:template:edit']"
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
          v-hasPermi="['system:template:remove']"
        >删除</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="templateList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="模版名称" align="center" prop="templateName" />
      <el-table-column label="短信模板" align="center" prop="smsTemplate"  width="110" >
        <template slot-scope="{ row }">
          <span v-if="row.smsTemplate == 1">预约成功通知</span>
          <span v-if="row.smsTemplate == 2">订单通知</span>
          <span v-if="row.smsTemplate == 3">售后订单通知</span>
        </template>
      </el-table-column>
      <el-table-column label="发送短信状态" align="center" prop="sendStatus" >
      <template slot-scope="{ row }">
        <span v-if="row.sendStatus == 3">已发货</span>
        <span v-if="row.sendStatus == 5">已完成</span>
      </template>
      </el-table-column>
      <el-table-column label="链接" align="center" prop="link"  width="250" />
      <el-table-column label="公司名称" align="center" prop="companyName"/>
      <el-table-column label="电话号码" align="center" prop="phone" width="120"/>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="250">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['system:template:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-document"
            @click="handleOrganizationList(scope.row.id)"
            v-hasPermi="['system:template:addOrganization']"
          >组织关系</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:template:remove']"
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

    <!-- 添加或修改短信模板对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body :close-on-click-modal="false">
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-form-item label="短信模板" prop="smsTemplate">
          <el-select v-model="form.smsTemplate" placeholder="请选择短信模板">
            <el-option
              v-for="dict in smsTemplateEnum"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="发送状态" prop="sendStatus" v-if="form.smsTemplate === 1">
          <el-select v-model="form.sendStatus" placeholder="请选择发送短信状态">
            <el-option
              v-for="dict in sendStatusEnum"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="模板名称" prop="templateName">
          <el-input v-model="form.templateName" placeholder="请输入短信模板名称" />
        </el-form-item>
        <el-form-item label="链接" prop="link">
          <el-input v-model="form.link" placeholder="请输入链接" />
        </el-form-item>
        <el-form-item label="公司名称" prop="companyName" v-if="form.smsTemplate === 1">
          <el-input v-model="form.companyName" placeholder="请输入公司名称" />
        </el-form-item>
        <el-form-item label="电话号码" prop="phone" v-if="form.smsTemplate === 1">
          <el-input v-model="form.phone" placeholder="请输入电话号码" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
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
      <span slot="footer" class="dialog-footer">
					<el-button @click="organizationClose">取 消</el-button>
					<el-button type="primary" @click="submitOrganization">添加</el-button>
				</span>
    </el-dialog>

  </div>
</template>

<script>
import {
  listTemplate,
  getTemplate,
  delTemplate,
  addTemplate,
  updateTemplate,
  deleteOrganization,
  addOrganization,
  getOrganizationList
} from '@/api/system/smsTemplate/smsTemplate';
import { unallocatedOrganizationList } from '@/api/tool/tweetArticle'

export default {
  name: "Template",
  data() {
    return {
      sendStatusEnum: [
        {
          value: 3,
          label: "已发货",
        },
        {
          value: 5,
          label: "已完成",
        },
      ],
    smsTemplateEnum: [
        {
          value: 1,
          label: "预约成功通知",
        },
        {
          value: 2,
          label: "订单通知",
        },
        {
          value: 3,
          label: "售后订单通知",
        },
      ],
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
      // 短信模板表格数据
      templateList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        link: null,
        companyName: null,
        templateName: null,
        phone: null
      },
      // 表单参数
      form: {
        id: null,
        templateName: null,
        link: null,
        companyName: null,
        phone: null,
        smsTemplate: null,
        sendStatus: null,
      },
      // 表单校验
      rules:{
        smsTemplate: [
          { required: true, message: "短信模板不能为空", trigger: "change" }
        ],
        sendStatus: [
          { required: true, message: "发送短信状态不能为空", trigger: "change" }
        ],
        templateName: [
          { required: true, message: "模板名称不能为空", trigger: "blur" }
        ],
        link: [
          { required: true, message: "链接不能为空", trigger: "blur" }
        ],
        companyName: [
          { required: true, message: "公司名称不能为空", trigger: "blur" }
        ],
        phone: [
          { required: true, message: "电话号码不能为空", trigger: "blur" }
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
  },
  methods: {
    /** 查询产品模版列表 */
    getList() {
      this.loading = true;
      listTemplate(this.queryParams).then(response => {
        this.templateList = response.rows;
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
        templateName: null,
        link: null,
        companyName: null,
        phone: null,
        smsTemplate: 1,
        sendStatus: null,
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
      this.title = "添加短信模板";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getTemplate(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateTemplate(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addTemplate(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除短信模板编号为"' + ids + '"的数据项？').then(function() {
        return delTemplate(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
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
