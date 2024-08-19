<template>
  <!-- 授权成员 -->
  <el-dialog title="选择成员" :visible.sync="visible" width="1200px" top="5vh" append-to-body :close-on-click-modal="false" :close-on-press-escape="false">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" label-width="68px">
      <el-form-item label="归属层级" prop="deptName">
        <el-input
          v-model="queryParams.deptName"
          placeholder="请输入归属层级"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="账号名称" prop="userName">
        <el-input
          v-model="queryParams.userName"
          placeholder="请输入账号名称（登录名称）"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="成员名称" prop="nickName">
        <el-input
          v-model="queryParams.nickName"
          placeholder="请输入成员名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="手机号码" prop="phonenumber">
        <el-input
          v-model="queryParams.phonenumber"
          placeholder="请输入手机号码"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="工号" prop="jobNumber">
        <el-input
          v-model="queryParams.jobNumber"
          placeholder="请输入工号"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <el-row>
      <el-table @row-click="clickRow" ref="table" :data="userList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column label="归属层级" prop="dept.deptName"/>
        <el-table-column label="账号名称（登录名称）" prop="userName" />
        <el-table-column label="成员名称" prop="nickName" />
<!--        <el-table-column label="邮箱" prop="email" />-->
        <el-table-column label="手机号码" prop="phonenumber" />
        <el-table-column label="工号" prop="jobNumber" />
        <el-table-column label="状态" align="center" prop="status" width="80">
          <template slot-scope="scope">
            <dict-tag :options="dict.type.sys_normal_disable" :value="scope.row.status"/>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" align="center" prop="createTime" width="180">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.createTime) }}</span>
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
    </el-row>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="handleSelectUser">确 定</el-button>
      <el-button @click="visible = false">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import {unallocatedUserList, authUserSelectAll} from "@/api/system/role";
export default {
  dicts: ['sys_normal_disable'],
  props: {
    // 角色编号
    roleId: {
      type: [Number, String]
    }
  },
  data() {
    return {
      // 遮罩层
      visible: false,
      // 选中数组值
      userIds: [],
      // 总条数
      total: 0,
      // 未授权成员数据
      userList: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        roleId: undefined,
        userName: undefined,
        nickName: undefined,
        deptName: undefined,
        phonenumber: undefined,
        jobNumber: undefined,
      }
    };
  },
  methods: {
    // 显示弹框
    show() {
      this.queryParams.roleId = this.roleId;
      this.getList();
      this.visible = true;
    },
    clickRow(row) {
      this.$refs.table.toggleRowSelection(row);
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.userIds = selection.map(item => item.userId);
    },
    // 查询表数据
    getList() {
      unallocatedUserList(this.queryParams).then(res => {
        this.userList = res.rows;
        this.total = res.total;
      });
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
    /** 选择授权成员操作 */
    handleSelectUser() {
      const roleId = this.queryParams.roleId;
      const userIds = this.userIds.join(",");
      if (userIds == "") {
        this.$modal.msgError("请选择要分配的成员");
        return;
      }
      authUserSelectAll({ roleId: roleId, userIds: userIds }).then(res => {
        this.$modal.msgSuccess(res.msg);
        if (res.code === 200) {
          this.visible = false;
          this.$emit("ok");
        }
      });
    }
  }
};
</script>
