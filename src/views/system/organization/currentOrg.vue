<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch">
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <!-- <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button> -->
      </el-form-item>
    </el-form>
    <!--列表-->
    <el-table v-loading="loading" :data="orgList"
              :header-cell-style="{background:'#afccfd',color:'#333'}"
              @expand-change="expandChange"
              :row-style="isRed"
    >
      <el-table-column label="" type="expand" width="25">
        <template slot-scope="scope">
          <el-table :header-cell-style="{background:'#DDEBF7',color:'#333',padding: '3px'}"
                    style="margin:0 40px;box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);"
                    :cell-style="{padding: '3px'}"
                    :data="scope.row.userRoles"
                    v-loading="loadingUser"
          >
            <el-table-column label="序号" align="center" width="100">
              <template slot-scope="scop">
                {{ scop.$index + 1 }}
              </template>
            </el-table-column>
            <el-table-column label="账号名称（登录名称）" prop="userName" align="center" />
            <el-table-column label="成员名称" prop="nickName" align="center" />
            <el-table-column label="角色名称" prop="roleName" align="center" />
            <el-table-column label="数据权限" prop="channelCode" align="center" >
              <template #default="scope">
                {{ scope.row.dataScope === '1' ? '全部数据权限' : 
                  scope.row.dataScope === '2' ? '自定数据权限' : 
                  scope.row.dataScope === '3' ? '本层级数据权限' : 
                  scope.row.dataScope === '4' ? '本层级及以下数据权限' : 
                  scope.row.dataScope === '5' ? '仅本人数据权限' : 
                  '' }}
              </template>
            </el-table-column>
          </el-table>
        </template>
      </el-table-column>
      <el-table-column label="组织名称" header-align="center" align="center">
        <template #default="scope">
          {{scope.row.organizationName}}
        </template>
      </el-table-column>
      <el-table-column label="角色数量" header-align="center" align="center">
        <template #default="scope">
          {{scope.row.roles}}
        </template>
      </el-table-column>
      <el-table-column label="成员数量" header-align="center" align="center">
        <template #default="scope">
          {{ scope.row.users }}
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>

import { listRole } from '@/api/system/role'
import { organizationUser } from '@/api/system/production/tweet'
import { selectUserRoleByOrgId } from '@/api/system/user'
import { organizationInfo } from '@/api/system/organiaztion'
export default {
  name: 'currentOrg',
  dicts: [],
  data() {
    return {
      organizationId: sessionStorage.getItem("organizationId"),
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
      loadingUser: true,
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
      // 查询参数
      queryParams: {},
      //组织列表
      orgList: [],
      clickTweetIds:[],
    }
  },
  created() {
    this.getList()
  },
  activated() {
    this.getList()
  },
  methods: {
    //子记录点击变色
    expandChange(row) {
      if(this.clickTweetIds.includes(row.organizationId)){
        this.clickTweetIds.splice(this.clickTweetIds.findIndex(item => item === row.organizationId),1);
      }else{
        this.clickTweetIds.push(row.organizationId)
      }
      //查询数据
      this.loadingUser = true;
      selectUserRoleByOrgId({
        organizationId: row.organizationId
      }).then(response => {
        row.userRoles = response.data;
        this.loadingUser = false;
      });
    },
    isRed({ row }) {
      if (this.clickTweetIds.includes(row.tweetId)) {
        return {
          backgroundColor: "rgb(226, 227, 231)",
        };
      }
    },
    // 搜索按钮操作
    handleQuery() {
      this.getList()
    },
    // 重置搜索按钮操作
    resetQuery() {
      this.queryParams.searchType='org'
      this.resetForm('queryForm')
      this.handleQuery()
    },
    // 列表
    getList() {
      let roles = 0;
      let users = 0;
      this.orgList = [];
      if(this.organizationId==null){
        this.loading = false
      }else{
        this.loading = true
        let params = {
          organizationId: this.organizationId
        }
        listRole(params).then(response => {
            if(response.rows){
              roles = response.rows.length
            }
            organizationUser(params).then(response => {
                if(response.data){
                  users = response.data.length
                }
                organizationInfo(params).then(response => {
                  let org = {
                    organizationId: this.organizationId,
                    organizationName: response.data.organizationName,
                    roles: roles,
                    users: users,
                    userRoles:[]
                  }
                  this.orgList.push(org)
                  this.loading = false
                })
              }
            )
          }
        )
        
        // selectUserRoleByOrgId(params).then(response => {
        //     console.log(response.data);
        //   }
        // )
        
      }
    },
    
  }
}
</script>

<style scoped>

</style>
