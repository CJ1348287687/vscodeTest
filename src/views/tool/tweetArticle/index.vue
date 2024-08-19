<template>
	<div class="container">
		<div
			style="width:100%;height:40px;border-bottom: 1px solid #e8e8e8;display: flex;align-items: center;padding: 15px;font-weight: 600;">
			<div class="a-center j-center" style="display: flex;paddig:10px">
				<div class="" style="margin-top: 2px;">
					生产工作台
				</div>
				<div style="margin-left: 20px;">
					<el-button type="primary" plain size="mini" @click="empty">清空</el-button>
				</div>
			</div>
		</div>

		<div class="tweetArticle" :style="{ height: conentHeight + 'px' }" style="overflow:hidden">
			<div class="left-board">
				<div class=""
					style="border-bottom: 3px solid #dfe4ed;background:#fff;width:480px;height:40px;display: flex;align-items: center;padding-left:10px;font-weight: 500;justify-content: center;font-size:14px;width:100%">
					元素
				</div>
				<el-scrollbar class="left-scrollbar" :style="{ height: zjnr_Height + 'px' }">
					<div class="messageCard">
						<div class="components-list">
							<div class="components-title d-flex a-center j-center"
								style="background: #596f89;padding: 5px 4px" @click="rqshow = !rqshow">
								<span style="color: #fff;">容器</span>
							</div>
							<div v-if="rqshow">
								<div v-for="(element, index) in containerComponents" :key="index"
									class="components-item" @click="addComponent(element)">
									<div class="components-body">
										<svg-icon :icon-class="element.tagIcon" />
										{{ element.label }}
									</div>
								</div>
							</div>
						</div>
						<!-- 图片 -->
						<div class="components-list">
							<div class="components-title d-flex a-center j-center"
								style="background: #596f89;padding: 5px 4px" @click="imgshow = !imgshow">
								<span style="color: #fff;">图片</span>
							</div>
							<el-collapse-transition>
								<div v-if="imgshow">
									<!-- style="height:700px" -->
									<draggable class="components-draggable messageCard row" :list="img_log.arr2"
										style="" :group="{ name: 'componentsGroup', pull: 'clone', put: false }"
										:clone="cloneComponent" draggable=".components-item" :sort="false" @end="onEnd">
										<div v-for="(element, index) in img_log.arr2" :key="index"
											class="components-item span24-8" @click="addComponent(element)">
											<!--  -->
											<div class="components-body d-flex a-center j-center flex-column">
												<div class="d-flex a-center j-center"
													style="height:130px;width:100%;border:1px solid #f5f5f5">
													<img style="max-height: 130px;max-width:100%" :src="element.src"
														alt="">
												</div>
												<div class="mt-5">
													{{ element.name | newName }}
												</div>
											</div>
										</div>
									</draggable>
								</div>
							</el-collapse-transition>
							<div v-show="imgshow" style="margin:4px 0">
								<pagination small style="margin: 0;padding: 0;" :background="false"
									v-show="img_log.arr2" :total="img_log.total" layout="prev, pager, next"
									:page.sync="img_log.queryParams.pageNum" :limit.sync="img_log.queryParams.pageSize"
									@pagination="getLogList('img')" />
							</div>
						</div>
						<!-- 视频 -->
						<div class="components-list">
							<div class="components-title d-flex a-center j-center"
								style="background: #596f89;padding: 5px 4px;color:#fff" @click="videoshow = !videoshow">
								<span>视频</span>&nbsp;&nbsp;&nbsp;
							</div>
							<el-collapse-transition>
								<div v-if="videoshow">
									<!-- style="height:700px" -->
									<draggable class="components-draggable messageCard row" :list="video_log.videoList"
										style="" :group="{ name: 'componentsGroup', pull: 'clone', put: false }"
										:clone="cloneComponent" draggable=".components-item" :sort="false" @end="onEnd">
										<div v-for="(element_video, index) in video_log.videoList" :key="index"
											class="components-item span24-8" @click="addComponent(element_video)">
											<!--  -->
											<div class="components-body d-flex a-center j-center flex-column">
												<div class="d-flex a-center j-center"
													style="height:130px;width:100%;border:1px solid #f5f5f5">
													<video style="max-height: 130px;max-width:100%"
														:src="element_video.src" alt=""></video>
												</div>
												<div class="mt-5">
													{{ element_video.name | newName }}
												</div>
											</div>
										</div>
									</draggable>
								</div>
							</el-collapse-transition>

							<div v-show="videoshow" style="margin:4px 0">
								<pagination style="margin: 0;" small :background="false" :total="video_log.total"
									layout="prev, pager, next" :page.sync="video_log.queryParams.pageNum"
									:limit.sync="video_log.queryParams.pageSize" @pagination="getLogList('video')" />
							</div>
						</div>

						<!-- 文案 -->
						<div class="components-list" style="display: none;">
							<div class="components-title d-flex a-center j-center"
								style="background: #596f89;padding: 5px 4px;color:#fff" @click="textshow = !textshow">
								<span>文案</span>
							</div>
							<el-collapse-transition>
								<!-- v-show="imgshow" -->
								<div v-show="textshow" style="height: 12.5rem;">
									<draggable class="components-draggable messageCard" :list="text_log.textList"
										style="max-height: 12.5rem;;overflow-y: scroll;overflow:auto"
										:group="{ name: 'componentsGroup', pull: 'clone', put: false }"
										:clone="cloneComponent" draggable=".components-item2" :sort="false"
										@end="onEnd">
										<div v-for="(element, index) in text_log.textList" :key="index"
											class="components-item2" @click="addComponent(element)">
											<div class="components-body">
												<div style="font-size: 12px;">
													{{ element.name | newName }}
												</div>
												<!-- <img style="width: 80px;height: 50px;" :src="element.src" alt=""> -->
											</div>
										</div>
									</draggable>
								</div>
							</el-collapse-transition>
							<div v-if="textshow" style="margin:4px 0">
								<pagination small :total="text_log.total" style="margin: 0;" :background="false"
									layout="prev, pager, next" :page.sync="text_log.queryParams.pageNum"
									:limit.sync="text_log.queryParams.pageSize" @pagination="getLogList('text')" />
							</div>
						</div>

						<div class="components-list"  style="display: none;">
							<div class="components-title d-flex a-center j-center"
								style="background: #596f89;padding: 5px 4px;color:#fff" @click="yhjshow = !yhjshow">
								<span>优惠劵</span>
							</div>
							<el-collapse-transition>
								<div v-show="yhjshow">
									<draggable class="components-draggable messageCard row" :list="yhj_log.yhjList"
										style="" :group="{ name: 'componentsGroup', pull: 'clone', put: false }"
										:clone="cloneComponent" draggable=".components-item" :sort="false" @end="onEnd">
										<div v-for="(element, index) in yhj_log.yhjList" :key="index"
											class="components-item span24-8" @click="addComponent(element)">
											<!--  -->
											<div class="components-body d-flex a-center j-center flex-column">
												<div class="d-flex a-center j-center"
													style="height:130px;width:100%;border:1px solid #f5f5f5">
													<img style="max-height: 130px;max-width:100%" :src="element.src"
														alt="">
												</div>
												<div class="mt-5">
													{{ element.name | newName }}
												</div>
											</div>
										</div>
									</draggable>
								</div>
							</el-collapse-transition>
							<div v-show="yhjshow" style="margin:4px 0">
								<pagination small style="margin: 0;" :background="false" :total="yhj_log.total"
									layout="prev, pager, next" :page.sync="yhj_log.queryParams.pageNum"
									:limit.sync="yhj_log.queryParams.pageSize" @pagination="getLogList('yhj')" />
							</div>
						</div>
						<div class="components-list">
							<div class="components-title d-flex a-center j-center"
								style="background: #596f89;padding: 5px 4px;color:#fff" @click="formshow = !formshow">
								<span>表单</span>
							</div>
							<el-collapse-transition>
								<div v-show="formshow" style="height: 12.5rem;;">
									<draggable class="components-draggable" :list="form_log.formList"
										style="max-height: 12.5rem;"
										:group="{ name: 'componentsGroup', pull: 'clone', put: false }"
										:clone="cloneComponent" draggable=".components-item2" :sort="false"
										@end="onEnd">
										<div v-for="(element_yhj, vindex) in form_log.formList" :key="vindex"
											class="components-item2" @click="addComponent(element_yhj)">
											<div class="components-body">
												<div style="font-size: 12px;">
													{{ element_yhj.title }} (
													{{ element_yhj.showType == '1' ? '弹出' : '平铺' }} )
												</div>
											</div>
										</div>
									</draggable>
								</div>
							</el-collapse-transition>
							<div v-show="formshow" style="margin:4px 0">
								<pagination small style="margin: 0;" :background="false" :total="form_log.total"
									layout="prev, pager, next" :page.sync="form_log.queryParams.pageNum"
									:limit.sync="form_log.queryParams.pageSize" @pagination="getLogList('form')" />
							</div>
						</div>

						<div class="components-list"  style="display: none;">
							<div class="components-title d-flex a-center j-center"
								style="background: #596f89;padding: 5px 4px;color:#fff"
								@click="signformshow = !signformshow">
								<span>签到</span>

							</div>
							<el-collapse-transition>
								<div v-show="signformshow" style="height: 12.5rem;;">
									<draggable class="components-draggable" :list="signform_log.formList"
										style="max-height: 12.5rem;"
										:group="{ name: 'componentsGroup', pull: 'clone', put: false }"
										:clone="cloneComponent" draggable=".components-item2" :sort="false"
										@end="onEnd">
										<div v-for="(element_yhj, qindex) in signform_log.formList" :key="qindex"
											class="components-item2" @click="addComponent(element_yhj)">
											<div class="components-body">
												<div style="font-size: 12px;">
													{{ element_yhj.title }}
												</div>
											</div>
										</div>
									</draggable>
								</div>
							</el-collapse-transition>
							<div v-show="signformshow" style="margin:4px 0">
								<pagination small style="margin: 0;" :background="false" :total="signform_log.total"
									layout="prev, pager, next" :page.sync="signform_log.queryParams.pageNum"
									:limit.sync="form_log.queryParams.pageSize" @pagination="getLogList('form')" />
							</div>
						</div>
						
						<!-- 二维码 -->
						<div class="components-list">
							<div class="components-title d-flex a-center j-center"
								style="background: #596f89;padding: 5px 4px" @click="code_imgshow = !code_imgshow">
								<span style="color: #fff;">活码</span>
							</div>
							<el-collapse-transition>
								<div v-if="code_imgshow">
									<draggable class="components-draggable messageCard row" :list="code_img_log.arr2"
										style="" :group="{ name: 'componentsGroup', pull: 'clone', put: false }"
										:clone="cloneComponent" draggable=".components-item" :sort="false" @end="onEnd">
										<div v-for="(element, index) in code_img_log.arr2" :key="index"
											class="components-item span24-8" @click="addComponent(element)">
											<div class="components-body d-flex a-center j-center flex-column">
												<div class="d-flex a-center j-center"
													style="height:130px;width:100%;border:1px solid #f5f5f5">
													<img style="max-height: 130px;max-width:100%" :src="element.src"
														alt="">
												</div>
												<div class="mt-5">
													{{ element.name | newName }}
												</div>
											</div>
										</div>
									</draggable>
								</div>
							</el-collapse-transition>
							<div v-show="code_imgshow" style="margin:4px 0">
								<pagination small style="margin: 0;padding: 0;" :background="false"
									v-show="code_img_log.arr2" :total="code_img_log.total" layout="prev, pager, next"
									:page.sync="code_img_log.queryParams.pageNum" :limit.sync="code_img_log.queryParams.pageSize"
									@pagination="getLogList('code_img')" />
							</div>
						</div>
						
						<!-- 事件 -->
						<div class="components-list">
							<div class="components-title d-flex a-center j-center"
								style="background: #596f89;padding: 5px 4px" @click="event_show = !event_show">
								<span style="color: #fff;">事件</span>
							</div>
							<el-collapse-transition>
								<div v-if="event_show">
									<draggable class="components-draggable messageCard row" :list="event_log.eventList" style="" :group="{ name: 'componentsGroup', pull: 'clone', put: false }" :clone="cloneComponent" draggable=".components-item" :sort="false" @end="onEnd">
										<div v-for="(element, index) in event_log.eventList" :key="index"
											class="components-item span24-8" @click="addComponent(element)">
											<div class="components-body d-flex a-center j-center flex-column">
												<div class="d-flex a-center j-center"
													style="height:130px;width:100%;border:1px solid #f5f5f5">
													<img style="max-height: 130px;max-width:100%" :src="element.initialImage.fileVirtualPath" alt="">
												</div>
												<div class="mt-5">
													{{ element.title | newName }}
													( {{ element.suspension == '0' ? '悬浮' : '平铺' }} )
												</div>
											</div>
										</div>
									</draggable>
								</div>
							</el-collapse-transition>
							<div v-show="event_show" style="margin:4px 0">
								<pagination small style="margin: 0;padding: 0;" :background="false"
									v-show="event_log.eventList" :total="event_log.total" layout="prev, pager, next"
									:page.sync="event_log.queryParams.pageNum" :limit.sync="event_log.queryParams.pageSize"
									@pagination="getLogList('event')" />
							</div>
						</div>
						
					</div>
					<div style="2rem"></div>
				</el-scrollbar>
			</div>
			<!--  中间-->
			<div class="center-board" style="width:40%;overflow-x: hidden;">
				<div>
					<el-tabs v-model="activeName" @tab-click="handleClick" style="width:100%">
						<el-tab-pane label="结构" name="first"></el-tab-pane>
						<el-tab-pane label="画板" name="peizhi_show"></el-tab-pane>
						<el-tab-pane label="配置" name="pz_second"></el-tab-pane>
						<el-tab-pane label="预览" name="three"></el-tab-pane>
					</el-tabs>

					<div v-if="drawingList.length != 0" id="my-overflow"
						:class="activeName =='three' ? 'no_overflow' : 'y_overflow' "
						:style="{ height: zjnr_Height + 'px' }">
						<el-scrollbar class="center-scrollbar" v-if="activeName =='first'" style="overflow-x: hidden;">
							<el-row class="center-board-row" :gutter="formConf.gutter">
								<el-form :size="formConf.size" :label-position="formConf.labelPosition"
									:disabled="formConf.disabled" :label-width="formConf.labelWidth + 'px'">
									<!-- group="componentsGroup" -->
									<draggable class="drawing-board" :list="drawingList" :animation="340" group="task">
										<draggable-item v-for="(element, index) in drawingList" :key="element.renderKey"
											:drawing-list="drawingList" :element="element" :index="index"
											:active-id="activeId" :form-conf="formConf"
											@activeItem="activeFormItem2($event,index)" @copyItem="drawingItemCopy"
											@down="click_down" @moveup="click_moveup" @deleteItem="drawingItemDelete" />
									</draggable>
								</el-form>
							</el-row>
						</el-scrollbar>

						<!-- 展示 画布 -->
						<div v-if="activeName==='peizhi_show'">
							<!-- 画布 图层  没有拖拽  开始 -->
							<div v-if="cloneList.length != 0">
								<el-scrollbar class="center-scrollbar" v-if="activeName =='peizhi_show'"
									style="position: relative;">
									<div v-if="activeName == 'peizhi_show'" :class="sjkShow == true ? '' : 'bgColor'"
										style="padding-bottom: 20px">
										
										<div class="" v-if="cloneList.length != 0">
										
											<div class="prev_pho por" style="">
												<div>

													<!-- <img v-if="!sjkShow" src="../../../assets/images/biankuang.png"
														style="height: 35rem;position: fixed;top: 18%;left: 48%;z-index:10 !important"
														alt=""> -->
													<!-- <div style="width:260px;height: 33rem;position: fixed;top: 82%;left: 50%;z-index:1000000 !important">
														<div style="width:232px;margin:0 auto"
															class="d-flex a-cener j-center">
															<el-button type="danger"
																@click="clickformShow"
																style="width:100%">表单</el-button>
														</div>
													</div> -->
													<img v-if="sjkShow" src="../../../assets/images/phone.png"
														style="width:260px;height: 33rem;position: absolute;top: 0;left: 75px;"
														alt="">
													<div class="scrol position-relative"
														style="background-size: contain;background-repeat: no-repeat;background-position: top;"
														:class=" sjkShow == true ? 'prev_pho_div' : 'prev_pho_div2' "
														:style="{backgroundImage:'url('+twbg+')',height:canvasSize + 'px'}"
														@dragover="dragOver" @dragend="dragEnd">
														<div v-if="!tweetId">
															<img v-if="sjkShow && twbg2" :src="twbg2"
																style="z-index: -99999 !important;width:100%;margin-bottom: -3px;"
																alt="">
														</div>
														<div v-if="tweetId">
															<img v-if="twbg2" :src="twbg2"
																style="z-index: -99999 !important;width:100%;margin-bottom: -3px;"
																alt="">
														</div>
														
														<div v-for="(q,qi) in cloneList" :key="qi" style="z-index: 10;">
															<div v-if="q.targetType == 'MEDIA_IMAGE'">
																<div v-if="q.cssStyle.bg_switch == false"
																	draggable="true"
																	@dragstart="itemDragStart($event,q)" @drop="drop"
																	@mousedown="startLongPress(q)"
																	@mouseup="endLongPress"
																	@mouseleave="cancelLongPress"
																	class="position-absolute"
																	:class="activeIndex == qi ? 'activeBorder' : '' "
																	:style="{ top: q.cssStyle.top_margin + 'px', left:q.cssStyle.left_margin + 'px',transform: q.cssStyle.t_transform,zIndex:q.cssStyle.pic_zindex }"
																	style="width: 232px;box-sizing: border-box;border:2px solid #6ccfff;backface-visibility: hidden;"
																	:ref="getRefName(q)">
																	<img :src="q.src" draggable="false"
																		style="width: 100%;display: block;"
																		@click.stop="click_show(q,qi)" alt="">
																</div>
															</div>
															<div v-if="q.targetType == 'SCENE_LIVE_CODE'">
																<div v-if="q.cssStyle.bg_switch == false"
																	draggable="true"
																	@dragstart="itemDragStart($event,q)" @drop="drop"
																	@mousedown="startLongPress(q)"
																	@mouseup="endLongPress"
																	@mouseleave="cancelLongPress"
																	class="position-absolute"
																	:class="activeIndex == qi ? 'activeBorder' : '' "
																	:style="{ top: q.cssStyle.top_margin + 'px', left:q.cssStyle.left_margin + 'px',transform: q.cssStyle.t_transform,zIndex:q.cssStyle.pic_zindex }"
																	style="width: 232px;box-sizing: border-box;border:2px solid #6ccfff;backface-visibility: hidden;"
																	:ref="getRefName(q)">
																	<img :src="q.src" draggable="false"
																		style="width: 100%;display: block;"
																		@click.stop="click_show(q,qi)" alt="">
																</div>
															</div>
															<div v-if="q.targetType == 'EVENT' && q.suspension == '1' ">
																<div v-if="q.cssStyle.bg_switch == false"
																	draggable="true"
																	@dragstart="itemDragStart($event,q)" @drop="drop"
																	@mousedown="startLongPress(q)"
																	@mouseup="endLongPress"
																	@mouseleave="cancelLongPress"
																	class="position-absolute"
																	:class="activeIndex == qi ? 'activeBorder' : '' "
																	:style="{ top: q.cssStyle.top_margin + 'px', left:q.cssStyle.left_margin + 'px',transform: q.cssStyle.t_transform,zIndex:q.cssStyle.pic_zindex }"
																	style="width: 232px;box-sizing: border-box;border:2px solid #6ccfff;backface-visibility: hidden;"
																	:ref="getRefName(q)">
																	<img :src="q.src" draggable="false"
																		style="width: 100%;display: block;"
																		@click.stop="click_show(q,qi)" alt="">
																</div>
															</div>
															
															<div v-if="q.targetType == 'EVENT' && q.suspension == '0' ">
																<div v-if="q.cssStyle.bg_switch == false"
																	draggable="true"
																	@dragstart="itemDragStart($event,q)" @drop="drop"
																	@mousedown="startLongPress(q)"
																	@mouseup="endLongPress"
																	@mouseleave="cancelLongPress"
																	class="position-absolute"
																	:class="activeIndex == qi ? 'activeBorder' : '' "
																	:style="{ top: q.cssStyle.top_margin + 'px', left: q.cssStyle.left_margin + 'px',transform: q.cssStyle.t_transform,zIndex:q.cssStyle.pic_zindex }"
																	style="width: 50px;box-sizing: border-box;border:2px solid #6ccfff;backface-visibility: hidden;overflow: hidden;"
																	:ref="getRefName(q)">
																	<img :src="q.src" draggable="false"
																		style="width: 100%;display: block;"
																		@click.stop="click_show(q,qi)" alt="">
																</div>
															</div>
															
															<div v-if="q.targetType == 'MEDIA_VIDEO'">
																<div style="width: 232px;box-sizing: border-box;border:2px solid #6ccfff"
																	draggable="true"
																	@dragstart="itemDragStart($event,q)" @drop="drop"
																	@mousedown="startLongPress(q)"
																	@mouseup="endLongPress"
																	@mouseleave="cancelLongPress"
																	class="position-absolute"
																	:class="activeIndex == qi ? 'activeBorder' : '' "
																	:style="{ top: q.cssStyle.top_margin + 'px', left:q.cssStyle.left_margin + 'px',transform: q.cssStyle.t_transform,zIndex:q.cssStyle.pic_zindex }"
																	@click.stop="click_show(q,qi)" :ref="getRefName(q)">
																	<video style="width: 100%;display: block;"
																		:src="q.src"></video>
																</div>
															</div>

															<div v-if="q.targetType == 'PRODUCT_COUPON'">
																<div :class="activeIndex == qi ? 'activeBorder' : '' "
																	draggable="true"
																	@dragstart="itemDragStart($event,q)" @drop="drop"
																	@mousedown="startLongPress(q)"
																	@mouseup="endLongPress"
																	@mouseleave="cancelLongPress"
																	:style="{ top: q.cssStyle.top_margin + 'px', left:q.cssStyle.left_margin + 'px',transform: q.cssStyle.t_transform,zIndex:q.cssStyle.pic_zindex }"
																	:ref="getRefName(q)" class="position-absolute"
																	style="width: 232px;box-sizing: border-box;border:2px solid #6ccfff"
																	@click.stop="click_show(q,qi)">
																	<img :src="q.src"
																		style="width: 100%;display: block;" alt="">
																</div>
															</div>
															<div v-if="q.targetType == 'PRODUCT_COUPON'">
																<div class="position-absolute d-flex a-center j-center "
																	style="top: 30%;width:44px;height:44px;border-radius: 50%;background-color: skyblue;z-index: 100000000;right:0;color:#fff;font-size: 12px;">
																	优惠卷
																</div>
															</div>
															<div v-if="q.targetType == 'MEDIA_TEXT'">
																<div class="font-14 line-20 position-absolute"
																	style="width: 232px;margin: 0 auto;box-sizing: border-box;background:#fff !important;border:2px solid #6ccfff"
																	draggable="true"
																	@dragstart="itemDragStart($event,q)" @drop="drop"
																	@mousedown="startLongPress(q)"
																	@mouseup="endLongPress"
																	@mouseleave="cancelLongPress"
																	:class="activeIndex == qi ? 'activeBorder' : '' "
																	:style="{ top: q.cssStyle.top_margin + 'px', left:q.cssStyle.left_margin + 'px',transform: q.cssStyle.t_transform,zIndex:q.cssStyle.pic_zindex }"
																	@click.stop="click_show(q,qi)" :ref="getRefName(q)">
																	{{ q.content }}
																</div>
															</div>

															<div
																v-if="q.targetType == 'SCENE_FORM' || q.targetType == 'SCENE_SIGN'">
																<div class="position-absolute"
																	:style="{ top: q.cssStyle.top_margin + 'px', left:q.cssStyle.left_margin + 'px',transform: q.cssStyle.t_transform,zIndex:q.cssStyle.pic_zindex }"
																	@click.stop="click_show(q,qi)">
																	<div v-if="q.cssStyle.isFixed == true"
																		style="width:232px;margin:0 auto"
																		class="d-flex a-cener j-center">
																		<el-button type="danger"
																			@click="clickformShow(q)"
																			style="width:100%">表单</el-button>
																	</div>
																</div>
																<div class="position-absolute"
																	v-if="q.cssStyle.isFixed == false" draggable="true"
																	@dragstart="itemDragStart($event,q)" @drop="drop"
																	@mousedown="startLongPress(q)"
																	@mouseup="endLongPress"
																	@mouseleave="cancelLongPress"
																	style="width: 232px;box-sizing: border-box;padding: 10px;background: #fff;border:2px solid #6ccfff"
																	@click.stop="click_show(q,qi)" :ref="getRefName(q)"
																	:class="activeIndex == qi ? 'activeBorder' : '' "
																	:style="{ top: q.cssStyle.top_margin + 'px', left:q.cssStyle.left_margin + 'px',transform: q.cssStyle.t_transform,zIndex:q.cssStyle.pic_zindex }">
																	<div style="font-size: 14px;color: #333;max-height:40px;overflow-y: scroll;overflow-x: hidden;"
																		v-if="q.showTweet == 1" v-html="q.tipInfo">
																	</div>
																	<!-- {{  }} -->
																	<div v-for="(f,fi) in q.elementList">
																		<div v-if="f.type == 0" class="mb-10">
																			<div v-if="f.showStyle == 1"
																				class="d-flex j-sb a-center"
																				style="height:40px">
																				<div style="font-size:14px;max-width: 70px;min-width: 70px;width: 70px;white-space: nowrap;overflow: hidden; text-overflow: ellipsis;color:#333">
																					{{f.tipInfo}}
																				</div>
																				<div class="ml-1">
																					<input readonly
																						style="width: 100%;text-align: left;border-radius: 4px;padding: 4px;outline: none;border: 1px solid #999;" />
																				</div>
																			</div>
																			<div v-if="f.showStyle == 0">
																				<div  style="font-size:14px;width: 100%;white-space: nowrap;overflow: hidden; text-overflow: ellipsis;color:#333">
																					{{f.tipInfo}}
																				</div>
																				<div class="mt-10">
																					<input readonly
																						style="width: 100%;text-align: left;border-radius: 4px;padding: 4px;outline: none;border: 1px solid #999;" />
																				</div>
																			</div>
																			<div v-if="f.showStyle == 2"
																				class="d-flex j-sb a-center"
																				style="height:40px">
																				<input readonly
																					:placeholder="'请输入' + `${f.tipInfo}`"
																					style="width: 100%;text-align: left;border-radius: 4px;padding: 4px;outline: none;border: 1px solid #999;" />
																			</div>
																		</div>
																		<div v-if="f.type=='1'" class="mb-10">
																			<div v-if="f.showStyle == 1"
																				class="d-flex j-sb">
																				<div style="font-size:14px;width: 100%;white-space: nowrap;overflow: hidden; text-overflow: ellipsis;color:#333">
																					{{f.tipInfo}}
																				</div>
																				<div class="ml-1">
																					<input readonly
																						style="width: 100%;text-align: left;border-radius: 4px;padding: 4px;outline: none;border: 1px solid #999;height:50px" />
																				</div>
																			</div>
																			<div v-if="f.showStyle == 0">
																				<div style="font-size:14px;width: 100%;white-space: nowrap;overflow: hidden; text-overflow: ellipsis;color:#333">
																					{{f.tipInfo}}
																				</div>
																				<div class="mt-10">
																					<input readonly
																						style="width: 100%;text-align: left;border-radius: 4px;padding: 4px;outline: none;border: 1px solid #999;height:50px" />
																				</div>
																			</div>
																			<div v-if="f.showStyle == 2">
																				<input readonly :placeholder="'请输入' + `${f.tipInfo}`"
																					style="width: 100%;text-align: left;border-radius: 4px;padding: 4px;outline: none;border: 1px solid #999;height:50px" />
																			</div>
																		</div>
																		<div v-if="f.type == 2" class="mb-10">
																			<div v-if="f.showStyle == 1 && f.showType == '0'"
																				class="d-flex">
																				<div style="font-size:14px;max-width: 70px;min-width: 70px;width: 70px;white-space: nowrap;overflow: hidden; text-overflow: ellipsis;color:#333">
																					{{f.tipInfo}}
																				</div>
																				<div class="ml-1">
																					<el-radio-group v-model="f.value" v-if="f.type=='2' && f.optionList!=null && f.optionList.length!=0 && f.showType == '0'" style="margin-top: 5px;">
																						<el-radio :label="r.name"
																							style="display:block;height: 25px;"
																							v-for="(r,ri) in f.optionList"
																							:key="ri">{{ r.name }}
																						</el-radio>
																					</el-radio-group>
																				</div>
																			</div>
																			
																			<div v-if="f.showStyle == 1 && f.showType == '2'"
																				class="d-flex a-center">
																				<div style="font-size:14px;max-width: 70px;min-width: 70px;width: 70px;white-space: nowrap;overflow: hidden; text-overflow: ellipsis;color:#333">
																					{{f.tipInfo}}
																				</div>
																				<div class="ml-1">
																					<el-select 
																						style="width: 130px;"
																						v-model="f.value"
																						v-if="f.type=='2' && f.optionList!=null && f.optionList.length!=0  && f.showType == '2'"
																						clearable filterable
																						placeholder="请选择">
																						<el-option
																							v-for="option4 in f.optionList"
																							:key="option4.val"
																							:label="option4.name"
																							:value="option4.val" />
																					</el-select>
																				</div>
																			</div>
																			<div v-if="f.showStyle == 0 && f.showType == '0'">
																				<div style="font-size:14px;width: 100%;white-space: nowrap;overflow: hidden; text-overflow: ellipsis;color:#333">
																					{{f.tipInfo}}
																				</div>
																				<div class="mt-10">
																					<el-radio-group v-model="f.value" v-if="f.type=='2' && f.optionList!=null && f.optionList.length!=0 && f.showType == '0'">
																						<el-radio :label="r.name"
																							style="display:block;height: 25px;"
																							v-for="(r,ri) in f.optionList"
																							:key="ri">{{ r.name }}
																						</el-radio>
																					</el-radio-group>
																				</div>
																			</div>
																			<div v-if="f.showStyle == 0 && f.showType == '2'">
																				<div style="font-size:14px;width: 100%;white-space: nowrap;overflow: hidden; text-overflow: ellipsis;color:#333">
																					{{f.tipInfo}}
																				</div>
																				<div class="mt-10">
																					<el-select
																						style="width: 100%;"
																						v-model="f.value"
																						v-if="f.type=='2' && f.optionList!=null && f.optionList.length!=0  && f.showType == '2'"
																						clearable filterable
																						placeholder="请选择">
																						<el-option
																							v-for="option4 in f.optionList"
																							:key="option4.val"
																							:label="option4.name"
																							:value="option4.val" />
																					</el-select>
																				</div>
																			</div>
																		</div>

																		<div v-if="f.type == 3" class="mb-10 ">
																			<div v-if="f.showStyle == 1 && f.showType == '1'"
																				class="d-flex">
																				<div style="font-size:14px;max-width: 70px;min-width: 70px;width: 70px;white-space: nowrap;overflow: hidden; text-overflow: ellipsis;color:#333">
																					{{f.tipInfo}}
																				</div>
																				<div class="ml-1">
																					<el-checkbox-group v-if="f.type=='3' && f.optionList!=null && f.optionList.length!=0 &&f.showType == '1'" v-model="checkList">
																						<el-checkbox
																							style="display:block;height: 25px;"
																							v-for="(c,ci) in f.optionList"
																							:key="ci" :label="c.name"
																							name="type"></el-checkbox>
																					</el-checkbox-group>
																				</div>
																			</div>
																			<div v-if="f.showStyle == 1 && f.showType == '2'"
																				class="d-flex a-center">
																				<div style="font-size:14px;max-width: 70px;min-width: 70px;width: 70px;white-space: nowrap;overflow: hidden; text-overflow: ellipsis;color:#333">
																					{{f.tipInfo}}
																				</div>
																				<div class="ml-1">
																					<el-select v-model="f.value"
																						v-if="f.type=='3' && f.optionList!=null && f.optionList.length!=0  && f.showType == '2'"
																						clearable filterable
																						placeholder="请选择" multiple
																						collapse-tags>
																						<el-option
																							v-for="option3 in f.optionList"
																							:key="option3.val"
																							:label="option3.name"
																							:value="option3.val" />
																					</el-select>
																				</div>
																			</div>
																			<div v-if="f.showStyle == 0 && f.showType == '1'">
																				<div style="font-size:14px;width: 100%;white-space: nowrap;overflow: hidden; text-overflow: ellipsis;color:#333">
																					{{f.tipInfo}}
																				</div>
																				<div class="mt-10">
																					<el-checkbox-group v-if="f.type=='3' && f.optionList!=null && f.optionList.length!=0 &&f.showType == '1'" v-model="checkList">
																						<el-checkbox
																							style="display:block;height: 25px;"
																							v-for="(c,ci) in f.optionList"
																							:key="ci" :label="c.name"
																							name="type"></el-checkbox>
																					</el-checkbox-group>
																				</div>
																			</div>
																			<div v-if="f.showStyle == 0 && f.showType == '2'">
																				<div style="font-size:14px;width: 100%;white-space: nowrap;overflow: hidden; text-overflow: ellipsis;color:#333">
																					{{f.tipInfo}}
																				</div>
																				<div class="mt-10">
																					<el-select v-model="f.value"
																						style="width: 100%;"
																						v-if="f.type=='3' && f.optionList!=null && f.optionList.length!=0  && f.showType == '2'"
																						clearable filterable
																						placeholder="请选择" multiple
																						collapse-tags>
																						<el-option
																							v-for="option3 in f.optionList"
																							:key="option3.val"
																							:label="option3.name"
																							:value="option3.val" />
																					</el-select>
																				</div>
																			</div>
																		</div>

																		<div v-if="f.type == 5" class="mb-10 ">
																			<div v-if="f.showStyle == 1"
																				class="d-flex a-center"
																				style="height:40px">
																				<div style="font-size:14px;max-width: 70px;min-width: 70px;width: 70px;white-space: nowrap;overflow: hidden; text-overflow: ellipsis;color:#333">
																					{{f.tipInfo}}
																				</div>
																				<div class="ml-1">
																					<el-rate v-model="f.value"
																						:max="f.maxNum!=null ? f.maxNum : 5"
																						:colors="colors">
																					</el-rate>
																				</div>
																			</div>
																			<div v-if="f.showStyle == 0">
																				<div style="font-size:14px;width: 1005;white-space: nowrap;overflow: hidden; text-overflow: ellipsis;color:#333">
																					{{f.tipInfo}}
																				</div>
																				<div class="mt-10">
																					<el-rate v-model="f.value"
																						:max="f.maxNum!=null ? f.maxNum : 5"
																						:colors="colors">
																					</el-rate>
																				</div>
																			</div>
																		</div>
																		<div v-if="f.type == 6" class="mb-10">
																			<div v-if="f.showStyle == 1"
																				class="d-flex j-sb a-center"
																				style="height:40px">
																				<div style="font-size:14px;max-width: 70px;min-width: 70px;width: 70px;white-space: nowrap;overflow: hidden; text-overflow: ellipsis;color:#333">
																					{{f.tipInfo}}
																				</div>
																				<div class="ml-1">
																					<el-date-picker
																						style="max-width: 130px;"
																						v-model="valueDate1" type="date"
																						placeholder="请选择日期"
																						format="yyyy-MM-dd"
																						value-format="yyyy-MM-dd">
																					</el-date-picker>
																				</div>
																			</div>
																			<div v-if="f.showStyle == 0">
																				<div style="font-size:14px;width: 100%;white-space: nowrap;overflow: hidden; text-overflow: ellipsis;color:#333">
																					{{f.tipInfo}}
																				</div>
																				<div class="mt-10">
																					<el-date-picker
																						style="width: 100%;"
																						v-model="valueDate1" type="date"
																						placeholder="请选择日期"
																						format="yyyy-MM-dd"
																						value-format="yyyy-MM-dd">
																					</el-date-picker>
																				</div>
																			</div>
																		</div>
																		<div v-if="f.type == 7" class="mb-10 ">
																			<div v-if="f.showStyle == 1"
																				class="d-flex j-sb a-center"
																				style="height:40px">
																				<div style="font-size:14px;max-width: 70px;min-width: 70px;width: 70px;white-space: nowrap;overflow: hidden; text-overflow: ellipsis;color:#333">
																					{{f.tipInfo}}
																				</div>
																				<div class="ml-1">
																					<el-date-picker
																						style="max-width: 130px;"
																						v-model="valueDate6"
																						type="datetimerange"
																						range-separator="至"
																						start-placeholder="开始日期"
																						end-placeholder="结束日期"
																						format="yyyy-MM-dd HH:mm"
																						value-format="yyyy-MM-dd HH:mm">
																					</el-date-picker>
																				</div>
																			</div>
																			<div v-if="f.showStyle == 0">
																				<div style="font-size:14px;width: 100%;white-space: nowrap;overflow: hidden; text-overflow: ellipsis;color:#333">
																					{{f.tipInfo}}
																				</div>
																				<div class="mt-10">
																					<el-date-picker
																						style="width: 100%;"
																						v-model="valueDate6"
																						type="datetimerange"
																						range-separator="至"
																						start-placeholder="开始日期"
																						end-placeholder="结束日期"
																						format="yyyy-MM-dd HH:mm"
																						value-format="yyyy-MM-dd HH:mm">
																					</el-date-picker>
																				</div>
																			</div>
																		</div>
																		
																		<div v-if="f.type == 8" class="mb-10 ">
																			<div v-if="f.showStyle == 1"
																				class="d-flex j-sb a-center mb-10">
																				<div style="font-size:14px;max-width: 70px;min-width: 70px;width: 70px;white-space: nowrap;overflow: hidden; text-overflow: ellipsis;color:#333">
																					{{f.tipInfo}}
																				</div>
																				<div class="ml-1">
																					<input readonly placeholder="请选择地市" style="width: 100%;text-align: left;border-radius: 4px;padding: 4px;outline: none;border: 1px solid #999;" />
																				</div>
																			</div>
																			<div v-if="f.showStyle == 0" class="mb-10 ">
																				<div style="font-size:14px;width: 100%;white-space: nowrap;overflow: hidden; text-overflow: ellipsis;color:#333">
																					{{f.tipInfo}}
																				</div>
																				<div class="mt-10">
																					<input readonly placeholder="请选择地市" style="width: 100%;text-align: left;border-radius: 4px;padding: 4px;outline: none;border: 1px solid #999;" />
																				</div>
																			</div>
																			
																			
																			<div v-if="f.showStyle == 1"
																				class="d-flex j-sb a-center"
																				style="height:40px">
																				<div style="font-size:14px;max-width: 70px;min-width: 70px;width: 70px;white-space: nowrap;overflow: hidden; text-overflow: ellipsis;color:#333">
																					详细地址
																				</div>
																				<div class="ml-1">
																					<input readonly
																						style="width: 100%;text-align: left;border-radius: 4px;padding: 4px;outline: none;border: 1px solid #999;" />
																				</div>
																			</div>
																			<div v-if="f.showStyle == 0">
																				<div  style="font-size:14px;width: 100%;white-space: nowrap;overflow: hidden; text-overflow: ellipsis;color:#333">
																					详细地址
																				</div>
																				<div class="mt-10">
																					<input readonly
																						style="width: 100%;text-align: left;border-radius: 4px;padding: 4px;outline: none;border: 1px solid #999;" />
																				</div>
																			</div>
																			
																		</div>
																		
																		<div v-if="f.type == 9" class="mb-10">
																			<div v-if="f.showStyle == 1 || f.showStyle == 2"
																				class="d-flex j-sb a-center"
																				style="height:40px">
																				<div style="font-size:14px;max-width: 70px;min-width: 70px;width: 70px;white-space: nowrap;overflow: hidden; text-overflow: ellipsis;color:#333">
																					{{f.tipInfo}}
																				</div>
																				<div class="ml-1">
																					<input readonly
																						style="width: 100%;text-align: left;border-radius: 4px;padding: 4px;outline: none;border: 1px solid #999;" />
																				</div>
																			</div>
																			<div v-if="f.showStyle == 0">
																				<div  style="font-size:14px;width: 100%;white-space: nowrap;overflow: hidden; text-overflow: ellipsis;color:#333">
																					{{f.tipInfo}}
																				</div>
																				<div class="mt-10">
																					<input readonly
																						style="width: 100%;text-align: left;border-radius: 4px;padding: 4px;outline: none;border: 1px solid #999;" />
																				</div>
																			</div>
																		</div>
																		<div v-if="f.type == 9" class="mb-10">
																			<div v-if="f.showStyle == 1 || f.showStyle == 2"
																				class="d-flex j-sb a-center"
																				style="height:40px">
																				<div style="font-size:14px;max-width: 70px;min-width: 70px;width: 70px;white-space: nowrap;overflow: hidden; text-overflow: ellipsis;color:#333">
																					验证码
																				</div>
																				<div class="ml-1 mt-10 d-flex a-center j-sb">
																					<input readonly
																						style="width: 60%;text-align: left;border-radius: 4px;padding: 4px;outline: none;border: 1px solid #999;" />
																					<div style="font-size:12px;color: #fff; background:#e83352;padding:2px;border-radius: 4px">验证码</div>
																				</div>
																			</div>
																			<div v-if="f.showStyle == 0">
																				<div  style="font-size:14px;width: 100%;white-space: nowrap;overflow: hidden; text-overflow: ellipsis;color:#333">
																					验证码
																				</div>
																				<div class="mt-10 d-flex a-center j-sb">
																					<input readonly
																						style="width: 70%;text-align: left;border-radius: 4px;padding: 4px;outline: none;border: 1px solid #999;" />
																					<div style="font-size:12px;color: #fff; background:#e83352;padding:2px;border-radius: 4px">验证码</div>
																				</div>
																			</div>
																		</div>
																	</div>

																	<div v-if="!tweetId">
																		<div>
																			<el-button type="danger" style="width:100%"
																				@click="formtan(q)"
																				v-if="q.isclick == false">{{ q.submitBefore }}</el-button>
																		</div>
																		<div>
																			<el-button type="danger" style="width:100%"
																				v-if="q.isclick == true">{{ q.submitAfter }}</el-button>
																		</div>
																	</div>
																	<div v-if="tweetId">
																		<div>
																			<el-button type="danger"
																				style="width:100%">{{ q.submitBefore }}</el-button>
																		</div>

																	</div>
																</div>
															</div>

														</div>
													</div>
												</div>
											</div>
										</div>
									</div>
								</el-scrollbar>
							</div>
							<!-- 画布 图层 没有拖拽 结束 -->

							<!-- 画布 图层  有拖拽  开始 -->
							<div v-if="newcloneList.length != 0">
								<el-scrollbar class="center-scrollbar" v-if="activeName =='peizhi_show'"
									style="position: relative;">
									<div v-if="activeName == 'peizhi_show'" :class="sjkShow == true ? '' : 'bgColor'"
										style="padding-bottom: 20px">
										<div class="" v-if="newcloneList.length != 0">
											<div class="prev_pho por" style="">
												<div>
													<img v-if="sjkShow" src="../../../assets/images/phone.png"
														style="width:260px;height: 33rem;position: absolute;top: 0;left: 70px;"
														alt="">
													<div class="scrol position-relative" @dragover="dragOver"
														@dragend="dragEnd"
														style="background-size: contain;background-repeat: no-repeat;background-position: top;"
														:class=" sjkShow == true ? 'prev_pho_div' : 'prev_pho_div2' "
														:style="{backgroundImage:'url('+twbg+')',height:canvasSize + 'px'}">
														<div v-if="!tweetId">
															<img v-if="sjkShow && twbg2" :src="twbg2"
																style="z-index: -99999 !important;width:100%;margin-bottom: -3px;"
																alt="">
														</div>
														<div v-if="tweetId">
															<img v-if="twbg2" :src="twbg2"
																style="z-index: -99999 !important;width:100%;margin-bottom: -3px;"
																alt="">
														</div>
														<div v-for="(q,qi) in newcloneList" :key="qi"
															style="z-index: 10;">
															<div v-if="q.targetType == 'MEDIA_IMAGE'">
																<div v-if="q.cssStyle.bg_switch == false"
																	draggable="true"
																	@dragstart="itemDragStart($event,q)" @drop="drop"
																	@mousedown="startLongPress(q)"
																	@mouseup="endLongPress"
																	@mouseleave="cancelLongPress"
																	class="position-absolute"
																	:class="activeIndex == qi ? 'activeBorder' : '' "
																	:style="{ top: q.cssStyle.top_margin + 'px', left:q.cssStyle.left_margin + 'px',transform: q.cssStyle.t_transform,zIndex:q.cssStyle.pic_zindex }"
																	style="width: 232px;box-sizing: border-box;border:2px solid #6ccfff"
																	:ref="getRefName(q)">
																	<img :src="q.src"
																		style="width: 100%;display: block;"
																		@click.stop="click_show(q,qi)" alt="">
																</div>
															</div>
															<div v-if="q.targetType == 'SCENE_LIVE_CODE'">
																<div v-if="q.cssStyle.bg_switch == false"
																	draggable="true"
																	@dragstart="itemDragStart($event,q)" @drop="drop"
																	@mousedown="startLongPress(q)"
																	@mouseup="endLongPress"
																	@mouseleave="cancelLongPress"
																	class="position-absolute"
																	:class="activeIndex == qi ? 'activeBorder' : '' "
																	:style="{ top: q.cssStyle.top_margin + 'px', left:q.cssStyle.left_margin + 'px',transform: q.cssStyle.t_transform,zIndex:q.cssStyle.pic_zindex }"
																	style="width: 232px;box-sizing: border-box;border:2px solid #6ccfff"
																	:ref="getRefName(q)">
																	<img :src="q.src"
																		style="width: 100%;display: block;"
																		@click.stop="click_show(q,qi)" alt="">
																</div>
															</div>
															
															<div v-if="q.targetType == 'EVENT' && q.suspension == '1' ">
																<div v-if="q.cssStyle.bg_switch == false"
																	draggable="true"
																	@dragstart="itemDragStart($event,q)" @drop="drop"
																	@mousedown="startLongPress(q)"
																	@mouseup="endLongPress"
																	@mouseleave="cancelLongPress"
																	class="position-absolute"
																	:class="activeIndex == qi ? 'activeBorder' : '' "
																	:style="{ top: q.cssStyle.top_margin + 'px', left:q.cssStyle.left_margin + 'px',transform: q.cssStyle.t_transform,zIndex:q.cssStyle.pic_zindex }"
																	style="width: 232px;box-sizing: border-box;border:2px solid #6ccfff;backface-visibility: hidden;"
																	:ref="getRefName(q)">
																	<img :src="q.src" draggable="false"
																		style="width: 100%;display: block;"
																		@click.stop="click_show(q,qi)" alt="">
																</div>
															</div>
															
															<div v-if="q.targetType == 'EVENT' && q.suspension == '0' ">
																<div v-if="q.cssStyle.bg_switch == false"
																	draggable="true"
																	@dragstart="itemDragStart($event,q)" @drop="drop"
																	@mousedown="startLongPress(q)"
																	@mouseup="endLongPress"
																	@mouseleave="cancelLongPress"
																	class="position-absolute"
																	:class="activeIndex == qi ? 'activeBorder' : '' "
																	:style="{ top: q.cssStyle.top_margin + 'px', left: q.cssStyle.left_margin + 'px',transform: q.cssStyle.t_transform,zIndex:q.cssStyle.pic_zindex }"
																	style="width: 50px;box-sizing: border-box;border:2px solid #6ccfff;backface-visibility: hidden;border-radius: 16px;overflow: hidden;"
																	:ref="getRefName(q)">
																	<img :src="q.src" draggable="false"
																		style="width: 100%;display: block;"
																		@click.stop="click_show(q,qi)" alt="">
																</div>
															</div>
															
															<div v-if="q.targetType == 'MEDIA_VIDEO'">
																<div style="width: 232px;box-sizing: border-box;border:2px solid #6ccfff"
																	draggable="true"
																	@dragstart="itemDragStart($event,q)" @drop="drop"
																	@mousedown="startLongPress(q)"
																	@mouseup="endLongPress"
																	@mouseleave="cancelLongPress"
																	class="position-absolute"
																	:class="activeIndex == qi ? 'activeBorder' : '' "
																	:style="{ top: q.cssStyle.top_margin + 'px', left:q.cssStyle.left_margin + 'px',transform: q.cssStyle.t_transform,zIndex:q.cssStyle.pic_zindex }"
																	@click.stop="click_show(q,qi)" :ref="getRefName(q)">
																	<video style="width: 100%;display: block;"
																		:src="q.src"></video>
																</div>
															</div>

															<div v-if="q.targetType == 'PRODUCT_COUPON'">
																<div :class="activeIndex == qi ? 'activeBorder' : '' "
																	draggable="true"
																	@dragstart="itemDragStart($event,q)" @drop="drop"
																	@mousedown="startLongPress(q)"
																	@mouseup="endLongPress"
																	@mouseleave="cancelLongPress"
																	:style="{ top: q.cssStyle.top_margin + 'px', left:q.cssStyle.left_margin + 'px',transform: q.cssStyle.t_transform,zIndex:q.cssStyle.pic_zindex }"
																	:ref="getRefName(q)" class="position-absolute"
																	style="width: 232px;box-sizing: border-box;border:2px solid #6ccfff"
																	@click.stop="click_show(q,qi)">
																	<img :src="q.src"
																		style="width: 100%;max-height: 120px;;display: block;"
																		alt="">
																</div>
															</div>
															<div v-if="q.targetType == 'PRODUCT_COUPON'">
																<div class="position-absolute d-flex a-center j-center "
																	style="top: 30%;width:44px;height:44px;border-radius: 50%;background-color: skyblue;z-index: 100000000;right:0;color:#fff;font-size: 12px;">
																	优惠卷
																</div>
															</div>
															<div v-if="q.targetType == 'MEDIA_TEXT'">
																<div class="font-14 line-20 position-absolute"
																	style="width: 232px;margin: 0 auto;box-sizing: border-box;background:#fff !important;border:2px solid #6ccfff"
																	draggable="true"
																	@dragstart="itemDragStart($event,q)" @drop="drop"
																	@mousedown="startLongPress(q)"
																	@mouseup="endLongPress"
																	@mouseleave="cancelLongPress"
																	:class="activeIndex == qi ? 'activeBorder' : '' "
																	:style="{ top: q.cssStyle.top_margin + 'px', left:q.cssStyle.left_margin + 'px',transform: q.cssStyle.t_transform,zIndex:q.cssStyle.pic_zindex }"
																	@click.stop="click_show(q,qi)" :ref="getRefName(q)">
																	{{ q.content }}
																</div>
															</div>

															<div
																v-if="q.targetType == 'SCENE_FORM' || q.targetType == 'SCENE_SIGN'">
																<div class="position-absolute"
																	:style="{ top: q.cssStyle.top_margin + 'px', left:q.cssStyle.left_margin + 'px',transform: q.cssStyle.t_transform,zIndex:q.cssStyle.pic_zindex }"
																	@click.stop="click_show(q,qi)">
																	<div v-if="q.cssStyle.isFixed == true"
																		style="width:232px;margin:0 auto"
																		class="d-flex a-cener j-center">
																		<el-button type="danger"
																			@click="clickformShow(q)"
																			style="width:100%">表单</el-button>
																	</div>
																</div>
																<div class="position-absolute"
																	v-if="q.cssStyle.isFixed == false" draggable="true"
																	@dragstart="itemDragStart($event,q)" @drop="drop"
																	@mousedown="startLongPress(q)"
																	@mouseup="endLongPress"
																	@mouseleave="cancelLongPress"
																	style="width: 232px;box-sizing: border-box;padding: 10px;background: #fff;border:2px solid #6ccfff"
																	@click.stop="click_show(q,qi)" :ref="getRefName(q)"
																	:class="activeIndex == qi ? 'activeBorder' : '' "
																	:style="{ top: q.cssStyle.top_margin + 'px', left:q.cssStyle.left_margin + 'px',transform: q.cssStyle.t_transform,zIndex:q.cssStyle.pic_zindex }">
																	<div style="font-size: 14px;color: #333;max-height:40px;overflow-y: scroll;overflow-x: hidden;"
																		v-if="q.showTweet == 1" v-html="q.tipInfo">
																	</div>

																	<div v-for="(f,fi) in q.elementList">
																		<div v-if="f.type == 0" class="mb-10">
																			<div v-if="f.showStyle == 1"
																				class="d-flex j-sb a-center"
																				style="height:40px">
																				<div style="font-size:14px;max-width: 70px;min-width: 70px;width: 70px;white-space: nowrap;overflow: hidden; text-overflow: ellipsis;color:#333">
																					{{f.tipInfo}}
																				</div>
																				<div class="ml-1">
																					<input readonly
																						style="width: 100%;text-align: left;border-radius: 4px;padding: 4px;outline: none;border: 1px solid #999;" />
																				</div>
																			</div>
																			<div v-if="f.showStyle == 0">
																				<div  style="font-size:14px;width: 100%;white-space: nowrap;overflow: hidden; text-overflow: ellipsis;color:#333">
																					{{f.tipInfo}}
																				</div>
																				<div class="mt-10">
																					<input readonly
																						style="width: 100%;text-align: left;border-radius: 4px;padding: 4px;outline: none;border: 1px solid #999;" />
																				</div>
																			</div>
																			<div v-if="f.showStyle == 2"
																				class="d-flex j-sb a-center"
																				style="height:40px">
																				<input readonly
																					:placeholder="'请输入' + `${f.tipInfo}`"
																					style="width: 100%;text-align: left;border-radius: 4px;padding: 4px;outline: none;border: 1px solid #999;" />
																			</div>
																		</div>
																		<div v-if="f.type=='1'" class="mb-10">
																			<div v-if="f.showStyle == 1"
																				class="d-flex j-sb">
																				<div style="font-size:14px;width: 100%;white-space: nowrap;overflow: hidden; text-overflow: ellipsis;color:#333">
																					{{f.tipInfo}}
																				</div>
																				<div class="ml-1">
																					<input readonly
																						style="width: 100%;text-align: left;border-radius: 4px;padding: 4px;outline: none;border: 1px solid #999;height:50px" />
																				</div>
																			</div>
																			<div v-if="f.showStyle == 0">
																				<div style="font-size:14px;width: 100%;white-space: nowrap;overflow: hidden; text-overflow: ellipsis;color:#333">
																					{{f.tipInfo}}
																				</div>
																				<div class="mt-10">
																					<input readonly
																						style="width: 100%;text-align: left;border-radius: 4px;padding: 4px;outline: none;border: 1px solid #999;height:50px" />
																				</div>
																			</div>
																			<div v-if="f.showStyle == 2">
																				<input readonly :placeholder="'请输入' + `${f.tipInfo}`"
																					style="width: 100%;text-align: left;border-radius: 4px;padding: 4px;outline: none;border: 1px solid #999;height:50px" />
																			</div>
																		</div>
																		<div v-if="f.type == 2" class="mb-10">
																			<div v-if="f.showStyle == 1 && f.showType == '0'"
																				class="d-flex">
																				<div style="font-size:14px;max-width: 70px;min-width: 70px;width: 70px;white-space: nowrap;overflow: hidden; text-overflow: ellipsis;color:#333">
																					{{f.tipInfo}}
																				</div>
																				<div class="ml-1">
																					<el-radio-group v-model="f.value" v-if="f.type=='2' && f.optionList!=null && f.optionList.length!=0 && f.showType == '0'" style="margin-top: 5px;">
																						<el-radio :label="r.name"
																							style="display:block;height: 25px;"
																							v-for="(r,ri) in f.optionList"
																							:key="ri">{{ r.name }}
																						</el-radio>
																					</el-radio-group>
																				</div>
																			</div>
																			
																			<div v-if="f.showStyle == 1 && f.showType == '2'"
																				class="d-flex a-center">
																				<div style="font-size:14px;max-width: 70px;min-width: 70px;width: 70px;white-space: nowrap;overflow: hidden; text-overflow: ellipsis;color:#333">
																					{{f.tipInfo}}
																				</div>
																				<div class="ml-1">
																					<el-select 
																						style="width: 130px;"
																						v-model="f.value"
																						v-if="f.type=='2' && f.optionList!=null && f.optionList.length!=0  && f.showType == '2'"
																						clearable filterable
																						placeholder="请选择">
																						<el-option
																							v-for="option4 in f.optionList"
																							:key="option4.val"
																							:label="option4.name"
																							:value="option4.val" />
																					</el-select>
																				</div>
																			</div>
																			<div v-if="f.showStyle == 0 && f.showType == '0'">
																				<div style="font-size:14px;width: 100%;white-space: nowrap;overflow: hidden; text-overflow: ellipsis;color:#333">
																					{{f.tipInfo}}
																				</div>
																				<div class="mt-10">
																					<el-radio-group v-model="f.value" v-if="f.type=='2' && f.optionList!=null && f.optionList.length!=0 && f.showType == '0'">
																						<el-radio :label="r.name"
																							style="display:block;height: 25px;"
																							v-for="(r,ri) in f.optionList"
																							:key="ri">{{ r.name }}
																						</el-radio>
																					</el-radio-group>
																				</div>
																			</div>
																			<div v-if="f.showStyle == 0 && f.showType == '2'">
																				<div style="font-size:14px;width: 100%;white-space: nowrap;overflow: hidden; text-overflow: ellipsis;color:#333">
																					{{f.tipInfo}}
																				</div>
																				<div class="mt-10">
																					<el-select
																						style="width: 100%;"
																						v-model="f.value"
																						v-if="f.type=='2' && f.optionList!=null && f.optionList.length!=0  && f.showType == '2'"
																						clearable filterable
																						placeholder="请选择">
																						<el-option
																							v-for="option4 in f.optionList"
																							:key="option4.val"
																							:label="option4.name"
																							:value="option4.val" />
																					</el-select>
																				</div>
																			</div>
																		</div>

																		<div v-if="f.type == 3" class="mb-10 ">
																			<div v-if="f.showStyle == 1 && f.showType == '1'"
																				class="d-flex">
																				<div style="font-size:14px;max-width: 70px;min-width: 70px;width: 70px;white-space: nowrap;overflow: hidden; text-overflow: ellipsis;color:#333">
																					{{f.tipInfo}}
																				</div>
																				<div class="ml-1">
																					<el-checkbox-group v-if="f.type=='3' && f.optionList!=null && f.optionList.length!=0 &&f.showType == '1'" v-model="checkList">
																						<el-checkbox
																							style="display:block;height: 25px;"
																							v-for="(c,ci) in f.optionList"
																							:key="ci" :label="c.name"
																							name="type"></el-checkbox>
																					</el-checkbox-group>
																				</div>
																			</div>
																			<div v-if="f.showStyle == 1 && f.showType == '2'"
																				class="d-flex a-center">
																				<div style="font-size:14px;max-width: 70px;min-width: 70px;width: 70px;white-space: nowrap;overflow: hidden; text-overflow: ellipsis;color:#333">
																					{{f.tipInfo}}
																				</div>
																				<div class="ml-1">
																					<el-select v-model="f.value"
																						v-if="f.type=='3' && f.optionList!=null && f.optionList.length!=0  && f.showType == '2'"
																						clearable filterable
																						placeholder="请选择" multiple
																						collapse-tags>
																						<el-option
																							v-for="option3 in f.optionList"
																							:key="option3.val"
																							:label="option3.name"
																							:value="option3.val" />
																					</el-select>
																				</div>
																			</div>
																			<div v-if="f.showStyle == 0 && f.showType == '1'">
																				<div style="font-size:14px;width: 100%;white-space: nowrap;overflow: hidden; text-overflow: ellipsis;color:#333">
																					{{f.tipInfo}}
																				</div>
																				<div class="mt-10">
																					<el-checkbox-group v-if="f.type=='3' && f.optionList!=null && f.optionList.length!=0 &&f.showType == '1'" v-model="checkList">
																						<el-checkbox
																							style="display:block;height: 25px;"
																							v-for="(c,ci) in f.optionList"
																							:key="ci" :label="c.name"
																							name="type"></el-checkbox>
																					</el-checkbox-group>
																				</div>
																			</div>
																			<div v-if="f.showStyle == 0 && f.showType == '2'">
																				<div style="font-size:14px;width: 100%;white-space: nowrap;overflow: hidden; text-overflow: ellipsis;color:#333">
																					{{f.tipInfo}}
																				</div>
																				<div class="mt-10">
																					<el-select v-model="f.value"
																						style="width: 100%;"
																						v-if="f.type=='3' && f.optionList!=null && f.optionList.length!=0  && f.showType == '2'"
																						clearable filterable
																						placeholder="请选择" multiple
																						collapse-tags>
																						<el-option
																							v-for="option3 in f.optionList"
																							:key="option3.val"
																							:label="option3.name"
																							:value="option3.val" />
																					</el-select>
																				</div>
																			</div>
																		</div>

																		<div v-if="f.type == 5" class="mb-10 ">
																			<div v-if="f.showStyle == 1"
																				class="d-flex a-center"
																				style="height:40px">
																				<div style="font-size:14px;max-width: 70px;min-width: 70px;width: 70px;white-space: nowrap;overflow: hidden; text-overflow: ellipsis;color:#333">
																					{{f.tipInfo}}
																				</div>
																				<div class="ml-1">
																					<el-rate v-model="f.value"
																						:max="f.maxNum!=null ? f.maxNum : 5"
																						:colors="colors">
																					</el-rate>
																				</div>
																			</div>
																			<div v-if="f.showStyle == 0">
																				<div style="font-size:14px;width: 1005;white-space: nowrap;overflow: hidden; text-overflow: ellipsis;color:#333">
																					{{f.tipInfo}}
																				</div>
																				<div class="mt-10">
																					<el-rate v-model="f.value"
																						:max="f.maxNum!=null ? f.maxNum : 5"
																						:colors="colors">
																					</el-rate>
																				</div>
																			</div>
																		</div>
																		<div v-if="f.type == 6" class="mb-10">
																			<div v-if="f.showStyle == 1"
																				class="d-flex j-sb a-center"
																				style="height:40px">
																				<div style="font-size:14px;max-width: 70px;min-width: 70px;width: 70px;white-space: nowrap;overflow: hidden; text-overflow: ellipsis;color:#333">
																					{{f.tipInfo}}
																				</div>
																				<div class="ml-1">
																					<el-date-picker
																						style="max-width: 130px;"
																						v-model="valueDate1" type="date"
																						placeholder="请选择日期"
																						format="yyyy-MM-dd"
																						value-format="yyyy-MM-dd">
																					</el-date-picker>
																				</div>
																			</div>
																			<div v-if="f.showStyle == 0">
																				<div style="font-size:14px;width: 100%;white-space: nowrap;overflow: hidden; text-overflow: ellipsis;color:#333">
																					{{f.tipInfo}}
																				</div>
																				<div class="mt-10">
																					<el-date-picker
																						style="width: 100%;"
																						v-model="valueDate1" type="date"
																						placeholder="请选择日期"
																						format="yyyy-MM-dd"
																						value-format="yyyy-MM-dd">
																					</el-date-picker>
																				</div>
																			</div>
																		</div>
																		<div v-if="f.type == 7" class="mb-10 ">
																			<div v-if="f.showStyle == 1"
																				class="d-flex j-sb a-center"
																				style="height:40px">
																				<div style="font-size:14px;max-width: 70px;min-width: 70px;width: 70px;white-space: nowrap;overflow: hidden; text-overflow: ellipsis;color:#333">
																					{{f.tipInfo}}
																				</div>
																				<div class="ml-1">
																					<el-date-picker
																						style="max-width: 130px;"
																						v-model="valueDate6"
																						type="datetimerange"
																						range-separator="至"
																						start-placeholder="开始日期"
																						end-placeholder="结束日期"
																						format="yyyy-MM-dd HH:mm"
																						value-format="yyyy-MM-dd HH:mm">
																					</el-date-picker>
																				</div>
																			</div>
																			<div v-if="f.showStyle == 0">
																				<div style="font-size:14px;width: 100%;white-space: nowrap;overflow: hidden; text-overflow: ellipsis;color:#333">
																					{{f.tipInfo}}
																				</div>
																				<div class="mt-10">
																					<el-date-picker
																						style="width: 100%;"
																						v-model="valueDate6"
																						type="datetimerange"
																						range-separator="至"
																						start-placeholder="开始日期"
																						end-placeholder="结束日期"
																						format="yyyy-MM-dd HH:mm"
																						value-format="yyyy-MM-dd HH:mm">
																					</el-date-picker>
																				</div>
																			</div>
																		</div>
																		<div v-if="f.type == 8" class="mb-10">
																			<div v-if="f.showStyle == 1"
																				class="d-flex j-sb a-center mb-10">
																				<div style="font-size:14px;max-width: 70px;min-width: 70px;width: 70px;white-space: nowrap;overflow: hidden; text-overflow: ellipsis;color:#333">
																					{{f.tipInfo}}
																				</div>
																				<div class="ml-1">
																					<input readonly placeholder="请选择地市" style="width: 100%;text-align: left;border-radius: 4px;padding: 4px;outline: none;border: 1px solid #999;" />
																				</div>
																			</div>
																			<div v-if="f.showStyle == 0" class="mb-10">
																				<div style="font-size:14px;width: 100%;white-space: nowrap;overflow: hidden; text-overflow: ellipsis;color:#333">
																					{{f.tipInfo}}
																				</div>
																				<div class="mt-10">
																					<input readonly placeholder="请选择地市" style="width: 100%;text-align: left;border-radius: 4px;padding: 4px;outline: none;border: 1px solid #999;" />
																				</div>
																			</div>
																			<!-- <div class="d-flex j-sb a-center mt-10" v-if="f.type == 8">
																				<div style="font-size:14px;max-width: 70px;min-width: 70px;width: 70px;white-space: nowrap;overflow: hidden; text-overflow: ellipsis;color:#333">
																					详细地址
																				</div>
																				<div class="ml-1">
																					<input readonly placeholder="请输入详细地址" style="width: 100%;text-align: left;border-radius: 4px;padding: 4px;outline: none;border: 1px solid #999;" />
																				</div>
																			</div> -->
																			
																			<div v-if="f.showStyle == 1"
																				class="d-flex j-sb a-center"
																				style="height:40px">
																				<div style="font-size:14px;max-width: 70px;min-width: 70px;width: 70px;white-space: nowrap;overflow: hidden; text-overflow: ellipsis;color:#333">
																					详细地址
																				</div>
																				<div class="ml-1">
																					<input readonly
																						style="width: 100%;text-align: left;border-radius: 4px;padding: 4px;outline: none;border: 1px solid #999;" />
																				</div>
																			</div>
																			<div v-if="f.showStyle == 0">
																				<div  style="font-size:14px;width: 100%;white-space: nowrap;overflow: hidden; text-overflow: ellipsis;color:#333">
																					详细地址
																				</div>
																				<div class="mt-10">
																					<input readonly
																						style="width: 100%;text-align: left;border-radius: 4px;padding: 4px;outline: none;border: 1px solid #999;" />
																				</div>
																			</div>
																			
																		</div>
																		<div v-if="f.type == 9" class="mb-10">
																			<div v-if="f.showStyle == 1 || f.showStyle == 2"
																				class="d-flex j-sb a-center"
																				style="height:40px">
																				<div style="font-size:14px;max-width: 70px;min-width: 70px;width: 70px;white-space: nowrap;overflow: hidden; text-overflow: ellipsis;color:#333">
																					{{f.tipInfo}}
																				</div>
																				<div class="ml-1">
																					<input readonly
																						style="width: 100%;text-align: left;border-radius: 4px;padding: 4px;outline: none;border: 1px solid #999;" />
																				</div>
																			</div>
																			<div v-if="f.showStyle == 0">
																				<div  style="font-size:14px;width: 100%;white-space: nowrap;overflow: hidden; text-overflow: ellipsis;color:#333">
																					{{f.tipInfo}}
																				</div>
																				<div class="mt-10">
																					<input readonly
																						style="width: 100%;text-align: left;border-radius: 4px;padding: 4px;outline: none;border: 1px solid #999;" />
																				</div>
																			</div>
																		</div>
																		<div v-if="f.type == 9" class="mb-10">
																			<div v-if="f.showStyle == 1 || f.showStyle == 2"
																				class="d-flex j-sb a-center"
																				style="height:40px">
																				<div style="font-size:14px;max-width: 70px;min-width: 70px;width: 70px;white-space: nowrap;overflow: hidden; text-overflow: ellipsis;color:#333">
																					验证码
																				</div>
																				<div class="ml-1 mt-10 d-flex a-center j-sb">
																					<input readonly
																						style="width: 60%;text-align: left;border-radius: 4px;padding: 4px;outline: none;border: 1px solid #999;" />
																					<div style="font-size:12px;color: #fff; background:#e83352;padding:2px;border-radius: 4px">验证码</div>
																				</div>
																			</div>
																			<div v-if="f.showStyle == 0">
																				<div  style="font-size:14px;width: 100%;white-space: nowrap;overflow: hidden; text-overflow: ellipsis;color:#333">
																					验证码
																				</div>
																				<div class="mt-10 d-flex a-center j-sb">
																					<input readonly
																						style="width: 70%;text-align: left;border-radius: 4px;padding: 4px;outline: none;border: 1px solid #999;" />
																					<div style="font-size:12px;color: #fff; background:#e83352;padding:2px;border-radius: 4px">验证码</div>
																				</div>
																			</div>
																		</div>
																		
																	</div>

																	<div v-if="!tweetId">
																		<div>
																			<el-button type="danger" style="width:100%"
																				@click="formtan(q)"
																				v-if="q.isclick == false">{{ q.submitBefore }}</el-button>
																		</div>
																		<div>
																			<el-button type="danger" style="width:100%"
																				v-if="q.isclick == true">{{ q.submitAfter }}</el-button>
																		</div>
																	</div>
																	<div v-if="tweetId">
																		<div>
																			<el-button type="danger"
																				style="width:100%">{{ q.submitBefore }}</el-button>
																		</div>

																	</div>
																</div>
															</div>

														</div>
													</div>
												</div>
											</div>
										</div>
									</div>
								</el-scrollbar>
							</div>
							<!-- 画布 图层 有拖拽 结束 -->
						</div>


						<!-- 手机扫描预览 -->
						<div v-if="activeName =='three'">
							<!-- <div class="d-flex a-cener j-center flex-column" style="" v-if="previewUrl">
								<span style="font-size:14px;text-align: center;margin-top: 40px;">扫码预览</span>
								<qr-code style="padding-bottom: 10px" :text="previewUrl" :id="previewUrl+''"
									ref="qrCodes"></qr-code>
							</div> -->
							
							<!-- 手机壳预览开始 -->
							<div class="" v-if="cloneList.length != 0 || newcloneList.length != 0">
								<div class="prev_pho por" style="">
									<div>
										<img  src="../../../assets/images/phone.png"
											style="width:260px;height: 33rem;position: absolute;top: 0;left: 75px;"
											alt="">
										<div class="scrol position-relative"
											style="background-size: contain;background-repeat: no-repeat;background-position: top;">
											<!-- @load="iframeLoad()" -->
											<iframe id="myIframe"  style="width: 285px;height: 590px;position: absolute;top: -34px;left: -138px;border-radius: 20px;border: none;transform: scale(.84);" :src="previewUrl"></iframe>
										</div>
									</div>
								</div>
							</div>
							
							
							<!-- 手机壳预览结束 -->
							
						</div>

						<div v-if="activeName =='pz_second'" style="">
							<el-scrollbar v-if="activeName =='pz_second'">
								<el-row class="center-board-row" :gutter="formConf.gutter">
									<el-form label-width="110px" ref="ruleForm" :model="ruleForm" :rules="rules">
										<el-button type="primary" class="ml-2 mb-20" plain size="mini"
											@click="submit('ruleForm')">保存并提交</el-button>
										<el-form-item label="推文标题" style="padding: 5px !important;" prop="tweetTitle">
											<el-input v-model="ruleForm.tweetTitle"></el-input>
										</el-form-item>
										<!-- v-if="tweetId != undefined && tweetId != ''" -->
										<el-form-item label="公共推文" v-hasPermi="['system:productionTweet:commonFlag']"
											style="padding: 5px !important;display: flex;align-items: center;">
											<!--											<el-switch v-model="ruleForm.tweetCommonFlag"-->
											<!--												@change="tweetCommonFlagChange"></el-switch>-->
											<el-switch v-model="ruleForm.tweetCommonFlag"></el-switch>
										</el-form-item>

										<div style="padding:0 30px;" v-if="ruleForm.tweetCommonFlag==true">
											<el-button @click="organizationAddDialogOpen" style="font-size: 14px;"
												v-if="ruleForm.tweetCommonFlag==true">新增组织关系</el-button>
											<el-table v-loading="loading" :data="organizationAllocated.list"
												v-if="ruleForm.tweetCommonFlag==true">
												<el-table-column label="组织编号" prop="organizationId" align="center"
													width="100" />
												<el-table-column label="组织名称" prop="organizationName"
													width="225" />
												<el-table-column label="所属部门" prop="deptName"
													align="center" width="225" />
												<el-table-column label="操作" align="center" width="50"
													class-name="small-padding fixed-width">
													<template slot-scope="scope">
														<el-button size="mini" type="text" icon="el-icon-delete"
															@click="organizationAllocatedDel(scope.row)">删除
														</el-button>
													</template>
												</el-table-column>
											</el-table>

										</div>

										<!--管理端展示图-->
										<el-form-item label="手机管理端" style="padding: 5px !important;margin-top: 20px;"
											prop="sysImgId">
											<div class="d-flex">
												<div class="d-flex flex-column">
													<div style="font-size:14px;color:#666">
														管理端头图
													</div>
													<div
														style="width: 120px;max-height:120px;display: flex;align-items: center;justify-content: center;border: 1px solid #f5f5f5;overflow: hidden;">
														<el-upload class="avatar-uploader" :action="upload.url"
															:headers="upload.headers" :data="upload.data"
															:show-file-list="false"
															:on-success="(res,file)=>handleAvatarSuccess(res,file,'PRODUCTION_TWEET_SYS_IMG')"
															:before-upload="(file)=>beforeAvatarUpload(file,'PRODUCTION_TWEET_SYS_IMG')">

															<div class="d-flex a-center j-center"
																v-if="sysImg.fileVirtualPath"
																style="height:120px;width:100%;">
																<img style="height:120px;width:100%"
																	v-if="sysImg.fileVirtualPath"
																	:src="sysImg.fileVirtualPath" class="avatar">
															</div>
															<i v-else class="el-icon-plus avatar-uploader-icon"
																style="width: 120px;height:120px;display: flex;align-items: center;justify-content: center;border: 1px solid #f5f5f5;"></i>
														</el-upload>

													</div>
													<el-button type="primary" class="mt-20"
														v-if="sysImg.fileVirtualPath"
														@click="delImg('PRODUCTION_TWEET_SYS_IMG')">删除</el-button>

													<el-upload style="width:120px" class="avatar-uploader"
														:action="upload.url" :headers="upload.headers"
														:data="upload.data" :show-file-list="false"
														:on-success="(res,file)=>handleAvatarSuccess(res,file,'PRODUCTION_TWEET_SYS_IMG')"
														:before-upload="(file)=>beforeAvatarUpload(file,'PRODUCTION_TWEET_SYS_IMG')">
														<el-button v-if="!sysImg.fileVirtualPath" type="primary"
															class="mt-20" @click="addImg('PRODUCTION_TWEET_SYS_IMG')"
															style="width:120px">添加</el-button>
													</el-upload>
												</div>
												<div class="d-flex flex-column ml-2">
													<div style="font-size:14px;color:#666">
														微信端头图
													</div>
													<div
														style="width: 120px;height: 120px;;display: flex;align-items: center;justify-content: center;border: 1px solid #f5f5f5;overflow: hidden;">
														<el-upload class="avatar-uploader" :action="upload.url"
															:headers="upload.headers" :data="upload.data"
															:show-file-list="false"
															:on-success="(res,file)=>handleAvatarSuccess(res,file,'PRODUCTION_TWEET_WX_IMG')"
															:before-upload="(file)=>beforeAvatarUpload(file,'PRODUCTION_TWEET_WX_IMG')">
															<div class="d-flex a-center j-center"
																v-if="wxImg.fileVirtualPath"
																style="height:120px;width:100%">
																<img style="max-width: 120px;max-height: 100%;"
																	:src="wxImg.fileVirtualPath" class="avatar ">
															</div>

															<i v-else class="el-icon-plus avatar-uploader-icon"
																style="width: 120px;height:120px;display: flex;align-items: center;justify-content: center;border: 1px solid #f5f5f5;"></i>
														</el-upload>
													</div>
													<el-button type="primary" class="mt-20" v-if="wxImg.fileVirtualPath"
														@click="delImg('PRODUCTION_TWEET_WX_IMG')">删除</el-button>

													<el-upload class="avatar-uploader" :action="upload.url"
														:headers="upload.headers" :data="upload.data"
														:show-file-list="false"
														:on-success="(res,file)=>handleAvatarSuccess(res,file,'PRODUCTION_TWEET_WX_IMG')"
														:before-upload="(file)=>beforeAvatarUpload(file,'PRODUCTION_TWEET_WX_IMG')">
														<el-button v-if="!wxImg.fileVirtualPath" type="primary"
															class="mt-20" @click="addImg('PRODUCTION_TWEET_WX_IMG')"
															style="width:120px">添加</el-button>
													</el-upload>
													</el-upload>

												</div>
												<div class="d-flex flex-column ml-2">
													<div style="font-size:14px;color:#666">
														朋友圈海报
													</div>
													<div
														style="width: 120px;max-height: 120px;;display: flex;align-items: center;justify-content: center;border: 1px solid #f5f5f5;overflow: hidden">
														<el-upload class="avatar-uploader" :action="upload.url"
															:headers="upload.headers" :data="upload.data"
															:show-file-list="false"
															:on-success="(res,file)=>handleAvatarSuccess(res,file,'PRODUCTION_TWEET_PYQ_IMG')"
															:before-upload="(file)=>beforeAvatarUpload(file,'PRODUCTION_TWEET_PYQ_IMG')">
															<div class="d-flex a-center j-center"
																v-if="pyqImg.fileVirtualPath"
																style="height:120px;width:100%">
																<img style="max-width: 120px;max-height: 120px;"
																	v-if="pyqImg.fileVirtualPath"
																	:src="pyqImg.fileVirtualPath" class="avatar">
															</div>

															<i v-else class="el-icon-plus avatar-uploader-icon"
																style="width: 120px;height:120px;display: flex;align-items: center;justify-content: center;border: 1px solid #f5f5f5;"></i>
														</el-upload>
													</div>
													<el-button type="primary" class="mt-20"
														v-if="pyqImg.fileVirtualPath"
														@click="delImg('PRODUCTION_TWEET_PYQ_IMG')">删除</el-button>
													<el-upload class="avatar-uploader" :action="upload.url"
														:headers="upload.headers" :data="upload.data"
														:show-file-list="false"
														:on-success="(res,file)=>handleAvatarSuccess(res,file,'PRODUCTION_TWEET_PYQ_IMG')"
														:before-upload="(file)=>beforeAvatarUpload(file,'PRODUCTION_TWEET_PYQ_IMG')">
														<el-button type="primary" class="mt-20"
															v-if="!pyqImg.fileVirtualPath"
															@click="delImg('PRODUCTION_TWEET_PYQ_IMG')"
															style="width:120px">添加</el-button>
													</el-upload>
												</div>
											</div>
										</el-form-item>

										<el-form-item label="分发组件配置" style="padding: 5px !important;"
											prop="shareButtonArray">
											<!-- <el-checkbox-group v-model="ruleForm.shareButtonArray"
												style="margin-right: 5px;">
												<el-checkbox v-for="dict in dict.type.tweet_share_button"
													:key="dict.value" :label="dict.value">
													{{dict.label}}
												</el-checkbox>
											</el-checkbox-group> -->
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

										<!-- <el-form-item label=""  style="padding: 0 5px !important;" prop="shareText">
											<div class="d-flex a-center j-center" style="margin-left: 110px;">
												<div class="d-flex a-center flex-column">
													<div id="" class="font-14" style="color:#333">
														分享文案
													</div>
													<el-input type="textarea" :autosize={minRows:3}
														v-model="ruleForm.shareText"></el-input>
												</div>
												<div class="d-flex a-center flex-column ml-2" v-if="ruleForm.shareButtonArray.includes('sale')">
													<div id="" class="font-14" style="color:#333">
														销售话术
													</div>
													<el-input type="textarea" :autosize={minRows:3}
														v-model="ruleForm.saleText"></el-input>
												</div>
											</div>
										</el-form-item> -->

										<el-form-item label="分享文案" style="padding: 0 5px !important;" prop="shareText">
											<el-input type="textarea" :autosize={minRows:3}
												v-model="ruleForm.shareText"></el-input>
										</el-form-item>

										<el-form-item label="销售话术" v-if="ruleForm.shareButtonArray.includes('sale')"
											style="padding: 0 5px !important;" prop="saleText">
											<el-input type="textarea" :autosize={minRows:3}
												v-model="ruleForm.saleText"></el-input>
										</el-form-item>


										<!-- <el-form-item label="执行完跳转"
											style="padding: 5px !important;display: flex;align-items: center;">
											<el-switch v-model="ruleForm.skipExecuteFlag"></el-switch>
										</el-form-item> -->
										<div v-if="formTacticsSwitch">
											<el-form-item label="表单策略组" style="padding: 5px !important;"
												prop="formTactics">
												<div class="" style="width:100%;color:#333 !important">
													<el-row v-for="(item,index) in tweetFormList" :key="index">
														<el-col class="mb-10"
															style="background-color: aliceblue;padding:0 10px">
															<div class="">
																<div class="d-flex a-center mt-10">
																	<div class="font-14" style="width:130px">产品名称</div>
																	<div class="font-14">
																		<el-input v-model="item.productName"
																			style="width:200px"></el-input>
																	</div>
																</div>
																<div class="d-flex a-center">
																	<div class="font-14" style="width:130px">表单名称</div>
																	<div class="font-14 ml-1">{{ item.name }}</div>
																</div>
																<div class="d-flex a-center font-14"
																	v-if="item.formRadio">
																	<span style="width:130px">是否可以重复参与</span>
																	<el-radio-group
																		style="margin:0 0 0 10px;text-align: left;"
																		v-model="item.formRepeatType">
																		<el-radio
																			v-for="(formR,findex) in item.formRadio"
																			:key="findex" :label="formR.label">
																			{{formR.name}}
																		</el-radio>
																	</el-radio-group>
																</div>
																<div class="d-flex a-center font-14">
																	<span style="width:130px">产品模板</span>
																	<el-select v-model="item.productTemplate"
																		placeholder="请选择产品模板"
																		@change="productTemplateClick($event,index)">
																		<el-option v-for="dict in mbFormList"
																			:key="dict.id" :label="dict.templateName"
																			:value="dict.id"></el-option>
																	</el-select>

																</div>
															</div>
															<!--                              o00000000000000000000000000000-->
															<div class="d-flex">
																<div class="font-14" style="min-width:130px;max-width:130px;width:130px">产品图片</div>
																<el-col class="mb-10" style="margin-top: 10px;">
																	<div class="d-flex formP flex-column mb-20">
																		<el-radio-group
																			style="margin:0 0 0 10px;text-align: left;"
																			v-model="item.productImgType">
																			<el-radio style="margi-right:100px"
																				v-for="(ff,ffindex) in item.formPicRadio"
																				:key="ffindex" :label="ff.label">
																				{{ff.name}}
																			</el-radio>
																		</el-radio-group>
																	</div>
																	<div>
																		<div class="d-flex">
																			<div v-if="item.skipType == '1'"
																				style="width: 120px;max-height:120px;display: flex;align-items: center;justify-content: center;background:#dff0ff;overflow: hidden">
																				<div v-if="item.productImage != ''"
																					class="d-flex a-center j-center"
																					style="height:120px;width:100%;background:#dff0ff">
																					<img style="max-width: 120px;max-height: 120px;"
																						:src="item.productImage"
																						class="avatar">
																				</div>
																			</div>
																			<div v-if="item.skipType == '1'"
																				style="width: 120px;max-height:120px;display: flex;align-items: center;justify-content: center;background:#dff0ff;overflow: hidden;margin-left:70px">
																				<el-upload class="avatar-uploader"
																					:action="upload.url"
																					:headers="upload.headers"
																					:data="upload.data"
																					:show-file-list="false"
																					:on-success="(res,file)=>handleAvatarSuccess(res,file,'PRODUCTION_TWEET_FORM_PRODUCT_IMG',item)"
																					:before-upload="(file)=>beforeAvatarUpload(file,'PRODUCTION_TWEET_FORM_PRODUCT_IMG',item)">


																					<div v-if="item.productImg.fileVirtualPath"
																						class="d-flex a-center j-center"
																						style="height:120px;width:100%;background:#dff0ff">
																						<img style="max-width: 120px;max-height: 120px;"
																							v-if="item.productImg.fileVirtualPath"
																							:src="item.productImg.fileVirtualPath"
																							class="avatar">
																					</div>
																					<i v-else
																						class="el-icon-plus avatar-uploader-icon"
																						style="width: 120px;height:120px;display: flex;align-items: center;justify-content: center;background:#dff0ff"></i>
																				</el-upload>
																			</div>
																		</div>
																	</div>
																	<div v-if="item.skipType == '0'">
																		<el-input v-model="item.skipUrl"
																			placeholder="请输入链接地址" />
																	</div>
																</el-col>
															</div>

															<div class="d-flex">
																<div class="font-14" style="min-width:130px;max-width:130px;width:130px">表单结果页</div>
																<el-col class="mb-10" style="margin-top: 10px;">
																	<div class="d-flex formP flex-column mb-20">
																		<el-radio-group
																			style="margin:0 0 0 10px;text-align: left;"
																			v-model="item.skipImgType">
																			<el-radio style="margi-right:100px"
																				v-for="(ff,ffindex) in item.formPicRadio"
																				:key="ffindex" :label="ff.label">
																				{{ff.name}}
																			</el-radio>
																		</el-radio-group>
																	</div>
																	<div>
																		<div class="d-flex">
																			<div v-if="item.skipType == '1'"
																				style="width: 120px;max-height:120px;display: flex;align-items: center;justify-content: center;background:#dff0ff;;overflow: hidden">
																				
																				<div v-if="item.bdResultImage != ''"
																					class="d-flex a-center j-center"
																					style="height:120px;width:100%;background:#dff0ff;">
																					<img style="max-width: 120px;max-height: 120px;"
																						:src="item.bdResultImage"
																						class="avatar">
																				</div>
																			</div>
																			<div v-if="item.skipType == '1'"
																				style="width: 120px;max-height:120px;display: flex;align-items: center;justify-content: center;background:#dff0ff;overflow: hidden;margin-left:70px">
																				<el-upload class="avatar-uploader"
																					:action="upload.url"
																					:headers="upload.headers"
																					:data="upload.data"
																					:show-file-list="false"
																					:on-success="(res,file)=>handleAvatarSuccess(res,file,'PRODUCTION_TWEET_FORM_RESULT_IMG',item)"
																					:before-upload="(file)=>beforeAvatarUpload(file,'PRODUCTION_TWEET_FORM_RESULT_IMG',item)">


																					<div v-if="item.skipImg.fileVirtualPath"
																						class="d-flex a-center j-center"
																						style="height:120px;width:100%;background:#dff0ff;">
																						<img style="max-width: 120px;max-height: 120px;"
																							v-if="item.skipImg.fileVirtualPath"
																							:src="item.skipImg.fileVirtualPath"
																							class="avatar">
																					</div>
																					<i v-else
																						class="el-icon-plus avatar-uploader-icon"
																						style="width: 120px;height:120px;display: flex;align-items: center;justify-content: center;background:#dff0ff;"></i>
																				</el-upload>
																			</div>
																		</div>
																	</div>
																	<div v-if="item.skipType == '0'">
																		<el-input v-model="item.skipUrl"
																			placeholder="请输入链接地址" />
																	</div>
																</el-col>
															</div>
															<!-- <div class="mb-10 mt-10">
																<el-select v-model="item.tacticType" placeholder="请选择"
																	style="width: 100%" @change="tacticTypeChange(item)">
																	<el-option v-for="item in formTacticTypes"
																		:key="item.code" :label="item.type"
																		:value="item.code">
																	</el-option>
																</el-select>
															</div> -->
															<!-- <el-button type="primary" v-if="item.tacticType == '3'"
																@click="tactic3OpenHandle(item)">配置策略</el-button> -->
														</el-col>
													</el-row>
												</div>
											</el-form-item>
											<el-form-item label="表单跳转组" style="padding: 5px !important;display:none"
												prop="formTactics">
												<div class="" style="width:100%;color:#333 !important">
													<el-row v-for="(item,qindex) in tweetFormList" :key="qindex">
														<el-col class="mb-10">
															<div class="d-flex formP flex-column mb-20">
																<div class="font-14">{{ item.name }}</div>
																<el-radio-group
																	style="margin:0 0 0 10px;text-align: left;"
																	v-model="item.skipImgType">
																	<el-radio style="margi-right:100px"
																		v-for="(ff,ffindex) in item.formPicRadio"
																		:key="ffindex" :label="ff.label">
																		{{ff.name}}
																	</el-radio>
																</el-radio-group>
															</div>
															<div>
																<div class="d-flex">
																	<div v-if="item.skipType == '1'"
																		style="width: 120px;max-height:120px;display: flex;align-items: center;justify-content: center;border: 1px solid #f5f5f5;overflow: hidden">
																		<div v-if="item.bdResultImage != ''"
																			class="d-flex a-center j-center"
																			style="height:120px;width:100%;border:1px solid #f5f5f5">
																			<img style="max-width: 120px;max-height: 120px;"
																				:src="item.bdResultImage" class="avatar">
																		</div>
																	</div>
																	<div v-if="item.skipType == '1'"
																		style="width: 120px;max-height:120px;display: flex;align-items: center;justify-content: center;border: 1px solid #f5f5f5;overflow: hidden;margin-left:70px">
																		<el-upload class="avatar-uploader"
																			:action="upload.url"
																			:headers="upload.headers"
																			:data="upload.data" :show-file-list="false"
																			:on-success="(res,file)=>handleAvatarSuccess(res,file,'PRODUCTION_TWEET_FORM_RESULT_IMG',item)"
																			:before-upload="(file)=>beforeAvatarUpload(file,'PRODUCTION_TWEET_FORM_RESULT_IMG',item)">


																			<div v-if="item.skipImg.fileVirtualPath"
																				class="d-flex a-center j-center"
																				style="height:120px;width:100%;border:1px solid #f5f5f5">
																				<img style="max-width: 120px;max-height: 120px;"
																					v-if="item.skipImg.fileVirtualPath"
																					:src="item.skipImg.fileVirtualPath"
																					class="avatar">
																			</div>
																			<i v-else
																				class="el-icon-plus avatar-uploader-icon"
																				style="width: 120px;height:120px;display: flex;align-items: center;justify-content: center;border: 1px solid #f5f5f5;"></i>
																		</el-upload>
																	</div>
																</div>
																<div class="font-14">表单结果页</div>
															</div>
															<div v-if="item.skipType == '0'">
																<el-input v-model="item.skipUrl"
																	placeholder="请输入链接地址" />
															</div>
														</el-col>
													</el-row>
												</div>
											</el-form-item>
										</div>
										<div v-if="couponConfigDisplay">
											<el-form-item label="优惠券配置" style="padding: 5px !important;"
												prop="tweetCouponList">
												<div class="" style="width:100%;color:#333 !important">
													<el-row v-for="(item,qindex) in tweetCouponList" :key="qindex">
														<el-col class="mb-10">
															优惠券名称：{{item.couponName}}
															<el-form-item label="领取数量" prop="couponLimitGain">
																<el-input-number v-model="item.couponLimitGain" :min="1"
																	:max="999" :controls="false"
																	label="请填写领取数量"></el-input-number>
															</el-form-item>
														</el-col>
													</el-row>
												</div>
											</el-form-item>
										</div>
										<el-form-item label="条件逻辑提示语" class="guize d-flex a-center"
											style="padding: 5px !important;" v-if="tishiyu_show">
											<!-- <el-input type="textarea" v-model="ruleText"></el-input> -->
											<el-radio-group style="margin:0 0 0 10px;text-align: left;"
												v-model="ruleType">
												<el-radio style="margi-right:100px" v-for="(w,windex) in tishiyuList"
													:key="windex" :label="w.label">
													{{w.name}}
												</el-radio>
											</el-radio-group>

										</el-form-item>
										<div style="margin-left: 110px;display: flex;" v-if="tishiyu_show">
											<div>
												<el-input type="textarea" style="width: 180px;"
													v-model="ruleText"></el-input>
											</div>
											<div class="ml-2">
												<el-upload class="avatar-uploader" :action="upload.url"
													:headers="upload.headers" :data="upload.data"
													:show-file-list="false"
													:on-success="(res,file)=>handleAvatarSuccess(res,file,'PRODUCTION_TWEET_RULE_IMG')"
													:before-upload="(file)=>beforeAvatarUpload(file,'PRODUCTION_TWEET_RULE_IMG')">
													<div class="d-flex a-center j-center" v-if="tsyImg.fileVirtualPath"
														style="height:120px;width:100%;border:1px solid #f5f5f5">
														<img style="max-width: 120px;max-height: 120px;"
															v-if="tsyImg.fileVirtualPath" :src="tsyImg.fileVirtualPath"
															class="avatar">
													</div>
													<i v-else class="el-icon-plus avatar-uploader-icon"
														style="width: 120px;height:120px;display: flex;align-items: center;justify-content: center;border: 1px solid #f5f5f5;"></i>
												</el-upload>

												<el-button type="primary" class="mt-20" style="width:120px"
													v-if="tsyImg.fileVirtualPath"
													@click="delImg('PRODUCTION_TWEET_RULE_IMG')">删除</el-button>
												<el-upload class="avatar-uploader" :action="upload.url"
													:headers="upload.headers" :data="upload.data"
													:show-file-list="false"
													:on-success="(res,file)=>handleAvatarSuccess(res,file,'PRODUCTION_TWEET_RULE_IMG')"
													:before-upload="(file)=>beforeAvatarUpload(file,'PRODUCTION_TWEET_RULE_IMG')">
													<el-button type="primary" class="mt-20"
														v-if="!tsyImg.fileVirtualPath"
														@click="delImg('PRODUCTION_TWEET_RULE_IMG')"
														style="width:120px">添加</el-button>
												</el-upload>
											</div>
										</div>
									</el-form>
								</el-row>
							</el-scrollbar>
						</div>
					</div>
					<div v-if="drawingList.length == 0" class="empty-info">
						选择容器/选组件进行表单设计
					</div>
				</div>
			</div>

			<right-panel-set :ruleText="ruleText" :fixedNum="fixedNum" :active-data="activeData" :isFixed="isFixed"
				:canvasSize="canvasSize" :drawingList="drawingList" :form-conf="formConf"
				:show-field="!!drawingList.length" @tag-change="tagChange" @clickimgVideo="clickimgVideo"
				@dragList="getdragList" @dragActive="dragActive" @clickTW_bg="clickTW_bg" @marginTop="marginTop"
				@leftMargin="leftMargin" @scale="scale" @picZindex="picZindex" @elenemt_position="elenemt_position"
				@click_sjk="click_sjk" ref="child_show" @clickCanvas="clickCanvas"
				@clickleftMarginMin="clickleftMarginMin" @clicktopMarginMax="clicktopMarginMax"
				@clicktopMarginMin="clicktopMarginMin" @clickleftMarginMax="clickleftMarginMax" @clickfixed="clickfixed"
				@tableRow="tableRow" @clickRelease="clickRelease" @getRuleText="getRuleText"
				@scale_left_margin="scale_left_margin" @scale_top_margin="scale_top_margin" />

			<code-type-dialog :visible.sync="dialogVisible" title="选择生成类型" :show-file-name="showFileName"
				@confirm="generate" />
			<input id="copyNode" type="hidden">

			<!--图片显示弹出层-->
			<el-dialog :visible.sync="imagePreview.visible" width="850px" height="37.5rem" append-to-body
				:close-on-click-modal="false" :close-on-press-escape="false" :show-close="true" :center="true"
				@close="imagePreviewClose">
				<div style="height: 28rem;display: flex;align-items: center;justify-content: center;">
					<img :src="imagePreview.url" class="el_dialog_img" style="max-width: 50rem;max-height: 28rem;"
						alt="">
				</div>
			</el-dialog>

			<el-dialog :visible.sync="videoPreview.visible" width="850px" height="37.5rem" append-to-body
				:close-on-click-modal="false" :close-on-press-escape="false" :show-close="true"
				@close="videoPreviewClose">
				<div style="height: 28rem;display: flex;align-items: center;justify-content: center;">
					<video width="100%" :src="videoPreview.url" controls="controls" autoplay ref="vueMiniPlayer"
						class="el_dialog_video" style="max-width: 50rem;max-height: 28rem;" />
				</div>
			</el-dialog>

			<el-dialog title="推文保存" :visible.sync="is_submit" width="40%" :close-on-click-modal="false"
				:close-on-press-escape="false">
				<el-form :model="ruleForm" :rules="rules" label-width="100px">
					<el-form-item label="推文标题" style="padding: 5px !important;" prop="tweetTitle">
						<el-input v-model="ruleForm.tweetTitle"></el-input>
					</el-form-item>
				</el-form>
				<span slot="footer" class="dialog-footer">
					<el-button @click="close">取 消</el-button>
					<el-button type="primary" @click="submit('ruleForm')">确 定</el-button>
				</span>
			</el-dialog>

			<el-dialog title="待选组织关系列表" :visible.sync="organizationUnallocated.open" class="dsgxDialog" width="55%"
				:close-on-click-modal="false" :close-on-press-escape="false" @close="organizationAddDialogClose">
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
					:row-key="getRowKeys" @selection-change="handleSelectionChange">
					<el-table-column type="selection" :reserve-selection="true" width="55"></el-table-column>
					<el-table-column label="组织编号" prop="organizationId" width="100" align="center" />
					<el-table-column label="组织名称" prop="organizationName" width="250"
						align="center" />
					<el-table-column label="所属部门" prop="deptName" width="250"
						align="center" />
				</el-table>
				<!--				<pagination v-show="organizationUnallocated.total>0" :total="organizationUnallocated.total"-->
				<!--					:page.sync="organizationUnallocated.queryParams.pageNum"-->
				<!--					:limit.sync="organizationUnallocated.queryParams.pageSize"-->
				<!--					@pagination="getOrganizationUnallocatedList" />-->
				<span slot="footer" class="dialog-footer">
					<el-button @click="organizationAddDialogClose">取 消</el-button>
					<el-button type="primary" @click="addOrganization">添加</el-button>
				</span>
			</el-dialog>
			<el-dialog title="策略配置" :visible.sync="tactic3Open" width="40%" :close-on-click-modal="false"
				:close-on-press-escape="false">
				<div v-for="item in tacticList">
					<div class="center-board-row">
						<el-row>
							<div>
								<span>由{{ item.sendOrganizationName }}--</span>
								<span>{{ item.sendUserName }}</span>
								<span>发展,由</span>
								<el-button plain class="ml-2" v-if="item.acceptUserId == 0"
									@click="tacticConfigOpen(item)">
									<span>选择组织</span>
								</el-button>
								<el-button type="primary" class="ml-2" v-if="item.acceptUserId != 0"
									@click="tacticConfigOpen(item)">
									{{ item.acceptOrganizationName }} -- {{ item.acceptUserName }}
								</el-button>
							</div>
						</el-row>
					</div>
				</div>
				<div slot="footer" class="dialog-footer">
					<el-button @click="tacticCancel">取 消</el-button>
					<el-button type="primary" @click="tacticOK">确 定</el-button>

				</div>
			</el-dialog>
			<el-dialog title="选择组织" :visible.sync="tacticOrganizationUserOpen" width="40%" :close-on-click-modal="false"
				:close-on-press-escape="false" :show-close="false">
				<el-tabs v-model="tacticSelectOrganization.organizationName" tab-position="left"
					@tab-click="selectOrganization">
					<el-tab-pane v-for="(item,index) in tacticUserOrganization" :key="item.organizationId"
						:label="item.organizationName" :name="item.organizationName">
						<el-radio-group style="margin:15px 0;text-align: left;min-width: 71%;"
							v-model="tacticAcceptUserId" @change="radioSelectUser">
							<el-radio style="display:block;height: 25px;" v-for="item2 in tacticOrganizationUser"
								:key="item2.userId" :label="item2.userId">
								{{item2.nickName}}
							</el-radio>
						</el-radio-group>
					</el-tab-pane>
				</el-tabs>
				<div slot="footer" class="dialog-footer">
					<el-button type="primary" @click="selectUser">选中</el-button>
					<el-button @click="closeSelectUser">取 消</el-button>
				</div>
			</el-dialog>

		</div>

	</div>
</template>

<script>
	import {
		addAllocated,
		addtweet,
		allocatedOrganizationList,
		edittweet,
		getImgList,
		getInfotweet,
		getmediaTextList,
		getProcutCouponList,
		getsceneFormList,
		getsceneSignList,
		getVideoList,
		organizationAllocatedDelete,
		unallocatedOrganizationList,
		previewBuild,
		getConfigKey,
		getFormSuccessPic,
		getFormSuccessPic_hk,
		getProductMbList,
		getsceneLiveCodeList,
		sceneSysEventList
	} from '../../../api/tool/tweetArticle.js'
	import _ from 'lodash'
	import draggable from 'vuedraggable'
	import beautifier from 'js-beautify'
	import ClipboardJS from 'clipboard'
	import render from '@/utils/generator/render'
	import RightPanelSet from './RightPanelSet'
	import {
		containerComponents,
		containerControlListComponents,
		formConf,
		inputComponents,
		layoutComponents,
		selectComponents
	} from '@/utils/generator/config'
	import {
		beautifierConf,
		titleCase
	} from '@/utils/index'
	import {
		cssStyle,
		makeUpHtml,
		vueScript,
		vueTemplate
	} from '@/utils/generator/html'
	import {
		makeUpJs
	} from '@/utils/generator/js'
	import {
		makeUpCss
	} from '@/utils/generator/css'
	import drawingDefault from '@/utils/generator/drawingDefault'
	import logo from '@/assets/logo/logo.png'
	import CodeTypeDialog from '../build/CodeTypeDialog'
	import DraggableItem from '../build/DraggableItem'
	import peizhishow from './peizhiShow'
	import qrCode from '@/components/tweet/qrCode'
	import {
		organizationUser,
		tweetTactic,
		userOrganization
	} from '../../../api/system/production/tweet'
	import {
		getToken
	} from '@/utils/auth'
	import {
		userUpload
	} from '@/api/system/user'

	let oldActiveId
	let tempActiveData

	export default {
		components: {
			draggable,
			render,
			CodeTypeDialog,
			DraggableItem,
			RightPanelSet,
			peizhishow,
			qrCode
		},
		dicts: ['tweet_share_button'],
		data() {
			return {
				productImage: '',//没用的可删
				bdResultImage: '',//没用的可删
				mbFormData: {},
				mbFormList: [],
				tishiyu_show: false, // 条件 提示语
				type_tsy_num: 0, // 判断 有无 条件容器  0 无  >0有
				longPressTimeout: null,
				drag: null,
				drag_p: null,
				drag_top: 0,
				drag_left: 0,
				form_result_img_url: '', // 表单默认图片
				form_result_img_url_hk: '', // 表单  号卡
				ruleType: '1',
				tishiyuList: [{
						name: '文本',
						label: '1'
					},
					{
						name: '图片形式',
						label: '0'
					}
				],
				ruleText: '',
				zjnr_Height: '',
				conentHeight: '',
				previewUrl: '', //预览链接
				fixedNum: 0,
				oldData: [],
				formShow: false,
				isFixed: false,
				colors: ['#99A9BF', '#F7BA2A', '#FF9900'],
				valueDate6: '',
				valueDate5: '',
				valueDate4: '',
				valueDate2: '',
				valueDate3: '',
				valueDate1: '',
				// ------张伟
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
				},
				tsyImg: {
					fileId: undefined,
					fileOriginalName: '',
					fileVirtualPath: ''
				},
				formTacticsSwitch: false,
				tweetFormList: [], //所有待添加策略的表单
				tweetCouponList: [], //所有待添加策略的优惠券
				couponConfigDisplay: false, // 优惠券配置显示
				formTacticTypes: [{
						code: '1',
						type: '由/当前分发人/分发，由/当前分发人/接受表单留资'
					},
					{
						code: '2',
						type: '由/当前分发人/分发，由/推文创建人/接受表单留资'
					},
					{
						code: '3',
						type: '由 本组织(人)分发，由(用户所拥有组织)(组织下的成员)接受表单留资'
					}
				],
				tactic3Open: false, // 选择策略类型为3时打开当前组织所有人的列表
				tacticList: [], //选择策略类型为3时打开当前组织的用户
				tacticListOld: [], //选择策略类型为3时打开当前组织的用户 旧
				// tacticOldList: [], //选择策略类型为3时打开当前组织的用户
				tacticOrganizationUserOpen: false, // 选择组织和用户对话框开关
				tacticUserOrganization: [], //当前用户所归属的所有组织
				tacticSelectOrganization: {
					organizationId: undefined,
					organizationName: ''
				}, //被选中的组织
				tacticSelectOrganizationId: undefined, //选择组织的id
				tacticSelectOrganizationName: '', //选择组织的名称
				tacticOrganizationUser: [], //当前用户所归属的某一组织下的用户
				tacticSelectUser: {
					sendUserId: 0,
					sendUserName: '',
					sendOrganizationId: 0,
					sendOrganizationName: '',
					acceptUserId: 0,
					acceptUserName: '',
					acceptOrganizationId: 0,
					acceptOrganizationName: '',
					targetId: 0,
					targetType: ''
				}, //选择某一组织下的某一个用户的obj // 好像用不到
				tacticSelectUserOld: {
					sendUserId: 0,
					sendUserName: '',
					sendOrganizationId: 0,
					sendOrganizationName: '',
					acceptUserId: 0,
					acceptUserName: '',
					acceptOrganizationId: 0,
					acceptOrganizationName: '',
					targetId: 0,
					targetType: ''
				},
				tacticAcceptUserId: undefined,
				// tacticSelectUserId: undefined,//选择完组织后选择用户的id
				// ----结束
				canvasSize: 526,
				tweetBackgroundId: '',
				sjkShow: false,
				twbg: '', //推文背景 手机壳不显示
				twbg2: '', //推文背景 -- 手机壳显示
				activeIndex: 0,
				activeElementWidth: 0, //当前选中元素的宽度
				activeElementHeight: 0, //当前选中元素的宽度
				signform_log: {
					title: '',
					queryParams: {
						pageNum: 1,
						pageSize: 8
					},
					formList: [],
					total: 0
				},
				form_log: {
					title: '',
					queryParams: {
						pageNum: 1,
						pageSize: 8
					},
					formList: [],
					total: 0
				},
				text_log: {
					title: '',
					queryParams: {
						pageNum: 1,
						pageSize: 8
					},
					textList: [],
					total: 0
				},
				yhj_log: {
					title: '',
					queryParams: {
						pageNum: 1,
						pageSize: 9
					},
					yhjList: [],
					total: 0
				},
				video_log: {
					title: '',
					queryParams: {
						pageNum: 1,
						pageSize: 12
					},
					videoList: [],
					total: 0
				},
				event_log: {
					title: '',
					queryParams: {
						pageNum: 1,
						pageSize: 12
					},
					eventList: [],
					total: 0
				},
				img_log: {
					title: '',
					queryParams: {
						pageNum: 1,
						pageSize: 12
					},
					arr2: [],
					total: 0
				},
				code_img_log: {
					title: '',
					queryParams: {
						pageNum: 1,
						pageSize: 12
					},
					arr2: [],
					total: 0
				},
				count: 10,
				loading: false,
				is_submit: false,
				ruleForm: {
					// usingFlag: true,
					tweetTitle: '',
					shareButton: '',
					shareButtonArray: ['pyq', 'wx', 'wxcode', 'wximg', 'share', 'sale'],
					pyqText: '',
					shareText: '',
					saleText: '',
					tweetText: '',
					// isDraft: true, //0正文  1草稿
					tweetCommonFlag: false,
					// skipExecuteFlag: false,
					// skipUrl: '',
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
						// {
						//   min: 2,
						//   max: 20,
						//   message: '长度在 2 到 20 个字符',
						//   trigger: 'blur'
						// },
						{
							pattern: /(https?:\/\/)?(([0-9a-z.]+\.[a-z]+)|(([0-9]{1,3}\.){3}[0-9]{1,3}))(:[0-9]+)?(\/[0-9a-z%/.\-_]*)?(\?[0-9a-z=&%_\-]*)?(\#[0-9a-z=&%_\-]*)?/ig,
							message: '请输入正确的跳转链接',
							trigger: 'change'
						}
					]
				},
				delList: [],
				addList: [],
				treeList: [],
				cloneList: [], //克隆
				newcloneList: [],
				formshow: false,
				signformshow: false,
				textshow: false,
				imgshow: false,
				code_imgshow:false,
				event_show:false,
				rqshow: false,
				videoshow: false,
				yhjshow: false,
				activeName: 'first',
				imagePreview: {
					url: '',
					visible: false
				},
				videoPreview: {
					url: '',
					visible: false
				},
				logo,
				idGlobal: 100,
				formConf,
				inputComponents,
				selectComponents,
				layoutComponents,
				containerComponents,
				containerControlListComponents,
				labelWidth: 100,
				drawingList: drawingDefault,
				drawingData: {},
				activeId: drawingDefault[0].formId,
				drawerVisible: false,
				formData: {},
				dialogVisible: false,
				generateConf: null,
				showFileName: false,
				activeData: drawingDefault[0],
				//特殊字段--图片
				tweetId: '',
				checkList: [],
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
				}
			}
		},
		filters: {
			newName(data) {
				if (data.length > 6) {
					return data.slice(0, 6)
				} else {
					return data
				}
			}
		},
		created() {

			// 防止 firefox 下 拖拽 会新打卡一个选项卡
			document.body.ondrop = event => {
				event.preventDefault()
				event.stopPropagation()
			}
			this.conentHeight = window.innerHeight - 124
			this.zjnr_Height = window.innerHeight - 124 - 54

			console.log(window.innerHeight, this.conentHeight, this.zjnr_Height, 'window.innerHeight')
			this.getMbList()
			this.getImgList()
			this.tweetId = this.$route.query.t
			if (!this.tweetId) {
				this.drawingList = []
			} else {
				this.drawingList = []
				this.activeName = 'pz_second'
				this.handleClick()
				this.getInfotweet()
			}
			this.getVideoList()
			this.getProcutCouponList()
			this.getmediaTextList()
			this.getsceneFormList()
			this.getsceneSignList()
			this.getPic()
			this.getsceneLiveCodeList()
			this.getsceneSysEventList()
		},
		watch: {
			// eslint-disable-next-line func-names
			'activeData.label': function(val, oldVal) {
				if (
					this.activeData.placeholder === undefined ||
					!this.activeData.tag ||
					oldActiveId !== this.activeId
				) {
					return
				}
				this.activeData.placeholder = this.activeData.placeholder.replace(oldVal, '') + val
			},
			activeId: {
				handler(val) {
					oldActiveId = val
				},
				immediate: true
			},
		},
		beforeDestroy() {
			window.removeEventListener('resize', this.handleResize);
		},
		mounted() {
			this.handleResize();
			window.addEventListener('resize', this.handleResize);
			const clipboard = new ClipboardJS('#copyNode', {
				text: trigger => {
					const codeStr = this.generateCode()
					this.$notify({
						title: '成功',
						message: '代码已复制到剪切板，可粘贴。',
						type: 'success'
					})
					return codeStr
				}
			})
			clipboard.on('error', e => {
				this.$message.error('代码复制失败')
			})
			let myElement = document.getElementById('leftHeight');
			console.log(myElement, myElement.style, 'distance------');
			// 元素距离页面底部
			// this.bottomHeight = getDistanceToBottom(myElement);
			// console.log(this.bottomHeight,'this.bottomHeight--');
		},
		methods: {
			getMbList(){
				this.mbFormData.status = 0;
				this.mbFormData.organizationId = (sessionStorage.getItem(
					"organizationId") == null || sessionStorage.getItem(
					"organizationId") == "" ? -1 : sessionStorage.getItem(
					"organizationId"));
				getProductMbList(this.mbFormData).then(response => {
					this.mbFormList = response.data;
					console.log(this.mbFormList,'this.mbFormList--模版')
				});
			},
			// getDistanceToBottom(element) {
			//   let rect = element.getBoundingClientRect();
			//   let viewportHeight = window.innerHeight || document.documentElement.clientHeight;

			//   let distanceToBottom = viewportHeight - rect.bottom;

			//   return distanceToBottom;
			// },
			getRefName(item) {
				return item.targetType + item.targetId
			},
			handleResize() {
				this.conentHeight = window.innerHeight - 124
				this.zjnr_Height = window.innerHeight - 124 - 54
			},
			deepCopy(obj) {
				if (typeof obj !== 'object' || obj === null) {
					return obj;
				}

				let clone = Array.isArray(obj) ? [] : {};

				Object.keys(obj).forEach(function(key) {
					clone[key] = this.deepCopy(obj[key]);
				});
				return clone;
			},
			deepCopyArrayLike(obj) {
				var clone = Array.isArray(obj) ? [] : {};

				if (typeof obj === 'object' && obj !== null) {
					// 获取对象的属性
					var keys = Object.keys(obj);

					for (var i = 0; i < keys.length; i++) {
						var key = keys[i];
						var value = obj[key];

						// 在深拷贝数组对象时，递归地拷贝每个元素
						clone[key] = this.deepCopyArrayLike(value);
					}
				}

				return clone;
			},
			jsonArrDrawingList(arr) {
				arr.forEach(item => {
					if (item.children.length != 0) {
						item.children.forEach(v => {
							console.log(typeof(v.cssStyle), 11111)
							if (typeof(v.cssStyle) == 'object') {
								console.log(typeof(v.cssStyle), 22222)
								v.cssStyle = JSON.stringify(v.cssStyle)
							}
						})
					}
				})
				return arr
			},
			jsonArrList(arr) {
				arr.forEach(item => {
					if (typeof(item.cssStyle) == 'object') {
						item.cssStyle = JSON.stringify(item.cssStyle)
					}
				})
				return arr
			},
			formSwitch(item) {
				console.log(item, '表单是否重复提交');
			},
			delImg(val) {
				if (val == 'PRODUCTION_TWEET_SYS_IMG') {
					this.sysImg.fileId = undefined
					this.sysImg.fileOriginalName = ''
					this.sysImg.fileVirtualPath = ''
				} else if (val == 'PRODUCTION_TWEET_WX_IMG') {
					this.wxImg.fileId = undefined
					this.wxImg.fileOriginalName = ''
					this.wxImg.fileVirtualPath = ''
				} else if (val == 'PRODUCTION_TWEET_PYQ_IMG') {
					this.pyqImg.fileId = undefined
					this.pyqImg.fileOriginalName = ''
					this.pyqImg.fileVirtualPath = ''
				} else if (val == 'PRODUCTION_TWEET_RULE_IMG') {
					this.tsyImg.fileId = undefined
					this.tsyImg.fileOriginalName = ''
					this.tsyImg.fileVirtualPath = ''
				}
			},
			// 张伟 --开始
			//展示图 文件上传
			handleAvatarSuccess(res, file, source, item) {
				console.log(res, file, source, item, '文件上传');
				// this.imageUrl = URL.createObjectURL(file.raw);
				if (source == 'PRODUCTION_TWEET_RULE_IMG') {
					this.tsyImg = res.data
				} else if (source == 'PRODUCTION_TWEET_PYQ_IMG') {
					this.pyqImg = res.data
				} else if (source == 'PRODUCTION_TWEET_SYS_IMG') {
					this.sysImg = res.data
				} else if (source == 'PRODUCTION_TWEET_WX_IMG') {
					this.wxImg = res.data
				} else if (source == 'PRODUCTION_TWEET_FORM_RESULT_IMG') {
					for (let i = 0; i < this.tweetFormList.length; i++) {
						if (this.tweetFormList[i].targetId == item.targetId && this.tweetFormList[i].targetType == item
							.targetType) {
							this.$nextTick(() => {
								item.skipImgId = res.data.fileId
								item.skipImg = res.data
							})
							// this.formTacticList[i].skipImg = res.data
							// this.formTacticList[i].skipImgId = res.data.fileId
							console.log(this.tweetFormList, ".............")
							break
						}
					}
				} else if (source == 'PRODUCTION_TWEET_FORM_PRODUCT_IMG') {
					for (let i = 0; i < this.tweetFormList.length; i++) {
						if (this.tweetFormList[i].targetId == item.targetId && this.tweetFormList[i].targetType == item
							.targetType) {
							this.$nextTick(() => {
								item.productImgId = res.data.fileId
								item.productImg = res.data
							})
							// this.formTacticList[i].skipImg = res.data
							// this.formTacticList[i].skipImgId = res.data.fileId
							console.log(this.tweetFormList, ".............")
							break
						}
					}
				}
			},
			productTemplateClick(val,index) {
				console.log(index,val,'index------')
				var obj = {}
				obj = this.mbFormList.find(function(i) {
					return i.id === val
				});
				console.log(obj,'obj----------')
				console.log(this.mbFormList,'this.mbFormListthis.mbFormList----------')
				console.log(this.tweetFormList[index],'this.tweetFormList[index]')
				this.tweetFormList[index].bdResultImage = obj.bdResultImage
				this.tweetFormList[index].productImage = obj.productImage
				// this.productImage = obj.productImage;
				// this.bdResultImage = obj.bdResultImage;
			},
			beforeAvatarUpload(file, source) {
				console.log(file, source, 'file, source---');
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
			tacticTypeChange(item) {
				console.log(item, 'tactic3Change(item,type)-------------------')
			},
			tactic3OpenHandle(item) {
				console.log(item, "........当前打开策略")
				// item元素中所有表单中的某一个
				if (item.tacticType == '3' && item.tweetTactics.length > 0) {
					// 用于修改
					console.log("==============用于修改")
					this.tacticList = item.tweetTactics
					this.tacticListOld = JSON.stringify(this.tacticList)
					console.log(this.tacticList, "..........策略数据")
					console.log(this.tacticListOld, "..........策略数据原")
					this.tactic3Open = true
				} else {
					let params = {
						organizationId: sessionStorage.getItem('organizationId')
					}
					organizationUser(params).then(response => {
						this.tacticList = []
						this.tacticListOld = []
						if (response.data) {
							let organizationUsers = response.data
							for (let i = 0; i < organizationUsers.length; i++) {
								let obj = {
									sendUserId: organizationUsers[i].userId,
									sendUserName: organizationUsers[i].nickName,
									sendOrganizationId: organizationUsers[i].organizationId,
									sendOrganizationName: organizationUsers[i].organizationName,
									acceptUserId: 0,
									acceptUserName: '',
									acceptOrganizationId: 0,
									acceptOrganizationName: '',
									targetId: item.targetId,
									targetType: item.targetType,
								}
								this.tacticList.push(obj)
							}
							this.tacticListOld = JSON.stringify(this.tacticList)
							this.tactic3Open = true
						}
						console.log(this.tacticList, "..........策略数据")
						console.log(this.tacticListOld, "..........策略数据原")
					})
				}
			},
			tacticConfigOpen(item) {
				console.log(item, "..........策略中当前组织下的某一个发送人")
				this.tacticOrganizationUser = []
				this.tacticSelectUser = item
				this.tacticSelectUserOld = this.tacticSelectUser
				console.log(this.tacticSelectUser, ".......this.tacticSelectUser")
				console.log(this.tacticSelectUserOld, ".......this.tacticSelectUserOld")
				userOrganization().then(response => {
					this.tacticUserOrganization = response.data
					this.tacticSelectOrganization.organizationId = this.tacticSelectUser.acceptOrganizationId ==
						0 ? this.tacticUserOrganization[0].organizationId : this.tacticSelectUser
						.acceptOrganizationId
					this.tacticSelectOrganization.organizationName = this.tacticSelectUser
						.acceptOrganizationName == '' ? this.tacticUserOrganization[0].organizationName : this
						.tacticSelectUser.acceptOrganizationName
					let params = {
						organizationId: this.tacticSelectOrganization.organizationId
					}
					organizationUser(params).then(response => {
						if (response.data) {
							this.tacticOrganizationUser = response.data
						}
					})
					this.tacticOrganizationUserOpen = true
				})
				// this.tacticSelectUser.acceptUserId = undefined
			},
			tacticConfigClose() {
				this.tacticOrganizationUserOpen = false
			},
			selectOrganization(e) {
				console.log(e, '...................选择组织')
				this.tacticSelectOrganization.organizationId = this.tacticUserOrganization[e.index].organizationId
				this.tacticSelectOrganization.organizationName = this.tacticUserOrganization[e.index].organizationName
				this.tacticOrganizationUser = []
				console.log(e.$vnode.key, ".............当前组织节点")
				let params = {
					organizationId: e.$vnode.key
				}
				organizationUser(params).then(response => {
					if (response.data) {
						this.tacticOrganizationUser = response.data
					}
				})
			},
			selectUser() { //选择用户
				if (this.tacticAcceptUserId == undefined) {
					this.$message.error('请选中接收人')
				}
				this.tacticSelectUser.acceptUserId = this.tacticAcceptUserId
				console.log(this.tacticSelectUser, "........当前选中用户")

				this.tacticOrganizationUser.forEach(item => {
					if (this.tacticSelectUser.acceptUserId == item.userId) {
						this.tacticSelectUser.acceptUserName = item.nickName
					}
				})
				this.tacticSelectUser.acceptOrganizationId = this.tacticSelectOrganization.organizationId
				this.tacticSelectUser.acceptOrganizationName = this.tacticSelectOrganization.organizationName
				console.log(this.tacticSelectUser, "..........当前操作的发送人")

				for (let i = 0; i < this.tacticList.length; i++) {
					if (this.tacticList[i].targetId == this.tacticSelectUser.targetId &&
						this.tacticList[i].targetType == this.tacticSelectUser.targetType &&
						this.tacticList[i].sendUserId == this.tacticSelectUser.sendUserId) {
						this.tacticList[i] = this.tacticSelectUser
						console.log(this.tacticList, "..........当前发送人策略回归")
						break
					}
				}
				this.tacticOrganizationUserOpen = false
				this.tacticSelectUser = {
					sendUserId: 0,
					sendUserName: '',
					sendOrganizationId: 0,
					sendOrganizationName: '',
					acceptUserId: 0,
					acceptUserName: '',
					acceptOrganizationId: 0,
					acceptOrganizationName: '',
					targetId: 0,
					targetType: ''
				}
				this.tacticAcceptUserId = undefined
			},
			radioSelectUser(e) {
				console.log(e, ".................radioSelectUser")
				this.tacticOrganizationUser.forEach(item => {
					if (e.acceptUserId == item.userId) {
						this.tacticSelectUser.acceptUserName = item.nickName
					}
				})
			},
			closeSelectUser() {
				// this.tacticSelectUser.acceptUserId = undefined
				// if(this.tweetId){
				//   let params = {
				//     tweetId : this.tweetId,
				//     targetType : this.tacticSelectUser.targetType,
				//     targetId : this.tacticSelectUser.targetId
				//   }
				//   tweetTactic(params).then(res=>{
				//     console.log(res.data,".............取消选择用户....data")
				//     if(res.data){
				//       let tacticList = res.data
				//       for (let i = 0; i < this.tweetFormList.length; i++) {
				//         //策略是3
				//         if(this.tweetFormList[i].tacticType=='3'){
				//           this.tweetFormList[i].tweetTactics;//当前策略组
				//           for (let j = 0; j < this.tweetFormList[i].tweetTactics.length; j++) {
				//             for (let k = 0; k < tacticList.length; k++) {
				//               if (this.tweetFormList[i].tweetTactics[j].sendUserId==tacticList[k].sendUserId && this.tweetFormList[i].tweetTactics[j].sendOrganizationId==tacticList[k].sendOrganizationId){
				//                 this.tweetFormList[i].tweetTactics[j] = tacticList[k]
				//                 // this.tacticList = tacticList
				//                 for (let l = 0; l < this.tacticList.length; l++) {
				//                   if(this.tacticList[l].sendUserId==tacticList[k].sendUserId&&this.tacticList[l].sendOrganizationId == tacticList[k].sendOrganizationId){
				//                     this.tacticList[l]=tacticList[k]
				//                     this.tactic3Open = false
				//                     this.tactic3Open = true
				//                     console.log(this.tacticList,".............this.tacticList")
				//                     console.log(this.tacticList[l],".............this.tacticList[l]")
				//                     console.log(tacticList[k],".................tacticList[k]")
				//                   }
				//                   break
				//                 }
				//               }
				//             }
				//           }
				//         }
				//       }
				//     }
				//   })
				// }else{
				for (let i = 0; i < this.tacticList.length; i++) {
					if (this.tacticList[i].sendUserId == this.tacticSelectUserOld.sendUserId && this.tacticList[i]
						.sendOrganizationId == this.tacticSelectUserOld.sendOrganizationId) {
						console.log("取消else")
						this.tacticList[i] = this.tacticSelectUserOld
						console.log(this.tacticList, ".......this.tacticList")
						console.log(this.tacticSelectUser, ".......this.tacticSelectUser")
						console.log(this.tacticSelectUserOld, ".......this.tacticSelectUserOld")
						this.tactic3Open = false
						this.tactic3Open = true
						break
					}
				}
				// }
				this.tacticAcceptUserId = undefined
				this.tacticOrganizationUserOpen = false
				console.log(this.tacticSelectUser, ".............取消选择用户")
			},
			//策略弹窗确认
			tacticOK() {
				//将策略放入集合中
				let organizationUser = this.tacticList
				for (let i = 0; i < organizationUser.length; i++) {
					for (let j = 0; j < this.tweetFormList.length; j++) {
						if (organizationUser[i].targetId == this.tweetFormList[j].targetId && organizationUser[i]
							.targetType == this.tweetFormList[j].targetType) {
							this.tweetFormList[j].tweetTactics = organizationUser
							break
						}
					}
				}
				this.tactic3Open = false
				console.log(this.drawingList, '............tacticOK')
			},
			//擦略弹窗取消
			tacticCancel() {
				this.tacticListOld = JSON.parse(this.tacticListOld)
				console.log(this.tacticList, "策略数据.............")
				console.log(this.tacticListOld, "原数据.............")
				for (let i = 0; i < this.tacticListOld.length; i++) {
					for (let j = 0; j < this.tweetFormList.length; j++) {
						if (this.tacticListOld[i].targetId == this.tweetFormList[j].targetId && this.tacticListOld[i]
							.targetType == this.tweetFormList[j].targetType) {
							this.tweetFormList[j].tweetTactics = this.tacticListOld
							break
						}
					}
				}
				this.tactic3Open = false
			},
			// 张伟---结束
			getLogList(item) {
				if (item == 'img') {
					this.getImgList()
				} else if (item == 'video') {
					this.getVideoList()
				} else if (item == 'yhj') {
					this.getProcutCouponList()
				} else if (item == 'text') {
					this.getmediaTextList()
				} else if (item == 'form') {
					this.getsceneFormList()
				} else if (item == 'sign') {
					this.getsceneSignList()
				} else if(item == 'code_img'){
					this.getsceneLiveCodeList()
				} else if(item == 'event'){
					this.getsceneSysEventList()
				}
			},
			getImgList() {
				this.$modal.loading('正在请求数据，请稍候...')
				let data = {
					pageNum: this.img_log.queryParams.pageNum,
					pageSize: this.img_log.queryParams.pageSize,
					organizationId: sessionStorage.getItem('organizationId')
				}
				getImgList(this.addDateRange(data, [])).then(res => {
					this.$modal.closeLoading()
					this.img_log.total = res.total
					let a = []
					if (res.rows) {
						res.rows.forEach(item => {
							item.compressionFile.fileVirtualPath = item.compressionFile.fileVirtualPath
								.replace('205.12', '25.12')
							// item.compressionFile.imageUsingFlag = item.imageUsingFlag
							item.compressionFile.fileId = item.fileId
							item.compressionFile.imageId = item.imageId
							item.compressionFile.name = item.imageTitle
							item.compressionFile.targetId = item.imageId
							a.push(item.compressionFile)
						})
					}
					this.img_log.arr2 = a.map(v => {
						return {
							...v,
							label: '',
							name: v.name,
							tag: 'el-image',
							style: {
								width: '120px'
							},
							labelWidth: null, // 标签宽度
							src: v.fileVirtualPath,
							targetType: 'MEDIA_IMAGE',
							targetId: v.targetId, //目标id
							warning: '',
							cssStyle: {
								height: 0,
								width: 232,
								pm_width: 232,
								top_margin: 0, //上边距
								left_margin: 0, //左边距
								scaleLeftValue: 0, //缩放后的左边距
								scaleTopValue: 0, //缩放后的上边距
								right_margin: 0, //右边距
								t_transform: 'scale(1)', //缩放
								scaleValue: 1, //缩放
								pic_zindex: 0, //图层顺序
								bg_switch: false, //推文背景
								bg_disabled: false, //背景--标识
								form_bg_switch: false, //表单背景
								form_bg_disabled: false, //背景--标识
								topMarginMax: 1000,
								topMarginMin: -200,
								leftMarginMax: 1000,
								leftMarginMin: -200,
							}
						}
					})
				})
			},
			getVideoList() {
				this.$modal.loading('正在请求数据，请稍候...')
				let data = {
					pageNum: this.video_log.queryParams.pageNum,
					pageSize: this.video_log.queryParams.pageSize,
					organizationId: sessionStorage.getItem('organizationId')
				}
				getVideoList(data).then(res => {
					this.$modal.closeLoading()
					this.video_log.total = res.total
					let a = []
					if (res.rows) {
						res.rows.forEach(item => {
							item.file.fileVirtualPath = item.file.fileVirtualPath.replace('205.12',
								'25.12')
							item.file.imageUsingFlag = item.imageUsingFlag
							item.file.name = item.videoTitle
							item.file.targetId = item.videoId
							a.push(item.file)
						})
					}
					this.video_log.videoList = a.map(v => {
						return {
							...v,
							label: '',
							name: v.name,
							tag: 'video',
							style: {
								width: '120px'
							},
							labelWidth: null, // 标签宽度
							src: v.fileVirtualPath,
							targetType: 'MEDIA_VIDEO',
							targetId: v.targetId, //目标id
							warning: '',
							cssStyle: {
								height: 0,
								width: 232,
								pm_width: 232,
								top_margin: 0, //上边距
								left_margin: 0, //左边距
								scaleLeftValue: 0, //缩放后的左边距
								scaleTopValue: 0, //缩放后的上边距
								right_margin: 0, //右边距
								t_transform: 'scale(1)', //缩放
								scaleValue: 1, //缩放
								pic_zindex: 0, //图层顺序
								topMarginMax: 1000,
								topMarginMin: -200,
								leftMarginMax: 1000,
								leftMarginMin: -200,
							}
						}
					})
				})
			},
			getsceneSysEventList(){
				this.$modal.loading('正在请求数据，请稍候...')
				let data = {
					pageNum: this.event_log.queryParams.pageNum,
					pageSize: this.event_log.queryParams.pageSize,
					organizationId: sessionStorage.getItem('organizationId'),
				}
				sceneSysEventList(data).then(res=>{
					this.$modal.closeLoading()
					this.event_log.eventList = res.rows
					this.event_log.total = res.total
					console.log(this.event_log.eventList,'res=======');
					this.event_log.eventList = this.event_log.eventList.map(v => {
						console.log(v.suspension,'suspension---')
						return {
							...v,
							label: '',
							name: v.title,
							tag: 'el-image',
							style: {
								width: '120px'
							},
							labelWidth: null, // 标签宽度
							src: v.initialImage.fileVirtualPath,
							suspension:v.suspension,
							targetType: 'EVENT',
							targetId: v.id, //目标id
							warning: '',
							cssStyle: {
								height: 0,
								width: 232,
								pm_width: 232,
								top_margin: 0, //上边距
								left_margin: 0, //左边距
								scaleLeftValue: 0, //缩放后的左边距
								scaleTopValue: 0, //缩放后的上边距
								right_margin: 0, //右边距
								t_transform: 'scale(1)', //缩放
								scaleValue: 1, //缩放
								pic_zindex: 0, //图层顺序
								bg_switch: false, //推文背景
								bg_disabled: false, //背景--标识
								form_bg_switch: false, //表单背景
								form_bg_disabled: false, //背景--标识
								topMarginMax: 1000,
								topMarginMin: -200,
								leftMarginMax: 1000,
								leftMarginMin: -200,
							}
						}
					})
					
				})
			},
			getProcutCouponList() {
				this.$modal.loading('正在请求数据，请稍候...')
				let data = {
					pageNum: this.yhj_log.queryParams.pageNum,
					pageSize: this.yhj_log.queryParams.pageSize,
					organizationId: sessionStorage.getItem('organizationId'),
					couponType: 1
				}
				getProcutCouponList(data).then(res => {
					console.log(res, '优惠卷----')
					this.$modal.closeLoading()
					this.yhj_log.total = res.total
					let a = []
					if (res.rows) {
						res.rows = res.rows.map(item => {
							return {
								...item,
								couponBgFile: {
									fileVirtualPath: item.gainBeforeImg,
									couponId: item.couponId,
									name: item.couponName,
									couponType: item.couponType,
									minPrice: item.minPrice,
									money: item.money,
									targetId: item.couponId,
									couponContent: item.couponContent,
								}
							}
						})
					}
					this.yhj_log.yhjList = res.rows.map(v => {
						return {
							...v,
							label: '',
							name: v.couponName,
							tag: 'div',
							labelWidth: null,
							style: {
								width: '120px',
								background: `url(${v.gainBeforeImg})`,
								backgroundSize: '120px',
								height: '70px',
								color: '#fff'
							},
							title: v.couponName,
							// content: '使用门槛' + v.minPrice,
							src: v.gainBeforeImg,
							options: [{
								label: '选项一',
								value: 1
							}, {
								label: '选项二',
								value: 2
							}],
							targetType: 'PRODUCT_COUPON',
							targetId: v.couponBgFile.targetId,
							warning: '',
							couponLimitGain: 1,
							cssStyle: {
								height: 0,
								width: 232,
								pm_width: 232,
								top_margin: 0, //上边距
								left_margin: 0, //左边距
								scaleLeftValue: 0, //缩放后的左边距
								scaleTopValue: 0, //缩放后的上边距
								right_margin: 0, //右边距
								t_transform: 'scale(1)', //缩放
								scaleValue: 1, //缩放
								pic_zindex: 0, //图层顺序
								topMarginMax: 1000,
								topMarginMin: -200,
								leftMarginMax: 1000,
								leftMarginMin: -200,
							}
						}
					})
				})
			},
			getmediaTextList() {
				this.$modal.loading('正在请求数据，请稍候...')
				let data = {
					pageNum: this.text_log.queryParams.pageNum,
					pageSize: this.text_log.queryParams.pageSize,
					organizationId: sessionStorage.getItem('organizationId')
				}
				getmediaTextList(data).then(res => {
					this.text_log.total = res.total
					this.$modal.closeLoading()
					let a = []
					if (res.rows) {
						res.rows.forEach(item => {
							a.push(item)
						})
					}
					this.text_log.textList = a.map(v => {
						return {
							...v,
							label: '',
							name: v.textTitle,
							tag: 'h2',
							labelWidth: null,
							style: {
								width: '120px',
								height: '70px',
								color: '#333',
								overflow: 'hidden',
								wordWrap: 'break-word',
								lineHeight: '22px'
							},
							title: v.textTitle,
							content: v.textContent,
							options: [{
								label: '选项一',
								value: 1
							}, {
								label: '选项二',
								value: 2
							}],
							targetType: 'MEDIA_TEXT',
							targetId: v.textId,
							warning: '',
							cssStyle: {
								height: 0,
								width: 232,
								pm_width: 232,
								top_margin: 0, //上边距
								left_margin: 0, //左边距
								right_margin: 0, //右边距
								scaleLeftValue: 0, //缩放后的左边距
								scaleTopValue: 0, //缩放后的上边距
								t_transform: 'scale(1)', //缩放
								scaleValue: 1, //缩放
								pic_zindex: 0, //图层顺序
								topMarginMax: 1000,
								topMarginMin: -200,
								leftMarginMax: 1000,
								leftMarginMin: -200,
							}
						}
					})
				})
			},
			getsceneLiveCodeList(){
				this.$modal.loading('正在请求数据，请稍候...')
				let data = {
					pageNum: this.form_log.queryParams.pageNum,
					pageSize: this.form_log.queryParams.pageSize,
					organizationId: sessionStorage.getItem('organizationId')
				}
				getsceneLiveCodeList(data).then(res => {
					this.$modal.closeLoading()
					this.code_img_log.total = res.total
					let a = []
					if (res.rows) {
						res.rows.forEach(item => {
							item.image.fileVirtualPath = item.image.fileVirtualPath
							item.image.name = item.title
							item.image.targetId = item.id
							a.push(item.image)
						})
					}
					this.code_img_log.arr2 = a.map(v => {
						console.log(v,'v--------')
						return {
							...v,
							label: '',
							name: v.name,
							tag: 'el-image',
							style: {
								width: '120px'
							},
							labelWidth: null, // 标签宽度
							src: v.fileVirtualPath,
							targetType: 'SCENE_LIVE_CODE',
							targetId: v.targetId, //目标id
							warning: '',
							cssStyle: {
								height: 0,
								width: 232,
								pm_width: 232,
								top_margin: 0, //上边距
								left_margin: 0, //左边距
								scaleLeftValue: 0, //缩放后的左边距
								scaleTopValue: 0, //缩放后的上边距
								right_margin: 0, //右边距
								t_transform: 'scale(1)', //缩放
								scaleValue: 1, //缩放
								pic_zindex: 0, //图层顺序
								bg_switch: false, //推文背景
								bg_disabled: false, //背景--标识
								form_bg_switch: false, //表单背景
								form_bg_disabled: false, //背景--标识
								topMarginMax: 1000,
								topMarginMin: -200,
								leftMarginMax: 1000,
								leftMarginMin: -200,
							}
						}
					})
					console.log(this.code_img_log.arr2,'货吗---')
				})
			},
			getsceneFormList() {
				this.$modal.loading('正在请求数据，请稍候...')
				let data = {
					pageNum: this.form_log.queryParams.pageNum,
					pageSize: this.form_log.queryParams.pageSize,
					organizationId: sessionStorage.getItem('organizationId')
				}
				getsceneFormList(data).then(res => {
					this.$modal.closeLoading()
					this.form_log.total = res.total
					this.form_log.formList = res.rows.map(v => {
						return {
							...v,
							label: '',
							bdResultImage:'',//结果页默认图，
							productImage:'',//产品默认图
							formRadio: [{
									name: '是',
									label: '0'
								},
								{
									name: '否',
									label: '1'
								}
							],
							formPicRadio: [{
									name: '默认',
									label: '0'
								},
								{
									name: '自定义',
									label: '1'
								}
							],
							labelWidth: null,
							style: {
								width: '120px',
								height: '70px',
								color: '#333',
								overflow: 'hidden',
								wordWrap: 'break-word',
								lineHeight: '22px'
							},
							// title: v.textTitle,
							// title: v.title,
							options: [{
								label: '选项一',
								value: 1
							}, {
								label: '选项二',
								value: 2
							}],
							tag: 'h1',
							// tag: 'form',
							name: v.title,
							productName: v.title,
							targetType: 'SCENE_FORM',
							isclick: false,
							targetId: v.id,
							warning: '',
							tacticType: '2', // 表单策略默认为第二个
							tweetTactics: [],
							skipType: '1',
							skipUrl: '',
							skipImg: {
								fileId: undefined,
								fileOriginalName: '',
								fileVirtualPath: ''
							},
							productImg: {
								fileId: undefined,
								fileOriginalName: '',
								fileVirtualPath: ''
							},
							skipImgType: '0',
							productImgType: '0',
							formRepeatType: '0', //代表该表单为可重复，默认为可重复，开关为关闭状态。
							productTemplate: undefined, //代表该表单产品模板
							skipImgId: undefined,
							productimgid: undefined,
							cssStyle: {
								height: 0,
								width: 232,
								pm_width: 232,
								top_margin: 0, //上边距
								left_margin: 0, //左边距
								scaleLeftValue: 0, //缩放后的左边距
								scaleTopValue: 0, //缩放后的上边距
								right_margin: 0, //右边距
								t_transform: 'scale(1)', //缩放
								scaleValue: 1, //缩放
								pic_zindex: 0, //图层顺序
								topMarginMax: 1000,
								topMarginMin: -200,
								leftMarginMax: 1000,
								leftMarginMin: -200,
								isFixed: false,
							}
						}
					})
				})
			},
			getPic() {
				this.$modal.loading('正在请求数据，请稍候...')
				getFormSuccessPic().then(res => {
					this.form_result_img_url = res.msg
				})
				getFormSuccessPic_hk().then(r => {
					this.form_result_img_url_hk = r.msg
					console.log(this.form_result_img_url_hk, 'r2----------');
				})
			},
			getsceneSignList() {
				this.$modal.loading('正在请求数据，请稍候...')
				let data = {
					pageNum: this.signform_log.queryParams.pageNum,
					pageSize: this.signform_log.queryParams.pageSize,
					organizationId: sessionStorage.getItem('organizationId')
				}
				getsceneSignList(data).then(res => {
					this.$modal.closeLoading()
					this.signform_log.total = res.total
					this.signform_log.formList = res.rows.map(v => {
						return {
							...v,
							label: '',
							labelWidth: null,
							style: {
								width: '120px',
								height: '70px',
								color: '#333',
								overflow: 'hidden',
								wordWrap: 'break-word',
								lineHeight: '22px'
							},
							name: v.title,
							options: [{
								label: '选项一',
								value: 1
							}, {
								label: '选项二',
								value: 2
							}],
							tag: 'span',
							title: v.title,
							targetType: 'SCENE_SIGN',
							isclick: false,
							targetId: v.id,
							warning: '',
							cssStyle: {
								height: 0,
								width: 232,
								pm_width: 232,
								top_margin: 0, //上边距
								left_margin: 0, //左边距
								scaleLeftValue: 0, //缩放后的左边距
								scaleTopValue: 0, //缩放后的上边距
								right_margin: 0, //右边距
								t_transform: 'scale(1)', //缩放
								scaleValue: 1, //缩放
								pic_zindex: 0, //图层顺序
								topMarginMax: 1000,
								topMarginMin: -200,
								leftMarginMax: 1000,
								leftMarginMin: -200,
								isFixed: false,
							}
						}
					})
				})
			},

			getInfotweet() {
				this.$modal.loading('正在请求数据，请稍候...')
				let data = {
					'tweetId': this.tweetId
				}
				getInfotweet(data).then(res => {
					// this.fixedNum = 0
					console.log(res, '详情---111');
					
					
					this.$modal.closeLoading()
					this.tweetBackgroundId = res.data.tweetBackgroundId
					this.ruleForm.channelStatus = res.data.channelStatus
					this.tweetchannelStatusChange()
					if(res.data.canvasSize){
						this.canvasSize = res.data.canvasSize - 0
					} else {
						this.canvasSize = 526 - 0
					}
					this.ruleText = res.data.ruleText
					this.ruleType = res.data.ruleType
					this.$refs.child_show.getDetaileRulr(this.ruleText)
					this.$refs.child_show.getDetaileCanvasSize(this.canvasSize)
					console.log(this.canvasSize, res.data.canvasSize,'canvasSize---');
					this.twbg2 = ''
					this.twbg = ''
					// if (res.data.tweetBackground) {
					// 	this.twbg2 = res.data.tweetBackground.fileVirtualPath
					// 	console.log(this.twbg2,'this.twbg2----推文背景');
					// }
					this.$refs.child_show.getBg(this.twbg2)
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
						// if (res.data.allocatedOrganizationIds) {
						// 	this.organizationAllocated.queryParams.allocatedIds = []
						// 	let allocatedOrganizationIds = res.data.allocatedOrganizationIds.split(',')
						// 	for (let i = 0; i < allocatedOrganizationIds.length; i++) {
						// 		this.organizationAllocated.queryParams.allocatedIds.push(allocatedOrganizationIds[
						// 			i])
						// 	}
						// }
						// this.tweetCommonFlagChange()
						this.organizationAllocated.list = []
						this.organizationAllocated.list = res.data.allocatedOrganization
					}
					if (res.data.sysImgId && res.data.sysImg) {
						this.sysImg = res.data.sysImg
					}
					if (res.data.wxImgId && res.data.wxImg) {
						this.wxImg = res.data.wxImg
					}
					if (res.data.pyqImgId && res.data.pyqImg) {
						this.pyqImg = res.data.pyqImg
					}
					if (res.data.ruleImgUrl) {
						this.tsyImg.fileVirtualPath = res.data.ruleImgUrl
					}

					let arr = res.data.containers.map(item => {
						return {
							...item,
							num: item.elemNum,
							activnum: item.elemUseNum,
							layout: 'rowFormItem',
							tagIcon: 'row',
							layoutTree: true,
							lx: 'rongqi',
							componentName: item.isCondContainer == 1 ? '条件容器' : '非条件容器',
							name: item.isCondContainer == 1 ? '条件容器' : '非条件容器',
							jhNumList: [{
									name: '最少激活数量',
									label: false
								},
								{
									name: '最少激活数量',
									label: true
								}
							],
						}
					})
					console.log(arr, '详情arr')

					arr.forEach((v, vindex) => {

						v.children.forEach((c, cindex) => {
							if (typeof(c.cssStyle) == 'string') {
								c.cssStyle = JSON.parse(c.cssStyle)
							}
							if (c.targetType == 'MEDIA_IMAGE') {
								c.fileId = c.target.fileId
								c.name = c.target.imageTitle
								c.src = c.target.compressionFile.fileVirtualPath.replace(
									'205.12', '25.12')
								c.tag = 'el-image'
								c.style = {
									'width': '120px'
								}
								// c.labelWidth=null
								c.formId = '1' + '.' + vindex + '.' + cindex,
									// c.span= 24,
									// c.renderKey= 1691998832712,
									c.layout = 'colFormItem'
								// c.vModel="field102"
							} else if(c.targetType == 'SCENE_LIVE_CODE'){
								c.name = c.target.image.fileOriginalName
								c.src = c.target.image.fileVirtualPath
								c.tag = 'el-image'
								c.style = {
									'width': '120px'
								}
								c.formId = '7' + '.' + vindex + '.' + cindex,
								c.layout = 'colFormItem'
							} else if(c.targetType == 'EVENT'){
								console.log(c,'c--enebt-----');
								c.name = c.target.title
								c.suspension =  c.target.suspension
								c.src = c.target.initialImage.fileVirtualPath
								c.tag = 'el-image'
								c.style = {
									'width': '120px'
								}
								c.formId = '8' + '.' + vindex + '.' + cindex,
								c.layout = 'colFormItem'
							} else if (c.targetType == 'MEDIA_VIDEO') {
								c.name = c.target.videoTitle,
									c.src = c.target.file.fileVirtualPath.replace(
										'205.12', '25.12')
								c.layout = 'colFormItem',
									c.tag = 'video',
									c.formId = '2' + '.' + vindex + '.' + cindex,
									c.style = {
										'width': '120px'
									}
							} else if (c.targetType == 'MEDIA_TEXT') {
								c.name = c.target.textTitle,
									c.tag = 'h2'
								c.layout = 'colFormItem',
									c.label = '',
									c.formId = '3' + '.' + vindex + '.' + cindex,
									c.labelWidth = null,
									c.style = {
										width: '120px',
										height: '70px',
										color: '#333',
										overflow: 'hidden',
										wordWrap: 'break-word',
										lineHeight: '22px'
									},
									c.title = c.target.textTitle,
									c.content = c.target.textContent,
									c.options = [{
										label: '选项一',
										value: 1
									}, {
										label: '选项二',
										value: 2
									}]
							} else if (c.targetType == 'SCENE_FORM') {
								c.bdResultImage = '',
							    c.productImage = '',
								c.formRadio = [{
											name: '是',
											label: '0'
										},
										{
											name: '否',
											label: '1'
										}
									],
									c.formPicRadio = [{
											name: '默认',
											label: '0'
										},
										{
											name: '自定义',
											label: '1'
										}
									],
									c.skipImgType = c.skipImgType,
									c.formRepeatType = c.formRepeatType
								c.productName = c.productName
								c.productTemplate = c.productTemplate
								c.showType = c.target.showType
								c.showTweet = c.target.showTweet
								c.tipInfo = c.target.tipInfo
								c.submitAfter = c.target.submitAfter,
									c.submitBefore = c.target.submitBefore,
									c.tag = 'h1'
								c.layout = 'colFormItem',
									c.label = '',
									c.formId = '4' + '.' + vindex + '.' + cindex,
									c.labelWidth = null,
									c.style = {
										width: '120px',
										height: '40px !important',
										color: '#333',
										overflow: 'hidden',
										wordWrap: 'break-word'
									},
									c.isclick = false,
									c.title = c.target.title,
									c.name = c.target.title,
									c.elementList = c.target.elementList,
									c.options = [{
										label: '选项一',
										value: 1
									}, {
										label: '选项二',
										value: 2
									}]
								console.log(c, '详情---SCENE_FORM')
							} else if (c.targetType == 'PRODUCT_COUPON') {
								c.couponId = c.target.couponId,
									c.couponType = c.target.couponType,
									c.minPrice = c.target.minPrice,
									c.money = c.target.money,
									c.targetId = c.target.couponId,
									c.couponContent = c.target.couponContent,
									c.src = c.target.gainBeforeImg,
									c.name = c.target.couponName,
									c.tag = 'div'
								c.layout = 'colFormItem',
									c.label = '',
									c.formId = '5' + '.' + vindex + '.' + cindex,
									c.labelWidth = null,
									c.style = {
										width: '120px',
										background: `url(${c.target.gainBeforeImg})`,
										backgroundSize: '120px',
										height: '70px',
										color: '#fff'
									},
									c.title = c.target.couponName,
									// c.content = '使用门槛' + c.target.minPrice,
									c.options = [{
										label: '选项一',
										value: 1
									}, {
										label: '选项二',
										value: 2
									}]
							} else if (c.targetType == 'SCENE_SIGN') {
								c.submitAfter = c.target.submitAfter,
									c.submitBefore = c.target.submitBefore,
									c.tag = 'span'
								c.layout = 'colFormItem',
									c.name = c.textTitle,
									c.label = '',
									c.formId = '4' + '.' + vindex + '.' + cindex,
									c.labelWidth = null,
									c.style = {
										width: '120px',
										height: '70px',
										color: '#333',
										overflow: 'hidden',
										wordWrap: 'break-word',
										lineHeight: '22px'
									},
									c.title = c.target.title,
									c.name = c.target.title,
									c.elementList = c.target.elementList,
									c.options = [{
										label: '选项一',
										value: 1
									}, {
										label: '选项二',
										value: 2
									}]
							}
						})
					})
					this.drawingList = arr
					this.drawingList.forEach(q => {
						if (q.isCondContainer == '1') {
							// q.elemAllFlag = q.elemAllFlag == 0 ? false : true,
							if (q.elemAllFlag == 0) {
								q.elemAllFlag = false
							} else {
								q.elemAllFlag = true
							}
						}
						if (q.targetType == "SCENE_FORM") {
							if (q.cssStyle.isFixed == true) {
								this.fixedNum = 1
							}
						}
					})
					console.log(this.drawingList, '详情====')
					this.treeList = res.data.showElems
					this.treeList.forEach((cc, ci) => {
						if (typeof(cc.cssStyle) == 'string') {
							cc.cssStyle = JSON.parse(cc.cssStyle)
						}
						if (cc.targetType == 'MEDIA_IMAGE') {
							cc.fileId = cc.target.fileId
							cc.name = cc.target.imageTitle
							cc.src = cc.target.compressionFile.fileVirtualPath.replace(
								'205.12', '25.12')
							cc.tag = 'el-image'
							cc.style = {
								'width': '120px'
							}
							// c.labelWidth=null
							cc.formId = '1' + '..' + ci,
								// c.span= 24,
								// c.renderKey= 1691998832712,
								cc.layout = 'colFormItem'
							// c.vModel="field102"
						} else if(cc.targetType == 'SCENE_LIVE_CODE'){
								cc.name = cc.target.image.fileOriginalName
								cc.src = cc.target.image.fileVirtualPath
								cc.tag = 'el-image'
								cc.style = {
									'width': '120px'
								}
								cc.formId = '7' + '..' + ci,
								cc.layout = 'colFormItem'
						} else if(cc.targetType == 'EVENT'){
								console.log(cc,'c--enebt-----');
								cc.name = cc.target.title
								cc.suspension =  cc.target.suspension
								cc.src = cc.target.initialImage.fileVirtualPath
								cc.tag = 'el-image'
								cc.style = {
									'width': '120px'
								}
								cc.formId = '8' + '..' + ci,
								cc.layout = 'colFormItem'
						} else if (cc.targetType == 'MEDIA_VIDEO') {
							cc.name = cc.target.videoTitle,
								cc.src = cc.target.file.fileVirtualPath.replace(
									'205.12', '25.12')
							cc.layout = 'colFormItem',
								cc.tag = 'video',
								cc.formId = '2' + '.' + ci,
								cc.style = {
									'width': '120px'
								}
						} else if (cc.targetType == 'MEDIA_TEXT') {
							cc.name = cc.target.textTitle,
								cc.tag = 'h2'
							cc.layout = 'colFormItem',
								cc.label = '',
								cc.formId = '3' + '.' + ci,
								cc.labelWidth = null,
								cc.style = {
									width: '120px',
									height: '70px',
									color: '#333',
									overflow: 'hidden',
									wordWrap: 'break-word',
									lineHeight: '22px'
								},
								cc.title = cc.target.textTitle,
								cc.content = cc.target.textContent,
								cc.options = [{
									label: '选项一',
									value: 1
								}, {
									label: '选项二',
									value: 2
								}]
						} else if (cc.targetType == 'SCENE_FORM') {
							cc.formRadio = [{
										name: '是',
										label: '0'
									},
									{
										name: '否',
										label: '1'
									}
								],
								cc.formPicRadio = [{
										name: '默认',
										label: '0'
									},
									{
										name: '自定义',
										label: '1'
									}
								],
								cc.skipImgType = cc.skipImgType,
								cc.formRepeatType = cc.formRepeatType
							cc.productName = cc.productName
							cc.productTemplate = cc.productTemplate
							cc.showType = cc.target.showType
							cc.showTweet = cc.target.showTweet
							cc.tipInfo = cc.target.tipInfo
							cc.submitAfter = cc.target.submitAfter,
								cc.submitBefore = cc.target.submitBefore,
								cc.name = cc.target.title,
								cc.tag = 'h1'
							cc.layout = 'colFormItem',
								cc.label = '',
								cc.formId = '4' + '.' + ci,
								cc.labelWidth = null,
								cc.style = {
									width: '120px',
									height: '40px !important',
									color: '#333',
									overflow: 'hidden',
									wordWrap: 'break-word'
								},
								cc.title = cc.target.title,
								cc.elementList = cc.target.elementList,
								cc.options = [{
									label: '选项一',
									value: 1
								}, {
									label: '选项二',
									value: 2
								}]
								console.log(cc, '详情---SCENE_FORM2');
						} else if (cc.targetType == 'PRODUCT_COUPON') {
							cc.couponId = cc.target.couponId,
								cc.couponType = cc.target.couponType,
								cc.minPrice = cc.target.minPrice,
								cc.money = cc.target.money,
								cc.targetId = cc.target.couponId,
								cc.couponContent = cc.target.couponContent,
								cc.src = cc.target.gainBeforeImg,
								cc.name = cc.target.couponName,
								cc.tag = 'div'
							cc.layout = 'colFormItem',
								cc.label = '',
								cc.formId = '5' + '.' + ci,
								cc.labelWidth = null,
								cc.style = {
									width: '120px',
									background: `url(${cc.target.gainBeforeImg})`,
									// background: `url('http://192.168.208.12:8080/profile/2023/08/08/20230808102109A012.png')`,
									backgroundSize: '120px',
									height: '70px',
									color: '#fff'
								},
								cc.title = cc.target.couponName,
								// cc.content = '使用门槛' + cc.target.minPrice,
								cc.options = [{
									label: '选项一',
									value: 1
								}, {
									label: '选项二',
									value: 2
								}]
						} else if (cc.targetType == 'SCENE_SIGN') {
							cc.submitAfter = cc.target.submitAfter,
								cc.submitBefore = cc.target.submitBefore,
								cc.name = cc.title,
								cc.tag = 'span'
							cc.layout = 'colFormItem',
								cc.label = '',
								cc.formId = '4' + '.' + ci,
								cc.labelWidth = null,
								cc.style = {
									width: '120px',
									height: '70px',
									color: '#333',
									overflow: 'hidden',
									wordWrap: 'break-word',
									lineHeight: '22px'
								},
								cc.title = cc.target.title,
								cc.elementList = cc.target.elementList,
								cc.options = [{
									label: '选项一',
									value: 1
								}, {
									label: '选项二',
									value: 2
								}]
						}
					})
					this.activeData = this.treeList[0]
					console.log(this.treeList, 'this.treeList详情----')
					this.handleClick()
				})
			},

			flattenTree(treeData, newTreeData) {
				treeData.forEach(item => {
					const data = {}
					for (const key in item) {
						if (key !== 'children') {
							data[key] = item[key]
						}
					}
					newTreeData.push(data)
					if (item.children && item.children.length !== 0) {
						this.flattenTree(item.children, newTreeData)
					}
				})
				return newTreeData
			},
			click_show(q, index) {
				console.log(index, q, this.newcloneList, 'click_show---');
				this.$nextTick(() => {
					// let arr = this.$refs.myElement
					// arr.forEach((item,i)=>{
					// 	if(item.className.indexOf('activeBorder') != -1){
					// 		this.activeElementWidth = this.$refs.myElement[i].offsetWidth
					// 		this.activeElementHeight = this.$refs.myElement[i].offsetHeight
					// 		this.$refs.child_show.getHeight(this.activeElementHeight)
					// 	}
					// })
					const refName = this.getRefName(q)
					this.activeElementWidth = this.$refs[refName][0].offsetWidth
					this.activeElementHeight = this.$refs[refName][0].offsetHeight - 4
					this.$refs.child_show.getHeight(this.activeElementHeight)
					console.log(refName, this.$refs[refName][0].offsetHeight, '元素高度');


					if (this.cloneList.length != 0) {
						this.cloneList[this.activeIndex].cssStyle.height = this.activeElementHeight
						let arr = this.cloneList.filter(obj => Object.keys(obj).length !== 0);
						let sum = 0;
						this.canvasSize = 526
						for (let i = 0; i < arr.length; i++) {
							const h_item = arr[i];
							if(h_item.cssStyle.isFixed != true){
								sum += h_item.cssStyle.height;
							}
						}
						this.canvasSize = this.canvasSize + sum
						this.$refs.child_show.getDetaileCanvasSize(this.canvasSize)
						
						this.drawingList.forEach(item => {
							if (item.children) {
								item.children.forEach(a => {
									if (this.cloneList.length != 0) {
										if (a.targetId == this.cloneList[this.activeIndex].targetId && a
											.targetType == this.cloneList[this.activeIndex].targetType) {
											a.cssStyle.height = this.cloneList[this.activeIndex].cssStyle.height
										}
									}
								})
							}
						})
						console.log(this.drawingList,'this.drawingList--元素高度--clone')
					}
					if (this.newcloneList.length != 0) {
						this.newcloneList[this.activeIndex].cssStyle.height = this.activeElementHeight
						let arr = this.newcloneList.filter(obj => Object.keys(obj).length !== 0);
						let sum = 0;
						this.canvasSize = 526
						for (let i = 0; i < arr.length; i++) {
							const c_h_item = arr[i];
							if(c_h_item.cssStyle.isFixed != true){
								sum += c_h_item.cssStyle.height;
							}
						}
						this.canvasSize = this.canvasSize + sum
						this.$refs.child_show.getDetaileCanvasSize(this.canvasSize)
						this.drawingList.forEach(item => {
							if (item.children) {
								item.children.forEach(a => {
									if (this.newcloneList.length != 0) {
										if (a.targetId == this.newcloneList[this.activeIndex].targetId && a
											.targetType == this.newcloneList[this.activeIndex].targetType) {
											a.cssStyle.height = this.newcloneList[this.activeIndex].cssStyle.height
										}
									}
								})
							}
						})
						console.log(this.drawingList,'this.drawingList--元素高度--clone')
					}
				})
				let a = 1
				this.activeData = q
				this.activeIndex = index
				this.$refs.child_show.getFater(this.activeIndex)
				this.$refs.child_show.rowClick(q)
			},
			// 表单按钮弹出
			formtan(item) {
				console.log(item, '表单按钮弹出----')
				item.isclick = true
			},
			// 表单弹出
			clickformShow(q) {
				if (q.cssStyle.isFixed == true) {
					this.fixedNum = 1
				}
				// this.formShow = true
			},
			formClose() {
				this.formShow = false
			},
			//保存
			// save_submit() {
			// 	if (this.drawingList.length == 0) {
			// 		return
			// 	}
			// 	this.is_submit = true
			// 	if (!this.tweetId) {
			// 		this.ruleForm.tweetTitle = ''
			// 	}
			// 	console.log(this.drawingList, 'drawingList')
			// },
			close() {
				this.is_submit = false
				this.$refs['ruleForm'].resetFields()
			},
			submit(formName) {
				// this.is_submit = trueref="ruleForm"
				console.log(formName, this.$refs['ruleForm'], 'ruleForm--123')
				//配置初始化
				// 表单策略
				for (let i = 0; i < this.drawingList.length; i++) {
					for (let j = 0; j < this.drawingList[i].children.length; j++) {
						for (let k = 0; k < this.tweetFormList.length; k++) {
							if (this.drawingList[i].children[j].targetType == this.tweetFormList[k].targetType &&
								this.drawingList[i].children[j].targetId == this.tweetFormList[k].targetId) {
								this.drawingList[i].children[j] = this.tweetFormList[k]
							}
						}
					}
				}
				// 两个头图
				this.ruleForm.sysImgId = this.sysImg.fileId
				this.ruleForm.wxImgId = this.wxImg.fileId
				this.ruleForm.pyqImgId = this.pyqImg.fileId
				// this.ruleForm.tsyImgId = this.tsyImg.fileId

				if (this.tishiyu_show) {
					if (this.ruleType == '0') {
						if (this.tsyImg.fileVirtualPath == '') {
							this.$message.error('提示图片不能为空')
							return
						}
					} else if (this.ruleType == '1') {
						if (this.ruleText == '') {
							if (this.tsyImg.fileVirtualPath == '') {
								this.$message.error('提示文字不能为空')
								return
							}
						}
					}
				}
				// 配置校验
				// 表单策略
				// for (let i = 0; i < this.drawingList.length; i++) {
				// 	for (let j = 0; j < this.drawingList[i].children.length; j++) {
				// 		if (this.drawingList[i].children[j].targetType == 'SCENE_FORM') {
				// 			if (this.drawingList[i].children[j].tacticType == '') {
				// 				this.$message.error('请在配置选择表单策略')
				// 				return
				// 			}
				// 			if (this.drawingList[i].children[j].tacticType == '3') {
				// 				if (this.drawingList[i].children[j].tweetTactics == undefined || this.drawingList[i]
				// 					.children[j].tweetTactics.length == 0) {
				// 					this.$message.error('请在配置中配置表单策略')
				// 					return
				// 				}
				// 			}
				// 		}
				// 	}
				// }
				// 两个头图
				// if (this.ruleForm.sysImgId == undefined || this.ruleForm.sysImgId == '') {
				// 	this.$message.error('请在配置中上传管理端头图')
				// 	return
				// }
				// if (this.ruleForm.wxImgId == undefined || this.ruleForm.wxImgId == '') {
				// 	this.$message.error('请在配置中上传微信端头图')
				// 	return
				// }
				
				console.log(this.tweetFormList,'this.tweetFormList.length---1')
				console.log(this.mbFormList,'this.mbFormList.length---2')
				if(this.tweetFormList.length != 0){
					// for(let formImg of this.tweetFormList){
					// 	if(formImg.skipImg.fileOriginalName == '' && formImg.skipImg.fileVirtualPath == ''){
					// 		formImg.skipImg.fileOriginalName = '10000'
					// 		formImg.skipImg.fileVirtualPath = '10000'
					// 		formImg.skipImg.fileId = '10000'
					// 	}
					// }
					for(let formImg of this.tweetFormList){
						if(formImg.productTemplate == '' || formImg.productTemplate == null){
							this.$message.error('请选择产品模板')
							return
						}
					}
				}
				console.log(this.tweetFormList, 'this.tweetFormList---');

				//this.$refs['ruleForm']  this.$refs[formName]
				this.$refs['ruleForm'].validate((valid) => {
					console.log(valid, 123)
					if (valid) {

						this.drawingList = this.drawingList.map((item, index) => {
							return {
								...item,
								sort: index + 1,
								isCondContainer: item.componentName == '条件容器' ? 1 : 0

							}
						})
						this.drawingList.forEach(v => {


							if (v.componentName == '条件容器') {
								v.elemAllFlag = v.elemAllFlag == false ? 0 : 1,
									v.num = v.children.length
								v.elemNum = v.children.length
								v.elemUseNum = v.activnum
								v.children = v.children.map((c, cindex) => {
									return {
										...c,
										condSort: cindex + 1
									}
								})
							} else if (v.componentName == '非条件容器') {
								v.num = v.children.length
								v.elemNum = v.children.length
								v.children = v.children.map((c, cindex) => {
									return {
										...c,
										condSort: cindex + 1
									}
								})
							}

							if (v.children) {
								v.children.forEach(dd => {
									console.log(dd, dd.cssStyle, '11111===');
									if (typeof(dd.cssStyle) == 'object') {
										dd.cssStyle = JSON.stringify(dd.cssStyle)
									}
								})
							}
						})

						if (this.newcloneList.length != 0) {
							if (this.delList) {
								let arr = this.distinct(this.treeList)
								let result = []
								for (let i = 0; i < arr.length; i++) {
									let isExist = false
									for (let j = 0; j < this.newcloneList.length; j++) {
										if (arr[i].formId === this.newcloneList[j].formId) {
											isExist = true
											break
										}
									}
									if (!isExist) {
										result.push(arr[i])
									}
								}
								if (result.length !== 0) {
									let lodashtest1 = this.distinct(this.delList)
									let lodashtest2 = [...this.newcloneList, ...result]
									this.newcloneList = _.differenceBy(lodashtest2, lodashtest1, 'formId')
									this.newcloneList = this.newcloneList.map((z, zindex) => {
										return {
											...z,
											showSort: zindex + 1
										}
									})
								} else {
									let lodashtest1 = this.distinct(this.delList)
									let lodashtest2 = this.newcloneList
									this.newcloneList = _.differenceBy(lodashtest2, lodashtest1, 'formId')
									this.newcloneList = this.newcloneList.map((z, zindex) => {
										return {
											...z,
											showSort: zindex + 1
										}
									})
								}
							} else {
								// 有移动未删除
								this.newcloneList = this.newcloneList
							}
							this.is_submit = false
							console.log(this.cloneList, 'this.cloneList---1')
						} else {
							console.log('提交1')
							if (this.delList.length != 0) {
								console.log('提交1。1')
								let arr = this.distinct(this.treeList)
								let result = []
								for (let i = 0; i < arr.length; i++) {
									let isExist = false
									for (let j = 0; j < this.cloneList.length; j++) {
										if (arr[i].formId === this.cloneList[j].formId) {
											isExist = true
											break
										}
									}
									if (!isExist) {
										result.push(arr[i])
									}
								}
								if (result.length !== 0) {
									let lodashtest1 = this.distinct(this.delList)
									let lodashtest2 = [...this.cloneList, ...result]
									this.cloneList = _.differenceBy(lodashtest2, lodashtest1, 'formId')
									this.cloneList = this.cloneList.map((z, zindex) => {
										return {
											...z,
											showSort: zindex + 1
										}
									})
								} else {
									console.log('提交1。2')
									let lodashtest1 = this.distinct(this.delList)
									let lodashtest2 = this.cloneList
									this.cloneList = _.differenceBy(lodashtest2, lodashtest1, 'formId')
									this.cloneList = this.cloneList.map((z, zindex) => {
										return {
											...z,
											showSort: zindex + 1
										}
									})
								}

							} else {
								console.log('提交2')
								console.log(this.cloneList, 'this.cloneList---2.2--')
								this.cloneList = this.distinct(this.treeList)
								this.cloneList = this.cloneList.map((z, zindex) => {
									return {
										...z,
										showSort: zindex + 1
									}
								})
							}
						}
						this.cloneList.forEach(z => {
							if (z.cssStyle) {
								if (typeof(z.cssStyle) == 'object') {
									z.cssStyle = JSON.stringify(z.cssStyle)
								}
							}
						})
						this.newcloneList.forEach(z => {
							if (z.cssStyle) {
								if (typeof(z.cssStyle) == 'object') {
									z.cssStyle = JSON.stringify(z.cssStyle)
								}
							}
						})



						let data = {}
						if (this.newcloneList.length != 0) {
							data = {
								tweetTitle: this.ruleForm.tweetTitle,
								shareButton: this.ruleForm.shareButtonArray.join(","),
								pyqText: this.ruleForm.pyqText,
								shareText: this.ruleForm.shareText,
								saleText: this.ruleForm.saleText,
								tweetText: this.ruleForm.tweetText,
								// isDraft: this.ruleForm.isDraft == true ? 1 : 0,
								// usingFlag: this.ruleForm.usingFlag == true ? 0 : 1,
								// skipExecuteFlag: this.ruleForm.skipExecuteFlag == true ? 1 : 0,
								// skipUrl: this.ruleForm.skipUrl,
								tweetBackgroundId: this.tweetBackgroundId,
								canvasSize: this.canvasSize,
								channelStatus: this.ruleForm.channelStatus == true ? 1 : 0,
								tweetCommonFlag: this.ruleForm.tweetCommonFlag == true ? '1' : '0',
								organizationId: sessionStorage.getItem('organizationId') || '',
								deptId: this.deptId,
								containers: this.drawingList,
								showElems: this.newcloneList,
								tweetId: this.tweetId,
								wxImgId: this.ruleForm.wxImgId,
								sysImgId: this.ruleForm.sysImgId,
								pyqImgId: this.ruleForm.pyqImgId,
								ruleImgUrl: this.tsyImg.fileVirtualPath,
								ruleText: this.ruleText,
								ruleType: this.ruleType,
								allocatedOrganization: this.organizationAllocated.list
							}
						} else {
							data = {
								tweetTitle: this.ruleForm.tweetTitle,
								shareButton: this.ruleForm.shareButtonArray.join(","),
								pyqText: this.ruleForm.pyqText,
								shareText: this.ruleForm.shareText,
								saleText: this.ruleForm.saleText,
								tweetText: this.ruleForm.tweetText,
								// isDraft: this.ruleForm.isDraft == true ? 1 : 0,
								// usingFlag: this.ruleForm.usingFlag == true ? 0 : 1,
								// skipExecuteFlag: this.ruleForm.skipExecuteFlag == true ? 1 : 0,
								// skipUrl: this.ruleForm.skipUrl,
								tweetBackgroundId: this.tweetBackgroundId,
								canvasSize: this.canvasSize,
								channelStatus: this.ruleForm.channelStatus == true ? 1 : 0,
								tweetCommonFlag: this.ruleForm.tweetCommonFlag == true ? '1' : '0',
								organizationId: sessionStorage.getItem('organizationId') || '',
								deptId: this.deptId,
								containers: this.drawingList,
								showElems: this.cloneList,
								tweetId: this.tweetId,
								wxImgId: this.ruleForm.wxImgId,
								sysImgId: this.ruleForm.sysImgId,
								pyqImgId: this.ruleForm.pyqImgId,
								ruleImgUrl: this.tsyImg.fileVirtualPath,
								ruleText: this.ruleText,
								ruleType: this.ruleType,
								allocatedOrganization: this.organizationAllocated.list
							}
						}

						console.log(data, 'data------')
						
						// for(let [index, value] of data.showElems.entries()) {
						//   if(value.targetId == data.showElems[index + 1].targetId){
						// 	 this.$message.error('容器中有重复的元素',this.cloneList[index].name);
						// 	 return
						//   }
						// }
						console.log(this.drawingList, 'this.drawingList---')
						for (let rq of this.drawingList) {
							for (let childer of rq.children) {
								if (childer.tag == 'row') {
									this.$message.error('容器中不可嵌套容器')
									return
								}
							}
						}

						for (let rq of this.drawingList) {
							if (rq.componentName == '条件容器') {
								for (let childer of rq.children) {
									if (childer.targetType == 'MEDIA_IMAGE' || childer.targetType ==
										'MEDIA_VIDEO' || childer.targetType == 'MEDIA_TEXT') {
										this.$message.error('条件容器只可设置应用场景')
										return
									}
								}
							}
						}

						// const q_arr = this.cloneList
						// const newArr = q_arr.map(item => {
						// 	return {
						// 		targetId: item.targetId,
						// 		targetType: item.targetType
						// 	}
						// })
						// const isRepeat = newArr.some((x, index, q_arr) => q_arr.findIndex(y => (y.targetId == x
						// 	.targetId && y.targetType == x.targetType)) != index)
						// if (isRepeat) {
						// 	this.$message.error('容器中有重复的元素')
						// 	return
						// }

						if (data) {
							this.$modal.loading('正在提交数据，请稍候...')
							if (this.tweetId) {
								edittweet(JSON.stringify(data)).then(res => {
									if (res.code == 200) {
										this.$modal.msgSuccess('修改成功')
										this.$modal.closeLoading()
										this.is_submit = false
										this.drawingList = []
										this.newcloneList = []
										this.cloneList = []
										this.treeList = []
										this.activeName = 'first'
										this.delList = []
									}
									if (res.code != 200) {
										this.$message.error(res.msg)
									}
								}).catch(err => {
									setTimeout(() => {
										this.$modal.closeLoading();
									}, 500)
									console.log(err, 'err----修改')
								})
							} else {
								console.log(data, 'sssssssssssssssssssssssssss')
								addtweet(JSON.stringify(data)).then(res => {
									if (res.code == 200) {
										this.$modal.msgSuccess('新增成功')
										this.$modal.closeLoading()
										this.is_submit = false
										this.drawingList = []
										this.newcloneList = []
										this.cloneList = []
										this.treeList = []
										this.activeName = 'first'
										this.delList = []
										this.$refs.child_show.clreaBg()
										this.twbg = ''
										this.twbg2 = ''
									}

								}).catch(err => {
									console.log(err, 'err----新增')
									setTimeout(() => {
										this.$modal.closeLoading();
									}, 500)
								})
							}

						}
					} else {
						console.log('error submit!!')
						return false
					}
				})
			},

			//判断是否偶重复
			isRepeat(arr) {
				var hash = {}
				for (var i in arr) {
					if (hash[arr[i]]) {
						return true
					}
					hash[arr[i]] = true
				}
				this.$message.error('容器中有重复的元素')
				return false
			},
			//展示 画布 排序 - z-index
			soltZindex(list) {
				console.log(list, 'list-------');
				(list).forEach((z, zindex) => {
					console.log(z, zindex, 'z----');
					if (z.cssStyle) {
						if (typeof(z.cssStyle) == 'string') {
							z.cssStyle = JSON.parse(z.cssStyle)
						}
						z.cssStyle.pic_zindex = 9999 - zindex
					}
				})
			},
			// tab 切换
			handleClick() {
				this.activeIndex = 0
				if (!this.tweetId) {
					this.activeElementHeight = ''
					this.$refs.child_show.getHeight(this.activeElementHeight)
				}
				this.type_tsy_num = 0
				if (this.drawingList.length !== 0) {
					for (let t of this.drawingList) {
						console.log(t, 't-----');
						if (t.componentName == '条件容器') {
							this.type_tsy_num++
						}
					}
					// type_tsy_num:0,// 判断 有无 条件容器  0 无  >0有
					if (this.type_tsy_num == 0) {
						this.tishiyu_show = false
					} else if (this.type_tsy_num > 0) {
						this.tishiyu_show = true
					}
				}


				if (this.activeName == 'pz_second') {
					// 构建推文中所有的表单
					let a = []
					this.tweetFormList = []
					this.tweetCouponList = []
					this.drawingList.forEach(item1 => {
						item1.children.forEach(item2 => {
							if (item2.targetType == 'SCENE_FORM') {
								console.log(item2, 'item2----');
								//  skipImg.fileVirtualPath
								// if(item2.skipImg.fileVirtualPath == ''){
								// 	item2.skipImg.fileVirtualPath = '../../../assets/images/form_success.jpg'
								// }
								a.push(item2)
								this.tweetFormList.push(item2) // 所选的所有表单
								console.log(this.tweetFormList,'tweetFormList----')
								//修改回显
								// this.getMbList()
								
								console.log(this.tweetFormList,'详情--123--this.tweetFormList');
								console.log(this.mbFormList,'详情mbFormList.mbFormList');
								if(this.tweetFormList.length != 0){
									this.tweetFormList.forEach((p,pindex)=>{
										this.mbFormList.forEach((k,kindex)=>{
											if(p.productTemplate == k.id){
												console.log(k,'k---------')
												console.log(p,'p---------')
												let val = p.productTemplate
												this.productTemplateClick(val,pindex)
											}
										})
									})
								}
								
								console.log(this.mbFormList,'this.mbFormList---123')

							} else if (item2.targetType == 'PRODUCT_COUPON') {
								this.tweetCouponList.push(item2)
							}
							if (a.length > 0) {
								this.formTacticsSwitch = true
								console.log(this.formTacticsSwitch, a.length, 'true');

								//在打开此模块的时候查询产品下拉数据
								// this.getMbList()
								
								

							} else {
								this.formTacticsSwitch = false
								console.log(this.formTacticsSwitch, 'false');
							}
						})
					})
				}
				console.log(this.tweetCouponList, ".......所选的所有优惠券")
				if (this.tweetCouponList.length > 0) {
					this.couponConfigDisplay = true
				} else {
					this.couponConfigDisplay = false
				}
				if (this.activeName == 'second' || this.activeName == 'three' || this.activeName == 'peizhi_show') {
					if (this.treeList) {

						// 没有上下移动
						if (this.newcloneList.length === 0) {
							this.cloneList = this.distinct(this.treeList)
							this.soltZindex(this.cloneList)
							console.log(this.cloneList, '排序后-----cloneList');
							//有删除
							let arr = this.distinct(this.treeList)
							let result = []
							for (let i = 0; i < arr.length; i++) {
								let isExist = false
								for (let j = 0; j < this.cloneList.length; j++) {
									if (arr[i].formId === this.cloneList[j].formId) {
										isExist = true
										break
									}
								}
								if (!isExist) {
									result.push(arr[i])
								}
							}
							if (this.delList.length != 0) {
								console.log(1111)
								//有删除--找不同

								if (result.length !== 0) {

									let lodashtest1 = this.distinct(this.delList)
									let lodashtest2 = [...this.cloneList, ...result]
									// console.log(lodashtest1, 'delList');
									// console.log(lodashtest2, 'cloneList');

									this.cloneList = _.differenceBy(lodashtest2, lodashtest1, 'formId')
									this.cloneList = this.distinct(this.cloneList)
								} else {

									let lodashtest1 = this.distinct(this.delList)
									let lodashtest2 = this.distinct(this.treeList)
									console.log(lodashtest1)
									console.log(lodashtest2)
									console.log(this.drawingList)

									this.cloneList = _.differenceBy(lodashtest2, lodashtest1, 'formId')
								}

							} else {
								// 未删除
								console.log(1.1, this.treeList, this.cloneList)
								// 有移动未删除
								if (result.length !== 0) {
									this.cloneList = this.cloneList
								} else {
									this.cloneList.push(result)
								}
							}
							this.$refs.child_show.rowClick(this.cloneList[this.activeIndex])
						} else {
							console.log(2222)
							console.log(this.newcloneList, 'newcloneList')
							this.soltZindex(this.newcloneList)
							let arr = this.distinct(this.treeList)
							let result = []
							for (let i = 0; i < arr.length; i++) {
								let isExist = false
								for (let j = 0; j < this.newcloneList.length; j++) {
									if (arr[i].formId === this.newcloneList[j].formId) {
										isExist = true
										break
									}
								}
								if (!isExist) {
									result.push(arr[i])
								}
							}
							//删除
							if (this.delList.length != 0) {
								console.log(2.1)
								console.log(this.distinct(this.delList), '有删除有移动')
								if (result.length !== 0) {
									let lodashtest1 = this.distinct(this.delList)
									let lodashtest2 = [...this.newcloneList, ...result]
									let lodashtest3 = _.differenceBy(lodashtest2, lodashtest1, 'targetType', 'targetId')
									const hasObj = {}
									this.newcloneList = lodashtest3.reduce((total, next) => {
										const filterKey = next.targetId + next.targetType
										hasObj[filterKey] ? '' : hasObj[filterKey] = true && total.push(next)
										return total
									}, [])

									console.log(this.newcloneList, '2.1.1')

								} else {
									let lodashtest1 = this.distinct(this.delList)
									let lodashtest2 = this.newcloneList
									let lodashtest3 = _.differenceBy(lodashtest2, lodashtest1, 'targetType', 'targetId')
									const hasObj = {}
									this.newcloneList = lodashtest3.reduce((total, next) => {
										const filterKey = next.targetId + next.targetType
										hasObj[filterKey] ? '' : hasObj[filterKey] = true && total.push(next)
										return total
									}, [])

									console.log(this.newcloneList, '2.1.2')
								}
								//有删除 有新增--

							} else {
								console.log(this.newcloneList, 2.2)
								console.log(this.distinct(this.delList), '未删除有移动')
								const hasObj = {}
								let newList = this.newcloneList.reduce((total, next) => {
									const filterKey = next.targetId + next.targetType
									hasObj[filterKey] ? '' : hasObj[filterKey] = true && total.push(next)
									return total
								}, [])
								console.log(newList, 'newList----')
								// 有移动未删除
								if (result.length !== 0) {
									this.newcloneList = [...newList, ...result]
								} else {
									this.newcloneList = newList
								}
							}
							this.$refs.child_show.rowClick(this.newcloneList[this.activeIndex])
							this.delList = []
						}
					}
				}

				if (this.activeName == 'peizhi_show') {
					this.sjkShow = false
				} else if (this.activeName == 'three') {
					let container = document.getElementById('my-overflow');
					container.scrollTop = 0;
					this.sjkShow = true
				}

				if (this.newcloneList.length != 0) {
					let arr2 = {
						num: 0,
						activeName: this.activeName,
						componentName: '',
						cloneList: this.newcloneList
					}
					if (this.newcloneList.length == 0) {
						return
					}
					this.$bus.$emit('brotherEvent', arr2)
					this.$nextTick(() => {
						if (this.activeName == 'three') {
							
							this.drawingList.forEach(item => {
								if (item.children) {
									item.children.forEach(a => {
										if (this.newcloneList.length != 0) {
											this.newcloneList.forEach(c=>{
												if(a.targetId == c.targetId && a.targetType == c.targetType ){
													a.cssStyle.top_margin = c.cssStyle.top_margin
													a.cssStyle.left_margin = c.cssStyle.left_margin
													console.log(123321,c,a)
												}
											})
										}
									})
								}
							})
							
							let n_drawingList = JSON.stringify(this.drawingList)
							let data = {}
							data = {
									tweetTitle: this.ruleForm.tweetTitle,
									shareButton: this.ruleForm.shareButtonArray.join(","),
									pyqText: this.ruleForm.pyqText,
									shareText: this.ruleForm.shareText,
									saleText: this.ruleForm.saleText,
									tweetText: this.ruleForm.tweetText,
									tweetBackgroundId: this.tweetBackgroundId,
									canvasSize: this.canvasSize,
									channelStatus: this.ruleForm.channelStatus == true ? 1 : 0,
									tweetCommonFlag: this.ruleForm.tweetCommonFlag == true ? '1' : '0',
									organizationId: sessionStorage.getItem('organizationId') || '',
									deptId: this.deptId,
									containers: this.jsonArrDrawingList(JSON.parse(n_drawingList)),
									tweetId: this.tweetId,
									wxImgId: this.ruleForm.wxImgId,
									sysImgId: this.ruleForm.sysImgId,
									pyqImgId: this.ruleForm.pyqImgId,
								},
								console.log(this.drawingList, this.newcloneList, 'newcloneList---构建')
							previewBuild(JSON.stringify(data)).then(res => {
								console.log(res, 'res---预览构建')
								if (res.code == 200) {
									getConfigKey().then(result => {
										console.log(result, 'result----预览链接')
										let previewCode = this.$store.getters.name
										this.previewUrl = result.msg + '?previewCode=' +
											previewCode + '&tweetType=' + 'preview'
											this.$refs.child_show.getpreviewUrl(this.previewUrl)
										console.log(this.previewUrl , 'this.previewUrl--')
									})
								}
							}).catch(err => {
								this.$modal.closeLoading()
								console.log(err, 'err----')
							})
						}
					})

				} else {

					let arr2 = {
						num: 0,
						activeName: this.activeName,
						componentName: '',
						cloneList: this.cloneList
					}
					if (this.cloneList.length == 0) {
						return
					}
					this.$bus.$emit('brotherEvent', arr2)
					this.$nextTick(() => {
						if (this.activeName == 'three') {
							
							this.drawingList.forEach(item => {
								if (item.children) {
									item.children.forEach(a => {
										if (this.cloneList.length != 0) {
											this.cloneList.forEach(c=>{
												if(a.targetId == c.targetId && a.targetType == c.targetType ){
													a.cssStyle.top_margin = c.cssStyle.top_margin
													a.cssStyle.left_margin = c.cssStyle.left_margin
													console.log(123321,c,a)
												}
											})
										}
									})
								}
							})
							console.log(this.drawingList, 'this.drawingList--预览--')
							
							let n_drawingList = JSON.stringify(this.drawingList)
							let data = {}
							data = {
									tweetTitle: this.ruleForm.tweetTitle,
									shareButton: this.ruleForm.shareButtonArray.join(","),
									pyqText: this.ruleForm.pyqText,
									shareText: this.ruleForm.shareText,
									saleText: this.ruleForm.saleText,
									tweetText: this.ruleForm.tweetText,
									tweetBackgroundId: this.tweetBackgroundId,
									canvasSize: this.canvasSize,
									channelStatus: this.ruleForm.channelStatus == true ? 1 : 0,
									tweetCommonFlag: this.ruleForm.tweetCommonFlag == true ? '1' : '0',
									organizationId: sessionStorage.getItem('organizationId') || '',
									deptId: this.deptId,
									containers: this.jsonArrDrawingList(JSON.parse(n_drawingList)),
									tweetId: this.tweetId,
									wxImgId: this.ruleForm.wxImgId,
									sysImgId: this.ruleForm.sysImgId,
									pyqImgId: this.ruleForm.pyqImgId,
								},

								console.log(this.drawingList, this.cloneList, 'cloneList----构建')
							previewBuild(JSON.stringify(data)).then(res => {
								console.log(res, 'res---预览构建')
								if (res.code == 200) {
									getConfigKey().then(result => {
										console.log(result, 'result----预览链接')
										let previewCode = this.$store.getters.name
										this.previewUrl = result.msg + '?previewCode=' +
											previewCode + '&tweetType=' + 'preview'
										this.$refs.child_show.getpreviewUrl(this.previewUrl)
										console.log(this.previewUrl , 'this.previewUrl--2')
									})
								}
							}).catch(err => {
								this.$modal.closeLoading()
								console.log(err, 'err----')
							})
						}
					})

				}

			},
			//比较两个数组差异
			getDifference(a, b) {
				return a.filter(element => {
					return !b.includes(element.targetId && element.targetType)
				})
			},
			// 缩放后改变 容器元素的 上 左边距
			scaleLeftTop(rList, list) {
				rList.forEach(item => {
					if (item.children) {
						item.children.forEach(v => {
							list.forEach(d => {
								if (v.targetId == d.targetId && v.targetType == d.targetType) {
									console.log(d, 'd---------')
									v.cssStyle.left_margin = d.cssStyle.left_margin
									v.cssStyle.top_margin = d.cssStyle.top_margin
								}
							})
						})
					}
				})
			},
			//树状平铺
			flatTree(list) {
				return list.reduce((ls, item) => {
					let {
						children,
						...res
					} = item
					if (children && children.length) {
						return ls.concat(res, flatTree(children))
					} else {
						return ls.concat(res)
					}
				}, [])
			},
			// 数组去重
			distinct(list) {
				let result = [list[0]] // 用于承接没有重复的数据，初始时将原始数组的第一个值赋给它。
				for (let i = 1; i < list.length; i++) {
					// 判断结果数组中是否存在一样的值，若果没有的话则将数据存入结果数组中。
					if (!(result.some(val => list[i].formId === val.formId))) {
						result.push(list[i])
					}
				}
				return result
			},
			// 数组去重
			distinct2(list) {
				let result = [list[0]] // 用于承接没有重复的数据，初始时将原始数组的第一个值赋给它。
				for (let i = 1; i < list.length; i++) {
					// 判断结果数组中是否存在一样的值，若果没有的话则将数据存入结果数组中。
					if (!(result.some(val => list[i].targetId === val.targetId))) {
						result.push(list[i])
					}
				}
				return result
			},
			//找不同数组
			getNewArr(a, b) {
				const arr = [...a, ...b]
				const newArr = arr.filter(item => {
					return !(a.includes(item) && b.includes(item))
				})
				return newArr
			},
			activeFormItem(element) {
				this.activeData = element
				this.activeId = element.formId
				// console.log(element, 'element---');
			},
			clickimgVideo(item) {
				if (item.tag == 'el-image') {
					this.imagePreview.visible = true
					this.imagePreview.url = item.src
				} else if (item.tag == 'video') {
					this.videoPreview.visible = true
					this.videoPreview.url = item.src
				}
			},
			marginTop(item) {
				console.log(item, '上边距');
				if (this.cloneList.length != 0) {
					this.cloneList[this.activeIndex].cssStyle.top_margin = item
				}
				if (this.newcloneList.length != 0) {
					this.newcloneList[this.activeIndex].cssStyle.top_margin = item
				}

				if (this.tweetId) {
					this.editContrast(this.activeData, 'top', item)
				}
			},
			leftMargin(item) {
				console.log(this.cloneList, item, '左边距')
				if (this.cloneList.length != 0) {
					this.cloneList[this.activeIndex].cssStyle.left_margin = item
				}
				if (this.newcloneList.length != 0) {
					this.newcloneList[this.activeIndex].cssStyle.left_margin = item
				}
				if (this.tweetId) {
					this.editContrast(this.activeData, 'h_left', item)
				}
			},
			scale_left_margin(val) {
				if (this.cloneList.length != 0) {
					console.log(val, 'scale_left_margin----val');
					this.cloneList[this.activeIndex].cssStyle.left_margin = val
					console.log(this.cloneList[this.activeIndex].cssStyle,'9990000')
					this.scaleLeftTop(this.drawingList, this.cloneList)
				}
				if (this.newcloneList.length != 0) {
					this.newcloneList[this.activeIndex].cssStyle.left_margin = val
					this.scaleLeftTop(this.drawingList, this.newcloneList)
				}
			},
			scale_top_margin(val) {
				if (this.cloneList.length != 0) {
					this.cloneList[this.activeIndex].cssStyle.top_margin = val
					this.scaleLeftTop(this.drawingList, this.cloneList)
				}
				if (this.newcloneList.length != 0) {
					this.newcloneList[this.activeIndex].cssStyle.top_margin = val
					this.scaleLeftTop(this.drawingList, this.newcloneList)
				}
			},
			picZindex(item) {
				console.log(this.cloneList, item, '图层顺序')
				if (this.cloneList.length != 0) {
					this.cloneList[this.activeIndex].cssStyle.pic_zindex = item
				}
				if (this.newcloneList.length != 0) {
					this.newcloneList[this.activeIndex].cssStyle.pic_zindex = item
				}
				if (this.tweetId) {
					this.editContrast(this.activeData, 'piczindex', item)
				}
			},
			clickTW_bg(val) {
				if (val == true) {
					// 设置为背景

					if (this.cloneList.length != 0) {
						this.cloneList[this.activeIndex].cssStyle.bg_switch = val

						this.twbg = this.cloneList[this.activeIndex].fileVirtualPath || this.cloneList[this.activeIndex]
							.src
						this.twbg2 = this.cloneList[this.activeIndex].fileVirtualPath || this.cloneList[this.activeIndex]
							.src

						this.tweetBackgroundId = this.cloneList[this.activeIndex].fileId
					}

					if (this.newcloneList.length != 0) {
						this.newcloneList[this.activeIndex].cssStyle.bg_switch = val

						this.twbg = this.newcloneList[this.activeIndex].fileVirtualPath || this.newcloneList[this
							.activeIndex].src
						this.twbg2 = this.newcloneList[this.activeIndex].fileVirtualPath || this.newcloneList[this
							.activeIndex].src
						this.tweetBackgroundId = this.newcloneList[this.activeIndex].fileId
					}

					if (this.tweetId) {
						console.log(111, '设置背景');
						console.log(this.cloneList, this.cloneList.length, this.activeIndex, 678543);
						if (this.cloneList.length != 0) {
							console.log(121, '设置背景');
							this.tweetBackgroundId = this.cloneList[this.activeIndex].target.fileId

						}
						if (this.newcloneList.length != 0) {
							this.tweetBackgroundId = this.newcloneList[this.activeIndex].target.fileId
						}
						this.drawingList.forEach(item => {
							if (item.children) {
								item.children.forEach(a => {
									if (a.targetType == "MEDIA_IMAGE") {
										if (this.tweetBackgroundId == a.target.fileId) {
											a.cssStyle.bg_switch = true
										}
									}
								})
							}
						})
						console.log(this.drawingList, 'drawingList-----true')
						console.log(this.cloneList, 'cloneList-----true')
					} else {
						// console.log(222,'设置背景');
						// this.tweetBackgroundId = this.cloneList[this.activeIndex].fileId
					}
					console.log(this.tweetBackgroundId, 'tweetBackgroundId---');
				}

				// 删除背景
				if (val == false) {
					this.tweetBackgroundId = ''
					this.twbg = ''
					this.twbg2 = ''
					if (this.cloneList.length != 0) {
						this.cloneList.forEach(item => {
							if (item.targetType == 'MEDIA_IMAGE') {
								item.cssStyle.bg_switch = false
							}
						})
					}

					if (this.newcloneList.length != 0) {
						this.newcloneList.forEach(item => {
							if (item.targetType == 'MEDIA_IMAGE') {
								item.cssStyle.bg_switch = false
							}
						})
					}

					this.drawingList.forEach(item => {
						if (item.children) {
							item.children.forEach(a => {
								a.cssStyle.bg_switch = false
							})
						}
					})

					console.log(this.drawingList, 'drawingList-----false')
					console.log(this.cloneList, 'cloneList-----false')
				}
				// this.$refs.child.getData(this.cloneList)
				// this.$refs.child.getImg(this.twbg)
			},
			clickCanvas(val) {
				this.canvasSize = val
				// if(this.cloneList.length != 0){
				// 	this.cloneList.forEach(v=>{
				// 		if(v.showType == '1'){
				// 			v.cssStyle.top_margin = this.canvasSize - 50
				// 		}
				// 	})
				// }
				// if(this.newcloneList.length != 0){
				// 	this.newcloneList.forEach(v=>{
				// 		if(v.showType == '1'){
				// 			v.cssStyle.top_margin = this.canvasSize - 50
				// 		}
				// 	})
				// }
				console.log(this.canvasSize, 'va------');
			},
			clicktopMarginMax(val) {
				console.log(val, '最大值');
				if (this.cloneList.length != 0) {
					// this.cloneList[this.activeIndex].cssStyle.topMarginMax = val
					if (this.cloneList.length != 0) {
						for (let t of this.cloneList) {
							if (t == undefined) {
								return
							} else {
								t.cssStyle.topMarginMax = val
							}
						}
					}
				}
				if (this.newcloneList.length != 0) {
					// this.newcloneList[this.activeIndex].cssStyle.topMarginMax = val
					for (let t of this.newcloneList) {
						if (t == undefined) {
							return
						} else {
							t.cssStyle.topMarginMax = val
						}
					}
				}
			},
			clicktopMarginMin(val) {
				this.cloneList[this.activeIndex].cssStyle.topMarginMin = val
			},
			clickleftMarginMax(val) {
				this.cloneList[this.activeIndex].cssStyle.leftMarginMax = val
			},
			clickleftMarginMin(val) {
				this.cloneList[this.activeIndex].cssStyle.leftMarginMin = val
			},
			//固定底部
			clickfixed(val) {
				console.log(this.newcloneList, this.activeIndex, '拖拽固定到底部---11');
				this.fixedNum = 1
				// this.cloneList[this.activeIndex].cssStyle.top_margin = this.canvasSize - 50

				if (this.cloneList.length != 0) {
					console.log(1111);
					this.cloneList[this.activeIndex].cssStyle.top_margin = 485
					this.cloneList[this.activeIndex].cssStyle.pic_zindex = 10000
					this.cloneList[this.activeIndex].cssStyle.isFixed = true
				}
				if (this.newcloneList.length != 0) {
					console.log(2222);
					this.newcloneList[this.activeIndex].cssStyle.top_margin = 485
					this.newcloneList[this.activeIndex].cssStyle.pic_zindex = 10000
					this.newcloneList[this.activeIndex].cssStyle.isFixed = true
				}

				this.drawingList.forEach(item => {
					if (item.children) {
						item.children.forEach(a => {
							if (this.cloneList.length != 0) {
								if (a.targetId == this.cloneList[this.activeIndex].targetId && a
									.targetType == this.cloneList[this.activeIndex].targetType) {
									a.cssStyle.top_margin = 485
									a.cssStyle.pic_zindex = 10000
									a.cssStyle.isFixed = true
								}
							}

							if (this.newcloneList.length != 0) {
								if (a.targetId == this.newcloneList[this.activeIndex].targetId && a
									.targetType == this.newcloneList[this.activeIndex].targetType) {
									a.cssStyle.top_margin = 485
									a.cssStyle.pic_zindex = 10000
									a.cssStyle.isFixed = true
								}
							}

						})
					}
				})

				this.isFixed = true
			},
			//表单释放
			clickRelease() {
				this.fixedNum = 0
				console.log('clickRelease,释放');
				if (this.cloneList.length != 0) {
					console.log('释放1111');
					this.cloneList[this.activeIndex].cssStyle.top_margin = 0
					this.cloneList[this.activeIndex].cssStyle.pic_zindex = 1
					this.cloneList[this.activeIndex].cssStyle.isFixed = false

					this.drawingList.forEach(item => {
						if (item.children) {
							item.children.forEach(a => {
								a.cssStyle.isFixed = false
								if (a.name == this.cloneList[this.activeIndex].name) {
									a.cssStyle.top_margin = 0
								}
							})
						}
					})
				}

				if (this.newcloneList.length != 0) {
					console.log('释放2222');
					this.newcloneList[this.activeIndex].cssStyle.top_margin = 0
					this.newcloneList[this.activeIndex].cssStyle.pic_zindex = 1
					this.newcloneList[this.activeIndex].cssStyle.isFixed = false

					this.drawingList.forEach(item => {
						if (item.children) {
							item.children.forEach(a => {
								a.cssStyle.isFixed = false
								console.log(a, this.newcloneList[this.activeIndex].name, 'name---');
								if (a.name == this.newcloneList[this.activeIndex].name) {
									a.cssStyle.top_margin = 0
								}
							})
						}
					})
				}

			},
			getRuleText(val) {
				this.ruleText = val
				console.log(this.ruleText, 'ruleText--ruleText');
			},
			click_sjk(val) {
				this.sjkShow = val
				if (this.sjkShow == true) {
					this.twbg = ''
					console.log('有--手机壳');
				} else {
					this.twbg = this.twbg2
					console.log('没有---手机壳');
				}
			},
			editContrast(val, margin, e) {
				this.drawingList.forEach(item => {
						console.log(item,1111)
					if (item.children) {
						console.log(item,2222)
						item.children.forEach(v => {
							console.log(v,val,val.targetId , v.targetId , val.targetType , v.targetType,333333)
							if (val.targetId == v.targetId && val.targetType == v.targetType) {
								if (margin == 'left') {
									v.cssStyle.left_margin = e
								} else if (margin == 'center') {
									v.cssStyle.left_margin = (232 - this.activeElementWidth) / 2
								} else if (margin == 'right') {
									v.cssStyle.left_margin = (232 - this.activeElementWidth)
								} else if (margin == 'top') {
									console.log(v,e,444)
									v.cssStyle.top_margin = e
								} else if (margin == 'h_left') {
									v.cssStyle.left_margin = e
									console.log(v.cssStyle.left_margin,44444)
								} else if (margin == 'piczindex') {
									v.cssStyle.pic_zindex = e
								} else if (margin == 'scale') {
									console.log(123, e);
									v.cssStyle.t_transform = e.t_transform
									v.cssStyle.scaleValue = e.scaleValue
								} else if (margin == 's_left') {
									v.cssStyle.left_margin = e
								}
							}
						})
					}
				})
			},
			elenemt_position(val) {
				console.log(val, '位置')
				if (this.cloneList.length != 0) {
					console.log(1111)
					if (val == 'left') {
						this.cloneList[this.activeIndex].cssStyle.left_margin = 0
						if (this.tweetId) {
							this.editContrast(this.activeData, 'left')
						}
					} else if (val == 'center') {
						this.cloneList[this.activeIndex].cssStyle.left_margin = (232 - this.activeElementWidth) / 2
						if (this.tweetId) {
							this.editContrast(this.activeData, 'center')
						}
					} else if (val == 'right') {

						this.cloneList[this.activeIndex].cssStyle.left_margin = (232 - this.activeElementWidth)
						if (this.tweetId) {
							this.editContrast(this.activeData, 'right')
						}
					}
				}
				if (this.newcloneList.length != 0) {
					console.log(222)
					if (val == 'left') {
						this.newcloneList[this.activeIndex].cssStyle.left_margin = 0
						if (this.tweetId) {
							this.editContrast(this.activeData, 'left')
						}
					} else if (val == 'center') {
						this.newcloneList[this.activeIndex].cssStyle.left_margin = (232 - this.activeElementWidth) / 2
						if (this.tweetId) {
							this.editContrast(this.activeData, 'center')
						}
					} else if (val == 'right') {
						this.newcloneList[this.activeIndex].cssStyle.left_margin = (232 - this.activeElementWidth)
						if (this.tweetId) {
							this.editContrast(this.activeData, 'right')
						}
					}
				}
			},
			scale(item) {
				console.log('缩放', item);
				if (this.cloneList.length != 0) {
					this.cloneList[this.activeIndex].cssStyle.t_transform = item.t_transform
					this.cloneList[this.activeIndex].cssStyle.scaleValue = item.scaleValue
					this.cloneList[this.activeIndex].cssStyle.scaleLeftValue = this.cloneList[this.activeIndex].cssStyle.left_margin+(232*(1-item.scaleValue)/2)
					/* if ((this.cloneList[this.activeIndex].cssStyle.left_margin - 0) > 0) {
						this.cloneList[this.activeIndex].cssStyle.scaleLeftValue = (this.cloneList[this.activeIndex]
								.cssStyle.left_margin + ((232 - (232 * (this.activeData.cssStyle.scaleValue - 0))) / 2))
							.toFixed(2) - 0
					} else if (this.cloneList[this.activeIndex].cssStyle.left_margin - 0 < 0) {
						this.cloneList[this.activeIndex].cssStyle.scaleLeftValue = (this.cloneList[this.activeIndex]
								.cssStyle.left_margin - ((232 - (232 * (this.activeData.cssStyle.scaleValue - 0))) / 2))
							.toFixed(2) - 0
					} else if (this.cloneList[this.activeIndex].cssStyle.left_margin - 0 == 0) {
						this.cloneList[this.activeIndex].cssStyle.scaleLeftValue = ((232 - (232 * (this.cloneList[this
							.activeIndex].cssStyle.scaleValue - 0))) / 2).toFixed(2) - 0
					} */
					let ah = this.activeElementHeight;
					this.cloneList[this.activeIndex].cssStyle.scaleTopValue = this.cloneList[this.activeIndex].cssStyle.top_margin+(ah*(1-item.scaleValue)/2)
					/* if ((this.cloneList[this.activeIndex].cssStyle.top_margin - 0) > 0) {
						this.cloneList[this.activeIndex].cssStyle.scaleTopValue = (this.cloneList[this.activeIndex]
							.cssStyle.top_margin + (this.activeElementHeight - this.activeElementHeight * (this
								.cloneList[this.activeIndex].cssStyle.scaleValue - 0)) / 2).toFixed(2) - 0
					} else if (this.cloneList[this.activeIndex].cssStyle.top_margin - 0 < 0) {
						this.cloneList[this.activeIndex].cssStyle.scaleTopValue = (this.cloneList[this.activeIndex]
							.cssStyle.top_margin - (this.activeElementHeight - this.activeElementHeight * (this
								.cloneList[this.activeIndex].cssStyle.scaleValue - 0)) / 2).toFixed(2) - 0
					} else if (this.cloneList[this.activeIndex].cssStyle.top_margin - 0 == 0) {
						this.cloneList[this.activeIndex].cssStyle.scaleTopValue = ((this.activeElementHeight - this
								.activeElementHeight * (this.cloneList[this.activeIndex].cssStyle.scaleValue - 0)) / 2)
							.toFixed(2) - 0
					} */
					console.log(this.cloneList[this.activeIndex].cssStyle.scaleTopValue, 'scaleTopValue---');
				}

				if (this.newcloneList.length != 0) {
					this.newcloneList[this.activeIndex].cssStyle.t_transform = item.t_transform
					this.newcloneList[this.activeIndex].cssStyle.scaleValue = item.scaleValue
					
					this.newcloneList[this.activeIndex].cssStyle.scaleLeftValue = this.newcloneList[this.activeIndex].cssStyle.left_margin+(232*(1-item.scaleValue)/2)
					let ah = this.activeElementHeight;
					this.newcloneList[this.activeIndex].cssStyle.scaleTopValue = this.newcloneList[this.activeIndex].cssStyle.top_margin+(ah*(1-item.scaleValue)/2)

					// if ((this.newcloneList[this.activeIndex].cssStyle.left_margin - 0) > 0) {
					// 	this.newcloneList[this.activeIndex].cssStyle.scaleLeftValue = (this.newcloneList[this.activeIndex]
					// 			.cssStyle.left_margin + ((232 - (232 * (this.activeData.cssStyle.scaleValue - 0))) / 2))
					// 		.toFixed(2) - 0
					// } else if (this.newcloneList[this.activeIndex].cssStyle.left_margin - 0 < 0) {
					// 	this.newcloneList[this.activeIndex].cssStyle.scaleLeftValue = (this.newcloneList[this.activeIndex]
					// 			.cssStyle.left_margin - ((232 - (232 * (this.activeData.cssStyle.scaleValue - 0))) / 2))
					// 		.toFixed(2) - 0
					// } else if (this.newcloneList[this.activeIndex].cssStyle.left_margin - 0 == 0) {
					// 	this.newcloneList[this.activeIndex].cssStyle.scaleLeftValue = ((232 - (232 * (this.newcloneList[
					// 		this.activeIndex].cssStyle.scaleValue - 0))) / 2).toFixed(2) - 0
					// }

					// if ((this.newcloneList[this.activeIndex].cssStyle.top_margin - 0) > 0) {
					// 	this.newcloneList[this.activeIndex].cssStyle.scaleTopValue = (this.newcloneList[this.activeIndex]
					// 		.cssStyle.cssStyle.top_margin + (this.activeElementHeight - this.activeElementHeight * (
					// 			this.newcloneList[this.activeIndex].cssStyle.cssStyle.scaleValue - 0)) / 2).toFixed(
					// 		2) - 0
					// } else if (this.newcloneList[this.activeIndex].cssStyle.top_margin - 0 < 0) {
					// 	this.newcloneList[this.activeIndex].cssStyle.scaleTopValue = (this.newcloneList[this.activeIndex]
					// 		.cssStyle.top_margin - (this.activeElementHeight - this.activeElementHeight * (this
					// 			.newcloneList[this.activeIndex].cssStyle.scaleValue - 0)) / 2).toFixed(2) - 0
					// } else if (this.newcloneList[this.activeIndex].cssStyle.top_margin - 0 == 0) {
					// 	this.newcloneList[this.activeIndex].cssStyle.scaleTopValue = ((this.activeElementHeight - this
					// 			.activeElementHeight * (this.newcloneList[this.activeIndex].cssStyle.scaleValue - 0)) /
					// 		2).toFixed(2) - 0
					// }

				}

				if (this.tweetId) {
					this.editContrast(this.activeData, 'scale', item)
				}
			},
			tableRow(row) {
				if (this.cloneList.length != 0) {
					this.cloneList.forEach((v, index) => {
						if (v.targetType == row.targetType && v.formId == row.formId) {
							this.activeData = v
							this.activeIndex = index
							this.$refs.child_show.getHeight('')
						}
					})
				}
				if (this.newcloneList.length != 0) {
					this.newcloneList.forEach((v, index) => {
						if (v.targetType == row.targetType && v.formId == row.formId) {
							this.activeData = v
							this.activeIndex = index
							this.$refs.child_show.getHeight('')
						}
					})
				}
			},
			getdragList(data) {
				console.log(data, '拖拽后的数组data----')
				// this.cloneList = data
				// this.soltZindex(this.cloneList)
				// this.$refs.child_show.getFater(0)
				// this.$refs.child_show.rowClick(this.cloneList[0])
				// this.activeElementHeight = ''
				// this.$refs.child_show.getHeight(this.activeElementHeight)

				this.newcloneList = data
				this.cloneList = []
				this.soltZindex(this.newcloneList)
				this.$refs.child_show.getFater(0)
				this.$refs.child_show.rowClick(this.newcloneList[0])
				this.activeElementHeight = ''
				this.$refs.child_show.getHeight(this.activeElementHeight)
			},
			dragActive(i) {
				console.log(i, this.cloneList, 'iiiiiiiiiii----------');
				this.click_show(this.cloneList[i], i)
				this.activeIndex = i
				let maxValue = ''
				// if(this.cloneList.length != 0){
				// 	maxValue = this.cloneList[0].cssStyle.pic_zindex;
				// } else {
				// 	maxValue = this.newcloneList[0].cssStyle.pic_zindex;
				// }
				// console.log(maxValue,'maxValue---');
				// 遍历数组，比较每个对象的属性值
				// for (let i = 1; i < this.cloneList.length - 1; i++) {
				//   if (this.cloneList[i].cssStyle.pic_zindex > maxValue) {
				//     maxValue = this.cloneList[i].cssStyle.pic_zindex + 1
				//   }
				// }

				// this.cloneList.forEach((item,index)=>{
				// 	if(index == i){
				// 		item.cssStyle.pic_zindex = maxValue
				// 	} else {
				// 		item.cssStyle.pic_zindex = index
				// 	}
				// })

				//this.click_show(this.cloneList[i],i)

				// this.$refs.child_show.getFater(i)

				console.log(maxValue, 123);

			},
			activeFormItem2(element, index) {
				console.log(element, 'element---')

				if (element.tagIcon == 'row') {
					let num = element.children.length
					let arr = {
						num: num,
						activeName: this.activeName,
						componentName: element.componentName,
						cloneList: this.cloneList
					}
					this.$bus.$emit('brotherEvent', arr)
				} else {
					for (let a of this.drawingList) {
						for (let b of a.children) {
							if (b.targetId == element.targetId) {
								let arr = {
									componentName: a.componentName,
									num: '',
									activeName: this.activeName
								}
								b.componentName = a.componentName
								this.$bus.$emit('brotherEvent', arr)
								break
							}
						}
					}
				}
				this.activeData = element
				this.activeId = element.formId
			},
			imagePreviewClose() {
				this.imagePreview.visible = false
			},
			videoPreviewClose() {
				this.videoPreview.visible = false
				this.$refs.vueMiniPlayer.pause() //暂停
			},
			// 拖拽
			// 拖拽
			onEnd(obj, a) {

				if (this.activeName == 'second') {
					return
				}
				if (obj.from !== obj.to) {
					this.activeData = tempActiveData
					this.activeId = this.idGlobal
					this.drawingList.forEach((item, index) => {
						if (item.componentName == '条件容器') {
							item.children.forEach((c, cindex) => {
								// || c.targetType == 'SCENE_FORM' || c.targetType == 'SCENE_SIGN'
								if (c.targetType == 'MEDIA_IMAGE' || c.targetType == 'MEDIA_VIDEO' || c
									.targetType == 'MEDIA_TEXT' || c.targetType == 'SCENE_LIVE_CODE') {
									this.$message.error('条件容器只可设置应用场景')
									item.children.splice(cindex, 1)
								}
							})
						}

						// for(var i = 0; i < item.children.length-1; i++){
						// 	for(var j = i+1; j < item.children.length; j++){
						// 		if(this.drawingList[index].children[i].targetId===this.drawingList[index].children[j].targetId){
						// 			this.drawingList[index].children.splice(j,1);
						// 			// j--;
						// 			return
						// 		}
						// 	}

						// 	// if(this.drawingList[index].children[i].targetId===this.drawingList[index+1].children[i].targetId){
						// 	// 	this.drawingList[index+1].children.splice(i,1);
						// 	// 	// i--;
						// 	// 	return
						// 	// }

						// }

					})

					this.drawingList = this.drawingList.map((item, index) => {
						return {
							...item,
							parentId: index,
							targetId: index,
							targetType: index
						}
					})

					this.drawingList.forEach((v, vindex) => {
						v.children.forEach((c, cindex) => {
							c.sonid = vindex,
								c.p_parentId = vindex
						})
					})

					let newData = this.flattenTree(this.drawingList, [])
					// console.log(newData, 666)

					const isRepeat2 = newData.some((x, index, q_arr) => q_arr.findIndex(y => (y.targetId == x
						.targetId && y.targetType == x.targetType)) != index)
					if (isRepeat2) {
						this.$message.warning('容器中的同类元素只可有一个')
					}

					const hasObj = {}
					let b_arr = newData.reduce((total, next) => {
						const filterKey = next.targetId + next.targetType
						hasObj[filterKey] ? '' : hasObj[filterKey] = true && total.push(next)
						return total
					}, [])

					// console.log(b_arr, 999)

					b_arr = b_arr.map(a => {
						return {
							...a,
							children: []
						}
					})

					let No_rq_list = b_arr.filter(item => {
						return item.layout != 'rowFormItem'
					})

					let is_rq_list = b_arr.filter(item => {
						return (item.componentName == '条件容器' || item.componentName == '非条件容器')
					})

					is_rq_list.forEach((q, qindex) => {
						No_rq_list.forEach((d, dindex) => {
							if (q.parentId == d.p_parentId) {
								q.children.push(d)
							}
						})
					})
					// console.log(is_rq_list, 10086)
					this.drawingList = is_rq_list

					this.drawingList = this.drawingList.filter(item => {
						console.log(item, 'children----')
						return item.tagIcon == 'row'
					})

					this.treeList = []
					this.drawingList.forEach(v => {
						if (v.children) {
							v.children.forEach((c => {
								this.treeList.push(c)
							}))
						}
					})
				}
				console.log(this.drawingList, 'drawingList--')
			},


			onEnd2(obj, a) {
				this.activeData = tempActiveData
				this.activeId = this.idGlobal
			},
			addComponent(item) {

				if (this.activeName == 'second') {
					return
				}
				if (item.tagIcon != 'row') {
					return
				}
				const clone = this.cloneComponent(item)
				this.drawingList.push(clone)
				this.activeFormItem(clone)

				// console.log(item,'item-----');
				// this.drawingList.push(clone)
			},
			cloneComponent(origin) {
				if (this.activeName == 'second') {
					return
				}
				const clone = JSON.parse(JSON.stringify(origin))
				clone.formId = ++this.idGlobal
				clone.span = formConf.span
				clone.renderKey = +new Date() // 改变renderKey后可以实现强制更新组件
				if (!clone.layout) clone.layout = 'colFormItem'
				if (clone.layout === 'colFormItem') {
					clone.vModel = `field${this.idGlobal}`
					clone.placeholder !== undefined && (clone.placeholder += clone.label)
					tempActiveData = clone
				} else if (clone.layout === 'rowFormItem') {
					delete clone.label
					// clone.componentName = `row${this.idGlobal}`
					clone.componentName = origin.label
					clone.gutter = this.formConf.gutter
					tempActiveData = clone
				}
				return tempActiveData
			},
			AssembleFormData() {
				this.formData = {
					fields: JSON.parse(JSON.stringify(this.drawingList)),
					...this.formConf
				}
			},
			generate(data) {
				const func = this[`exec${titleCase(this.operationType)}`]
				this.generateConf = data
				func && func(data)
			},
			execRun(data) {
				this.AssembleFormData()
				this.drawerVisible = true
			},
			execDownload(data) {
				const codeStr = this.generateCode()
				const blob = new Blob([codeStr], {
					type: 'text/plain;charset=utf-8'
				})
				this.$download.saveAs(blob, data.fileName)
			},
			execCopy(data) {
				document.getElementById('copyNode').click()
			},
			empty() {
				this.$confirm('确定要清空所有组件吗？', '提示', {
					type: 'warning'
				}).then(
					() => {
						this.drawingList = []
						this.newcloneList = []
						this.cloneList = []
						this.treeList = []
						this.activeName = 'first'
						this.delList = []
						this.twbg = ''
						this.twbg2 = ''
						this.isFixed = false
						this.fixedNum = 0
						this.$refs.child_show.clreaBg()
					}
				)
			},
			drawingItemCopy(item, parent) {
				let clone = JSON.parse(JSON.stringify(item))
				clone = this.createIdAndKey(clone)
				parent.push(clone)
				this.activeFormItem(clone)
			},
			click_down(item, parent) {
				console.log(item, parent, 'item--')
				if (this.activeName == 'first') {
					if (item.componentName == '条件容器' || item.componentName == '非条件容器') {
						let index = ''
						parent.forEach((a, aindex) => {
							if (item.formId == a.formId) {
								index = aindex
							}
						})
						this.drawingList.splice(index, 1)
						this.drawingList.splice(index + 1, 0, item)
					} else {
						let b_index = ''
						this.drawingList.forEach((b, bi) => {
							b.children.forEach(v => {
								if (item.formId == v.formId) {
									b_index = bi
								}
							})
						})
						let index = ''
						parent.forEach((a, aindex) => {
							if (item.formId == a.formId) {
								index = aindex
							}
						})
						this.drawingList[b_index].children.splice(index, 1)
						this.drawingList[b_index].children.splice(index + 1, 0, item)
					}
				} else if (this.activeName == 'second') {
					let index = ''
					parent.forEach((a, aindex) => {
						if (item.formId == a.formId) {
							index = aindex
						}
					})
					this.cloneList.splice(index, 1)
					this.cloneList.splice(index + 1, 0, item)
					this.newcloneList = _.cloneDeep(this.cloneList)
				}
			},
			click_moveup(item, parent) {
				if (this.activeName == 'first') {
					if (item.componentName == '条件容器' || item.componentName == '非条件容器') {
						let index = ''
						parent.forEach((a, aindex) => {
							if (item.formId == a.formId) {
								index = aindex
							}
						})
						this.drawingList.splice(index, 1)
						this.drawingList.splice(index - 1, 0, item)
					} else {
						let b_index = ''
						this.drawingList.forEach((b, bi) => {
							b.children.forEach(v => {
								if (item.formId == v.formId) {
									b_index = bi
								}
							})
						})
						let index = ''
						parent.forEach((a, aindex) => {
							if (item.formId == a.formId) {
								index = aindex
							}
						})
						this.drawingList[b_index].children.splice(index, 1)
						this.drawingList[b_index].children.splice(index - 1, 0, item)
					}
				} else if (this.activeName == 'second') {
					let index = ''
					parent.forEach((a, aindex) => {
						if (item.formId == a.formId) {
							index = aindex
						}
					})
					this.cloneList.splice(index, 1)
					this.cloneList.splice(index - 1, 0, item)
					this.newcloneList = _.cloneDeep(this.cloneList)
				}
			},
			createIdAndKey(item) {
				item.formId = ++this.idGlobal
				item.renderKey = +new Date()
				if (item.layout === 'colFormItem') {
					item.vModel = `field${this.idGlobal}`
				} else if (item.layout === 'rowFormItem') {
					item.componentName = `row${this.idGlobal}`
				}
				if (Array.isArray(item.children)) {
					item.children = item.children.map(childItem => this.createIdAndKey(childItem))
				}
				return item
			},
			drawingItemDelete(index, parent) {
				console.log(parent, index, 'parent--index');

				let arr = parent.filter((item) => {
					return item.componentName !== undefined
				})

				parent.forEach(a => {
					if (a.componentName == '条件容器' || a.componentName == '非条件容器') {
						if (parent[index].children) {
							parent[index].children.forEach((v, vindex) => {
								this.delList.push(v)
							})
						}
					} else {
						this.delList.push(parent[index])
					}
				})
				if (this.activeName == 'second') {
					this.$message.error('删除配置不可删除')
					return
				}

				this.drawingList.forEach((a, aindex) => {
					if (a.children) {
						a.children.forEach(b => {
							if (b.formId == parent[index].formId) {
								let num = this.drawingList[aindex].children.length - 1
								let arr = {
									num: num,
									activeName: this.activeName,
									componentName: a.componentName
								}
								this.$bus.$emit('brotherEvent', arr)
							}
							if (b.showType == '1' && (b.targetType == "SCENE_FORM" || b.targetType ==
									"SCENE_SIGN")) {
								this.isFixed = false
							}
						})
					}
				})
				parent.splice(index, 1)

				this.treeList = []
				this.drawingList.forEach(v => {
					if (v.children) {
						v.children.forEach((c => {
							this.treeList.push(c)
						}))
					}
				})

				this.$nextTick(() => {
					const len = this.drawingList.length
					if (len) {
						this.activeFormItem(this.drawingList[len - 1])

					}
				})
			},
			generateCode() {
				const {
					type
				} = this.generateConf
				this.AssembleFormData()
				const script = vueScript(makeUpJs(this.formData, type))
				const html = vueTemplate(makeUpHtml(this.formData, type))
				const css = cssStyle(makeUpCss(this.formData))
				return beautifier.html(html + script + css, beautifierConf.html)
			},
			download() {
				this.dialogVisible = true
				this.showFileName = true
				this.operationType = 'download'
			},
			run() {
				this.dialogVisible = true
				this.showFileName = false
				this.operationType = 'run'
			},
			copy() {
				this.dialogVisible = true
				this.showFileName = false
				this.operationType = 'copy'
			},
			tagChange(newTag) {
				newTag = this.cloneComponent(newTag)
				newTag.vModel = this.activeData.vModel
				newTag.formId = this.activeId
				newTag.span = this.activeData.span
				delete this.activeData.tag
				delete this.activeData.tagIcon
				delete this.activeData.document
				Object.keys(newTag).forEach(key => {
					if (this.activeData[key] !== undefined &&
						typeof this.activeData[key] === typeof newTag[key]) {
						newTag[key] = this.activeData[key]
					}
				})
				this.activeData = newTag
				this.updateDrawingList(newTag, this.drawingList)
			},
			updateDrawingList(newTag, list) {
				const index = list.findIndex(item => item.formId === this.activeId)
				if (index > -1) {
					list.splice(index, 1, newTag)
				} else {
					list.forEach(item => {
						if (Array.isArray(item.children)) this.updateDrawingList(newTag, item.children)
					})
				}
			},
			// 已选组织表格组织层级名称格式化
			// deptAncestorsNameFormatter(row, column, cellValue, index) {
			//   let str = ''
			//   if (row.deptAncestorsName != '' && row.deptAncestorsName != undefined) {
			//     str += row.deptAncestorsName.replaceAll(',', '/')
			//   }
			//   if(row.dept){
			//     if (row.dept.deptName != '' && row.dept.deptName != undefined) {
			//       if (row.deptAncestorsName != '' && row.deptAncestorsName != undefined) {
			//         str += '/' + row.dept.deptName
			//       } else {
			//         str += row.dept.deptName
			//       }
			//     }
			//   }
			//   return str
			// },
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
				this.loading = true
				//清空并获取所有加入公共推文的组织id
				// this.organizationUnallocated.queryParams.unallocatedIds = []
				this.organizationUnallocated.queryParams.allocatedOrganizationIds = []
				for (let i = 0; i < this.organizationAllocated.list.length; i++) {
					// this.organizationUnallocated.queryParams.unallocatedIds.push(this.organizationAllocated.list[i].organizationId)
					this.organizationUnallocated.queryParams.allocatedOrganizationIds.push(this.organizationAllocated.list[
						i].organizationId)
				}
				// this.organizationUnallocated.queryParams.unallocatedIds = this.organizationAllocated.queryParams.allocatedIds
				// this.organizationUnallocated.queryParams.unallocatedIds.push(sessionStorage.getItem('organizationId'))
				this.organizationUnallocated.queryParams.tweetId = this.$route.query.t
				unallocatedOrganizationList(this.addDateRange(this.organizationUnallocated.queryParams, [])).then(
					response => {
						this.organizationUnallocated.list = response.data
						// this.organizationUnallocated.total = response.total
						this.loading = false
					})
			},
			//添加组织关系
			addOrganization() {
				// let params = []
				// if (this.organizationUnallocated.ids) {
				// 	for (let i = 0; i < this.organizationUnallocated.ids.length; i++) {
				// 		let obj = {
				// 			organizationId: this.organizationUnallocated.ids[i],
				// 			tweetId: this.$route.query.t
				// 		}
				// 		params.push(obj)
				// 	}
				// }
				// if (params) {
				// 	addAllocated(params).then(response => {
				// 		this.organizationUnallocated.open = false
				// 		// this.getOrganizationAllocatedList()
				// 		this.$refs.organizationUnallocatedTable.clearSelection()
				// 	})
				// } else {
				// 	this.$modal.msgWarning('请选择要添加的组织')
				// }

				if (this.organizationUnallocated.ids) {
					for (let i = 0; i < this.organizationUnallocated.ids.length; i++) {
						for (let j = 0; j < this.organizationUnallocated.list.length; j++) {
							console.log(this.organizationUnallocated.ids[i])
							console.log(this.organizationUnallocated.list[i].organizationId)
							if (this.organizationUnallocated.ids[i] == this.organizationUnallocated.list[j]
								.organizationId) {
								this.organizationAllocated.list.push(this.organizationUnallocated.list[j])
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
			handleSelectionChange(selection) {
				this.organizationUnallocated.ids = selection.map(item => item.organizationId)
			},
			getRowKeys(row) {
				return row.organizationId
			},
			// tweetCommonFlagChange() {
			// 	if (this.ruleForm.tweetCommonFlag) {
			// 		this.getOrganizationAllocatedList()
			// 	}
			// },
			tweetchannelStatusChange() {
				this.ruleForm.channelStatus = this.ruleForm.channelStatus == true ? true : false
			},
			//已建立关系的组织
			// getOrganizationAllocatedList() {
			// 	this.organizationAllocated.list = []
			// 	this.organizationAllocated.queryParams.tweetId = this.$route.query.t
			// 	allocatedOrganizationList(this.addDateRange(this.organizationAllocated.queryParams, [])).then(response => {
			// 		this.organizationAllocated.list = response.rows
			// 		this.organizationAllocated.total = response.total
			// 		this.loading = false
			// 	})
			// },
			//组织关系id删除
			organizationAllocatedDel(row) {
				// let params = {
				// 	tweetId: parseInt(this.$route.query.t),
				// 	organizationId: row.organizationId
				// }
				//
				// this.$modal.confirm('是否确认删除组织名称为"' + row.organizationName + '"的数据项？').then(function() {
				// 	return organizationAllocatedDelete(params)
				// }).then(() => {
				// 	let data = {
				// 		tweetId: parseInt(this.$route.query.t)
				// 	}
				// 	getInfotweet(data).then(res => {
				// 		if (res.data.tweetCommonFlag == '1') {
				// 			this.organizationAllocated.queryParams.allocatedIds = []
				// 			let allocatedOrganizationIds = res.data.allocatedOrganizationIds.split(',')
				// 			for (let i = 0; i < allocatedOrganizationIds.length; i++) {
				// 				this.organizationAllocated.queryParams.allocatedIds.push(
				// 					allocatedOrganizationIds[i])
				// 			}
				// 			this.tweetCommonFlagChange()
				// 		}
				// 	})
				// 	this.getOrganizationAllocatedList()
				// 	this.$modal.msgSuccess('删除成功')
				// }).catch(() => {})
				for (let i = 0; i < this.organizationAllocated.list.length; i++) {
					if (this.organizationAllocated.list[i].organizationId == row.organizationId) {
						this.organizationAllocated.list.splice(i, 1)
					}
				}
				console.log(this.organizationAllocated.list, "................this.organizationAllocated.list")
			},
			handleSkipTypeChange(item) {
				for (let i = 0; i < this.tweetFormList.length; i++) {
					if (this.tweetFormList[i].targetType == item.targetType && this.tweetFormList[i].targetId == item
						.targetId) {
						this.tweetFormList[i].skipType = item.skipType == '0' ? '0' : '1'
						console.log(this.tweetFormList[i].skipType)
						break
					}
				}
			},
			itemDragStart(e, p) {
				//console.log("拖动start",e,p);
				this.drag = e;
				this.drag_p = p;
				this.drag_top = p.cssStyle.top_margin;
				this.drag_left = p.cssStyle.left_margin;
			},
			drop(e) {

			},
			dragEnd(e) {
				//console.log("拖动end",e);
				this.dropTo(e);
			},
			dragOver(e) {
				this.dropTo(e);
			},
			dropTo(e) {
				this.drag_p.cssStyle.left_margin = this.drag_left + (e.x - this.drag.x)
				this.drag_p.cssStyle.top_margin = this.drag_top + (e.y - this.drag.y)
				const str = this.drag_p.cssStyle.t_transform;
				const regex = /scale\((.*?)\)/; // 使用非贪婪模式匹配括号中的内容
				const matches = str.match(regex);
				const content = matches && matches[1];
				console.log(content, 'content--');
				this.drag_p.cssStyle.scaleTopValue = this.drag_p.cssStyle.top_margin+(this.activeElementHeight*(1-content)/2);
					
				this.drag_p.cssStyle.scaleLeftValue = this.drag_p.cssStyle.left_margin+(232*(1-content)/2)
				console.log(this.drag_p.cssStyle.scaleLeftValue, '移动的----左边距');
				console.log(this.drag_p.cssStyle.scaleTopValue, '移动的----上边距');
			},
			// 长按判断选中某个元素
			startLongPress(item) {
				this.longPressTimeout = setTimeout(() => {
					this.selectElement(item);
				}, 300);
			},
			endLongPress() {
				clearTimeout(this.longPressTimeout);
			},
			cancelLongPress() {
				clearTimeout(this.longPressTimeout);
			},
			selectElement(item) {
				console.log(item, 'item------');
				// 在这里执行选中元素的逻辑操作
				if (this.cloneList.length != 0) {
					this.cloneList.forEach((v, index) => {
						if (v.targetType == item.targetType && v.targetId == item.targetId) {
							this.activeData = v
							this.activeIndex = index
							this.$refs.child_show.getFater(this.activeIndex)
						}
					})
				}
				if (this.newcloneList.length != 0) {
					this.newcloneList.forEach((v, index) => {
						if (v.targetType == item.targetType && v.targetId == item.targetId) {
							this.activeData = v
							this.activeIndex = index
							this.$refs.child_show.getFater(this.activeIndex)
						}
					})
				}

			}
		}
	}
</script>

<style lang="scss">
	body,
	html {
		margin: 0;
		padding: 0;
		background: #fff;
		-moz-osx-font-smoothing: grayscale;
		-webkit-font-smoothing: antialiased;
		text-rendering: optimizeLegibility;
		font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Helvetica, Arial, sans-serif, Apple Color Emoji, Segoe UI Emoji;
	}

	input,
	textarea {
		font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Helvetica, Arial, sans-serif, Apple Color Emoji, Segoe UI Emoji;
	}

	.tweetArticle {
		display: flex;

		.editor-tabs {
			background: #121315;

			.el-tabs__header {
				margin: 0;
				border-bottom-color: #121315;

				.el-tabs__nav {
					border-color: #121315;
				}
			}

			.el-tabs__item {
				height: 32px;
				line-height: 32px;
				color: #888a8e;
				border-left: 1px solid #121315 !important;
				background: #363636;
				margin-right: 5px;
				user-select: none;
			}

			.el-tabs__item.is-active {
				background: #1e1e1e;
				border-bottom-color: #1e1e1e !important;
				color: #fff;
			}

			.el-icon-edit {
				color: #f1fa8c;
			}

			.el-icon-document {
				color: #a95812;
			}
		}

		// home
		.right-scrollbar {
			.el-scrollbar__view {
				padding: 12px 18px 15px 15px;
			}
		}

		.left-scrollbar .el-scrollbar__wrap {
			box-sizing: border-box;
			overflow-x: hidden !important;
			margin-bottom: 0 !important;
		}

		.center-tabs {
			.el-tabs__header {
				margin-bottom: 0 !important;
			}



			.el-tabs__nav {
				width: 100%;
			}
		}

		.reg-item {
			padding: 12px 6px;
			background: #f8f8f8;
			position: relative;
			border-radius: 4px;

			.close-btn {
				position: absolute;
				right: -6px;
				top: -6px;
				display: block;
				width: 16px;
				height: 16px;
				line-height: 16px;
				background: rgba(0, 0, 0, 0.2);
				border-radius: 50%;
				color: #fff;
				text-align: center;
				z-index: 1;
				cursor: pointer;
				font-size: 12px;

				&:hover {
					background: rgba(210, 23, 23, 0.5)
				}
			}

			&+.reg-item {
				margin-top: 18px;
			}
		}

		.action-bar {
			padding: 6px 1px 0 0px;

			& .el-button+.el-button {
				margin-left: 15px;
			}

			& i {
				font-size: 20px;
				vertical-align: middle;
				position: relative;
				top: -1px;
			}
		}

		.custom-tree-node {
			width: 100%;
			font-size: 14px;

			.node-operation {
				float: right;
			}

			i[class*="el-icon"]+i[class*="el-icon"] {
				margin-left: 6px;
			}

			.el-icon-plus {
				color: #409EFF;
			}

			.el-icon-delete {
				color: #157a0c;
			}
		}

		.left-scrollbar .el-scrollbar__view {
			overflow-x: hidden;
		}

		.el-rate {
			display: inline-block;
			vertical-align: text-top;
		}

		.el-upload__tip {
			line-height: 1.2;
		}

		$selectedColor: #999;
		$lighterBlue: #409EFF;

		.container {
			position: relative;
			width: 100%;
			height: 100%;
		}

		.components-list {
			padding: 1px;
			box-sizing: border-box;

			/* height: 100%; */
			.components-item {
				display: inline-block;
				flex-direction: column;
				width: 31%;
				margin: 1% 1%;
				transition: transform 0ms !important;
			}

			.components-item2 {
				display: inline-block;
				flex-direction: column;
				width: 48%;
				margin: 1% 1%;
				transition: transform 0ms !important;
			}
		}

		.components-draggable {
			/* padding-bottom: 20px; */
		}

		.components-title {
			font-size: 14px;
			color: #222;
			margin: 6px 2px;

			.svg-icon {
				color: #666;
				font-size: 18px;
			}
		}

		.components-body {
			padding: 5px 6px;
			// background: $selectedColor;
			font-size: 12px;
			cursor: move;
			border: 1px solid $selectedColor;
			border-radius: 3px;

			.svg-icon {
				color: #777;
				font-size: 15px;
			}

			&:hover {
				border: 1px solid #787be8;
				color: #787be8;

				.svg-icon {
					color: #787be8;
				}
			}
		}

		// .left-board {
		// 	// width: 480px;
		// 	// // width: 33%;
		// 	// position: absolute;
		// 	// left: 0;
		// 	// // top: 40px;
		// 	// height:100%;
		// 	// // height: 600px !important;
		// 	overflow-y: scroll;
		// 	width: 480px;
		// 	width: 33%;
		// 	// position: absolute;
		// 	left: 0;
		// 	// top: 40px;
		// 	height: 100%;
		// }

		// .left-scrollbar {
		// 	height: calc(100vh - 42px);
		// 	height:100%;
		// 	overflow: hidden;
		// }

		.left-board {
			/* width: 480px; */
			width: 30%;
			// height: 500px;
		}

		.left-scrollbar {
			// height: calc(100vh - 42px);
			overflow-y: auto;
		}


		.center-scrollbar {
			// height: calc(100% - 42px);
			// overflow: hidden;
			border-left: 1px solid #f1e8e8;
			border-right: 1px solid #f1e8e8;
			box-sizing: border-box;

		}

		.center-board {
			// height: 100%;
			/* margin: 0 350px 0 480px; */
			// margin: 0 28% 0 480px;
			margin: 0px !important;
			box-sizing: border-box;
		}

		.empty-info {
			position: absolute;
			top: 46%;
			left: 0;
			right: 0;
			text-align: center;
			font-size: 18px;
			color: #ccb1ea;
			letter-spacing: 4px;
		}

		.action-bar {
			position: relative;
			height: 42px;
			text-align: right;
			padding: 6px 15px 0 15px;
			box-sizing: border-box;
			border: 1px solid #f1e8e8;
			border-top: none;
			border-left: none;

			.delete-btn {
				color: #F56C6C;
			}
		}

		.logo-wrapper {
			position: relative;
			height: 42px;
			background: #fff;
			border-bottom: 1px solid #f1e8e8;
			box-sizing: border-box;
		}

		.logo {
			position: absolute;
			left: 12px;
			top: 6px;
			line-height: 30px;
			color: #00afff;
			font-size: 17px;
			white-space: nowrap;

			>img {
				width: 30px;
				height: 30px;
				vertical-align: top;
			}

			.github {
				display: inline-block;
				vertical-align: sub;
				margin-left: 15px;

				>img {
					height: 22px;
				}
			}
		}

		.center-board-row {
			/* flex: 1; */
			padding: 12px 12px 15px 12px;
			box-sizing: border-box;

			border &>.el-form {
				// 69 = 12+15+42
				// height: calc(100vh - 69px);
			}
		}

		.drawing-board {
			// height: 100%;
			position: relative;
			margin: 0 5%;

			.components-body {
				padding: 0;
				margin: 0;
				font-size: 0;
			}

			.sortable-ghost {
				position: relative;
				display: block;
				overflow: hidden;

				&::before {
					content: " ";
					position: absolute;
					left: 0;
					right: 0;
					top: 0;
					height: 3px;
					background: rgb(89, 89, 223);
					z-index: 2;
				}
			}

			.components-item.sortable-ghost {
				width: 100%;
				height: 60px;
				background-color: transparent !important;
				;
			}

			.active-from-item {
				&>.el-form-item {
					background: #e8ebfe;
					border-radius: 6px;
				}

				&>.drawing-item-copy,
				&>.drawing-item-moveup,
				&>.drawing-item-delete {
					display: initial;
				}

				&>.component-name {
					color: $lighterBlue;
				}
			}

			.el-form-item {
				margin-bottom: 15px;
			}
		}

		.drawing-item {
			/* text-align: center; */
			position: relative;
			cursor: move;

			&.unfocus-bordered:not(.activeFromItem)>div:first-child {
				border: 1px solid #ccc;
			}

			.el-form-item {
				padding: 12px 10px;
				display: flex;
				/* justify-content: center;
			align-items: center; */
				/* flex-direction: column; */

			}
		}


		.drawing-row-item {
			position: relative;
			cursor: move;
			box-sizing: border-box;
			border: 2px solid #ccc;
			border-radius: 3px;
			padding: 0 2px;
			margin-bottom: 15px;

			.drawing-row-item {
				margin-bottom: 2px;
			}

			.el-col {
				margin-top: 22px;
			}

			.el-form-item {
				margin-bottom: 0;
			}

			.drag-wrapper {
				min-height: 160px;
			}

			&.active-from-item {
				border: 1px solid $lighterBlue;
			}

			.component-name {
				position: absolute;
				top: 0;
				left: 0;
				/* font-size: 12px; */
				color: #bbb;
				display: inline-block;
				padding: 0 6px;
			}
		}

		.drawing-item,
		.drawing-row-item {
			&:hover {
				&>.el-form-item {
					background: #e8ebfe;
					border-radius: 6px;
				}

				&>.drawing-item-copy,
				&>.drawing-item-moveup,
				&>.drawing-item-delete {
					display: initial;
				}
			}

			&>.drawing-item-copy,
			&>.drawing-item-moveup,
			&>.drawing-item-delete {
				display: none;
				position: absolute;
				top: -10px;
				width: 22px;
				height: 22px;
				line-height: 22px;
				text-align: center;
				border-radius: 50%;
				font-size: 12px;
				border: 1px solid;
				cursor: pointer;
				z-index: 1;
			}

			&>.drawing-item-moveup {
				right: 88px;
				border-color: $lighterBlue;
				color: $lighterBlue;
				background: #fff;

				&:hover {
					background: $lighterBlue;
					color: #fff;
				}
			}

			&>.drawing-item-copy {
				right: 56px;
				border-color: $lighterBlue;
				color: $lighterBlue;
				background: #fff;

				&:hover {
					background: $lighterBlue;
					color: #fff;
				}
			}

			&>.drawing-item-delete {
				right: 24px;
				border-color: #F56C6C;
				color: #F56C6C;
				background: #fff;

				&:hover {
					background: #F56C6C;
					color: #fff;
				}
			}
		}

		.border {
			border: 1px solid red
		}

		.right-board[data-v-4af80ebd] {
			width: 30%
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

		.flex-column {
			flex-direction: column;
		}

		.select_height {
			padding: 7px 0 12px 10px;

			.el-form-item {
				margin-bottom: 0px;
			}
		}

		.messageCard {
			overflow-y: scroll;
		}

		.messageCard::-webkit-scrollbar {
			width: 10px !important;
		}

		.messageCard::-webkit-scrollbar-thumb {
			border-radius: 10px;
			width: 10px !important;
			/* background: rgba(0,0,0,0.2); */
			background: #dddee0;
		}

		.messageCard::-webkit-scrollbar-track {
			border-radius: 0;
			width: 10px !important;
			/* background: rgba(0,0,0,0.1); */
		}

		.position-relative {
			position: relative;
		}

		.position-absolute {
			position: absolute;
		}

		.components-body2 {
			padding: 8px 10px;
			background: transparent !important;
			font-size: 12px;
			cursor: move;
			border: 1px solid #999;
			border-radius: 3px;
			height: 98px;
		}

		.ml-1 {
			margin-left: 10px;
		}

		.ml-2 {
			margin-left: 20px;
		}

		.drawing-row-item.active-from-item {
			/* border: 2px solid #409EFF; */
			border: 3px solid red;
			padding-bottom: 20px
		}

		.drawing-row-item.active-from-item-isF {
			border: 3px solid lightseagreen;
			padding-bottom: 20px
		}

		.drawing-row-item.active-from-item-noisF {
			border: 3px solid sandybrown;
			padding-bottom: 20px
		}

		.el-dialog__body {}

		.el_dialog_img {
			max-height: 28rem;
			margin: auto;
			max-width: 50rem;
			display: flex;
			align-items: center;
			justify-content: center;
			border: 1px soild red;
		}

		.el_dialog_video {
			max-height: 28rem;
			margin: auto;
			max-width: 50rem;
			display: flex;
			align-items: center;
			justify-content: center;
		}

		.colorred {
			border: 2px solid red !important;
		}

		.colorblue {
			border: 2px solid blueviolet !important;
		}

		.el-button--mini {
			padding: 5px 12px;
		}

		.drawing-item .el-form-item {
			padding: 5px 10px;
		}

		.el-form-item__content {
			margin-left: 20px !important;
		}

		.drawing-board .el-form-item {
			margin-bottom: 0px;
		}

		.el-form-item--small.el-form-item {
			display: flex;
		}

		.drawing-item .el-form-item {
			/* padding: 0 !important */
		}

		.drawing-item {
			margin-top: 5px;
			padding-top: 5px;
		}

		.el-form-item--medium {
			box-sizing: border-box;
			/* padding: 5px !important; */
			padding: 5px 0 5px calc(44% - 60px) !important;
		}

		.drawing-row-item .el-col {
			margin-top: -3px !important;
		}

		.drawing-row-item .el-col:first-child {
			margin-top: 22px !important;
		}

		/* .tweetArticle .drawing-row-item .el-col:nth-child(1){
			margin-top: 20px !important;
		} */
		/* .tweetArticle .drawing-row-item .el-col{
			margin-top: -3px !important;
			border: 1px solid red;
		} */
		.el-form-item__content {
			display: flex;
			align-items: center;
		}

		.font-14 {
			font-size: 14px !important;
		}

		.font-12 {
			font-size: 12px !important;
		}

		.font-10 {
			font-size: 10px !important;
		}

		.p-20 {
			padding: 20px;
		}

		.p-10 {
			padding: 10px;
		}

		.line-20 {
			line-height: 20px;
		}

		.mt-5 {
			margin-top: 5px !important;
		}

		.mb-5 {
			margin-bottom: 5px !important;
		}

		.mb-10 {
			margin-bottom: 10px !important;
		}

		.mb-20 {
			margin-bottom: 20px !important;
		}

		.text-indent-2 {
			text-indent: 2em;
		}
	}

	.scrol::-webkit-scrollbar {
		width: 10px !important;
	}

	.prev_pho {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 400px;
		margin: 0 auto;
		position: relative;
	}

	.prev_pho_div {
		min-width: 232px;
		max-width: 232px;
		width: 232px;
		margin: 14px 0 0px 4px;
		border-radius: 18px;
		z-index: 20;
		height: 30rem !important;
		overflow-y: scroll;
	}

	.prev_pho_div2 {
		min-width: 232px;
		max-width: 232px;
		width: 232px;
		margin: 14px 0 0px 4px;
		z-index: 20;
		// overflow-y: auto;
		background-color: #fff;
		overflow: hidden;
	}

	.bgColor {
		background: #454444;
	}

	.mb-10 {
		margin-bottom: 10px !important;
	}

	.mt-10 {
		margin-top: 10px !important;
	}

	.mt-20 {
		margin-top: 20px !important;
	}

	.activeBorder {
		border: 2px solid red !important;
		box-sizing: border-box;
	}

	.form_Border {
		border: 1px solid #666 !important;
		box-sizing: border-box;
	}

	.p-5 {
		padding: 5px !important;
	}

	.row {
		box-sizing: border-box !important;
		display: flex !important;
		flex-direction: row;
		flex-wrap: wrap;
	}

	[class*='col-'],
	[class*='span-'],
	[class*='span24-'] {
		min-height: 1px;
		box-sizing: border-box !important;
	}

	.span24-8 {
		width: 33.33%;
	}
	
	.span24-12 {
		width: 50%;
	}

	.el-tabs__nav {
		width: 100% !important;
	}

	.el-tabs__item {
		width: 25% !important;
		text-align: center !important;
	}

	.phone-input {
		outline: none;
		padding: 10px 0;
		border: none;
		width: 50%;
		height: 30px;
		line-height: 30px;
		text-align: center;
		// border: solid 2px #009aea;
		font-size: 14px;
		color: #606266;
		// background-color: #009aea20;
	}

	.phone-input2 {
		outline: none;
		// padding: 2px 0;
		border: none;
		color: #606266;
	}

	.phone-input3 {
		border: solid 1px #606266;
		border-radius: 5px;
		padding: 5px
	}

	.xian {
		border: 1px solid #999;
		height: .5px;
		width: 100%
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
		border-radius: 5px;
		text-align: center;
		border: solid 1px #606266;
		font-size: 16px;
	}

	.textarea2 {
		width: 80%;
		border-radius: 5px;
		text-align: center;
		border: none;
		outline: none;
		font-size: 16px;
	}

	.widthSX {
		width: 100%
	}

	.widthZY {
		width: 70px
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

	// 不滚动
	.no_overflow {
		overflow-y: hidden
	}

	.y_overflow {
		overflow-y: scroll
	}

	.tweetArticle {
		.el-range-editor--medium .el-range-input {
			font-size: 14px
		}

		label {
			font-weight: 500 !important;
			color: #333 !important
		}

		.el-form-item__content {
			margin-left: 0px !important
		}

		.guize {
			.el-radio:last-child {
				margin-left: 100px;
			}
		}

		.formP {
			.el-radio:last-child {
				margin-left: 100px;
			}
		}

		.el-textarea__inner {
			height: 175px
		}
	}
	.dsgxDialog{
		.el-table__header, .el-table__body, .el-table__footer{
			width: 100% !important;
		}
	}
</style>