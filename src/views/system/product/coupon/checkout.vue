<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch">
      <el-form-item label="券码编号" prop="couponCode">
        <el-input
          v-model="queryParams.couponCode"
          placeholder="请输入券码编号"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
<!--      <el-form-item label="创建时间">-->
<!--        <el-date-picker-->
<!--          v-model="dateRange"-->
<!--          style="width: 240px"-->
<!--          value-format="yyyy-MM-dd HH:mm:ss"-->
<!--          type="daterange"-->
<!--          range-separator="-"-->
<!--          start-placeholder="开始日期"-->
<!--          end-placeholder="结束日期"
              :default-time="['00:00:00', '23:59:59']"-->
<!--        ></el-date-picker>-->
<!--      </el-form-item>-->
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDeletes"
          v-hasPermi="['system:couponGain:remove']"
        >删除
        </el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>
    <!--列表-->
    <el-table v-loading="loading" :data="couponGainList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="券码编号" prop="couponCode" width="300" align="center" />
      <el-table-column label="C端用户id" prop="cuserUuid" width="250" align="center"/>
<!--      <el-table-column label="创建时间" align="center" prop="createTime" width="180">-->
<!--        <template slot-scope="scope">-->
<!--          <span>{{ parseTime(scope.row.createTime) }}</span>-->
<!--        </template>-->
<!--      </el-table-column>-->
      <el-table-column label="领取时间" align="center" prop="createTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.gainTime) }}</span>
        </template>
      </el-table-column>
<!--      <el-table-column label="核销状态" prop="checkoutFlag" width="250"-->
<!--                       align="center">-->
<!--        <template slot-scope="scope">-->
<!--          <div v-if="scope.row.checkoutFlag=='0'">-->
<!--            <span>未核销</span>-->
<!--          </div>-->
<!--          <div v-if="scope.row.checkoutFlag=='1'">-->
<!--            <span>已核销</span>-->
<!--          </div>-->
<!--        </template>-->
<!--      </el-table-column>-->

      <el-table-column label="核销时间" align="center" prop="createTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.checkoutTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="核销用户名" prop="checkoutUser" width="250"
                       align="center"
      />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleCheckout(scope.row)"
            v-hasPermi="['system:couponGain:checkout']"
            v-if="scope.row.checkoutFlag == '0'"
          >核销
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:couponGain:remove']"
          >删除
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

  </div>
</template>

<script>


import {
  couponGainCheckout,
  couponGainList, couponGainRemove,
  couponGainRemoves
} from '../../../../api/system/product/coupon/checkout'

export default {
  name: 'couponCheck',
  dicts: [],
  components: {},
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
      // 弹出层禁用
      disable: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        couponId : undefined,
        couponCode:''
      },
      couponGainList: [],
      // 总条数
      total: 0,
      // 选中数组
      ids: [],
      // 选中code
      couponCodes:[]

    }
  },
  created() {
    this.routerInit()
    this.getList()
  },
  activated() {
    this.routerInit()
    this.getList()
  },
  methods: {
    routerInit(){
      this.queryParams.couponId = this.$route.query.c
    },
    // 搜索按钮操作
    handleQuery() {
      this.queryParams.pageNum = 1
      this.getList()
    },
    // 重置搜索按钮操作
    resetQuery() {
      this.routerInit()
      this.dateRange = []
      this.resetForm('queryForm')
      this.handleQuery()
    },
    // 列表
    getList() {
      this.loading = true
      this.queryParams.organizationId = sessionStorage.getItem('organizationId')
      couponGainList(this.addDateRange(this.queryParams, this.dateRange)).then(response => {
        this.couponGainList = response.rows
        this.total = response.total
        this.loading = false
      })
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.gainId)
      this.couponCodes = selection.map(item => item.couponCode)
      this.single = selection.length != 1
      this.multiple = !selection.length
    },
    // 表单重置
    reset() {
      this.couponGainList = []
    },
    // 核销
    handleCheckout(row){
      let params = {
        gainId : row.gainId,
        checkoutFlag : row.checkoutFlag
      }
      this.$modal.confirm('是否确认核销券码编号为"' + row.couponCode + '"的数据项？').then(function() {
        return couponGainCheckout(params)
      }).then(() => {
        this.getList()
        this.$modal.msgSuccess('核销成功')
      }).catch((e) => {
        console.log(e)
      })
    },
    // 券码删除按钮
    handleDelete(row) {
      let params = {
        gainId: row.gainId
      }
      this.$modal.confirm('是否确认删除券码编号为"' + row.couponCode + '"的数据项？').then(function() {
        return couponGainRemove(params)
      }).then(() => {
        this.getList()
        this.$modal.msgSuccess('删除成功')
      }).catch((e) => {
        console.log(e)
      })
    },
    // 券码批量删除按钮
    handleDeletes() {
      let params = {
        gainIds: this.ids
      }
      this.$modal.confirm('是否确认删除券码编号为"' + this.couponCodes + '"的数据项？').then(function() {
        return couponGainRemoves(params)
      }).then(() => {
        this.getList()
        this.$modal.msgSuccess('删除成功')
      }).catch(() => {
        console.log(e)
      })
    }
  }
}
</script>

<style scoped>

</style>
