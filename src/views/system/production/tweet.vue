<template>
	<div class="app-container">
		<el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch">
			<el-form-item label="推文编号" prop="tweetCode">
				<el-input
						v-model="queryParams.tweetId"
						placeholder="请输入推文编号"
						clearable
						@keyup.enter.native="handleQuery"
				/>
			</el-form-item>
			<el-form-item label="推文标题" prop="tweetTitle">
				<el-input
						v-model="queryParams.tweetTitle"
						placeholder="请输入推文标题"
						clearable
						@keyup.enter.native="handleQuery"
				/>
			</el-form-item>
			<el-form-item label="推文属性" prop="tweetCommonFlag">
				<el-select v-model="queryParams.tweetCommonFlag" placeholder="公共/私有" clearable>
					<el-option
							v-for="dict in tweetCommonFlags"
							:key="dict.value"
							:label="dict.label"
							:value="dict.value"
					/>
				</el-select>
			</el-form-item>
			<el-form-item label="创建人" prop="createBy">
				<el-input
						v-model="queryParams.createBy"
						placeholder="请输入用户名"
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
						v-hasPermi="['system:productionTweet:add']"
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
						v-hasPermi="['system:productionTweet:edit']"
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
						@click="handleDeletes"
						v-hasPermi="['system:productionTweet:remove']"
				>删除
				</el-button>
			</el-col>
			<!--      <el-col :span="1.5">-->
			<!--        <el-button-->
			<!--          type="danger"-->
			<!--          plain-->
			<!--          icon="el-icon-delete"-->
			<!--          size="mini"-->
			<!--          :disabled="multiple"-->
			<!--          @click="test"-->
			<!--        >测试-->
			<!--        </el-button>-->
			<!--      </el-col>-->
			<right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
		</el-row>
		<!--列表-->
		<el-table ref="tweetTable" v-loading="loading" :data="tweetList" @selection-change="handleSelectionChange" @sort-change="handleSortChange">
			<el-table-column type="selection" min-width="50px" align="center"/>
			<!--      <el-table-column label="推文编码" prop="tweetId" align="center"/>-->
			<el-table-column label="推文编号" prop="tweetId" min-width="100px" header-align="center" align="center" sortable="custom" :sort-orders="['descending', 'ascending']"/>
			<el-table-column label="推文来源" prop="organizationName" min-width="200px" header-align="center" align="center" sortable="custom" :sort-orders="['descending', 'ascending']"/>
			<el-table-column label="推文标题" prop="tweetTitle" min-width="200px" header-align="center" align="left" sortable="custom" :sort-orders="['descending', 'ascending']"/>
			<!--      <el-table-column label="推文编码" prop="tweetCode" align="center" width="275px"/>-->
			<el-table-column label="推文属性" prop="tweetCommonFlag" min-width="100px" header-align="center" align="center" sortable="custom" :sort-orders="['descending', 'ascending']">
				<template slot-scope="{ row }">
					<span v-if=" row.tweetCommonFlag=='0'">私有</span>
					<span v-if=" row.tweetCommonFlag=='1'">公共</span>
				</template>
			</el-table-column>
			<el-table-column label="创建人" prop="createBy" min-width="150px" header-align="center" align="center" sortable="custom" :sort-orders="['descending', 'ascending']"/>
			<el-table-column label="创建时间" prop="createTime" min-width="175px" header-align="center" align="center" sortable="custom" :sort-orders="['descending', 'ascending']"/>
			<!--      <el-table-column label="分配渠道" prop="createTime" align="center"/>-->
			<el-table-column label="渠道入库" prop="channelStatus" min-width="100px" header-align="center" align="center" sortable="custom" :sort-orders="['descending', 'ascending']">
				<template slot-scope="{ row }">
					<span v-if=" row.channelStatus=='0'">出库</span>
					<span v-if=" row.channelStatus=='1'">入库</span>
				</template>
			</el-table-column>
			<!--      <el-table-column label="上架状态" prop="usingFlag" align="center">-->
			<!--        <template slot-scope="{ row }">-->
			<!--          <span v-if=" row.usingFlag=='0'">上架</span>-->
			<!--          <span v-if=" row.usingFlag=='1'">下架</span>-->
			<!--        </template>-->
			<!--      </el-table-column>-->
			<!--      <el-table-column label="草稿状态" prop="createTime" align="center">-->
			<!--        <template slot-scope="{ row }">-->
			<!--          <span v-if=" row.isDraft=='0'">非草稿</span>-->
			<!--          <span v-if=" row.isDraft=='1'">草稿</span>-->
			<!--        </template>-->
			<!--      </el-table-column>-->
			<el-table-column label="操作" align="center" class-name="small-padding fixed-width" min-width="250px">
				<template slot-scope="scope">
					<el-button
							size="mini"
							type="text"
							icon="el-icon-document"
							@click="handleTweetPreview(scope.row)"
					>预览
					</el-button>
					<el-button
							size="mini"
							type="text"
							icon="el-icon-edit"
							@click="handleUpdate(scope.row)"
							v-if="scope.row.organizationId == organizationId"
							v-hasPermi="['system:productionTweet:edit']"
					>修改
					</el-button>
					<el-button
							size="mini"
							type="text"
							icon="el-icon-edit"
							@click="peizhi_edit(scope.row)"
							v-if="scope.row.organizationId == organizationId"
							v-hasPermi="['system:productionTweet:edit']"
					>配置修改
					</el-button>
					<el-button
							size="mini"
							type="text"
							icon="el-icon-delete"
							@click="handleDelete(scope.row)"
							v-if="scope.row.organizationId == organizationId"
							v-hasPermi="['system:productionTweet:remove']"
					>删除
					</el-button>
					<el-button
							size="mini"
							type="text"
							icon="el-icon-edit"
							@click="channelOut(scope.row)"
							v-if="scope.row.channelStatus=='1' && scope.row.organizationId == organizationId"
					>出库
					</el-button>
					<el-button
							size="mini"
							type="text"
							icon="el-icon-edit"
							@click="channelJoin(scope.row)"
							v-if="scope.row.channelStatus=='0' && scope.row.organizationId == organizationId"
					>入库
					</el-button>
					<!-- <el-dropdown size="mini" @command="(command) => handleCommand(command, scope.row)"
					             v-if="scope.row.channelStatus=='0' && scope.row.organizationId == organizationId">
						<el-button size="mini" type="text" icon="el-icon-d-arrow-right">更多</el-button>
						<el-dropdown-menu slot="dropdown">
							<el-dropdown-item command="handleUpdateImg" icon="" v-if="scope.row.channelStatus=='0' && scope.row.organizationId == organizationId">更换头图</el-dropdown-item>
						</el-dropdown-menu>
					</el-dropdown> -->
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
		<!-- 预览对话框 -->
		<el-dialog custom-class="tweet-preview-dialog" title="推文预览" :visible.sync="tweetPreview" width="1200px" append-to-body :close-on-click-modal="false" :show-close="false" :close-on-press-escape="false">
			<div style="min-height: 580px">
				<tweet-preview v-if="tweetPreview" ref="tweetPreview"></tweet-preview>
			</div>
			<div slot="footer" class="dialog-footer">
				<el-button @click="tweetPreview=false">取 消</el-button>
			</div>
		</el-dialog>
		<!-- 配置修改 -->
		<el-dialog custom-class="tweet-preview-dialog" title="配置修改" :visible.sync="peizhi_edit_ashow" width="750px" append-to-body :close-on-click-modal="false" :show-close="false" :close-on-press-escape="false" >
			<div style="min-height: 65vh;overflow: scroll;height: 65vh;overflow-x: hidden;display: flex;" class="messageCard">
				<div>
					<el-row class="center-board-row" :gutter="15">
						<el-form label-width="110px" ref="ruleForm" :model="ruleForm" :rules="rules" >
							 <!-- prop="tweetTitle" -->
							<el-form-item label="推文标题" style="padding: 5px !important;" v-if='ruleForm.tweetTitle'>
								<el-input v-model="ruleForm.tweetTitle"></el-input>
							</el-form-item>
							<el-form-item label="公共推文" v-hasPermi="['system:productionTweet:commonFlag']"
								style="padding: 5px !important;">
								<el-switch v-model="ruleForm.tweetCommonFlag"></el-switch>
							</el-form-item>
							<div style="padding:0 10px;" v-if="ruleForm.tweetCommonFlag==true">
								<el-button @click="organizationAddDialogOpen" style="font-size: 14px;margin-bottom: 10px;"
									v-if="ruleForm.tweetCommonFlag==true">新增组织关系</el-button>
								<el-table v-loading="loading" :data="organizationAllocated.list"
									v-if="ruleForm.tweetCommonFlag==true">
									<el-table-column label="组织编号" prop="organizationId" align="center"
										width="140" />
									<el-table-column label="组织名称" prop="organizationName"
										width="180" />
									<el-table-column label="所属部门" prop="deptName"
										align="center" width="180" />
									<el-table-column label="操作" align="center" width="180"
										class-name="small-padding fixed-width">
										<template slot-scope="scope">
											<el-button size="mini" type="text" icon="el-icon-delete"
												@click="organizationAllocatedDel(scope.row)">删除
											</el-button>
										</template>
									</el-table-column>
								</el-table>
							</div>
							<!-- 图片 -->
							<div style="height: 20px;"></div>
							<el-form-item label="管理端头图" style="padding: 5px !important;" prop="sysImgId">
								<div style="width: 120px;height:120px;display: flex;align-items: center;justify-content: center;border: 1px solid #f5f5f5;">
									<el-upload class="avatar-uploader" :action="upload.url"
									           :headers="upload.headers" :data="upload.data"
									           :show-file-list="false"
									           :on-success="(res,file)=>handleAvatarSuccess(res,file,'PRODUCTION_TWEET_SYS_IMG')"
									           :before-upload="(file)=>beforeAvatarUpload(file,'PRODUCTION_TWEET_SYS_IMG')">
										<img  style="max-width: 120px;max-height: 120px;"
										     v-if="sysImg.fileVirtualPath" :src="sysImg.fileVirtualPath"
										     class="avatar">
										<i v-else class="el-icon-plus avatar-uploader-icon"
										   style="width: 120px;height:120px;display: flex;align-items: center;justify-content: center;border: 1px solid #f5f5f5;"></i>
									</el-upload>
								</div>
							</el-form-item>
							
							<!--微信端展示图-->
							<el-form-item label="微信端头图" style="padding: 5px !important;" prop="wxImgId">
								<div style="width: 120px;height:120px;display: flex;align-items: center;justify-content: center;border: 1px solid #f5f5f5;">
									<el-upload class="avatar-uploader" :action="upload.url"
									           :headers="upload.headers" :data="upload.data"
									           :show-file-list="false"
									           :on-success="(res,file)=>handleAvatarSuccess(res,file,'PRODUCTION_TWEET_WX_IMG')"
									           :before-upload="(file)=>beforeAvatarUpload(file,'PRODUCTION_TWEET_WX_IMG')">
										<img  style="max-width: 120px;max-height: 120px;"
										     v-if="wxImg.fileVirtualPath" :src="wxImg.fileVirtualPath"
										     class="avatar">
										<i v-else class="el-icon-plus avatar-uploader-icon"
										   style="width: 120px;height:120px;display: flex;align-items: center;justify-content: center;border: 1px solid #f5f5f5;"></i>
									</el-upload>
								</div>
							</el-form-item>
							
							<!--朋友圈展示图-->
							<el-form-item label="朋友圈海报" style="padding: 5px !important;" prop="pyqImgId">
								<div style="width: 120px;max-height:120px;;display: flex;align-items: center;justify-content: center;border: 1px solid #f5f5f5;">
									<el-upload class="avatar-uploader" :action="upload.url"
									           :headers="upload.headers" :data="upload.data"
									           :show-file-list="false"
									           :on-success="(res,file)=>handleAvatarSuccess(res,file,'PRODUCTION_TWEET_PYQ_IMG')"
									           :before-upload="(file)=>beforeAvatarUpload(file,'PRODUCTION_TWEET_PYQ_IMG')">
										<img  style="max-width: 120px;max-height: 120px;display: flex;align-items: center;"
										     v-if="pyqImg.fileVirtualPath" :src="pyqImg.fileVirtualPath"
										     class="avatar">
										<i v-else class="el-icon-plus avatar-uploader-icon"
										   style="width: 120px;height:120px;display: flex;align-items: center;justify-content: center;border: 1px solid #f5f5f5;"></i>
									</el-upload>
								</div>
							</el-form-item>
							
							<!-- 分享 -->
							<el-form-item label="分发组件配置" style="padding: 5px !important;" prop="shareButtonArray">
								<div class="row" style="width:100%">
									<div class="span24-12 d-flex a-center flex-column">
										<div>好友</div>
										<el-checkbox-group v-model="ruleForm.shareButtonArray"
											style="margin-right: 5px;">
											<el-checkbox v-for="dict in dict.type.tweet_share_button"
												:key="dict.value" :label="dict.value"
												v-if="dict.label == '分享好友-小程序' || dict.label == '分享好友-小程序海报' || dict.label == '分享好友-小程序码' || dict.label == '分享好友-链接' || dict.label == '分享好友-链接海报' || dict.label == '分享好友-链接码'">
												{{dict.label}}
											</el-checkbox>
										</el-checkbox-group>
									</div>
									<div class="span24-12 d-flex a-center flex-column">
										<div>文案/话术</div>
										<el-checkbox-group v-model="ruleForm.shareButtonArray"
											style="margin-right: 5px;">
											<el-checkbox v-for="dict in dict.type.tweet_share_button"
												:key="dict.value" :label="dict.value"
												v-if="dict.label == '分享文案' || dict.label == '销售话术'">
												{{dict.label}}
											</el-checkbox>
										</el-checkbox-group>
									</div>
								</div>
							</el-form-item>
							
							<!-- 文案 -->
							<el-form-item label="分享文案" style="padding: 0 5px !important;" prop="shareText">
								<el-input type="textarea" :autosize={minRows:3}
									v-model="ruleForm.shareText"></el-input>
							</el-form-item>
							
							<el-form-item label="销售话术" v-if="ruleForm.shareButtonArray.includes('sale')"
								style="padding: 0 5px !important;" prop="saleText">
								<el-input type="textarea" :autosize={minRows:3}
									v-model="ruleForm.saleText"></el-input>
							</el-form-item>
							
						</el-form>
					</el-row>
				</div>
				<div style="width: 20px;"></div>
			</div>
			<div slot="footer" class="dialog-footer">
				<el-button @click="peizhi_edit_ashow = false">取 消</el-button>
				<el-button type="primary" @click="edit_submit">确 定</el-button>
			</div>
		</el-dialog>
		
		<el-dialog title="待选组织关系列表" :visible.sync="organizationUnallocated.open" class="dsgxDialog" width="55%"
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
				<el-button type="primary" @click="addOrganization">添加</el-button>
			</span>
		</el-dialog>
		
		<!--	  推文图 管理端头图 微信端头图 朋友圈海报-->
		<el-dialog title="更换头图" :visible.sync="tweetImgOpen" width="850px" append-to-body :close-on-click-modal="false" :show-close="false" :close-on-press-escape="false">
			<el-form ref="tweetFrom"  label-width="150px">
				<el-form-item label="管理端头图" style="padding: 5px !important;" prop="sysImgId">
					<div style="width: 120px;height:120px;display: flex;align-items: center;justify-content: center;border: 1px solid #f5f5f5;">
						<el-upload class="avatar-uploader" :action="upload.url"
						           :headers="upload.headers" :data="upload.data"
						           :show-file-list="false"
						           :on-success="(res,file)=>handleAvatarSuccess(res,file,'PRODUCTION_TWEET_SYS_IMG')"
						           :before-upload="(file)=>beforeAvatarUpload(file,'PRODUCTION_TWEET_SYS_IMG')">
							<img style="width: 120px;height: 120px;"
							     v-if="sysImg.fileVirtualPath" :src="sysImg.fileVirtualPath"
							     class="avatar">
							<i v-else class="el-icon-plus avatar-uploader-icon"
							   style="width: 120px;height:120px;display: flex;align-items: center;justify-content: center;border: 1px solid #f5f5f5;"></i>
						</el-upload>
					</div>
				</el-form-item>

				<!--微信端展示图-->
				<el-form-item label="微信端头图" style="padding: 5px !important;" prop="wxImgId">
					<div style="width: 120px;height:120px;display: flex;align-items: center;justify-content: center;border: 1px solid #f5f5f5;">
						<el-upload class="avatar-uploader" :action="upload.url"
						           :headers="upload.headers" :data="upload.data"
						           :show-file-list="false"
						           :on-success="(res,file)=>handleAvatarSuccess(res,file,'PRODUCTION_TWEET_WX_IMG')"
						           :before-upload="(file)=>beforeAvatarUpload(file,'PRODUCTION_TWEET_WX_IMG')">
							<img style="width: 120px;height: 120px;"
							     v-if="wxImg.fileVirtualPath" :src="wxImg.fileVirtualPath"
							     class="avatar">
							<i v-else class="el-icon-plus avatar-uploader-icon"
							   style="width: 120px;height:120px;display: flex;align-items: center;justify-content: center;border: 1px solid #f5f5f5;"></i>
						</el-upload>
					</div>
				</el-form-item>

				<!--朋友圈展示图-->
				<el-form-item label="朋友圈海报" style="padding: 5px !important;" prop="pyqImgId">
					<div style="width: 120px;height:120px;display: flex;align-items: center;justify-content: center;border: 1px solid #f5f5f5;">
						<el-upload class="avatar-uploader" :action="upload.url"
						           :headers="upload.headers" :data="upload.data"
						           :show-file-list="false"
						           :on-success="(res,file)=>handleAvatarSuccess(res,file,'PRODUCTION_TWEET_PYQ_IMG')"
						           :before-upload="(file)=>beforeAvatarUpload(file,'PRODUCTION_TWEET_PYQ_IMG')">
							<img style="width: 120px;height: 120px;"
							     v-if="pyqImg.fileVirtualPath" :src="pyqImg.fileVirtualPath"
							     class="avatar">
							<i v-else class="el-icon-plus avatar-uploader-icon"
							   style="width: 120px;height:120px;display: flex;align-items: center;justify-content: center;border: 1px solid #f5f5f5;"></i>
						</el-upload>
					</div>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button type="primary" @click="tweetUpdate">保 存</el-button>
				<el-button @click="tweetCancel">取 消</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>


import {changeChannelStatus, imgUpdeteByTweetId, tweetInfo, tweetList, tweetRemove, tweetRemoves, tweetEditInfo, tweetUpdateInfo} from '../../../api/system/production/tweet'
import {
		unallocatedOrganizationList,
	} from '../../../api/tool/tweetArticle.js'
import {MessageBox} from 'element-ui'

import tweetPreview from '@/components/tweet/tweetPreview.vue'
import {getToken} from '@/utils/auth'

export default {
	components: {tweetPreview},
	name: 'productionTweet',
	dicts: ['tweet_share_button'],
	data() {
		return {
			canvasSize:'',
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
			
			organizationAllocated: {
				ids: [],
				open: false,
				total: 0,
				queryParams: {
					pageNum: 1,
					pageSize: 10,
					tweetId: undefined
				},
				list: []
			},
			detaile_tweet:'',
			ruleForm: {
				tweetTitle: '',
				shareButton: '',
				shareButtonArray: ['pyq', 'wx', 'wxcode', 'wximg', 'share', 'sale'],
				pyqText: '',
				shareText: '',
				saleText: '',
				tweetText: '',
				tweetCommonFlag: false,
				channelStatus: false,
				sysImgId: undefined,
				wxImgId: undefined,
				pyqImgId: undefined,
				tsyImg: undefined,
				tsyImgId: undefined,
			},
			rules: {
				tweetTitle: [{
						required: true,
						message: '请输入推文标题',
						trigger: 'blur'
					},
					{
						min: 2,
						max: 60,
						message: '长度在 2 到 60 个字符',
						trigger: 'blur'
					}
				],
				skipUrl: [{
						required: true,
						message: '请输入跳转链接',
						trigger: 'blur'
					},
					{
						pattern: /(https?:\/\/)?(([0-9a-z.]+\.[a-z]+)|(([0-9]{1,3}\.){3}[0-9]{1,3}))(:[0-9]+)?(\/[0-9a-z%/.\-_]*)?(\?[0-9a-z=&%_\-]*)?(\#[0-9a-z=&%_\-]*)?/ig,
						message: '请输入正确的跳转链接',
						trigger: 'change'
					}
				]
			},
			organizationId: undefined,
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
				tweetTitle: '',
				isDraft: '',
				tweetCode: '',
				organizationId: undefined,
				tweetCommonFlag: '',
				createBy: '',
				orderByColumn: '',
				isAsc: ''
			},
			//推文列表
			tweetList: [],
			// 总条数
			total: 0,
			// 选中数组
			ids: [],
			isDraftArr: [
				{
					value: '0',
					label: '非草稿'
				},
				{
					value: '1',
					label: '草稿'
				}
			],
			tweetCommonFlags: [
				{
					value: '0',
					label: '私有'
				},
				{
					value: '1',
					label: '公共'
				}
			],
			//推文预览
			tweetPreview: false,
			peizhi_edit_ashow:false,//配置修改
			tweetObj:{},
			tweetImgOpen:false,
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
			sysImg: {
				fileId: undefined,
				fileOriginalName: '',
				fileVirtualPath: ''
			},
			wxImg: {
				fileId: undefined,
				fileOriginalName: '',
				fileVirtualPath: ''
			},
			pyqImg: {
				fileId: undefined,
				fileOriginalName: '',
				fileVirtualPath: ''
			}
		}
	},
	created() {
		this.getList()
		this.organizationId = sessionStorage.getItem('organizationId')
	},
	activated() {
		this.getList()
		this.organizationId = sessionStorage.getItem('organizationId')
	},
	methods: {
		// 配置修改提交
		edit_submit(){
			let data = {
				tweetTitle: this.ruleForm.tweetTitle,
				shareButton: this.ruleForm.shareButtonArray.join(","),
				pyqText: this.ruleForm.pyqText,
				shareText: this.ruleForm.shareText,
				saleText: this.ruleForm.saleText,
				tweetText: this.ruleForm.tweetText,
				canvasSize: this.canvasSize,
				channelStatus: this.ruleForm.channelStatus == true ? 1 : 0,
				tweetCommonFlag: this.ruleForm.tweetCommonFlag == true ? '1' : '0',
				organizationId: sessionStorage.getItem('organizationId') || '',
				deptId: this.deptId,
				containers: this.drawingList,
				showElems: this.showElems,
				tweetId: this.tweetId,
				wxImgId: this.ruleForm.wxImgId,
				sysImgId: this.ruleForm.sysImgId,
				pyqImgId: this.ruleForm.pyqImgId,
				allocatedOrganization: this.organizationAllocated.list
			}
			// console.log(data,'data-------1111');
			// return
			tweetEditInfo(data).then(res=>{
				console.log(res,'res====12345')
				if(res.code == 200){
					this.peizhi_edit_ashow = false
					this.$message.success('修改成功')
					this.getList()
				}
			})
			
			
		},
		getRowKeys(row) {
			return row.organizationId
		},
		// 新增组织关系框
		organizationAddDialogOpen() {
			this.organizationUnallocated.ids = []
			this.organizationUnallocated.open = true
			this.organizationUnallocated.queryParams.organizationId = undefined
			this.organizationUnallocated.queryParams.organizationName = ''
			this.getOrganizationUnallocatedList()
		},
		// 新增组织关系框
		organizationAddDialogClose() {
			this.organizationUnallocated.open = false
		},
		// 待选组织关系数据
		getOrganizationUnallocatedList() {
			console.log('organizationAllocated',this.organizationAllocated)
			this.loading = true
			//清空并获取所有加入公共推文的组织id
			this.organizationUnallocated.queryParams.allocatedOrganizationIds = []
			for (let i = 0; i < this.organizationAllocated.list.length; i++) {
				this.organizationUnallocated.queryParams.allocatedOrganizationIds.push(this.organizationAllocated.list[
					i].organizationId)
			}
			this.organizationUnallocated.queryParams.tweetId = this.$route.query.t
			unallocatedOrganizationList(this.addDateRange(this.organizationUnallocated.queryParams, [])).then(
				response => {
					this.organizationUnallocated.list = response.data
					this.loading = false
				})
		},
		//添加组织关系
		addOrganization() {
			if (this.organizationUnallocated.ids) {
				console.log(1111111,this.organizationUnallocated.ids);
				for (let i = 0; i < this.organizationUnallocated.ids.length; i++) {
					console.log(22222);
					for (let j = 0; j < this.organizationUnallocated.list.length; j++) {
						console.log(3333333);
						console.log(this.organizationUnallocated.ids[i])
						console.log(this.organizationUnallocated.list[i].organizationId)
						if (this.organizationUnallocated.ids[i] == this.organizationUnallocated.list[j]
							.organizationId) {
								console.log(444444);
							this.organizationAllocated.list.push(this.organizationUnallocated.list[j])
							console.log(123);
							break;
						}
					}
				}
				this.organizationUnallocated.open = false
				this.$refs.organizationUnallocatedTable.clearSelection()
				console.log(this.organizationAllocated.list, ".......已选")
			} else {
				this.$modal.msgWarning('请选择要添加的组织')
			}
		},
		handleSelectionChangeEdit(selection) {
			this.organizationUnallocated.ids = selection.map(item => item.organizationId)
			console.log(this.organizationUnallocated.ids,'this.organizationUnallocated.ids-----');
		},
		//组织关系id删除
		organizationAllocatedDel(row) {
			for (let i = 0; i < this.organizationAllocated.list.length; i++) {
				if (this.organizationAllocated.list[i].organizationId == row.organizationId) {
					this.organizationAllocated.list.splice(i, 1)
				}
			}
			console.log(this.organizationAllocated.list, "................this.organizationAllocated.list")
		},
		/** 排序触发事件 */
		handleSortChange(column, prop, order) {
			this.queryParams.orderByColumn = column.prop;
			this.queryParams.isAsc = column.order;
			this.getList();
		},
		// 搜索按钮操作
		handleQuery() {
			this.queryParams.pageNum = 1
			this.getList()
		},
		// 重置搜索按钮操作
		resetQuery() {
			this.dateRange = []
			this.queryParams.tweetId = ''
			this.queryParams.tweetTitle = ''
			this.queryParams.tweetCode = ''
			this.queryParams.tweetCommonFlag = ''
			this.queryParams.isDraft = ''
			this.queryParams.createBy = ''
			this.queryParams.orderByColumn = ''
			this.queryParams.isAsc = ''
			this.resetForm('queryForm')
			this.handleQuery()
			this.$nextTick(() => {
				this.$refs.tweetTable.clearSort()
				let columns = this.$refs.tweetTable.columns;
				columns.forEach((column) => {
					if (column.sortable == 'custom') {
						column.order = undefined;
						column.multiOrder = undefined;
					}
				});
			})
		},
		// 列表
		getList() {
			  if(this.queryParams.tweetId !=null && this.queryParams.tweetId !=undefined && this.queryParams.tweetId !=''){
				if(!(!isNaN(parseFloat(this.queryParams.tweetId)) && isFinite(this.queryParams.tweetId))){
				  this.$modal.msgError('推文编号请填写数字')
				  return
				}
			  }
			this.loading = true
			this.queryParams.organizationId = sessionStorage.getItem('organizationId')
			tweetList(this.addDateRange(this.queryParams, this.dateRange)).then(response => {
				this.tweetList = response.rows
				this.total = response.total
				this.loading = false
			})
		},
		// 多选框选中数据
		handleSelectionChange(selection) {
			this.ids = selection.map(item => item.tweetId)
			this.single = selection.length != 1
			this.multiple = !selection.length
		},
		// 新增按钮
		handleAdd() {
			let params = {}
			this.$router.push({
				path: '/sqh/production/tweetArticle', query: params
			})
		},
		// 修改按钮
		handleUpdate(row) {
			const tweetId = row.tweetId || this.ids[0]
			let params = {
				t: tweetId
			}
			this.$modal.confirm('修改会影响已入库推文，请确认！').then(function () {
			}).then(() => {
				this.$router.push({
					path: '/sqh/production/tweetArticle', query: params
				})
			}).catch(() => {
			})
		},
		channelJoin(row) {
			let params = {
				tweetId: row.tweetId,
				channelStatus: '1'
			}
			this.$modal.confirm('选择后推文派送到渠道库，请确认！').then(function () {
			}).then(() => {
				//todo 入库接口
				changeChannelStatus(params).then(response => {
					this.getList()
				})
				this.$modal.msgSuccess('入库成功')
			}).catch((e) => {
				console.log(e)
			})

		},
		channelOut(row) {
			let params = {
				tweetId: row.tweetId,
				channelStatus: '0'
			}
			let content = "选择后导致渠道中心产品出库，且全部渠道状态改成下架"
			MessageBox.confirm(content, "警告", {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: "warning",
			}).then(() => {
				// todo 出库接口
				changeChannelStatus(params).then(response => {
					this.getList()
				})
				this.$modal.msgSuccess('出库成功')
			})

		},
		// 删除按钮
		handleDelete(row) {
			let params = {
				tweetId: row.tweetId
			}
			this.$modal.confirm('删除会影响已入库的推文，请确认！').then(function () {
				return tweetRemove(params)
			}).then(() => {
				this.getList()
				this.$modal.msgSuccess('删除成功')
			}).catch((e) => {
				console.log(e)
			})
		},
		// 批量删除按钮
		handleDeletes() {
			let params = {
				tweetIds: this.ids
			}
			this.$modal.confirm('删除会影响已入库的推文，请确认').then(function () {
				return tweetRemoves(params)
			}).then(() => {
				this.getList()
				this.$modal.msgSuccess('删除成功')
			}).catch(() => {
				console.log(e)
			})
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
		// 推文预览
		peizhi_edit(row) {
			console.log(row,'row-----123');
			this.peizhi_edit_ashow = true
			let data = {
			  tweetId: row.tweetId
			};
			tweetUpdateInfo(data).then(res=>{
				if(res.code == 200){
					console.log(res,'res');
					this.detaile_tweet = res.data
					this.ruleForm.tweetCommonFlag = res.data.tweetCommonFlag == '0' ? false : true
					this.organizationAllocated.list = res.data.allocatedOrganization||[]
					
					if(res.data.sysImg!=null){
						this.sysImg = res.data.sysImg
						this.ruleForm.sysImgId = this.sysImg.fileId
					}
					if(res.data.wxImg!=null){
						this.wxImg = res.data.wxImg
						this.ruleForm.wxImgId = this.wxImg.fileId
					}
					if(res.data.pyqImg!=null){
						this.pyqImg = res.data.pyqImg
						this.ruleForm.pyqImgId = this.pyqImg.fileId
					}
					
					this.tweetBackgroundId = res.data.tweetBackgroundId
					this.ruleForm.channelStatus = res.data.channelStatus
								
					if(res.data.canvasSize){
						this.canvasSize = res.data.canvasSize - 0
					} else {
						this.canvasSize = 526 - 0
					}
					this.ruleText = res.data.ruleText
					this.ruleType = res.data.ruleType
					this.tweetId = res.data.tweetId
					this.ruleForm.tweetTitle = res.data.tweetTitle
					
					this.drawingList = res.data.containers
					this.showElems = res.data.showElems
					
					this.ruleForm.tweetCommonFlag = res.data.tweetCommonFlag == '0' ? false : true
					this.ruleForm.tweetTitle = res.data.tweetTitle
					this.ruleForm.shareButton = res.data.shareButton
					this.ruleForm.shareButtonArray = res.data.shareButton != null ? res.data.shareButton.split(
						",") : ['pyq', 'wx', 'wxcode', 'wximg', 'share', 'sale']
					this.ruleForm.pyqText = res.data.pyqText
					this.ruleForm.shareText = res.data.shareText
					this.ruleForm.saleText = res.data.saleText
					this.ruleForm.tweetText = res.data.tweetText
					if (res.data.tweetCommonFlag == '1') {
						this.organizationAllocated.list = []
						this.organizationAllocated.list = res.data.allocatedOrganization||[]
					}
				}
				
			})
		},
		// 更多操作触发
		handleCommand(command, row) {
			switch (command) {
				case 'handleUpdateImg':
					this.openTweetImg(row);
					break
				default:
					break
			}
		},
		openTweetImg(row) {
			this.tweetObj = row
			let params = {
				tweetId: row.tweetId
			}
			tweetInfo(params).then(response => {
				let tweet = response.data
				console.log(tweet, "........tweet")
				if(tweet.sysImg!=null){
					this.sysImg = tweet.sysImg
				}
				if(tweet.wxImg!=null){
					this.wxImg = tweet.wxImg
				}
				if(tweet.pyqImg!=null){
					this.pyqImg = tweet.pyqImg
				}
				this.tweetImgOpen = true
			})
		},
		tweetUpdate() {
			let params = {
				organizationId:this.organizationId,
				tweetId:this.tweetObj.tweetId,
				sysImgId: this.sysImg.fileId,
				wxImgId: this.wxImg.fileId,
				pyqImgId: this.pyqImg.fileId,
			}
			imgUpdeteByTweetId(params).then(response => {
				this.$modal.msgSuccess('修改成功')
				this.tweetImgOpen = false
			})
		},
		tweetCancel() {
			this.tweetObj = {}
			this.sysImg.fileId=undefined
			this.sysImg.fileOriginalName = ""
			this.sysImg.fileVirtsysImgualPath = ""
			this.wxImg.fileId=undefined
			this.wxImg.fileOriginalName = ""
			this.wxImg.fileVirtualPath = ""
			this.pyqImg.fileId=undefined
			this.pyqImg.fileOrigpyqImginalName = ""
			this.pyqImg.fileVirtualPath = ""
			this.tweetImgOpen = false
		},
		//展示图 文件上传
		handleAvatarSuccess(res, file, source, item) {
			// this.imageUrl = URL.createObjectURL(file.raw);
			if (source == 'PRODUCTION_TWEET_SYS_IMG') {
				this.sysImg = res.data
				this.ruleForm.sysImgId = res.data.fileId
			} else if (source == 'PRODUCTION_TWEET_WX_IMG') {
				this.wxImg = res.data
				this.ruleForm.wxImgId = res.data.fileId
			} else if (source == 'PRODUCTION_TWEET_PYQ_IMG') {
				this.pyqImg = res.data
				this.ruleForm.pyqImgId = res.data.fileId
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
	}
}
</script>

<style scoped>
	.tweet-preview-dialog .el-dialog__body{
		padding: 10px 20px;
	}
	::v-deep .el-upload{
		height: 120px !important;
		align-items: center !important;
		display: flex !important;
		justify-content: center !important;
	}
	.avatar-uploader{
		height: 120px;
		align-items: center !important;
		display: flex !important;
		justify-content: center !important;
	}
	
	.messageCard {
		overflow-y: scroll;
	}
	
	.messageCard::-webkit-scrollbar {
		width: 5px !important;
	}
	
	.messageCard::-webkit-scrollbar-thumb {
		border-radius: 10px;
		width: 50px !important;
		/* background: rgba(0,0,0,0.2); */
		background: #dddee0;
	}
	
	.messageCard::-webkit-scrollbar-track {
		border-radius: 0;
		width: 5px !important;
		/* background: rgba(0,0,0,0.1); */
	}
</style>
<style lang="scss">
  .dsgxDialog{
		.el-table__header, .el-table__body, .el-table__footer{
			width: 100% !important;
		}
	}
</style>