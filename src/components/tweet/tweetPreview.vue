<template>
  <div class="messageCard" style="height: 40rem;overflow-y: hidden;;">
	<div style="display: flex;justify-content: space-between;">
    <el-row style="width: 1600px;height: 37rem;overflow-y: scroll;" class="messageCard">
      <el-col > 
        <el-form class="channel" style="background-color:antiquewhite;position: relative;padding-top: 10px;">
          <div v-if="tacticForm.elemTacticList.length != 0" style="position: absolute;right: 30px;top: 80px;">
            <qr-code v-if="shareUrl" :id="tweetId+''" :text="shareUrl" ref="qrCode"></qr-code>
          </div>
          <el-form-item label="推文编号"> {{ tweetForm.tweetId }}</el-form-item>
          <el-form-item label="推文编码"> {{ tweetForm.tweetCode }}</el-form-item>
          <el-form-item label="推文名称"> {{ tweetForm.tweetTitle }}</el-form-item>
          <el-form-item label="推文类型"> {{ tweetForm.tweetCommonFlag === '1' ? '公共' : tweetForm.tweetCommonFlag === '0' ? '私有': '' }}</el-form-item>
          <div v-if="channelId !=null">
            <el-form-item label="所属组织"> {{ tacticForm.shareOrgName }}</el-form-item>
            <el-form-item label="渠道类型"> 
              <dict-tag :options="dict.type.tweet_channel" :value="tacticForm.channelType"/>
            </el-form-item>
            <el-form-item label="渠道名称"> {{ tacticForm.channelName }}</el-form-item>
            <el-form-item label="渠道编码"> {{ tacticForm.channelCode }}</el-form-item>
            <el-form-item label="分发策略">
              <div style="display: flex;">
                <div class="font-14">谁发展:</div>
                <div style="padding-left: 20px;">
                  <el-select v-model="tacticForm.shareRules" disabled clearable placeholder="请选择分发规则" style="width:200px;">
                    <el-option
                      v-for="dict in shareRuless"
                      :key="dict.value"
                      :label="dict.label"
                      :value="dict.value"
                    ></el-option>
                  </el-select>
                  <br v-if="tacticForm.shareRules=='1'"/>
                  <el-select v-model="tacticForm.shareUserName" disabled v-if="tacticForm.shareRules=='1'" clearable placeholder="请选择指定分发人" style="width:200px">
                    <el-option
                      v-for="dict in tacticForm.userList"
                      :key="dict.userId"
                      :label="dict.nickName"
                      :value="dict.userId"
                    ></el-option>
                  </el-select>
                </div>
              </div>
            </el-form-item>
          </div>
        </el-form>
        <div v-if="tacticForm.elemTacticList.length == 0">
          <qr-code v-if="shareUrl" :id="tweetId+''" :text="shareUrl" ref="qrCode"></qr-code>
        </div>
        <el-form v-if="channelId !=null" v-for="(item,qindex) in tacticForm.elemTacticList" :key="qindex" class="channel" style="padding-top: 10px;">
          <div v-if="item.targetType=='SCENE_LIVE_CODE'">
            <el-form-item label="活码策略" style="margin-top: 10px">
              <div style="display: flex;">
                <div>
                  <div class="font-14" style="display: flex;">活码显示:
                    <div style="padding-left: 20px;">
                      <el-select v-model="item.tacticType" disabled placeholder="请选择">
                        <el-option v-for="item in elemLiveCodeTacticTypes"
                          :key="item.code"
                          :label="item.type"
                          :value="item.code">
                        </el-option>
                      </el-select>
                      <br v-if="item.tacticType == '7'" />
                      <el-select v-if="item.tacticType == '7'" disabled v-model="item.channelLiveCodeAppointOrgName" placeholder="请选择指定组织">
                        <el-option v-for="item in tacticUserOrganizationDefault"
                          :key="item.organizationId"
                          :label="item.organizationName"
                          :value="item.organizationId">
                        </el-option>
                      </el-select>
                      <br/>
                      <el-button type="primary" style="margin-top: 5px" v-if="item.tacticType == '3'" @click="tactic3OpenHandle(tacticForm,item)">配置策略</el-button>
                    </div>
                  </div>
                  <div class="font-14" style="display: flex;margin-top: 8px" v-if="liveCodeShowTypeArray.includes(item.tacticType)">活码类型:
                    <div style="padding-left: 20px;">
                      <el-select v-model="item.channelLiveCodeShowType" disabled placeholder="请选择">
                        <el-option v-for="item in liveCodeShowTypes"
                          :key="item.code"
                          :label="item.type"
                          :value="item.code">
                        </el-option>
                      </el-select>
                    </div>
                  </div>
                  <el-row >
                    <el-col class="mb-10">
                      <div class="d-flex formP flex-column mb-20">
                        <div class="font-14">默认活码</div>
                        <el-radio-group disabled style="margin:5px 0 5px 0;text-align: left;font-weight: 666;" v-model="item.channelLiveCodeType">
                          <el-radio label='0' style="margin-right:100px">默认</el-radio>
                          <!-- <el-radio label='1' style="margin-left:0px;margin-right:70px" >生产配置</el-radio> -->
                          <el-radio label='2' style="margin-left:0px">渠道自定义</el-radio>
                        </el-radio-group>
                      </div>
                      <div>
                        <div class="d-flex" style="display: flex;">
                          <div
                            style="width: 120px;max-height:120px;display: flex;align-items: center;justify-content: center;border: 1px solid #f5f5f5;overflow: hidden;margin-right:30px">
                            <div class="d-flex a-center j-center" style="height:120px;width:100%;border:1px solid #f5f5f5">
                              <img style="max-width: 120px;max-height: 120px;" v-if="item.target!=null && item.target.image!=null && item.target.image.fileVirtualPath != ''" 
                                :src="item.target.image.fileVirtualPath" class="avatar">
                              <img style="max-width: 120px;max-height: 120px;" v-if="item.target==null || item.target.image==null || item.target.image.fileVirtualPath == ''"
                                src="../../assets/images/noImage.png" class="avatar">
                            </div>
                          </div>

                          <div
                            style="width: 120px;max-height:120px;display: flex;align-items: center;justify-content: center;border: 1px solid #f5f5f5;overflow: hidden">
                            <div class="d-flex a-center j-center" style="height:120px;width:100%;border:1px solid #f5f5f5">
                              <img style="max-width: 120px;max-height: 120px;" v-if="item.channelLiveCodeImg!=null && item.channelLiveCodeImg.fileVirtualPath!=''" 
                                :src="item.channelLiveCodeImg.fileVirtualPath" class="avatar">
                              <img style="max-width: 120px;max-height: 120px;" v-if="item.channelLiveCodeImg==null || item.channelLiveCodeImg.fileVirtualPath==''"
                                src="../../assets/images/noImage.png" class="avatar">
                            </div>
                          </div>
                        </div>
                      </div>
                    </el-col>
                  </el-row>
                </div>
              </div>
            </el-form-item>
          </div>
          <div v-if="item.targetType!='SCENE_LIVE_CODE'">
            <el-form-item label="产品名称" >
              <span class="font-14" style="font-weight: 666;">{{ item.productName }}</span>
            </el-form-item>
            <el-form-item label="表单名称">
              <span class="font-14" style="font-weight: 666;">{{ item.targetTitle }}</span>
            </el-form-item>
            <el-form-item label="接收策略">
              <div style="display: flex;">
                <div class="font-14">谁受理:</div>
                <div style="padding-left: 20px;">
                  <el-select v-model="item.tacticType" disabled  placeholder="请选择">
                    <el-option v-for="item in elemTacticTypes"
                      :key="item.code"
                      :label="item.type"
                      :value="item.code">
                    </el-option>
                  </el-select>
                  <br/>
                  <el-button type="primary" style="margin-top: 5px" v-if="item.tacticType == '3'" @click="tactic3OpenHandle(tacticForm,item)">配置策略</el-button>
                </div>
              </div>
            </el-form-item>
            <el-form-item label="跳转策略" >
              <div style="display: flex;">
                <el-row >
                  <el-col class="mb-10">
                    <div class="d-flex formP flex-column mb-20">
                      <div class="font-14">表单结果页</div>
                      <el-radio-group disabled style="margin:5px 0 5px 0;text-align: left;font-weight: 666;" v-model="item.channelSkipConfigType">
                        <el-radio label='0' style="margin-right:70px" v-show="item.skipImgType=='0'">系统默认</el-radio>
                        <el-radio label='1' style="margin-left:0px;margin-right:70px" >生产配置</el-radio>
                        <el-radio label='2' style="margin-left:0px">渠道自定义</el-radio>
                      </el-radio-group>
                    </div>
                    <div>
                      <div  style="display: flex;">
                        <div v-show="item.skipImgType=='0'"
                          style="width: 120px;max-height:120px;display: flex;align-items: center;justify-content: center;border: 1px solid #f5f5f5;overflow: hidden;margin-right:30px">
                          <div class="d-flex a-center j-center" style="height:120px;width:100%;border:1px solid #f5f5f5">
                            <img style="max-width: 120px;max-height: 120px;" v-if="item.bdResultImage != ''" :src="item.bdResultImage" class="avatar">
                            <img style="max-width: 120px;max-height: 120px;" v-if="item.bdResultImage == ''" :src="form_result_img_url" class="avatar">
                          </div>
                        </div>
                        <div
                          style="width: 120px;max-height:120px;display: flex;align-items: center;justify-content: center;border: 1px solid #f5f5f5;overflow: hidden;margin-right:30px">
                          <div class="d-flex a-center j-center" style="height:120px;width:100%;border:1px solid #f5f5f5">
                            <img style="max-width: 120px;max-height: 120px;"
                              v-if="item.skipImg!=null && item.skipImg.fileVirtualPath" :src="item.skipImg.fileVirtualPath" class="avatar">
                            <img style="max-width: 120px;max-height: 120px;"
                              v-if="item.skipImg==null || !item.skipImg.fileVirtualPath" src="../../assets/images/noImage.png" class="avatar">
                          </div>
                        </div>

                        <div
                          style="width: 120px;max-height:120px;display: flex;align-items: center;justify-content: center;border: 1px solid #f5f5f5;overflow: hidden">
                          <div class="d-flex a-center j-center" style="height:120px;width:100%;border:1px solid #f5f5f5">
                            <img style="max-width: 120px;max-height: 120px;"
                              v-if="item.channelSkipImg!=null && item.channelSkipImg.fileVirtualPath" :src="item.channelSkipImg.fileVirtualPath" class="avatar">
                            <img style="max-width: 120px;max-height: 120px;"
                              v-if="item.channelSkipImg==null || !item.channelSkipImg.fileVirtualPath" src="../../assets/images/noImage.png" class="avatar">
                          </div>
                        </div>
                      </div>
                    </div>
                  </el-col>
                </el-row>
              </div>
            </el-form-item>
          </div>
        </el-form>
      </el-col>
    </el-row>
	<el-col >
	  <div class="prev_pho_tweet" style="margin-left: 100px;">
	    <div class="" >
	    	<div class="prev_pho_tweet por" style="">
	    		<div>
	    			<img src="../../assets/images/phone.png"
	    				style="width: 300px;height: 590px;position: absolute;top: 0;left: 0px;" alt="">
	          <iframe id="myIframe" @load="iframeLoad()" style="width: 270px;height: 525px;position: absolute;top: 44px;left: 14px;border-radius: 0px 0px 20px 20px;border: none;" :src="shareUrl"></iframe>
	    		</div>
	    	</div>
	    </div>
	  </div>
	</el-col>
		
	</div>

    <el-dialog width="800px" title="策略配置" :visible.sync="tactic3Open" :close-on-click-modal="false"
				:close-on-press-escape="false">
        <div style="height: 404px;overflow-y: scroll;margin-left: 15px;">
          <div v-for="item in tacticList" v-if="tacticForm.shareRules==1" >
            <div class="center-board-row" v-if="tacticForm.shareUserId!=null && tacticForm.shareUserId==item.sendUserId" style="display: flex;align-items: center; padding: 10px 30px 10px 10px">
                <span>由</span>
                <span style="display:inline-block;width: 300px;text-align:center;background:#f5f4f4;padding: 5px 7px; border-radius: 4px; color:#000000;margin:0 10px; padding: 5px 8px;">{{ item.sendOrganizationName }}--{{ item.sendUserName }}</span>
                <span style="white-space: nowrap;">发展，</span>
                <span v-if="item.targetType=='SCENE_LIVE_CODE'" style="white-space: nowrap;">显示</span>
                <span v-if="item.targetType!='SCENE_LIVE_CODE'">由</span>
                <span v-if="item.acceptUserId == 0" style="display:inline-block; width: 300px; text-align:center; margin:0 10px; padding: 5px 7px; background: #f5f4f4;border-radius: 4px; color: #5da6e9; cursor:pointer;">
                  {{ item.sendOrganizationName }}--{{ item.sendUserName }}
                </span>
                <span v-if="item.acceptUserId != 0" style="display:inline-block; width: 300px; text-align:center; margin:0 10px; padding: 5px 7px; background: #f5f4f4;border-radius: 4px; color: #5da6e9; cursor:pointer;">
                  {{ item.acceptOrganizationName }} -- {{ item.acceptUserName }}
                </span>
                <span v-if="item.targetType=='SCENE_LIVE_CODE'" style="white-space: nowrap;">活码</span>
                <span v-if="item.targetType!='SCENE_LIVE_CODE'" style="white-space: nowrap;">受理</span>
            </div>
          </div>

          <div v-for="item in tacticList" v-if="tacticForm.shareRules!=1" >
            <div class="center-board-row" style="display: flex;align-items: center; padding: 10px 30px 10px 10px">
                <span>由</span>
                <span style="display:inline-block;width: 300px;text-align:center;background:#f5f4f4;padding: 5px 7px; border-radius: 4px; color:#000000;margin:0 10px; padding: 5px 8px;">{{ item.sendOrganizationName }}--{{ item.sendUserName }}</span>
                <span style="white-space: nowrap;">发展，</span>
                <span v-if="item.targetType=='SCENE_LIVE_CODE'" style="white-space: nowrap;">显示</span>
                <span v-if="item.targetType!='SCENE_LIVE_CODE'">由</span>
                <span v-if="item.acceptUserId == 0" style="display:inline-block; width: 300px; text-align:center; margin:0 10px; padding: 5px 7px; background: #f5f4f4;border-radius: 4px; color: #5da6e9; cursor:pointer;">
                  {{ item.sendOrganizationName }}--{{ item.sendUserName }}
                </span>
                <span v-if="item.acceptUserId != 0" style="display:inline-block; width: 300px; text-align:center; margin:0 10px; padding: 5px 7px; background: #f5f4f4;border-radius: 4px; color: #5da6e9; cursor:pointer;">
                  {{ item.acceptOrganizationName }} -- {{ item.acceptUserName }}
                </span>
                <span v-if="item.targetType=='SCENE_LIVE_CODE'" style="white-space: nowrap;">活码</span>
                <span v-if="item.targetType!='SCENE_LIVE_CODE'" style="white-space: nowrap;">受理</span>
            </div>
          </div>
        </div>
				<div slot="footer" class="dialog-footer">
					<el-button @click="tacticCancel">取 消</el-button>
				</div>
    </el-dialog>

  </div>
</template>
<script>
import qrCode from "@/components/tweet/qrCode";
import { getInfotweet } from "@/api/tool/tweetArticle.js";
import { getConfigKey } from "@/api/system/display/share";
import {tweetChannelInfo} from '@/api/system/display/channel'
import previewFormStyle from "./previewFormStyle.vue";

export default {
  components: { qrCode, previewFormStyle },
  dicts: ['tweet_channel','sys_customer_type'],
  data() {
    return {
      sessionOrgId:sessionStorage.getItem('organizationId'),
      tactic3Open:false,
      shareUrl: "",
      tweetId: null,
      channelId:null,
      tweetForm:{
        tweetId:null,
        tweetCode:'',
        tweetTitle:'',
        tweetCommonFlag:'',
      },
      tacticForm:{
        shareOrgName:'',
        channelId:undefined,
        channelName:'',
        channelCode:'',
        channelType:'',
        shareRules: '0',
        userList:[],
        shareOrgId:undefined,
        shareOrgName:'',
        shareUserId:undefined,
        shareUserName:'',
        elemTacticList: [],
        editType:0,
      },
      shareRuless:[
        {
          value: '0',
          label: '由当前账号分发'
        },
        {
          value: '1',
          label: '由指定账号分发'
        },
      ],
      tacticList:[],
      tacticListOld:[],
      liveCodeShowTypes:[
        {
          code: '0',
          type: '个人微信'
        },
        {
          code: '1',
          type: '企业微信'
        },
        {
          code: '',
          type: '无'
        },
      ],
      liveCodeShowTypeArray:['0','1','2','3'],
      elemLiveCodeTacticTypes: [{
          code: '0',
          type: '显示推文创建人活码'
        },
        {
          code: '1',
          type: '显示渠道创建人活码'
        },
        {
          code: '2',
          type: '显示渠道分发人活码'
        },
        {
          code: '3',
          type: '显示指定成员活码'
        },
        {
          code: '4',
          type: '显示推文创建组织活码'
        },
        {
          code: '6',
          type: '显示渠道归属组织活码'
        },
        {
          code: '7',
          type: '显示指定组织活码'
        },
        {
          code: '',
          type: '无'
        }
      ],
      elemTacticTypes: [{
          code: '0',
          type: '由推文创建人接收数据'
        },
        {
          code: '1',
          type: '由渠道创建人接收数据'
        },
        {
          code: '2',
          type: '由渠道分发人接收数据'
        },
        {
          code: '3',
          type: '由指定成员接收数据'
        }
      ],
      sessionUserList:[],
      tacticUserOrganizationDefault:[],
    };
  },
  methods: {
    //策略配置--指定成员配置页面弹出,
    tactic3OpenHandle(tacticForm,item) {
      // item元素中所有表单中的某一个
      if (item.tacticType == '3'  && item.channelTactics !=null && item.channelTactics.length > 0) {
        // 用于修改
        this.tacticList = item.channelTactics
        this.tacticListOld = JSON.stringify(this.tacticList)
        this.tactic3Open = true
      } else {
        let params = {
          organizationId: tacticForm.organizationId
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
        })
      }
    },
    //擦略弹窗--指定成员配置页面--取消按钮
    tacticCancel() {
      this.tacticList = [],
      this.tacticListOld = [],
      this.tactic3Open = false
    },
    iframeLoad(){
      let iframe = document.getElementById('myIframe');
      console.log('iframe',iframe);
      //目前跨域无法获取内容进行操作
      var iframeDoc = iframe.contentWindow.document;
      console.log('iframeDoc1', iframeDoc)
      //某些内容是动态加载的（例如，通过 JavaScript 或 AJAX）
      setTimeout(()=>{
        //改变iframe内元素样式
        var elementInIframe = iframeDoc.getElementsByClassName('bg_width_Y');
        if(elementInIframe.length){
          console.log('iframeDom2', elementInIframe.length);
          elementInIframe[0].style.height = 'calc(100vh - 60px)';
        }
        //监听按钮-设置底部弹框form表单容器高度
        iframeDoc.addEventListener('click', (event) => {
            const target = event.target;
            if (target.tagName.toLowerCase() === 'button') {
              setTimeout(()=>{
                //按钮click事件被触发的逻辑
                var vanPopupElement = iframeDoc.getElementsByClassName('van-popup');
                console.log('容器0',vanPopupElement)
                if(vanPopupElement.length){
                  console.log('容器1', vanPopupElement.length, vanPopupElement[0], vanPopupElement[0].offsetHeight);
                  const scrollFrom =  vanPopupElement[0].children[0].children[1];
                  console.log('容器2',scrollFrom, scrollFrom.style.height, vanPopupElement[0].offsetHeight - 70 - 50)
                  scrollFrom.style.height = vanPopupElement[0].offsetHeight - 70 - 50 + 'px' ;
                }
              },100);
            }
          })
      },300);
    },
    getData(tweetId, channelId) {
      this.tweetId = tweetId;
      this.channelId = channelId;
      this.getInfotweet(tweetId, channelId);
      this.getChannelInfo(channelId)
    },
    getChannelInfo(channelId){
      if(channelId!=null && channelId !=undefined){
        let params = {
          channelId: channelId,
          isSelectElem: true
        }
        tweetChannelInfo(params).then(response => {
          if (response) {
            this.tacticForm = response.data
            this.tacticForm.editType = 2
            var shareRules = response.data.shareRules;
            if(shareRules==null || shareRules==undefined || shareRules=='undefined' || shareRules==''){
              this.tacticForm.shareRules = '0'
            }
            // var organizationId = row.organizationId;
            // if(organizationId==this.sessionOrgId){
            //   this.tacticForm.userList = JSON.parse(JSON.stringify(this.sessionUserList))
            // }else{
            //   organizationUser({organizationId: organizationId}).then(response => {
            //     if (response.data) {
            //       this.tacticForm.userList = response.data
            //     }
            //   })
            // }
          }
        })
      }
    },
    getInfotweet(tweetId, channelId) {
      let data = {};
      if(channelId==null || channelId ==undefined){
        data = {
          tweetId: tweetId
        };
      }else{
        data = {
          tweetId: tweetId,
          channelId: channelId
        };
      }
      getInfotweet(data).then((res) => {
        this.tweetForm = res.data;
        getConfigKey("tweet_share_url").then((response) => {
          if(channelId==null || channelId ==undefined){
            this.shareUrl = response.msg + "?yy_code=" + res.data.tweetCode + "&tweetType=" + "preview";
          }else{
            this.shareUrl = response.msg + "?yy_code=" + res.data.tweetCode + "&channelId=" + channelId + "&tweetType=" + "preview";
          }
          if(!this.$refs.qrCode){
            setTimeout(()=>{
              this.$refs.qrCode.updateCode(this.shareUrl)
            },500)
          }else{
            this.$refs.qrCode.updateCode(this.shareUrl)
          }
          console.log("this.shareUrl",this.shareUrl)
        });        
      });
    },
  },
};
</script>

<style scope>
  .channel{
    background-color: aliceblue;
    border: 1px solid #dcdfe6;
    border-radius: 3px;
    margin-bottom: 12px;
    .el-form-item{
      margin-bottom:10px;
      .el-form-item__label{
        width: 100px;
      }
    }
  }
  .imageConfig{
    .el-form-item{
      margin-bottom:10px;
      .el-form-item__label{
        width: 100px;
      }
    }
  }
  .position-relative {
    position: relative;
  }

  .position-absolute {
    position: absolute;
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

  .mt-10 {
    margin-top: 10px !important;
  }

  .mt-20 {
    margin-top: 20px !important;
  }

  .scrol::-webkit-scrollbar {
    width: 0 !important;
  }

  .prev_pho_tweet {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 400px;
    margin: 0 auto;
    position: relative;
  }

  .prev_pho_tweetPreview {
    width: 252px;
    margin: 14px 0 0px 4px;
    border-radius: 20px;
    z-index: 20;
    height: 32.9rem !important;
    overflow-y: scroll;
  }
  .prev_pho_tweet ::-webkit-scrollbar {
    display: none !important;
  }
  .prev_pho_tweet .el-drawer__container{
    position: relative;
    left: 13px;
    right: 0;
    top: -22px;
    bottom: 0;
    height: 100%;
    width: 91%;
  }
  .prev_pho_tweet .el-drawer__open .el-drawer.btt {
    height: auto !important;
    /* max-height: 63% !important; */
    border-radius: 5px 5px 20px 20px !important;
    display: flex;
    justify-content: flex-end;
  }
  .prev_pho_tweet .el-drawer__body {
    display: flex;
    align-items: flex-end;
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
</style>

