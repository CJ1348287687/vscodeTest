<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch">
      <el-form-item label="组织名称" prop="organizationName">
        <el-input
          v-model="queryParams.organizationName"
          placeholder="请输入组织名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="创建时间">
        <el-date-picker
          v-model="dateRange"
          style="width: 240px"
          value-format="yyyy-MM-dd HH:mm:ss"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="['00:00:00', '23:59:59']"
        ></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">查看全部数据</el-button>
      </el-form-item>
    </el-form>
    <!--    <el-row :gutter="10" class="mb8">-->
    <!--      <el-col :span="1.5">-->
    <!--        <el-button-->
    <!--          type="primary"-->
    <!--          plain-->
    <!--          icon="el-icon-plus"-->
    <!--          size="mini"-->
    <!--          @click="handleAdd"-->
    <!--        >新增-->
    <!--        </el-button>-->
    <!--      </el-col>-->
    <!--          <el-col :span="1.5">-->
    <!--            <el-button-->
    <!--              type="success"-->
    <!--              plain-->
    <!--              icon="el-icon-edit"-->
    <!--              size="mini"-->
    <!--              :disabled="single"-->
    <!--              @click="handleUpdate"-->
    <!--              v-hasPermi="['system:organization:edit']"-->
    <!--            >修改-->
    <!--            </el-button>-->
    <!--          </el-col>-->
    <!--      <el-col :span="1.5">-->
    <!--        <el-button-->
    <!--          type="danger"-->
    <!--          plain-->
    <!--          icon="el-icon-delete"-->
    <!--          size="mini"-->
    <!--          :disabled="multiple"-->
    <!--          @click="handleDeletes"-->
    <!--          v-hasPermi="['system:organization:remove']"-->
    <!--        >删除-->
    <!--        </el-button>-->
    <!--      </el-col>-->
    <!--      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>-->
    <!--    </el-row>-->

    <!--列表-->
    <el-table v-loading="loading" :data="messageList" @selection-change="handleSelectionChange">
      <!--      <el-table-column type="selection" width="55" align="center"/>-->
<!--      <el-table-column label="消息编号" prop="messageId" width="150" align="center"/>-->
      <el-table-column label="产品名" prop="consumerProductName"
                       align="center"
      />
      <el-table-column label="产品类型" prop="consumerProductType" width="150"
                       align="center"
      />
      <el-table-column label="操作" prop="consumerProductOper" width="150"
                       align="center"
      />
      <el-table-column label="消息创建人" prop="createBy" width="150"
                       align="center"
      />
      <el-table-column label="读取状态" prop="isRead" width="100"
                       align="center"
      >
        <template slot-scope="scope">
          <a style="color: #ff0000" v-if="scope.row.isRead == 0" @click="changeIsRead(scope.row)">未读</a>
          <a style="color: #1890ff;text-decoration: none;pointer-events: none" v-if="scope.row.isRead == 1">已读</a>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" prop="createTime" width="250">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
    </el-table>

    <!--分页工具栏-->
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />


  </div>
</template>

<script>
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import { messageChangeIsRead, messageList } from '../../../api/system/message/message'

export default {
  name: 'message',
  dicts: [],
  data() {
    return {
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
        pageSize: 10
      },
      //消息列表
      messageList: [],
      // 总条数
      total: 0,
      // 选中数组
      ids: []
    }
  },
  created() {
    this.getList()
  },
  activated() {
    this.getList()
  },
  methods: {

    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.organizationId)
      this.single = selection.length != 1
      this.multiple = !selection.length
    },
    // 搜索按钮操作
    handleQuery() {
      this.queryParams.pageNum = 1
      this.getList()
    },
    // 重置搜索按钮操作
    resetQuery() {
      this.queryParams.organizationName = ''
      this.queryParams.deptId = undefined
      this.dateRange = []
      this.resetForm('queryForm')
      this.handleQuery()
      this.getDeptTree()
    },
    // 组织列表
    getList() {
      this.loading = true
      messageList(this.addDateRange(this.queryParams, this.dateRange)).then(response => {
        this.messageList = response.rows
        this.total = response.total
        this.loading = false
      })
    },
    changeIsRead(row) {
      console.log(row)
      messageChangeIsRead(row).then(response => {
        this.getList()
      })
    }

  }

}
</script>

<style scoped>

</style>
