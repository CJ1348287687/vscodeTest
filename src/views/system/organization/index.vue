<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :span="6" :xs="24">
        <div class="head-container">
          <el-tree
            :data="deptOptions"
            :props="defaultProps"
            :expand-on-click-node="false"
            :filter-node-method="filterNode"
            ref="tree"
            node-key="id"
            highlight-current
            @node-click="handleNodeClick"
			      :default-expanded-keys="defaultExpandedArr"
          />
        </div>
      </el-col>
      <el-col :span="18" :xs="24">
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
        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button
              type="primary"
              plain
              icon="el-icon-plus"
              size="mini"
              @click="handleAdd"
              v-hasPermi="['system:organization:add']"
            >新增
            </el-button>
          </el-col>
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
          <el-col :span="1.5">
            <el-button
              type="danger"
              plain
              icon="el-icon-delete"
              size="mini"
              :disabled="multiple"
              @click="handleDeletes"
              v-hasPermi="['system:organization:remove']"
            >删除
            </el-button>
          </el-col>
          <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>

        <!--列表-->
        <el-table v-loading="loading" :data="organizationList" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55" align="center"/>
          <el-table-column label="组织编号" prop="organizationId" width="120" align="center"/>
          <el-table-column label="组织名称" prop="organizationName" width="250"
                           align="left" header-align="center"
          />
          <el-table-column label="层级祖级名称" prop="deptAncestorsName" width="500"
                           align="left" header-align="center" :formatter="deptAncestorsNameFormatter"
          />
          <el-table-column label="创建时间" align="center" prop="createTime" width="180">
            <template slot-scope="scope">
              <span>{{ parseTime(scope.row.createTime) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="180">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="text"
                icon="el-icon-edit"
                @click="handleDataScope(scope.row)"
                v-hasPermi="['*:*:*']"
              >甩单权限
              </el-button>
              <el-button
                size="mini"
                type="text"
                icon="el-icon-edit"
                @click="handleUpdate(scope.row)"
                v-hasPermi="['system:organization:edit']"
              >修改
              </el-button>
              <el-button
                size="mini"
                type="text"
                icon="el-icon-delete"
                @click="handleDelete(scope.row)"
                v-hasPermi="['system:organization:remove']"
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
      </el-col>
    </el-row>

    <!-- 添加或修改组织对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="1000px" append-to-body :close-on-click-modal="false" :show-close="false" :close-on-press-escape="false">
      <el-form ref="organizationForm" :model="organizationForm" :rules="organizationFormRules" label-width="120px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="归属层级" prop="deptId">
              <treeselect v-model="organizationForm.deptId" :options="deptOptions" :show-count="true"
                          placeholder="请选择归属层级"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="组织名称" prop="organizationName">
              <el-input v-model="organizationForm.organizationName" placeholder="请输入组织名称"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="组织简称" prop="organizationNameShort">
              <el-input v-model="organizationForm.organizationNameShort" placeholder="请输入组织简称" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="企业微信二维码" prop="entWcQrc">
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

        <el-card style="background: aliceblue" class="order">
          <el-row>
            <el-col :span="12">
              <el-form-item label="抖音账号" prop="dyAccount">
                <el-input v-model="organizationForm.dyAccount" placeholder="请输入抖音账号"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="抖音账号UID" prop="dyAccountUid">
                <el-input v-model="organizationForm.dyAccountUid" placeholder="请输入抖音账号UID"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="抖音账号名称" prop="dyAccountName">
                <el-input v-model="organizationForm.dyAccountName" placeholder="请输入抖音账号名称"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="联系方式" prop="mobile">
                <el-input v-model="organizationForm.mobile" placeholder="请输入联系方式" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="地图上显示" prop="isShowMap">
                <el-radio-group v-model="organizationForm.isShowMap" size="small">
                  <el-radio-button label="0">不显示</el-radio-button>
                  <el-radio-button label="1">显示</el-radio-button>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="营业时间" prop="businessHours">
                <el-time-picker
                  is-range
                  value-format="HH:mm"
                  v-model="organizationForm.businessHoursArray"
                  range-separator="-"
                  start-placeholder="开始时间"
                  end-placeholder="结束时间"
                  placeholder="请选择营业时间">
                </el-time-picker>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="15">
              <el-form-item label="组织坐标" prop="organizationXy">
                <div style="display: flex">
                  <el-input v-model="organizationForm.organizationXy" placeholder="请输入组织坐标" />
                  <el-button
                    type="primary"
                    round
                    icon="el-icon-location-outline"
                    size="mini"
                    @click="showMap"
                    style="margin-left: 15px;height: 32px;"
                  >定位
                  </el-button>
                </div>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="15">
              <el-form-item label="组织地址" prop="organizationAddress">
                <el-input v-model="organizationForm.organizationAddress" placeholder="请输入组织地址" />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="12">
              <el-form-item label="营业执照" prop="businessLicense">
                <el-row>
                  <el-col v-if="image.businessLicense.url != ''">
                    <img
                      :src="image.businessLicense.url"
                      style="width: 148px;height: 148px ;border:1px solid"
                      @click="imagePreview(image.businessLicense.url)"
                    />
                    <img src="../../../assets/images/delete.png"
                        style="width: 20px;height: 20px;position: relative;top: -120px;left: -25px;"
                        @click="imageRemove(image.businessLicense.name)"
                    >
                  </el-col>
                  <el-col v-if="image.businessLicense.url == ''">
                    <div tabindex="0" class="el-upload el-upload--picture-card" style="width: 148px;height: 148px"
                        @click="uploadTypeOpen(image.businessLicense.name)"
                    >
                      <i class="el-icon-plus"></i>
                    </div>
                  </el-col>
                </el-row>
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item label="授权书" prop="authorization">
                <el-row>
                  <el-col v-if="image.authorization.url != ''">
                    <img
                      :src="image.authorization.url"
                      style="width: 148px;height: 148px ;border:1px solid"
                      @click="imagePreview(image.authorization.url)"
                    />
                    <img src="../../../assets/images/delete.png"
                        style="width: 20px;height: 20px;position: relative;top: -120px;left: -25px;"
                        @click="imageRemove(image.authorization.name)"
                    >
                  </el-col>
                  <el-col v-if="image.authorization.url == ''">
                    <div tabindex="0" class="el-upload el-upload--picture-card" style="width: 148px;height: 148px"
                        @click="uploadTypeOpen(image.authorization.name)"
                    >
                      <i class="el-icon-plus"></i>
                    </div>
                  </el-col>
                </el-row>
              </el-form-item>
            </el-col>
          </el-row>
        </el-card>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="organizationSubmit">确 定</el-button>
        <el-button @click="organizationCancel">取 消</el-button>
      </div>
    </el-dialog>

    <el-dialog title="地图定位" :visible.sync="openMap" width="1000px" append-to-body :close-on-click-modal="false" :show-close="false" :close-on-press-escape="false">
      <map-container ref="mapContainer" style="height:750px;"></map-container>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="mapSubmit">确 定</el-button>
        <el-button @click="mapCancel">取 消</el-button>
      </div>
    </el-dialog>

    <!--图片显示弹出层-->
    <el-dialog :visible.sync="image.visible" width="850px" height="37.5rem" append-to-body :close-on-click-modal="false" :close-on-press-escape="false"
               :show-close="true" :center="true" @close="imagePreviewClose"
    >
      <img :src="image.url" class="el_dialog_img" alt="">
      <!-- width="100vh" -->
    </el-dialog>

    <!-- 分配甩单权限对话框 -->
    <el-dialog :title="title" :visible.sync="openDataScope" width="500px" append-to-body :close-on-click-modal="false" :show-close="false" :close-on-press-escape="false">
      <el-form :model="form" label-width="80px">
        <el-form-item label="权限范围">
          <el-select v-model="form.dataScope" @change="dataScopeSelectChange">
            <el-option
              v-for="item in dataScopeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="甩单权限" v-show="form.dataScope === '2'">
          <el-checkbox v-model="deptExpand" @change="handleCheckedTreeExpand($event, 'dept')">展开/折叠</el-checkbox>
          <el-checkbox v-model="deptNodeAll" @change="handleCheckedTreeNodeAll($event, 'dept')">全选/全不选</el-checkbox>
          <el-checkbox v-model="form.deptCheckStrictly" @change="handleCheckedTreeConnect($event, 'dept')">父子联动
          </el-checkbox>
          <el-tree
            class="tree-border"
            :data="deptOptions"
            show-checkbox
            default-expand-all
            ref="dept"
            node-key="id"
            :check-strictly="!form.deptCheckStrictly"
            empty-text="加载中，请稍候"
            :props="defaultProps"
          ></el-tree>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitDataScope">确 定</el-button>
        <el-button @click="cancelDataScope">取 消</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import {
  deptTreeDataSelect,
  deptTreeSelect,
  organizationAdd,
  organizationEdit,
  organizationInfo,
  organizationList,
  organizationRemove,
  organizationRemoves, shuffleOrders
} from '../../../api/system/organiaztion'
import { userUpload } from '../../../api/system/user'

import mapContainer from "@/components/AMap/index.vue";

export default {
  name: 'organization',
  dicts: [],
  components: { Treeselect, mapContainer },
  data() {
    return {
			defaultExpandedArr:[],//树状结构前三级id
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
      // 是否显示弹出层（甩单权限）
      openDataScope: false,
      deptExpand: true,
      deptNodeAll: false,
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
      //组织列表
      organizationList: [],
      // 总条数
      total: 0,
      // 选中数组
      ids: [],
      organizationForm: {},
      form: {
        deptIds: [],
        dataScope: null,
      },
      // 甩单范围选项
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
      organizationFormRules: {
        deptId: [
          { required: true, message: '请选择归属层级', trigger: 'blur' }
        ],
        organizationName: [
          { required: true, message: '请输入组织名称', trigger: 'blur' },
          { min: 2, max: 50, message: '组织名称长度在 2 到 50 个字符', trigger: 'blur' }
        ],
        dyAccount: [
          { min: 0, max: 50, message: '抖音账户最多50个字符', trigger: 'blur' }
        ],
        organizationAddress: [
          { min: 0, max: 100, message: '组织地址长度最大100个字符', trigger: 'blur' }
        ]
      },
      // ===================== 层级相关 start =====================
      // 层级名称
      deptName: '',
      // 层级列表
      deptOptions: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      // ===================== 层级相关 end =====================
      image: {
        entWcQrc: {//企业微信二维码
          name: 'orgEntWcQrc',
          url: ''
        },
        businessLicense: {//营业执照
          name: 'businessLicense',
          url: ''
        },
        authorization: {//授权书
          name: 'authorization',
          url: ''
        },
        url: '',
        visible: false
      },

      //======地图开始======
      openMap: false,
      //=====地图结束======
    }
  },
  created() {
    this.getList()
    this.getDeptTree()
  },
  activated() {
    this.getList()
    this.getDeptTree()
  },
  methods: {
    //======地图开始======
    showMap(){
      this.openMap = true
      //organizationForm.organizationAddress
      if (!this.$refs.mapContainer) {
        setTimeout(() => {
          this.$refs.mapContainer.getData(this.organizationForm.organizationXy, this.organizationForm.organizationAddress);
        }, 500);
      } else {
        this.$refs.mapContainer.getData(this.organizationForm.organizationXy, this.organizationForm.organizationAddress);
      }
    },
    mapSubmit(){
      let addressForm =  this.$refs.mapContainer.chooseAddress()
      if (addressForm == undefined || addressForm == null || addressForm.lng == '' || addressForm.lat == '' || addressForm.address == '') {
        this.$message.warning('请先选择一个地址')
      }else{
        this.organizationForm.organizationXy = addressForm.lng+","+addressForm.lat
        this.organizationForm.organizationAddress = addressForm.address
        this.openMap = false
      }
    },
    mapCancel(){
      this.openMap = false
    },
    //=====地图结束======
    
    getTopTwoLevelsAllIds() {
      let ids = [];
        this.deptOptions.forEach(node => {
        ids.push(node.id);
        if (node.children) {
          this.getTwoLevelsNodeIds(node.children, ids);
        }
        });
        this.defaultExpandedArr = ids
    },
    getTwoLevelsNodeIds(nodes, ids) {
      let level = 0;
      nodes.forEach(node => {
      level++;
      ids.push(node.id);
      if (node.children && level > 3) {
        this.getTwoLevelsNodeIds(node.children, ids);
      }
      });
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.organizationId)
      this.single = selection.length != 1
      this.multiple = !selection.length
    },
    // 表单重置
    reset() {
      this.organizationForm = {
        businessHoursArray: ['08:00', '18:00'],
        organizationId: undefined,
        organizationIds: [],
        organizationName: '',
        organizationNameShort: null,
        organizationXy: null,
        organizationAddress: null,
        businessHours: null,
        mobile: null,
        isShowMap: '0',
        businessLicenseId: null,
        authorizationId: null,
        dyAccount: '',
        dyAccountUid: '',
        dyAccountName: '',
      }
      this.deptExpand = true,
      this.deptNodeAll = false,
      this.form.deptIds = []
      this.form.deptCheckStrictly = true
      this.resetForm('form')

      this.image.entWcQrc.url = ''
      this.image.businessLicense.url = ''
      this.image.authorization.url = ''
    },
    // 新增按钮
    handleAdd() {
      this.reset()
      this.open = true
      this.title = '添加组织'
      this.disable = false
    },
    // 修改按钮
    handleUpdate(row) {
      this.reset()
      this.organizationForm.organizationId = row.organizationId
      let params = {
        organizationId: this.organizationForm.organizationId
      }
      organizationInfo(params).then(response => {
        if(response.data.businessHours){
          response.data.businessHoursArray = response.data.businessHours.split("-")
        }else{
          response.data.businessHoursArray = ['08:00','18:00']
        }
        this.organizationForm = response.data;
        console.log(this.organizationForm.businessHours,this.organizationForm.businessHoursArray);
        if(response.data.entWcQrc){
          this.image.entWcQrc.url = response.data.entWcQrc.fileVirtualPath
        }
        if(response.data.businessLicense){
          this.image.businessLicense.url = response.data.businessLicense.fileVirtualPath
        }
        if(response.data.authorization){
          this.image.authorization.url = response.data.authorization.fileVirtualPath
        }
        this.open = true
        this.title = '修改组织'
        this.disable = false
      })
    },
    // 组织表单提交
    organizationSubmit() {
      this.$refs['organizationForm'].validate(valid => {
        if(this.organizationForm.businessHoursArray!=null && this.organizationForm.businessHoursArray.length==2){
          this.organizationForm.businessHours = this.organizationForm.businessHoursArray.join("-")
        }
        if(this.organizationForm.isShowMap!=null && this.organizationForm.isShowMap!=undefined && this.organizationForm.isShowMap=='1'){
          if (this.organizationForm.organizationXy == null || this.organizationForm.organizationXy == "") {
            this.$modal.msgError("组织坐标不能为空");
            return;
          }else if(!this.organizationForm.organizationXy.includes(',')){
            this.$modal.msgError("组织坐标经纬度请用,分隔");
            return;
          }else if(this.organizationForm.organizationXy.split(',').length!=2){
            this.$modal.msgError("组织坐标经纬度格式错误");
            return;
          }
          if (this.organizationForm.organizationAddress == null || this.organizationForm.organizationAddress == "") {
            this.$modal.msgError("组织地址不能为空");
            return;
          }
        }
        if (this.organizationForm.organizationNameShort == null || this.organizationForm.organizationNameShort == undefined || this.organizationForm.organizationNameShort == "") {
          this.organizationForm.organizationNameShort = this.organizationForm.organizationName
        }
        if (valid) {
          if (this.organizationForm.organizationId) {
            organizationEdit(this.organizationForm).then(response => {
              this.$modal.msgSuccess('修改成功')
              this.open = false
              this.getList()
            })
          } else {
            organizationAdd(this.organizationForm).then(response => {
              this.$modal.msgSuccess('新增成功')
              this.open = false
              this.getList()
            })
          }
        }
      })
    },
    // 组织弹出层取消
    organizationCancel() {
      this.reset()
      this.open = false
    },
    // 组织删除按钮
    handleDelete(row) {
      this.reset()
      let params = {
        organizationId: row.organizationId
      }
      this.$modal.confirm('是否确认删除组织编号为"' + row.organizationId + '"的数据项？').then(function() {
        return organizationRemove(params)
      }).then(() => {
        this.getList()
        this.$modal.msgSuccess('删除成功')
      }).catch((e) => {
        console.log(e)
      })
    },
    // 组织批量删除按钮
    handleDeletes() {
      this.reset()
      let params = {
        organizationIds: this.ids
      }
      this.$modal.confirm('是否确认删除组织编号为"' + this.ids + '"的数据项？').then(function() {
        return organizationRemoves(params)
      }).then(() => {
        this.getList()
        this.$modal.msgSuccess('删除成功')
      }).catch(() => {
        console.log(e)
      })
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
      this.$refs.tree.setCurrentKey(null)//取消el-tree节点选中
      this.handleQuery()
      this.getDeptTree()
    },
    // 组织列表
    getList() {
      this.loading = true
      organizationList(this.addDateRange(this.queryParams, this.dateRange)).then(response => {
        this.organizationList = response.rows
        this.total = response.total
        this.loading = false
      })
    },
    deptAncestorsNameFormatter(row, column, cellValue, index) {
      let str = ''
      if (row.deptAncestorsName != '' && row.deptAncestorsName != undefined) {
        str += row.deptAncestorsName.replaceAll(',', '/')
      }
      if (row.dept.deptName != '' && row.dept.deptName != undefined) {
        if (row.deptAncestorsName != '' && row.deptAncestorsName != undefined) {
          str += '/' + row.dept.deptName
        } else {
          str += row.dept.deptName
        }
      }
      return str
    },
    // ===================== 层级相关 start =====================
    getDeptTree() {
      deptTreeSelect().then(response => {
        this.deptOptions = response.data
		this.getTopTwoLevelsAllIds()
				console.log(this.deptOptions,'this.deptOptions----');
      })
    },
    // 筛选节点
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    // 节点单击事件
    handleNodeClick(data) {
      console.log('节点单击事件')
      this.queryParams.deptId = data.id
      this.handleQuery()
    },
    // ===================== 层级相关 end =====================
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
      if (name == this.image.entWcQrc.name) {
        this.image.entWcQrc.url = ''
        this.organizationForm.entWcQrcId = undefined
      }
      if (name == this.image.businessLicense.name) {
        this.image.businessLicense.url = ''
        this.organizationForm.businessLicenseId = undefined
      }
      if (name == this.image.authorization.name) {
        this.image.authorization.url = ''
        this.organizationForm.authorizationId = undefined
      } 
    },
    /** 选择角色权限范围触发 */
    dataScopeSelectChange(value) {
      if (value !== '2') {
        this.$refs.dept.setCheckedKeys([])
      }
    },
    /** 分配甩单权限操作 */
    handleDataScope(row) {
      this.reset()
      let params = {
        organizationId: row.organizationId
      }
      const deptTreeSelect = this.getDeptTreeData(row.organizationId)
      organizationInfo(params).then(response => {
        this.form = response.data
        this.openDataScope = true
        this.$nextTick(() => {
          deptTreeSelect.then(res => {
            this.$refs.dept.setCheckedKeys(res.checkedKeys)
          })
        })
        this.title = '分配甩单权限'
      })
    },
    getDeptTreeData(deptId) {
      return deptTreeDataSelect(deptId).then(response => {
        return response
      })
    },
    /** 提交按钮（甩单权限） */
    submitDataScope: function() {
      if (this.organizationForm.organizationId !== undefined) {
        this.organizationForm.deptIds = this.getDeptAllCheckedKeys()
        shuffleOrders(this.form).then(response => {
          this.$modal.msgSuccess('配置成功')
          this.openDataScope = false
          this.getList()
        })
      }
    },
    // 所有层级节点数据
    getDeptAllCheckedKeys() {
      // 目前被选中的层级节点
      let checkedKeys = this.$refs.dept.getCheckedKeys()
      // 半选中的层级节点
      let halfCheckedKeys = this.$refs.dept.getHalfCheckedKeys()
      checkedKeys.unshift.apply(checkedKeys, halfCheckedKeys)
      return checkedKeys
    },
    // 取消按钮（甩单权限）
    cancelDataScope() {
      this.openDataScope = false
      this.reset()
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
    // 树权限（全选/全不选）
    handleCheckedTreeNodeAll(value, type) {
      if (type == 'menu') {
        this.$refs.menu.setCheckedNodes(value ? this.menuOptions : [])
      } else if (type == 'dept') {
        this.$refs.dept.setCheckedNodes(value ? this.deptOptions : [])
      }
    },
    // 树权限（父子联动）
    handleCheckedTreeConnect(value, type) {
      if (type == 'menu') {
        this.form.menuCheckStrictly = value ? true : false
      } else if (type == 'dept') {
        this.form.deptCheckStrictly = value ? true : false
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
          if (name == _this.image.entWcQrc.name) {
            _this.image.entWcQrc.url = response.data.fileVirtualPath
            _this.organizationForm.entWcQrcId = response.data.fileId
            _this.$modal.closeLoading()
          }
          if (name == _this.image.businessLicense.name) {
            _this.image.businessLicense.url = response.data.fileVirtualPath
            _this.organizationForm.businessLicenseId = response.data.fileId
            _this.$modal.closeLoading()
          }
          if (name == _this.image.authorization.name) {
            _this.image.authorization.url = response.data.fileVirtualPath
            _this.organizationForm.authorizationId = response.data.fileId
            _this.$modal.closeLoading()
          }
        })
      })
    }
    // 文件上传相关 end =====
  }

}
</script>

<style scoped>

</style>
