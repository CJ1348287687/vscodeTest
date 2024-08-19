<!-- 策略配置 -->
<template>
  <div class="app-tacticsDialog">
    <el-dialog
      title="策略配置"
      :visible.sync="visible"
      custom-class="tactics_dialog"
      width="1600px"
      append-to-body
      :close-on-click-modal="false"
      :show-close="false"
      :close-on-press-escape="false"
    >
      <div v-loading="loading">
        <el-button
          style="margin-bottom: 10px;"
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="addItem(form.items.length - 1)"
        >新增</el-button>
				<!-- <span>
					<label for="fileInput" class="custom-file-upload">
					 上传文件
					</label>
          <input type="file" @change="importf(this)"  id="fileInput"
            accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" style="display: none;" />
        </span> -->
        <el-form :model="form" ref="form" label-width="120px" label-position="top">
          <el-table
            :data="form.items"
            style="width: 100%; margin-bottom: 16px"
            :border="false"
          >
            <el-table-column label="商品名称" align="center" width="210">
              <template #default="scope">
                <el-tooltip
                  effect="dark"
                  :content="isBatch ? '所有勾选商品' : tacticsRow.name"
                  placement="top"
                  popper-class="tooltip"
                >
                  <div
                    style="
                      display: -webkit-box;
                      -webkit-box-orient: vertical;
                      -webkit-line-clamp: 2;
                      overflow: hidden;
                      text-overflow: ellipsis;
                      cursor: pointer;
                    "
                  >
                    {{ isBatch ? '所有勾选商品' : tacticsRow.name}}
                  </div>
                </el-tooltip>
              </template>
            </el-table-column>
            <el-table-column label="发展组织" align="center">
              <template slot-scope="scope">
                <el-form-item
                  :prop="'items.' + scope.$index + '.sendOrganizationId'"
                  :rules="[
                    { required: true, message: '请选择发展组织', trigger: 'change' },
                  ]"
                >
                  <el-select
                    v-model="scope.row.sendOrganizationId"
                    clearable
                    filterable
                    placeholder="请选择发展组织"
                    @change="
                      (id) => getsendOrganizationChange(id, scope.$index, true)
                    "
                  >
                    <el-option
                      v-for="dict in organizationEnum"
                      :key="dict.organizationId"
                      :label="dict.organizationName"
                      :value="dict.organizationId"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column label="发展人" align="center" width="130px">
              <template slot-scope="scope">
                <el-form-item
                  :prop="'items.' + scope.$index + '.sendUserId'"
                  :rules="[
                    { required: true, message: '请选择发展人', trigger: 'change' },
                  ]"
                >
                  <el-select
                    v-model="scope.row.sendUserId"
                    clearable
                    filterable
                    placeholder="请选择发展人"
                  >
				  <!-- scope.row.sendAcceptorEnum -->
                    <el-option
                      v-for="dict in scope.row.sendAcceptorEnum"
                      :key="dict.userId"
                      :label="dict.nickName"
                      :value="dict.userId"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column label="authorId" prop="authorId" width="200">
              <template v-slot:header>
                <div style="display: flex; align-items: center;justify-content: center;">
                  <span>达人UID&nbsp;&nbsp;&nbsp;</span>
                  <el-tooltip class="item" effect="dark">
                    <img slot="content" src="../../../assets/images/daren.png" alt="图片描述" style="width: 1000px;">
                    <img src="../../../assets/images/tishi.png" alt="图片描述" style="width: 16px; height: 16px;margin-left: 5px;">
                  </el-tooltip>
                </div>
              </template>
              <template v-slot="scope">
                <el-form-item
                  :prop="'items.' + scope.$index + '.authorId'"
                  :rules="[
                    { required: true, message: '请输入达人UID', trigger: 'change' },
                  ]"
                >
                  <el-input
                    v-model="scope.row.authorId"
                    placeholder="请输入达人UID"
                  ></el-input>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column label="达人名称" align="center" width="220">
              <template slot-scope="scope">
                <el-form-item
                  :prop="'items.' + scope.$index + '.authorName'"
                  :rules="[
                    { required: true, message: '请输入达人名称', trigger: 'change' },
                  ]"
                >
                  <el-input
                    v-model="scope.row.authorName"
                    placeholder="请输入达人名称"
                  ></el-input>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column label="受理组织" align="center">
              <template slot-scope="scope">
                <el-form-item
                  :prop="'items.' + scope.$index + '.acceptOrganizationId'"
                  :rules="[
                    { required: true, message: '请选择受理组织', trigger: 'change' },
                  ]"
                >
                  <el-select
                    v-model="scope.row.acceptOrganizationId"
                    clearable
                    filterable
                    placeholder="请选择受理组织"
                    @change="
                      (id) => getOrganizationChange(id, scope.$index, true)
                    "
                  >
                    <el-option
                      v-for="dict in organizationEnum"
                      :key="dict.organizationId"
                      :label="dict.organizationName"
                      :value="dict.organizationId"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column label="受理人" align="center" width="130">
              <template slot-scope="scope">
                <el-form-item
                  :prop="'items.' + scope.$index + '.acceptUserId'"
                  :rules="[
                    { required: true, message: '请选择受理人', trigger: 'change' },
                  ]"
                >
                  <el-select
                    v-model="scope.row.acceptUserId"
                    clearable
                    filterable
                    placeholder="请选择受理人"
                  >
				  <!-- scope.row.acceptorEnum -->
                    <el-option
                      v-for="dict in scope.row.acceptorEnum"
                      :key="dict.userId"
                      :label="dict.nickName"
                      :value="dict.userId"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center" width="110">
              <template slot-scope="scope">
                <div style="margin-bottom: 22px">
                  <el-button
                    style="color: red"
                    size="mini"
                    type="text"
                    icon="el-icon-delete"
                    @click="removeItem(scope.$index)"
                    >移除
                  </el-button>
                  <el-button
                    size="mini"
                    type="text"
                    icon="el-icon-plus"
                    @click="addItem(scope.$index)"
                    >新增
                  </el-button>
                </div>
              </template>
            </el-table-column>
          </el-table>

          <el-card style="background: aliceblue">
            <div>默认配置（默认受理人，当达人UID不在白名单中，订单甩单到默认受理）</div>
            <div style="display: flex; margin-top: 10px;margin-left: 10px;">
              <el-form-item
                label="发展组织"
                prop="fromOrganizationId"
                :rules="[
                  { required: true, message: '请选择发展组织', trigger: 'change' },
                ]"
              >
                <el-select
                  v-model="form.fromOrganizationId"
                  clearable
                  filterable
                  placeholder="请选择发展组织"
                  @change="(id) => getFromOrganizationIdEnum(id, true)"
                >
                  <el-option
                    v-for="dict in organizationEnum"
                    :key="dict.organizationId"
                    :label="dict.organizationName"
                    :value="dict.organizationId"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item
                label="发展人"
                prop="fromUserId"
                :rules="[
                  { required: true, message: '请选择发展人', trigger: 'change' },
                ]"
                style="margin-left: 16px"
              >
                <el-select
                  v-model="form.fromUserId"
                  clearable
                  filterable
                  placeholder="请选择发展人"
                >
                  <el-option
                    v-for="dict in defaultFromHandleEnum"
                    :key="dict.userId"
                    :label="dict.nickName"
                    :value="dict.userId"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item
                label="受理组织"
                prop="toOrganizationId"
                :rules="[
                  { required: true, message: '请选择受理组织', trigger: 'change' },
                ]"
                style="margin-left: 16px"
              >
                <el-select
                  v-model="form.toOrganizationId"
                  clearable
                  filterable
                  placeholder="请选择受理组织"
                  @change="(id) => getToOrganizationIdEnum(id, true)"
                >
                  <el-option
                    v-for="dict in organizationEnum"
                    :key="dict.organizationId"
                    :label="dict.organizationName"
                    :value="dict.organizationId"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item
                label="受理人"
                prop="toUserId"
                :rules="[
                  { required: true, message: '请选择受理人', trigger: 'change' },
                ]"
                style="margin-left: 16px"
              >
                <el-select
                  v-model="form.toUserId"
                  clearable
                  filterable
                  placeholder="请选择受理人"
                >
                  <el-option
                    v-for="dict in defaultHandleEnum"
                    :key="dict.userId"
                    :label="dict.nickName"
                    :value="dict.userId"
                  ></el-option>
                </el-select>
              </el-form-item>
            </div>
            <!-- <div>售后订单默认配置</div> -->
            <div style="display: flex; margin-top: 10px;margin-left: 10px;">
              <el-form-item
                label="售后订单受理组织"
                prop="returnToOrganizationId"
                :rules="[
                  { required: true, message: '请选择售后订单受理组织', trigger: 'change' },
                ]"
              >
                <el-select
                  v-model="form.returnToOrganizationId"
                  clearable
                  filterable
                  placeholder="请选择售后订单受理组织"
                  @change="(id) => getReturnToOrganizationIdEnum(id, true)"
                >
                  <el-option
                    v-for="dict in organizationEnum"
                    :key="dict.organizationId"
                    :label="dict.organizationName"
                    :value="dict.organizationId"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item
                label="售后订单受理人"
                prop="returnToUserId"
                :rules="[
                  { required: true, message: '请选择售后订单受理人', trigger: 'change' },
                ]"
                style="margin-left: 16px"
              >
                <el-select
                  v-model="form.returnToUserId"
                  clearable
                  filterable
                  placeholder="请选择售后订单受理人"
                >
                  <el-option
                    v-for="dict in defaultReturnHandleEnum"
                    :key="dict.userId"
                    :label="dict.nickName"
                    :value="dict.userId"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="售后订单仅退款申请" prop="returnAutoRefund" style="margin-left: 16px">
                <el-radio-group v-model="form.returnAutoRefund" size="small">
                  <el-radio-button label="0">手动</el-radio-button>
                  <el-radio-button label="1">自动</el-radio-button>
                </el-radio-group>
              </el-form-item>
            </div>
          </el-card>
          <el-card style="padding-left: 0px; margin-top: 12px; background: aliceblue">
            <div style="display: flex; margin-top: 10px;margin-left: 10px;">
              <el-form-item
                label="用户短信模板"
                prop="smsTemplateId"
              >
                <el-select
                  v-model="form.smsTemplateId"
                  clearable
                  filterable
                  placeholder="请选择用户短信模板"
                  @change="(id) => getFromTemplateEnum(id)"
                >
                  <el-option
                    v-for="dict in smsTemplateEnum"
                    :key="dict.id"
                    :label="dict.templateName"
                    :value="dict.id"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item
                label="受理人订单短信模板"
                prop="smsTemplateAcceptedId"
                style="margin-left: 16px"
              >
                <el-select
                  v-model="form.smsTemplateAcceptedId"
                  clearable
                  filterable
                  placeholder="请选择受理人订单短信模板"
                  @change="(id) => getFromTemplateAcceptedEnum(id)"
                >
                  <el-option
                    v-for="dict in smsTemplateAcceptedByEnum"
                    :key="dict.id"
                    :label="dict.templateName"
                    :value="dict.id"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item
                label="售后订单短信模板"
                prop="smsTemplateAcceptedIdReturn"
                style="margin-left: 16px"
              >
                <el-select
                  v-model="form.smsTemplateAcceptedIdReturn"
                  clearable
                  filterable
                  placeholder="请选择售后订单短信模板"
                  @change="(id) => getFromTemplateAcceptedReturnEnum(id)"
                >
                  <el-option
                    v-for="dict in smsTemplateAcceptedByReturnEnum"
                    :key="dict.id"
                    :label="dict.templateName"
                    :value="dict.id"
                  ></el-option>
                </el-select>
              </el-form-item>
            </div>
            <div style="color: red" v-show="showContent">
              <label style="text-align: left;font-size: 15px;">用户短信示例：</label>
            </div>
            <div style="color: red" v-show="showContent">
              <label style="text-align: left;font-size: 15px;margin-left: 30px;">{{smsTemplateContent}}</label>
            </div>
            <div style="color: red" v-show="showAcceptedContent">
              <label style="text-align: left;font-size: 15px;">受理人订单短信示例：</label>
            </div>
            <div style="color: red" v-show="showAcceptedContent">
              <label style="text-align: left;font-size: 15px;margin-left: 30px;">{{smsTemplateAcceptedContent}}</label>
            </div>
            <div style="color: red" v-show="showAcceptedReturnContent">
              <label style="text-align: left;font-size: 15px;">售后订单短信示例：</label>
            </div>
            <div style="color: red" v-show="showAcceptedReturnContent">
              <label style="text-align: left;font-size: 15px;margin-left: 30px;">{{smsTemplateAcceptedReturnContent}}</label>
            </div>
          </el-card>
          <el-card style="padding-left: 0px; margin-top: 12px; background: antiquewhite">
            <div>模板配置</div>
            <div style="display: flex; margin-top: 10px;margin-left: 10px;">
              <el-form-item
                label="产品模板"
                prop="productTemplate"
                :rules="[
                  { required: true, message: '请选择产品模板', trigger: 'change' },
                ]"
              >
                <el-select
                  v-model="form.productTemplate"
                  clearable
                  filterable
                  placeholder="请选择产品模板"
                >
                  <el-option
                    v-for="dict in templateEnum"
                    :key="dict.id"
                    :label="dict.templateName"
                    :value="dict.id"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item
                v-if="tacticsRow.productType === 3 && tacticsRow.pickupMethod === '2'"
                label="券码模板"
                prop="couponTemplate"
                style="margin-left: 16px"
              >
                <el-select
                  v-model="form.couponTemplate"
                  clearable
                  filterable
                  placeholder="请选择券码模板"
                >
                  <el-option
                    v-for="items in dict.type.coupon_code_template"
                    :key="Number(items.value)"
                    :label="items.label"
                    :value="Number(items.value)"
                  ></el-option>
                </el-select>
              </el-form-item>
            </div>
          </el-card>
          <el-card style="padding-left: 0px; margin-top: 12px; background: antiquewhite" v-if="tacticsRow.productType === 3 && tacticsRow.pickupMethod === '2'">
            <div style="margin-top: 10px;margin-left: 10px;">
              <el-form-item label="核销配置">
                <el-form-item
                  prop="checkOutType"
                  style="margin-bottom: 16px"
                >
                  <el-select
                    v-model="form.checkOutType"
                    clearable
                    filterable
                    placeholder="请选择核销策略配置"
                    multiple
                    style="width: 455px;"
                    @change="checkOutTypeChange"
                  >
                    <el-option
                      v-for="dict in checkOutTypeEnum"
                      :key="dict.id"
                      :label="dict.name"
                      :value="dict.id"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <div style="display: flex; align-items: flex-start;" v-if="form.checkOutType.includes('3')">
                  <el-input type="textarea" disabled :rows="4" placeholder="请选择核销人员" v-model="form.checksName" style="width: 500px;"></el-input>
                  <el-button
                    style="margin-bottom: 10px; margin-left: 10px;"
                    type="primary"
                    plain
                    icon="el-icon-plus"
                    size="mini"
                    @click="addItemCheck(form.checks.length - 1)"
                  >核销人员</el-button>
                </div>
              </el-form-item>
            </div>
          </el-card>
          <el-card style="padding-left: 0px; margin-top: 12px; background: #ffffff">
            <div style="padding:0 10px;">
              <el-button @click="organizationAddDialogOpen" style="font-size: 14px;margin-bottom: 10px;">商品查看权限</el-button>
              <el-table v-loading="loading" :data="organizationList" >
                <el-table-column label="组织编号" prop="organizationId" align="center"/>
                <el-table-column label="组织名称" prop="organizationName"/>
                <el-table-column label="所属部门" prop="deptName" align="center"/>
                <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
                  <template slot-scope="scope">
                    <el-button size="mini" type="text" icon="el-icon-delete"
                               @click="handleDeleteOrganization(scope.row)">删除
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
              <pagination
                v-show="totalOrganization>0"
                :total="totalOrganization"
                :page.sync="queryParamsOrganization.pageNum"
                :limit.sync="queryParamsOrganization.pageSize"
                @pagination="getOrganizationList"
              />
            </div>
          </el-card>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">保 存</el-button>
        <el-button @click="cancelButton">取 消</el-button>
      </div>
    </el-dialog>
    <el-dialog title="待选可查看组织列表" :visible.sync="organizationUnallocated.open" class="dsgxDialog" width="55%"
               :close-on-click-modal="false" :close-on-press-escape="false" @close="organizationAddDialogClose" >
      <el-form :model="organizationUnallocated.queryParams" ref="organizationUnallocatedQueryForm"
               size="small" :inline="true" style="display: flex;">
        <el-form-item label="组织编号" prop="organizationId">
          <el-input-number v-model="organizationUnallocated.queryParams.organizationId" :min="1"
                           clearable :controls="false" placeholder="请输入组织编号"></el-input-number>
        </el-form-item>
        <el-form-item label="组织名称" prop="organizationName">
          <el-input v-model="organizationUnallocated.queryParams.organizationName"
                    placeholder="请输入组织名称" clearable />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="mini"
                     @click="getOrganizationUnallocatedList">搜索</el-button>
        </el-form-item>
      </el-form>
      <el-table height="440" ref="organizationUnallocatedTable" v-loading="loading" :data="organizationUnallocated.list"
                :row-key="getRowKeys" @selection-change="handleSelectionChangeEdit" max-height="400">
        <el-table-column type="selection" :reserve-selection="true" width="55"></el-table-column>
        <el-table-column label="组织编号" prop="organizationId" width="100" align="center" />
        <el-table-column label="组织名称" prop="organizationName" width="250"
                         align="center" />
        <el-table-column label="所属部门" prop="deptName" width="250"
                         align="center" />
      </el-table>
      <span slot="footer" class="dialog-footer">
				<el-button @click="organizationAddDialogClose">取 消</el-button>
				<el-button type="primary" @click="submitViewOrganization">添加</el-button>
			</span>
    </el-dialog>
    <el-dialog
      title="核销人员"
      :visible.sync="openForward"
      width="500px"
      append-to-body
      :close-on-click-modal="false"
    >
      <div style="min-height: 500px;display: flex; flex-direction: column; justify-content: space-between;">
        <div>
          <el-input
            placeholder="输入关键字进行过滤"
            v-model="filterText">
          </el-input>
          <el-tree
            :data="organizationTreeData"
            show-checkbox
            :default-checked-keys="form.checksTree"
            :default-expanded-keys="[-1]"
            node-key="ids"
            ref="tree"
            highlight-current
            :filter-node-method="filterNode"
            @check-change="handleCheckChange"
            style="height: 420px; overflow-y: scroll; margin: 15px 0;"
            >
          </el-tree>
        </div>
        <div slot="footer" style="text-align: right;">
          <el-button type="primary" @click="openForward = false">确定</el-button>
        </div>

      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  organizationUser,
  manageUserOrganization,
} from "../../../api/system/production/tweet";
import {
  tacticList,
  addTactic,
  addTacticBatch,
  getViewOrganizationList,
  deleteViewOrganization,
  addViewOrganization
} from "@/api/system/douyinProduct/product";
import {getProductMbList, unallocatedOrganizationList} from "@/api/tool/tweetArticle";
import {
  getTemplateAcceptedContent,
  getTemplateContent,
  listTemplate,
} from '@/api/system/smsTemplate/smsTemplate';
export default {
  name: "TacticsDialog",
  components: {},
  dicts: ['coupon_code_template','sys_event_each_other'],
  props: {
    visible: false,
    setVisible:() => {},
    tacticsRow: "",
    resetFn:()=>{},
    ids: Array, //批量勾选ids
    isBatch: false, //是否批量
    organizationTreeData: Array, //树数据
  },
  data() {
    return {
      loading: false,
      showContent: false,
      showAcceptedContent: false,
      showAcceptedReturnContent:false,
      form: {
        items: [],
        fromOrganizationId: "",
        fromUserId: "",
        toOrganizationId: "",
        toUserId: "",
        returnToOrganizationId: "",
        returnToUserId: "",
        returnAutoRefund: "",
        productTemplate: "",
        smsTemplateId: "",
        smsTemplateAcceptedId: "",
        smsTemplateAcceptedIdReturn:"",
        couponTemplate: "",
        productType: "",
        pickupMethod: "",
        checks: [], //树传参
        checksTree: [], //树选中
        checksName: '',
        checkOutType: [],
      },
      organizationEnum: [], //受理组织/发展组织/售后订单受理组织
      defaultHandleEnum: [], //默认受理人员
      defaultFromHandleEnum: [], //默认发展人员
      defaultReturnHandleEnum: [], //售后订单默认受理人员
      templateEnum: [], //模版
      smsTemplateEnum: [], //短信模版
      smsTemplateAcceptedByEnum: [], //受理人订单短信模版
      smsTemplateAcceptedByReturnEnum: [], //受理人售后订单短信模版

      smsTemplateContent: "", //用户短信模版
      smsTemplateAcceptedContent: "", //受理人订单短信模版
      smsTemplateAcceptedReturnContent: "", //受理人售后订单短信模版
      openForward: false,
      filterText: '',
      checkOutTypeEnum:[
        {
          id: '1',
          name: '发展组织',
        },
        {
          id: '2',
          name: '受理组织',
        },
        {
          id: '3',
          name: '指定组织成员',
        },
      ],
      totalOrganization: 0,
      organizationList: [],
      queryParamsOrganization: {
        pageNum: 1,
        pageSize: 10,
        productId: null,
        organizationName: '',
      },
      organizationUnallocated: {
        ids: [], //勾选的id
        open: false,
        total: 0,
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          tweetId: undefined,
          organizationId: undefined,
          organizationName: '',
          allocatedOrganizationIds: []
        },
        list: []
      },
    };
  },
  created() {
    console.log("tacticsRow", this.tacticsRow);
    this.getManageUserOrganization();
    this.getGetProductMbList();
    this.getSmsTemplate();
    this.getFromTemplateEnum(this.tacticsRow.smsTemplateId);
    this.getOrganizationList();
    this.getSmsTemplateAcceptedBy();
    this.getFromTemplateAcceptedEnum(this.tacticsRow.smsTemplateAcceptedId);
    this.getSmsTemplateAcceptedByReturn();
    this.getFromTemplateAcceptedReturnEnum(this.tacticsRow.smsTemplateAcceptedIdReturn);
    //初始化配置
    this.getTacticList();
  },
  watch: {
    filterText(val) {
      return this.$refs.tree.filter(val)
    }
  },
  methods: {
		importf(obj) {
						let _this = this;
						let inputDOM = this.$refs.inputer; // 通过DOM取文件数据
						this.file = event.currentTarget.files[0];
						var rABS = false; //是否将文件读取为二进制字符串
						var f = this.file;
						var reader = new FileReader();
						//if (!FileReader.prototype.readAsBinaryString) {
						FileReader.prototype.readAsBinaryString = function(f) {
							let binary = "";
							let rABS = false; //是否将文件读取为二进制字符串
							let pt = this;
							let wb; //读取完成的数据
							let outdata;
							let reader = new FileReader();
							reader.onload = function(e) {

								let bytes = new Uint8Array(reader.result);

								let length = bytes.byteLength;

								for (let i = 0; i < length; i++) {

									binary += String.fromCharCode(bytes[i]);

								}

								let XLSX = require('xlsx');

								if (rABS) {

									wb = XLSX.read(btoa(fixdata(binary)), { //手动转化

										type: 'base64'

									});

								} else {

									wb = XLSX.read(binary, {

										type: 'binary'

									});

								}

								// outdata就是你想要的东西 excel导入的数据

								outdata = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);

								// excel 数据再处理

								let arr = []

								outdata.map(v => {

									let obj = {}

									obj.sendOrganizationId = v.发展组织

									obj.sendUserId = v.发展人

									obj.authorId = v.达人UID

									obj.authorName = v.达人名称

									obj.acceptOrganizationId = v.受理组织

									obj.acceptUserId = v.受理人

									arr.push(obj)

								})

								_this.accountList = [...arr];

								console.log(_this.accountList,'accountList---1111')



								_this.accountList.forEach(item=>{
									_this.organizationEnum.forEach(v=>{
										console.log(item,'item');

										// 发展组织
										if(item.sendOrganizationId == v.organizationName){
											item.sendOrganizationId = v.organizationId
										}
										if(item.acceptOrganizationId == v.organizationName){
											item.acceptOrganizationId = v.organizationId
										}
									})

									_this.defaultFromHandleEnum.forEach(c=>{
										if(item.sendUserId == c.nickName){
											item.sendUserId = c.userId
										}
										if(item.acceptUserId == c.nickName){
											console.log('userId111',item.acceptUserId, c.userId);
											item.acceptUserId = c.userId
											console.log('userId22',item.acceptUserId, c.userId);
										}
									})
								})

								console.log(_this.accountList,'_this.accountList----222222');
								_this.form.items = _this.accountList

								// _this.reload();

							}

							reader.readAsArrayBuffer(f);

						}

						if (rABS) {

							reader.readAsArrayBuffer(f);

						} else {

							reader.readAsBinaryString(f);

						}



					},

    filterNode(value, data, node) {
      if (!value) return true;
      if (data.label) {
        return this.chooseNode(value, data, node);
      }
    },
    // 过滤父节点 / 子节点 (如果输入的参数是父节点且能匹配，则返回该节点以及其下的所有子节点；如果参数是子节点，则返回该节点的父节点。name是中文字符，enName是英文字符.
    chooseNode(value, data, node) {
      if (data.label.indexOf(value) !== -1) {
        return true
      }
      const level = node.level
      // 如果传入的节点本身就是一级节点就不用校验了
      if (level === 1) {
        return false
      }
      // 先取当前节点的父节点
      let parentData = node.parent
      // 遍历当前节点的父节点
      let index = 0
      while (index < level - 1) {
        // 如果匹配到直接返回，此处name值是中文字符，enName是英文字符。判断匹配中英文过滤
        if (parentData.data.label.indexOf(value) !== -1) {
          return true
        }
        // 否则的话再往上一层做匹配
        parentData = parentData.parent
        index++
      }
      // 没匹配到返回false
      return false
    },
    handleCheckChange(data, checked, indeterminate) {
      // 每次勾选状态改变时，获取所有勾选的节点
      const checkedNodes = this.$refs.tree.getCheckedNodes();

      // 如果你需要勾选的节点ID数组，可以这样做：
      const checkedIds = checkedNodes.map(node => node.id);
      // 可以在这里对 checkedNodes 或 checkedIds 进行后续处理
      console.log('checkedNodes', checkedNodes); // 打印所有勾选的节点数据
      console.log('checkedIds', checkedIds); // 打印所有勾选的节点ID
      const selectUsers = checkedNodes.filter(item=>item.text) || [];
      this.form.checksName = selectUsers.map(item=>item.text).join(',');
      console.log('selectUsers', selectUsers, this.form.checksName)
      this.form.checks = selectUsers;
    },
    //获取商品策略列表
    getTacticList() {
      this.loading = true;
      tacticList({
        id: this.tacticsRow.id,
      }).then((response) => {
        this.loading = false;
        console.log("商品策略列表", response);
        const { tactics, checks, toOrganizationId, toUserId, fromOrganizationId, fromUserId, returnToOrganizationId, returnToUserId, returnAutoRefund, productTemplate, smsTemplateId, smsTemplateAcceptedId , smsTemplateAcceptedIdReturn, couponTemplate } =
          response?.data;
        if (Array.isArray(tactics)) {
          this.form.items = response?.data.tactics;
          this.form.items?.forEach((item, index) => {
            this.getOrganizationChange(item.acceptOrganizationId, index, false);
            this.getsendOrganizationChange(item.sendOrganizationId, index, false);
          });
        }
        if (Array.isArray(checks)) {
          //树传参
          this.form.checks =response.data.checks;
          //树选中
          this.form.checksTree = response?.data.checks.map(item=>`${item.checkUserId}-${item.checkOrganizationId}`);
          console.log('树选中', this.form.checksTree)
          const checksNameList = [];
          this.organizationTreeData[0].children.map(item=>{
            item.children.map((userItem=>{
              if(response?.data.checks.some(s=>s.checkOrganizationId == item.id && s.checkUserId == userItem.checkUserId)){
                checksNameList.push(userItem.text);
              }
            }))
          })
          console.log('checksNameList', checksNameList)
          this.form.checksName = checksNameList.join(',');
          console.log('this.form', this.form, response?.data.checks)
          this.form.checkOutType = response.data.checkOutType ? response.data.checkOutType.split(",") : [];
        }

        this.form.productTemplate = productTemplate;
        this.form.smsTemplateId = smsTemplateId;
        this.form.smsTemplateAcceptedId = smsTemplateAcceptedId;
        this.form.smsTemplateAcceptedIdReturn = smsTemplateAcceptedIdReturn;
        this.form.couponTemplate = couponTemplate;


        this.form.toOrganizationId = toOrganizationId;
        this.form.toUserId = toUserId;
        this.getToOrganizationIdEnum(toOrganizationId, false);

        this.form.fromOrganizationId = fromOrganizationId;
        this.form.fromUserId = fromUserId;
        this.getFromOrganizationIdEnum(fromOrganizationId, false);

        this.form.returnToOrganizationId = returnToOrganizationId;
        this.form.returnToUserId = returnToUserId;
        this.getReturnToOrganizationIdEnum(returnToOrganizationId, false);
        this.form.returnAutoRefund = (returnAutoRefund==null ? '0' : returnAutoRefund);

      });
    },
    checkOutTypeChange(e){
      if(!e.length){
        this.form.checks = [];
        this.form.checksTree = [];
        this.form.checksName = '';
      }
    },
    //获取受理组织
    getManageUserOrganization() {
      manageUserOrganization({
        id: this.tacticsRow.id,
      }).then((response) => {
        console.log("纳管组织", response);
        if (Array.isArray(response?.data)) {
          this.organizationEnum = response.data;
        }
      });
    },
    //获取受理人员
    getOrganizationChange(id, index, isClear) {
      //切换清空受理人数据
      if (isClear) {
        this.form.items = this.form.items.map((item, i) => {
          if (i == index) {
            if (isClear) {
              item.acceptUserId = null;
            }
          }
          return item;
        });
      }
      if (!id) return;
      organizationUser({
        organizationId: id,
      }).then((response) => {
        console.log("受理人员", response, id, index);
        if (Array.isArray(response?.data)) {
          this.form.items = this.form.items.map((item, i) => {
            if (i == index) {
              item = {
                ...item,
                acceptorEnum: response.data,
              };
            }
            return item;
          });
        }
      });
    },
    getsendOrganizationChange(id, index, isClear) {
      //切换清空发展人数据
      if (isClear) {
        this.form.items = this.form.items.map((item, i) => {
          if (i == index) {
            if (isClear) {
              item.sendUserId = null;
            }
          }
          return item;
        });
      }
      if (!id) return;
      organizationUser({
        organizationId: id,
      }).then((response) => {
        console.log("发展人员", response, id, index);
        if (Array.isArray(response?.data)) {
          this.form.items = this.form.items.map((item, i) => {
            if (i == index) {
              item = {
                ...item,
                sendAcceptorEnum: response.data,
              };
            }
            return item;
          });
        }
      });
    },

    getcheckOrganizationChange(id, index, isClear) {
      //切换清空核销人数据
      if (isClear) {
        this.form.checks = this.form.checks.map((item, i) => {
          if (i == index) {
            if (isClear) {
              item.checkUserId = null;
            }
          }
          return item;
        });
      }
      if (!id) return;
      organizationUser({
        organizationId: id,
      }).then((response) => {
        console.log("核销人员", response, id, index);
        if (Array.isArray(response?.data)) {
          this.form.checks = this.form.checks.map((item, i) => {
            if (i == index) {
              item = {
                ...item,
                checkUserEnum: response.data,
              };
            }
            return item;
          });
        }
      });
    },

    //产品模板接口
    getGetProductMbList() {
      getProductMbList({
        status: 0,
        organizationId: this.tacticsRow.organizationId,
      }).then((response) => {
        console.log("产品模板", response);
        if (Array.isArray(response?.data)) {
          this.templateEnum = response.data;
        }
      });
    },
    //获取客户短信模板
    getSmsTemplate() {
      listTemplate({smsTemplate : 1}).then((response) => {
        if (Array.isArray(response?.rows)) {
          this.smsTemplateEnum = response.rows;
        }
      });
    },
    //获取受理人订单短信模板
    getSmsTemplateAcceptedBy() {
      listTemplate({smsTemplate : 2}).then((response) => {
        if (Array.isArray(response?.rows)) {
          this.smsTemplateAcceptedByEnum = response.rows;
        }
      });
    },
    //获取受理人售后订单短信模板
    getSmsTemplateAcceptedByReturn() {
      listTemplate({smsTemplate : 3}).then((response) => {
        if (Array.isArray(response?.rows)) {
          this.smsTemplateAcceptedByReturnEnum = response.rows;
        }
      });
    },
    //获取默认受理人员
    getToOrganizationIdEnum(id, inClear) {
      if (inClear) {
        this.form.toUserId = null;
      }
      if (!id) return;
      organizationUser({
        organizationId: id,
      }).then((response) => {
        console.log("默认受理人员", response);
        if (Array.isArray(response?.data)) {
          this.defaultHandleEnum = response.data;
        }
      });
    },
    //获取售后订单默认受理人员
    getReturnToOrganizationIdEnum(id, inClear) {
      if (inClear) {
        this.form.returnToUserId = null;
      }
      if (!id) return;
      organizationUser({
        organizationId: id,
      }).then((response) => {
        console.log("售后订单默认受理人员", response);
        if (Array.isArray(response?.data)) {
          this.defaultReturnHandleEnum = response.data;
        }
      });
    },
    //获取用户短信模板示例
    getFromTemplateEnum(id) {
      if (!id){
        this.showContent = false;
        return;
      }
      getTemplateContent({
        id : id,
        productId: this.tacticsRow.id,
      }).then((response) => {
        this.showContent = true;
        this.smsTemplateContent = response.data.templateContent;
      });
    },
    //获取受理人售后订单短信模板示例
    getFromTemplateAcceptedReturnEnum(id) {
      if (!id) {
        this.showAcceptedReturnContent = false;
        return;
      }
      getTemplateAcceptedContent({
        id : id
      }).then((response) => {
        this.showAcceptedReturnContent = true;
        this.smsTemplateAcceptedReturnContent = response.data.templateContent;
      });
    },
    //获取受理人订单短信模板示例
    getFromTemplateAcceptedEnum(id) {
      console.log("id=======",id)
      if (!id) {
        this.showAcceptedContent = false;
        return;
      }
      getTemplateAcceptedContent({
        id : id
      }).then((response) => {
        this.showAcceptedContent = true;
        this.smsTemplateAcceptedContent = response.data.templateContent;
      });
    },
    //获取默认发展人员
    getFromOrganizationIdEnum(id, inClear) {
      if (inClear) {
        this.form.fromUserId = null;
      }
      if (!id) return;
      organizationUser({
        organizationId: id,
      }).then((response) => {
        console.log("默认发展人员", response);
        if (Array.isArray(response?.data)) {
          this.defaultFromHandleEnum = response.data;
        }
      });
    },
    addItem(index) {
      this.form.items.splice(index + 1, 0, {});
			console.log(this.form,'form------');
    },
    removeItem(index) {
      this.form.items.splice(index, 1);
    },
    addItemCheck(index) {
      if (this.organizationTreeData.length == 0) {
        this.$modal.msgError("组织列表为空");
        return;
      }
      this.openForward = true;
    },
    removeItemCheck(index) {
      this.form.checks.splice(index, 1);
    },

    submitForm() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          console.log("表单内容", this.form);
          const { items, checks, checkOutType, toOrganizationId, toUserId, fromOrganizationId, fromUserId, returnToOrganizationId, returnToUserId, returnAutoRefund, productTemplate,smsTemplateId,smsTemplateAcceptedId,smsTemplateAcceptedIdReturn,couponTemplate } =
            this.form;
          //非批量
          if(!this.isBatch){
            const params = {
              id: this.tacticsRow.id,
              tactics: items,
              toOrganizationId,
              toUserId,
              fromOrganizationId,
              fromUserId,
              returnToOrganizationId,
              returnToUserId,
              returnAutoRefund,
              productTemplate,
              smsTemplateId,
              smsTemplateAcceptedId,
              smsTemplateAcceptedIdReturn,
              couponTemplate,
              checks: checks,
              checkOutType: checkOutType?.join(',') || '',
            };
            addTactic(params).then((response) => {
              if (response.code == 200) {
                this.$message({
                  message: "保存成功",
                  type: "success",
                });
                this.cancelButton();
              }
            });
          }
          //批量
          if(this.isBatch){
            const params = {
              ids: this.ids,
              tactics: items,
              toOrganizationId,
              toUserId,
              fromOrganizationId,
              fromUserId,
              returnToOrganizationId,
              returnToUserId,
              returnAutoRefund,
              productTemplate,
              smsTemplateId,
              smsTemplateAcceptedId,
              smsTemplateAcceptedIdReturn,
              couponTemplate,
              checks: checks,
              checkOutType: checkOutType?.join(',') || '',
            };
            addTacticBatch(params).then((response) => {
              if (response.code == 200) {
                this.$message({
                  message: "批量保存成功",
                  type: "success",
                });
                this.cancelButton();
              }
            });
          }
        } else {
          return false;
        }
      });
    },
    cancelButton() {
      this.setVisible();
      this.resetFn();
      this.$parent.isBatch = false;
    },
    /** 查询列表 */
    getOrganizationList() {
      this.queryParamsOrganization.productId = this.tacticsRow.id
      getViewOrganizationList(this.queryParamsOrganization).then(response => {
        this.organizationList = response.rows;
        this.totalOrganization = response.total;
      });
    },
    organizationAddDialogClose() {
      this.organizationUnallocated.ids = []
      this.organizationUnallocated.open = false
    },
    handleSelectionChangeEdit(selection) {
      this.organizationUnallocated.ids = selection.map(item => item.organizationId)
      console.log(this.organizationUnallocated.ids,'this.organizationUnallocated.ids-----');
    },
    getRowKeys(row) {
      return row.organizationId
    },
    //添加组织关系
    submitViewOrganization() {
      if(this.organizationUnallocated.ids == null || this.organizationUnallocated.ids.length == 0){
        this.$modal.msgWarning('请选择要添加的组织')
        return;
      }
      //添加组织
      let parm = {
        "productId":this.tacticsRow.id,
        "organizationIds": this.organizationUnallocated.ids
      }
      addViewOrganization(parm).then(response => {
        this.$modal.msgSuccess("新增成功");
        this.organizationUnallocated.open = false;
        this.getOrganizationList();
      });
    },
    handleDeleteOrganization(row){
      const ids = row.objectId;
      this.$modal.confirm('是否确认移除该组织？').then(function() {
        return deleteViewOrganization(ids);
      }).then(() => {
        this.getOrganizationList();
        this.$modal.msgSuccess("移除成功");
      }).catch(() => {});
    },
    // 新增组织关系框
    organizationAddDialogOpen() {
      this.organizationUnallocated.ids = []
      this.organizationUnallocated.open = true
      this.organizationUnallocated.queryParams.organizationId = undefined
      this.organizationUnallocated.queryParams.organizationName = ''
      this.getOrganizationUnallocatedList()
    },
    // 待选组织关系数据
    getOrganizationUnallocatedList() {
      this.loading = true
      //清空并获取所有加入公共推文的组织id
      this.organizationUnallocated.queryParams.allocatedOrganizationIds = []
      for (let i = 0; i < this.organizationList.length; i++) {
        this.organizationUnallocated.queryParams.allocatedOrganizationIds.push(this.organizationList[i].organizationId)
      }
      this.organizationUnallocated.queryParams.tweetId = this.$route.query.t
      unallocatedOrganizationList(this.addDateRange(this.organizationUnallocated.queryParams, [])).then(
        response => {
          this.organizationUnallocated.list = response.data
          this.loading = false
        })
    },
  },
};
</script>

<style>
.tactics_dialog .el-dialog__body {
  padding: 10px 20px 30px 20px;
}
.tactics_dialog .el-form-item__content {
  margin-left: 0 !important;
}
.tactics_dialog .el-table::before {
  display: none !important;
}
.tooltip {
  max-width: 240px;
}
.tactics_dialog .el-form-item--medium .el-form-item__label{
  line-height: 24px;
}
/* Style for custom file upload button */
.custom-file-upload {
  /* Button-like styles */
	cursor: pointer;
	border: none;
	border-radius: 3px;
	font-size: 12px;
	color: #1890ff;
	background: #e8f4ff;
	border-color: #a3d3ff;
	padding: 6px 14px;
	border: 1px solid  #1890ff;
	font-weight: 400;
	margin-left: 10px;
}
.custom-file-upload:hover {
  background-color: #1890ff; /* Blue when hovering */
  color: #fff;
}
/* Hide default file input */
#fileInput {
  display: none;
}
</style>
