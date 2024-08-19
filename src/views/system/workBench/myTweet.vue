<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch">
      <el-form-item label="推文编号" prop="tweetId">
        <el-input
            v-model="queryParams.tweetId"
            placeholder="请输入推文编号"
            clearable
            @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="推文标题" prop="tweetTitle">
        <el-input
          v-model="queryParams.tweetTitle"
          placeholder="请输入推文标题"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="推文属性" prop="tweetCommonFlag">
        <el-select v-model="queryParams.tweetCommonFlag" placeholder="公共/私有" clearable>
          <el-option
            v-for="dict in tweetCommonFlags"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
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
          v-hasPermi="['system:productionTweet:add']"
        >新增
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['system:productionTweet:edit']"
        >修改
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDeletes"
          v-hasPermi="['system:productionTweet:remove']"
        >删除
        </el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>
    <!--列表-->
    <el-table ref="tweetTable" v-loading="loading" :data="tweetList" @selection-change="handleSelectionChange" @sort-change="handleSortChange">
      <el-table-column type="selection" min-width="50px" align="center"/>
      <el-table-column label="推文来源" prop="organizationName" min-width="200px" header-align="center" align="center" sortable="custom" :sort-orders="['descending', 'ascending']"/>
      <el-table-column label="推文编号" prop="tweetId" min-width="100px" header-align="center" align="center" sortable="custom" :sort-orders="['descending', 'ascending']"/>
      <el-table-column label="推文标题" prop="tweetTitle" min-width="200px"  header-align="center" align="left" sortable="custom" :sort-orders="['descending', 'ascending']"/>
      <el-table-column label="推文属性" prop="tweetCommonFlag" min-width="100px" header-align="center" align="center" sortable="custom" :sort-orders="['descending', 'ascending']">
        <template slot-scope="{ row }">
          <span v-if=" row.tweetCommonFlag=='0'">私有</span>
          <span v-if=" row.tweetCommonFlag=='1'">公共</span>
        </template>
      </el-table-column>
      <el-table-column label="创建人" prop="createBy" min-width="150px" header-align="center" align="center" sortable="custom" :sort-orders="['descending', 'ascending']"/>
      <el-table-column label="创建时间" prop="createTime" min-width="175px" header-align="center" align="center" sortable="custom" :sort-orders="['descending', 'ascending']"/>
      <el-table-column label="渠道入库" prop="channelStatus" min-width="100px" header-align="center" align="center" sortable="custom" :sort-orders="['descending', 'ascending']">
        <template slot-scope="{ row }">
          <span v-if=" row.channelStatus=='0'">出库</span>
          <span v-if=" row.channelStatus=='1'">入库</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" min-width="250px">
        <template slot-scope="scope">
          <el-button
              size="mini"
              type="text"
              icon="el-icon-document"
              @click="handleTweetPreview(scope.row)"
          >预览
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-if="scope.row.organizationId == organizationId"
            v-hasPermi="['system:productionTweet:edit']"
          >修改
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-if="scope.row.organizationId == organizationId"
            v-hasPermi="['system:productionTweet:remove']"
          >删除
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="channelOut(scope.row)"
            v-if="scope.row.channelStatus=='1' && scope.row.organizationId == organizationId"
          >出库
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="channelJoin(scope.row)"
            v-if="scope.row.channelStatus=='0' && scope.row.organizationId == organizationId"
          >入库
          </el-button>
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
    <!-- 预览对话框 -->
    <el-dialog custom-class="tweet-preview-dialog"  title="推文预览" :visible.sync="tweetPreview" width="1100px" append-to-body :close-on-click-modal="false" :show-close="false" :close-on-press-escape="false">
      <div style="min-height: 580px">
        <tweet-preview v-if="tweetPreview" ref="tweetPreview"></tweet-preview>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="tweetPreview=false">取 消</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>


import { changeChannelStatus, tweetList, tweetRemove, tweetRemoves } from '../../../api/system/production/tweet'
import { MessageBox } from 'element-ui'
import { isRelogin } from '../../../utils/request'

import tweetPreview from '@/components/tweet/tweetPreview.vue'

export default {
	components: { tweetPreview },
  name: 'myTweet',
  dicts: [],
  data() {
    return {
      organizationId: undefined,
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
        tweetTitle: '',
        isDraft: '',
        tweetCode:'',
        organizationId: undefined,
        tweetCommonFlag:'',
        createBy:'',
        orderByColumn:'',
        isAsc:'',
        searchType:'person',
      },
      //推文列表
      tweetList: [],
      // 总条数
      total: 0,
      // 选中数组
      ids: [],
      isDraftArr: [
        {
          value: '0',
          label: '非草稿'
        },
        {
          value: '1',
          label: '草稿'
        }
      ],
      tweetCommonFlags:[
        {
          value: '0',
          label: '私有'
        },
        {
          value: '1',
          label: '公共'
        }
      ],
      //推文预览
      tweetPreview:false,
    }
  },
  created() {
    this.getList()
    this.organizationId = sessionStorage.getItem('organizationId')
  },
  activated() {
    this.getList()
    this.organizationId = sessionStorage.getItem('organizationId')

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
      this.queryParams.tweetId = ''
      this.queryParams.tweetTitle = ''
      this.queryParams.tweetCode = ''
      this.queryParams.tweetCommonFlag = ''
      this.queryParams.isDraft = ''
      this.queryParams.createBy = ''
      this.queryParams.orderByColumn=''
      this.queryParams.isAsc = ''
      this.queryParams.searchType='person'
      this.resetForm('queryForm')
      this.handleQuery()
      this.$nextTick(() => {
        this.$refs.tweetTable.clearSort()
        let columns = this.$refs.tweetTable.columns;
        columns.forEach((column) => {
          if (column.sortable == 'custom') {
            column.order = undefined;
            column.multiOrder = undefined;
          }
        });
      })
    },
    // 列表
    getList() {
      if(this.queryParams.tweetId !=null && this.queryParams.tweetId !=undefined && this.queryParams.tweetId !=''){
        if(!(!isNaN(parseFloat(this.queryParams.tweetId)) && isFinite(this.queryParams.tweetId))){
          this.$modal.msgError('推文编号请填写数字')
          return
        }
      }
      this.loading = true
      this.queryParams.organizationId = sessionStorage.getItem('organizationId')
      tweetList(this.addDateRange(this.queryParams, this.dateRange)).then(response => {
        this.tweetList = response.rows
        this.total = response.total
        this.loading = false
      })
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.tweetId)
      this.single = selection.length != 1
      this.multiple = !selection.length
    },
    // 新增按钮
    handleAdd() {
      let params = {}
      this.$router.push({
        path: '/sqh/production/tweetArticle', query: params
      })
    },
    // 修改按钮
    handleUpdate(row) {
      const tweetId = row.tweetId || this.ids
      let params = {
        t: tweetId
      }
      this.$modal.confirm('修改会影响已入库推文，请确认！').then(function() {
      }).then(() => {
        this.$router.push({
          path: '/sqh/production/tweetArticle', query: params
        })
      }).catch(() => {
      })
    },
    channelJoin(row){
      let params = {
        tweetId: row.tweetId,
        channelStatus: '1'
      }
      this.$modal.confirm('选择后推文派送到渠道库，请确认！').then(function() {
      }).then(() => {
        //todo 入库接口
        changeChannelStatus(params).then(response=>{
          this.getList()
        })
        this.$modal.msgSuccess('入库成功')
      }).catch((e) => {
        console.log(e)
      })

    },
    channelOut(row){
      let params = {
        tweetId: row.tweetId,
        channelStatus: '0'
      }
      let content = "选择后导致渠道中心产品出库，且全部渠道状态改成下架"
      MessageBox.confirm(content, "警告", {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: "warning",
      }).then(() => {
        // todo 出库接口
        changeChannelStatus(params).then(response=>{
          this.getList()
        })
        this.$modal.msgSuccess('出库成功')
          })

    },
    // 删除按钮
    handleDelete(row) {
      let params = {
        tweetId: row.tweetId
      }
      this.$modal.confirm('删除会影响已入库的推文，请确认！').then(function() {
        return tweetRemove(params)
      }).then(() => {
        this.getList()
        this.$modal.msgSuccess('删除成功')
      }).catch((e) => {
        console.log(e)
      })
    },
    // 批量删除按钮
    handleDeletes() {
      let params = {
        tweetIds: this.ids
      }
      this.$modal.confirm('删除会影响已入库的推文，请确认').then(function() {
        return tweetRemoves(params)
      }).then(() => {
        this.getList()
        this.$modal.msgSuccess('删除成功')
      }).catch(() => {
        console.log(e)
      })
    },
    // 推文预览
    handleTweetPreview(row) {
      this.tweetPreview = true
      if(!this.$refs.tweetPreview){
        setTimeout(()=>{
          this.$refs.tweetPreview.getData(row.tweetId)
        },500)
      }else{
        this.$refs.tweetPreview.getData(row.tweetId)
      }
    },
  }
}
</script>

<style>
	.tweet-preview-dialog .el-dialog__body{
		padding: 10px 20px;
	}
</style>
