<template>
	<div class="app-container">
		<el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch"
			label-width="68px">
			<el-form-item label="表单标题" prop="title">
				<el-input v-model="queryParams.title" placeholder="请输入表单标题" clearable
					@keyup.enter.native="handleQuery" />
			</el-form-item>
			<el-form-item label="展示标题" prop="showTitle">
				<el-input v-model="queryParams.showTitle" placeholder="请输入展示标题" clearable
					@keyup.enter.native="handleQuery" />
			</el-form-item>
			<el-form-item label="显示文案" prop="tipInfo">
				<el-input v-model="queryParams.tipInfo" placeholder="请输入显示文案" clearable
					@keyup.enter.native="handleQuery" />
			</el-form-item>
			<el-form-item label="交互类型" prop="showType">
				<el-select v-model="queryParams.showType" placeholder="请选择交互类型" clearable>
					<el-option v-for="dict in dict.type.sys_form_showtype" :key="dict.value" :label="dict.label"
						:value="dict.value" />
				</el-select>
			</el-form-item>
			<el-form-item label="创建时间">
				<el-date-picker v-model="dateRange" style="width: 250px" value-format="yyyy-MM-dd HH:mm:ss" type="daterange"
					range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"
          :default-time="['00:00:00', '23:59:59']"></el-date-picker>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
				<el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
			</el-form-item>
		</el-form>

		<el-row :gutter="10" class="mb8">
			<el-col :span="1.5">
				<el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd"
					v-hasPermi="['system:formInfo:add']">新增</el-button>
			</el-col>
			<right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
		</el-row>

		<el-table v-loading="loading" :data="infoList" :default-sort="defaultSort" @sort-change="handleSortChange">
			<el-table-column label="序号" type="index" align="center">
				<template slot-scope="scope">
					<span>{{(queryParams.pageNum - 1) * queryParams.pageSize + scope.$index + 1}}</span>
				</template>
			</el-table-column>
			<el-table-column label="表单标题" align="center" prop="title" sortable="custom"
				:sort-orders="['descending', 'ascending']" />
			<el-table-column label="展示标题" align="center" prop="showTitle" />
			<el-table-column label="显示文案" align="center" prop="tipInfo">
				<template slot-scope="scope">
					<el-tooltip class="item" effect="dark" placement="top-start"
						v-if="scope.row.tipInfo1!=null && scope.row.tipInfo1.length>20">
						<div slot="content" v-html="scope.row.tipInfo"></div>
						<span> {{ scope.row.tipInfo1.substring(0,20)}}.. </span>
					</el-tooltip>
					<span
						v-if="scope.row.tipInfo1!=null && scope.row.tipInfo1.length<=20">{{ scope.row.tipInfo1}}</span>
				</template>
			</el-table-column>
			<el-table-column label="推文是否显示文案" align="center" prop="showTweet">
				<template slot-scope="scope">
					<dict-tag :options="dict.type.sys_form_showtweet" :value="scope.row.showTweet" />
				</template>
			</el-table-column>
			<el-table-column label="提交按钮" align="center">
				<template slot-scope="scope">
					<span
						v-if="scope.row.submitBefore != '' && scope.row.submitBefore != null && scope.row.submitAfter != '' && scope.row.submitAfter != null">
						{{ scope.row.submitBefore }} , {{ scope.row.submitAfter}}
					</span>
					<span
						v-if="scope.row.submitBefore == '' || scope.row.submitBefore == null || scope.row.submitAfter == '' || scope.row.submitAfter == null">
						{{ scope.row.submitBefore }} {{ scope.row.submitAfter}}
					</span>
				</template>
			</el-table-column>
			<el-table-column label="交互类型" align="center" prop="showType">
				<template slot-scope="scope">
					<dict-tag :options="dict.type.sys_form_showtype" :value="scope.row.showType" />
				</template>
			</el-table-column>
			<el-table-column label="弹出高度" align="center" prop="showHeight">
				<template slot-scope="scope">
					<span
						v-if="scope.row.showType =='1' && scope.row.showHeight!=null && scope.row.showHeight!=0">{{ scope.row.showHeight + '%' }}</span>
				</template>
			</el-table-column>
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
					<el-button size="mini" type="text" icon="el-icon-tickets"
						@click="handlePreview(scope.row)">预览</el-button>
					<el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)"
						v-hasPermi="['system:formInfo:edit']">修改</el-button>
					<el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)"
						v-hasPermi="['system:formInfo:remove']">删除</el-button>
					<el-button size="mini" type="text" icon="el-icon-setting" @click="handleModuleLog(scope.row)"
						v-hasPermi="['system:formInfo:logList']">日志</el-button>
				</template>
			</el-table-column>
		</el-table>

		<pagination v-show="total>0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
			@pagination="getList" />

		<!-- 添加或修改表单对话框 -->
		<el-dialog :title="title" :visible.sync="open" width="1150px" append-to-body @close="cancel"
			:close-on-click-modal="false" :close-on-press-escape="false" :show-close="false">
			<el-form ref="form" :model="form" :rules="rules" label-width="130px">
				<el-form-item label="表单标题" prop="title">
					<el-input v-model="form.title" placeholder="请输入表单标题" style="width:350px" />
				</el-form-item>
				<el-form-item label="展示标题" prop="showTitle">
					<el-input v-model="form.showTitle" placeholder="请输入显示标题" style="width:350px" />
				</el-form-item>
				<el-form-item label="显示文案" prop="tipInfo">
					<editor v-model="form.tipInfo" :min-height="200" style="width:700px" />
				</el-form-item>
				<el-form-item label="推文是否显示文案" prop="showTweet">
					<el-radio-group v-model="form.showTweet">
						<el-radio v-for="dict in dict.type.sys_form_showtweet" :key="dict.value"
							:label="dict.value">{{dict.label}}</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="交互类型" prop="showType">
					<el-radio-group v-model="form.showType">
						<el-radio v-for="dict in dict.type.sys_form_showtype" :key="dict.value"
							:label="dict.value">{{dict.label}}</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="弹出高度" prop="showHeight" v-if="form.showType=='1'">
					<el-input-number v-model="form.showHeight" :min="40" :max="100"></el-input-number>
					<span
						style="width: 40px;display: inline-block;background: #F5F7FA;height: 36px;text-align: center;">%</span>
				</el-form-item>
				<el-form-item label="提交按钮显示">
					<el-input v-model="form.submitBefore" placeholder="请输入提交前按钮显示文字" style="width:350px">
						<template slot="prepend">提交前</template>
					</el-input>
					<br />
					<el-input v-model="form.submitAfter" placeholder="请输入提交后按钮显示文字"
						style="width:350px;padding-top: 10px;">
						<template slot="prepend">提交后</template>
					</el-input>
				</el-form-item>
				<el-form-item label="属性" prop="elements">
					<el-checkbox-group v-model="form.elements" style="margin-right: 5px;">
						<el-checkbox @change="handleCheckedChange(element)" v-for="element in allElementList"
							:key="element.id" :label="element.id">
							{{element.title}}
						</el-checkbox>
					</el-checkbox-group>
				</el-form-item>
				<el-form-item>
					<el-table :data="chooseElementList" v-loading="loading" :cell-style="{ padding: '2px 0' }"
						header-cell-class-name="table-header">
						<el-table-column label="属性标题" align="center">
							<template #default="scope">{{ scope.row.title}}</template>
						</el-table-column>
						<el-table-column label="显示名称" align="center">
							<template #default="scope">{{ scope.row.tipInfo}}</template>
						</el-table-column>
						<el-table-column label="是否必填" align="center">
							<template slot-scope="scope">
								<dict-tag :options="dict.type.sys_form_element_isrequired"
									:value="scope.row.isRequired" />
							</template>
						</el-table-column>
						<el-table-column label="类型" align="center" width="80px">
							<template #default="scope">
								<dict-tag :options="dict.type.sys_form_element_type" :value="scope.row.type" />
							</template>
						</el-table-column>
						<el-table-column label="选项值" align="center">
							<template #default="scope">{{ scope.row.options }}</template>
						</el-table-column>
						<el-table-column label="显示类型" align="center" width="80px">
							<template #default="scope">
								<dict-tag :options="dict.type.sys_form_element_showtype" :value="scope.row.showType" />
							</template>
						</el-table-column>
						<el-table-column label="样式结构" align="center" width="80px">
							<template #default="scope">
								<dict-tag :options="dict.type.sys_form_element_showstyle"
									:value="scope.row.showStyle" />
							</template>
						</el-table-column>
						<el-table-column label="格式" align="center" width="80px">
							<template slot-scope="scope">
								<dict-tag :options="dict.type.sys_form_element_dateformat"
									:value="scope.row.dateFormat" />
							</template>
						</el-table-column>
						<el-table-column label="默认地址" align="center" prop="maxNum" width="100">
							<template slot-scope="scope">
								{{scope.row.provinceName}} {{scope.row.cityName}} {{scope.row.areaName}}
							</template>
						</el-table-column>
						<el-table-column label="排序" align="center" width="50px">
							<template #default="scope">{{ scope.$index}}</template>
						</el-table-column>
						<el-table-column label="操作" align="center" width="180px">
							<template #default="scope">
								<el-button v-if="scope.$index !== 0 " type="text" icon="el-icon-top"
									@click="moveUp(scope.$index)">上移</el-button>
								<el-button v-if="scope.$index !== chooseElementList.length-1" type="text"
									icon="el-icon-bottom" @click="moveDown(scope.$index)">下移</el-button>
								<el-button type="text" icon="el-icon-delete"
									@click="deleteDo(scope.row.id,scope.$index)">删除</el-button>
							</template>
						</el-table-column>
					</el-table>
				</el-form-item>

			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button type="primary" @click="showPreview">预览并保存</el-button>
				<el-button @click="cancel">取 消</el-button>
			</div>
		</el-dialog>

		<!-- 表单详情 -->
		<el-dialog :title="title" :visible.sync="openDetail" width="1000px" append-to-body @close="closeDetail"
			:close-on-click-modal="false" :close-on-press-escape="false" :show-close="false">
			<el-form ref="form" :model="form" :rules="rules" label-width="130px" disabled>
				<el-form-item label="表单标题" prop="title">
					<el-input v-model="form.title" />
				</el-form-item>
				<el-form-item label="展示标题" prop="showTitle">
					<el-input v-model="form.showTitle" />
				</el-form-item>
				<el-form-item label="显示文案" prop="tipInfo">
					<editor v-model="form.tipInfo" :min-height="200" />
				</el-form-item>
				<el-form-item label="推文是否显示文案" prop="showTweet">
					<el-radio-group v-model="form.showTweet">
						<el-radio v-for="dict in dict.type.sys_form_showtweet" :key="dict.value"
							:label="dict.value">{{dict.label}}</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="交互类型" prop="showType">
					<el-radio-group v-model="form.showType">
						<el-radio v-for="dict in dict.type.sys_form_showtype" :key="dict.value"
							:label="dict.value">{{dict.label}}</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="弹出高度" prop="showHeight" v-if="form.showType=='1'">
					<el-input-number v-model="form.showHeight" :min="40" :max="70"></el-input-number>
					<span
						style="width: 40px;display: inline-block;background: #F5F7FA;height: 36px;text-align: center;">%</span>
				</el-form-item>
				<el-form-item label="提交按钮显示">
					<el-input v-model="form.submitBefore" placeholder="请输入提交前按钮显示文字" style="width:350px">
						<template slot="prepend">提交前</template>
					</el-input>
					<br />
					<el-input v-model="form.submitAfter" placeholder="请输入提交后按钮显示文字"
						style="width:350px;padding-top: 10px;">
						<template slot="prepend">提交后</template>
					</el-input>
				</el-form-item>
				<el-form-item label="属性" prop="elements">
					<el-checkbox-group v-model="form.elements">
						<el-checkbox @change="handleCheckedChange(element)" v-for="element in allElementList"
							:key="element.id" :label="element.id">
							{{element.title}}
						</el-checkbox>
					</el-checkbox-group>
				</el-form-item>
				<el-form-item>
					<el-table :data="chooseElementList" v-loading="loading" :cell-style="{ padding: '2px 0' }"
						header-cell-class-name="table-header">
						<el-table-column label="属性标题" align="center">
							<template #default="scope">{{ scope.row.title}}</template>
						</el-table-column>
						<el-table-column label="显示名称" align="center">
							<template #default="scope">{{ scope.row.tipinfo}}</template>
						</el-table-column>
						<el-table-column label="是否必填" align="center">
							<template slot-scope="scope">
								<dict-tag :options="dict.type.sys_form_element_isrequired"
									:value="scope.row.isRequired" />
							</template>
						</el-table-column>
						<el-table-column label="类型" align="center">
							<template #default="scope">
								<dict-tag :options="dict.type.sys_form_element_type" :value="scope.row.type" />
							</template>
						</el-table-column>
						<el-table-column label="选项值" align="center">
							<template #default="scope">{{ scope.row.options }}</template>
						</el-table-column>
						<el-table-column label="显示类型" align="center">
							<template #default="scope">
								<dict-tag :options="dict.type.sys_form_element_showtype" :value="scope.row.showType" />
							</template>
						</el-table-column>
						<el-table-column label="样式结构" align="center">
							<template #default="scope">
								<dict-tag :options="dict.type.sys_form_element_showstyle"
									:value="scope.row.showStyle" />
							</template>
						</el-table-column>
						<el-table-column label="格式" align="center" width="100px">
							<template slot-scope="scope">
								<dict-tag :options="dict.type.sys_form_element_dateformat"
									:value="scope.row.dateFormat" />
							</template>
						</el-table-column>
						<el-table-column label="默认地址" align="center" prop="maxNum" width="100">
							<template slot-scope="scope">
								{{scope.row.provinceName}} {{scope.row.cityName}} {{scope.row.areaName}}
							</template>
						</el-table-column>
						<el-table-column label="排序" align="center" width="50px">
							<template #default="scope">{{ scope.$index}}</template>
						</el-table-column>
					</el-table>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="closeDetail">取 消</el-button>
			</div>
		</el-dialog>

		<!-- 表单预览 -->
		<el-dialog title="表单预览" :visible.sync="openPreview" width="600px" append-to-body @close="closePreview"
			:close-on-click-modal="false" :close-on-press-escape="false" :show-close="false">
			<!-- 优化开始 -->
			<div style="width: 90%;margin: 0px auto;display: none;padding: 0px 5px;">
				<label style="color: #606266;text-align: left;font-size: 15px;">表单标题：{{form.title}}</label>
				<br />
				<label style="color: #606266;text-align: left;font-size: 15px;">
					<span v-show="form.status=='D'"
						style="color:red;display: block;margin-top: 10px;">状态：删除</span>
					<span v-show="form.status=='J'"
						style="color:red;display: block;margin-top: 10px;">状态：停用</span>
				</label>
			</div>
			<div style="width: 90%;margin: 0px auto;display: flex;justify-content: left;  padding: 0px 5px;"
				v-show="form.tipInfo!=null && form.tipInfo!='' && form.showTweet=='1'">
				<span v-html="form.tipInfo" style="max-height: 200px;overflow-y: scroll;"  class="messageCard" ></span>
			</div>
			<form-style :chooseElementList="chooseElementList"></form-style>
			<!-- 优化结束 -->
			
			<template #footer>
				<span class="dialog-footer">
					<el-button type="primary" v-if="isSHowSaveButton==true" v-loading="saveLoading"
						:disabled="saveLoading" @click="submitForm">保 存</el-button>
					<el-button @click="closePreview()">取 消</el-button>
				</span>
			</template>
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
	import formStyle  from '@/components/tweet/formStyle.vue'
	import {
		listInfo,
		getInfo,
		delInfo,
		addInfo,
		updateInfo,
		updateStatus,
		listInfoData,
		listInfoDataDetail,
		formLogList
	} from "@/api/system/scene/formInfo";
	import {
		listElementData
	} from "@/api/system/scene/formElement";

	export default {
		name: "formInfo",
		dicts: ['sys_form_showtweet', 'sys_form_showtype', 'sys_form_element_type', 'sys_form_element_showtype',
			'sys_form_element_showstyle', 'sys_form_element_showstyle_noin', 'sys_form_element_isrequired',
			'sys_form_element_rules', 'sys_form_element_dateformat'
		],
		components:{
			formStyle
		},
		data() {
			return {
				//修改状态权限
				updateStatusPermi: this.$auth.hasPermi("system:formInfo:updateStatus"),
				// 遮罩层
				loading: true,
				// 选中数组
				ids: [],
				// 显示搜索条件
				showSearch: true,
				// 总条数
				total: 0,
				// 表单表格数据
				infoList: [],
				// 弹出层标题
				title: "",
				// 是否显示弹出层
				open: false,
				// 日期范围
				dateRange: [],
				// 查询参数
				queryParams: {
					pageNum: 1,
					pageSize: 10,
					title: null,
					showTitle: null,
					tipInfo: null,
					showType: null,
					organizationId: sessionStorage.getItem('organizationId'),
				},
				// 表单参数
				form: {},
				// 表单校验
				rules: {
					title: [{
						required: true,
						message: "表单标题不能为空",
						trigger: "blur"
					}],
					showTitle: [{
						required: true,
						message: "展示标题不能为空",
						trigger: "blur"
					}],
					showType: [{
						required: true,
						message: "交互类型不能为空",
						trigger: "blur"
					}],
					elements: [{
						required: true,
						message: "属性不能为空",
						trigger: "change"
					}]
				},
				//所有属性
				allElementList: [],
				//选中的属性
				chooseElementList: [],
				//表单保存按钮是否展示
				isSHowSaveButton: false,
				saveLoading: false,
				//预览弹出层
				openPreview: false,
				//详情弹出层
				openDetail: false,
				//默认值
				formSelected: '',
				formChecked: [],
				valueRate: 3,
				valueDate1: null,
				valueDate2: null,
				valueDate3: null,
				valueDate4: null,
				valueDate5: null,
				valueDate6: null,
				//评分颜色
				colors: ['#99A9BF', '#F7BA2A', '#FF9900'],
				// 默认排序
				defaultSort: {
					prop: 'createTime',
					order: 'descending'
				},
				//日志
				moduleLogList: [],
				openModuleLog: false,
			};
		},
		created() {
			this.getElementList();
			this.queryParams.orderByColumn = this.defaultSort.prop;
			this.queryParams.isAsc = this.defaultSort.order;
			this.getList();
		},
		methods: {
			/** 查询所有表单属性列表 */
			getElementList() {
				let queryParamsElement = {};
				queryParamsElement.organizationId = sessionStorage.getItem('organizationId');
				listElementData(queryParamsElement).then(response => {
					this.allElementList = response.rows;
				});
			},

			/** 查询表单列表 */
			getList() {
				this.loading = true;
				listInfo(this.addDateRange(this.queryParams, this.dateRange)).then(response => {
					this.infoList = response.rows;
					console.log(this.infoList, 'this.infoList----');
					if (this.infoList) {
						this.infoList.forEach((item, index) => {
							item.title = item.title + "-" + (item.showType == '1' ? '弹出' : '平铺')
							item.tipInfo1 = item.tipInfo == null ? null : this.getPlainText(item.tipInfo)
						})
					}
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
					title: null,
					tipInfo: null,
					showTitle: null,
					showTweet: '1',
					submitBefore: '提交',
					submitAfter: '已提交',
					showType: '0',
					status: 'E',
					elements: [],
					showHeight: 40,
					organizationId: sessionStorage.getItem('organizationId'),
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
				this.dateRange = [];
				this.queryParams.orderByColumn = this.defaultSort.prop;
				this.queryParams.isAsc = this.defaultSort.order;
				this.resetForm("queryForm");
				this.handleQuery();
			},
			/** 排序触发事件 */
			handleSortChange(column, prop, order) {
				this.queryParams.orderByColumn = column.prop;
				this.queryParams.isAsc = column.order;
				this.getList();
			},
			/** 新增按钮操作 */
			handleAdd() {
				this.reset();
				this.form.elements = [];
				this.chooseElementList = [];
				this.open = true;
				this.title = "添加表单";
			},
			/** 修改按钮操作 */
			handleUpdate(row) {
				this.reset();
				const id = row.id || this.ids
				getInfo(id).then(response => {
					this.form = response.data;
					this.form.elements = [];
					this.chooseElementList = this.form.elementList;
					
					this.chooseElementList.forEach(item => {
						this.form.elements.push(item.id);
					});
					this.open = true;
					this.title = "修改表单";
				});
			},
			/** 提交按钮 */
			submitForm() {
				console.log("=========11111111")
				this.$refs["form"].validate(valid => {
					if (valid) {
						this.saveLoading = true;
						if (this.chooseElementList.length == 0) {
							this.$modal.msgError("请选择属性");
							this.saveLoading = false;
							return false;
						}
						if (this.form.showType != '1') {
							this.form.showHeight = null
						}
						this.form.elementList = this.chooseElementList;
						this.form.elements = [];
						this.chooseElementList.forEach(item => {
							this.form.elements.push(item.id);
						});
						this.form.elements = this.form.elements.join(",");
						if (this.form.id != null) {
							updateInfo(this.form).then(response => {
								this.$modal.msgSuccess("修改成功");
								this.closePreview();
								this.open = false;
								this.getList();
							});
						} else {
							addInfo(this.form).then(response => {
								this.$modal.msgSuccess("新增成功");
								this.closePreview();
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
				this.$modal.confirm('是否确认删除表单标题为"' + row.title + '"的记录？').then(function() {
					return delInfo(ids);
				}).then(() => {
					this.getList();
					this.$modal.msgSuccess("删除成功");
				}).catch(() => {});
			},
			/** 导出按钮操作 */
			handleExport() {
				this.download('system/formInfo/export', {
					...this.queryParams
				}, `info_${new Date().getTime()}.xlsx`)
			},
			// 选择对应属性相关 start =====
			handleCheckedChange(value) {
				if (this.form.elements.indexOf(value.id) != -1) {
					this.chooseElementList.push(value)
				} else {
					this.chooseElementList = this.chooseElementList.filter(item => item.id != value.id);
				}
			},
			// 上移
			moveUp(index) {
				let arr = this.chooseElementList;
				arr.splice(index - 1, 1, ...arr.splice(index, 1, arr[index - 1]));
				this.chooseElementList = arr;
			},
			// 下移
			moveDown(index) {
				let arr = this.chooseElementList;
				arr.splice(index, 1, ...arr.splice(index + 1, 1, arr[index]));
				this.chooseElementList = arr;
			},
			// 删除
			deleteDo(id, index) {
				this.chooseElementList.splice(index, 1);
				this.form.elements = this.form.elements.filter(item => item != id);
			},
			// 选择对应属性相关相关 end =====

			// 表单状态修改
			handleStatusChange(row) {
				let text = row.status === 'E' ? '启用' : '停用'
				let message = row.status === 'J' ? '' : '请先确定属性内容是否有改动'
				let type = this.formType;
				this.$modal.confirm('确认要"' + text + '"表单标题为"' + row.title + '"的记录吗？' + message).then(function() {
					return updateStatus({
						id: row.id,
						status: row.status,
						type: type
					})
				}).then(() => {
					this.$modal.msgSuccess(text + '成功')
				}).catch(function() {
					row.status = row.status === 'E' ? 'J' : 'E'
				})
			},
			// 预览页面 重置操作
			resetPreview() {
				this.formSelected = '';
				this.formChecked = [];
				this.valueRate = 3;
				this.valueDate1 = null;
				this.valueDate2 = null;
				this.valueDate3 = null;
				this.valueDate4 = null;
				this.valueDate5 = null;
				this.valueDate6 = null;
			},
			// 保存时 预览按钮操作
			showPreview() {
				this.resetPreview();
				if (this.form.title == '' || this.form.title == null) {
					return this.$modal.msgError("请填写表单标题")
				}
				if (this.form.showTitle == '' || this.form.showTitle == null) {
					return this.$modal.msgError("请填写展示标题")
				}
				if (this.form.submitBefore == '' || this.form.submitBefore == null) {
					return this.$modal.msgError("请填写提交前按钮显示文字")
				}
				if (this.form.submitAfter == '' || this.form.submitAfter == null) {
					return this.$modal.msgError("请填写提交后按钮显示文字")
				}
				if (this.chooseElementList.length == 0) {
					return this.$modal.msgError("请选择属性")
				}
				this.isSHowSaveButton = true;
				this.openPreview = true;
			},
			// 预览按钮操作
			handlePreview(row) {
				this.resetPreview();
				this.isSHowSaveButton = false;
				getInfo(row.id).then(response => {
					this.form = response.data;
					this.form.elements = [];
					this.chooseElementList = this.form.elementList;
					this.form.elementList.forEach(q=>{
						if(q.type == '3'){
							console.log(q,'q-----');
							q.valueList = []
						}
					})
					this.chooseElementList.forEach(item => {
						this.form.elements.push(item.id);
					});
					this.openPreview = true;
				});
			},
			/** 预览页面取消操作 */
			closePreview() {
				this.saveLoading = false;
				if (!this.isSHowSaveButton) {
					this.reset();
					this.form.elements = [];
					this.chooseElementList = [];
				}
				this.openPreview = false;
			},
			/** 详情按钮操作 */
			handleDetail(row) {
				getInfo(row.id).then(response => {
					this.form = response.data;
					this.form.elements = [];
					this.chooseElementList = this.form.elementList;
					this.chooseElementList.forEach(item => {
						this.form.elements.push(item.id);
					});
					this.openDetail = true;
					this.title = "表单详情";
				});
			},
			/** 详情页面取消操作 */
			closeDetail() {
				this.reset();
				this.form.elements = [];
				this.chooseElementList = [];
				this.title = "";
				this.openDetail = false;
			},
			//日志
			handleModuleLog(row) {
				this.openModuleLog = true;
				formLogList({
					targetId: row.id
				}).then(response => {
					this.moduleLogList = response.rows;
				});
			},
			//关闭日志弹窗
			closeModuleLog() {
				this.openModuleLog = false;
				this.moduleLogList = [];
			},

			//转意符换成普通字符
			convertIdeogramToNormalCharacter(val) {
				const arrEntities = {
					'lt': '<',
					'gt': '>',
					'nbsp': ' ',
					'amp': '&',
					'quot': '"'
				};
				return val.replace(/&(lt|gt|nbsp|amp|quot);/ig, function(all, t) {
					return arrEntities[t];
				});
			},

			// 获取富文本的纯文字内容
			getPlainText(richCont) {
				const str = richCont;
				let value = richCont;
				if (richCont) {
					// 方法一： 
					value = value.replace(/\s*/g, ""); //去掉空格
					value = value.replace(/<[^>]+>/g, ""); //去掉所有的html标记
					value = value.replace(/↵/g, ""); //去掉所有的↵符号
					value = value.replace(/[\r\n]/g, "") //去掉回车换行
					value = value.replace(/&nbsp;/g, "") //去掉空格
					value = this.convertIdeogramToNormalCharacter(value);
					return value;

					// 方法二： 
					// value = value.replace(/(\n)/g, "");
					// value = value.replace(/(\t)/g, "");
					// value = value.replace(/(\r)/g, "");
					// value = value.replace(/<\/?[^>]*>/g, "");
					// value = value.replace(/\s*/g, "");
					// value = convertIdeogramToNormalCharacter(value);
					// return value;
				} else {
					return null;
				}
			}
		},
	}
</script>

<style lang="scss" scoped>
	.form {
		.phone-input {
			outline: none;
			padding: 10px 0;
			border: none;
			width: 50%;
			height: 40px;
			line-height: 40px;
			text-align: center;
			// border: solid 2px #009aea;
			font-size: 14px;
			color: #606266;
			// background-color: #009aea20;
			// border:1px solid #999;
		}

		.phone-input2 {
			outline: none;
			padding: 10px 0;
			border: none;
			color: #606266;
			border: 1px solid #999;
			padding-left: 10px;
		}

		.phone-input3 {
			border: solid 1px #606266;
			border-radius: 10px;
			padding: 10px
		}

		.xian {
			border: 1px solid #999;
			height: .5px;
			width: 80%
		}

		.phone-input::-webkit-input-placeholder {
			font-size: 14px;
		}

		.phone-input:-moz-placeholder {
			font-size: 14px;
		}

		.phone-input:-ms-input-placeholder {
			font-size: 14px;
		}

		.textarea {
			width: 80%;
			border-radius: 10px;
			text-align: center;
			border: solid 1px #606266;
			font-size: 16px;
		}

		.textarea2 {
			width: 80%;
			border-radius: 10px;
			text-align: center;
			border: none;
			outline: none;
			font-size: 16px;
		}
	}

	.widthSX {
		width: 100%
	}

	.widthZY {
		width: 100px
	}

	.cssSX {
		display: flex;
		flex-direction: column;
		text-align: left !important;
	}

	.cssZY {
		display: flex;
		align-items: center;
	}

	.cssZYtext {
		display: flex;
		align-items: flex-start;
	}

	.cssNQ {
		display: flex;
		text-align: left !important;
		border-radius: 10px;
		border: 1px solid #999;
		align-items: center;
	}

	.cssNQtext {
		display: flex;
		text-align: left !important;
		border-radius: 10px;
		border: 1px solid #999;
		align-items: flex-start;
	}

	.border {
		border: 1px solid red
	}
	.mb-10{
		margin-bottom:10px
	}
	.ml-1{
		margin-left:10px
	}
	.mt-10{
		margin-top:20px
	}
	.d-flex {
		display: flex;
	}
	.a-center {
		align-items: center;
	}
	.j-center {
		justify-content: center;
	}
	.mt-5 {
		margin-top: 5px
	}
	.j-sb {
		justify-content: space-between;
	}
	::v-deep .el-select{
		width:100%
	}
	.messageCard::-webkit-scrollbar {
		width: 5px !important;
	}
	
	.messageCard::-webkit-scrollbar-thumb {
		border-radius: 5px;
		width: 5px !important;
		// background: rgba(0,0,0,0.2); 
		background: #dddee0;
	}
	
	.messageCard::-webkit-scrollbar-track {
		border-radius: 0;
		width: 5px !important;
		// background: rgba(0,0,0,0.1);
	}
</style>