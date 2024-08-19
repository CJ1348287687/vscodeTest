<template>
  <div class="app-container">
    <!--    <el-row :gutter="20">-->
    <!--层级数据-->
    <!--      <el-col :span="4" :xs="24">-->
    <!--        <div class="head-container">-->
    <!--          <el-input-->
    <!--            v-model="deptName"-->
    <!--            placeholder="请输入层级名称"-->
    <!--            clearable-->
    <!--            size="small"-->
    <!--            prefix-icon="el-icon-search"-->
    <!--            style="margin-bottom: 20px"-->
    <!--          />-->
    <!--        </div>-->
    <!--        <div class="head-container">-->
    <!--          <el-tree-->
    <!--            :data="deptOptions"-->
    <!--            :props="defaultProps"-->
    <!--            :expand-on-click-node="false"-->
    <!--            :filter-node-method="filterNode"-->
    <!--            ref="tree"-->
    <!--            node-key="id"-->
    <!--            default-expand-all-->
    <!--            highlight-current-->
    <!--            @node-click="handleNodeClick"-->
    <!--          />-->
    <!--        </div>-->
    <!--      </el-col>-->
    <!--成员数据-->
    <!--      <el-col :span="20" :xs="24">-->
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="账号名称" prop="userName">
        <el-input
          v-model="queryParams.userName"
          placeholder="请输入账号名称（登录名称）"
          clearable
          style="width: 240px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="成员名称" prop="nickName">
        <el-input
          v-model="queryParams.nickName"
          placeholder="请输入成员名称"
          clearable
          style="width: 240px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="手机号码" prop="phonenumber">
        <el-input
          v-model="queryParams.phonenumber"
          placeholder="请输入手机号码"
          clearable
          style="width: 240px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="归属层级" prop="deptName">
        <el-input
          v-model="queryParams.deptName"
          placeholder="请输入归属层级"
          clearable
          style="width: 240px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select
          v-model="queryParams.status"
          placeholder="成员状态"
          clearable
          style="width: 240px"
        >
          <el-option
            v-for="dict in dict.type.sys_normal_disable"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="工号" prop="jobNumber">
        <el-input
          v-model="queryParams.jobNumber"
          placeholder="请输入工号"
          clearable
          style="width: 240px"
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

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['system:user:add']"
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
          v-hasPermi="['system:user:edit']"
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
          @click="handleDelete"
          v-hasPermi="['system:user:remove']"
        >删除
        </el-button>
      </el-col>
      <!--          <el-col :span="1.5">-->
      <!--            <el-button-->
      <!--              type="info"-->
      <!--              plain-->
      <!--              icon="el-icon-upload2"-->
      <!--              size="mini"-->
      <!--              @click="handleImport"-->
      <!--              v-hasPermi="['system:user:import']"-->
      <!--            >导入</el-button>-->
      <!--          </el-col>-->
      <!--          <el-col :span="1.5">-->
      <!--            <el-button-->
      <!--              type="warning"-->
      <!--              plain-->
      <!--              icon="el-icon-download"-->
      <!--              size="mini"-->
      <!--              @click="handleExport"-->
      <!--              v-hasPermi="['system:user:export']"-->
      <!--            >导出</el-button>-->
      <!--          </el-col>-->
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList" :columns="columns"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="userList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="50" align="center"/>
      <el-table-column label="成员编号" align="center" key="userId" prop="userId" v-if="columns[0].visible" width="100"/>
      <el-table-column label="账号名称（登录名称）" align="center" key="userName" prop="userName" v-if="columns[1].visible"

      />
      <el-table-column label="成员名称" align="center" key="nickName" prop="nickName" v-if="columns[2].visible"

      />
      <el-table-column label="手机号码" align="center" key="phonenumber" prop="phonenumber" v-if="columns[4].visible"
                       width="120"
      />
      <el-table-column label="工号" align="center" key="jobNumber" prop="jobNumber" v-if="columns[6].visible"/>
      <el-table-column label="归属层级" align="center" key="deptName" prop="dept.deptName" v-if="columns[3].visible"
      />
      <el-table-column label="状态" align="center" key="status" v-if="columns[5].visible" width="150">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.status"
            active-value="0"
            inactive-value="1"
            @change="handleStatusChange(scope.row)"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" prop="createTime" v-if="columns[6].visible" width="160">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        width="250"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope" v-if="scope.row.userId !== 1">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleUserOrganization(scope.row)"
            v-hasPermi="['system:user:remove']"
          >用户组织
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['system:user:edit']"
          >修改
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:user:remove']"
          >删除
          </el-button>
          <el-dropdown size="mini" @command="(command) => handleCommand(command, scope.row)"
                       v-hasPermi="['system:user:resetPwd', 'system:user:edit']"
          >
            <el-button size="mini" type="text" icon="el-icon-d-arrow-right">更多</el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="handleResetPwd" icon="el-icon-key"
                                v-hasPermi="['system:user:resetPwd']"
              >重置密码
              </el-dropdown-item>
              <!--                  <el-dropdown-item command="handleAuthRole" icon="el-icon-circle-check"-->
              <!--                    v-hasPermi="['system:user:edit']">分配角色</el-dropdown-item>-->
            </el-dropdown-menu>
          </el-dropdown>
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
    <!--      </el-col>-->
    <!--    </el-row>-->

    <!-- 添加或修改成员配置对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="900px" append-to-body :close-on-click-modal="false" :show-close="false" :close-on-press-escape="false">
      <el-form ref="form" :model="form" :rules="rules" label-width="145px">
        <el-row>
          <el-col :span="10">
            <el-form-item label="成员名称" prop="nickName">
              <el-input v-model="form.nickName" placeholder="请输入成员名称" maxlength="30"/>
            </el-form-item>
          </el-col>
          <el-col :span="14">
            <el-form-item label="归属层级" prop="deptId">
              <treeselect v-model="form.deptId" :options="deptOptions" :show-count="true" placeholder="请选择归属层级"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10">
            <el-form-item label="手机号码" prop="phonenumber">
              <el-input v-model="form.phonenumber" placeholder="请输入手机号码" maxlength="11"/>
            </el-form-item>
          </el-col>
          <el-col :span="14">
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="form.email" placeholder="请输入邮箱" maxlength="50"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10">
            <el-form-item v-if="form.userId == undefined" label="账号名称(登录名称)" prop="userName">
              <el-input v-model="form.userName" placeholder="请输入账号名称（登录名称）" maxlength="30"/>
            </el-form-item>
          </el-col>
          <el-col :span="14">
            <el-form-item v-if="form.userId == undefined" label="账号密码" prop="password">
              <el-input v-model="form.password" placeholder="请输入账号密码" type="password" maxlength="20" show-password auto-complete="new-password" />
            </el-form-item>
          </el-col>
          <!-- <el-col :span="12">
            <el-form-item label="岗位">
              <el-select v-model="form.postIds" multiple placeholder="请选择岗位">
                <el-option
                  v-for="item in postOptions"
                  :key="item.postId"
                  :label="item.postName"
                  :value="item.postId"
                  :disabled="item.status == 1"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col> -->
        </el-row>
        <el-row>
          <el-col :span="10">
            <el-form-item label="工号" prop="jobNumber">
              <el-input v-model="form.jobNumber" placeholder="请输入工号" maxlength="50"/>
            </el-form-item>
          </el-col>
          <el-col :span="14">
            <el-form-item label="账号属性"  v-if="currentUser === 'admin'">
              <el-radio-group v-model="form.accountAttributes">
                <el-radio
                  v-for="dict in dict.type.sys_account_attributes"
                  :key="dict.value"
                  :label="dict.value"
                >{{ dict.label }}
                </el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10">
            <el-form-item label="成员性别">
              <el-select v-model="form.sex" placeholder="请选择性别">
                <el-option
                  v-for="dict in dict.type.sys_user_sex"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="14">
            <el-form-item label="状态">
              <el-radio-group v-model="form.status">
                <el-radio
                  v-for="dict in dict.type.sys_normal_disable"
                  :key="dict.value"
                  :label="dict.value"
                >{{ dict.label }}
                </el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>

          <!--          <el-col :span="12">-->
          <!--            <el-form-item label="角色">-->
          <!--              <el-select v-model="form.roleIds" multiple placeholder="请选择角色">-->
          <!--                <el-option-->
          <!--                  v-for="item in roleOptions"-->
          <!--                  :key="item.roleId"-->
          <!--                  :label="item.roleName"-->
          <!--                  :value="item.roleId"-->
          <!--                  :disabled="item.status == 1"-->
          <!--                ></el-option>-->
          <!--              </el-select>-->
          <!--            </el-form-item>-->
          <!--          </el-col>-->
        </el-row>
        <el-row>
          <el-col :span="10">
            <el-form-item label="个人微信二维码" prop="wxQrc">
              <el-row>
                <el-col v-if="image.wcQrc.url != ''">
                  <img
                    :src="image.wcQrc.url"
                    style="width: 148px;height: 148px ;border:1px solid"
                    @click="imagePreview(image.wcQrc.url)"
                  />
                  <img src="../../../assets/images/delete.png"
                       style="width: 20px;height: 20px;position: relative;top: -120px;left: -25px;"
                       @click="imageRemove(image.wcQrc.name)"
                  >
                </el-col>
                <el-col v-if="image.wcQrc.url == ''">
                  <div tabindex="0" class="el-upload el-upload--picture-card" style="width: 148px;height: 148px"
                       @click="uploadTypeOpen(image.wcQrc.name)"
                  >
                    <i class="el-icon-plus"></i>
                  </div>
                </el-col>
              </el-row>
            </el-form-item>
          </el-col>
          <el-col :span="14">
            <el-form-item label="企业微信二维码" prop="entWxQrc">
              <el-row>
                <el-col v-if="image.entWcQrc.url != ''">
                  <img
                    :src="image.entWcQrc.url"
                    style="width: 148px;height: 148px ;border:1px solid"
                    @click="imagePreview(image.entWcQrc.url)"
                  />
                  <img src="../../../assets/images/delete.png"
                       style="width: 20px;height: 20px;position: relative;top: -120px;left: -25px;"
                       @click="imageRemove(image.entWcQrc.name)"
                  >
                </el-col>
                <el-col v-if="image.entWcQrc.url == ''">
                  <div tabindex="0" class="el-upload el-upload--picture-card" style="width: 148px;height: 148px"
                       @click="uploadTypeOpen(image.entWcQrc.name)"
                  >
                    <i class="el-icon-plus"></i>
                  </div>
                </el-col>
              </el-row>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="20">
            <el-form-item label="备注">
              <el-input v-model="form.remark" type="textarea" placeholder="请输入内容" :autosize={minRows:4}></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 成员导入对话框 -->
    <el-dialog :title="upload.title" :visible.sync="upload.open" width="400px" append-to-body :close-on-click-modal="false" :close-on-press-escape="false">
      <el-upload
        ref="upload"
        :limit="1"
        accept=".xlsx, .xls"
        :headers="upload.headers"
        :action="upload.url + '?updateSupport=' + upload.updateSupport"
        :disabled="upload.isUploading"
        :on-progress="handleFileUploadProgress"
        :on-success="handleFileSuccess"
        :auto-upload="false"
        drag
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div class="el-upload__tip text-center" slot="tip">
          <div class="el-upload__tip" slot="tip">
            <el-checkbox v-model="upload.updateSupport"/>
            是否更新已经存在的成员数据
          </div>
          <span>仅允许导入xls、xlsx格式文件。</span>
          <el-link type="primary" :underline="false" style="font-size:12px;vertical-align: baseline;"
                   @click="importTemplate"
          >下载模板
          </el-link>
        </div>
      </el-upload>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitFileForm">确 定</el-button>
        <el-button @click="upload.open = false">取 消</el-button>
      </div>
    </el-dialog>

    <el-dialog title="用户组织" :visible.sync="userOrganization.open" width="500px" append-to-body :close-on-click-modal="false" :close-on-press-escape="false"
               @close="userOrganizationClose"
    >
      <el-table
        :data="userOrganization.list" style="width: 100%"
      >
        <el-table-column prop="organizationName" label="所属组织" align="center"></el-table-column>
        <el-table-column prop="roleName" label="组织角色" align="center"></el-table-column>
      </el-table>
    </el-dialog>

    <!--图片显示弹出层-->
    <el-dialog :visible.sync="image.visible" width="850px" height="37.5rem"  append-to-body :close-on-click-modal="false" :close-on-press-escape="false"
               :show-close="true" :center="true"  @close="imagePreviewClose"
    >
      <img  :src="image.url" class="el_dialog_img" alt="">
      <!-- width="100vh" -->
    </el-dialog>
  </div>
</template>

<script>
import {
  addUser,
  changeUserStatus,
  delUser,
  deptTreeSelect, getCurrentUser,
  getUser, listByAttribute,
  listUser,
  resetUserPwd,
  updateUser
} from '@/api/system/user'
import { getToken } from '@/utils/auth'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import { userOrganizationList, userUpload } from '../../../api/system/user'
import { isPwd } from '../../../utils/validate'
import { couponUpload } from '../../../api/system/product/coupon'

export default {
  name: 'User',
  dicts: ['sys_normal_disable', 'sys_user_sex', 'sys_account_attributes'],
  components: { Treeselect },
  data() {
    return {
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
      // 成员表格数据
      userList: null,
      // 弹出层标题
      title: '',
      // 层级树选项
      deptOptions: undefined,
      // 当前登录用户
      currentUser: undefined,
      // 是否显示弹出层
      open: false,
      // 层级名称
      deptName: undefined,
      // 默认密码
      initPassword: undefined,
      // 日期范围
      dateRange: [],
      // 岗位选项
      postOptions: [],
      // 角色选项
      // roleOptions: [],
      // 表单参数
      form: {},
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      // 成员导入参数
      upload: {
        // 是否显示弹出层（成员导入）
        open: false,
        // 弹出层标题（成员导入）
        title: '',
        // 是否禁用上传
        isUploading: false,
        // 是否更新已经存在的成员数据
        updateSupport: 0,
        // 设置上传的请求头部
        headers: { Authorization: 'Bearer ' + getToken() },
        // 上传的地址
        url: process.env.VUE_APP_BASE_API + '/system/user/importData'
      },
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        userName: undefined,
        nickName: undefined,
        deptName: undefined,
        phonenumber: undefined,
        status: undefined,
        deptId: undefined
      },
      // 列信息
      columns: [
        { key: 0, label: `成员编号`, visible: true },
        { key: 1, label: `账号名称`, visible: true },
        { key: 2, label: `成员名称`, visible: true },
        { key: 3, label: `归属层级`, visible: true },
        { key: 4, label: `手机号码`, visible: true },
        { key: 5, label: `状态`, visible: true },
        { key: 6, label: `创建时间`, visible: true },
      ],
      // 表单校验
      rules: {
        userName: [
          { required: true, message: '账号名称不能为空', trigger: 'blur' },
          { min: 2, max: 20, message: '账号名称长度必须介于 2 和 20 之间', trigger: 'blur' }
        ],
        nickName: [
          { required: true, message: '成员名称不能为空', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '账号密码不能为空', trigger: 'blur' },
          {
            validator: isPwd,
            trigger: 'blur'
          }
        ],
	      deptId:[
		      { required: true, message: '归属层级不能为空', trigger: 'blur' }
	      ],
        email: [
          {
            type: 'email',
            message: '请输入正确的邮箱地址',
            trigger: ['blur', 'change']
          }
        ],
        phonenumber: [
	        { required: true, message: '手机号不能为空', trigger: 'blur' },
          {
            pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
            message: '请输入正确的手机号码',
            trigger: 'blur'
          }
        ]
      },
      userOrganization: {
        queryParams: {
          userId: undefined
        },
        open: false,//用户组织弹出层开关
        list: []//用户组织数据
      },
      image: {
        wcQrc: {//微信二维码
          name: 'wcQrc',
          url: ''
        },
        entWcQrc: {//企业微信二维码
          name: 'entWcQrc',
          url: ''
        },
        url: '',
        visible: false
      }
    }
  },
  watch: {
    // 根据名称筛选层级树
    deptName(val) {
      this.$refs.tree.filter(val)
    }
  },
  created() {
    this.getList()
    this.getDeptTree()
    this.getCurrentUser()
  },
  activated() {
    this.getDeptTree()
  },
  methods: {
    /** 查询成员列表 */
    getList() {
      this.loading = true
      listByAttribute(this.addDateRange(this.queryParams, this.dateRange)).then(response => {
          this.userList = response.rows
          this.total = response.total
          this.loading = false
        }
      )
    },
    getCurrentUser() {
      getCurrentUser().then(response => {
          this.currentUser = response.msg
        }
      )
    },
    /** 查询层级下拉树结构 */
    getDeptTree() {
      deptTreeSelect().then(response => {
        this.deptOptions = response.data
      })
    },
    // 筛选节点
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    // 节点单击事件
    handleNodeClick(data) {
      this.queryParams.deptId = data.id
      this.handleQuery()
    },
    // 成员状态修改
    handleStatusChange(row) {
      let text = row.status === '0' ? '启用' : '停用'
      this.$modal.confirm('确认要"' + text + '""' + row.userName + '"成员吗？').then(function() {
        return changeUserStatus(row.userId, row.status)
      }).then(() => {
        this.$modal.msgSuccess(text + '成功')
      }).catch(function() {
        row.status = row.status === '0' ? '1' : '0'
      })
    },
    // 取消按钮
    cancel() {
      this.open = false
      this.reset()
    },
    // 表单重置
    reset() {
      this.form = {
        userId: undefined,
        deptId: undefined,
        userName: undefined,
        nickName: undefined,
        password: undefined,
        phonenumber: undefined,
        email: undefined,
        jobNumber: undefined,
        accountAttributes: '0',
        sex: undefined,
        status: '0',
        remark: undefined,
        postIds: [],
        // roleIds: []
        wcQrcId:undefined,
        entWcQrcId:undefined,
      }
      this.resetForm('form')

      this.image.wcQrc.url = ''
      this.image.entWcQrc.url = ''
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1
      this.getList()
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.dateRange = []
      this.resetForm('queryForm')
      this.queryParams.deptId = undefined
      // this.$refs.tree.setCurrentKey(null);
      this.handleQuery()
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.userId)
      this.single = selection.length != 1
      this.multiple = !selection.length
    },
    // 更多操作触发
    handleCommand(command, row) {
      switch (command) {
        case 'handleResetPwd':
          this.handleResetPwd(row)
          break
        case 'handleAuthRole':
          this.handleAuthRole(row)
          break
        default:
          break
      }
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset()
      getUser().then(response => {
        this.postOptions = response.posts
        this.roleOptions = response.roles
        this.open = true
        this.title = '添加成员'
        this.form.password = ''
        this.form.userName = ''
      })
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset()
      const userId = row.userId || this.ids
      getUser(userId).then(response => {
        this.form = response.data
        this.postOptions = response.posts
        // this.roleOptions = response.roles;
        this.$set(this.form, 'postIds', response.postIds)
        // this.$set(this.form, "roleIds", response.roleIds);
        if(response.data.wcQrc){
          this.image.wcQrc.url = response.data.wcQrc.fileVirtualPath
        }
        if(response.data.entWcQrc){
          this.image.entWcQrc.url = response.data.entWcQrc.fileVirtualPath
        }

        this.open = true
        this.title = '修改成员'
        this.form.password = ''
      })
    },
    /** 重置密码按钮操作 */
    handleResetPwd(row) {
      this.$prompt('请输入"' + row.userName + '"的新密码', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        closeOnClickModal: false,
        inputPattern: /^(?![a-zA-Z]+$)(?![A-Z0-9]+$)(?![A-Z\W_!@#$%^&*`~()-+=]+$)(?![a-z0-9]+$)(?![a-z\W_!@#$%^&*`~()-+=]+$)(?![0-9\W_!@#$%^&*`~()-+=]+$)[a-zA-Z0-9\W_!@#$%^&*`~()-+=]{8,16}$/,
        inputErrorMessage: '请输入8到16位至少要包含 大写字母，小写字母，数字，特殊字符四者中的三种组合密码'
      }).then(({ value }) => {
        resetUserPwd(row.userId, value).then(response => {
          this.$modal.msgSuccess('修改成功，新密码是：' + value)
        })
      }).catch(() => {
      })
    },
    /** 分配角色操作 */
    handleAuthRole: function(row) {
      const userId = row.userId
      this.$router.push('/system/user-auth/role/' + userId)
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.form.userName = this.form.userName.trim()
          if (this.form.userId != undefined) {
            updateUser(this.form).then(response => {
              this.$modal.msgSuccess('修改成功')
              this.open = false
              this.getList()
            })
          } else {
            addUser(this.form).then(response => {
              this.$modal.msgSuccess('新增成功')
              this.open = false
              this.getList()
            })
          }
        }
      })
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const userIds = row.userId || this.ids
      this.$modal.confirm('是否确认删除成员编号为"' + userIds + '"的数据项？').then(function() {
        return delUser(userIds)
      }).then(() => {
        this.getList()
        this.$modal.msgSuccess('删除成功')
      }).catch(() => {
      })
    },
    /**
     * 成员所在组织
     */
    handleUserOrganization(row) {
      this.userOrganization.queryParams.userId = row.userId
      userOrganizationList(this.userOrganization.queryParams).then(response => {
        this.userOrganization.list = response.data
      })
      this.userOrganization.open = true
    },
    userOrganizationClose() {
      this.userOrganization.list = []
      this.userOrganization.open = false
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('system/user/export', {
        ...this.queryParams
      }, `user_${new Date().getTime()}.xlsx`)
    },
    /** 导入按钮操作 */
    handleImport() {
      this.upload.title = '成员导入'
      this.upload.open = true
    },
    /** 下载模板操作 */
    importTemplate() {
      this.download('system/user/importTemplate', {}, `user_template_${new Date().getTime()}.xlsx`)
    },
    // 文件上传中处理
    handleFileUploadProgress(event, file, fileList) {
      this.upload.isUploading = true
    },
    // 文件上传成功处理
    handleFileSuccess(response, file, fileList) {
      this.upload.open = false
      this.upload.isUploading = false
      this.$refs.upload.clearFiles()
      this.$alert('<div style=\'overflow: auto;overflow-x: hidden;max-height: 70vh;padding: 10px 20px 0;\'>' + response.msg + '</div>', '导入结果', { dangerouslyUseHTMLString: true })
      this.getList()
    },
    // 提交上传文件
    submitFileForm() {
      this.$refs.upload.submit()
    },
    // 文件上传相关 start ======
    imagePreview(url) {
      this.image.url = url
      this.image.visible = true
    },
    imagePreviewClose() {
      this.image.visible = false
    },
    // 文件列表移除文件时的钩子
    imageRemove(name) {
      if (name == this.image.wcQrc.name) {
        this.image.wcQrc.url = ''
        this.form.wcQrcId = undefined

      } else if (name == this.image.entWcQrc.name) {
        this.image.entWcQrc.url = ''
        this.form.entWcQrcId = undefined
      }
    },
    uploadTypeOpen(name) {
      let _this = this
      const inputFile = document.createElement('input')
      inputFile.type = 'file'
      inputFile.style.display = 'none'
      document.body.appendChild(inputFile)
      inputFile.click()
      //图片
      const fileType = ['jpg', 'jpeg', 'png']
      inputFile.addEventListener('change', function() {
        const file = inputFile.files[0]
        console.log(file)
        if (file.size > 5242880) {
          _this.$message.warning('图库文件大小不能超过5MB')
          document.body.removeChild(inputFile)
          return false
        }
        const fileSuffix = file.name.substring(file.name.lastIndexOf('.') + 1)
        if (!fileType.includes(fileSuffix)) {
          _this.$message.warning('上传的文件格式只能是' + fileType)
          document.body.removeChild(inputFile)
          return false
        }
        _this.$modal.loading('正在上传图片，请稍候...')
        const formData = new FormData()
        formData.append('file', file)
        formData.append('source', name)
        userUpload(formData).then(response => {
          if (name == _this.image.wcQrc.name) {
            _this.image.wcQrc.url = response.data.fileVirtualPath
            _this.form.wcQrcId = response.data.fileId
            _this.$modal.closeLoading()
          } else if (name == _this.image.entWcQrc.name) {
            _this.image.entWcQrc.url = response.data.fileVirtualPath
            _this.form.entWcQrcId = response.data.fileId
            _this.$modal.closeLoading()
          }

        })
      })
    }
    // 文件上传相关 end =====
  }
}
</script>
