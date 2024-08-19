<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="标题" prop="title">
        <el-input
          v-model="queryParams.title"
          placeholder="请输入标题"
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
          v-hasPermi="['system:event:add']"
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
          v-hasPermi="['system:event:edit']"
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
          v-hasPermi="['system:event:remove']"
        >删除</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="eventList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="标题" align="center" prop="title" />
      <el-table-column label="初始图片" align="center" prop="initialImageId" width="100">
        <template slot-scope="scope">
          <image-preview v-if="scope.row.initialImage!=null" :src="scope.row.initialImage.fileVirtualPath" :width="50" :height="50"/>
        </template>
      </el-table-column>
      <el-table-column label="点击图片" align="center" prop="clickImageId" width="100">
        <template slot-scope="scope">
          <image-preview v-if="scope.row.clickImage!=null" :src="scope.row.clickImage.fileVirtualPath" :width="50" :height="50"/>
        </template>
      </el-table-column>
      <el-table-column label="已选定图片" align="center" prop="selectedImageId" width="100">
        <template slot-scope="scope">
          <image-preview v-if="scope.row.selectedImage!=null" :src="scope.row.selectedImage.fileVirtualPath" :width="50" :height="50"/>
        </template>
      </el-table-column>
      <el-table-column label="配置交互" align="center" prop="eachOther">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.sys_event_each_other" :value="scope.row.eachOther"/>
        </template>
			</el-table-column>
      <el-table-column label="悬浮" align="center" prop="suspension">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.sys_suspension_type" :value="scope.row.suspension"/>
        </template>
			</el-table-column>
      <el-table-column label="屏幕占比%" align="center" prop="screenProportion" />
      <el-table-column label="链接" align="center" prop="link" />
      <el-table-column label="链接地址" align="center" prop="content" />
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
            v-hasPermi="['system:event:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:event:remove']"
          >删除</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-setting"
            @click="handleModuleLog(scope.row)"
            v-hasPermi="['system:event:logList']"
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

    <!-- 添加或修改事件 -->
    <el-dialog :title="title" :visible.sync="open" width="800px" append-to-body :close-on-click-modal="false"
               :show-close="true">
      <el-form ref="form" :model="form" :rules="rules" label-width="90px">
        <el-form-item label="标题" prop="title">
          <el-input v-model="form.title" placeholder="请输入标题" style="width:90%"/>
        </el-form-item>
        <el-row :gutter="10">
          <el-col :span="7">
            <el-form-item label="初始图片" prop="initialImageId">
              <div
                style="width: 120px;max-height:120px;display: flex;align-items: center;justify-content: center;border: 1px solid #f5f5f5;overflow: hidden">
                <el-upload class="avatar-uploader" :action="upload.url"
                           :headers="upload.headers" :data="upload.data"
                           :show-file-list="false"
                           :on-success="(res,file)=>handleAvatarSuccess(res,file,'INITIAL_EVENT_IMAGE',form)"
                           :before-upload="(file)=>beforeAvatarUpload(file,'INITIAL_EVENT_IMAGE',form)">

                  <div v-if="form.initialImage!=null && form.initialImage.fileVirtualPath!=''" class="d-flex a-center j-center" style="height:120px;width:100%;border:1px solid #f5f5f5">
                    <img style="max-width: 120px;max-height: 120px;" v-if="form.initialImage.fileVirtualPath" :src="form.initialImage.fileVirtualPath" class="avatar">
                  </div>
                  <i v-else class="el-icon-plus avatar-uploader-icon"
                     style="width: 120px;height:120px;display: flex;align-items: center;justify-content: center;border: 1px solid #f5f5f5;"></i>
                </el-upload>
              </div>
              <el-button type="primary" class="mt-20" v-if="form.initialImage.fileVirtualPath"
                         @click="delImg('INITIAL_EVENT_IMAGE')">删除</el-button>

            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="点击图片" prop="clickImageId">
              <div
                style="width: 120px;max-height:120px;display: flex;align-items: center;justify-content: center;border: 1px solid #f5f5f5;overflow: hidden">
                <el-upload class="avatar-uploader" :action="upload.url"
                           :headers="upload.headers" :data="upload.data"
                           :show-file-list="false"
                           :on-success="(res,file)=>handleAvatarSuccess(res,file,'CLICK_EVENT_IMAGE',form)"
                           :before-upload="(file)=>beforeAvatarUpload(file,'CLICK_EVENT_IMAGE',form)">

                  <div v-if="form.clickImage!=null && form.clickImage.fileVirtualPath!=''" class="d-flex a-center j-center" style="height:120px;width:100%;border:1px solid #f5f5f5">
                    <img style="max-width: 120px;max-height: 120px;" v-if="form.clickImage.fileVirtualPath" :src="form.clickImage.fileVirtualPath" class="avatar">
                  </div>
                  <i v-else class="el-icon-plus avatar-uploader-icon"
                     style="width: 120px;height:120px;display: flex;align-items: center;justify-content: center;border: 1px solid #f5f5f5;"></i>
                </el-upload>
              </div>
              <el-button type="primary" class="mt-20" v-if="form.clickImage.fileVirtualPath"
                         @click="delImg('CLICK_EVENT_IMAGE')">删除</el-button>

            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="已选定图片" prop="selectedImageId">
              <div
                style="width: 120px;max-height:120px;display: flex;align-items: center;justify-content: center;border: 1px solid #f5f5f5;overflow: hidden">
                <el-upload class="avatar-uploader" :action="upload.url"
                           :headers="upload.headers" :data="upload.data"
                           :show-file-list="false"
                           :on-success="(res,file)=>handleAvatarSuccess(res,file,'SELECTED__EVENT_IMAGE',form)"
                           :before-upload="(file)=>beforeAvatarUpload(file,'SELECTED__EVENT_IMAGE',form)">

                  <div v-if="form.selectedImage!=null && form.selectedImage.fileVirtualPath!=''" class="d-flex a-center j-center" style="height:120px;width:100%;border:1px solid #f5f5f5">
                    <img style="max-width: 120px;max-height: 120px;" v-if="form.selectedImage.fileVirtualPath" :src="form.selectedImage.fileVirtualPath" class="avatar">
                  </div>
                  <i v-else class="el-icon-plus avatar-uploader-icon"
                     style="width: 120px;height:120px;display: flex;align-items: center;justify-content: center;border: 1px solid #f5f5f5;"></i>
                </el-upload>
              </div>
              <el-button type="primary" class="mt-20" v-if="form.selectedImage.fileVirtualPath"
                         @click="delImg('SELECTED__EVENT_IMAGE')">删除</el-button>

            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="悬浮" prop="suspension">
          <el-radio-group v-model="form.suspension">
            <el-radio
              v-for="dict in dict.type.sys_suspension_type"
              :key="dict.value"
              :label="dict.value"
            >{{dict.label}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="配置交互" prop="eachOther">
          <el-radio-group v-model="form.eachOther">
            <el-radio
              v-for="dict in dict.type.sys_event_each_other"
              :key="dict.value"
              :label="dict.value"
            >{{dict.label}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="屏幕占比" prop="screenProportion" v-if="form.eachOther == '0'">
          <el-input v-model="form.screenProportion" placeholder="100" style="width:16%"/>%
        </el-form-item>
        <el-row>
          <el-form-item label="配置内容" prop="content">
          <el-col :span="6">
            <el-input v-model="form.link" placeholder="链接" style="width:160px"/>
          </el-col>
          <el-col :span="18">
              <el-input v-model="form.content" placeholder="链接地址" style="width:430px"/>
            </el-col>
          </el-form-item>
        </el-row>
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
import {
  listEvent, getEvent, delEvent, addEvent, updateEvent, eventLogList, updateStatus} from "@/api/system/event/event";
import { getToken } from '@/utils/auth'
export default {
  name: "event",
  dicts: ['sys_event_each_other','sys_suspension_type'],
  data() {
    return {
      //修改状态权限
      updateStatusPermi: this.$auth.hasPermi("system:event:updateStatus"),
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
      eventList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
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
        title: '',
        initialImageId: null,
        clickImageId: null,
        selectedImageId: null,
        eachOther: '0',
        suspension: '0',
        screenProportion: null,
        organizationId:sessionStorage.getItem('organizationId'),
        content: '',
        status: 'E',
        initialImage: {
          fileId: undefined,
          fileOriginalName: '',
          fileVirtualPath: ''
        },
        clickImage: {
          fileId: undefined,
          fileOriginalName: '',
          fileVirtualPath: ''
        },
        selectedImage: {
          fileId: undefined,
          fileOriginalName: '',
          fileVirtualPath: ''
        },
      },
      // 表单校验
      rules: {
        title: [
          { required: true, message: "标题不能为空", trigger: "blur" }
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
    /** 查询事件列表 */
    getList() {
      this.loading = true;
      listEvent(this.addDateRange(this.queryParams, this.dateRange)).then(response => {
        this.eventList = response.rows;
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
        title: '',
        initialImageId: null,
        clickImageId: null,
        selectedImageId: null,
        eachOther: '0',
        suspension: '0',
        screenProportion: null,
        organizationId:sessionStorage.getItem('organizationId'),
        content: '',
        status: 'E',
        initialImage: {
          fileId: undefined,
          fileOriginalName: '',
          fileVirtualPath: ''
        },
        clickImage: {
          fileId: undefined,
          fileOriginalName: '',
          fileVirtualPath: ''
        },
        selectedImage: {
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
      this.title = "添加事件";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getEvent(id).then(response => {
        this.form = response.data;
        if(this.form.initialImage == null){
          this.form.initialImage = this.defaultImg
        }
        if(this.form.clickImage == null){
          this.form.clickImage = this.defaultImg
        }
        if(this.form.selectedImage == null){
          this.form.selectedImage = this.defaultImg
        }
        this.open = true;
        this.title = "修改事件";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if(this.form.initialImage!=null && this.form.initialImage.fileId!=null && this.form.initialImage.fileId!=undefined){
          this.form.initialImageId = this.form.initialImage.fileId
        }
        if(this.form.clickImage!=null && this.form.clickImage.fileId!=null && this.form.clickImage.fileId!=undefined){
          this.form.clickImageId = this.form.clickImage.fileId
        }
        if(this.form.selectedImage!=null && this.form.selectedImage.fileId!=null && this.form.selectedImage.fileId!=undefined){
          this.form.selectedImageId = this.form.selectedImage.fileId
        }
        if(this.form.initialImage ==null || this.form.initialImage ==undefined){
          this.$modal.msgError("请先上传初始图片");
          return;
        }
        if (this.form.eachOther != '0') {
          this.form.screenProportion = ''
        }else if (this.form.eachOther == '0' && (this.form.screenProportion == '' || this.form.screenProportion == null)) {
          this.form.screenProportion = '100';
        }
        if (valid) {
          if (this.form.id != null) {
            updateEvent(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addEvent(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除事件编号为"' + ids + '"的数据项？').then(function() {
        return delEvent(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },

    //日志
    handleModuleLog(row){
      this.openModuleLog = true;
      eventLogList({targetId: row.id}).then(response => {
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
        if (source == 'INITIAL_EVENT_IMAGE') {
          this.form.initialImage = res.data
        } else if (source == 'CLICK_EVENT_IMAGE') {
          this.form.clickImage = res.data
        } else if (source == 'SELECTED__EVENT_IMAGE') {
          this.form.selectedImage = res.data
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
      if(val == 'INITIAL_EVENT_IMAGE'){
        this.form.initialImageId = undefined
        this.form.initialImage.fileId = undefined
        this.form.initialImage.fileOriginalName = ''
        this.form.initialImage.fileVirtualPath = ''
      } else if(val == 'CLICK_EVENT_IMAGE'){
        this.form.clickImageId = undefined
        this.form.clickImage.fileId = undefined
        this.form.clickImage.fileOriginalName = ''
        this.form.clickImage.fileVirtualPath = ''
      }else if(val == 'SELECTED__EVENT_IMAGE'){
        this.form.selectedImageId = undefined
        this.form.selectedImage.fileId = undefined
        this.form.selectedImage.fileOriginalName = ''
        this.form.selectedImage.fileVirtualPath = ''
      }
    },

  }
};
</script>
