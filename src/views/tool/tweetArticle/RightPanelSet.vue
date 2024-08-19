<template>
	<div class="right-board" :style="{ height: conentHeight + 'px' }" style="overflow:hidden">

		<div class=""
			style="border-bottom: 3px solid #dfe4ed;background:#fff;width:100%;height:40px;display: flex;align-items: center;font-weight: 500;justify-content: center;font-size:14px">
			<div v-if="activeName !='three'">
				属性
			</div>
		</div>
		<div class="field-box" style="overflow-y: scroll;" :style="{ height: zjnr_Height + 'px' }">
			<el-scrollbar class="right-scrollbar">
				<!-- 组件属性 -->
				<el-form v-show="currentTab==='field' && showField" size="small" label-width="120px">
					<div class="ti" v-if="activeData.lx == 'rongqi' && activeName == 'first'">
						<div class="ts">{{ activeData.componentName }}</div>
						<div class="">
							<el-form-item v-if="activeData.lx == 'rongqi'" label="元素总数量">
								<el-input v-model="activeData.num" readonly placeholder="请输入" />
							</el-form-item>
							<el-form-item
								v-if="activeData.lx == 'rongqi' && componentName != '非条件容器' && activeName != 'second'" label="激活数量">
								<el-input v-model="activeData.activnum" type="number" v-on:input="updateValue"
									placeholder="请输入" />
							</el-form-item>
							<!-- <el-form-item label="激活开关" v-if="activeData.lx == 'rongqi' && componentName != '非条件容器'"
								style="margin-left: -5px;">
								<el-switch v-model="activeData.elemAllFlag"></el-switch>
							</el-form-item> -->
							<div style="margin-left: 25px;" v-if="activeData.lx == 'rongqi' && componentName != '非条件容器'">
								<el-radio-group  v-model="activeData.elemAllFlag">
									<el-radio style="display: block;text-align: left;margin:0 0 10px 0;" v-for="(j,jindex) in activeData.jhNumList" :key="jindex"
										:label="j.label">
										{{j.name}}
									</el-radio>
								</el-radio-group>
							</div>
							<div class="font-14" style="line-height: 30px;padding:0 25px;" v-if="activeData.lx == 'rongqi' && componentName != '非条件容器'">
								文案说明：<br />
								元素数量：当前容器的元素总和<br />
								激活数量：当前容器中最多或最少得激活数量（取决于下方选择）<br />
								最少激活数量：适用于多个产品最“少”选择“激活数量”产品数（剩余的元素也可以选择）后进入下一步容器的操作。<br />
								最多激活数量： 适用于多个产品最“多”选择“激活数量”产品数（剩余的元素不可选择）后可进入下一个容器的操作。
							</div>
						</div>
					</div>

					<!-- 菜单区 -->
					<div v-if="activeName == 'peizhi_show'">
						<div class="d-flex a-center j-center"
							style="width: 100%;background: rgb(89, 111, 137);color:#fff;padding:5px;font-size:14px"
							@click="menuShow = !menuShow">菜单区</div>
						<el-collapse-transition>
							<div v-if="menuShow">
								<div class="d-flex a-center j-sb mt-10">
									<span class="demonstration" style="font-size:14px">上边距最大值</span>
									<el-input-number style="width: 130px" v-model="activeData.cssStyle.topMarginMax"
										@change="click_topMarginMax" label="上边距最大值"></el-input-number>
								</div>
								<div class="d-flex a-center j-sb mt-10">
									<span class="demonstration" style="font-size:14px">上边距最小值</span>
									<el-input-number style="width: 130px" v-model="activeData.cssStyle.topMarginMin"
										@change="click_topMarginMin" label="上边距最小值"></el-input-number>
								</div>
								<div class="d-flex a-center j-sb mt-10">
									<span class="demonstration" style="font-size:14px">左边距最大值</span>
									<el-input-number style="width: 130px" v-model="activeData.cssStyle.leftMarginMax"
										@change="click_leftMarginMax" label="左边距最大值"></el-input-number>
								</div>
								<div class="d-flex a-center j-sb mt-10">
									<span class="demonstration" style="font-size:14px">左边距最小值</span>
									<el-input-number style="width: 130px" v-model="activeData.cssStyle.leftMarginMin"
										@change="click_leftMarginMin" label="左边距最小值"></el-input-number>
								</div>
							</div>
						</el-collapse-transition>
					</div>
					
					<!-- 画布 -->
					<div class="mt-10" v-if="activeName == 'peizhi_show'">
						<div class="d-flex a-center j-center"
							style="width: 100%;background: rgb(89, 111, 137);color:#fff;padding:5px;font-size:14px"
							@click="huabuShow = !huabuShow">画布区</div>
						<el-collapse-transition>
							<div v-if="huabuShow">
								<div class="mr-2" v-if="activeName == 'peizhi_show' && activeData.cssStyle">
									<!-- <div class="d-flex a-center mt-20 j-sb" v-if="activeData.targetType == 'MEDIA_IMAGE' && imageUrl_twbg == ''">
						  <span class="demonstration mr-1">设置背景</span>
						  <el-switch
							v-model="activeData.cssStyle.bg_switch"
							:disabled="activeData.cssStyle.bg_disabled"
							@change="click_bg"
							>
						  </el-switch>
						</div> -->
									<!-- <div class="d-flex a-center mt-20 j-sb">
						  <span class="demonstration mr-1" style="font-size:14px">手机壳</span>
						  <el-switch
							v-model="sjkShow"
							@change="click_sjk"
							>
						  </el-switch>
						</div> -->
									<div class="d-flex a-center j-sb mt-10" v-if="!sjkShow">
										<span class="demonstration" style="font-size:14px">画布大小</span>
										<!-- <el-input-number v-model="localCanvasSize" @change="click_canvasSize" :min="526"
											:max="10000" label="画布大小" style="width: 130px"></el-input-number> -->
										<div>{{ localCanvasSize }}</div>
									</div>
									<div class="mt-10 d-flex flex-column" v-if="imageUrl_twbg">
										<img :src="imageUrl_twbg" alt="" @click="handlePictureCardPreview"
											style="width: 100px;height: 100px;">
										<el-button type="primary" @click="delImg" class="mt-10"
											style="width: 100px;">删除背景</el-button>
									</div>
								</div>
							</div>
						</el-collapse-transition>
					</div>

					<!-- 元素信息区 -->
					<div class="mt-10" v-if="activeName == 'peizhi_show'">
						<div class="d-flex a-center j-center"
							style="width: 100%;background: rgb(89, 111, 137);color:#fff;padding:5px;font-size:14px"
							@click="yuansuInfoShow = !yuansuInfoShow">元素信息区</div>
						<el-collapse-transition>
							<div v-if="yuansuInfoShow">
								<div class="" v-if="activeName == 'peizhi_show' && activeData.cssStyle">
									<div class="d-flex a-center j-sb mt-10" v-if="activeElementHeight">
										<span class="demonstration" style="font-size:14px">元素高度</span>
										<div>
											{{ activeElementHeight + 4 }} 
										</div>
									</div>
									<div class="d-flex a-center j-sb mt-10" style="font-size:14px">
										<span class="demonstration">元素名称</span>
										<div v-if="activeData.name">
											{{ activeData.name }}
										</div>
									</div>
									<div class="d-flex a-center j-sb mt-10" style="font-size:14px" v-if="activeData.cssStyle.scaleValue != '1'">
										<span class="demonstration">缩放后元素高度</span>
										<div>
											{{ (activeElementHeight * ( activeData.cssStyle.scaleValue - 0)).toFixed(2)  }}
										</div>
									</div>
									<div class="d-flex a-center j-sb mt-10" style="font-size:14px" v-if="activeData.cssStyle.scaleValue != '1'">
										<span class="demonstration">缩放后元素宽度</span>
										<div>
											{{ (232 * ( activeData.cssStyle.scaleValue - 0)).toFixed(2)  }}
										</div>
									</div>
									<!-- <div class="d-flex a-center j-sb mt-10" style="font-size:14px;display:none" v-if="activeData.cssStyle.scaleValue != '1'">
										<span class="demonstration">缩放后上边距</span> 
										<div v-if="(activeData.cssStyle.top_margin - 0) > 0 ">
											{{ activeData.cssStyle.top_margin + (activeElementHeight -  activeElementHeight * ( activeData.cssStyle.scaleValue - 0)) / 2  }}
										</div>
										<div v-if="(activeData.cssStyle.top_margin - 0) < 0 ">
											{{ activeData.cssStyle.top_margin - (activeElementHeight -  activeElementHeight * ( activeData.cssStyle.scaleValue - 0)) / 2  }}
										</div>
										<div v-if="(activeData.cssStyle.top_margin - 0)  == 0 ">
											{{ (activeElementHeight -  activeElementHeight * ( activeData.cssStyle.scaleValue - 0)) / 2  }}
										</div>
									</div> -->
									<!-- <div class="d-flex a-center j-sb mt-10" style="font-size:14px;display:none;" v-if="activeData.cssStyle.scaleValue != '1'">
										<span class="demonstration">缩放后的左边距</span>
										<div v-if="(activeData.cssStyle.left_margin - 0) > 0 ">
											{{ activeData.cssStyle.left_margin + ( ( 232 - ( 232 * ( activeData.cssStyle.scaleValue - 0)))  / 2 ) }}
										</div>
										<div v-if="(activeData.cssStyle.left_margin - 0) < 0 ">
											{{ activeData.cssStyle.left_margin - ( ( 232 - ( 232 * ( activeData.cssStyle.scaleValue - 0)))  / 2 ) }}
										</div>
										<div v-if="(activeData.cssStyle.left_margin - 0) ==  0 ">
											{{ ( ( 232 - ( 232 * ( activeData.cssStyle.scaleValue - 0)))  / 2 ) }}
										</div>
									</div> -->
									<div class="d-flex a-center j-sb mt-10">
										<el-button type="primary"
											v-if="(activeData.tag == 'el-image' || activeData.tag == 'video') &&(activeName =='second' || activeName =='peizhi_show') "
											@click="clickimgVideo(activeData)" class="ml-2">
											{{ activeData.tag == 'el-image' ? '图片预览' : '视频预览' }}
										</el-button>
										<div></div>
									</div>
								</div>
							</div>
						</el-collapse-transition>
					</div>

					<!-- 元素设置区 -->
					<div class="mt-10" v-if="activeName == 'peizhi_show'">
						<div class="d-flex a-center j-center"
							style="width: 100%;background: rgb(89, 111, 137);color:#fff;padding:5px;font-size:14px"
							@click="yuansuSetShow = !yuansuSetShow">元素设置区</div>
						<el-collapse-transition>
							<div v-if="yuansuSetShow">
								<div class="" v-if="activeName == 'peizhi_show' && activeData.cssStyle">
									<div class="" v-if="activeName == 'peizhi_show' && activeData.cssStyle">
										<div class="d-flex a-center mt-10">
											<div class="d-flex a-center j-sb" style="width: 100%;"
												v-if="activeData.cssStyle.isFixed != true">
												<span class="demonstration" style="font-size:14px">上边距</span>
												<el-slider v-model="activeData.cssStyle.top_margin" class="ml-2"
													v-if="activeData.cssStyle.scaleValue == '1'"
													style="width:78%" show-input @change="top_margin"
													:max="activeData.cssStyle.topMarginMax"
													:min="activeData.cssStyle.topMarginMin"></el-slider>
													
												<el-slider v-model="activeData.cssStyle.scaleTopValue" class="ml-2"
													v-if="activeData.cssStyle.scaleValue != '1'"
													style="width:78%" show-input @change="scale_top_margin"
													:max="activeData.cssStyle.topMarginMax"
													:min="activeData.cssStyle.topMarginMin"></el-slider>
											</div>
											<div v-if="activeData.cssStyle.scaleValue != '1'" class="font-14 ml-1" style="display: none;">
												<div v-if="(activeData.cssStyle.top_margin - 0) > 0 ">
													缩:{{ (activeData.cssStyle.top_margin + (activeElementHeight -  activeElementHeight * ( activeData.cssStyle.scaleValue - 0)) / 2).toFixed(2) }}
												</div>
												<div v-if="(activeData.cssStyle.top_margin - 0) < 0 ">
													缩:{{ (activeData.cssStyle.top_margin - (activeElementHeight -  activeElementHeight * ( activeData.cssStyle.scaleValue - 0)) / 2).toFixed(2)  }}
												</div>
												<div v-if="(activeData.cssStyle.top_margin - 0)  == 0 ">
													缩:{{ ((activeElementHeight -  activeElementHeight * ( activeData.cssStyle.scaleValue - 0)) / 2).toFixed(2) }}
												</div>
											</div>
										</div>
										<div class="d-flex a-center mt-10">
											<div class="d-flex a-center j-sb" style="width: 100%;"
												v-if="activeData.cssStyle.isFixed != true">
												<span class="demonstration" style="font-size:14px">左边距</span>
												<el-slider v-model="activeData.cssStyle.left_margin" class="ml-2"
													v-if="activeData.cssStyle.scaleValue == '1'"
													style="width:78%" show-input @change="left_margin"
													:max="activeData.cssStyle.leftMarginMax"
													:min="activeData.cssStyle.leftMarginMin"></el-slider>
													
												<el-slider v-model="activeData.cssStyle.scaleLeftValue" class="ml-2" 
													v-if="activeData.cssStyle.scaleValue != '1'"
													style="width:78%" show-input @change="scale_left_margin"
													:max="activeData.cssStyle.leftMarginMax"
													:min="activeData.cssStyle.leftMarginMin"></el-slider>
											</div>
											<div v-if="activeData.cssStyle.scaleValue != '1'" class="font-14 ml-1"  style="display: none;">
												<div v-if="(activeData.cssStyle.left_margin - 0) > 0 ">
													缩:{{ (activeData.cssStyle.left_margin + ( ( 232 - ( 232 * ( activeData.cssStyle.scaleValue - 0)))  / 2 )).toFixed(2) }}
												</div>
												<div v-if="(activeData.cssStyle.left_margin - 0) < 0 ">
													缩:{{ (activeData.cssStyle.left_margin - ( ( 232 - ( 232 * ( activeData.cssStyle.scaleValue - 0)))  / 2 )).toFixed(2)  }}
												</div>
												<div v-if="(activeData.cssStyle.left_margin - 0) ==  0 ">
													缩:{{ ( ( 232 - ( 232 * ( activeData.cssStyle.scaleValue - 0)))  / 2 ).toFixed(2) }}
												</div>
											</div>
										</div>
										<div class="d-flex a-center j-sb mt-10"
											v-if="activeData.cssStyle.isFixed != true && activeData.suspension != '0'">
											<span class="demonstration" style="font-size:14px">缩放</span>
											<el-slider v-model="activeData.cssStyle.scaleValue" class="ml-2"
												style="width:78%" show-input @change="scale"
												:format-tooltip="formatTooltip" :max="5" :min="0.2"></el-slider>
										</div>
										<div class="my-1 d-flex a-center j-sb mt-10"
											v-if="activeData.cssStyle.isFixed != true && activeData.suspension != '0'">
											<el-button type="primary" @click="click_elementLeft">居左</el-button>
											<el-button type="primary" @click="click_elementCenter">居中</el-button>
											<el-button type="primary" @click="click_elementRight">居右</el-button>
										</div>
										<div
											v-if="activeData.targetType == 'SCENE_FORM' && activeData.cssStyle.isFixed == false && fixedNum == 0 && activeData.showType == '1'">
											<el-button type="primary" @click="clickFixed" class="mt-10"
												style="width: 100px;">固定底部</el-button>
										</div>
										<div
											v-if="activeData.targetType == 'SCENE_FORM' && activeData.cssStyle.isFixed == true && fixedNum == 1">
											<el-button type="primary" @click="formRelease" class="mt-10"
												style="width: 100px;">释放</el-button>
										</div>
									</div>
								</div>
							</div>
						</el-collapse-transition>
					</div>

					<div v-if="activeName == 'peizhi_show'" class="mt-10">
						<div class="d-flex a-center j-center "
							style="width: 100%;background: rgb(89, 111, 137);color:#fff;padding:5px;font-size:14px"
							@click="tucengShow = !tucengShow">图层区</div>
						<el-collapse-transition>
							<div v-if="tucengShow">
								<!-- <div class="d-flex a-center j-sb mt-10">
						<span class="demonstration"  style="font-size:14px">调整画布顺序</span>
						<div></div>
					</div> -->
								<el-table :data="cloneList" ref="table" row-key="name" :row-class-name="rowClassName"
									@cell-mouse-enter.once="eventDrag" border size="small" @row-click="rowClick">
									<el-table-column prop="sort" label="拖拽区域">
										<template>
											<el-button type="text" size="small" class="handle">按住拖拽</el-button>
										</template>
									</el-table-column>
									<!-- 此处如果只有行拖动，可以全部替换为 item -->
									<el-table-column v-for="(item, index) of dropCol" :key="`dropCol_${index}`"
										:prop="dropColumn[index].prop" :label="item.label" :width="item.width"
										:fixed="item.fixed" />
									<el-table-column label="类型" :show-header="false">
										<template slot-scope="scope" v-if="scope.row.name != ''">
											<div v-if="scope.row.targetType == 'MEDIA_IMAGE'">
												<div>图片</div>
											</div>
											<div v-if="scope.row.targetType == 'MEDIA_VIDEO'">
												<div>视频</div>
											</div>
											<div v-if="scope.row.targetType == 'PRODUCT_COUPON'">
												<div>优惠卷</div>
											</div>
											<div v-if="scope.row.targetType == 'MEDIA_TEXT'">
												<div>文案</div>
											</div>
											<div v-if="scope.row.targetType == 'SCENE_FORM'">
												<div>表单</div>
											</div>
											<div v-if="scope.row.targetType == 'SCENE_SIGN'">
												<div>签到</div>
											</div>
											<div v-if="scope.row.targetType == 'SCENE_LIVE_CODE'">
												<div>活码</div>
											</div>
											<div v-if="scope.row.targetType == 'EVENT'">
												<div>事件</div>
											</div>
										</template>
									</el-table-column>
								</el-table>
							</div>
						</el-collapse-transition>
					</div>

					<!-- 推文背景查看 -->
					<el-dialog :visible.sync="twbg_dialogVisible" :close-on-click-modal="false"
						:close-on-press-escape="false">
						<img width="100%" :src="imageUrl_twbg" alt="">
					</el-dialog>


					<!-- &&  activeData.layoutTree" -->
					<template v-if="activeName == 'first'">
						<el-divider>布局结构树</el-divider>
										<!-- <el-tree
							  :data="[activeData]"
							  :props="layoutTreeProps"
							  node-key="renderKey"
							  default-expand-all
							  draggable
							  :allow-drop="allowDrop"
							>
							  <span slot-scope="{ node, data }">
								<span class="node-label">
								  <svg-icon class="node-icon" :icon-class="data.tagIcon" />
								  {{ node.label }}
								</span>
							  </span>
							</el-tree> -->
					
						<!-- <el-tree :data="drawingList" :props="layoutTreeProps"  draggable :allow-drop="allowDrop"></el-tree> -->
						<el-tree draggable="" default-expand-all :allow-drop="allowDrop" ref="tree" :data="drawingList"
							:props="layoutTreeProps"></el-tree>
					</template>

					<div v-if=" activeName == 'pz_second'">
						<!-- <div class="d-flex j-sb mt-10" style="font-size:14px">
							<span class="demonstration ml-2 mt-5">规则</span>
							<div>
								<textarea  rows="6" cols="50" v-model="localRuleText" @blur="clickRuleText" style="outline: none;border-radius: .4rem;border: 1px solid #666;color: #333;"></textarea>
							</div>
						</div> -->
					</div>
					
					<div v-if="activeName =='three'">
						<div class="d-flex a-cener j-center flex-column" style="" v-if="previewUrl">
							<span style="font-size:14px;text-align: center;margin-top: 40px;">扫码预览</span>
							<qr-code style="padding-bottom: 10px" :text="previewUrl" :id="previewUrl+''"
								ref="qrCodes"></qr-code>
						</div>
					</div>
					
					<template v-if="activeName == 'peizhi_show'">

						<!-- <draggable v-model="cloneList" chosen-class="chosen" force-fallback="true" group="people" animation="430" @start="onStart" @end="onEnd">
			     <div v-for="(element,index) in cloneList" :key="index" style="">
					<div v-if="element.targetType == 'MEDIA_IMAGE'" class="d-flex a-center j-sb px-20 mb-5" :class="activeIndex == index ? 'activeBg' : ''" @click="activeClick(index)">
						 <span class="font-14">{{element.name}}</span>
						 <div class="d-flex a-center j-sb">
							 <span class="font-10 text-hui">(图片)</span>
						 </div>
					 </div>
					 <div v-if="element.targetType == 'MEDIA_VIDEO'" class="d-flex a-center j-sb px-20 mb-5" :class="activeIndex == index ? 'activeBg' : ''" @click="activeClick(index)">
						 <span class="font-14">{{element.name}}</span>
						 <span class="font-10 text-hui">(视频)</span>
					 </div>
					 <div v-if="element.targetType == 'PRODUCT_COUPON'" class="d-flex a-center j-sb px-20 mb-5" :class="activeIndex == index ? 'activeBg' : ''" @click="activeClick(index)">
						 <span class="font-14">{{element.name}}</span>
						 <span class="font-10 text-hui">(优惠卷)</span>
					 </div>
					 <div v-if="element.targetType == 'MEDIA_TEXT'" class="d-flex a-center j-sb px-20 mb-5" :class="activeIndex == index ? 'activeBg' : ''" @click="activeClick(index)">
						 <span class="font-14">{{element.name}}</span>
						 <span class="font-10 text-hui">(文案)</span>
					 </div>
					 <div v-if="element.targetType == 'SCENE_FORM'" class="d-flex a-center j-sb px-20 mb-5" :class="activeIndex == index ? 'activeBg' : ''" @click="activeClick(index)">
						 <span class="font-14">{{element.title}}</span>
						 <span class="font-10 text-hui">(表单)</span>
					 </div>
					 <div v-if="element.targetType == 'SCENE_SIGN'" class="d-flex a-center j-sb px-20 mb-5" :class="activeIndex == index ? 'activeBg' : ''" @click="activeClick(index)">
						 <span class="font-14">{{element.title}}</span>
						 <span class="font-10 text-hui">(签到)</span>
					 </div>
			     </div>
			 </draggable> -->
						<!-- <el-table
			   :data="cloneList"
			   ref="table"
			   @cell-mouse-enter.once="eventDrag"
			   border
			   size="small"
			 >
			 <el-table-column label="名称":show-header="false" >
			   <template slot-scope="scope" v-if="scope.row.name != ''">
				   <div>{{ scope.row.name }}</div>
			   </template>
			 </el-table-column>
			   <el-table-column prop="sort" label="拖拽区域" show-header="false">
			     <template>
			       <el-button type="text" size="small" class="handle"
			         >按住拖拽</el-button
			       >
			     </template>
			   </el-table-column>
			   <el-table-column
			     v-for="(item, index) of dropCol"
			     :key="`dropCol_${index}`"
			     :prop="dropColumn[index].prop"
			     :label="item.label"
			     :width="item.width"
			     :fixed="item.fixed"
			   />
			 </el-table> -->
					</template>
				</el-form>
			</el-scrollbar>
		</div>
		<treeNode-dialog :visible.sync="dialogVisible" title="添加选项" @commit="addNode" />
		<icons-dialog :visible.sync="iconsVisible" :current="activeData[currentIconModel]" @select="setIcon" />
	</div>
</template>

<script>
	import {
		isArray
	} from 'util'
	import draggable from 'vuedraggable'
	import TreeNodeDialog from '../build/TreeNodeDialog'
	import {
		isNumberStr
	} from '@/utils/index'
	import IconsDialog from '../build/IconsDialog.vue'

	import {
		getToken
	} from "@/utils/auth";
	import Sortable from "sortablejs";
	import qrCode from '@/components/tweet/qrCode'

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
	import {
		inputComponents,
		selectComponents,
		layoutComponents
	} from '@/utils/generator/config'
	export default {
		components: {
			draggable,
			TreeNodeDialog,
			IconsDialog,
			qrCode
		},
		// props: ['showField', 'activeData', 'formConf','drawingList','canvasSize','isFixed','fixedNum'],
		props: {
			showField: {
				type: Boolean,
			},
			activeData: {
				type: Object,
			},
			formConf: {
				type: Object,
			},
			drawingList: {
				type: Array,
			},
			canvasSize: {
				type: Number,
				default: 0
			},
			isFixed: {
				type: Boolean,
			},
			fixedNum: {
				type: Number,
			},
			ruleText: {
				type: String
			}
		},
		data() {
			return {
				// scaleLeftValue:0,//缩放后 左边距
				localRuleText: '',
				conentHeight: '',
				zjnr_Height: '',
				localCanvasSize: '',
				tableIndex: -1,
				previousRow: null,
				currentRow: null,
				yuansuSetShow: true,
				yuansuInfoShow: true,
				huabuShow: true,
				menuShow: false,
				tucengShow: true,
				tableData: [{
						roleName: "咯阿时候1",
					},
					{
						roleName: "咯阿时候2",
					},
					{
						roleName: "咯阿时候3",
					},
				],
				dropColumn: [{
					prop: "name",
					label: "名称"
				}, ],
				dropCol: [{
					prop: "name",
					label: "名称"
				}, ],
				activeElementHeight: '',
				sjkShow: false,
				twbg_dialogVisible: false,
				batchUpload: {
					list: []
				},
				imageUrl_twbg: '', //推文背景
				uploadFileUrl: 'https://xingcheng.bj.cn/communalization/stage-api/system/media/image/add', //图片上传地址
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded',
					Authorization: 'Bearer ' + getToken()
				},
				checkList: [],
				activeIndex: 0,
				cloneList: [],
				activeName: '',
				componentName: '',
				currentTab: 'field',
				currentNode: null,
				dialogVisible: false,
				iconsVisible: false,
				currentIconModel: null,
				layoutTreeProps: {
					label(data, node) {
						// return data.componentName || `${data.label}: ${data.vModel}`
						return `${data.name}`
					}
				},
				previewUrl:''
			}
		},
		//brother.vue
		//在同级别组件中声明监听事件
		created() {
			this.conentHeight = window.innerHeight - 124
			this.zjnr_Height = window.innerHeight - 124
			this.localRuleText = this.ruleText
			this.localCanvasSize = this.canvasSize

			this.$bus.$on('brotherEvent', res => {
				this.activeData.num = res.num
				this.activeName = res.activeName
				this.componentName = res.componentName
				if (res.cloneList != undefined) {
					let arr = res.cloneList.filter(obj => Object.keys(obj).length !== 0);
					this.cloneList = arr;
				}
			})
		},
		watch: {
			activeData: {
				handler(newValue, oldValue) {
					if (oldValue) {
						this.$nextTick(() => {
							this.activeData.num = oldValue.num
						})
					}
					// if((oldValue.cssStyle.left_margin - 0) > 0) {
					// 	 return this.scaleLeftValue = ( oldValue.cssStyle.left_margin + ( ( 232 - ( 232 * ( this.activeData.cssStyle.scaleValue - 0)))  / 2 ) ).toFixed(0) - 0
					// } else if( oldValue.cssStyle.left_margin - 0 < 0 ){
					// 	return this.scaleLeftValue =  ( oldValue.cssStyle.left_margin - ( ( 232 - ( 232 * ( this.activeData.cssStyle.scaleValue - 0)))  / 2 ) ).toFixed(0) - 0
					// } else if( oldValue.cssStyle.left_margin - 0 ==  0){
					// 	return  this.scaleLeftValue = (( 232 - ( 232 * ( oldValue.cssStyle.scaleValue - 0)))  / 2 ).toFixed(0) - 0
					// }
				},
				immediate: true,
				deep: true,
			},
		},

		computed: {
			rowClassName() {
				return (row, index) => {
					if (row.row == this.currentRow) {
						return 'highlight'; // 添加一个高亮样式类
					}
					return '';
				};
			},
			documentLink() {
				return (
					this.activeData.document ||
					'https://element.eleme.cn/#/zh-CN/component/installation'
				)
			},
			// scaleLeftValue(){
			// 	console.log(this.activeData.cssStyle.left_margin - 0,'activeData.cssStyle.left_margin - 0---');
			// 	if((this.activeData.cssStyle.left_margin - 0) > 0) {
			// 		 return this.activeData.cssStyle.left_margin + (this.activeElementHeight - this.activeElementHeight * (this.activeData.cssStyle.scaleValue - 0)) / 2;
			// 	} else if( this.activeData.cssStyle.left_margin - 0 < 0 ){
			// 		return this.activeData.cssStyle.left_margin + (this.activeElementHeight -  this.activeElementHeight * ( this.activeData.cssStyle.scaleValue - 0)) / 2
			// 	} else if( this.activeData.cssStyle.left_margin - 0 ==  0){
			// 		return ( 232 - ( 232 * ( activeData.cssStyle.scaleValue - 0)))  / 2 
			// 	}
			// }
		},
		mounted() {
			this.handleResize();
			window.addEventListener('resize', this.handleResize);
		},
		// 销户组件
		beforeDestroy() {
			window.removeEventListener('resize', this.handleResize);
		},
		methods: {
			getpreviewUrl(url){
				this.previewUrl = url
			},
			scale_left_margin(val){
				
				let num = (val * 2 - 232 * this.activeData.cssStyle.scaleValue) 
				let n_num = num / 2
				console.log(val-232*(1-this.activeData.cssStyle.scaleValue)/2,'没缩放移动左边距---');
				this.$emit('scale_left_margin',val-232*(1-this.activeData.cssStyle.scaleValue)/2);
			},
			scale_top_margin(val){
				var ah = this.activeElementHeight;
				let t_num = (val * 2 - this.activeElementHeight * this.activeData.cssStyle.scaleValue) 
				let t_n_num = t_num / 2
				console.log(val-ah*(1-this.activeData.cssStyle.scaleValue)/2,'没缩放移动d的上边距----');
				this.$emit('scale_top_margin',val-ah*(1-this.activeData.cssStyle.scaleValue)/2);
			},
			getDetaileCanvasSize(val) {
				this.localCanvasSize = val
			},
			getDetaileRulr(val) {
				this.localRuleText = val
			},
			clickRuleText() {
				this.$emit('getRuleText', this.localRuleText);
			},
			handleResize() {
				this.conentHeight = window.innerHeight - 124
				this.zjnr_Height = window.innerHeight - 124 - 54
			},
			getCanvasSize(val) {
				this.canvasSize = val
			},
			// table 高亮下标
			getTableIndex(index) {
				this.tableIndex = index
			},
			// table 拖拽
			eventDrag() {
				this.rowDrop();
			},
			//行拖拽
			rowDrop() {
				//此处需要使用this.$refs.table.$el.querySelector，不然可能获取不到 tbody
				const tbody = this.$refs.table.$el.querySelector(
					".el-table__body-wrapper tbody"
				);
				const _this = this;
				Sortable.create(tbody, {
					handle: ".handle", //此处指定拖拽元素
					animation: 150,
					onChoose() {
						//选择元素
						_this.dropColumn[_this.dropColumn.length - 1].fixed = false;
					},
					onUnchoose: function(evt) {
						// 取消选择元素
						_this.dropColumn[_this.dropColumn.length - 1].fixed = "right";
					},
					onEnd({
						newIndex,
						oldIndex
					}) {
						// 拖拽完成
						_this.cloneList.splice(newIndex, 0, _this.cloneList.splice(oldIndex, 1)[0]);
						_this.$emit('dragList', _this.cloneList);

					},

				});
			},
			async rowClick(row, event, column) {
				console.log(row, event, column, 'row, event, column---');
				this.currentRow = row; // 设置当前行
				this.$emit('tableRow', row)
			},
			clreaBg() {
				this.imageUrl_twbg = ''
			},
			getBg(bg) {
				this.imageUrl_twbg = bg
			},
			getFater(index) {
				this.activeIndex = index
			},
			getHeight(val) {
				this.activeElementHeight = val
			},
			activeClick(index) {
				this.activeIndex = index
				// this.$emit('dragActive',this.activeIndex);
			},

			// 缩放格式化
			formatTooltip(val) {
				// this.$emit('scale','scale' + "(" + (val / 100) + ")");
				// return val / 100;
			},
			//上传图片---开始
			// 在使用http-request方法的时候，调用的事件必须以param为参数，通过param.file取得文件。
			UploadImage(file) {
				console.log(file, 'param0000-----');
				let _this = this
				let formData = new FormData()
				formData.append('file', file.file)
				imageUpload(formData).then(response => {
					console.log(response, 'response--');
					if (response.code == 200) {
						_this.$emit('clickTW_bg', response.data);
						_this.batchUpload.list.push({
							fileId: response.data.fileId,
							fileOriginalName: response.data.fileOriginalName,
							fileVirtualPath: response.data.fileVirtualPath
						})
					}
				})
			},
			click_elementLeft() {
				this.$emit('elenemt_position', 'left');
			},
			click_elementCenter() {
				this.$emit('elenemt_position', 'center');
			},
			click_elementRight() {
				this.$emit('elenemt_position', 'right');
			},
			// 移除背景图片
			handleRemove(file, fileList) {
				console.log(file, fileList, 'yichu');
			},
			//查看推文背景图片
			handlePictureCardPreview(file) {
				// this.twbg_dialogVisible = true;
			},
			delImg() {
				this.twbg_dialogVisible = false;
				this.imageUrl_twbg = ''
				this.$emit('clickTW_bg', false)
			},
			pic_order(e) {
				this.$emit('picZindex', e);
			},
			click_canvasSize(e) {
				console.log(this.localCanvasSize, 'localCanvasSize---');
				this.$emit('clickCanvas', this.localCanvasSize)
			},
			click_topMarginMax(e) {
				this.$emit('clicktopMarginMax', e)
			},
			click_topMarginMin(e) {
				this.$emit('clicktopMarginMin', e)
			},
			click_leftMarginMax(e) {
				this.$emit('clickleftMarginMax', e)
			},
			click_leftMarginMin(e) {
				this.$emit('clickleftMarginMin', e)
			},
			// 固定底部
			clickFixed() {
				console.log(this.activeData, this.cloneList, '固定底部');
				console.log(this.activeIndex, 'this.activeIndex拖拽完--选中的下标');
				if (this.activeData.targetType != "SCENE_FORM") {
					this.$message.error('请选择要固定底部的表单');
				}
				// return
				this.$emit('clickfixed', '5')
			},
			// 表单释放
			formRelease() {
				if (this.activeData.targetType != "SCENE_FORM") {
					return
				}
				this.$emit('clickRelease')
			},
			top_margin(e) {
				this.$emit('marginTop', e);
			},
			left_margin(e) {
				this.$emit('leftMargin', e);
			},
			scale(e) {
				
				let data = {
					t_transform: 'scale' + "(" + e + ")",
					scaleValue: e
				}
				this.$emit('scale', data);
			},
			click_bg(e) {
				if (e == true) {
					this.imageUrl_twbg = this.activeData.fileVirtualPath || this.activeData.src
				} else {
					this.imageUrl_twbg = ''
				}
				this.$emit('clickTW_bg', e)

				// this.$bus.$emit('peizhi', e)
			},
			click_sjk(e) {
				this.sjkShow = e
				this.$emit('click_sjk', e)
			},
			// @start="onStart" @end="onEnd"
			onStart() {
				console.log(this.cloneList, 'onStart----开始拖拽');
			},
			//上传图片---结束
			onEnd() {
				let oldIndex = event.oldIndex //移动初始位置
				let newIndex = event.newIndex //运动终止位置
				let diff = Math.abs(newIndex - oldIndex) //插值绝对值
				let index = this.cloneList[oldIndex]
				if (eval(oldIndex) > eval(newIndex)) {
					for (let i = 0; i < diff; i++) {
						this.cloneList[oldIndex - i] = this.cloneList[oldIndex - i - 1]
					}
					this.cloneList[newIndex] = index
				} else {
					for (let i = 0; i < diff; i++) {
						this.cloneList[oldIndex + i] = this.cloneList[oldIndex + i + 1]
					}
					this.cloneList[newIndex] = index
				}
				console.log(this.cloneList)

				console.log(this.cloneList, 'onEnd---结束');
				// this.$emit('dragList',this.cloneList);
			},
			allowDrop(draggingNode, dropNode, type) {
				console.log(draggingNode, dropNode, 'draggingNode---dropNode');
				//  二级拖动到一级  或者一级拖动到二级（不同级别拖动return false）

				// if (
				//   (draggingNode.level == 2 && dropNode.level == 1) ||
				//   (draggingNode.level == 1 && dropNode.level == 2)
				// ) {
				//   return false;
				// } else {
				// //同一级别内  判断是否为同一父级
				//   if (draggingNode.parent.id == dropNode.parent.id) {
				//     return type == "next" || type == "prev"
				//     // return true
				//   } else {
				//     return true;
				//   }
				// }
				if (draggingNode.data.type === 1) {
					return false
				}
				//同一父节点下实现拖拽
				if (draggingNode.data.tagIcon == dropNode.data.tagIcon) {

					return type === 'prev' || type === 'next'
				} else {
					// 不同父节点处理
					return false
				}
			},

			updateValue(val) {
				if (val > this.activeData.num) {
					this.activeData.activnum = this.activeData.num
				} else {
					this.activeData.activnum = val
				}
			},
			clickimgVideo(item) {
				console.log(item, 'item---item');
				this.$emit('clickimgVideo', item);
			},
			addReg() {
				this.activeData.regList.push({
					pattern: '',
					message: ''
				})
			},
			addSelectItem() {
				this.activeData.options.push({
					label: '',
					value: ''
				})
			},
			addTreeItem() {
				++this.idGlobal
				this.dialogVisible = true
				this.currentNode = this.activeData.options
			},
			renderContent(h, {
				node,
				data,
				store
			}) {
				return ( 
					<div class = "custom-tree-node" >
						<span > {node.label} </span> <span class = "node-operation" >
							<i on-click = {() => this.append(data)} class="el-icon-plus" title="添加" ></i> 
							<i on-click = {() => this.remove(node, data)} class="el-icon-delete" title="删除" ></i> 
						</span> 
					</div>
				)
			},
			append(data) {
				if (!data.children) {
					this.$set(data, 'children', [])
				}
				this.dialogVisible = true
				this.currentNode = data.children
			},
			remove(node, data) {
				const {
					parent
				} = node
				const children = parent.data.children || parent.data
				const index = children.findIndex(d => d.id === data.id)
				children.splice(index, 1)
			},
			addNode(data) {
				this.currentNode.push(data)
			},
			setOptionValue(item, val) {
				item.value = isNumberStr(val) ? +val : val
			},
			setDefaultValue(val) {
				if (Array.isArray(val)) {
					return val.join(',')
				}
				if (['string', 'number'].indexOf(val) > -1) {
					return val
				}
				if (typeof val === 'boolean') {
					return `${val}`
				}
				return val
			},
			onDefaultValueInput(str) {
				if (isArray(this.activeData.defaultValue)) {
					// 数组
					this.$set(
						this.activeData,
						'defaultValue',
						str.split(',').map(val => (isNumberStr(val) ? +val : val))
					)
				} else if (['true', 'false'].indexOf(str) > -1) {
					// 布尔
					this.$set(this.activeData, 'defaultValue', JSON.parse(str))
				} else {
					// 字符串和数字
					this.$set(
						this.activeData,
						'defaultValue',
						isNumberStr(str) ? +str : str
					)
				}
			},
			onSwitchValueInput(val, name) {
				if (['true', 'false'].indexOf(val) > -1) {
					this.$set(this.activeData, name, JSON.parse(val))
				} else {
					this.$set(this.activeData, name, isNumberStr(val) ? +val : val)
				}
			},
			spanChange(val) {
				this.formConf.span = val
			},
			multipleChange(val) {
				this.$set(this.activeData, 'defaultValue', val ? [] : '')
			},
			rangeChange(val) {
				this.$set(
					this.activeData,
					'defaultValue',
					val ? [this.activeData.min, this.activeData.max] : this.activeData.min
				)
			},
			rateTextChange(val) {
				if (val) this.activeData['show-score'] = false
			},
			rateScoreChange(val) {
				if (val) this.activeData['show-text'] = false
			},
			colorFormatChange(val) {
				this.activeData.defaultValue = null
				this.activeData['show-alpha'] = val.indexOf('a') > -1
				this.activeData.renderKey = +new Date() // 更新renderKey,重新渲染该组件
			},
			openIconsDialog(model) {
				this.iconsVisible = true
				this.currentIconModel = model
			},
			setIcon(val) {
				this.activeData[this.currentIconModel] = val
			},
			tagChange(tagIcon) {
				let target = inputComponents.find(item => item.tagIcon === tagIcon)
				if (!target) target = selectComponents.find(item => item.tagIcon === tagIcon)
				this.$emit('tag-change', target)
			}
		}
	}
</script>

<style lang="scss" scoped>
	.right-board {
		width: 30%;
		right: 0;
		top: -8px;

		// padding-top: 3px;
		.field-box {
			position: relative;
			height: calc(100vh - 42px);
			box-sizing: border-box;
		}

		.el-scrollbar {
			// height: 100%;
		}
	}

	.select-item {
		display: flex;
		border: 1px dashed #fff;
		box-sizing: border-box;

		& .close-btn {
			cursor: pointer;
			color: #f56c6c;
		}

		& .el-input+.el-input {
			margin-left: 4px;
		}
	}

	.select-item+.select-item {
		margin-top: 4px;
	}

	.select-item.sortable-chosen {
		border: 1px dashed #409eff;
	}

	.select-line-icon {
		line-height: 32px;
		font-size: 22px;
		padding: 0 4px;
		color: #777;
	}

	.option-drag {
		cursor: move;
	}

	.time-range {
		.el-date-editor {
			width: 227px;
		}

		::v-deep .el-icon-time {
			display: none;
		}
	}

	.document-link {
		position: absolute;
		display: block;
		width: 26px;
		height: 26px;
		top: 0;
		left: 0;
		cursor: pointer;
		background: #409eff;
		z-index: 1;
		border-radius: 0 0 6px 0;
		text-align: center;
		line-height: 26px;
		color: #fff;
		font-size: 18px;
	}

	.node-label {
		font-size: 14px;
	}

	.node-icon {
		color: #bebfc3;
	}

	.ml-2 {
		margin-left: 20px;
	}

	.mr-2 {
		margin-right: 20px;
	}

	.my-2 {
		margin: 20px 0;
	}

	.my-1 {
		margin: 10px 0;
	}

	.mx-2 {
		margin: 0 20px;
	}

	.ti {
		.ts {
			font-size: 16px;
			color: #333;
			font-weight: 700;
			margin: 0 0 10px 20px;
		}

		label {
			font-weight: 400 !important;
		}
	}

	.font-14 {
		font-size: 14px;
	}

	.font-18 {
		font-size: 18px;
	}

	.font-16 {
		font-size: 16px;
	}

	.font-10 {
		font-size: 10px;
	}

	.text-hui {
		color: #999;
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

	.j-sb {
		justify-content: space-between;
	}

	.mt-5 {
		margin-top: 5px;
	}

	.mt-10 {
		margin-top: 10px;
	}

	.mt-20 {
		margin-top: 20px;
	}

	.mb-5 {
		margin-bottom: 5px;
	}

	.mb-10 {
		margin-bottom: 10px;

	}

	.flex-column {
		flex-direction: column;
	}

	.px-20 {
		padding: 5px 20px;
	}

	.activeBg {
		background: #f8f7f7;
		border-radius: 4px;
	}

	.right-board {
		::v-deep.el-input {
			width: 100% !important;
		}
	}

	.right-board {
		::v-deep.el-table thead {
			display: none;
		}

		::v-deep.highlight {
			background: #e8f4ff !important;
			;
		}

		::v-deep.el-textarea__inner {
			width: 280px !important;
			height: 240px !important;
		}
	}
</style>