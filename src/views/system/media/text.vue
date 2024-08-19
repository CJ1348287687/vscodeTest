<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch">
      <el-form-item label="文案标题" prop="textTitle">
        <el-input
          v-model="queryParams.textTitle"
          placeholder="请输入文案标题"
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
          v-hasPermi="['system:mediaText:add']"
        >新增
        </el-button>
      </el-col>
      <!--      <el-col :span="1.5">-->
      <!--        <el-button-->
      <!--          type="success"-->
      <!--          plain-->
      <!--          icon="el-icon-edit"-->
      <!--          size="mini"-->
      <!--          :disabled="single"-->
      <!--          @click="handleUpdate"-->
      <!--          v-hasPermi="['system:mediaText:edit']"-->
      <!--        >修改-->
      <!--        </el-button>-->
      <!--      </el-col>-->
      <!--      <el-col :span="1.5">-->
      <!--        <el-button-->
      <!--          type="danger"-->
      <!--          plain-->
      <!--          icon="el-icon-delete"-->
      <!--          size="mini"-->
      <!--          :disabled="multiple"-->
      <!--          @click="handleDeletes"-->
      <!--          v-hasPermi="['system:mediaText:remove']"-->
      <!--        >删除-->
      <!--        </el-button>-->
      <!--      </el-col>-->
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>
    <!--列表-->
<!--        <el-table v-loading="loading" :data="textList" @selection-change="handleSelectionChange">-->
        <el-table :data="textList" >
<!--          <el-table-column type="selection" width="55" align="center"/>-->
          <el-table-column label="文案标题" prop="textTitle" width="200" align="center" />
          <el-table-column label="文案内容" prop="textContent" width="1100" align="center" :show-overflow-tooltip="true" :formatter="textContentFormatter"/>
          <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
            <template slot-scope="scope">
              <el-button type="primary" icon="el-icon-edit" title="编辑" circle size="mini" style="width: 28px;height: 28px"
                         @click="handleUpdate(scope.row)" v-hasPermi="['system:mediaText:edit']"></el-button>
              <el-button type="primary" icon="el-icon-notebook-1" title="日志" circle size="mini" style="width: 28px;height: 28px"
                         @click="logOpen(scope.row)" v-hasPermi="['system:mediaText:logList']"></el-button>
              <el-button type="primary" icon="el-icon-upload2" title="上架" circle size="mini" style="width: 28px;height: 28px"
                         @click="textUsingChange(scope.row)" v-if="scope.row.textUsingFlag == '1'" v-hasPermi="['system:mediaText:textUsingChange']"></el-button>
              <el-button type="warning" icon="el-icon-download" title="下架" circle size="mini" style="width: 28px;height: 28px"
                         @click="textUsingChange(scope.row)" v-if="scope.row.textUsingFlag == '0'" v-hasPermi="['system:mediaText:textUsingChange']"></el-button>
              <el-button type="danger" icon="el-icon-delete" title="删除" circle size="mini" style="width: 28px;height: 28px"
                         @click="handleDelete(scope.row)" v-hasPermi="['system:mediaText:remove']"></el-button>
            </template>
          </el-table-column>
        </el-table>
    <!--分页工具栏-->
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      :layout="layout"
      @pagination="getList"
    />
    <!-- 添加或修改文案对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="850px" append-to-body :close-on-click-modal="false" :show-close="false" :close-on-press-escape="false" >
      <el-form ref="textForm" :model="textForm" :rules="textFormRules" label-width="80px">
        <el-form-item label="文案标题" prop="textTitle">
          <el-input v-model="textForm.textTitle" placeholder="请输入文案标题"></el-input>
        </el-form-item>
        <el-form-item label="文案内容 " prop="textContent">
            <el-input type="textarea" v-model="textForm.textContent" placeholder="请输入文案内容" autosize></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="textSubmit">确 定</el-button>
        <el-button @click="textCancel">取 消</el-button>
      </div>
    </el-dialog>

    <el-dialog :title="log.title" :visible.sync="log.open" width="850px" append-to-body
               :close-on-click-modal="false" :close-on-press-escape="false"
               :show-close="true" @close = "logClose"
    >
      <el-form :model="log.queryParams" ref="logQueryFrom" size="small" :inline="true" v-show="showSearch">
        <el-form-item label="操作人" prop="operName">
          <el-input
            v-model="log.queryParams.createBy"
            placeholder="请输入操作人名称"
            clearable
            @keyup.enter.native="logQuery"
          />
        </el-form-item>
        <el-form-item label="创建时间">
          <el-date-picker
            v-model="log.dateRange"
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
          <el-button type="primary" icon="el-icon-search" size="mini" @click="logQuery">搜索</el-button>
          <!--          <el-button icon="el-icon-refresh" size="mini" @click="logQueryReset">重置</el-button>-->
        </el-form-item>
      </el-form>
      <el-table  :data="log.list" >
        <el-table-column label="操作人" prop="createBy" align="center"/>
        <el-table-column label="操作" prop="operTitle" align="center"/>
        <el-table-column label="操作时间" prop="createTime" align="center"/>
      </el-table>
      <!--分页工具栏-->
      <pagination
        v-show="log.total>0"
        :total="log.total"
        :page.sync="log.queryParams.pageNum"
        :limit.sync="log.queryParams.pageSize"
        @pagination="getLogList"
      />
    </el-dialog>
  </div>
</template>

<script>


import {
  textAdd,
  textEdit,
  textInfo,
  textList, textLogList,
  textRemove,
  textRemoves,
  textUsingChange
} from '../../../api/system/media/text'

export default {
  name: 'mediaText',
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
        textTitle: ''
      },
      layout: 'total, prev, pager, next, jumper',
      //文案列表
      textList: [],
      // 总条数
      total: 0,
      // 选中数组
      ids: [],
      textForm: {
        textId:undefined,
        textTitle: '',
        textContent: ''
      },
      textFormStatus: '',
      textFormRules: {
        textTitle: [
          { required: true, message: '请输入文案标题', trigger: 'blur' },
          { min: 2, max: 20, message: '文案标题长度在 2 到 20 个字符', trigger: 'blur' }
        ],
        textContent: [
          { required: true, message: '请输入文案内容', trigger: 'blur' },
          { min: 2, max: 10000, message: '文案内容长度在 2 到 10000 个字符', trigger: 'blur' }
        ]
      },
      log: {
        open: false,
        title: '',
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          targetId:undefined,
          operName:''
        },
        // 日期范围
        dateRange: [],
        list: [],
        // 总条数
        total: 0
      },
    }
  },
  created() {
    this.getList()
  },
  activated() {
    this.getList()
  },
  methods: {
    // 搜索按钮操作
    handleQuery() {
      this.queryParams.pageNum = 1
      this.getList()
    },
    // 重置搜索按钮操作
    resetQuery() {
      this.queryParams.textTitle = ''
      this.queryParams.dateRange = []
      this.resetForm('queryForm')
      this.handleQuery()
    },
    // 列表
    getList() {
      this.loading = true
      this.$modal.loading('正在更新数据，请稍候...')
      this.queryParams.organizationId = sessionStorage.getItem('organizationId')
      textList(this.addDateRange(this.queryParams, this.dateRange)).then(response => {
        this.textList = response.rows
        this.total = response.total
        this.loading = false
        this.$modal.closeLoading()
      })
    },
    textContentFormatter(row, column,cellValue,index){
      if(row.textContent!=''){
        let str = row.textContent.replaceAll(/[\r\n]/g,"")
        str = str.replaceAll("　","")
       return  str
      }
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.textId)
      this.single = selection.length != 1
      this.multiple = !selection.length
    },
    // 表单重置
    reset() {
      this.textForm = {
        textTitle: '',
        textContent: '',
        organizationId: undefined
      }
    },
    // 新增按钮
    handleAdd() {
      this.reset()
      this.open = true
      this.title = '添加文案'
      this.disable = false
      this.textFormStatus = 'add'
    },
    // 修改按钮
    handleUpdate(row) {
      this.reset()
      this.textFormStatus = 'edit'
      this.textForm.textId = row.textId
      let params = {
        textId: this.textForm.textId
      }
      textInfo(params).then(response => {
        this.textForm.textTitle = response.data.textTitle
        this.textForm.textContent = response.data.textContent
        this.open = true
      })
    },
    // 表单提交
    textSubmit() {
      this.$refs['textForm'].validate(valid => {
        if (valid) {
          this.$modal.loading('正在提交数据，请稍候...')
          if (this.textForm.textId) {
            textEdit(this.textForm).then(response => {
              this.$modal.msgSuccess('修改成功')
              this.open = false
              this.getList()
              this.$modal.closeLoading()
              this.reset()
            })
          } else {
            this.textForm.organizationId = sessionStorage.getItem('organizationId')
            textAdd(this.textForm).then(response => {
              this.$modal.msgSuccess('新增成功')
              this.open = false
              this.getList()
              this.$modal.closeLoading()
              this.reset()
            })
          }
        }
      })
    },
    // 弹出层取消
    textCancel() {
      this.reset()
      this.open = false
    },
    // 使用状态切换
    textUsingChange(row) {
      let text = row.textUsingFlag === '0' ? '下架' : '上架'
      let params = {
        textId: row.textId,
        textUsingFlag: row.textUsingFlag
      }
      this.$modal.confirm('确认要"' + text + '""' + row.textTitle + '"该文案吗？').then(function() {
        return textUsingChange(params)
      }).then(() => {
        this.$modal.msgSuccess(text + '成功')
        this.getList()
      }).catch(function() {
        // row.textUsingFlag = row.textUsingFlag === '0' ? '-1' : '0'
      })
    },
    // 文案删除按钮
    handleDelete(row) {
      this.reset()
      let params = {
        textId: row.textId
      }
      this.$modal.confirm('是否确认删除文案标题为"' + row.textTitle + '"的数据项？').then(function() {
        return textRemove(params)
      }).then(() => {
        this.getList()
        this.$modal.msgSuccess('删除成功')
      }).catch((e) => {
        console.log(e)
      })
    },
    // 文案批量删除按钮
    handleDeletes() {
      this.reset()
      let params = {
        textId: this.ids
      }
      this.$modal.confirm('是否确认删除文案编号为"' + this.ids + '"的数据项？').then(function() {
        return textRemoves(params)
      }).then(() => {
        this.getList()
        this.$modal.msgSuccess('删除成功')
      }).catch(() => {
        console.log(e)
      })
    },
    // =========== 媒资日志操作 start===========
    logQuery(){
      this.log.queryParams.pageNum = 1
      this.getLogList();
    },
    logQueryReset(){
      this.log.dateRange = []
      this.resetForm('logQueryFrom')
      this.log.queryParams.targetId = undefined
      this.log.list = []
    },
    getLogList(){
      this.$modal.loading('正在更新日志数据，请稍候...')
      textLogList(this.addDateRange(this.log.queryParams, this.log.dateRange)).then(response => {
        this.log.list = response.rows
        this.log.total = response.total
        this.$modal.closeLoading()
      })
    },
    logOpen(row) {
      this.logQueryReset();
      this.log.queryParams.targetId = row.textId
      this.logQuery()
      this.log.open = true
    },
    logClose(){
      this.log.open = false
    },
    // =========== 媒资日志操作 end===========

  }
}
</script>

<style>

</style>
