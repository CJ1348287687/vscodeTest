<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch">
      <el-form-item label="组织名称" prop="organizationName">
        <el-input
          v-model="queryParams.organizationName"
          placeholder="请输入组织名称"
          clearable
          style="width: 240px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="角色名称" prop="roleName">
        <el-input
          v-model="queryParams.roleName"
          placeholder="请输入角色名称"
          clearable
          style="width: 240px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <el-row :gutter="10" class="mb8">
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>
    <!--列表-->
    <el-table v-loading="loading" :data="roleList" @selection-change="handleSelectionChange"
              @sort-change="handleSortChange"
    >
      <el-table-column label="组织名称" prop="so.organization_name" align="center" sortable="custom" :sort-orders="['descending', 'ascending']">
        <template #default="scope">
          {{ scope.row.organizationName }}
        </template>
      </el-table-column>
      <el-table-column label="角色名称" prop="sr.role_name" align="center" sortable="custom" :sort-orders="['descending', 'ascending']">
        <template #default="scope">
          {{ scope.row.roleName }}
        </template>
      </el-table-column>
      <el-table-column label="菜单权限" header-align="center" align="center">
        <template #default="scope">
          <el-button v-if="scope.row.roleId != null" size="mini" type="text" @click="handleMenu(scope.row)" > 列表 </el-button>
        </template>
      </el-table-column>
      <el-table-column label="数据权限" header-align="center" align="center" >
        <template #default="scope">
          有
          <!-- <el-button v-if="scope.row.roleId != null" size="mini" type="text" @click="handleDept(scope.row)" > 列表 </el-button> -->
        </template>
      </el-table-column>
      <!-- <el-table-column label="权限" prop="dataScope" header-align="center" align="center" sortable="custom" :sort-orders="['descending', 'ascending']">
        <template #default="scope">
          {{ scope.row.dataScope === '1' ? '全部数据权限' : 
            scope.row.dataScope === '2' ? '自定数据权限' : 
            scope.row.dataScope === '3' ? '本层级数据权限' : 
            scope.row.dataScope === '4' ? '本层级及以下数据权限' : 
            scope.row.dataScope === '5' ? '仅本人数据权限' : 
            '' }}
        </template>
      </el-table-column> -->
    </el-table>
    <!--分页工具栏-->
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />
    
    <!-- 菜单权限 -->
    <el-dialog title="菜单权限" :visible.sync="menuOpen" width="500px" append-to-body :close-on-click-modal="false" :show-close="false" :close-on-press-escape="false">
      <el-form label-width="100px">
        <el-form-item label="菜单权限">
          <el-checkbox v-model="menuExpand" @change="handleCheckedTreeExpand($event, 'menu')">展开/折叠</el-checkbox>
          <el-tree
            class="tree-border"
            :data="menuOptions"
            show-checkbox
            ref="menu"
            node-key="id"
            :check-strictly="!form.menuCheckStrictly"
            empty-text="加载中，请稍候"
            :props="defaultProps"
          ></el-tree>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeMenu">取 消</el-button>
      </div>
    </el-dialog>
    
    <!-- 数据权限 -->
    <el-dialog title="数据权限" :visible.sync="deptOpen" width="800px" append-to-body :close-on-click-modal="false" :show-close="false" :close-on-press-escape="false">
      <el-form label-width="100px">
        <el-form-item label="数据权限">
          <el-row :gutter="20" style="margin-top: 5px;">
            <el-col :span="4" :xs="24" style="width: 48%;">
              <div class="head-container">
                  <el-tree
                    :data="deptOptions"
                    :props="defaultProps"
                    :expand-on-click-node="false"
                    :filter-node-method="filterNode"
                    ref="dept"
                    node-key="id"
                    default-expand-all
                    highlight-current
                    @node-click="handleNodeClick"
                  />
              </div>
            </el-col>
            <el-col :span="4" :xs="24">
              <div class="head-container">
                <el-tree
                  :data="organizations"
                  :props="defaultProps"
                  :expand-on-click-node="false"
                  :filter-node-method="filterNode"
                  ref="treeOrganization"
                  node-key="id"
                  default-expand-all
                  highlight-current
                />
              </div>
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeDept">取 消</el-button>
      </div>
    </el-dialog>

  </div>
</template>
<script>

import { listRoleManage } from '@/api/system/role'
import { roleMenuTreeselect } from '@/api/system/menu'
import { deptTreeSelect, organizationList } from '@/api/system/role'

export default {
  name: 'orgList',
  dicts: [],
  data() {
    return {
      defaultProps: {
        label: 'label',
        children: 'children',
        disabled: this.disabledFn
      },
      // 数据范围选项
      dataScopeOptions: [
        {
          value: '1',
          label: '全部数据权限'
        },
        {
          value: '2',
          label: '自定数据权限'
        },
        {
          value: '3',
          label: '本层级数据权限'
        },
        {
          value: '4',
          label: '本层级及以下数据权限'
        },
        {
          value: '5',
          label: '仅本人数据权限'
        }
      ],
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
        roleName: '',
        organizationName: '',
        searchType:'manage',
      },
      //角色列表
      roleList: [],
      // 总条数
      total: 0,
      // 选中数组
      ids: [],
      // 菜单列表
      menuOptions: [],
      // 层级列表
      deptOptions: [],
      //组织列表
      organizations: [],
      clickId:undefined,
      organizationLoading:false,
      // 表单参数
      form: {
        menuCheckStrictly: true,
        deptCheckStrictly: true
      },
      menuExpand: false,
      deptExpand: true,
      menuOpen:false,
      deptOpen:false,
    }
  },
  created() {
    this.queryParams.pageNum = 1
    this.getList()
  },
  activated() {
    this.queryParams.pageNum = 1
    this.getList()
  },
  methods: {
    /** 排序触发事件 */
    handleSortChange(column, prop, order) {
      this.queryParams.orderByColumn = column.prop;
      this.queryParams.isAsc = column.order;
      this.getList();
    },
    // 搜索按钮操作
    handleQuery() {
      this.queryParams.pageNum = 1
      this.getList()
    },
    // 重置搜索按钮操作
    resetQuery() {
      this.dateRange = []
      this.queryParams.orderByColumn=''
      this.queryParams.isAsc = ''
      this.queryParams.searchType='manage'
      this.resetForm('queryForm')
      this.handleQuery()
    },
    // 列表
    getList() {
      this.loading = true
      console.log("=====================")
      listRoleManage(this.addDateRange(this.queryParams, this.dateRange)).then(response => {
          this.roleList = response.rows
          this.total = response.total
          this.loading = false
        }
      )
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.tweetId)
      this.single = selection.length != 1
      this.multiple = !selection.length
    },

    handleMenu(row) {
      this.menuOptions = [];
      const roleId = row.roleId
      roleMenuTreeselect(roleId).then(response => {
        this.menuOptions = response.menus;
        let checkedKeys = response.checkedKeys
        checkedKeys.forEach((v) => {
          this.$nextTick(() => {
            this.$refs.menu.setChecked(v, true, false)
          })
        })
        this.menuOpen = true
      })
    },
    closeMenu(){
      this.menuOptions = [];
      this.form.menuCheckStrictly = true
      this.menuExpand = false
      this.menuOpen = false
    },
    handleDept(row) {
      this.deptOptions = [];
      const roleId = row.roleId
      this.getOrganizationList()
      deptTreeSelect(roleId).then(response => {
        this.deptOptions = response.depts;
        // this.$refs.dept.setCheckedKeys(response.checkedKeys)
        let checkedKeys = response.checkedKeys
        checkedKeys.forEach((v) => {
          this.$nextTick(() => {
            this.$refs.dept.setChecked(v, true, false)
          })
        })
        this.deptOpen = true
      })
    },
    closeDept(){
      this.deptOptions = [];
      this.form.deptCheckStrictly = true
      this.deptExpand = false
      this.deptOpen = false
    },
    disabledFn(){
      return true
    },
    // 树权限（展开/折叠）
    handleCheckedTreeExpand(value, type) {
      if (type == 'menu') {
        let treeList = this.menuOptions
        for (let i = 0; i < treeList.length; i++) {
          this.$refs.menu.store.nodesMap[treeList[i].id].expanded = value
        }
      } else if (type == 'dept') {
        let treeList = this.deptOptions
        for (let i = 0; i < treeList.length; i++) {
          this.$refs.dept.store.nodesMap[treeList[i].id].expanded = value
        }
      }
    },
    // 筛选节点
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    // 节点单击事件
    handleNodeClick(data) {
      this.getOrganizationList(data.id)
      this.clickId = undefined//取消左侧组织选中状态
    },
    /** 根据角色ID查询层级树结构 */
    getOrganizationList(deptId) {
      this.organizationLoading = true
      organizationList({deptId:deptId}).then(response => {
        this.organizations = response.data
        this.organizationLoading = false
      })
    },
  }
}
</script>

<style scoped>

</style>
