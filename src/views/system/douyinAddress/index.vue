<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="90px">
      <el-form-item label="联系人姓名" prop="userName">
        <el-input
          v-model="queryParams.userName"
          placeholder="请输入联系人姓名"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="手机号码" prop="mobile">
        <el-input
          v-model="queryParams.mobile"
          placeholder="请输入手机号码"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="座机电话" prop="fixedPhone">
        <el-input
          v-model="queryParams.fixedPhone"
          placeholder="请输入座机电话"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="省" prop="provinceId">
        <el-input
          v-model="queryParams.provinceId"
          placeholder="请输入省"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="市" prop="cityId">
        <el-input
          v-model="queryParams.cityId"
          placeholder="请输入市"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="区" prop="townId">
        <el-input
          v-model="queryParams.townId"
          placeholder="请输入区"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="街道" prop="streetId">
        <el-input
          v-model="queryParams.streetId"
          placeholder="请输入街道"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="详细地址" prop="detail">
        <el-input
          v-model="queryParams.detail"
          placeholder="请输入详细地址"
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
          @click="synchronous"
          v-hasPermi="['system:address:synchronous']" 
        >同步抖店地址</el-button>
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
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
        >删除</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="addressList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="抖店地址id" align="center" prop="addressId" />
      <el-table-column label="联系人姓名" align="center" prop="userName" />
      <el-table-column label="联系方式类型" align="center" prop="linkType" >
        <template slot-scope="{ row }">
          <span v-if="row.linkType == 0">手机</span>
          <span v-if="row.linkType == 1">普通座机</span>
          <span v-if="row.linkType == 2">企业座机</span>
        </template>
      </el-table-column>
      <el-table-column label="手机号码" align="center" prop="mobile" />
      <el-table-column label="座机电话" align="center" prop="fixedPhone" />
      <el-table-column label="省" align="center" prop="provinceName" />
      <el-table-column label="市" align="center" prop="cityName" />
      <el-table-column label="区" align="center" prop="townName" />
      <el-table-column label="街道" align="center" prop="streetName" />
      <el-table-column label="详细地址" align="center" prop="detail" />
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column label="创建时间" align="center" prop="createTime" width="180" sortable="custom" :sort-orders="['descending', 'ascending']" />
      <el-table-column label="同步时间" align="center" prop="synchronousTime" width="100" sortable="custom" :sort-orders="['descending', 'ascending']">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.synchronousTime, "{y}-{m}-{d}") }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
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

    <!-- 添加或修改抖店地址对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="联系人姓名" prop="userName">
          <el-input v-model="form.userName" placeholder="请输入联系人姓名" />
        </el-form-item>
        <el-form-item label="手机号码" prop="mobile">
          <el-input v-model="form.mobile" placeholder="请输入手机号码" />
        </el-form-item>
        <el-form-item label="座机电话" prop="fixedPhone">
          <el-input v-model="form.fixedPhone" placeholder="请输入座机电话" />
        </el-form-item>
        <el-form-item label="省" prop="provinceId">
          <el-input v-model="form.provinceId" placeholder="请输入省" />
        </el-form-item>
        <el-form-item label="市" prop="cityId">
          <el-input v-model="form.cityId" placeholder="请输入市" />
        </el-form-item>
        <el-form-item label="区" prop="townId">
          <el-input v-model="form.townId" placeholder="请输入区" />
        </el-form-item>
        <el-form-item label="街道" prop="streetId">
          <el-input v-model="form.streetId" placeholder="请输入街道" />
        </el-form-item>
        <el-form-item label="详细地址" prop="detail">
          <el-input v-model="form.detail" placeholder="请输入详细地址" />
        </el-form-item>
        <el-table-column label="同步时间" align="center" prop="synchronousTime" width="100" sortable="custom" :sort-orders="['descending', 'ascending']">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.synchronousTime, "{y}-{m}-{d}") }}</span>
          </template>
        </el-table-column>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" placeholder="请输入备注" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 添加或修改地址对话框 -->
    <el-dialog title="同步抖店地址" :visible.sync="openSync" width="500px" append-to-body>
      <el-form ref="formSync" :model="formSync" label-width="80px">
        <el-form-item label="店铺" prop="shopId">
          <el-select v-model="shopId" placeholder="请选择店铺">
            <el-option
              v-for="dict in shopList"
              :key="dict.id"
              :label="dict.shopName"
              :value="dict.shopId"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitFormSync">确 定</el-button>
        <el-button @click="cancelSync">取 消</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { listAddress, getAddress, delAddress, addAddress, updateAddress, synchronousAddress } from "@/api/system/douyinAddress/address";
import { listAll } from "@/api/system/douyinShop/shop";

export default {
  name: "Address",
  data() {
    return {
      linkTypes: [
        {
          value: 0,
          label: "手机",
        },
        {
          value: 1,
          label: "普通座机",
        },
        {
          value: 2,
          label: "企业座机",
        },
      ],
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
      // 抖店地址表格数据
      addressList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        addressId: null,
        userName: null,
        linkType: null,
        mobile: null,
        fixedPhone: null,
        provinceId: null,
        provinceName: null,
        cityId: null,
        cityName: null,
        townId: null,
        townName: null,
        streetId: null,
        streetName: null,
        detail: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
      },

      shopId:null,
      shopList:[],
      openSync:false,
      formSync: {},
    };
  },
  created() {
    this.getList();
    this.getShopList();
  },
  methods: {
    /** 查询抖店地址列表 */
    getList() {
      this.loading = true;
      listAddress(this.queryParams).then(response => {
        this.addressList = response.rows;
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
        addressId: null,
        userName: null,
        linkType: null,
        mobile: null,
        fixedPhone: null,
        provinceId: null,
        provinceName: null,
        cityId: null,
        cityName: null,
        townId: null,
        townName: null,
        streetId: null,
        streetName: null,
        detail: null,
        remark: null
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
      this.title = "添加抖店地址";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getAddress(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改抖店地址";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateAddress(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addAddress(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除抖店地址编号为"' + ids + '"的数据项？').then(function() {
        return delAddress(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },

    /** 店铺列表 */
    getShopList(){
      listAll().then((response) => {
        this.shopList = response.rows;
      });
    },
    /** 同步地址 */
    synchronous() {
      this.shopId = null;
      this.openSync = true;
    },
    /** 提交按钮 */
    submitFormSync() {
      if (this.shopId == null || this.shopId == "") {
        this.$modal.msgError("请选择需要同步的店铺");
        return;
      }
      this.loading = true;
      this.openSync = false;
      let aa = {
        shopId: this.shopId,
      };
      synchronousAddress(aa).then((response) => {
        this.openSync = false;
        this.loading = false;
        this.getList();
        this.$modal.msgSuccess("同步成功");
      });
    },
    // 取消按钮
    cancelSync() {
      this.openSync = false;
      this.shopId = null;
    },
  }
};
</script>
