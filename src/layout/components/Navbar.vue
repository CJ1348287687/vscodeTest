<template>
	<div class="navbar">
		<div class="navbar_left">
			<div class="d-flex">
				<hamburger id="hamburger-container" :is-active="sidebar.opened" class="hamburger-container"
				           @toggleClick="toggleSideBar"
				/>
				<breadcrumb id="breadcrumb-container" class="breadcrumb-container" v-if="!topNav"/>
				<top-nav id="topmenu-container" class="topmenu-container" v-if="topNav"/>
			</div>
			<div v-if="userId != '1'" style="margin: 20px 30px 0 0;">
				<el-form label-width="100px">
					<el-row :gutter="36">
						<el-col :span="12">
							<el-form-item label="当前组织" prop="status">
								<el-select v-model="organizationId" placeholder="请选择" v-loading.fullscreen.lock="fullscreenLoading"
								           @change="select_click" :filter-method="filterMethodThrottle">
									<el-option v-for="item in storeList"
									           :key="item.organizationId" :label="item.organizationName" :value="item.organizationId">
									</el-option>
								</el-select>
							</el-form-item>
						</el-col>
						<el-col :span="6">
							<el-form-item label="我的组织">
							   {{  storeList.length }}
							</el-form-item>
						</el-col>
						<el-col :span="6">
							<el-form-item label="纳管组织">
							   {{ nursingOrganizations.length }}
							</el-form-item>
						</el-col>
					</el-row>
				</el-form>
			</div>
			<div v-if="userId == '1'"></div>
		</div>


		<div class="right-menu">
			<template v-if="device!=='mobile'">
				<!--        <search id="header-search" class="right-menu-item"/>-->

				<!--        <el-tooltip content="源码地址" effect="dark" placement="bottom">-->
				<!--          <ruo-yi-git id="ruoyi-git" class="right-menu-item hover-effect"/>-->
				<!--        </el-tooltip>-->

				<!--        <el-tooltip content="文档地址" effect="dark" placement="bottom">-->
				<!--          <ruo-yi-doc id="ruoyi-doc" class="right-menu-item hover-effect"/>-->
				<!--        </el-tooltip>-->

				<screenfull id="screenfull" class="right-menu-item hover-effect"/>

				<el-tooltip content="布局大小" effect="dark" placement="bottom">
					<size-select id="size-select" class="right-menu-item hover-effect"/>
				</el-tooltip>

			</template>

			<el-dropdown class="avatar-container right-menu-item hover-effect" trigger="click">
				<div class="avatar-wrapper">
					<img :src="avatar" class="user-avatar">
					<i class="el-icon-caret-bottom"/>
				</div>
				<el-dropdown-menu slot="dropdown">
					<div style="disflex:flex;align-items: center;justify-content: center;padding: 4px;" class="d-flex a-center">{{ $store.getters.name }}</div>
					<router-link to="/user/profile">
						<el-dropdown-item>个人中心</el-dropdown-item>
					</router-link>
					<el-dropdown-item @click.native="setting = true">
						<span>布局设置</span>
					</el-dropdown-item>
					<el-dropdown-item divided @click.native="logout">
						<span>退出登录</span>
					</el-dropdown-item>
					<el-dropdown-item divided @click.native="goMessage">
						<!--            <span>消息中心</span>-->
						<!-- <el-popover
								placement="top-start"
								title="消息"
								width="200"
								trigger="hover"
								content="这是一段内容,这是一段内容,这是一段内容,这是一段内容。"
						>
							<el-button slot="reference">消息中心
								<div>{{ unReadList.length }}</div>
							</el-button>
							<el-table :data="unReadList">
								<el-table-column label="产品名" prop="consumerProductName" :show-overflow-tooltip="true"
								                 align="center"
								/>
								<el-table-column label="产品类型" prop="consumerProductType" :show-overflow-tooltip="true"
								                 align="center"
								/>
								<el-table-column label="操作" prop="consumerProductOper" :show-overflow-tooltip="true"
								                 align="center"
								/>
								<el-table-column label="消息创建人" prop="createBy" :show-overflow-tooltip="true"
								                 align="center"
								/>
							</el-table>
						</el-popover> -->
					</el-dropdown-item>
				</el-dropdown-menu>
			</el-dropdown>
		</div>

		<el-dialog title="公告" :visible.sync="notice.open" append-to-body :close-on-click-modal="true" :show-close="true" :close-on-press-escape="true">
			<el-table v-loading="notice.loading" :data="notice.list" >
				<el-table-column label="序号" align="center" prop="noticeId" width="100" />
				<el-table-column
						label="公告标题"
						align="center"
						prop="noticeTitle"
						:show-overflow-tooltip="true">
					<template slot-scope="scope">
						<div class="link-type" @click="getNoticeInfo(scope.row)">
							<span>{{scope.row.noticeTitle}}</span>
						</div>
					</template>
				</el-table-column>
				<!--      <el-table-column label="公告类型" align="center" prop="noticeType" width="100">-->
				<!--        <template slot-scope="scope">-->
				<!--          <dict-tag :options="dict.type.sys_notice_type" :value="scope.row.noticeType"/>-->
				<!--        </template>-->
				<!--      </el-table-column>-->

				<el-table-column label="创建者" align="center" prop="createBy" width="100" />
				<el-table-column label="创建时间" align="center" prop="createTime" width="100">
					<template slot-scope="scope">
						<span>{{ parseTime(scope.row.createTime, '{y}-{m}-{d}') }}</span>
					</template>
				</el-table-column>
			</el-table>

			<pagination
					v-show="notice.total>0"
					:total="notice.total"
					:page.sync="notice.queryParams.pageNum"
					:limit.sync="notice.queryParams.pageSize"
					@pagination="getNoticeList"
			/>
		</el-dialog>

		<el-dialog title="公告" :visible.sync="notice.infoOpen" append-to-body :close-on-click-modal="true" :show-close="true" :close-on-press-escape="true">
			<div v-html="notice.info.noticeContent"></div>
		</el-dialog>
	</div>


</template>

<script>
import {mapGetters} from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import TopNav from '@/components/TopNav'
import Hamburger from '@/components/Hamburger'
import Screenfull from '@/components/Screenfull'
import SizeSelect from '@/components/SizeSelect'
import Search from '@/components/HeaderSearch'
import RuoYiGit from '@/components/RuoYi/Git'
import RuoYiDoc from '@/components/RuoYi/Doc'
import {getToken} from '@/utils/auth'
import {messageUnReadList} from '../../api/system/message/message'
import {nursingOrganizations} from "../../api/system/organiaztion";
import {getNotice, listNotice} from "../../api/system/notice";

export default {
	dicts: ['sys_notice_status', 'sys_notice_type'],
	data() {
		return {
			organizationId: (sessionStorage.getItem('organizationId') - 0) || '',
			fullscreenLoading: false,
			userId: '',
			ws: {},
			unReadList: [],
			nursingOrganizations:[],
			notice:{
				open:false,
				list:[],
				total:0,
				loading:false,
				queryParams: {
					pageNum: 1,
					pageSize: 10,
					noticeTitle: undefined,
					createBy: undefined,
					status: '0',
					organizationId: undefined
				},
				infoOpen:false,
				info:{
					noticeId:undefined,
					noticeContent:''
				}
			}
		}
	},
	components: {
		Breadcrumb,
		TopNav,
		Hamburger,
		Screenfull,
		SizeSelect,
		Search,
		RuoYiGit,
		RuoYiDoc
	},
	computed: {
		...mapGetters([
			'sidebar',
			'avatar',
			'device',
			'storeList'
		]),
		setting: {
			get() {
				return this.$store.state.settings.showSettings
			},
			set(val) {
				this.$store.dispatch('settings/changeSetting', {
					key: 'showSettings',
					value: val
				})
			}
		},
		topNav: {
			get() {
				return this.$store.state.settings.topNav
			}
		},

		filterMethodThrottle() {
			// console.log('filterMethodThrottle');
			var time = 1000
			return (param) => {
				if (time) {
					clearTimeout(time)
				}
				time = setTimeout(() => {
					// 搜索方法
					this.select_click(param)
					clearTimeout(time)
				}, 1000)
			}
		}
	},
	created() {
		this.getNursingOrganizations()
		this.init()
		this.getUnReadList()
		// this.getNoticeList()
	},
	methods: {
		getNoticeInfo(row){
			getNotice(row.noticeId).then(response=>{
				this.notice.info = response.data
				this.notice.infoOpen = true
			})
		},
		/** 查询公告列表 */
		getNoticeList() {
			this.notice.loading = true;
			this.notice.queryParams.organizationId = sessionStorage.getItem('organizationId')
			listNotice(this.notice.queryParams).then(response => {
				this.notice.list = response.rows;
				this.notice.total = response.total;
				this.notice.loading = false;
				this.notice.open=true
			});
		},
		init() {
			let websocketUrl = process.env.VUE_APP_WEBSCOKE
			let token = getToken()
			this.ws = new WebSocket(websocketUrl + '/' + token)

			//监听是否连接成功
			this.ws.onopen = () => {
				// console.log(this.ws)
				// console.log('ws连接状态：' + this.ws.readyState)
				//连接成功则发送一个数据
				// this.ws.send('连接成功')
			}

			//接听服务器发回的信息并处理展示
			this.ws.onmessage = (data) => {
				console.log('接收到来自服务器的消息：')
				if (data.data) {
					let res = JSON.parse(data.data)
					console.log(res)
					if (res.isSystem) {
						console.log('更新消息')
						this.getUnReadList()
					} else {

					}
				}
			}

			//监听连接关闭事件
			this.ws.onclose = () => {
				//监听整个过程中websocket的状态
				console.log('ws连接状态：' + this.ws.readyState)
			}

			//监听并处理error事件
			this.ws.onerror = function (error) {
				console.log(error)
			}
		},
		select_click() {
			this.$emit('save')
			this.fullscreenLoading = true
			sessionStorage.setItem('organizationId', this.organizationId)
			sessionStorage.setItem('storageAside', '0')
			this.$store.dispatch('GetInfo').then(res => {
				this.$store.dispatch('GenerateRoutes').then(() => {
					this.$router.push({path: '/'}).catch(() => {
					})
					setTimeout(() => {
						// window.location.reload()
						this.fullscreenLoading = false
					}, 500)
				})
			})
			// 纳管组织
			this.getNursingOrganizations();
		},
		toggleSideBar() {
			this.$store.dispatch('app/toggleSideBar')
		},
		async logout() {
			this.$confirm('确定注销并退出系统吗？', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(() => {
				this.$store.dispatch('LogOut').then(() => {
					sessionStorage.removeItem('organizationId')
					sessionStorage.removeItem('storeList')
					sessionStorage.removeItem('userId')
					sessionStorage.removeItem('userPhone')
					if (process.env.NODE_ENV == 'development') {
						location.href = '/communalization_stage'
					} else if (process.env.NODE_ENV == 'production') {
						location.href = '/communalization'
          } else if (process.env.NODE_ENV == 'qm') {
						location.href = '/communalization_qm'
					} else if (process.env.NODE_ENV == 'stage') {
						location.href = '/communalization_stage'
					}

				})
				this.ws.close()//退出关闭websocket
			}).catch(() => {
			})
		},
		goMessage() {
			this.$router.push('/system/message')
		},
		getUnReadList() {
			this.unReadList = []
			messageUnReadList({}).then(response => {
				this.unReadList = response.data
			})
		},
		getNursingOrganizations() {
			nursingOrganizations({}).then(response => {
				this.nursingOrganizations = response.data
			})
		}
	},
	mounted() {
		// if(sessionStorage.getItem('organizationId')){
		// 	if(sessionStorage.getItem('storeList')){
		// 		let storeList = JSON.parse(sessionStorage.getItem('storeList'))
		// 		storeList.forEach(item.storeList)
		// 	}
		// }
		// this.organizationId = sessionStorage.getItem('organizationId')
		// console.log(this.$store.state.user,'storeList--');
		this.userId = sessionStorage.getItem('userId')
	}
}
</script>

<style lang="scss" scoped>
.navbar {
	display: flex;
	justify-content: space-between;
	height: 50px;
	overflow: hidden;
	position: relative;
	background: #fff;
	box-shadow: 0 1px 4px rgba(0, 21, 41, .08);

	.d-flex {
		display: flex;
	}

	.navbar_left {
		display: flex;
		width: 70%;
		justify-content: space-between;
		align-items: center;

	}

	.hamburger-container {
		line-height: 46px;
		height: 100%;
		// float: left;
		cursor: pointer;
		transition: background .3s;
		-webkit-tap-highlight-color: transparent;

		&:hover {
			background: rgba(0, 0, 0, .025)
		}
	}

	.breadcrumb-container {
		float: left;

	}

	.topmenu-container {
		position: absolute;
		left: 50px;
	}

	.errLog-container {
		display: inline-block;
		vertical-align: top;
	}

	.right-menu {
		// float: right;
		height: 100%;
		line-height: 50px;

		&:focus {
			outline: none;
		}

		.right-menu-item {
			display: inline-block;
			padding: 0 8px;
			height: 100%;
			font-size: 18px;
			color: #5a5e66;
			vertical-align: text-bottom;

			&.hover-effect {
				cursor: pointer;
				transition: background .3s;

				&:hover {
					background: rgba(0, 0, 0, .025)
				}
			}
		}

		.avatar-container {
			margin-right: 30px;

			.avatar-wrapper {
				margin-top: 5px;
				position: relative;

				.user-avatar {
					cursor: pointer;
					width: 40px;
					height: 40px;
					border-radius: 10px;
				}

				.el-icon-caret-bottom {
					cursor: pointer;
					position: absolute;
					right: -20px;
					top: 25px;
					font-size: 12px;
				}
			}
		}
	}
}
</style>
