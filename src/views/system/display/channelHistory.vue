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
      <el-form-item label="推文来源" prop="tweetOrganizationName">
        <el-input
          v-model="queryParams.tweetOrganizationName"
          placeholder="请输入推文来源"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="推文名称" prop="tweetTitle">
        <el-input
          v-model="queryParams.tweetTitle"
          placeholder="请输入推文名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="推文类型" prop="tweetCommonFlag">
        <el-select v-model="queryParams.tweetCommonFlag" placeholder="请选择推文类型" clearable style="width:208px">
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
          style="width: 250px"
          value-format="yyyy-MM-dd HH:mm:ss"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="['00:00:00', '23:59:59']"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="创建人" prop="createBy">
        <el-input
          v-model="queryParams.createBy"
          placeholder="请输入用户名"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="渠道类型" prop="channelType">
        <el-select v-model="queryParams.channelType" placeholder="请选择渠道类型" clearable style="width:208px">
          <el-option
            v-for="dict in dict.type.tweet_channel"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="渠道名称" prop="channelName">
        <el-input
          v-model="queryParams.channelName"
          placeholder="请输入渠道名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="渠道编码" prop="channelCode">
        <el-input
          v-model="queryParams.channelCode"
          placeholder="请输入渠道编码"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-form>
    <!--列表-->
    <el-table v-loading="loading" :data="tweetList" @selection-change="handleSelectionChange"
              @sort-change="handleSortChange"
              :header-cell-style="{background:'#afccfd',color:'#333'}"
              @expand-change="expandChange"
              :row-style="isRed"
    >
      <el-table-column label="" type="expand" width="25">
        <template slot-scope="scope">
          <el-table :header-cell-style="{background:'#DDEBF7',color:'#333',padding: '3px'}"
                    style="margin:0 40px;box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);"
                    :cell-style="{padding: '3px'}"
                    :data="scope.row.tweetChannels"
                    v-loading="loadingChannel"
                    @sort-change="(column, prop, order) => handleSortChangeChannel(column, prop, order,scope.row)"
          >
            <el-table-column label="渠道序号" align="center" width="100">
              <template slot-scope="scop">
                {{ scop.$index + 1 }}
              </template>
            </el-table-column>
            <el-table-column label="渠道所属组织" prop="organizationName" align="center" sortable="custom" :sort-orders="['descending', 'ascending']">
              <template #default="scop">
                {{ scop.row.organizationName }}
              </template>
            </el-table-column>
            <el-table-column label="渠道类型" prop="channelType" align="center" sortable="custom" :sort-orders="['descending', 'ascending']">
              <template #default="scop">
                <dict-tag :options="dict.type.tweet_channel" :value="scop.row.channelType"/>
              </template>
            </el-table-column>
            <el-table-column label="渠道名称" prop="stc.channelName" align="center" sortable="custom" :sort-orders="['descending', 'ascending']">
              <template #default="scop">
                {{ scop.row.channelName }}
              </template>
            </el-table-column>
            <el-table-column label="渠道编码" prop="stc.channelCode" align="center" sortable="custom" :sort-orders="['descending', 'ascending']">
              <template #default="scop">
                {{ scop.row.channelCode }}
              </template>
            </el-table-column>
            <el-table-column label="上架状态" prop="stc.status" align="center" width="120" sortable="custom" :sort-orders="['descending', 'ascending']">
              <template #default="scop">
                <el-tag :type="scop.row.status === 'E' ? 'success' : scop.row.status === 'J' ? 'danger' : ''">
                  {{ scop.row.status === 'E' ? '上架' : scop.row.status === 'J' ? '下架' : '删除' }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="分发规则" prop="stc.shareRules" align="center" sortable="custom" :sort-orders="['descending', 'ascending']">
              <template #default="scop">
                  {{ scop.row.shareRules === '0' ? '由当前账号分发' : scop.row.shareRules === '1' ? '由指定账号分发' : '' }}
              </template>
            </el-table-column>
            <el-table-column label="指定分发人" align="center">
              <template #default="scop">
                <span v-if="scop.row.shareRules=='1'">（{{scop.row.shareOrgName}}）{{scop.row.shareUserName}}</span>
              </template>
            </el-table-column>
          </el-table>
        </template>
      </el-table-column>
      <el-table-column label="推文编号" prop="st.tweetId" align="center" width="100" sortable="custom" :sort-orders="['descending', 'ascending']">
        <template #default="scope">
          {{ scope.row.tweetId }}
        </template>
      </el-table-column>
      <el-table-column label="推文来源" prop="org.organizationName" align="center" width="150" sortable="custom" :sort-orders="['descending', 'ascending']">
        <template #default="scope">
          {{ scope.row.organizationName }}
        </template>
      </el-table-column>
      <el-table-column label="推文名称" prop="st.tweetTitle" align="left" sortable="custom" :sort-orders="['descending', 'ascending']">
        <template #default="scope">
          {{ scope.row.tweetTitle }}
        </template>
      </el-table-column>
      <el-table-column label="推文类型" prop="st.tweetCommonFlag" align="center" sortable="custom" :sort-orders="['descending', 'ascending']">
        <template #default="scope">
          {{ scope.row.tweetCommonFlag === '1' ? '公共' : '私有' }}
        </template>
      </el-table-column>
      <el-table-column label="创建人" prop="st.createBy" align="center" width="150" sortable="custom" :sort-orders="['descending', 'ascending']">
        <template #default="scope">
          {{ scope.row.createBy }}
        </template>
      </el-table-column>
      <el-table-column label="创建时间" prop="st.createTime" align="center" width="180" sortable="custom" :sort-orders="['descending', 'ascending']">
        <template #default="scope">
          {{ scope.row.createTime }}
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-document"
            @click="handleTweetPreview(scope.row)"
          >预览
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
import {
  tweetList, tweetChannelList
} from '../../../api/system/display/channel'
import tweetPreview from '@/components/tweet/tweetPreview.vue'
export default {
  name: 'channelHistory',
  dicts: ['tweet_channel'],
  components: { tweetPreview },
  data() {
    return {
      tweetCommonFlags:[
        {
          value: '1',
          label: '公共'
        },
        {
          value: '0',
          label: '私有'
        },
      ],
      channelStatuss:[
        {
          value: 'E',
          label: '上架'
        },
        {
          value: 'J',
          label: '下架'
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
      // 日期范围
      dateRange: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        tweetStatus: '0',
        isImage:1,
        tweetId:undefined,
        tweetOrganizationName:'',
        tweetTitle: '',
        tweetCommonFlag: '',
        createBy:'',
        channelType:'',
        channelName:'',
        channelCode:'',
        channelStatus:'',
        organizationId: sessionStorage.getItem("organizationId")
      },
      //推文列表
      tweetList: [],
      // 总条数
      total: 0,
      // 选中数组
      ids: [],
      // 是否显示弹出层
      open: false,
      // 弹出层标题
      title: '',
      //推文预览
      tweetPreview:false,
      //子表查询
      loadingChannel: false,
      clickTweetIds:[],
    }
  },
  created() {
    this.getList()
  },
  activated() {
    this.getList()
  },
  mounted() {

  },
  methods: {
    //子记录点击变色
    expandChange(row) {
      if(this.clickTweetIds.includes(row.tweetId)){
        this.clickTweetIds.splice(this.clickTweetIds.findIndex(item => item === row.tweetId),1);
      }else{
        this.clickTweetIds.push(row.tweetId)
      }
      //查询数据
      this.loadingChannel = true;
      tweetChannelList({
        pageNum: 1,
        pageSize: 1000,
        tweetId: row.tweetId,
        channelType:this.queryParams.channelType,
        channelName:this.queryParams.channelName,
        channelCode:this.queryParams.channelCode,
        channelStatus:this.queryParams.channelStatus,
        organizationId: sessionStorage.getItem("organizationId")
      }).then(response => {
        row.tweetChannels = response.rows;
        this.loadingChannel = false;
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
      this.queryParams.pageNum = 1
      this.getList()
    },
    // 重置搜索按钮操作
    resetQuery() {
      this.dateRange = []
      this.queryParams = {
        pageNum: 1,
        pageSize: 10,
        tweetStatus: '0',
        isImage:1,
        tweetId:undefined,
        tweetOrganizationName:'',
        tweetTitle: '',
        tweetCommonFlag: '',
        createBy:'',
        channelType:'',
        channelName:'',
        channelCode:'',
        channelStatus:'',
        organizationId: sessionStorage.getItem("organizationId")
      },
      this.handleQuery()
    },
    // 列表
    getList() {
      if(this.queryParams.tweetId !=null && this.queryParams.tweetId !=undefined && this.queryParams.tweetId !=''){
        if(!(!isNaN(parseFloat(this.queryParams.tweetId)) && isFinite(this.queryParams.tweetId))){
          this.$modal.msgError('推文编号请填写数字')
          return
        }
      }
      this.clickTweetIds = []
      this.loading = true
      this.queryParams.organizationId = sessionStorage.getItem('organizationId')
      tweetList(this.addDateRange(this.queryParams, this.dateRange)).then(response => {
        this.tweetList = response.rows
        this.total = response.total
        this.loading = false
      })
    },
    /** 排序触发事件 */
    handleSortChange(column, prop, order) {
      this.queryParams.orderByColumn = column.prop;
      this.queryParams.isAsc = column.order;
      this.getList();
    },
    handleSortChangeChannel(column, prop, order, parentRow){
      this.loadingChannel = true;
      tweetChannelList({
        pageNum: 1,
        pageSize: 1000,
        tweetId: parentRow.tweetId,
        channelType:this.queryParams.channelType,
        channelName:this.queryParams.channelName,
        channelCode:this.queryParams.channelCode,
        channelStatus:this.queryParams.channelStatus,
        organizationId: sessionStorage.getItem("organizationId"),
        orderByColumn: column.prop,
        isAsc: column.order,
      }).then(response => {
        parentRow.tweetChannels = response.rows;
        this.loadingChannel = false;
      });
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.tweetId)
      this.single = selection.length != 1
      this.multiple = !selection.length
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
