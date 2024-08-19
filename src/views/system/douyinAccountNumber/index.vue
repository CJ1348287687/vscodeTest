<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="账号UID" prop="accountUid">
        <el-input
          v-model="queryParams.accountUid"
          placeholder="请输入账号UID"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="账号名称" prop="accountName">
        <el-input
          v-model="queryParams.accountName"
          placeholder="请输入账号名称"
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
          v-hasPermi="['system:accountNumber:add']"
        >新增</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="accountNumberList" @selection-change="handleSelectionChange">
      <el-table-column label="账号UID" align="center" prop="accountUid" />
      <el-table-column label="账号名称" align="center" prop="accountName"/>
      <el-table-column label="账号管理组织" align="center" prop="organizationName" />
      <el-table-column label="账号管理员" align="center" prop="nickName" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="250">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-show="scope.row.accountAdministrator == userId || userId == 1"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-document"
            @click="handleOrganizationList(scope.row.id)"
            v-show="scope.row.accountAdministrator == userId || userId == 1"
          >查看权限</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-show="scope.row.accountAdministrator == userId || userId == 1"
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
        <el-form-item label="账号UID" prop="accountUid">
          <el-input v-model="form.accountUid" placeholder="请输入账号UID" />
        </el-form-item>
        <el-form-item label="账号名称" prop="accountName">
          <el-input v-model="form.accountName" placeholder="请输入链接" />
        </el-form-item>
        <el-form-item label="账号管理组织" prop="accountManagementOrganization"
          :rules="[
                  { required: true, message: '请选择账号管理组织', trigger: 'change' },
                ]"
        >
          <el-select
            v-model="form.accountManagementOrganization"
            clearable
            filterable
            placeholder="请选择账号管理组织"
            @change="(id) => getOrganizationIdEnum(id, true)"
          >
            <el-option
              v-for="dict in organizationEnum"
              :key="dict.organizationId"
              :label="dict.organizationName"
              :value="dict.organizationId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="账号管理员" prop="accountAdministrator"
          :rules="[
                  { required: true, message: '请选择账号管理员', trigger: 'change' },
                ]"
        >
          <el-select
            v-model="form.accountAdministrator"
            clearable
            filterable
            placeholder="请选择账号管理员"
          >
            <el-option
              v-for="dict in defaultHandleEnum"
              :key="dict.userId"
              :label="dict.nickName"
              :value="dict.userId"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 组织列表 -->
    <el-dialog title="可查看组织列表" :visible.sync="openOrganizationList" width="50%" append-to-body :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false">
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

    <!--    待选可查看组织列表-->
    <el-dialog title="待选可查看组织列表" :visible.sync="organizationUnallocated.open" class="dsgxDialog" width="55%"
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
  listAccountNumber,
  getAccountNumber,
  delAccountNumber,
  addAccountNumber,
  updateAccountNumber,
  deleteOrganization,
  addOrganization,
  getOrganizationList
} from '@/api/system/douyinAccountNumber/accountNumber';
import { unallocatedOrganizationList } from '@/api/tool/tweetArticle'
import {manageUserOrganization, organizationUser} from "@/api/system/production/tweet";

export default {
  name: "AccountNumber",
  data() {
    return {
      organizationEnum: [],
      defaultHandleEnum: [],
      organizationId: sessionStorage.getItem("organizationId"),
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      userId: sessionStorage.getItem("userId"),
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      //账号表格数据
      accountNumberList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        accountUid: null,
        accountName: null,
        accountManagementOrganization: null,
      },
      // 表单参数
      form: {
        id: null,
        accountUid: null,
        accountName: null,
        accountManagementOrganization: null,
        accountAdministrator: null,
      },
      // 表单校验
      rules:{
        accountUid: [
          { required: true, message: "账号UID不能为空", trigger: "blur" }
        ],
        accountName: [
          { required: true, message: "账号名称不能为空", trigger: "blur" }
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
      accountNumberId:null,
    };
  },
  created() {
    this.getList();
    this.getManageUserOrganization();
  },
  methods: {
    /** 查询产品模版列表 */
    getList() {
      this.loading = true;
      console.log("userId=",this.userId)
      this.queryParams.accountManagementOrganization = this.organizationId;
      listAccountNumber(this.queryParams).then(response => {
        this.accountNumberList = response.rows;
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
        accountUid: null,
        accountName: null,
        accountManagementOrganization: null,
        accountAdministrator: null,
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
      getAccountNumber(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改";
        this.getOrganizationIdEnum(row.accountManagementOrganization,false)
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateAccountNumber(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addAccountNumber(this.form).then(response => {
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
        return delAccountNumber(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    //已选择组织关系
    handleOrganizationList(id){
      this.accountNumberId = id
      this.openOrganizationList = true
      this.resetQueryOrganization();
    },
    /** 查询列表 */
    getOrganizationList() {
      this.loadingOrganization = true;
      this.queryParamsOrganization.id = this.accountNumberId
      getOrganizationList(this.queryParamsOrganization).then(response => {
        this.organizationList = response.rows;
        this.totalOrganization = response.total;
        this.loadingOrganization = false;
      });
    },
    // 取消按钮
    cancelOrganizationList() {
      this.accountNumberId = null
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
        "id":this.accountNumberId,
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
    //获取组织
    getManageUserOrganization() {
      manageUserOrganization({
      }).then((response) => {
        console.log("纳管组织", response);
        if (Array.isArray(response?.data)) {
          this.organizationEnum = response.data;
        }
      });
    },
    getOrganizationIdEnum(id, inClear) {
      if (inClear) {
        this.form.toUserId = null;
      }
      if (!id) return;
      organizationUser({
        organizationId: id,
      }).then((response) => {
        if (Array.isArray(response?.data)) {
          this.defaultHandleEnum = response.data;
        }
      });
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
