<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="属性标题" prop="title">
        <el-input
          v-model="queryParams.title"
          placeholder="请输入属性标题"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="显示名称" prop="tipInfo">
        <el-input
          v-model="queryParams.tipInfo"
          placeholder="请输入显示名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
			<el-form-item label="类型" prop="type">
        <el-select v-model="queryParams.type" placeholder="请选择类型" clearable>
          <el-option
            v-for="dict in dict.type.sys_form_element_type"
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
          v-hasPermi="['system:formElement:add']"
        >新增</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="elementList" :default-sort="defaultSort" @sort-change="handleSortChange">
      <!-- <el-table-column type="selection" width="55" align="center" /> -->
      <el-table-column label="序号" type="index" align="center">
        <template slot-scope="scope">
          <span>{{(queryParams.pageNum - 1) * queryParams.pageSize + scope.$index + 1}}</span>
        </template>
      </el-table-column>
      <el-table-column label="属性标题" align="center" prop="title" sortable="custom" :sort-orders="['descending', 'ascending']"/>
      <el-table-column label="显示名称" align="center" prop="tipinfo" sortable="custom" :sort-orders="['descending', 'ascending']">
        <template slot-scope="scope">
					{{scope.row.tipInfo}}
				</template>
      </el-table-column>
      <el-table-column label="是否必填" align="center" prop="isRequired" width="80" >
				<template slot-scope="scope">
          <dict-tag :options="dict.type.sys_form_element_isrequired" :value="scope.row.isRequired"/>
				</template>
			</el-table-column>
      <el-table-column label="类型" align="center" prop="type" width="80">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.sys_form_element_type" :value="scope.row.type"/>
        </template>
			</el-table-column>
      <el-table-column label="显示类型" align="center" prop="showType" width="80" >
				<template slot-scope="scope">
          <dict-tag :options="dict.type.sys_form_element_showtype" :value="scope.row.showType"/>
				</template>
			</el-table-column>
      <el-table-column label="样式结构" align="center" prop="showStyle" width="80" >
				<template slot-scope="scope">
          <dict-tag :options="dict.type.sys_form_element_showstyle" :value="scope.row.showStyle"/>
				</template>
			</el-table-column>
      <el-table-column label="验证规则" align="center" prop="rules" width="80">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.sys_form_element_rules" :value="scope.row.rules"/>
				</template>
			</el-table-column>
      <el-table-column label="日期格式" align="center" prop="dateFormat" width="100">
				<template slot-scope="scope">
          <dict-tag :options="dict.type.sys_form_element_dateformat" :value="scope.row.dateFormat"/>
				</template>
			</el-table-column>
      <el-table-column label="评分最大值" align="center" prop="maxNum" width="100">
				<template slot-scope="scope">
					{{scope.row.type == 5 ? scope.row.maxNum : ''}}
				</template>
			</el-table-column>
      <el-table-column label="默认地址" align="center" prop="maxNum" width="100">
				<template slot-scope="scope">
					{{scope.row.provinceName}} {{scope.row.cityName}} {{scope.row.areaName}}
				</template>
			</el-table-column>
      <el-table-column label="选项值" align="center" prop="options" >
				<template slot-scope="scope">
					{{scope.row.options }}
				</template>
			</el-table-column>
      <el-table-column label="已被应用" align="center" prop="options" >
				<template slot-scope="scope">
          <span v-if="scope.row.formCount==0 && scope.row.signCount==0">否</span>
          <span v-if="scope.row.formCount!=0 || scope.row.signCount!=0">是</span>
				</template>
			</el-table-column>
      <el-table-column label="创建者" align="center" prop="createBy" width="100">
				<template slot-scope="scope">
					{{scope.row.createBy }}
				</template>
			</el-table-column>
			<el-table-column label="创建时间" align="center" prop="createTime" width="150" sortable="custom" :sort-orders="['descending', 'ascending']">
				<template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime, '{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
			</el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="180">
        <template slot-scope="scope">
          <el-button
            v-if="scope.row.formCount==0 && scope.row.signCount==0"
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['system:formElement:edit']"
          >修改</el-button>
          <!-- 类型：0字符串 1文本 2单选 3多选 4下拉 5评分 6日期 7日期范围 8地址 9短信验证码  -->
					<el-button
            v-if="scope.row.type=='2' || scope.row.type=='3' || scope.row.type=='4'"
            size="mini"
            type="text"
            icon="el-icon-document"
            @click="handleOptions(scope.row)"
            v-hasPermi="['system:formElement:list']"
          >选项值</el-button>
          <el-button
            v-if="scope.row.formCount==0 && scope.row.signCount==0"
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:formElement:remove']"
          >删除</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-document"
            @click="handleDetail(scope.row)"
          >详情</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-setting"
            @click="handleModuleLog(scope.row)"
            v-hasPermi="['system:formElement:logList']"
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

    <!-- 添加或修改表单属性对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="700px" append-to-body :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false">
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="属性标题" prop="title">
          <el-input v-model="form.title" placeholder="请输入属性标题" style="width:300px"/>
        </el-form-item>
        <el-form-item label="显示名称" prop="tipInfo">
          <el-input v-model="form.tipInfo" placeholder="请输入显示名称" style="width:300px"/>
        </el-form-item>
        <el-form-item label="是否必填" prop="isRequired">
					<el-radio-group v-model="form.isRequired">
            <el-radio
              v-for="dict in dict.type.sys_form_element_isrequired"
              :key="dict.value"
              :label="dict.value"
            >{{dict.label}}</el-radio>
					</el-radio-group>
        </el-form-item>
				<el-form-item label="类型" prop="type">
          <el-select v-model="form.type" clearable placeholder="请选择类型" style="width:200px">
            <el-option
              v-for="dict in dict.type.sys_form_element_type"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="显示类型" prop="showType" v-if="form.type=='2'">
					<el-radio-group v-model="form.showType">
            <el-radio
              v-for="dict in dict.type.sys_form_element_showtype_radio"
              :key="dict.value"
              :label="dict.value"
            >{{dict.label}}</el-radio>
					</el-radio-group>
        </el-form-item>
        <el-form-item label="显示类型" prop="showType" v-if="form.type=='3'">
					<el-radio-group v-model="form.showType">
            <el-radio
              v-for="dict in dict.type.sys_form_element_showtype_checkbox"
              :key="dict.value"
              :label="dict.value"
            >{{dict.label}}</el-radio>
					</el-radio-group>
        </el-form-item>
        <el-form-item label="验证规则" prop="rules" v-if="form.type=='0'">
          <el-select v-model="form.rules" clearable placeholder="请选择" style="width:200px">
            <el-option
              v-for="dict in dict.type.sys_form_element_rules"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="日期格式" prop="dateFormat" v-if="form.type=='6' || form.type=='7'">
					<el-radio-group v-model="form.dateFormat">
            <el-radio
              v-for="dict in dict.type.sys_form_element_dateformat"
              :key="dict.value"
              :label="dict.value"
            >{{dict.label}}</el-radio>
					</el-radio-group>
        </el-form-item>
        <el-form-item label="评分最大值" prop="maxNum" v-if="form.type=='5'">
          <el-input-number v-model="form.maxNum" :min="5" :max="10" :precision="0" placeholder="请输入评分最大值" />
        </el-form-item>
        <el-form-item label="默认地址" v-if="form.type=='8'">
          <el-select v-model="form.provinceCode" @change="getCityList" filterable clearable placeholder="请选择省份" style="width:150px">
            <el-option
              v-for="dict in provinceList"
              :key="dict.code"
              :label="dict.name"
              :value="dict.code"
            ></el-option>
          </el-select>
          <el-select v-model="form.cityCode"  @change="getAreaList" filterable clearable placeholder="请选择城市" style="width:150px;padding-left: 10px;">
            <el-option
              v-for="dict in cityList"
              :key="dict.code"
              :label="dict.name"
              :value="dict.code"
            ></el-option>
          </el-select>
          <el-select v-model="form.areaCode" filterable clearable placeholder="请选择区" style="width:150px;padding-left: 10px;">
            <el-option
              v-for="dict in areaList"
              :key="dict.code"
              :label="dict.name"
              :value="dict.code"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="样式结构" prop="showStyle" v-if="form.type=='0' || form.type=='1'">
					<el-radio-group v-model="form.showStyle">
            <el-radio
              v-for="dict in dict.type.sys_form_element_showstyle"
              :key="dict.value"
              :label="dict.value"
            >{{dict.label}}</el-radio>
					</el-radio-group>
        </el-form-item>
        <el-form-item label="样式结构" prop="showStyle" v-if="form.type!='0' && form.type!='1'">
					<el-radio-group v-model="form.showStyle">
            <el-radio
              v-for="dict in dict.type.sys_form_element_showstyle_noin"
              :key="dict.value"
              :label="dict.value"
            >{{dict.label}}</el-radio>
					</el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" v-loading="saveLoading" :disabled="saveLoading" @click="submitForm">保 存</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 表单属性详情 -->
    <el-dialog :title="title" :visible.sync="openDetail" width="700px" append-to-body :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false">
      <el-form ref="form" :model="form" :rules="rules" label-width="100px" disabled>
        <el-form-item label="属性标题" prop="title">
          <el-input v-model="form.title" placeholder="请输入属性标题" style="width:300px"/>
        </el-form-item>
        <el-form-item label="显示名称" prop="tipInfo">
          <el-input v-model="form.tipInfo" placeholder="请输入显示名称" style="width:300px"/>
        </el-form-item>
        <el-form-item label="是否必填" prop="isRequired">
					<el-radio-group v-model="form.isRequired">
            <el-radio
              v-for="dict in dict.type.sys_form_element_isrequired"
              :key="dict.value"
              :label="dict.value"
            >{{dict.label}}</el-radio>
					</el-radio-group>
        </el-form-item>
				<el-form-item label="类型" prop="type">
          <el-select v-model="form.type" clearable placeholder="请选择类型" style="width:200px">
            <el-option
              v-for="dict in dict.type.sys_form_element_type"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="显示类型" prop="showType" v-if="form.type=='2'">
					<el-radio-group v-model="form.showType">
            <el-radio
              v-for="dict in dict.type.sys_form_element_showtype_radio"
              :key="dict.value"
              :label="dict.value"
            >{{dict.label}}</el-radio>
					</el-radio-group>
        </el-form-item>
        <el-form-item label="显示类型" prop="showType" v-if="form.type=='3'">
					<el-radio-group v-model="form.showType">
            <el-radio
              v-for="dict in dict.type.sys_form_element_showtype_checkbox"
              :key="dict.value"
              :label="dict.value"
            >{{dict.label}}</el-radio>
					</el-radio-group>
        </el-form-item>
        <el-form-item label="验证规则" prop="rules" v-if="form.type=='0'">
					<el-select v-model="form.rules" clearable placeholder="请选择" style="width:200px">
            <el-option
              v-for="dict in dict.type.sys_form_element_rules"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="日期格式" prop="dateFormat" v-if="form.type=='6' || form.type=='7'">
					<el-radio-group v-model="form.dateFormat">
						<el-radio
              v-for="dict in dict.type.sys_form_element_dateformat"
              :key="dict.value"
              :label="dict.value"
            >{{dict.label}}</el-radio>
					</el-radio-group>
        </el-form-item>
        <el-form-item label="评分最大值" prop="maxNum" v-if="form.type=='5'">
          <el-input-number v-model="form.maxNum" :min="5" :max="10" :precision="0" placeholder="请输入评分最大值" />
        </el-form-item>
        <el-form-item label="默认地址" v-if="form.type=='8'">
          <el-select v-model="form.provinceCode" @change="getCityList" filterable clearable placeholder="请选择省份" style="width:150px">
            <el-option
              v-for="dict in provinceList"
              :key="dict.code"
              :label="dict.name"
              :value="dict.code"
            ></el-option>
          </el-select>
          <el-select v-model="form.cityCode"  @change="getAreaList" filterable clearable placeholder="请选择城市" style="width:150px;padding-left: 10px;">
            <el-option
              v-for="dict in cityList"
              :key="dict.code"
              :label="dict.name"
              :value="dict.code"
            ></el-option>
          </el-select>
          <el-select v-model="form.areaCode" filterable clearable placeholder="请选择区" style="width:150px;padding-left: 10px;">
            <el-option
              v-for="dict in areaList"
              :key="dict.code"
              :label="dict.name"
              :value="dict.code"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="样式结构" prop="showStyle">
					<el-radio-group v-model="form.showStyle">
            <el-radio
              v-for="dict in dict.type.sys_form_element_showstyle"
              :key="dict.value"
              :label="dict.value"
            >{{dict.label}}</el-radio>
					</el-radio-group>
        </el-form-item>
      </el-form>
      <el-table v-loading="loadingOption" :data="elementOptionList" v-if="form.type=='2' || form.type=='3' || form.type=='4'">
        <el-table-column label="序号" type="index" align="center" width="100">
          <template slot-scope="scope">
            <span>{{scope.$index + 1 }}</span>
          </template>
        </el-table-column>
        <el-table-column label="选项名称" align="center" prop="name"/>
        <el-table-column label="选项值" align="center" prop="val"/>
        <el-table-column label="排序" align="center" prop="sort" width="80"/>
			</el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelDetail">取 消</el-button>
      </div>
    </el-dialog>

		<!-- 表单属性选项值列表 -->
    <el-dialog :title="title" :visible.sync="openOptionsList" width="50%" append-to-body :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false">
      <el-form :model="queryParamsOption" ref="queryFormOption" size="small" :inline="true" v-show="showSearchOption" label-width="68px">
				<el-form-item label="选项名称" prop="name">
					<el-input
            style="width: 160px;"
						v-model="queryParamsOption.name"
						placeholder="请输入选项名称"
						clearable
						@keyup.enter.native="handleQueryOption"
					/>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" icon="el-icon-search" size="mini" @click="handleQueryOption">搜索</el-button>
					<el-button icon="el-icon-refresh" size="mini" @click="resetQueryOption">重置</el-button>
				</el-form-item>
			</el-form>

			<el-row :gutter="10" class="mb8">
				<el-col :span="1.5">
					<el-button
            v-if="formElementFormCount==0 && formElementSignCount==0"
						type="primary"
						plain
						icon="el-icon-plus"
						size="mini"
						@click="handleAddOption"
						v-hasPermi="['system:formElement:add']"
					>新增</el-button>
				</el-col>
				<right-toolbar :showSearch.sync="showSearchOption" @queryTable="getOptionList"></right-toolbar>
			</el-row>

			<el-table v-loading="loadingOption" :data="elementOptionList">
        <el-table-column label="序号" type="index" align="center" width="100">
          <template slot-scope="scope">
            <span>{{(queryParamsOption.pageNum - 1) * queryParamsOption.pageSize + scope.$index + 1}}</span>
          </template>
        </el-table-column>
        <el-table-column label="选项名称" align="center" prop="name" />
        <el-table-column label="选项值" align="center" prop="val" />
        <el-table-column label="排序" align="center" prop="sort" width="80"/>
				<el-table-column label="操作" align="center" class-name="small-padding fixed-width" v-if="formElementFormCount==0 && formElementSignCount==0">
					<template slot-scope="scope">
						<el-button
							size="mini"
							type="text"
							icon="el-icon-edit"
							@click="handleUpdateOption(scope.row)"
							v-hasPermi="['system:formElement:edit']"
						>修改</el-button>
						<el-button
							size="mini"
							type="text"
							icon="el-icon-delete"
							@click="handleDeleteOption(scope.row)"
							v-hasPermi="['system:formElement:remove']"
						>删除</el-button>
					</template>
				</el-table-column>
			</el-table>

			<pagination
				v-show="totalOption>0"
				:total="totalOption"
				:page.sync="queryParamsOption.pageNum"
				:limit.sync="queryParamsOption.pageSize"
				@pagination="getOptionList"
			/>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelOptions">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 添加或修改单属性选项对话框 -->
    <el-dialog :title="title" :visible.sync="openAddOption" width="500px" append-to-body :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false">
      <el-form ref="formOption" :model="formOption" :rules="rulesOption" label-width="80px">
        <el-form-item label="选项名称" prop="name" >
          <el-input v-model="formOption.name" placeholder="请输入选项名称" style="width:300px"/>
        </el-form-item>
        <el-form-item label="选项值" prop="val" width="250px">
          <el-input v-model="formOption.val" placeholder="请输入选项值" style="width:300px"/>
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input-number v-model="formOption.sort" :min="0" placeholder="请输入排序" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitFormOption" v-loading="saveLoading" :disabled="saveLoading" >保 存</el-button>
        <el-button @click="cancelAddOption">取 消</el-button>
      </div>
    </el-dialog>

    <!--操作日志列表-->
    <el-dialog title="日志列表" :visible.sync="openModuleLog" width="700px" append-to-body :close-on-click-modal="false" :close-on-press-escape="false"
               :show-close="true" @close="closeModuleLog">
      <div class="block">
        <el-timeline>
          <el-timeline-item
            v-for="(log, index) in moduleLogList"
            :key="index"
            :timestamp="parseTime(log.createTime, '{y}-{m}-{d} {h}:{i}:{s}') "
            placement="top">
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
import { listElement, getElement, delElement, addElement, updateElement, formElementLogList } from "@/api/system/scene/formElement";
import { listElementOption, getElementOption, delElementOption, addElementOption, updateElementOption } from "@/api/system/scene/formElement";
import {  addressList } from "@/api/system/address/index";
export default {
  name: "formElement",
  dicts: ['sys_form_element_type', 'sys_form_element_showtype', 'sys_form_element_showstyle', 'sys_form_element_showstyle_noin', 'sys_form_element_showtype_radio', 'sys_form_element_showtype_checkbox', 'sys_form_element_isrequired', 'sys_form_element_rules', 'sys_form_element_dateformat' ],
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 表单属性表格数据
      elementList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        title: null,
        tipInfo: null,
        type: null,
				organizationId:sessionStorage.getItem('organizationId'),
      },
			// 日期范围
      dateRange: [],
      // 表单参数
      form: {
				id: null,
        title: '',
        tipInfo: '',
        type: null,
        showType: '',
        showStyle: '',
        status: 'E',
        isRequired: '0',
        rules: '0',
        dateFormat: '0',
        maxNum: 5,
        provinceCode:null,
        cityCode:null,
        areaCode:null,
				organizationId:sessionStorage.getItem('organizationId'),
			},
      // 表单校验
      rules: {
				title: [
          { required: true, message: "属性标题不能为空", trigger: "blur" }
        ],
        tipInfo: [
          { required: true, message: "显示名称不能为空", trigger: "blur" }
        ],
				type: [
          { required: true, message: "类型不能为空", trigger: "blur" }
        ],
      },
			//选项值列表弹出层
			openOptionsList:false,
      // 遮罩层
      loadingOption: true,
      // 显示搜索条件
      showSearchOption: true,
      // 总条数
      totalOption: 0,
      // 表单属性表格数据
      elementOptionList: [],
      // 查询参数
      queryParamsOption: {
        pageNum: 1,
        pageSize: 10,
        formElementId:null,
        name: null,
      },
      //选中的表单属性id
      formElementId:null,
      //选中的表单属性的 被表单使用次数
      formElementFormCount:0,
      //选中的表单属性的 被签到使用次数
      formElementSignCount:0,
      // 选项值添加弹出层
      openAddOption:false,
      saveLoading:false,
      // 表单参数
      formOption: {},
      // 表单校验
      rulesOption: {
        name: [
          { required: true, message: "选项名称不能为空", trigger: "blur" }
        ],
        val: [
          { required: true, message: "选项值不能为空", trigger: "blur" }
        ],
      },
      //属性详情弹出层
      openDetail:false,
      // 默认排序
      defaultSort: {prop: 'createTime', order: 'descending'},
      //日志
      moduleLogList:[],
      openModuleLog:false,
      //三级地址
      provinceList:[],
      cityList:[],
      areaList:[],
    };
  },
  created() {
    this.queryParams.orderByColumn = this.defaultSort.prop;
    this.queryParams.isAsc = this.defaultSort.order;
    this.getList();
    this.getProvinceList();
  },
  methods: {
    getProvinceList(){
      this.cityList=[]
      this.areaList=[]
      addressList({selectType:'0'}).then(response=>{
        this.provinceList = response.rows;
      })
    },
    getCityList(provinceCode){
      this.form.cityCode = null
      this.form.areaCode = null
      if(provinceCode==null || provinceCode==undefined || provinceCode==''){
        this.$modal.msgError("请先选择省份");
      }
      addressList({selectType:'1',pCode:provinceCode}).then(response=>{
        this.cityList = response.rows;
      })
    },
    getAreaList(cityCode){
      this.form.areaCode = null
      if(cityCode==null || cityCode==undefined || cityCode==''){
        this.$modal.msgError("请先选择城市");
      }
      addressList({selectType:'2',pCode:cityCode}).then(response=>{
        this.areaList = response.rows;
      })
    },
    /** 查询表单属性列表 */
    getList() {
      console.log("=====",JSON.stringify(this.queryParams).toString())
      this.loading = true;
      listElement(this.addDateRange(this.queryParams, this.dateRange)).then(response => {
        this.elementList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.areaList =[]
      this.cityList=[]
      this.saveLoading =false;
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        id: null,
        title: '',
        tipInfo: '',
        type: null,
        showType: '',
        showStyle: '0',
        status: 'E',
        isRequired: '0',
        rules: '0',
        dateFormat: '0',
        maxNum: 5,
        provinceCode:null,
        cityCode:null,
        areaCode:null,
				organizationId:sessionStorage.getItem('organizationId'),
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
      this.cityList =[]
      this.areaList =[]
      this.reset();
      this.open = true;
      this.title = "添加表单属性";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getElement(id).then(response => {
        this.form = response.data;
        let provinceCode = this.form.provinceCode
        if(provinceCode!=null && provinceCode!=undefined && provinceCode!=''){
          addressList({selectType:'1',pCode:provinceCode}).then(response=>{
            this.cityList = response.rows;
          })
        }else{
          this.cityList =[]
        }
        let cityCode = this.form.cityCode
        if(cityCode!=null && cityCode!=undefined && cityCode!=''){
          addressList({selectType:'2',pCode:cityCode}).then(response=>{
            this.areaList = response.rows;
          })
        }else{
          this.areaList = []
        }
        this.title = "修改表单属性";
        this.open = true;
      });
    },
    /** 表单属性详情 */
    handleDetail(row){
      this.reset();
      const id = row.id || this.ids
      getElement(id).then(response => {
        this.form = response.data;
        let provinceCode = this.form.provinceCode
        if(provinceCode!=null && provinceCode!=undefined && provinceCode!=''){
          addressList({selectType:'1',pCode:provinceCode}).then(response=>{
            this.cityList = response.rows;
          })
        }else{
          this.cityList =[]
        }
        let cityCode = this.form.cityCode
        if(cityCode!=null && cityCode!=undefined && cityCode!=''){
          addressList({selectType:'2',pCode:cityCode}).then(response=>{
            this.areaList = response.rows;
          })
        }else{
          this.areaList = []
        }
        //选项值列表
        this.loadingOption = true;
        listElementOption({
          formElementId:id
        }).then(response => {
          this.loadingOption = false;
          this.elementOptionList = response.rows;
        });

        this.openDetail = true;
        this.title = "表单属性详情";

      });
    },
    /** 详情页面 取消操作 */
    cancelDetail(){
      this.areaList =[]
      this.cityList=[]
      this.openDetail = false;
      this.elementOptionList = [];
      this.reset();
      this.resetForm("queryFormOption");
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        this.saveLoading = true;
				//0字符串 1文本 2单选 3多选 4下拉 5评分 6日期 7日期范围 8地址 9短信验证码
				if(this.form.type!='0'){
					this.form.rules='0'
				}
				if(this.form.type!='5'){
					this.form.maxNum=0
				}
				if(this.form.type!='6' && this.form.type!='7'){
					this.form.dateFormat='0'
				}
        if(this.form.type!='2' && this.form.type!='3'){
					this.form.showType=''
				}
        if(this.form.type=='2' && (this.form.showType=='' || this.form.showType==null)){
					this.form.showType='0'
				}
        if(this.form.type=='3' && (this.form.showType=='' || this.form.showType==null)){
					this.form.showType='1'
				}
        if (valid) {
          if (this.form.id != null) {
            updateElement(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.cancel();
              this.getList();
            });
          } else {
            addElement(this.form).then(response => {
              this.$modal.msgSuccess("新增成功");
              this.cancel();
              this.getList();
            });
          }
        }else{
          this.saveLoading = false;
        }
      });
    },

    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$modal.confirm('是否确认删除该表单属性？').then(function() {
        return delElement(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },

    /** 导出按钮操作 */
    handleExport() {
      this.download('system/formElement/export', {
        ...this.queryParams
      }, `element_${new Date().getTime()}.xlsx`)
    },

		/** 查询选项值列表 */
    handleOptions(row) {
      this.formElementFormCount = row.formCount;
      this.formElementSignCount = row.signCount;
      this.formElementId = row.id;
      this.getOptionList();
      this.openOptionsList = true;
    },

		/** 选项值列表取消按钮 */
    cancelOptions() {
      this.openOptionsList = false;
      this.formElementId = null;
      this.elementOptionList = [];
      this.totalOption = 0;
      this.resetForm("queryFormOption");
      this.getList();
    },

    /** 查询项目任务记录列表 */
    getOptionList() {
      this.queryParamsOption.formElementId = this.formElementId;
      this.loadingOption = true;
      listElementOption(this.queryParamsOption).then(response => {
        this.elementOptionList = response.rows;
        this.totalOption = response.total;
        this.loadingOption = false;
      });
    },

    /** 搜索按钮操作 */
    resetQueryOption(){
      this.resetForm("queryFormOption");
      this.handleQueryOption();
    },
    /** 重置按钮操作 */
    handleQueryOption(){
      this.queryParamsOption.pageNum = 1;
      this.getOptionList();
    },

    // 取消按钮
    cancelAddOption() {
      this.saveLoading = false;
      this.openAddOption = false;
      this.resetOption();
    },
    // 表单重置
    resetOption() {
      this.formOption = {
        id: null,
        formElementId: this.formElementId,
        name: null,
        val: null,
        sort: 0,
        status: 'E'
      };
      this.resetForm("formOption");
    },
    /** 新增按钮操作 */
    handleAddOption() {
      this.resetOption();
      this.openAddOption = true;
      this.title = "添加属性选项值";
    },
    /** 修改按钮操作 */
    handleUpdateOption(row) {
      this.resetOption();
      const id = row.id || this.ids
      getElementOption(id).then(response => {
        this.formOption = response.data;
        this.openAddOption = true;
        this.title = "修改属性选项值";
      });
    },
    /** 提交按钮 */
    submitFormOption() {
      this.$refs["formOption"].validate(valid => {
        this.saveLoading = true;
        if(this.formOption.formElementId==null || this.formOption.formElementId==""){
          this.$modal.msgError("请刷新页面重试");
          this.saveLoading = false;
          return false;
        }
        if (valid) {
          if (this.formOption.id != null) {
            updateElementOption(this.formOption).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.cancelAddOption();
              this.getOptionList();
            });
          } else {
            addElementOption(this.formOption).then(response => {
              this.$modal.msgSuccess("新增成功");
              this.cancelAddOption();
              this.getOptionList();
            });
          }
        }else{
          this.saveLoading = false;
        }
      });
    },
    /** 删除按钮操作 */
    handleDeleteOption(row) {
      const ids = row.id || this.ids;
      this.$modal.confirm('是否确认删除该选项值？').then(function() {
        return delElementOption(ids);
      }).then(() => {
        this.getOptionList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },

    //日志
    handleModuleLog(row){
      this.openModuleLog = true;
      formElementLogList({targetId: row.id}).then(response => {
        this.moduleLogList = response.rows;
      });
    },
    //关闭日志弹窗
    closeModuleLog(){
      this.openModuleLog = false;
      this.moduleLogList = [];
    },
  }
};
</script>

<style lang="scss" scoped>
</style>
