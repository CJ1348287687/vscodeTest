<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="100px">
      <el-form-item label="模版类型名称" prop="templateType">
        <el-input
          v-model="queryParams.templateType"
          placeholder="请输入模版类型名称"
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
          v-hasPermi="['system:type:add']"
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
          v-hasPermi="['system:type:edit']"
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
          v-hasPermi="['system:type:remove']"
        >删除</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="typeList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="模板类型名称" align="center" prop="templateType" />
      <el-table-column label="系统内置" align="center" prop="builtIn" >
        <template slot-scope="{ row }">
          <span v-if=" row.builtIn==1">是</span>
          <span v-if=" row.builtIn==0">否</span>
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
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['system:type:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-document"
            @click="handleOrganizationList(scope.row.id)"
            v-if="scope.row.builtIn=='0'"
          >组织关系</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:type:remove']"
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

    <!-- 添加或修改产品模版类型对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="模版类型" prop="templateType">
          <el-input v-model="form.templateType" placeholder="请输入模版类型名称" />
        </el-form-item>
        <el-form-item label="系统内置" prop="builtIn">
          <el-radio-group v-model="form.builtIn">
            <el-radio label="1">是</el-radio>
            <el-radio label="0">否</el-radio>
          </el-radio-group>
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

      <el-table v-loading="loadingOrganization" :data="organizationList">
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
      <el-table height="440" ref="organizationUnallocatedTable" v-loading="loading" :data="organizationUnallocated.list" :row-key="getRowKeys" @selection-change="handleSelectionChangeOrganization">
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
import { listType, getType, delType, addType, updateType, updateTypeStatus,
  addOrganization,deleteOrganization,getOrganizationList } from '@/api/system/mbtype/type'
import { unallocatedOrganizationList } from '@/api/tool/tweetArticle'

export default {
  name: "Type",
  dicts: ['sys_yes_no'],
  data() {
    return {
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
      ss: 0,
      // 总条数
      total: 0,
      // 产品模版类型表格数据
      typeList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        templateType: null,
        builtIn: null,
        status: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        templateType: [
          { required: true, message: "模板类型名称不能为空", trigger: "blur" }
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
      productMbTypeId:null,

    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询产品模版类型列表 */
    getList() {
      this.loading = true;
      listType(this.queryParams).then(response => {
        this.typeList = response.rows;
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
        templateType: null,
        builtIn: '0',
        status: null,
        createBy: null,
        updateBy: null,
        createTime: null,
        updateTime: null
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
      getType(id).then(response => {
        this.form = response.data;
        this.form.builtIn = response.data.builtIn+"";
        this.open = true;
        this.title = "修改";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateType(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addType(this.form).then(response => {
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
      this.$modal.confirm('确认要"' + text + '""' + row.templateType + '"类型吗？').then(function() {
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
      this.$modal.confirm('是否确认删除数据项？').then(function() {
        return delType(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('system/type/export', {
        ...this.queryParams
      }, `type_${new Date().getTime()}.xlsx`)
    },

    //已选择组织关系
    handleOrganizationList(id){
      this.productMbTypeId = id
      this.openOrganizationList = true
      this.resetQueryOrganization();
    },
    /** 查询列表 */
    getOrganizationList() {
      this.loadingOrganization = true;
      this.queryParamsOrganization.id = this.productMbTypeId
      getOrganizationList(this.queryParamsOrganization).then(response => {
        this.organizationList = response.rows;
        this.totalOrganization = response.total;
        this.loadingOrganization = false;
      });
    },
    // 取消按钮
    cancelOrganizationList() {
      this.productMbTypeId = null
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
        "id":this.productMbTypeId,
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