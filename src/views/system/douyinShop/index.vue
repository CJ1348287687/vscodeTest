<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="100px">
      <el-form-item label="店铺编码" prop="shopId">
        <el-input
          v-model="queryParams.shopId"
          placeholder="请输入店铺编码"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="店铺名称" prop="shopName">
        <el-input
          v-model="queryParams.shopName"
          placeholder="请输入店铺名称"
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
          v-hasPermi="['system:shop:add']"
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
          v-hasPermi="['system:shop:edit']"
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
          v-hasPermi="['system:shop:remove']"
        >删除</el-button>
      </el-col>
      <!-- <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['system:shop:export']"
        >导出</el-button>
      </el-col> -->
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="shopList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="店铺名称" align="center" prop="shopName" />
      <el-table-column label="解密次数" align="center" prop="jmNum" />
      <el-table-column label="店铺编码" align="center" prop="shopId" />
      <el-table-column label="appKey" align="center" prop="appKey" />
      <!-- <el-table-column label="appSecret" align="center" prop="appSecret" /> -->
      <el-table-column label="创建时间" align="center" prop="createTime">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-document"
            @click="handleOrganizationList(scope.row)"
            v-hasPermi="['system:product:addOrganization']"
          >组织关系</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['system:shop:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:shop:remove']"
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

    <!-- 添加或修改抖音店铺对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="店铺名称" prop="shopName">
          <el-input v-model="form.shopName" placeholder="请输入店铺名称" />
        </el-form-item>
        <el-form-item label="解密次数" prop="jmNum">
          <el-input v-model="form.jmNum" type="number" placeholder="请输入解密次数" />
        </el-form-item>
        <el-form-item label="店铺编码" prop="shopId">
          <el-input v-model="form.shopId" placeholder="请输入店铺编码" />
        </el-form-item>
        <el-form-item label="appKey" prop="appKey">
          <el-input v-model="form.appKey" placeholder="请输入appKey" />
        </el-form-item>
        <el-form-item label="appSecret" prop="appSecret">
          <el-input v-model="form.appSecret" placeholder="请输入appSecret" />
        </el-form-item>
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


  </div>
</template>

<script>
import { listShop, getShop, delShop, addShop, updateShop, addOrganization } from "@/api/system/douyinShop/shop";
import { manageUserOrganizationSelect } from "@/api/system/production/tweet";

export default {
  name: "Shop",
  data() {
    return {
	  organizationName:'',
	  multipleSelection:[],
      sessionOrgId:sessionStorage.getItem('organizationId'),
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
      // 抖音店铺表格数据
      shopList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
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
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        shopName: null,
        shopId: null,
        appKey: null,
        appSecret: null,
        status: null,
        uodateTime: null,
        toOrganizationIdIsNull:'',
      },
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
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        shopName: [
          { required: true, trigger: "blur", message: "请输入店铺名称" }
        ],
        shopId: [
          { required: true, trigger: "blur", message: "请输入店铺编码" }
        ],
        appKey: [
          { required: true, trigger: "blur", message: "请输入appKey" }
        ],
      }
    };
  },
  created() {
    this.getList();
    this.getManageUserOrganization();
  },
  methods: {
    /** 查询抖音店铺列表 */
    getList() {
      this.loading = true;
      listShop(this.queryParams).then(response => {
        this.shopList = response.rows;
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
        shopName: null,
        shopId: null,
        appKey: null,
        jiNum:null,
        appSecret: null,
        status: null,
        createTime: null,
        createBy: null,
        uodateTime: null,
        updateBy: null
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
      this.title = "添加店铺";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getShop(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改店铺";
      });
    },
    /** 选择组织-----开始 */
    //获取纳管组织
    getManageUserOrganization() {
      manageUserOrganizationSelect(
        this.organizationUnallocated.queryParams
      ).then((response) => {
        this.organizationListDefault = response.data;
      });
    },
    //纳管组织关系--处理已选择的
    handleOrganizationList(row) {
      this.productId = row.id;
      this.organizationUnallocated.open = true;
      this.organizationUnallocated.queryParams.organizationId = undefined;
      this.organizationUnallocated.queryParams.organizationName = "";
      this.organizationUnallocated.list = this.organizationListDefault;
	  this.organizationName = row.organizationId
	  console.log(row,this.organizationName,'row----222')
      this.setOrganizationUnallocatedTableSelect(row);
    },
    //表单选项回显
    setOrganizationUnallocatedTableSelect(row) {
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
    // 取消组织关系框
    organizationClose() {
      this.organizationUnallocated.ids = [];
      this.organizationUnallocated.open = false;
    },
    /** 搜索按钮操作 */
    handleQueryOrganization() {
      this.getOrganizationList();
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
    			if(item.organizationId){
    				if (item.organizationId == this.organizationName) {
    					this.$refs.organizationUnallocatedTable.toggleRowSelection(item, true);
    					this.multipleSelection.push(item);
    				}
    			}
    		});
    	  }, 0);
    	});
      });
    },
    /** 重置按钮操作 */
    resetQueryOrganization() {
      this.organizationUnallocated.queryParams.organizationId = undefined;
      this.organizationUnallocated.queryParams.organizationName = "";
      this.handleQueryOrganization();
    },
    getRowKeys(row) {
      return row.organizationId;
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
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateShop(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addShop(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除抖音店铺编号为"' + ids + '"的数据项？').then(function() {
        return delShop(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('system/shop/export', {
        ...this.queryParams
      }, `shop_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
