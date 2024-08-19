<!-- 预览专用 -->
<template>
	<div v-if="chooseElementList.length != 0 ">
		<div v-for="(f,fi) in chooseElementList" :key="fi"  style="width: 90%;margin: 0px auto;display: block;padding: 0px 5px;">
			<div v-if="f.type == 0" class="mb-10">
				<div v-if="f.showStyle == 1"
					class="d-flex j-sb a-center"
					style="height:40px">
					<div style="font-size:13px;max-width: 80px;min-width: 80px;width: 100px;white-space: nowrap;overflow: hidden; text-overflow: ellipsis;color:#333">
						{{f.tipInfo}}
					</div>
					
					<div class="ml-1" style="width:100%">
						<input readonly  v-model=" f.value "
							style="width: 100%;text-align: left;border-radius: 4px;padding: 10px;outline: none;border: 1px solid #999;" />
					</div>
				</div>
				<div v-if="f.showStyle == 0">
					<div  style="font-size:13px;width: 100%;white-space: nowrap;overflow: hidden; text-overflow: ellipsis;color:#333">
						{{f.tipInfo}}
					</div>
					<div class="mt-10">
						<input readonly v-model=" f.value "
							style="width: 100%;text-align: left;border-radius: 4px;padding: 10px;outline: none;border: 1px solid #999;" />
					</div>
				</div>
				<div v-if="f.showStyle == 2"
					class="d-flex j-sb a-center"
					style="height:40px">
					<input readonly v-model=" f.value "
						:placeholder="'请输入' + `${f.tipInfo}`"
						style="width: 100%;text-align: left;border-radius: 4px;padding: 10px;outline: none;border: 1px solid #999;" />
				</div>
			</div>
			<div v-if="f.type=='1'" class="mb-10">
				<div v-if="f.showStyle == 1"
					class="d-flex j-sb">
					<div style="font-size:13px;max-width: 80px;min-width: 80px;width: 100px;white-space: nowrap;overflow: hidden; text-overflow: ellipsis;color:#333">
						{{f.tipInfo}}
					</div>
					<div class="ml-1" style="width:100%">
						<input readonly v-model=" f.value "
							style="width: 100%;text-align: left;border-radius: 4px;padding: 10px;outline: none;border: 1px solid #999;height:50px" />
					</div>
					
				</div>
				<div v-if="f.showStyle == 0">
					<div style="font-size:13px;width: 100%;white-space: nowrap;overflow: hidden; text-overflow: ellipsis;color:#333">
						{{f.tipInfo}}
					</div>
					<div class="mt-10">
						<input readonly v-model=" f.value "
							style="width: 100%;text-align: left;border-radius: 4px;padding: 10px;outline: none;border: 1px solid #999;height:50px" />
					</div>
				</div>
				<div v-if="f.showStyle == 2">
					<input readonly :placeholder="'请输入' + `${f.tipInfo}`" v-model=" f.value "
						style="width: 100%;text-align: left;border-radius: 4px;padding: 10px;outline: none;border: 1px solid #999;height:50px" />
				</div>
			</div>
			<div v-if="f.type == 2" class="mb-10">
				<div v-if="f.showStyle == 1 && f.showType == '0'"
					class="d-flex">
					<div style="font-size:13px;max-width: 80px;min-width: 80px;width: 100px;white-space: nowrap;overflow: hidden; text-overflow: ellipsis;color:#333">
						{{f.tipInfo}}
					</div>
					<div class="ml-1" >
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
					<div style="font-size:13px;max-width: 80px;min-width: 80px;width: 100px;white-space: nowrap;overflow: hidden; text-overflow: ellipsis;color:#333">
						{{f.tipInfo}}
					</div>
					<div class="ml-1" style="width: 100%;">
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
				<div v-if="f.showStyle == 0 && f.showType == '0'">
					<div style="font-size:13px;width: 100%;white-space: nowrap;overflow: hidden; text-overflow: ellipsis;color:#333">
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
					<div style="font-size:13px;width: 100%;white-space: nowrap;overflow: hidden; text-overflow: ellipsis;color:#333">
						{{f.tipInfo}}
					</div>
					<div class="mt-10" style="width: 100%;">
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
					<div style="font-size:13px;max-width: 80px;min-width: 80px;width: 100px;white-space: nowrap;overflow: hidden; text-overflow: ellipsis;color:#333">
						{{f.tipInfo}}
					</div>
					<div class="ml-1">
						<el-checkbox-group v-if="f.type=='3' && f.optionList!=null && f.optionList.length!=0 &&f.showType == '1'"  v-model="f.valueList">
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
					<div style="font-size:13px;max-width: 80px;min-width: 80px;width: 100px;white-space: nowrap;overflow: hidden; text-overflow: ellipsis;color:#333">
						{{f.tipInfo}}
					</div>
					<div class="ml-1" style="width: 100%;">
						<el-select v-model="f.valueList"
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
				<div v-if="f.showStyle == 0 && f.showType == '1'">
					<div style="font-size:13px;width: 100%;white-space: nowrap;overflow: hidden; text-overflow: ellipsis;color:#333">
						{{f.tipInfo}}
					</div>
					<div class="mt-10">
						<el-checkbox-group v-if="f.type=='3' && f.optionList!=null && f.optionList.length!=0 &&f.showType == '1'" v-model="f.valueList">
							<el-checkbox
								:disabled="false"
								style="display:block;height: 25px;"
								v-for="(c,ci) in f.optionList"
								:key="ci" :label="c.name"
								:value="c.val">{{ c.name}}</el-checkbox>
						</el-checkbox-group>
					</div>
				</div>
				<div v-if="f.showStyle == 0 && f.showType == '2'">
					<div style="font-size:13px;width: 100%;white-space: nowrap;overflow: hidden; text-overflow: ellipsis;color:#333">
						{{f.tipInfo}}
					</div>
					<div class="mt-10">
						<el-select v-model="f.valueList"
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
					<div style="font-size:13px;max-width: 80px;min-width: 80px;width: 100px;white-space: nowrap;overflow: hidden; text-overflow: ellipsis;color:#333">
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
					<div style="font-size:13px;width: 1005;white-space: nowrap;overflow: hidden; text-overflow: ellipsis;color:#333">
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
					<div style="font-size:13px;max-width: 80px;min-width: 80px;width: 100px;white-space: nowrap;overflow: hidden; text-overflow: ellipsis;color:#333">
						{{f.tipInfo}}
					</div>
					<div class="ml-1" style="width:100%">
						<el-date-picker
							style="width: 100%;"
							v-model="f.value" type="date"
							placeholder="请选择日期"
							format="yyyy-MM-dd"
							value-format="yyyy-MM-dd">
						</el-date-picker>
					</div>
				</div>
				<div v-if="f.showStyle == 0">
					<div style="font-size:13px;width: 100%;white-space: nowrap;overflow: hidden; text-overflow: ellipsis;color:#333">
						{{f.tipInfo}}
					</div>
					<div class="mt-10">
						<el-date-picker
							style="width: 100%;"
							v-model="f.value" type="date"
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
					<div style="font-size:13px;max-width: 80px;min-width: 80px;width: 100px;white-space: nowrap;overflow: hidden; text-overflow: ellipsis;color:#333">
						{{f.tipInfo}}
					</div>
					<div class="ml-1" style="width:100%">
						<el-date-picker
							style="width: 100%;"
							v-model="f.value"
							type="datetimerange"
							range-separator="至"
							format="yyyy-MM-dd"
							value-format="yyyy-MM-dd">
						</el-date-picker>
					</div>
				</div>
				<div v-if="f.showStyle == 0">
					<div style="font-size:13px;width: 100%;white-space: nowrap;overflow: hidden; text-overflow: ellipsis;color:#333">
						{{f.tipInfo}}
					</div>
					
					<div class="mt-10">
						<el-date-picker
							style="width: 100%;"
							v-model="f.value"
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
					<div style="font-size:13px;max-width: 80px;min-width: 80px;width: 100px;white-space: nowrap;overflow: hidden; text-overflow: ellipsis;color:#333">
						{{f.tipInfo}}
					</div>
					<div class="ml-1" style="width:100%">
						<input readonly placeholder="请选择地市" style="width: 100%;text-align: left;border-radius: 4px;padding: 10px;outline: none;border: 1px solid #999;"  v-model="f.cityAndDistrict" />
					</div>
				</div>
				<div v-if="f.showStyle == 0" class="mb-10 ">
					<div style="font-size:13px;width: 100%;white-space: nowrap;overflow: hidden; text-overflow: ellipsis;color:#333">
						{{f.tipInfo}}
					</div>
					<div class="mt-10" style="width:100%">
						<input readonly placeholder="请选择地市" style="width: 100%;text-align: left;border-radius: 4px;padding: 10px;outline: none;border: 1px solid #999;" v-model="f.cityAndDistrict" />
					</div>
				</div>
				<!-- <div class="d-flex j-sb a-center mt-10" v-if="f.type == 8">
					<div style="font-size:13px;max-width: 80px;min-width: 80px;width: 100px;white-space: nowrap;overflow: hidden; text-overflow: ellipsis;color:#333">
						详细地址
					</div>
					<div class="ml-1" style="width:100%">
						<input readonly placeholder="请输入详细地址" style="width: 100%;text-align: left;border-radius: 4px;padding: 10px;outline: none;border: 1px solid #999;" v-model="f.value" />
					</div>
				</div> -->
				
				<div v-if="f.showStyle == 1"
					class="d-flex j-sb a-center"
					style="height:40px">
					<div style="font-size:13px;max-width: 80px;min-width: 80px;width: 100px;white-space: nowrap;overflow: hidden; text-overflow: ellipsis;color:#333">
						详细地址
					</div>
					
					<div class="ml-1" style="width:100%">
						<input readonly  v-model=" f.detail "
							style="width: 100%;text-align: left;border-radius: 4px;padding: 10px;outline: none;border: 1px solid #999;" />
					</div>
				</div>
				<div v-if="f.showStyle == 0">
					<div  style="font-size:13px;width: 100%;white-space: nowrap;overflow: hidden; text-overflow: ellipsis;color:#333">
						详细地址
					</div>
					<div class="mt-10">
						<input readonly v-model=" f.detail "
							style="width: 100%;text-align: left;border-radius: 4px;padding: 10px;outline: none;border: 1px solid #999;" />
					</div>
				</div>
				
			</div>
		</div>
	</div>
</template>

<script>
export default {
	props: {
	    chooseElementList: {
	    	// 定义接收的类型 还可以定义多种类型 [String, Undefined, Number]
	    	// 如果required为true,尽量type允许undefined类型，因为传递过来的参数是异步的。或者设置默认值。
			type: Array,
			// 定义是否必须传
			required: true,
			// 定义默认值
			default: function() {
			    return [];
			}
		},
	  },
	data() {
		return{
			//评分颜色
			colors: ['#99A9BF', '#F7BA2A', '#FF9900'],
			//默认值
		}
	},
	
}
</script>

<style scoped lang="scss">
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
</style>