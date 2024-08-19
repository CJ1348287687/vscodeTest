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

    <el-table v-loading="loading" :data="accountNumberList" @selection-change="handleSelectionChange">
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
            :data="scope.row.accountNumberProductList"
          >
            <el-table-column label="商品图片" align="center" width="100">
              <template slot-scope="scope">
                <image-preview v-if="scope.row.img != null" :src="scope.row.img" :width="50" :height="50"/>
              </template>
            </el-table-column>
            <el-table-column label="商品标题" align="center" prop="name" width="300" />
            <el-table-column label="商品编码" align="center" prop="productId" width="200" />
            <el-table-column label="发展组织" align="center" width="120">
              <template slot-scope="scop">
                <span v-if="scop.row.sendOrganizationId != null">
                  {{ scop.row.sendOrganizationName }}
                </span>
              </template>
            </el-table-column>
            <el-table-column label="发展人" align="center" width="120">
              <template slot-scope="scop">
                <span v-if="scop.row.sendUserId != null">
                  {{ scop.row.sendNickName }}
                </span>
              </template>
            </el-table-column>
            <el-table-column label="受理组织" align="center" width="120">
              <template slot-scope="scop">
                <span v-if="scop.row.acceptOrganizationId != null">
                  {{ scop.row.acceptOrganizationName }}
                </span>
              </template>
            </el-table-column>
            <el-table-column label="受理人" align="center" width="120">
              <template slot-scope="scop">
                <span v-if="scop.row.acceptUserId != null">
                  {{ scop.row.acceptNickName }}
                </span>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="150" v-if="scope.row.accountAdministrator == userId || userId == 1">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="text"
                  icon="el-icon-edit"
                  @click="handleUpdateAccountNumberProduct(scope.row)"
                >修改</el-button>
                <el-button
                  size="mini"
                  type="text"
                  icon="el-icon-delete"
                  @click="handleDeleteAccountNumberProduct(scope.row)"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </template>
      </el-table-column>
      <el-table-column label="账号UID" align="center" prop="accountUid" />
      <el-table-column label="账号名称" align="center" prop="accountName"/>
      <el-table-column label="账号管理组织" align="center" prop="organizationName" />
      <el-table-column label="账号管理员" align="center" prop="nickName" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="250">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-document"
            @click="handleOneCodeConfigList(scope.row)"
            v-show="scope.row.accountAdministrator == userId || userId == 1"
          >新增配置</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :title="title" :visible.sync="open" class="dsgxDialog" width="1500px"
               :close-on-click-modal="false" :close-on-press-escape="false" @close="oneCodeConfigClose">
      <el-row :gutter="10" class="mb8" v-show="productFlag">
        <el-col :span="1.5">
          <el-button
            type="primary"
            plain
            icon="el-icon-plus"
            size="mini"
            @click="handleAddProduct"
          >新增</el-button>
        </el-col>
      </el-row>
      <el-form ref="form" :model="form"  label-width="120px">
        <el-table height="439" :data="form.items">
          <el-table-column label="商品名称" prop="name" width="210" align="center" />
          <el-table-column label="发展组织" align="center">
            <template slot-scope="scope">
              <el-form-item
                :prop="'items.' + scope.$index + '.sendOrganizationId'"
                :rules="[
                    { required: true, message: '请选择发展组织', trigger: 'change' },
                  ]"
              >
                <el-select
                  v-model="scope.row.sendOrganizationId"
                  clearable
                  filterable
                  placeholder="请选择发展组织"
                  @change="
                      (id) => getSendOrganizationChange(id, scope.$index, true)
                    "
                >
                  <el-option
                    v-for="dict in organizationEnum"
                    :key="dict.organizationId"
                    :label="dict.organizationName"
                    :value="dict.organizationId"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="能否配置"
                            :prop="'items.' + scope.$index + '.sendOrganizationConfig'"
                             style="margin-left: 2px">
                <el-radio-group v-model="scope.row.sendOrganizationConfig" size="small">
                  <el-radio-button label="1">能</el-radio-button>
                  <el-radio-button label="0">否</el-radio-button>
                </el-radio-group>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="发展人" align="center">
            <template slot-scope="scope">
              <el-form-item
                :prop="'items.' + scope.$index + '.sendUserId'"
                :rules="[
                    { required: true, message: '请选择发展人', trigger: 'change' },
                  ]"
              >
                <el-select
                  v-model="scope.row.sendUserId"
                  clearable
                  filterable
                  placeholder="请选择发展人"
                >
                  <el-option
                    v-for="dict in scope.row.sendAcceptorEnum"
                    :key="dict.userId"
                    :label="dict.nickName"
                    :value="dict.userId"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="能否配置"
                            :prop="'items.' + scope.$index + '.sendUserConfig'"
                            style="margin-left: 16px">
                <el-radio-group v-model="scope.row.sendUserConfig" size="small">
                  <el-radio-button label="1">能</el-radio-button>
                  <el-radio-button label="0">否</el-radio-button>
                </el-radio-group>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="受理组织" align="center">
            <template slot-scope="scope">
              <el-form-item
                :prop="'items.' + scope.$index + '.acceptOrganizationId'"
                :rules="[
                    { required: true, message: '请选择受理组织', trigger: 'change' },
                  ]"
              >
                <el-select
                  v-model="scope.row.acceptOrganizationId"
                  clearable
                  filterable
                  placeholder="请选择受理组织"
                  @change="
                      (id) => getOrganizationChange(id, scope.$index, true)
                    "
                >
                  <el-option
                    v-for="dict in organizationEnum"
                    :key="dict.organizationId"
                    :label="dict.organizationName"
                    :value="dict.organizationId"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="能否配置"
                            :prop="'items.' + scope.$index + '.acceptOrganizationConfig'"
                            style="margin-left: 16px">
                <el-radio-group v-model="scope.row.acceptOrganizationConfig" size="small">
                  <el-radio-button label="1">能</el-radio-button>
                  <el-radio-button label="0">否</el-radio-button>
                </el-radio-group>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="受理人" align="center" >
            <template slot-scope="scope">
              <el-form-item
                :prop="'items.' + scope.$index + '.acceptUserId'"
                :rules="[
                    { required: true, message: '请选择受理人', trigger: 'change' },
                  ]"
              >
                <el-select
                  v-model="scope.row.acceptUserId"
                  clearable
                  filterable
                  placeholder="请选择受理人"
                >
                  <el-option
                    v-for="dict in scope.row.acceptorEnum"
                    :key="dict.userId"
                    :label="dict.nickName"
                    :value="dict.userId"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="能否配置"
                            :prop="'items.' + scope.$index + '.acceptUserConfig'"
                            style="margin-left: 16px">
                <el-radio-group v-model="scope.row.acceptUserConfig" size="small">
                  <el-radio-button label="1">能</el-radio-button>
                  <el-radio-button label="0">否</el-radio-button>
                </el-radio-group>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="120" class-name="small-padding fixed-width" v-if="productFlag" >
            <template slot-scope="scope" >
              <el-button
                size="mini"
                type="text"
                icon="el-icon-delete"
                @click="handleDeleteProduct(scope.row,scope.$index)"
              >移除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form>
      <span slot="footer" class="dialog-footer">
					<el-button @click="oneCodeConfigClose">取 消</el-button>
					<el-button type="primary" @click="submitOneCodeConfig">保存</el-button>
				</span>
    </el-dialog>


    <!--    待选可查看列表-->
    <el-dialog title="待选可查看权限列表" :visible.sync="productUnallocated.open" class="dsgxDialog" width="55%"
               :close-on-click-modal="false" :close-on-press-escape="false" @close="productClose">
      <el-form :model="productUnallocated.queryParams" ref="productUnallocatedQueryForm" size="small" :inline="true" >
        <el-row>
          <el-col>
            <el-form-item label="商品名称" prop="name">
              <el-input v-model="productUnallocated.queryParams.name" placeholder="请输入商品名称" clearable/>
            </el-form-item>
            <el-form-item label="商品编号" prop="productId">
              <el-input v-model="productUnallocated.queryParams.productId" clearable  placeholder="请输入商品编号"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" icon="el-icon-search" size="mini" @click="getProductUnallocatedList">搜索</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-table height="439" ref="productUnallocatedTable" v-loading="loading" :data="productUnallocated.list" :row-key="getRowKeys" @selection-change="handleSelectionChangeProduct">
        <el-table-column type="selection" width="55" align="center"></el-table-column>
        <el-table-column label="商品图片" prop="img" width="80" align="center">
          <template slot-scope="scope">
            <image-preview v-if="scope.row.img != null" :src="scope.row.img" :width="50" :height="50" />
          </template>
        </el-table-column>
        <el-table-column label="商品标题" prop="name" width="250"
                         align="center" />
        <el-table-column label="商品编码" prop="productId" width="250"
                         align="center" />
      </el-table>
      <span slot="footer" class="dialog-footer">
					<el-button @click="productClose">取 消</el-button>
					<el-button type="primary" @click="submitProduct">添加</el-button>
				</span>
    </el-dialog>

  </div>
</template>

<script>
import {
  listAccountNumber,
  addAccountNumberProduct,
  getAccountNumberProductList,
  unallocatedProductList,
  deleteProduct,
  getAccountNumberProduct,
  updateAccountNumberProduct,
} from '@/api/system/douyinOneCodeConfig/oneCodeConfig';
import {manageUserOrganization, organizationUser} from "@/api/system/production/tweet";

export default {
  name: "OneCodeConfig",
  data() {
    return {
      // 遮罩层
      loading: true,
      // 非单个禁用
      single: true,
      productFlag: true,
      organizationEnum: [], //受理组织/发展组织
      userId: sessionStorage.getItem("userId"),
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      accountNumberList: [],
      accountNumberId:null,
      organizationId:null,
      // 总条数
      total: 0,
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        ids: [],
        productId: null,
        accountManagementOrganization: null,
        accountUid: null,
        accountName: null,
      },
      productUnallocated: {
        ids: [],
        checkIds: [], //勾选的id
        open: false,
        total: 0,
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          organizationId:undefined,
          accountNumberId:null,
          productId:'',
          allocatedProductIds:[],
          name:'',
        },
        list: []
      },
      // 表单参数
      form: {
        items: [],
        ids: [], //勾选的id
        accountNumberId: null,
        sendOrganizationId: "",
        sendUserId: "",
        acceptOrganizationId: "",
        acceptUserId: "",
      },
      // 表单校验
      rules:{},
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
      this.queryParams.accountManagementOrganization = sessionStorage.getItem("organizationId");
      listAccountNumber(this.queryParams).then(response => {
        this.accountNumberList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    /** 搜索按钮操作 */
    handleQuery() {
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
    getRowKeys(row) {
      return row.id
    },

    oneCodeConfigClose() {
      this.form.items = []
      this.productUnallocated.ids = []
      this.productUnallocated.queryParams.allocatedProductIds = []
      this.open = false
    },
    submitOneCodeConfig() {
      if (this.form.items == null || this.form.items == 0){
        this.$modal.msgWarning('请选择要添加的商品')
        return;
      }
      this.$refs["form"].validate(valid => {
          if (valid) {
            if (this.productFlag){
              let parm = {
                accountNumberProducts: this.form.items,
                accountNumberId:this.accountNumberId,
              }
              addAccountNumberProduct(parm).then(response => {
                this.$modal.msgSuccess("新增成功");
                this.open = false;
                this.form.items = []
                this.getList();
              });
            }else {
              let parm = {
                accountNumberProducts: this.form.items,
                accountNumberId:this.accountNumberId,
              }
              updateAccountNumberProduct(parm).then(response => {
                this.$modal.msgSuccess("修改成功");
                this.open = false;
                this.form.items = []
                this.getList();
              });
            }
          }
      });
    },
    handleOneCodeConfigList(row){
      this.accountNumberId = row.id
      this.organizationId = row.accountManagementOrganization
      this.productFlag = true;
      this.open = true
      this.title = "配置查看权限";
      this.getProductList();
    },
    getSendOrganizationChange(id, index, isClear) {
      //切换清空发展人数据
      if (isClear) {
        this.form.items = this.form.items.map((item, i) => {
          if (i == index) {
            if (isClear) {
              item.sendUserId = null;
            }
          }
          return item;
        });
      }
      if (!id) return;
      organizationUser({
        organizationId: id,
      }).then((response) => {
        console.log("发展人员", response, id, index);
        if (Array.isArray(response?.data)) {
          this.form.items = this.form.items.map((item, i) => {
            if (i == index) {
              item = {
                ...item,
                sendAcceptorEnum : response.data,
              };
            }
            return item;
          });
        }
      });
    },
    //获取受理人员
    getOrganizationChange(id, index, isClear) {
      //切换清空受理人数据
      if (isClear) {
        this.form.items = this.form.items.map((item, i) => {
          if (i == index) {
            if (isClear) {
              item.acceptUserId = null;
            }
          }
          return item;
        });
      }
      if (!id) return;
      organizationUser({
        organizationId: id,
      }).then((response) => {
        console.log("受理人员", response, id, index);
        if (Array.isArray(response?.data)) {
          this.form.items = this.form.items.map((item, i) => {
            if (i == index) {
              item = {
                ...item,
                acceptorEnum: response.data,
              };
            }
            return item;
          });
        }
      });
    },
    //获取受理组织
    getManageUserOrganization() {
      manageUserOrganization({
      }).then((response) => {
        console.log("纳管组织", response);
        if (Array.isArray(response?.data)) {
          this.organizationEnum = response.data;
        }
      });
    },
    /** 新增商品 **/
    handleAddProduct() {
      this.productUnallocated.open = true;
      this.productUnallocated.queryParams.organizationId= undefined;
      this.productUnallocated.queryParams.organizationName= '';
      this.getProductUnallocatedList();
    },
    // 待选商品数据
    getProductUnallocatedList() {
      this.loading = true
      this.productUnallocated.queryParams.organizationId = this.organizationId
      this.productUnallocated.queryParams.accountNumberId = this.accountNumberId
      unallocatedProductList(this.productUnallocated.queryParams).then(
        response => {
          this.productUnallocated.list = response.data
          this.loading = false
        })
    },
    productClose() {
      this.productUnallocated.open = false
    },
    submitProduct() {
      if(this.productUnallocated.checkIds == null || this.productUnallocated.checkIds.length == 0){
        this.$modal.msgWarning('请选择要添加的商品')
        return;
      }
      for (let i = 0; i < this.productUnallocated.checkIds.length; i++) {
        this.productUnallocated.ids.push(this.productUnallocated.checkIds[i])
      }
      this.productUnallocated.queryParams.allocatedProductIds = this.productUnallocated.ids
      this.$modal.msgSuccess("新增成功");
      this.productUnallocated.open = false;
      this.getProductList(this.productUnallocated.ids);
    },
    /** 查询列表 */
    getProductList(ids) {
      this.form.ids = ids
      this.form.accountNumberId = this.accountNumberId
      getAccountNumberProductList(this.form).then(response => {
        this.form.items = response.data;
      });
    },
    handleSelectionChangeProduct(selection) {
      this.productUnallocated.checkIds = selection.map(item => item.id)
    },
    handleDeleteProduct(row,index){
      let indexProduct = this.productUnallocated.queryParams.allocatedProductIds.indexOf(row.productId);
      if (indexProduct > -1) {
        this.productUnallocated.queryParams.allocatedProductIds.splice(indexProduct,1)
      }
      this.form.items.splice(index, 1);
    },
    handleDeleteAccountNumberProduct(row){
      this.$modal.confirm('是否确认移除该商品配置？').then(function() {
        return deleteProduct(row.id);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    handleUpdateAccountNumberProduct(row){
      getAccountNumberProduct(row.id).then(response => {
        this.productFlag = false;
        this.open = true;
        this.title = "修改查看权限";
        this.form.items = response.data;
        this.form.items?.forEach((item, index) => {
          this.getSendOrganizationChange(item.sendOrganizationId, index, false);
          this.getOrganizationChange(item.acceptOrganizationId, index, false);
        });
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
