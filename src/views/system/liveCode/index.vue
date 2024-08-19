<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="类型" prop="type">
        <el-select v-model="queryParams.type" placeholder="请选择类型" clearable>
          <el-option
            v-for="dict in dict.type.sys_live_code_type"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="名称" prop="title">
        <el-input
          v-model="queryParams.title"
          placeholder="请输入名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
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
          v-hasPermi="['system:liveCode:add']"
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
          v-hasPermi="['system:liveCode:edit']"
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
          v-hasPermi="['system:liveCode:remove']"
        >删除</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="codeList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="类型" align="center" prop="type">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.sys_live_code_type" :value="scope.row.type"/>
        </template>
			</el-table-column>
      <el-table-column label="名称" align="center" prop="title" />
      <el-table-column label="图片" align="center" prop="imageId" width="100">
        <template slot-scope="scope">
          <image-preview v-if="scope.row.image!=null" :src="scope.row.image.fileVirtualPath" :width="50" :height="50"/>
        </template>
      </el-table-column>
      <el-table-column label="默认图片" align="center" prop="defaultImageId" width="100">
        <template slot-scope="scope">
          <image-preview v-if="scope.row.defaultImage!=null" :src="scope.row.defaultImage.fileVirtualPath" :width="50" :height="50"/>
        </template>
      </el-table-column>
      <el-table-column label="详细信息" align="center" prop="detail" />
      <el-table-column label="状态" align="center" key="status" v-if="updateStatusPermi">
				<template slot-scope="scope">
					<el-switch v-model="scope.row.status" active-value="E" inactive-value="J"
						@change="handleStatusChange(scope.row)"></el-switch>
				</template>
			</el-table-column>
			<el-table-column label="状态" align="center" key="status" v-if="!updateStatusPermi">
				<template #default="scope">
					<el-tag :type="scope.row.status === 'E' ? 'success' : scope.row.status === 'J' ? 'danger' : ''">
						{{ scope.row.status === 'E' ? '启用' : '停用' }}
					</el-tag>
				</template>
			</el-table-column>
      <el-table-column label="创建者" align="center" prop="createBy" width="100">
				<template slot-scope="scope">
					{{scope.row.createBy }}
				</template>
			</el-table-column>
			<el-table-column label="创建时间" align="center" prop="createTime" width="150" sortable="custom"
				:sort-orders="['descending', 'ascending']">
				<template slot-scope="scope">
					<span>{{ parseTime(scope.row.createTime, '{y}-{m}-{d} {h}:{i}') }}</span>
				</template>
			</el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['system:liveCode:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:liveCode:remove']"
          >删除</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-setting"
            @click="handleModuleLog(scope.row)"
            v-hasPermi="['system:liveCode:logList']"
          >日志</el-button>
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

    <!-- 添加或修改活码对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body :close-on-click-modal="false"
    :show-close="true">
      <el-form ref="form" :model="form" :rules="rules" label-width="90px">
        <el-form-item label="类型" prop="type">
          <el-select v-model="form.type" clearable placeholder="请选择类型" style="width:200px">
            <el-option
              v-for="dict in dict.type.sys_live_code_type"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="名称" prop="title">
          <el-input v-model="form.title" placeholder="请输入名称" style="width:90%"/>
        </el-form-item>
        <el-form-item label="图片" prop="imageId">
          <div
            style="width: 120px;max-height:120px;display: flex;align-items: center;justify-content: center;border: 1px solid #f5f5f5;overflow: hidden">
            <el-upload class="avatar-uploader" :action="upload.url"
              :headers="upload.headers" :data="upload.data"
              :show-file-list="false"
              :on-success="(res,file)=>handleAvatarSuccess(res,file,'SCENE_LIVE_CODE_IMAGE',form)"
              :before-upload="(file)=>beforeAvatarUpload(file,'SCENE_LIVE_CODE_IMAGE',form)">

              <div v-if="form.image!=null && form.image.fileVirtualPath!=''" class="d-flex a-center j-center" style="height:120px;width:100%;border:1px solid #f5f5f5">
                <img style="max-width: 120px;max-height: 120px;" v-if="form.image.fileVirtualPath" :src="form.image.fileVirtualPath" class="avatar">
              </div>
              <i v-else class="el-icon-plus avatar-uploader-icon"
                style="width: 120px;height:120px;display: flex;align-items: center;justify-content: center;border: 1px solid #f5f5f5;"></i>
            </el-upload>
          </div>
          <el-button type="primary" class="mt-20" v-if="form.image.fileVirtualPath"
            @click="delImg('SCENE_LIVE_CODE_IMAGE')">删除</el-button>
          </el-upload>
        </el-form-item>
        <el-form-item label="默认图片" prop="defaultImageId" v-if="form.type !=null && form.type !='' && form.type !='other'">
          <div
            style="width: 120px;max-height:120px;display: flex;align-items: center;justify-content: center;border: 1px solid #f5f5f5;overflow: hidden">
            <el-upload class="avatar-uploader" :action="upload.url"
              :headers="upload.headers" :data="upload.data"
              :show-file-list="false"
              :on-success="(res,file)=>handleAvatarSuccess(res,file,'SCENE_LIVE_CODE_DEFAULT_IMAGE',form)"
              :before-upload="(file)=>beforeAvatarUpload(file,'SCENE_LIVE_CODE_DEFAULT_IMAGE',form)">

              <div v-if="form.defaultImage!=null && form.defaultImage.fileVirtualPath!=''" class="d-flex a-center j-center" style="height:120px;width:100%;border:1px solid #f5f5f5">
                <img style="max-width: 120px;max-height: 120px;" v-if="form.defaultImage.fileVirtualPath" :src="form.defaultImage.fileVirtualPath" class="avatar">
              </div>
              <i v-else class="el-icon-plus avatar-uploader-icon"
                style="width: 120px;height:120px;display: flex;align-items: center;justify-content: center;border: 1px solid #f5f5f5;"></i>
            </el-upload>
          </div>
          <el-button type="primary" class="mt-20" v-if="form.defaultImage.fileVirtualPath"
            @click="delImg('SCENE_LIVE_CODE_DEFAULT_IMAGE')">删除</el-button>
          </el-upload>
        </el-form-item>
        <el-form-item label="详细信息" prop="detail">
          <el-input type="textarea" :autosize={minRows:4} style="width:90%" v-model="form.detail" placeholder="请输入详细信息" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <!--操作日志列表-->
		<el-dialog title="日志列表" :visible.sync="openModuleLog" width="700px" append-to-body :close-on-click-modal="false"
    :show-close="true" @close="closeModuleLog">
    <div class="block">
      <el-timeline>
        <el-timeline-item v-for="(log, index) in moduleLogList" :key="index"
          :timestamp="parseTime(log.createTime, '{y}-{m}-{d} {h}:{i}:{s}') " placement="top">
          <el-card style="width: 550px;">
            <h4>{{log.createBy}}</h4>
            <p v-html="log.operTitle">{{log.operTitle}}</p>
          </el-card>
        </el-timeline-item>
      </el-timeline>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button @click="closeModuleLog">取 消</el-button>
    </div>
  </el-dialog>
  </div>
</template>

<script>
import { listCode, getCode, delCode, addCode, updateCode,liveCodeLogList,updateStatus } from "@/api/system/liveCode/code";
import { getToken } from '@/utils/auth'
export default {
  name: "liveCode",
  dicts: ['sys_live_code_type'],
  data() {
    return {
      //修改状态权限
			updateStatusPermi: this.$auth.hasPermi("system:liveCode:updateStatus"),
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
      // 活码表格数据
      codeList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        type: null,
        title: null,
        status: null,
        organizationId:sessionStorage.getItem('organizationId'),
      },
      // 日期范围
      dateRange: [],
      defaultImg: {
        fileId: undefined,
        fileOriginalName: '',
        fileVirtualPath: ''
      },
      // 表单参数
      form: {
        id: null,
        type: null,
        title: '',
        imageId: null,
        defaultImageId: null,
        detail: '',
        organizationId:sessionStorage.getItem('organizationId'),
        status: 'E',
        image: {
          fileId: undefined,
          fileOriginalName: '',
          fileVirtualPath: ''
        },
        defaultImage: {
          fileId: undefined,
          fileOriginalName: '',
          fileVirtualPath: ''
        },
      },
      // 表单校验
      rules: {
        type: [
          { required: true, message: "类型不能为空", trigger: "blur" }
        ],
        title: [
          { required: true, message: "名称不能为空", trigger: "blur" }
        ],
      },

      //日志
      moduleLogList: [],
      openModuleLog: false,

      // 上传
      upload: {
        url: process.env.VUE_APP_BASE_API + '/common/upload',
        headers: {
          Authorization: 'Bearer ' + getToken()
        },
        data: {
          source: ''
        }
      },
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询活码列表 */
    getList() {
      this.loading = true;
      listCode(this.addDateRange(this.queryParams, this.dateRange)).then(response => {
        this.codeList = response.rows;
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
        type: null,
        title: '',
        imageId: null,
        defaultImageId: null,
        detail: '',
        organizationId:sessionStorage.getItem('organizationId'),
        status: 'E',
        image: {
          fileId: undefined,
          fileOriginalName: '',
          fileVirtualPath: ''
        },
        defaultImage: {
          fileId: undefined,
          fileOriginalName: '',
          fileVirtualPath: ''
        },
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
      this.title = "添加活码";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getCode(id).then(response => {
        this.form = response.data;
        if(this.form.image == null){
          this.form.image = this.defaultImg
        }
        if(this.form.defaultImage == null){
          this.form.defaultImage = this.defaultImg
        }
        this.open = true;
        this.title = "修改活码";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if(this.form.image!=null && this.form.image.fileId!=null && this.form.image.fileId!=undefined){
          this.form.imageId = this.form.image.fileId
        }
        if(this.form.defaultImage!=null && this.form.defaultImage.fileId!=null && this.form.defaultImage.fileId!=undefined){
          this.form.defaultImageId = this.form.defaultImage.fileId
        }
        if(this.form.type=='other' && (this.form.imageId ==null || this.form.imageId ==undefined)){
          this.$modal.msgError("请先上传图片");
          return;
        }
        if (valid) {
          if (this.form.id != null) {
            updateCode(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addCode(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除活码编号为"' + ids + '"的数据项？').then(function() {
        return delCode(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },

    //日志
    handleModuleLog(row){
      this.openModuleLog = true;
      liveCodeLogList({targetId: row.id}).then(response => {
        this.moduleLogList = response.rows;
      });
    },
    //关闭日志弹窗
    closeModuleLog(){
      this.openModuleLog = false;
      this.moduleLogList = [];
    },

    // 表单修改
    handleStatusChange(row) {
      let text = row.status === 'E' ? '启用' : '停用'
      this.$modal.confirm('确认要"' + text + '"名称为"' + row.title + '"的记录吗？').then(function() {
        return updateStatus({
          id: row.id,
          status: row.status
        })
      }).then(() => {
        this.$modal.msgSuccess(text + '成功')
      }).catch(function() {
        row.status = row.status === 'E' ? 'J' : 'E'
      })
    },

    //展示图 文件上传
    handleAvatarSuccess(res, file, source, item) {
      if(res.code!=200){
        this.$message.error(res.msg)
        return;
      }else{
        if (source == 'SCENE_LIVE_CODE_IMAGE') {
          this.form.image = res.data
        } else if (source == 'SCENE_LIVE_CODE_DEFAULT_IMAGE') {
          this.form.defaultImage = res.data
        }
      }
    },
		beforeAvatarUpload(file, source) {
      const isJPG = file.type
      const isLt5M = file.size / 1024 / 1024 < 5
      if (isJPG != 'image/jpeg' && isJPG != 'image/png') {
        this.$message.error(`上传头像图片只能是 JPG/PNG 格式!`)
      }
      if (!isLt5M) {
        this.$message.error('上传头像图片大小不能超过 5MB!')
      }
      this.upload.data.source = source
      return isJPG && isLt5M
    },
    delImg(val){
      if(val == 'SCENE_LIVE_CODE_IMAGE'){
        this.form.imageId = undefined
        this.form.image.fileId = undefined
        this.form.image.fileOriginalName = ''
        this.form.image.fileVirtualPath = ''
      } else if(val == 'SCENE_LIVE_CODE_DEFAULT_IMAGE'){
        this.form.defaultImageId = undefined
        this.form.defaultImage.fileId = undefined
        this.form.defaultImage.fileOriginalName = ''
        this.form.defaultImage.fileVirtualPath = ''
      }
    },
    
  }
};
</script>
