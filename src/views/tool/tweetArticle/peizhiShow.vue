<template>
	<div>
		<img v-if='sjkShow' src="../../../assets/images/phone.png"
			style="height: 35rem;position: absolute;top: 0;left: 70px;" alt="">
		<div class="scrol  position-relative" style="background-size: cover;background-repeat: no-repeat;background-position: center;z-index: 101;" :class=" sjkShow == true ? 'prev_pho_div' : 'prev_pho_div2' " :style="{backgroundImage:'url('+twbg+')'}">
			<div v-for="(q,qi) in cloneList" :key="qi">
				<div v-if="q.targetType == 'MEDIA_IMAGE'" class="">
					<div v-if="q.bg_switch == false" style="width: 232px;margin: 0 auto;" class="position-absolute" :style="{ top: q.top_margin + 'px', left:q.left_margin + 'px',transform: q.t_transform,zIndex:q.pic_zindex }" @click.stop="click_show(q,qi)" ref="myElement">
						<img :src="q.src" style="width: 232px;height:100%" alt="">
					</div>
				</div>
				<div v-if="q.targetType == 'MEDIA_VIDEO'" class="mt-5">
					<div  style="width: 232px;margin: 0 auto;" class="position-absolute" :style="{ top: q.top_margin + 'px', left:q.left_margin + 'px',transform: q.t_transform,zIndex:q.pic_zindex }" @click.stop="click_show(q,qi)" ref="myElement">
						<video style="width: 100%" :src="q.src" @click="click_show(q)"
							alt=""></video>
					</div>
				</div>
				
				<div v-if="q.targetType == 'PRODUCT_COUPON'" class="mt-5"
					style="min-height: 120px;margin: 10px 0;" @click="click_show(q)">
					<div style="width: 232px;margin: 0 auto;" class="position-absolute" :style="{ top: q.top_margin + 'px', left:q.left_margin + 'px',transform: q.t_transform,zIndex:q.pic_zindex }" @click.stop="click_show(q,qi)" ref="myElement">
						<div class="position-relative" style="position: relative;">
							<div style="z-index: 100 !important;color:#fff;position: absolute;top:20px;left:22px">
								<span class="font-14">{{ q.title }}</span><br>
								<span class="font-14">{{ q.content }}</span><br>
							</div>
							<img class="position-absolute"
								style="width: 100%;max-height: 120px;top: 0;letf:0;position: absolute;"
								:src="q.src" alt=""></img>
						</div>
					</div>
				</div>
				<div v-if="q.targetType == 'MEDIA_TEXT'" class="mt-5">
					<div class="font-14 line-20 position-absolute p-10" style="width: 232px;margin: 0 auto;" :style="{ top: q.top_margin + 'px', left:q.left_margin + 'px',transform: q.t_transform,zIndex:q.pic_zindex }" @click.stop="click_show(q,qi)" ref="myElement">
						{{ q.content }}
					</div>
				</div>
		
				<div v-if="q.targetType == 'SCENE_FORM'" class="mt-5"
					style="" @click="click_show(q)" >
					<div class="position-absolute" style="width: 232px;margin: 0 auto;padding: 10px;background: #fff" :style="{ top: q.top_margin + 'px', left:q.left_margin + 'px',transform: q.t_transform,zIndex:q.pic_zindex }" @click.stop="click_show(q,qi)" ref="myElement">
						<div style="font-weight: 600;color: #333" v-html="q.tipInfo"></div>
						<div v-for="(f,fi) in q.elementList">
							<div v-if="f.type == 0" class="mb-10">
								<div class="mt-10 font-12">{{f.name}}</div>
								<div class="mt-5">
									<input type="text"
										style="outline: none;border: 1px solid #e8e8e8;border-radius: 3px;padding: 6px 8px;width: 190px;">
								</div>
							</div>
							<div v-if="f.type == 2" class="mb-10">
								<div class="mt-10 font-12">{{f.name}}</div>
								<div class="mt-5">
									<el-radio-group v-model='f.value'>
										<el-radio :label="r.name" v-for="(r,ri) in f.optionList"
											:key="ri">{{r.name}}</el-radio>
									</el-radio-group>
								</div>
							</div>
							<div v-if="f.type == 3" class="mb-10 ">
								<div class="mt-10 font-12">{{f.name}}</div>
								<div class="mt-5">
									<el-checkbox-group v-model="checkList">
										<el-checkbox v-for="(c,ci) in f.optionList" :key="ci"
											:label="c.name" name="type"></el-checkbox>
									</el-checkbox-group>
								</div>
							</div>
							<div v-if="f.type == 4" class="mb-10 ">
								<div class="mt-10 font-12">{{f.name}}</div>
								<div class="mt-5">
									<el-select clearable v-model="f.value" placeholder="请选择">
										<el-option :label="ss.name" v-for="(ss,ssi) in f.optionList"
											:value="ss.val" :key="ssi"></el-option>
									</el-select>
								</div>
							</div>
						
							<div v-if="f.type == 5" class="mb-10 ">
								<div class="mt-10 font-12">{{f.name}}</div>
								<div class="mt-5">
									<el-rate v-model="f.value" style="margin-top: 10px;"></el-rate>
								</div>
							</div>
							<div v-if="f.type == 6" class="mb-10">
								<div class="mt-10 font-12">{{f.name}}</div>
								<div class="mt-5">
									<el-date-picker style="width:190px;" v-model="f.value1" type="date"
										placeholder="选择日期">
									</el-date-picker>
								</div>
							</div>
							<div v-if="f.type == 7" class="mb-10 ">
								<div class="mt-10 font-12">{{f.name}}</div>
								<div class="mt-5">
									<el-date-picker style="width:190px;" v-model="f.value"
										type="daterange" range-separator="至" start-placeholder="开始日期"
										end-placeholder="结束日期">
									</el-date-picker>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div v-if="q.targetType == 'SCENE_SIGN'" class="mt-5"
					style=""
					@click="click_show(q)">
					<div class="position-absolute" style="width: 232px;margin: 0 auto;padding: 10px;background: #fff" :style="{ top: q.top_margin + 'px', left:q.left_margin + 'px',transform: q.t_transform,zIndex:q.pic_zindex }" @click.stop="click_show(q,qi)" ref="myElement">
						<div style="font-weight: 600;color: #333" v-html="q.tipInfo"></div>
						<div v-for="(f,fi) in q.elementList">
							<div v-if="f.type == 0" class="mb-10">
								<div class="mt-10 font-12">{{ f.name }}</div>
								<div class="mt-5">
									<input type="text"
										style="outline: none;border: 1px solid #e8e8e8;border-radius: 3px;padding: 6px 8px;width: 190px;">
								</div>
							</div>
							<div v-if="f.type == 2" class="mb-10">
								<div class="mt-10 font-12">{{ f.name }}</div>
								<div class="mt-5">
									<el-radio-group v-model="f.value">
										<el-radio :label="r.name" v-for="(r,ri) in f.optionList"
											:key="ri">{{ r.name }}
										</el-radio>
									</el-radio-group>
								</div>
							</div>
							<div v-if="f.type == 3" class="mb-10 ">
								<div class="mt-10 font-12">{{ f.name }}</div>
								<div class="mt-5">
									<el-checkbox-group v-model="checkList">
										<el-checkbox v-for="(c,ci) in f.optionList" :key="ci"
											:label="c.name" name="type"></el-checkbox>
									</el-checkbox-group>
								</div>
							</div>
							<div v-if="f.type == 4" class="mb-10 ">
								<div class="mt-10 font-12">{{ f.name }}</div>
								<div class="mt-5">
									<el-select clearable v-model="f.value" placeholder="请选择">
										<el-option :label="ss.name" v-for="(ss,ssi) in f.optionList"
											:value="ss.val" :key="ssi"></el-option>
									</el-select>
								</div>
							</div>
						
							<div v-if="f.type == 5" class="mb-10 ">
								<div class="mt-10 font-12">{{ f.name }}</div>
								<div class="mt-5">
									<el-rate v-model="f.value" style="margin-top: 10px;"></el-rate>
								</div>
							</div>
							<div v-if="f.type == 6" class="mb-10">
								<div class="mt-10 font-12">{{ f.name }}</div>
								<div class="mt-5">
									<el-date-picker style="width:190px;" v-model="f.value1" type="date"
										placeholder="选择日期">
									</el-date-picker>
								</div>
							</div>
							<div v-if="f.type == 7" class="mb-10 ">
								<div class="mt-10 font-12">{{ f.name }}</div>
								<div class="mt-5">
									<el-date-picker style="width:190px;" v-model="f.value"
										type="daterange" range-separator="至" start-placeholder="开始日期"
										end-placeholder="结束日期">
									</el-date-picker>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	
	export default {
		props: {
		    cloneList: {
		      type: Array,
		      default: [],
		    },
			sjkShow:{
				type: Boolean,
				default: true,
			},
			twbg:{
				type: String,
				default: '',
			}
		},
		data(){
			return {
				// sjkShow:true,
				activeData:'',
				activeIndex:0,
				activeElementWidth:''
			}
		},
		mounted() {
			console.log(this.cloneList,'cloneList999-----888');
		},
		methods:{
			click_show(q, index) {
				this.$nextTick(() => {
				    this.activeElementWidth = this.$refs.myElement[0].offsetWidth;
				});
				this.activeData = q
				this.activeIndex = index
				this.$emit('click_activeIndex',this.activeIndex);
			},
			getData(list){
				console.log(list,'list---99')
			},
			getImg(val){
				this.twbg = val
				console.log(this.twbg,'twbg----888')
			}
		}
	}
</script>


<style lang="scss" scoped>
		.border {
			border: 1px solid red
		}
		.right-board[data-v-4af80ebd] {
			width: 28%
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
		.position-relative {
			position: relative;
		}

		.position-absolute {
			position: absolute;
		}
		.ml-1 {
			margin-left: 10px;
		}

		.ml-2 {
			margin-left: 20px;
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
		.p-20{
			padding: 20px;
		}
		.p-10{
			padding: 10px;
		}
		.line-20 {
			line-height: 28px;
		}

		.mt-5 {
			margin-top: 5px !important;
		}

		.mb-5 {
			margin-bottom: 5px !important;
		}

		.text-indent-2 {
			text-indent: 2em;
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
		// padding: 10px 20px;
		width: 242px;
		// margin: 40px auto 5px;
		margin: 14px 0 0px 4px;
		border-radius: 20px;
		z-index: 20;
		height: 33rem;
		overflow-y: scroll;
	}
	.prev_pho_div2 {
		width: 242px;
		margin: 14px 0 0px 4px;
		z-index: 20;
		height: 33rem;
		overflow-y: scroll;
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
		border: 1px solid red !important;
		border-radius: 4px;
	}

	.p-5 {
		padding: 5px !important;
	}
</style>