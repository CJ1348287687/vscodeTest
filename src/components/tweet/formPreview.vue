<template>
	<div>
		<div class="active-area">
			<div style="width: 90%;margin: 0px auto;display: block;padding: 0px 5px;">
				<label style="color: #606266;text-align: left;font-size: 15px;">标题：{{form.title}}</label>
				<br />
				<label style="color: #606266;text-align: left;font-size: 15px;">
					<span v-show="form.status=='D'" style="color:red;display: block;margin-top: 10px;">状态：删除</span>
					<span v-show="form.status=='J'" style="color:red;display: block;margin-top: 10px;">状态：停用</span>
				</label>
			</div>
			<div style="width: 90%;margin: 0px auto;display: flex;justify-content: left;  padding: 0px 5px;"
				v-show="form.tipInfo!=null && form.tipInfo!='' && form.showTweet=='1'">
				<span v-html="form.tipInfo" style="max-height: 200px;overflow-y: scroll;" class="messageCard"></span>
			</div>
			<!-- 类型：0字符串 1文本 2单选 3多选 4下拉 5评分 6日期 7日期范围 8地址 9短信验证码 -->
			<!-- 优化开始 -->
			<form-style :chooseElementList="form.elementList"></form-style>
			<!-- 优化结束 -->
			<div style="margin: 0 auto;width: 90%;">
				<div v-if="shareRecord!=null">
					<div style="display:flex;justify-content: left;margin-top: 15px;">
						<label style="width: 100px;display: inline-block; padding: 15px 5px;text-align: left;">
							核销状态:
						</label>
						<span style="margin:15px 0;">
							{{shareRecord.checkoutFlag=='0' ? '待核销' : shareRecord.checkoutFlag=='1' ? '已核销' : shareRecord.checkoutFlag=='2' ? '无需核销' : '其他'}}
						</span>
					</div>
					<div style="display:flex;justify-content: left;" v-if="qrCodeContent!=null">
						<label style="width: 100px;display: inline-block; padding: 15px 5px;text-align: left;">
							核销码:
						</label>
						<span style="margin:15px 0;">
							{{shareRecord.checkoutCode}}
						</span>
					</div>
					<!-- 生成二维码 -->
					<div style="display:flex;justify-content: left;" v-if="qrCodeContent!=null">
						<label style="width: 100px;display: inline-block; padding: 15px 5px;text-align: left;">
						</label>
						<span style="margin:15px 0;">
							<qr-code :id="shareRecord+''" :text="qrCodeContent" ref="qrCode"></qr-code>
						</span>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
	import formStyle from '@/components/tweet/formStyle.vue'
	import qrCode from '@/components/tweet/qrCode'
	import {
		getSignRecord
	} from "@/api/system/scene/signInfo";
	import {
		getFormRecord
	} from "@/api/system/scene/formInfo";
	export default {
		components: {
			qrCode,
			formStyle
		},
		data() {
			return {
				//评分颜色
				colors: ['#99A9BF', '#F7BA2A', '#FF9900'],
				// 表单参数
				form: {},
				//核销二维码
				shareRecord: null,
				qrCodeContent: null,
			}
		},
		methods: {
			getData(id, type) {
				this.form = [];
				this.resetPreview();
				if (type == 'form') {
					getFormInfo(id).then(response => {
						this.handleElementList(response.data.elementList);
						this.form = response.data;
					});
				} else if (type == 'sign') {
					getSignInfo(id).then(response => {
						this.handleElementList(response.data.elementList);
						this.form = response.data;
					});
				} else if (type == 'formRecord') {
					getFormRecord(id).then(response => {
						this.handleElementList(response.data.formInfo.elementList);
						this.form = response.data.formInfo;
						this.form.elementList.forEach(item=>{
							if(item.type == '9'){
								if(item.value){
									let str = item.value
									let newArr = str.split('_')
									item.value1 = newArr[0]
									item.value2 = newArr[1]
									console.log(newArr,item,'newArr--111')
								}
							}
							if(item.type == '7'){
								if(item.value){
									let str = item.value
									let start = str.split('至')[0]
									const startArray = start.split('/');
									let end = str.split('至')[1]
									const endArray = end.split('/');
									item.value = [new Date(startArray[0],startArray[1],startArray[2]), new Date(end[0],end[1],end[2])]
								}
							}
							if(item.type == '8'){
								if(item.value){
									// const lastDistrictIndex = item.value.lastIndexOf("区");
									// if (lastDistrictIndex !== -1) {
									//     let cityAndDistrict = item.value.slice(0, lastDistrictIndex + 1);
									//     let detail = item.value.slice(lastDistrictIndex + 1).trim();
									//     const spaceIndex = detail.search(/\s/);
									//    item.cityAndDistrict = cityAndDistrict
									//    item.detail = detail
									// 	console.log(cityAndDistrict,detail,"cityAndDistrict",'detail');
									//   } else {
									//     console.log("未找到'区'字段");
									//   }
									const {cityAndDistrict,detail} = this.getConvertAddress(item.value);
									item.cityAndDistrict = cityAndDistrict;
									item.detail = detail;
								}
							}
						})
					});
				} else if (type == 'signRecord') {
					getSignRecord(id).then(response => {
						this.handleElementList(response.data.signInfo.elementList);
						this.form = response.data.signInfo;
						this.form.elementList.forEach(item=>{
							if(item.type == '9'){
								if(item.value){
									let str = item.value
									let newArr = str.split('_')
									item.value1 = newArr[0]
									item.value2 = newArr[1]
									console.log(newArr,item,'newArr--222')
								}
							}
							if(item.type == '7'){
								if(item.value){
									let str = item.value
									let start = str.split('至')[0]
									const startArray = start.split('/');
									let end = str.split('至')[1]
									const endArray = end.split('/');
									item.value = [new Date(startArray[0],startArray[1],startArray[2]), new Date(end[0],end[1],end[2])]
								}
							}
							if(item.type == '8'){
								if(item.value){
									// const lastDistrictIndex = item.value.lastIndexOf("区");
									// if (lastDistrictIndex !== -1) {
									//     let cityAndDistrict = item.value.slice(0, lastDistrictIndex + 1);
									//     let detail = item.value.slice(lastDistrictIndex + 1).trim();
									//     const spaceIndex = detail.search(/\s/);
									//    item.cityAndDistrict = cityAndDistrict
									//    item.detail = detail
									// 	console.log(cityAndDistrict,detail,"cityAndDistrict",'detail');
									//   } else {
									//     console.log("未找到'区'字段");
									//   }
									const {cityAndDistrict,detail} = this.getConvertAddress(item.value);
									item.cityAndDistrict = cityAndDistrict;
									item.detail = detail;
								}
							}
						})
						this.shareRecord = response.data.shareRecord;
						if (this.shareRecord != null && this.shareRecord.checkoutFlag != '2' && this.shareRecord
							.checkoutCode != '') {
							this.qrCodeContent = this.shareRecord.checkoutCode;
              if(!this.$refs.qrCode){
                setTimeout(()=>{
                  this.$refs.qrCode.updateCode(this.shareRecord.checkoutCode)
                },500)
              }else{
                this.$refs.qrCode.updateCode(this.shareRecord.checkoutCode)
              }
						} else {
							this.qrCodeContent = null;
						}
					});
				}
			},
			//获取地址和详情数据(地址value参数由地址和详情斜杠/分隔)
			getConvertAddress(address){
				let cityAndDistrict = '';
				let detail = '';
				if (address.includes('_')) {
					const addressArr =  address.split("_");
					cityAndDistrict = addressArr?.[0];
					detail = addressArr?.[1];
				}else{
					let value_address = address;
					let value_detail = '';
					const addressArr = address.split(" "); //数组
					const firstTwoString = addressArr.slice(0, 2).join(''); //前两个元素的字符串
					const zuihouValue = addressArr[addressArr.length - 1]; //最后一个元素
					if (zuihouValue.includes('县')) {
						const index = zuihouValue.lastIndexOf("县");
						value_address = firstTwoString + zuihouValue
							.substring(0, index + 1);
						value_detail = zuihouValue.substring(index + 1, zuihouValue
						.length);
					} else if (zuihouValue.includes('市')) {
						const index = zuihouValue.lastIndexOf('市');
						value_address = firstTwoString + zuihouValue
							.substring(0, index + 1);
						value_detail = zuihouValue.substring(index + 1, zuihouValue
						.length);
					} else if (zuihouValue.includes('区')) {
						const index = zuihouValue.lastIndexOf('区');
						value_address = firstTwoString + zuihouValue
							.substring(0, index + 1);
						value_detail = zuihouValue.substring(index + 1, zuihouValue
						.length);
					} else {
						console.log("未找到'区县市'字段");
					}
					cityAndDistrict = value_address;
					detail = value_detail;
				}
				return({
					cityAndDistrict,
					detail,
				})
			},
			handleElementList(elementList) {
				elementList.forEach(item => {
					if (item.type == '3') {
						if (item.value == null || item.value == '') {
							item.valueList = []
						} else {
							item.valueList = item.value.split(",")
						}
					}
					if (item.type == '5') {
						if (item.value == null || item.value == '') {
							item.value = 3;
						} else {
							item.value = parseInt(item.value)
						}
					}
					if (item.type == '7') {
						if (item.value == null || item.value == '') {
							item.valueList = []
						} else {
							item.valueList = item.value.split("至")
						}
					}
				});
			},
			resetPreview() {
				this.shareRecord = null;
				this.qrCodeContent = null;
			},
		}
	}
</script>
<style scope>
	.form {
		.phone-input {
			outline: none;
			padding: 10px 0;
			border: none;
			width: 50%;
			height: 40px;
			line-height: 40px;
			text-align: center;
			font-size: 14px;
			color: #606266;
			/* border:1px solid #999; */
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

	.messageCard::-webkit-scrollbar {
		width: 5px !important;
	}

	.messageCard::-webkit-scrollbar-thumb {
		border-radius: 5px;
		width: 5px !important;
		background: #dddee0;
	}

	.messageCard::-webkit-scrollbar-track {
		border-radius: 0;
		width: 5px !important;
	}
</style>