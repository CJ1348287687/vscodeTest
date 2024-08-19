<template>
	<div class="app-container">
		<el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch">
			<el-form-item label="图库标题" prop="imageTitle">
				<el-input v-model="queryParams.imageTitle" placeholder="请输入图库标题" clearable
					@keyup.enter.native="handleQuery" />
			</el-form-item>
			<el-form-item label="创建时间">
				<el-date-picker v-model="dateRange" style="width: 240px" value-format="yyyy-MM-dd HH:mm:ss" type="daterange" :default-time="['00:00:00', '23:59:59']"
					range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
				<el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
			</el-form-item>
		</el-form>
		<el-row :gutter="10" class="mb8">
			<el-col :span="1.5">
				<el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd"
					v-hasPermi="['system:mediaImage:add']">新增
				</el-button>
			</el-col>
			<right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
		</el-row>

		<div style="overflow-y: auto;">
			<div class="media-content row">
				<div class="media-item span24-4_5" v-for="(item,index) in imageList" :key="index">
					<div
						style="height: 200px;display: flex;align-items: center;justify-content: center;width:100%;border: solid 1px rgb(245, 245, 245);">
						<img class="media-img" style="max-height: 200px;max-width:100%"
							:src="item.compressionFile.fileVirtualPath"
							@click="handlePictureCardPreview(item.compressionFile.fileVirtualPath)">
					</div>

					<div>
						<div class="media-file-name" style="font-size: 12px;margin-left: 4px;text-align: center">
							{{ item.imageTitle }}
						</div>
						<div style="text-align: center;margin-top: 10px">
							<el-button type="primary" icon="el-icon-edit" title="编辑" circle size="mini"
								@click="handleUpdate(item)" v-hasPermi="['system:mediaImage:edit']"></el-button>
							<el-button type="primary" icon="el-icon-notebook-1" title="日志" circle size="mini"
								@click="logOpen(item)" v-hasPermi="['system:mediaImage:logList']"></el-button>
							<el-button type="primary" icon="el-icon-upload2" title="上架" circle size="mini"
								v-if="item.imageUsingFlag == '1'" @click="imageUsingChange(item)"
								v-hasPermi="['system:mediaImage:imageUsingChange']"></el-button>
							<el-button type="warning" icon="el-icon-download" title="下架" circle size="mini"
								v-if="item.imageUsingFlag == '0'" @click="imageUsingChange(item)"
								v-hasPermi="['system:mediaImage:imageUsingChange']"></el-button>
							<el-button type="danger" icon="el-icon-delete" title="删除" circle size="mini"
								@click="handleDelete(item)" v-hasPermi="['system:mediaImage:remove']"></el-button>
						</div>
					</div>
				</div>

			</div>
		</div>
		<!--分页工具栏-->
		<pagination v-show="total>0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
			:layout="layout" @pagination="getList" />
		<!-- 添加或修改图库标题对话框 -->
		<el-dialog :title="title" :visible.sync="open" width="850px" append-to-body :close-on-click-modal="false"
			:show-close="false" :close-on-press-escape="false">
			<el-form ref="imageForm" :model="imageForm" :rules="imageFormRules" label-width="80px">
				<el-form-item label="图库标题" prop="imageTitle">
					<el-input v-model="imageForm.imageTitle" placeholder="请输入图库标题"></el-input>
				</el-form-item>
				<el-form-item label="图库文件 " prop="fileId" v-if="imageFormStatus == 'add'">
					<el-row>
						<el-col v-if="imagePreview.url != ''">
							<img :src="imagePreview.url" style="width: 148px;height: 148px ;border:1px solid"
								@click="handlePictureCardPreview(imagePreview.url)">
							<img src="../../../assets/images/delete.png" class="imgDelete" @click="handleRemove()">
						</el-col>
					</el-row>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button type="primary" @click="imageSubmit">确 定</el-button>
				<el-button @click="imageCancel">取 消</el-button>
			</div>
		</el-dialog>
		<!--图片显示弹出层-->
		<el-dialog :visible.sync="imagePreview.visible" width="850px" height="37.5rem" append-to-body
			:close-on-click-modal="false" :close-on-press-escape="false" :show-close="true" :center="true"
			@close="imagePreviewClose">
			<img :src="imagePreview.url" class="el_dialog_img" alt="">
			<!-- width="100vh" -->
		</el-dialog>

		<el-dialog :title="batchUpload.title" :visible.sync="batchUpload.open" width="850px" append-to-body
			:close-on-click-modal="false" :show-close="false" :close-on-press-escape="false">
			<el-upload ref="upload1" class="upload-demo" action="#" drag multiple :auto-upload="true"
				:show-file-list="false" accept=".jpg,.jpeg,.png,.gif" :file-list="batchUpload.list"
				:before-upload="beforeUpload" :http-request="requestUpload" :limit="batchUpload.maxLimit"
				:on-exceed="exceedUpload">
				<i class="el-icon-upload"></i>
				<div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
				<div class="el-upload__tip" slot="tip">只能上传jpg/jpeg/png/gif文件，且不超过5MB</div>
			</el-upload>
			<div>
				<!-- <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload2">手动点击上传</el-button> -->
				<!--        <el-button v-if="batchUpload.showPercent" style="margin-left: 10px;" size="small" type="success"-->
				<!--                   @click="submitAbort"-->
				<!--        >取消后续文件上传-->
				<!--        </el-button>-->
			</div>
			<ul class="el-upload-list el-upload-list--picture" v-for="(item,index) in batchUpload.list">
				<li class="el-upload-list__item is-success">
					<img :src="item.fileVirtualPath" class="el-upload-list__item-thumbnail"
						@click="handlePictureCardPreview(item.fileVirtualPath)">
					<a class="el-upload-list__item-name">
						<i class="el-icon-document"></i>
						<input type="text" v-model="item.fileOriginalName" @mouseout="mouseout($event,index)"
							@mouseover="mouseover($event,index)" class="move_input" maxlength="50" style="">
					</a>
					<label class="el-upload-list__item-status-label">
						<i class="el-icon-upload-success el-icon-check"></i>
					</label>
					<i class="el-icon-close" @click="uploadRemove(index)"></i>
					<!--          <i class="el-icon-close-tip">按 delete 键可删除</i>-->
				</li>
			</ul>
			<div slot="footer" class="dialog-footer">
				<el-button type="primary" @click="batchUploadSubmit">确 定</el-button>
				<el-button @click="batchUploadCancel">取 消</el-button>
			</div>
		</el-dialog>

		<el-dialog :title="log.title" :visible.sync="log.open" width="850px" append-to-body
			:close-on-click-modal="false" :close-on-press-escape="false" :show-close="true" @close="logClose">
			<el-form :model="log.queryParams" ref="logQueryFrom" size="small" :inline="true" v-show="showSearch">
				<el-form-item label="操作人" prop="operName">
					<el-input v-model="log.queryParams.createBy" placeholder="请输入操作人名称" clearable
						@keyup.enter.native="logQuery" />
				</el-form-item>
				<el-form-item label="创建时间">
					<el-date-picker v-model="log.dateRange" style="width: 240px" value-format="yyyy-MM-dd HH:mm:ss"
						type="daterange" range-separator="-" start-placeholder="开始日期"
						end-placeholder="结束日期"
            :default-time="['00:00:00', '23:59:59']"></el-date-picker>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" icon="el-icon-search" size="mini" @click="logQuery">搜索</el-button>
					<!--          <el-button icon="el-icon-refresh" size="mini" @click="logQueryReset">重置</el-button>-->
				</el-form-item>
			</el-form>
			<el-table :data="log.list">
				<el-table-column label="操作人" prop="createBy" align="center" />
				<el-table-column label="操作" prop="operTitle" align="center" />
				<el-table-column label="操作时间" prop="createTime" align="center" />
			</el-table>
			<!--分页工具栏-->
			<pagination v-show="log.total>0" :total="log.total" :page.sync="log.queryParams.pageNum"
				:limit.sync="log.queryParams.pageSize" @pagination="getLogList" />
		</el-dialog>
	</div>
</template>

<script>
	import {
		imageAdd,
		imageEdit,
		imageInfo,
		imageList,
		imageLogList,
		imageRemove,
		imageRemoves,
		imageUpload,
		imageUsingChange
	} from '../../../api/system/media/image'

	export default {
		name: 'mediaImage',
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
					pageSize: 12,
					organizationId: undefined,
				},
				layout: 'total, prev, pager, next, jumper',
				//图库标题列表
				imageList: [],
				// 总条数
				total: 0,
				// 选中数组
				ids: [],
				imageForm: {
					imageId: undefined,
					imageTitle: '',
					fileId: undefined
				},
				imageFormStatus: '',
				imageFormRules: {
					imageTitle: [{
							required: true,
							message: '请输入图库标题',
							trigger: 'blur'
						},
						{
							min: 2,
							max: 20,
							message: '图库标题标题长度在 2 到 20 个字符',
							trigger: 'blur'
						}
					],
					fileId: [{
						required: true,
						message: '请上传图片',
						trigger: 'blur'
					}]
				},
				imagePreview: {
					url: '',
					visible: false
				},
				log: {
					open: false,
					title: '',
					queryParams: {
						pageNum: 1,
						pageSize: 10,
						targetId: undefined
					},
					// 日期范围
					dateRange: [],
					list: [],
					// 总条数
					total: 0
				},
				batchUpload: {
					maxLimit: 10,
					open: false,
					title: '批量上传',
					fileMaxSize: 5242880,
					fileNameSize: 50,
					list: []
				}
			}
		},
		created() {
			this.getList()
		},
		activated() {
			this.getList()
		},
		methods: {
			mouseover(e, index) {
				e.target.focus()
				e.target.style.border = '1px solid #333'
				if (this.batchUpload.list[index].fileOriginalName.length > 50) {
					this.$message.error('照片名不超过50字');
				}
			},
			mouseout(e, index) {
				e.target.blur()
				// e.target.style.border = 'none'
				if (!this.batchUpload.list[index].fileOriginalName) {
					this.$message.error('照片名不能为空');
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
				this.resetForm('queryForm')
				this.handleQuery()
			},
			// 列表
			getList() {
				this.loading = true
				this.$modal.loading('正在更新数据，请稍候...')
				this.queryParams.organizationId = sessionStorage.getItem('organizationId')
				imageList(this.addDateRange(this.queryParams, this.dateRange)).then(response => {
					this.imageList = response.rows
					this.total = response.total
					this.loading = false
					this.$modal.closeLoading()
				})
			},
			// 多选框选中数据
			handleSelectionChange(selection) {
				this.ids = selection.map(item => item.imageId)
				this.single = selection.length != 1
				this.multiple = !selection.length
			},
			// 表单重置
			reset() {
				this.imageForm = {
					imageTitle: '',
					fileId: undefined,
					organizationId: undefined
				}
				this.imagePreview.url = ''
			},
			// 新增按钮
			handleAdd() {
				// this.reset()
				// this.open = true
				// this.title = '添加图库'
				// this.disable = false
				// this.imageFormStatus = 'add'

				this.batchUpload.open = true
			},
			// 修改按钮
			handleUpdate(row) {
				this.reset()
				this.imageFormStatus = 'edit'
				this.imageForm.imageId = row.imageId
				let params = {
					imageId: this.imageForm.imageId
				}
				imageInfo(params).then(response => {
					this.imageForm.imageTitle = response.data.imageTitle
					// this.imageForm.fileId = response.data.fileId
					// this.imagePreview.url = response.data.file.fileVirtualPath
					this.open = true
				})
			},
			// 表单提交
			imageSubmit() {
				this.$refs['imageForm'].validate(valid => {
					if (valid) {
						this.$modal.loading('正在提交数据，请稍候...')
						if (this.imageForm.imageId) {
							imageEdit(this.imageForm).then(response => {
								this.$modal.msgSuccess('修改成功')
								this.open = false
								this.getList()
								this.$modal.closeLoading()
								this.reset()
							})
						} else {
							this.imageForm.organizationId = sessionStorage.getItem('organizationId')
							imageAdd(this.imageForm).then(response => {
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
			imageCancel() {
				this.reset()
				this.open = false
			},
			// 使用状态切换
			imageUsingChange(row) {
				let text = row.imageUsingFlag === '0' ? '下架' : '上架'
				let params = {
					imageId: row.imageId,
					imageUsingFlag: row.imageUsingFlag
				}
				this.$modal.confirm('确认要"' + text + '""' + row.imageTitle + '"该图库标题吗？').then(function() {
					return imageUsingChange(params)
				}).then(() => {
					this.$modal.msgSuccess(text + '成功')
					this.getList()
				}).catch(function() {
					// row.imageUsingFlag = row.imageUsingFlag === '0' ? '-1' : '0'
				})
			},
			// 图库标题删除按钮
			handleDelete(row) {
				this.reset()
				let params = {
					imageId: row.imageId
				}
				this.$modal.confirm('是否确认删除图库标题标题为"' + row.imageTitle + '"的数据项？').then(function() {
					return imageRemove(params)
				}).then(() => {
					this.getList()
					this.$modal.msgSuccess('删除成功')
				}).catch((e) => {
					console.log(e)
				})
			},
			// 图库标题批量删除按钮
			handleDeletes() {
				this.reset()
				let params = {
					imageIds: this.ids
				}
				this.$modal.confirm('是否确认删除图库标题编号为"' + this.ids + '"的数据项？').then(function() {
					return imageRemoves(params)
				}).then(() => {
					this.getList()
					this.$modal.msgSuccess('删除成功')
				}).catch(() => {
					console.log(e)
				})
			},
			// =========== 媒资日志操作 start===========
			logQuery() {
				this.log.queryParams.pageNum = 1
				this.getLogList()
			},
			logQueryReset() {
				this.log.dateRange = []
				this.resetForm('logQueryFrom')
				this.log.queryParams.targetId = undefined
				this.log.list = []
			},
			getLogList() {
				this.$modal.loading('正在更新日志数据，请稍候...')
				imageLogList(this.addDateRange(this.log.queryParams, this.log.dateRange)).then(response => {
					this.log.list = response.rows
					this.log.total = response.total
					this.$modal.closeLoading()
				})
			},
			logOpen(row) {
				this.logQueryReset()
				this.log.queryParams.targetId = row.imageId
				this.logQuery()
				this.log.open = true
			},
			logClose() {
				this.log.open = false
			},
			// =========== 媒资日志操作 end===========
			// =========== 文件相关操作 start===========
			handlePictureCardPreview(url) {
				this.imagePreview.url = url
				this.imagePreview.visible = true
			},
			imagePreviewClose() {
				this.imagePreview.visible = false
			},
			// 文件列表移除文件时的钩子
			handleRemove() {
				console.log('删除文件')
				this.imageForm.fileId = undefined
				this.imagePreview.url = ''
			},
			beforeUpload(file) {
				if (file.size > this.batchUpload.fileMaxSize) {
					setTimeout(async () => {
						await this.$message.warning(file.name + '上传文件大小不能超过 5M')
					})
					return false
				}
				if (file.name.length > this.batchUpload.fileNameSize) {
					setTimeout(async () => {
						await this.$message.warning(file.name + '上传文件名称不能超过50个字')
					})
					return false
				}
			},
			requestUpload(file) {
				console.log(file, 'file---');
				let _this = this
				this.$modal.loading('正在上传图片，请稍候...')
				let formData = new FormData()
				formData.append('file', file.file)
				imageUpload(formData).then(response => {
					console.log(response, 'response--');
					_this.batchUpload.list.push({
						fileId: response.data.fileId,
						fileOriginalName: response.data.fileOriginalName,
						fileVirtualPath: response.data.fileVirtualPath
					})
					_this.$modal.closeLoading()
				})
			},
			uploadRemove(index) {
				this.batchUpload.list.splice(index, 1)
			},
			batchUploadSubmit() {
				// console.log(this.batchUpload.list,'his.batchUpload.list00000');
				// return
				this.$modal.loading('正在提交数据，请稍候...')
				let params = {
					fileList: this.batchUpload.list,
					organizationId: sessionStorage.getItem('organizationId')
				}
				imageAdd(params).then(response => {
					this.$modal.msgSuccess('新增成功')
					this.batchUpload.open = false
					this.$modal.closeLoading()
					this.getList()
					this.batchUploadReset()
				})
			},
			batchUploadCancel() {
				this.batchUploadReset()
				this.batchUpload.open = false
			},
			batchUploadReset() {
				this.batchUpload.list = []
			},
			exceedUpload(file, fileList) {
				this.$message.warning('当前限制一次性最多上传' + this.batchUpload.maxLimit + '张图片')
			}
			// =========== 文件相关操作 end===========
		}
	}
</script>

<style scoped lang="scss">
	.media-item {
		// width: 222px;
		// height: 285px;

		border-radius: 8px;
		box-shadow: 0 2px 4px 0 rgb(122 122 122);
		padding: 10px;
		margin: 10px 5px;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
	}

	.media-content {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		width: 100%;
		height: 100%;
		overflow-y: auto;
	}

	.media-img {
		// width: 200px;
		// height: 200px;
		max-width: 200px;
		max-height: 200px;
		border-radius: 5px;
		// border: solid 1px #DEDEDE;
	}

	.media-file-name {
		width: 200px;
		height: 16px;
		font-size: 12px;
		margin-top: 5px;
		overflow: hidden;
	}

	.imgDelete {
		width: 20px;
		height: 20px;
		position: relative;
		top: -120px;
		left: -25px;
	}

	.el-upload-dragger {
		background-color: #fff;
		border: 1px dashed #d9d9d9;
		border-radius: 6px;
		-webkit-box-sizing: border-box;
		box-sizing: border-box;
		width: 800px;
		height: 180px;
		text-align: center;
		cursor: pointer;
		position: relative;
		overflow: hidden;
	}

	.move_input {
		padding: 5px;
		outline: none;
		width: 290px;
		border: 1px solid #333;
	}

	::v-deep .el-dialog__body {
		min-height: 31rem !important;
		display: flex;
		justify-items: center;
		flex-direction: column;
	}

	.el_dialog_img {
		max-height: 28rem;
		margin: auto;
		max-width: 50rem;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	::v-deep .el-upload-dragger {
		width: 50.5rem !important;
	}
</style>