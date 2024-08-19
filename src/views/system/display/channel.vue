<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch">
      <el-form-item label="推文编号" prop="tweetId">
        <el-input
          v-model="queryParams.tweetId"
          placeholder="请输入推文编号"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="推文来源" prop="tweetOrganizationName">
        <el-input
          v-model="queryParams.tweetOrganizationName"
          placeholder="请输入推文来源"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="推文名称" prop="tweetTitle">
        <el-input
          v-model="queryParams.tweetTitle"
          placeholder="请输入推文名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="推文类型" prop="tweetCommonFlag">
        <el-select v-model="queryParams.tweetCommonFlag" placeholder="请选择推文类型" clearable>
          <el-option
            v-for="dict in tweetCommonFlags"
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
      <el-form-item label="创建人" prop="createBy">
        <el-input
          v-model="queryParams.createBy"
          placeholder="请输入用户名"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="渠道类型" prop="channelType">
        <el-select v-model="queryParams.channelType" placeholder="请选择渠道类型" clearable>
          <el-option
            v-for="dict in dict.type.tweet_channel"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="渠道名称" prop="channelName">
        <el-input
          v-model="queryParams.channelName"
          placeholder="请输入渠道名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="渠道编码" prop="channelCode">
        <el-input
          v-model="queryParams.channelCode"
          placeholder="请输入渠道编码"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="上架状态" prop="channelStatus">
        <el-select v-model="queryParams.channelStatus" placeholder="请选择上架状态" clearable>
          <el-option
            v-for="dict in channelStatuss"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-form>
    <!--列表-->
    <el-table v-loading="loading" :data="tweetList" @selection-change="handleSelectionChange"
              @sort-change="handleSortChange"
              :header-cell-style="{background:'#afccfd',color:'#333'}"
              @expand-change="expandChange"
              :row-style="isRed"
    >
      <el-table-column label="" type="expand" width="25">
        <template slot-scope="scope">
          <el-table :header-cell-style="{background:'#DDEBF7',color:'#333',padding: '3px'}"
                    style="margin:0 40px;box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);"
                    :cell-style="{padding: '3px'}"
                    :data="scope.row.tweetChannels"
                    v-loading="loadingChannel"
                    @sort-change="(column, prop, order) => handleSortChangeChannel(column, prop, order,scope.row)"
          >
            <el-table-column label="渠道序号" align="center" width="100">
              <template slot-scope="scop">
                {{ scop.$index + 1 }}
              </template>
            </el-table-column>
            <el-table-column label="渠道所属组织" prop="org.organizationName" align="center" width="130" sortable="custom" :sort-orders="['descending', 'ascending']">
              <template #default="scop">
                {{ scop.row.organizationName }}
              </template>
            </el-table-column>
            <el-table-column label="渠道类型" prop="channelType" align="center" width="120" sortable="custom" :sort-orders="['descending', 'ascending']">
              <template #default="scop">
                <dict-tag :options="dict.type.tweet_channel" :value="scop.row.channelType"/>
              </template>
            </el-table-column>
            <el-table-column label="渠道名称" prop="stc.channelName" align="center" sortable="custom" :sort-orders="['descending', 'ascending']">
              <template #default="scop">
                {{ scop.row.channelName }}
              </template>
            </el-table-column>
            <el-table-column label="渠道编码" prop="stc.channelCode" align="center" sortable="custom" :sort-orders="['descending', 'ascending']">
              <template #default="scop">
                {{ scop.row.channelCode }}
              </template>
            </el-table-column>
            <el-table-column label="上架状态" prop="stc.status" align="center" width="120" sortable="custom" :sort-orders="['descending', 'ascending']">
              <template #default="scop">
                <el-tag :type="scop.row.status === 'E' ? 'success' : scop.row.status === 'J' ? 'danger' : ''">
                  {{ scop.row.status === 'E' ? '上架' : scop.row.status === 'J' ? '下架' : '删除' }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="分发规则" prop="stc.shareRules" align="center" sortable="custom" :sort-orders="['descending', 'ascending']">
              <template #default="scop">
                  {{ scop.row.shareRules === '0' ? '由当前账号分发' : scop.row.shareRules === '1' ? '由指定账号分发' : '' }}
              </template>
            </el-table-column>
            <el-table-column label="指定分发人" align="center">
              <template #default="scop">
                <span v-if="scop.row.shareRules=='1'">（{{scop.row.shareOrgName}}）{{scop.row.shareUserName}}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="left" class-name="small-padding fixed-width" width="470">
              <template slot-scope="scop">
                <el-button
                  size="mini"
                  type="text"
                  icon="el-icon-edit"
                  @click="handleUpdateChannel(scope.row,scop.row)"
                  v-hasPermi="['system:displayChannel:edit']"
                >修改
                </el-button>
                <el-button
                  size="mini"
                  type="text"
                  icon="el-icon-setting"
                  @click="handleElemTacticUpdate(scope.row,scop.row)"
                  v-hasPermi="['system:displayChannel:edit']"
                >策略配置
                </el-button>
                <el-button
                  size="mini"
                  type="text"
                  icon="el-icon-setting"
                  @click="handleSysImageUpdate(scope.row,scop.row)"
                  v-hasPermi="['system:displayChannel:edit']"
                >手机管理端配置
                </el-button>
                <el-button
                  size="mini"
                  type="text"
                  icon="el-icon-delete"
                  @click="handleDeleteChannel(scope.row,scop.row)"
                  v-hasPermi="['system:displayChannel:remove']"
                >删除
                </el-button>
                <el-button
                  v-if="scop.row.status == 'J'"
                  size="mini"
                  type="text"
                  icon="el-icon-upload2"
                  @click="handleUpdateStatus(scope.row,scop.row,'E')"
                  v-hasPermi="['system:displayChannel:updateStatus']"
                >上架
                </el-button>
                <el-button
                style="font-color:black"
                  v-if="scop.row.status == 'E'"
                  size="mini"
                  type="text"
                  icon="el-icon-download"
                  @click="handleUpdateStatus(scope.row,scop.row,'J')"
                  v-hasPermi="['system:displayChannel:updateStatus']"
                >下架
                </el-button>
                <el-button
                  v-if="scop.row.status == 'E'"
                  size="mini"
                  type="text"
                  icon="el-icon-document"
                  v-hasPermi="['system:displayShare:add']"
                  @click="handleTweetShare(scope.row,scop.row)"
                >分发
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </template>
      </el-table-column>
      <el-table-column label="推文编号" prop="st.tweetId" align="center" width="100" sortable="custom" :sort-orders="['descending', 'ascending']">
        <template #default="scope">
          {{ scope.row.tweetId }}
        </template>
      </el-table-column>
      <el-table-column label="推文来源" prop="org.organizationName" align="center" width="150" sortable="custom" :sort-orders="['descending', 'ascending']">
        <template #default="scope">
          {{ scope.row.organizationName }}
        </template>
      </el-table-column>
      <el-table-column label="推文名称" prop="st.tweetTitle" align="left" sortable="custom" :sort-orders="['descending', 'ascending']">
        <template #default="scope">
          {{ scope.row.tweetTitle }}
        </template>
      </el-table-column>
      <el-table-column label="推文类型" prop="st.tweetCommonFlag" align="center" sortable="custom" :sort-orders="['descending', 'ascending']">
        <template #default="scope">
          {{ scope.row.tweetCommonFlag === '1' ? '公共' : '私有' }}
        </template>
      </el-table-column>
      <el-table-column label="创建人" prop="st.createBy" align="center" width="150" sortable="custom" :sort-orders="['descending', 'ascending']">
        <template #default="scope">
          {{ scope.row.createBy }}
        </template>
      </el-table-column>
      <el-table-column label="创建时间" prop="st.createTime" align="center" width="180" sortable="custom" :sort-orders="['descending', 'ascending']">
        <template #default="scope">
          {{ scope.row.createTime }}
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
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
            icon="el-icon-plus"
            @click="handleAdd(scope.row)"
            v-hasPermi="['system:displayChannel:add']"
          >新增私有渠道
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-plus"
            v-if="scope.row.tweetCommonFlag=='1' && scope.row.organizationId == sessionOrgId"
            @click="handleAddPublic(scope.row)"
            v-hasPermi="['system:displayChannel:add']"
          >新增公共渠道
          </el-button>
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
    <!-- 添加渠道-->
    <el-dialog title="新增渠道" :visible.sync="openAddChannel" width="1000px" append-to-body :close-on-click-modal="false" :show-close="false" :close-on-press-escape="false">
      <el-table :data="channelList">
        <el-table-column label="渠道所属组织"  align="center">
          <template #default="scope">
            {{scope.row.organizationName}}
          </template>
        </el-table-column>
        <el-table-column label="渠道类型"  align="center">
          <template #default="scope">
            <el-select v-model="scope.row.channelType" clearable placeholder="请选择渠道类型" >
              <el-option
                v-for="dict in dict.type.tweet_channel"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              ></el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="渠道名称"  align="center">
          <template #default="scope">
            <el-input v-model="scope.row.channelName" placeholder="请输入渠道名称" ></el-input>
          </template>
        </el-table-column>
        <el-table-column label="渠道编码"  align="center">
          <template #default="scope">
            <el-input v-model="scope.row.channelCode" placeholder="请输入渠道编码" ></el-input>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="300px" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button
              style="color:red"
              size="mini"
              type="text"
              icon="el-icon-delete"
              @click="deleteChannel(scope.row.index)"
            >移除
            </el-button>
            <el-button
              size="mini"
              type="text"
              icon="el-icon-setting"
              @click="handleElemTactic(scope.row)"
            >策略配置
            </el-button>
            <el-button
              size="mini"
              type="text"
              icon="el-icon-setting"
              @click="handleSysImage(scope.row)"
            >手机管理端配置
            </el-button>
            <el-button
              size="mini"
              type="text"
              icon="el-icon-plus"
              @click="handleAddChannelColumn(scope.row.organizationId, scope.row.organizationName, scope.row.index)"
            >新增
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="addChannelSubmit">保 存</el-button>
        <el-button @click="addChannelCancelButton">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 修改渠道 -->
    <el-dialog title="修改渠道" :visible.sync="openUpdateChannel" width="600px" append-to-body :close-on-click-modal="false" :show-close="false" :close-on-press-escape="false">
      <el-form ref="tweetChannelForm" :model="tweetChannelForm" :rules="tweetChannelFormRules" label-width="100px">
        <el-form-item label="渠道类型" prop="channelType">
          <el-select v-model="tweetChannelForm.channelType" clearable placeholder="请选择渠道类型" style="width:200px">
            <el-option
              v-for="dict in dict.type.tweet_channel"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="渠道名称" prop="channelName">
          <el-input v-model="tweetChannelForm.channelName" placeholder="请输入渠道名称" style="width:300px"></el-input>
        </el-form-item>
        <el-form-item label="渠道编码" prop="channelCode">
          <el-input v-model="tweetChannelForm.channelCode" placeholder="请输入渠道编码" style="width:300px"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="updateChannelSubmit">确 定</el-button>
        <el-button @click="updateChannelCancel">取 消</el-button>
      </div>
    </el-dialog>

    <el-dialog custom-class="tweet-preview-dialog"  title="推文预览" :visible.sync="tweetPreview" width="1100px" append-to-body :close-on-click-modal="false" :show-close="false" :close-on-press-escape="false">
      <div style="min-height: 580px">
        <tweet-preview v-if="tweetPreview" ref="tweetPreview"></tweet-preview>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="tweetPreview=false">取 消</el-button>
      </div>
    </el-dialog>

    <el-dialog title="推文分发" :visible.sync="tweetShare" width="900px" append-to-body :close-on-click-modal="false" :show-close="false" :close-on-press-escape="false">
      <div style="display: flex;">
        <div style="width:410px;padding: 0px 20px;">
          <div style="padding-bottom: 20px">当前渠道类型为：<dict-tag style="display: inline;" :options="dict.type.tweet_channel" :value="channelType"/></div>
          <div style="padding-bottom: 20px">当前分发人为：{{userName}}</div>
          <div style="padding-bottom: 20px;display: flex;">分发策略：谁发展
            <div style="padding-left: 10px;">
              <div style="">
                <el-select v-model="shareRules" disabled clearable placeholder="请选择分发规则" style="width:200px;">
                  <el-option
                    v-for="dict in shareRuless"
                    :key="dict.value"
                    :label="dict.label"
                    :value="dict.value"
                  ></el-option>
                </el-select>
                <br v-if="shareRules=='1'"/>
                <el-select v-model="shareUserName" disabled v-if="shareRules=='1'" clearable placeholder="请选择指定分发人" style="width:200px;">
                  <el-option
                    v-for="dict in tacticForm.userList"
                    :key="dict.userId"
                    :label="dict.nickName"
                    :value="dict.userId"
                  ></el-option>
                </el-select>
              </div>
            </div>
          </div>
          <qr-code style="padding-bottom: 10px" :id="shareUrl+''" :text="shareUrl" ref="qrCode"></qr-code>
          <!-- <div style="padding: 20px 0px">{{shareUrl}}</div> -->
          <el-button type="primary" round @click="copyShareUrl(shareUrl)" class="copyShareUrl">复制链接</el-button>
          <div style="padding-top: 20px;color:red">注：抖音渠道不可展示微信相关logo或二维码等不符合抖音规则的素材</div>
        </div>
        <tweet-show ref="tweetShow"></tweet-show>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="tweetShareCancel">取 消</el-button>
      </div>
    </el-dialog>

    <el-dialog title="手机管理端配置" :visible.sync="openSysImage" width="700px" append-to-body :close-on-click-modal="false" :show-close="false" :close-on-press-escape="false">
      <el-form class="imageConfig" label-width="110px">
        <el-form-item label="组织名称">
          <span>{{ organizationName }}</span>
          <span style="font-weight: 666;margin: 0 5px 0 20px">推文编号: </span>#{{tweetId}}
          <span style="font-weight: 666;margin: 0 5px 0 20px">推文名称: </span>{{tweetTitle}}
        </el-form-item>
        <el-form-item label="分享标题" prop="shareTitle">
          <el-input style="display: block;width:80%;padding: 5px !important;" type="textarea" :autosize={minRows:3} v-model="imageForm.shareTitle"></el-input>
        </el-form-item>
        <el-form-item label="分享文案" prop="shareText" v-if="imageForm.channelType=='wx'">
          <el-input style="display: block;width:80%;padding: 5px !important;" type="textarea" :autosize={minRows:3} v-model="imageForm.shareText"></el-input>
        </el-form-item>
        <el-form-item label="销售话术" prop="saleText" v-if="imageForm.channelType=='wx' && tweetShareButtonArray.includes('sale')">
          <el-input style="display: block;width:80%;padding: 5px !important;" type="textarea" :autosize={minRows:3} v-model="imageForm.saleText"></el-input>
        </el-form-item>
        <el-form-item label="手机管理端">
          <el-radio v-model="imageForm.imgType" label='0' style="font-weight: 666;">生产配置</el-radio>
          <div class="d-flex" style="padding-left: 10px;">
            <div class="d-flex flex-column">
              <div style="font-size:14px;color:#666">
                微信小程序封面
              </div>
              <div style="width: 120px;max-height:120px;display: flex;align-items: center;justify-content: center;border: 1px solid #f5f5f5;overflow: hidden;">
                <div class="d-flex a-center j-center" style="height:120px;width:100%;border:1px solid #f5f5f5">
                  <img style="max-width: 120px;max-height: 100%;"
                    v-if="imageForm.tweetWxImg!=null && imageForm.tweetWxImg.fileVirtualPath" :src="imageForm.tweetWxImg.fileVirtualPath" class="avatar ">
                  <img style="max-width: 120px;max-height: 120px;"
                    v-if="imageForm.tweetWxImg==null || !imageForm.tweetWxImg.fileVirtualPath" src="../../../assets/images/noImage.png" class="avatar">
                </div>
              </div>
            </div>
            <div class="d-flex flex-column ml-2">
              <div style="font-size:14px;color:#666">
                手机管理端展架图
              </div>
              <div style="width: 120px;max-height:120px;display: flex;align-items: center;justify-content: center;border: 1px solid #f5f5f5;overflow: hidden;">
                <div class="d-flex a-center j-center" style="height:120px;width:100%;border:1px solid #f5f5f5">
                  <img style="max-width: 120px;max-height: 100%;"
                    v-if="imageForm.tweetSysImg!=null &&  imageForm.tweetSysImg.fileVirtualPath" :src="imageForm.tweetSysImg.fileVirtualPath" class="avatar">
                  <img style="max-width: 120px;max-height: 120px;"
                    v-if="imageForm.tweetSysImg==null || !imageForm.tweetSysImg.fileVirtualPath" src="../../../assets/images/noImage.png" class="avatar">
                </div>
              </div>
            </div>
            <div class="d-flex flex-column ml-2">
              <div style="font-size:14px;color:#666">
                朋友圈海报
              </div>
              <div style="width: 120px;max-height:120px;display: flex;align-items: center;justify-content: center;border: 1px solid #f5f5f5;overflow: hidden;">
                <div class="d-flex a-center j-center" style="height:120px;width:100%;border:1px solid #f5f5f5">
                      <img style="max-width: 120px;max-height: 120px;"
                        v-if="imageForm.tweetPyqImg!=null && imageForm.tweetPyqImg.fileVirtualPath" :src="imageForm.tweetPyqImg.fileVirtualPath" class="avatar">
                      <img style="max-width: 120px;max-height: 120px;"
                        v-if="imageForm.tweetPyqImg==null || !imageForm.tweetPyqImg.fileVirtualPath" src="../../../assets/images/noImage.png" class="avatar">
                  </div>
              </div>
            </div>
          </div>
          <el-radio v-model="imageForm.imgType" label='1' style="font-weight: 666;">渠道自定义</el-radio>
          <div class="d-flex" style="padding-left: 10px;">
            <div class="d-flex flex-column ">
              <div style="font-size:14px;color:#666">
                微信小程序封面
              </div>
              <div style="width: 120px;max-height:120px;display: flex;align-items: center;justify-content: center;border: 1px solid #f5f5f5;overflow: hidden;">
                <el-upload class="avatar-uploader" :action="upload.url"
                  :headers="upload.headers" :data="upload.data"
                  :show-file-list="false"
                  :on-success="(res,file)=>handleAvatarSuccess(res,file,'DISPLAY_CHANNEL_WX_IMG')"
                  :before-upload="(file)=>beforeAvatarUpload(file,'DISPLAY_CHANNEL_WX_IMG')">
                  <div class="d-flex a-center j-center" v-if="imageForm.wxImg!=null && imageForm.wxImg.fileVirtualPath" style="height:120px;width:100%;border:1px solid #f5f5f5">
                      <img style="max-width: 120px;max-height: 100%;"
                        v-if="imageForm.wxImg.fileVirtualPath" :src="imageForm.wxImg.fileVirtualPath" class="avatar ">
                  </div>

                  <i v-else class="el-icon-plus avatar-uploader-icon"
                    style="width: 120px;height:120px;display: flex;align-items: center;justify-content: center;border: 1px solid #f5f5f5;"></i>
                </el-upload>
              </div>
              <el-button type="primary" class="mt-20" v-if="imageForm.wxImg.fileVirtualPath"
                @click="delImg('DISPLAY_CHANNEL_WX_IMG')">删除</el-button>

              <el-upload class="avatar-uploader" :action="upload.url"
                :headers="upload.headers" :data="upload.data"
                :show-file-list="false"
                :on-success="(res,file)=>handleAvatarSuccess(res,file,'DISPLAY_CHANNEL_WX_IMG')"
                :before-upload="(file)=>beforeAvatarUpload(file,'DISPLAY_CHANNEL_WX_IMG')">
                <el-button v-if="!imageForm.wxImg.fileVirtualPath" type="primary" class="mt-20" @click="addImg('DISPLAY_CHANNEL_WX_IMG')" style="width:120px">添加</el-button>
                </el-upload>
              </el-upload>
            </div>
            <div class="d-flex flex-column ml-2">
              <div style="font-size:14px;color:#666">
                手机管理端展架图
              </div>
              <div style="width: 120px;max-height:120px;display: flex;align-items: center;justify-content: center;border: 1px solid #f5f5f5;overflow: hidden;">
                <el-upload class="avatar-uploader" :action="upload.url"
                  :headers="upload.headers" :data="upload.data"
                  :show-file-list="false"
                  :on-success="(res,file)=>handleAvatarSuccess(res,file,'DISPLAY_CHANNEL_SYS_IMG')"
                  :before-upload="(file)=>beforeAvatarUpload(file,'DISPLAY_CHANNEL_SYS_IMG')">

                  <div class="d-flex a-center j-center" v-if="imageForm.sysImg!=null && imageForm.sysImg.fileVirtualPath" style="height:120px;width:100%;border:1px solid #f5f5f5">
                      <img style="max-width: 120px;max-height: 100%;"
                        v-if="imageForm.sysImg.fileVirtualPath" :src="imageForm.sysImg.fileVirtualPath" class="avatar">
                  </div>
                  <i v-else class="el-icon-plus avatar-uploader-icon"
                    style="width: 120px;height:120px;display: flex;align-items: center;justify-content: center;border: 1px solid #f5f5f5;"></i>
                </el-upload>

              </div>
              <el-button type="primary" class="mt-20" v-if="imageForm.sysImg.fileVirtualPath"
                @click="delImg('DISPLAY_CHANNEL_SYS_IMG')">删除</el-button>

              <el-upload style="width:120px" class="avatar-uploader" :action="upload.url"
                :headers="upload.headers" :data="upload.data"
                :show-file-list="false"
                :on-success="(res,file)=>handleAvatarSuccess(res,file,'DISPLAY_CHANNEL_SYS_IMG')"
                :before-upload="(file)=>beforeAvatarUpload(file,'DISPLAY_CHANNEL_SYS_IMG')">
                <el-button v-if="!imageForm.sysImg.fileVirtualPath" type="primary" class="mt-20" @click="addImg('DISPLAY_CHANNEL_SYS_IMG')" style="width:120px">添加</el-button>
              </el-upload>
            </div>
            <div class="d-flex flex-column ml-2">
              <div style="font-size:14px;color:#666">
                朋友圈海报
              </div>
              <div style="width: 120px;max-height:120px;display: flex;align-items: center;justify-content: center;border: 1px solid #f5f5f5;overflow: hidden;">
                <el-upload class="avatar-uploader" :action="upload.url"
                  :headers="upload.headers" :data="upload.data"
                  :show-file-list="false"
                  :on-success="(res,file)=>handleAvatarSuccess(res,file,'DISPLAY_CHANNEL_PYQ_IMG')"
                  :before-upload="(file)=>beforeAvatarUpload(file,'DISPLAY_CHANNEL_PYQ_IMG')">
                  <div class="d-flex a-center j-center" v-if="imageForm.pyqImg!=null && imageForm.pyqImg.fileVirtualPath" style="height:120px;width:100%;border:1px solid #f5f5f5">
                      <img style="max-width: 120px;max-height: 120px;"
                        v-if="imageForm.pyqImg.fileVirtualPath" :src="imageForm.pyqImg.fileVirtualPath" class="avatar">
                  </div>

                  <i v-else class="el-icon-plus avatar-uploader-icon"
                    style="width: 120px;height:120px;display: flex;align-items: center;justify-content: center;border: 1px solid #f5f5f5;"></i>
                </el-upload>
              </div>
              <el-button type="primary" class="mt-20" v-if="imageForm.pyqImg.fileVirtualPath"
                @click="delImg('DISPLAY_CHANNEL_PYQ_IMG')">删除</el-button>

              <el-upload style="width:120px" class="avatar-uploader" :action="upload.url"
                :headers="upload.headers" :data="upload.data"
                :show-file-list="false"
                :on-success="(res,file)=>handleAvatarSuccess(res,file,'DISPLAY_CHANNEL_PYQ_IMG')"
                :before-upload="(file)=>beforeAvatarUpload(file,'DISPLAY_CHANNEL_PYQ_IMG')">
                <el-button v-if="!imageForm.pyqImg.fileVirtualPath" type="primary" class="mt-20" @click="addImg('DISPLAY_CHANNEL_PYQ_IMG')" style="width:120px">添加</el-button>
              </el-upload>
            </div>
          </div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="saveSysImage">确 定</el-button>
        <el-button @click="sysImageCancel">取 消</el-button>
      </div>
    </el-dialog>

    <el-dialog title="策略配置" :visible.sync="openElemTactic" width="700px" append-to-body :close-on-click-modal="false" :show-close="false" :close-on-press-escape="false">
      <el-form class="channel" style="background-color:antiquewhite;">
        <el-form-item label="组织名称">
          <span>{{ organizationName }}</span>
          <span style="font-weight: 666;margin: 0 5px 0 20px">推文编号: </span>#{{tweetId}}
          <span style="font-weight: 666;margin: 0 5px 0 20px">推文名称: </span>{{tweetTitle}}
        </el-form-item>
        <el-form-item label="分发策略">
          <div style="display: flex;">
            <div class="font-14">谁发展:</div>
            <div style="padding-left: 20px;">
              <el-select v-model="tacticForm.shareRules" clearable placeholder="请选择分发规则" style="width:200px;padding-right:15px">
                <el-option
                  v-for="dict in shareRuless"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                ></el-option>
              </el-select>
              <el-select v-model="tacticForm.shareUserId" v-if="tacticForm.shareRules=='1'" clearable placeholder="请选择指定分发人" style="width:200px">
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
      </el-form>

      <el-form v-for="(item,qindex) in tacticForm.elemTacticList" :key="qindex" class="channel">
        <div v-if="item.targetType=='SCENE_LIVE_CODE'">
          <el-form-item label="活码策略" style="margin-top: 10px">
            <div style="display: flex;">
              <div>
                <div class="font-14" style="display: flex;">活码显示:
                  <div style="padding-left: 20px;">
                    <el-select v-model="item.tacticType" placeholder="请选择">
                      <el-option v-for="item in elemLiveCodeTacticTypes"
                        :key="item.code"
                        :label="item.type"
                        :value="item.code">
                      </el-option>
                    </el-select>
                    <el-select v-if="item.tacticType == '7'" v-model="item.channelLiveCodeAppointOrg" style="margin-left: 10px;" placeholder="请选择指定组织">
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
                    <el-select v-model="item.channelLiveCodeShowType" placeholder="请选择">
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
                      <el-radio-group style="margin:5px 0 5px 0;text-align: left;font-weight: 666;" v-model="item.channelLiveCodeType">
                        <el-radio label='0' style="margin-right:100px">默认</el-radio>
                        <!-- <el-radio label='1' style="margin-left:0px;margin-right:70px" >生产配置</el-radio> -->
                        <el-radio label='2' style="margin-left:0px">渠道自定义</el-radio>
                      </el-radio-group>
                    </div>
                    <div>
                      <div class="d-flex">
                        <div
                          style="width: 120px;max-height:120px;display: flex;align-items: center;justify-content: center;border: 1px solid #f5f5f5;overflow: hidden;margin-right:30px">
                          <div class="d-flex a-center j-center" style="height:120px;width:100%;border:1px solid #f5f5f5">
                            <img style="max-width: 120px;max-height: 120px;" v-if="item.target!=null && item.target.image!=null && item.target.image.fileVirtualPath != ''" 
                              :src="item.target.image.fileVirtualPath" class="avatar">
                            <img style="max-width: 120px;max-height: 120px;" v-if="item.target==null || item.target.image==null || item.target.image.fileVirtualPath == ''"
                              src="../../../assets/images/noImage.png" class="avatar">
                          </div>
                        </div>
                        <!-- <div
                          style="width: 120px;max-height:120px;display: flex;align-items: center;justify-content: center;border: 1px solid #f5f5f5;overflow: hidden;margin-right:30px">
                          <div class="d-flex a-center j-center" style="height:120px;width:100%;border:1px solid #f5f5f5">
                            <img style="max-width: 120px;max-height: 120px;"
                              v-if="item.liveCodeImg!=null && item.liveCodeImg.fileVirtualPath" :src="item.liveCodeImg.fileVirtualPath" class="avatar">
                            <img style="max-width: 120px;max-height: 120px;"
                              v-if="item.liveCodeImg==null || !item.liveCodeImg.fileVirtualPath" src="../../../assets/images/noImage.png" class="avatar">
                          </div>
                        </div> -->
                        <div
                          style="width: 120px;max-height:120px;display: flex;align-items: center;justify-content: center;border: 1px solid #f5f5f5;overflow: hidden">
                          <el-upload class="avatar-uploader" :action="upload.url"
                            :headers="upload.headers" :data="upload.data"
                            :show-file-list="false"
                            :on-success="(res,file)=>handleAvatarSuccess(res,file,'SCENE_LIVE_CODE_IMAGE',item)"
                            :before-upload="(file)=>beforeAvatarUpload(file,'SCENE_LIVE_CODE_IMAGE',item)">

                            <div v-if="item.channelLiveCodeImg!=null && item.channelLiveCodeImg.fileVirtualPath!=''" class="d-flex a-center j-center" style="height:120px;width:100%;border:1px solid #f5f5f5">
                              <img style="max-width: 120px;max-height: 120px;" v-if="item.channelLiveCodeImg.fileVirtualPath" :src="item.channelLiveCodeImg.fileVirtualPath" class="avatar">
                            </div>
                            <i v-else class="el-icon-plus avatar-uploader-icon"
                              style="width: 120px;height:120px;display: flex;align-items: center;justify-content: center;border: 1px solid #f5f5f5;"></i>
                          </el-upload>
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
                <el-select v-model="item.tacticType" placeholder="请选择">
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
                    <el-radio-group style="margin:5px 0 5px 0;text-align: left;font-weight: 666;" v-model="item.channelSkipConfigType">
                      <el-radio label='0' style="margin-right:70px" v-show="item.skipImgType=='0'">系统默认</el-radio>
                      <el-radio label='1' style="margin-left:0px;margin-right:70px" >生产配置</el-radio>
                      <el-radio label='2' style="margin-left:0px">渠道自定义</el-radio>
                    </el-radio-group>
                  </div>
                  <div>
                    <div class="d-flex">
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
                            v-if="item.skipImg==null || !item.skipImg.fileVirtualPath" src="../../../assets/images/noImage.png" class="avatar">
                        </div>
                      </div>
                      <div
                        style="width: 120px;max-height:120px;display: flex;align-items: center;justify-content: center;border: 1px solid #f5f5f5;overflow: hidden">
                        <el-upload class="avatar-uploader" :action="upload.url"
                          :headers="upload.headers" :data="upload.data"
                          :show-file-list="false"
                          :on-success="(res,file)=>handleAvatarSuccess(res,file,'DISPLAY_CHANNEL_SKIP_IMG',item)"
                          :before-upload="(file)=>beforeAvatarUpload(file,'DISPLAY_CHANNEL_SKIP_IMG',item)">

                          <div v-if="item.channelSkipImg!=null && item.channelSkipImg.fileVirtualPath!=''" class="d-flex a-center j-center" style="height:120px;width:100%;border:1px solid #f5f5f5">
                            <img style="max-width: 120px;max-height: 120px;" v-if="item.channelSkipImg.fileVirtualPath" :src="item.channelSkipImg.fileVirtualPath" class="avatar">
                          </div>
                          <i v-else class="el-icon-plus avatar-uploader-icon"
                            style="width: 120px;height:120px;display: flex;align-items: center;justify-content: center;border: 1px solid #f5f5f5;"></i>
                        </el-upload>
                      </div>
                    </div>
                    <!-- <el-switch v-model="item.skipType" active-value="1"
                      inactive-value="0"
                      @change="handleSkipTypeChange(item)"></el-switch> -->
                  </div>
                  <!-- <div v-if="item.skipType == '0'">
                    <el-input v-model="item.skipUrl"
                      placeholder="请输入链接地址" />
                  </div> -->
                </el-col>
              </el-row>
            </div>
          </el-form-item>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="saveElemTactic">确 定</el-button>
        <el-button @click="elemTacticCancel">取 消</el-button>
      </div>
    </el-dialog>

    <el-dialog width="800px" title="策略配置" :visible.sync="tactic3Open" :close-on-click-modal="false"
				:close-on-press-escape="false">
        <el-button type="primary" plain @click="batchSelection()" style="margin: 0 0 10px 10px">批量指派</el-button>
        <div style="height: 404px;overflow-y: scroll;margin-left: 15px;">
          <div v-for="item in tacticList" v-if="tacticForm.shareRules==1" >
            <div class="center-board-row" v-if="tacticForm.shareUserId!=null && tacticForm.shareUserId==item.sendUserId" style="display: flex;align-items: center; padding: 10px 30px 10px 10px">
                <span>由</span>
                <span style="display:inline-block;width: 300px;text-align:center;background:#f5f4f4;padding: 5px 7px; border-radius: 4px; color:#000000;margin:0 10px; padding: 5px 8px;">{{ item.sendOrganizationName }}--{{ item.sendUserName }}</span>
                <span style="white-space: nowrap;">发展，</span>
                <span v-if="item.targetType=='SCENE_LIVE_CODE'" style="white-space: nowrap;">显示</span>
                <span v-if="item.targetType!='SCENE_LIVE_CODE'">由</span>
                <span v-if="item.acceptUserId == 0" @click="tacticConfigOpen(item)" style="display:inline-block; width: 300px; text-align:center; margin:0 10px; padding: 5px 7px; background: #f5f4f4;border-radius: 4px; color: #5da6e9; cursor:pointer;">
                  {{ item.sendOrganizationName }}--{{ item.sendUserName }}
                </span>
                <span v-if="item.acceptUserId != 0" @click="tacticConfigOpen(item)" style="display:inline-block; width: 300px; text-align:center; margin:0 10px; padding: 5px 7px; background: #f5f4f4;border-radius: 4px; color: #5da6e9; cursor:pointer;">
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
                <span v-if="item.acceptUserId == 0" @click="tacticConfigOpen(item)" style="display:inline-block; width: 300px; text-align:center; margin:0 10px; padding: 5px 7px; background: #f5f4f4;border-radius: 4px; color: #5da6e9; cursor:pointer;">
                  {{ item.sendOrganizationName }}--{{ item.sendUserName }}
                </span>
                <span v-if="item.acceptUserId != 0" @click="tacticConfigOpen(item)" style="display:inline-block; width: 300px; text-align:center; margin:0 10px; padding: 5px 7px; background: #f5f4f4;border-radius: 4px; color: #5da6e9; cursor:pointer;">
                  {{ item.acceptOrganizationName }} -- {{ item.acceptUserName }}
                </span>
                <span v-if="item.targetType=='SCENE_LIVE_CODE'" style="white-space: nowrap;">活码</span>
                <span v-if="item.targetType!='SCENE_LIVE_CODE'" style="white-space: nowrap;">受理</span>
            </div>
          </div>
        </div>
				<div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="tacticOK">确 定</el-button>
					<el-button @click="tacticCancel">取 消</el-button>
				</div>
    </el-dialog>

    <el-dialog title="选择组织" :visible.sync="tacticOrganizationUserOpen" width="30%" :close-on-click-modal="false"
      :close-on-press-escape="false" :show-close="false">
      <el-tabs v-model="tacticSelectOrganization.organizationName" tab-position="left"
        @tab-click="selectOrganization">
        <el-tab-pane v-for="(item,index) in tacticUserOrganization" :key="item.organizationId"
          :label="item.organizationName" :name="item.organizationName">
          <el-radio-group style="margin:15px 0;text-align: left;min-width: 71%;"
            v-model="tacticAcceptUserId" @change="radioSelectUser">
            <el-radio style="display:block;height: 25px;" v-for="item2 in tacticOrganizationUser"
              :key="item2.userId"
              :label="item2.userId">
              {{item2.nickName}}
            </el-radio>
          </el-radio-group>
        </el-tab-pane>
      </el-tabs>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="selectUser">选 中</el-button>
        <el-button @click="closeSelectUser">取 消</el-button>
      </div>
    </el-dialog>

    <el-dialog title="公共推文组织关系列表" :visible.sync="openPublicTweet" width="40%" :close-on-click-modal="false" :close-on-press-escape="false" @close="publicTweetClose">
        <el-table ref="organizationPublicTable" v-loading="loadingPublic" :data="organizationListPublic" @selection-change="handleSelectionChangePublic">
          <el-table-column type="selection" width="55" />
          <el-table-column label="组织编号" prop="organizationId" width="80" align="center" />
          <el-table-column label="组织名称" prop="organizationName"  align="center" />
          <el-table-column label="所属部门" prop="deptName"  align="center" />
        </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="chooseOrganization">确 定</el-button>
        <el-button @click="publicTweetClose">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  tweetChannelAddBatch,
  tweetChannelInfo,
  tweetChannelUpdate,
  tweetChannelUpdateStatus,
  tweetChannelRemove,
  tweetList, tweetChannelList, tacticList
} from '../../../api/system/display/channel'
import { tweetShareAdd } from '../../../api/system/display/share'
import { encrypt, decrypt } from '@/utils/jsencrypt'
import qrCode from '@/components/tweet/qrCode'
import tweetPreview from '@/components/tweet/tweetPreview.vue'
import tweetShow from '@/components/tweet/tweetShow.vue'
import { organizationUser, manageUserOrganization } from '../../../api/system/production/tweet'
import { getToken } from '@/utils/auth'
import { organizationInfo } from '@/api/system/organiaztion'
import { getFormSuccessPic, allocatedOrganizationList,getFormSuccessPic_hk } from '../../../api/tool/tweetArticle.js'

export default {
  name: 'channel',
  dicts: ['tweet_channel'],
  components: { qrCode, tweetPreview, tweetShow },
  data() {
    return {
      sessionOrgId:sessionStorage.getItem('organizationId'),
      sessionOrgName:'',
      form_result_img_url:'',// 表单默认图片
      form_result_img_url_hk:'',// 表单 haoka
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
      tweetCommonFlags:[
        {
          value: '1',
          label: '公共'
        },
        {
          value: '0',
          label: '私有'
        },
      ],
      channelStatuss:[
        {
          value: 'E',
          label: '上架'
        },
        {
          value: 'J',
          label: '下架'
        }
      ],
      // 遮罩层
      loading: true,
      loadingPublic:false,
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 日期范围
      dateRange: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        tweetStatus: '1',
        isImage:1,
        tweetId:undefined,
        tweetOrganizationName:'',
        tweetTitle: '',
        tweetCommonFlag: '',
        createBy:'',
        channelType:'',
        channelName:'',
        channelCode:'',
        channelStatus:'',
        organizationId: this.sessionOrgId
      },
      //推文列表
      tweetList: [],
      // 总条数
      total: 0,
      // 选中数组
      ids: [],
      // 是否显示弹出层
      open: false,
      // 弹出层标题
      title: '',
      //公共渠道 选择组织
      organizationListPublic:[],
      organizationListChoose:[],
      openPublicTweet:false,
      //新增渠道==开始===
      openAddChannel:false,
      channelList:[],
      tweetId:undefined,
      tweetTitle:'',
      organizationName:'',
      //新增渠道
      channelForm: {
        channelId: undefined,
        tweetId: undefined,
        organizationId: this.sessionOrgId,
        channelType: '',
        channelName: '',
        channelCode: '',
        //策略配置-开始
        shareRules: '0',
        shareOrgId:undefined,
        shareOrgName:'',
        shareUserId:undefined,
        shareUserName:'',
        elemTacticList: [],
        //策略配置-结束
        //头图配置-开始
        imgType: '',
        tweetSysImgId: undefined,
        tweetWxImgId: undefined,
        tweetPyqImgId: undefined,
        tweetSysImg: this.defaultImg,
        tweetWxImg: this.defaultImg,
        tweetPyqImg: this.defaultImg,
        sysImgId: undefined,
        wxImgId: undefined,
        pyqImgId: undefined,
        sysImg: this.defaultImg,
        wxImg: this.defaultImg,
        pyqImg: this.defaultImg,
        //头图配置-结束
      },
      //修改渠道==开始===
      openUpdateChannel:false,
      tweetChannelForm: {
        channelId: undefined,
        tweetId: undefined,
        organizationId: this.sessionOrgId,
        channelType: '',
        channelName: '',
        channelCode: '',
        editType: 1,
      },
      tweetChannelFormRules: {
        channelType: [
          { required: true, message: '渠道类型不能为空', trigger: 'blur' }
        ],
        channelName: [
          { min: 0, max: 20, message: '渠道名称长度在 2 到 20 个字符', trigger: 'blur' }
        ],
        channelCode: [
          { min: 0, max: 20, message: '渠道编码长度在 2 到 20 个字符', trigger: 'blur' }
        ],
      },
      //新增修改渠道==结束===
      //推文预览
      tweetPreview:false,
      //推文分发
      tweetShare:false,
      userName:this.$store.state.user.name,
      channelType:undefined,
      shareUserName:undefined,
      shareRules:undefined,
      shareUrl:undefined,
      tweetShareId:undefined,
      //子表查询
      loadingChannel: false,
      parentRow:undefined,
      clickTweetIds:[],

      //多个渠道配置
      currentIndex:undefined,
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
      //手机管理端配置==开始===
      //头图配置
      openSysImage:false,
      shareButton:'',
      tweetShareButtonArray:['pyq','wx','wxcode','wximg','share','sale'],
      tweetTweetText:'',
      tweetPyqText:'',
      tweetShareText:'',
      tweetShareTitle:'',
      tweetSaleText:'',
      imageForm:{
        channelType:'',
        tweetText:'',
        pyqText:'',
        shareTitle:'',
        shareText:'',
        saleText:'',
        channelId:undefined,
        editType:3,
        imgType: '',
        sysImgId: undefined,
        wxImgId: undefined,
        pyqImgId: undefined,
        sysImg: this.defaultImg,
        wxImg: this.defaultImg,
        pyqImg: this.defaultImg,
      },
      imgType:'0',
      defaultImg: {
        fileId: undefined,
        fileOriginalName: '',
        fileVirtualPath: ''
      },
      tweetSysImg: {
        fileId: undefined,
        fileOriginalName: '',
        fileVirtualPath: ''
      },
      tweetWxImg: {
        fileId: undefined,
        fileOriginalName: '',
        fileVirtualPath: ''
      },
      tweetPyqImg: {
        fileId: undefined,
        fileOriginalName: '',
        fileVirtualPath: ''
      },
      //手机管理端配置==结束===
      //策略配置==开始===
      //策略配置
      openElemTactic:false,
      sessionUserList:[], //分发规则中 当前登录组织下指定成员列表
      userList:[],//分发规则中 指定成员列表
      tacticForm:{
        channelId:undefined,
        shareRules: '0',
        userList:[],
        shareOrgId:undefined,
        shareOrgName:'',
        shareUserId:undefined,
        shareUserName:'',
        elemTacticList: [],
        editType:0,
      },
      tweetElemTacticList:[], //所选推文策略的表单
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
      tactic3Open: false, // 选择策略类型为3时打开当前组织所有人的列表
      tacticList: [], //选择策略类型为3时打开当前组织的用户
      tacticListOld: [], //选择策略类型为3时打开当前组织的用户 旧
      // tacticOldList: [], //选择策略类型为3时打开当前组织的用户
      tacticOrganizationUserOpen: false, // 选择组织和用户对话框开关
      isBatch: false, //是否为批量操作
      tacticUserOrganization: [], //当前用户所归属的所有组织
      tacticUserOrganizationDefault:[],
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
      //策略配置==结束===
    }
  },
  created() {
    this.imageFormReset()
    this.getList()
    this.getOrgName()
    this.getPic()
    this.getSessionUserList()
    this.getManageUserOrganization()
  },
  activated() {
    this.imageFormReset()
    this.getList()
    this.getOrgName()
    this.getPic()
    this.getSessionUserList()
    this.getManageUserOrganization()
  },
  mounted() {

  },
  methods: {
    //获取纳管组织
    getManageUserOrganization(){
      manageUserOrganization().then(response => {
        this.tacticUserOrganizationDefault = response.data
      })
    },
    //获取默认表单结果页
    getPic(){
      getFormSuccessPic().then(res=>{
        this.form_result_img_url = res.msg
      })
	    getFormSuccessPic_hk().then(r=>{
        this.form_result_img_url_hk = r.msg
        console.log(this.form_result_img_url_hk ,'r2----------');
      })
    },
    //获取当前组织名称
    getOrgName(){
      if(this.sessionOrgId!=null){
        let params = {
          organizationId: this.sessionOrgId
        }
        organizationInfo(params).then(response => {
          //组织名称
          this.sessionOrgName = response.data.organizationName
        })
      }
    },
    //获取当前组织id查询组织名称
    getSessionUserList(){
      var orgId = this.sessionOrgId;
      this.sessionUserList = []
      if(orgId==null){
        return;
      }
      organizationUser({organizationId: orgId}).then(response => {
        if (response.data) {
          this.sessionUserList = response.data
        }
      })
    },
    //列表数据查询====开始=======
    //子记录点击变色
    expandChange(row) {
      if(this.clickTweetIds.includes(row.tweetId)){
        this.clickTweetIds.splice(this.clickTweetIds.findIndex(item => item === row.tweetId),1);
      }else{
        this.clickTweetIds.push(row.tweetId)
      }
      //查询数据
      this.loadingChannel = true;
      tweetChannelList({
        pageNum: 1,
        pageSize: 1000,
        tweetId: row.tweetId,
        channelType:this.queryParams.channelType,
        channelName:this.queryParams.channelName,
        channelCode:this.queryParams.channelCode,
        channelStatus:this.queryParams.channelStatus,
        organizationId: this.sessionOrgId
      }).then(response => {
        row.tweetChannels = response.rows;
        this.loadingChannel = false;
      });
    },
    isRed({ row }) {
      if (this.clickTweetIds.includes(row.tweetId)) {
        return {
          backgroundColor: "rgb(226, 227, 231)",
        };
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
      this.queryParams = {
        pageNum: 1,
        pageSize: 10,
        tweetStatus: '1',
        isImage:1,
        tweetId:undefined,
        tweetOrganizationName:'',
        tweetTitle: '',
        tweetCommonFlag: '',
        createBy:'',
        channelType:'',
        channelName:'',
        channelCode:'',
        channelStatus:'',
        organizationId: this.sessionOrgId
      },
      this.handleQuery()
    },
    // 列表
    getList() {
      if(this.queryParams.tweetId !=null && this.queryParams.tweetId !=undefined && this.queryParams.tweetId !=''){
        if(!(!isNaN(parseFloat(this.queryParams.tweetId)) && isFinite(this.queryParams.tweetId))){
          this.$modal.msgError('推文编号请填写数字')
          return
        }
      }
      this.clickTweetIds = []
      this.loading = true
      this.queryParams.organizationId = this.sessionOrgId
      tweetList(this.addDateRange(this.queryParams, this.dateRange)).then(response => {
        this.tweetList = response.rows
        this.total = response.total
        this.loading = false
      })
    },
    /** 排序触发事件 */
    handleSortChange(column, prop, order) {
      this.queryParams.orderByColumn = column.prop;
      this.queryParams.isAsc = column.order;
      this.getList();
    },
    handleSortChangeChannel(column, prop, order, parentRow){
      this.loadingChannel = true;
      tweetChannelList({
        pageNum: 1,
        pageSize: 1000,
        tweetId: parentRow.tweetId,
        channelType:this.queryParams.channelType,
        channelName:this.queryParams.channelName,
        channelCode:this.queryParams.channelCode,
        channelStatus:this.queryParams.channelStatus,
        organizationId: this.sessionOrgId,
        orderByColumn: column.prop,
        isAsc: column.order
      }).then(response => {
        parentRow.tweetChannels = response.rows;
        this.loadingChannel = false;
      });
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.tweetId)
      this.single = selection.length != 1
      this.multiple = !selection.length
    },
    //列表数据查询====结束=======
    //添加公共渠道 按钮
    handleAddPublic(row) {
      this.parentRow = row
      this.tweetId = row.tweetId
      this.tweetTitle = row.tweetTitle
      if(row.sysImg!=null){
        this.tweetSysImg = row.sysImg
      }
      if(row.wxImg!=null){
        this.tweetWxImg = row.wxImg
      }
      if(row.pyqImg!=null){
        this.tweetPyqImg = row.pyqImg
      }
      if(row.shareButton!=null && row.shareButton!=''){
        this.tweetShareButton = row.shareButton
        this.tweetShareButtonArray = row.shareButton.split(",")
      }
      if(row.tweetText!=null){
        this.tweetTweetText = row.tweetText
      }
      if(row.pyqText!=null){
        this.tweetPyqText = row.pyqText
      }
      if(row.shareText!=null){
        this.tweetShareText = row.shareText
      }
      if(row.shareTitle!=null){
        this.tweetShareTitle = row.tweetTitle
      }
      if(row.saleText!=null){
        this.tweetSaleText = row.saleText
      }
      //公共推文的组织
      this.organizationListPublic = []
      this.organizationListChoose = []
      this.loadingPublic = true
      allocatedOrganizationList({tweetId:row.tweetId}).then(response => {
        this.organizationListPublic = response.rows
        this.loadingPublic = false
      })
      this.openPublicTweet = true
      //推文策略
      this.tweetElemTacticList = []
      this.getTacticList(row.tweetId,null)
    },
    //添加私有渠道 按钮
    handleAdd(row) {
      this.parentRow = row
      this.tweetId = row.tweetId
      this.tweetTitle = row.tweetTitle
      this.organizationName = this.sessionOrgName
      if(row.sysImg!=null){
        this.tweetSysImg = row.sysImg
      }
      if(row.wxImg!=null){
        this.tweetWxImg = row.wxImg
      }
      if(row.pyqImg!=null){
        this.tweetPyqImg = row.pyqImg
      }
      if(row.shareButton!=null && row.shareButton!=''){
        this.tweetShareButton = row.shareButton
        this.tweetShareButtonArray = row.shareButton.split(",")
      }
      if(row.tweetText!=null){
        this.tweetTweetText = row.tweetText
      }
      if(row.pyqText!=null){
        this.tweetPyqText = row.pyqText
      }
      if(row.shareText!=null){
        this.tweetShareText = row.shareText
      }
      if(row.shareTitle!=null){
        this.tweetShareTitle = row.tweetTitle
      }
      if(row.saleText!=null){
        this.tweetSaleText = row.saleText
      }
      this.title = ''
      this.channelList=[]
      this.tweetElemTacticList = []
      tacticList({
        tweetId: row.tweetId,
        channelId: null
      }).then(response => {
        this.tweetElemTacticList = response.data;
        this.handleAddChannelColumn(this.sessionOrgId,this.sessionOrgName,-1);
        this.openAddChannel = true
      });
    },
    //添加多个渠道
    handleAddChannelColumn(orgId,orgName,index){
      let channelForm = {
        channelId: undefined,
        tweetId: this.tweetId,
        tweetTitle: this.tweetTitle,
        organizationId: orgId,
        organizationName: orgName,
        createOrganizationId:this.sessionOrgId,
        updateOrganizationId:this.sessionOrgId,
        channelType: '',
        channelName: '',
        channelCode: '',
        index:this.channelList.length,
        //手机端配置--开始
        tweetText:this.tweetTweetText,
        pyqText:this.tweetPyqText,
        shareText:this.tweetShareText,
        shareTitle:this.tweetShareTitle,
        saleText:this.tweetSaleText,
        imgType:'0',
        sysImgId:undefined,
        wxImgId:undefined,
        pyqImgId:undefined,
        sysImg:this.defaultImg,
        wxImg:this.defaultImg,
        pyqImg:this.defaultImg,
        tweetSysImgId:this.tweetSysImg.fileId,
        tweetWxImgId:this.tweetWxImg.fileId,
        tweetPyqImgId:this.tweetPyqImg.fileId,
        tweetSysImg:this.tweetSysImg,
        tweetWxImg:this.tweetWxImg,
        tweetPyqImg:this.tweetPyqImg,
        //手机端配置--结束
        //策略配置
        shareRules:'0',
        shareOrgId:orgId,
        shareOrgName:'',
        shareUserId:undefined,
        shareUserName:'',
        elemTacticList:JSON.parse(JSON.stringify(this.tweetElemTacticList)),
      }
      if(index==-1){
        this.channelList.push(channelForm);
      }else{
        this.channelList.splice(index+1, 0, channelForm);
        this.channelList = this.channelList.map((item,i)=>{
          return {
            ...item,
            index:i
          }
        })
      }
    },
    //公共推文组织 多选
    handleSelectionChangePublic(selection) {
      this.organizationListChoose = selection;
    },
    //添加公共渠道 组织弹框列表 确定按钮
    chooseOrganization() {
      if(this.organizationListChoose==null || this.organizationListChoose.length==0){
        this.$modal.msgWarning('请选择要添加渠道的组织')
      }else{
        console.log(this.organizationListChoose,"organizationListChoose")
        this.channelList = [];
        for (let i = 0; i < this.organizationListChoose.length; i++) {
          var item = this.organizationListChoose[i]
          this.handleAddChannelColumn(item.organizationId,item.organizationName,-1);
        }
        this.openAddChannel = true
      }
    },
    //添加公共渠道 组织弹框列表 取消按钮
    publicTweetClose(){
      this.parentRow = null
      this.tweetId = undefined
      this.tweetTitle = undefined
      //公共推文的组织
      this.organizationListPublic = []
      this.organizationListChoose = []
      this.tweetElemTacticList = []
      this.openPublicTweet = false
      this.tweetSysImg = this.defaultImg
      this.tweetWxImg = this.defaultImg
      this.tweetPyqImg = this.defaultImg
      this.tweetShareButton = ''
      this.tweetShareButtonArray = ['pyq','wx','wxcode','wximg','share','sale']
      this.tweetTweetText = ''
      this.tweetPyqText = ''
      this.tweetShareText = ''
      this.tweetShareTitle = ''
      this.tweetSaleText = ''
      this.channelList = []
    },

    //策略配置====开始=======
    //策略配置--渠道新增时
    handleElemTactic(row){
      this.organizationName = row.organizationName
      this.tacticFormReset()
      this.tacticForm.organizationId = row.organizationId
      this.tacticForm.editType = 0
      this.currentIndex = row.index
      let elemTacticList = JSON.parse(JSON.stringify(row.elemTacticList))
      if(elemTacticList==null || elemTacticList.length==0){
        this.tacticForm.elemTacticList = JSON.parse(JSON.stringify(this.tweetElemTacticList))
      }else{
        this.tacticForm.elemTacticList = JSON.parse(JSON.stringify(elemTacticList))
      }
      let shareRules = row.shareRules
      if(shareRules==null || shareRules==undefined || shareRules=='undefined' || shareRules==''){
        this.tacticForm.shareRules = '0'
      }else{
        this.tacticForm.shareRules = shareRules
      }
      let shareOrgId = row.shareOrgId
      if(shareOrgId==null || shareOrgId==undefined || shareOrgId=='undefined' || shareOrgId==''){
        this.tacticForm.shareOrgId = row.organizationId
      }else{
        this.tacticForm.shareOrgId = shareOrgId
      }
      let shareUserId = row.shareUserId
      if(shareUserId==null || shareUserId==undefined || shareUserId=='undefined' || shareUserId==''){
        this.tacticForm.shareUserId = undefined
      }else{
        this.tacticForm.shareUserId = shareUserId
      }
      let userList = row.userList
      if(userList==null || userList.length==0){
        if(this.tacticForm.shareUserId==this.sessionOrgId){
          this.tacticForm.userList = JSON.parse(JSON.stringify(this.sessionUserList));
          this.openElemTactic = true
        }else{
          organizationUser({organizationId: this.tacticForm.shareOrgId}).then(response => {
            if (response.data) {
              this.tacticForm.userList = response.data
              this.openElemTactic = true
            }
          })
        }
      }else{
        this.tacticForm.userList = JSON.parse(JSON.stringify(userList));
        this.openElemTactic = true
      }
      console.log("this.tacticForm======",this.tacticForm)
    },
    //策略配置--渠道修改时
    handleElemTacticUpdate(parentRow,row){
      this.tweetId = parentRow.tweetId
      this.tweetTitle = parentRow.tweetTitle
      this.organizationName = row.organizationName
      this.parentRow = parentRow
      this.tacticFormReset()
      let params = {
        channelId: row.channelId,
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
          var organizationId = row.organizationId;
          if(organizationId==this.sessionOrgId){
            this.tacticForm.userList = JSON.parse(JSON.stringify(this.sessionUserList))
            this.openElemTactic = true
          }else{
            organizationUser({organizationId: organizationId}).then(response => {
              if (response.data) {
                this.tacticForm.userList = response.data
                this.openElemTactic = true
              }
            })
          }
        }
      })
    },
    //策略配置--取消按钮
    elemTacticCancel(){
      if(this.tacticForm.editType==0){
        this.channelList[this.currentIndex].userList = JSON.parse(JSON.stringify(this.tacticForm.userList))
      }
      this.tacticFormReset()
      this.openElemTactic = false
    },
    //策略配置--确定按钮
    saveElemTactic(){
      if(this.tacticForm.editType==0){
        //新增
        let msg = this.checkTactic(this.tacticForm)
        if(msg!=""){
          this.$message.error(msg)
          return;
        }else{
          this.channelList[this.currentIndex].userList = JSON.parse(JSON.stringify(this.tacticForm.userList))
          this.channelList[this.currentIndex].elemTacticList = JSON.parse(JSON.stringify(this.tacticForm.elemTacticList))
          this.channelList[this.currentIndex].shareRules = this.tacticForm.shareRules
          this.channelList[this.currentIndex].shareOrgId = this.tacticForm.shareOrgId
          this.channelList[this.currentIndex].shareUserId = this.tacticForm.shareUserId
          this.tacticFormReset()
          this.openElemTactic = false
        }
      }else{
        //修改
        let item = this.tacticForm;
        if(item.channelId==undefined || item.channelId=='undefined' || item.channelId=='' || item.channelId==null){
          this.$modal.msgError('渠道id参数丢失,请重新打开页面')
          return;
        }
        let msg = this.checkTactic(item);
        if(msg!=""){
          this.$message.error(msg)
          return;
        }else{
          this.tacticForm.updateOrganizationId = this.sessionOrgId
          tweetChannelUpdate(this.tacticForm).then(response => {
            this.$modal.msgSuccess('修改成功')
            this.openElemTactic = false
            this.tacticFormReset()
            //刷新渠道列表
            this.loadingChannel = true;
            tweetChannelList({
              pageNum: 1,
              pageSize: 1000,
              tweetId: this.parentRow.tweetId,
              organizationId: this.sessionOrgId
            }).then(response => {
              this.parentRow.tweetChannels = response.rows;
              this.loadingChannel = false;
            });
          })
        }
      }
    },
    //策略配置form 重置
    tacticFormReset(){
      this.tacticForm={
        channelId:undefined,
        shareRules: '0',
        userList:[],
        shareOrgId:undefined,
        shareOrgName:'',
        shareUserId:undefined,
        shareUserName:'',
        elemTacticList: [],
        editType:0,
      }
    },
    //策略配置--指定成员配置页面弹出,
    tactic3OpenHandle(tacticForm,item) {
      console.log(item, "........当前打开策略")
      // item元素中所有表单中的某一个
      if (item.tacticType == '3'  && item.channelTactics !=null && item.channelTactics.length > 0) {
        // 用于修改
        console.log("==============用于修改")
        this.tacticList = item.channelTactics
        this.tacticListOld = JSON.stringify(this.tacticList)
        console.log(this.tacticList, "..........策略数据")
        console.log(this.tacticListOld, "..........策略数据原")
        this.tactic3Open = true
      } else {
        console.log("tacticForm===",tacticForm)
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
          console.log(this.tacticList, "..........策略数据")
          console.log(this.tacticListOld, "..........策略数据原")
        })
      }
    },
    //批量选择
    batchSelection(){
      this.tacticUserOrganization = this.tacticUserOrganizationDefault;
      let params = {
        organizationId: this.tacticForm.organizationId
      }
      organizationUser(params).then(response => {
        if (response.data) {
          this.tacticOrganizationUser = response.data
          console.log('tacticOrganizationUser',this.tacticOrganizationUser)
          this.tacticSelectOrganization.organizationName = this.tacticOrganizationUser[0].organizationName;
          this.tacticSelectOrganization.organizationId = this.tacticOrganizationUser[0].organizationId;
        }
      })
      this.tacticOrganizationUserOpen = true;
      this.isBatch = true;
    },
    //策略配置--指定成员配置页面--确定按钮
    tacticOK() {
      //修改时报错=============================================
      //将策略放入集合中
      let organizationUser = this.tacticList
      console.log(organizationUser, '............tacticOKUser')
      console.log(this.tacticForm.elemTacticList, '............tacticOKelemTacticList')
      for (let i = 0; i < organizationUser.length; i++) {
        for (let j = 0; j < this.tacticForm.elemTacticList.length; j++) {
          let elemTactic = this.tacticForm.elemTacticList[j]
          if (organizationUser[i].targetId == elemTactic.targetId && organizationUser[i].targetType == elemTactic.targetType) {
            elemTactic.channelTactics = organizationUser
            break;
          }
        }
      }
      this.tactic3Open = false
      console.log(organizationUser, '............tacticOKorganizationUser')
      console.log(this.tacticForm.elemTacticList, '............tacticOK')
    },
    //擦略弹窗--指定成员配置页面--取消按钮
    tacticCancel() {
      this.tacticListOld = JSON.parse(this.tacticListOld)
      console.log(this.tacticList, "策略数据.............")
      console.log(this.tacticListOld, "原数据.............")
      for (let i = 0; i < this.tacticListOld.length; i++) {
        for (let j = 0; j < this.tacticForm.elemTacticList.length; j++) {
          let elemTactic = this.tacticForm.elemTacticList[j]
          if (this.tacticListOld[i].targetId == elemTactic.targetId && this.tacticListOld[i].targetType == elemTactic.targetType) {
            elemTactic.channelTactics = this.tacticListOld
            break
          }
        }
      }
      this.tactic3Open = false
    },
    //策略配置--指定成员配置--根据发送人 选择对应的接收人页面
    tacticConfigOpen(item) {
      console.log(item, "..........策略中当前组织下的某一个发送人")
      this.tacticOrganizationUser = []
      this.tacticSelectUser = item
      this.tacticSelectUserOld = this.tacticSelectUser
      console.log(this.tacticSelectUser, ".......this.tacticSelectUser")
      console.log(this.tacticSelectUserOld, ".......this.tacticSelectUserOld")
      this.tacticUserOrganization = this.tacticUserOrganizationDefault
      let acceptOrganizationIdOld = this.tacticSelectUser.acceptOrganizationId
      if(acceptOrganizationIdOld==null || acceptOrganizationIdOld==0 || acceptOrganizationIdOld==undefined){
        this.tacticSelectOrganization.organizationId = this.tacticUserOrganization[0].organizationId
      }else{
        this.tacticAcceptUserId = this.tacticSelectUser.acceptUserId
        this.tacticSelectOrganization.organizationId = acceptOrganizationIdOld
      }
      let acceptOrganizationNameOld = this.tacticSelectUser.acceptOrganizationName
      if(acceptOrganizationNameOld==null || acceptOrganizationNameOld=="" || acceptOrganizationNameOld==undefined){
        this.tacticSelectOrganization.organizationName = this.tacticUserOrganization[0].organizationName
      }else{
        this.tacticSelectOrganization.organizationName = acceptOrganizationNameOld
      }
      let params = {
        organizationId: this.tacticSelectOrganization.organizationId
      }
      organizationUser(params).then(response => {
        if (response.data) {
          this.tacticOrganizationUser = response.data
          if(this.tacticSelectUser.acceptOrganizationId!=0){

          }
        }
      })
      this.tacticOrganizationUserOpen = true;
      this.isBatch = false;
      // this.tacticSelectUser.acceptUserId = undefined
    },
    //策略配置--指定成员配置--tab点击事件--根据组织id查询成员列表
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
    //策略配置--指定成员配置--根据发送人 选择对应的接收人页面--选中按钮
    selectUser() { //选择用户
      if (this.tacticAcceptUserId == undefined) {
        this.$message.error('请选中接收人')
        return false;
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
      if(!this.isBatch){
        for (let i = 0; i < this.tacticList.length; i++) {
          if (this.tacticList[i].targetId == this.tacticSelectUser.targetId &&
            this.tacticList[i].targetType == this.tacticSelectUser.targetType &&
            this.tacticList[i].sendUserId == this.tacticSelectUser.sendUserId) {
            this.tacticList[i] = this.tacticSelectUser
            console.log(this.tacticList, "..........当前发送人策略回归")
            break
          }
        }
      }
      //批量操作
      if(this.isBatch){
        const {acceptOrganizationId, acceptOrganizationName,acceptUserId,acceptUserName} = this.tacticSelectUser;
        this.tacticList = this.tacticList.map(item=>{
          return({
            ...item,
            acceptOrganizationId,
            acceptOrganizationName,
            acceptUserId,
            acceptUserName,
          })
        })
        console.log(this.tacticList, "..........当前发送人策略回归")
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
    //策略配置--指定成员配置--根据发送人 选择对应的接收人页面--单选事件
    radioSelectUser(e) {
      console.log(e, ".................radioSelectUser")
      this.tacticOrganizationUser.forEach(item => {
        if (e.acceptUserId == item.userId) {
          this.tacticSelectUser.acceptUserName = item.nickName
        }
      })
    },
    //策略配置--指定成员配置--根据发送人 选择对应的接收人页面--取消按钮
    closeSelectUser() {
      for (let i = 0; i < this.tacticList.length; i++) {
        if (this.tacticList[i].sendUserId == this.tacticSelectUserOld.sendUserId && this.tacticList[i]
          .sendOrganizationId == this.tacticSelectUserOld.sendOrganizationId) {
          console.log("取消else")
          this.tacticList[i] = this.tacticSelectUserOld
          console.log(this.tacticList, ".......this.tacticList")
          console.log(this.tacticSelectUser, ".......this.tacticSelectUser")
          console.log(this.tacticSelectUserOld, ".......this.tacticSelectUserOld")
          break
        }
      }
      this.tacticAcceptUserId = undefined
      this.tacticOrganizationUserOpen = false
      console.log(this.tacticSelectUser, ".............取消选择用户")
    },
    //根据推文id 查询表单/活码列表
    getTacticList(tweetId,channelId){
      tacticList({
        tweetId: tweetId,
        channelId: channelId
      }).then(response => {
        this.tweetElemTacticList = response.data;
      });
    },
    //策略配置===结束=======
    //手机管理端===开始=======
    //手机管理端配置--渠道新增时
    handleSysImage(row){
      console.log("row=====",row)
      this.currentIndex = row.index
      this.imageFormReset();
      if(row.channelType==undefined || row.channelType=='undefined' || row.channelType=='' || row.channelType==null){
        this.$modal.msgError('请先选择渠道类型')
        return false;
      }else{
        this.imageForm.channelType = row.channelType
      }
      let item = this.channelList[this.currentIndex];

      this.imageForm.editType = 0
      this.imageForm.tweetSysImg = row.tweetSysImg,
      this.imageForm.tweetWxImg = row.tweetWxImg,
      this.imageForm.tweetPyqImg = row.tweetPyqImg,

      this.imageForm.tweetText = row.tweetText
      this.imageForm.pyqText = row.pyqText
      this.imageForm.shareText = row.shareText
      this.imageForm.shareTitle = row.tweetTitle
      this.imageForm.saleText = row.saleText

      this.imageForm.imgType = row.imgType
      if(row.sysImg!=null){
        this.imageForm.sysImg = row.sysImg
      }
      if(row.wxImg!=null){
        this.imageForm.wxImg = row.wxImg
      }
      if(row.pyqImg!=null){
        this.imageForm.pyqImg = row.pyqImg
      }
      this.openSysImage = true
    },
    //手机管理端配置--渠道修改时
    handleSysImageUpdate(parentRow,row){
      this.tweetId = parentRow.tweetId
      this.tweetTitle = parentRow.tweetTitle
      this.organizationName = row.organizationName
      this.parentRow = parentRow
      if(parentRow.sysImg!=null){
        this.tweetSysImg = parentRow.sysImg
      }
      if(parentRow.wxImg!=null){
        this.tweetWxImg = parentRow.wxImg
      }
      if(parentRow.pyqImg!=null){
        this.tweetPyqImg = parentRow.pyqImg
      }

      if(parentRow.shareButton!=null && parentRow.shareButton!=''){
        this.tweetShareButton = parentRow.shareButton
        this.tweetShareButtonArray = parentRow.shareButton.split(",")
      }
      this.imageFormReset()
      if(row.channelType==undefined || row.channelType=='undefined' || row.channelType=='' || row.channelType==null){
        this.$modal.msgError('请先选择渠道类型')
        return false;
      }else{
        this.imageForm.channelType = row.channelType
      }
      if(row.tweetText!=null && row.tweetText!=''){
        this.imageForm.tweetText = row.tweetText
      }else if(parentRow.tweetText!=null && parentRow.tweetText!=''){
        this.imageForm.tweetText = parentRow.tweetText
      }
      if(row.pyqText!=null && row.pyqText!=''){
        this.imageForm.pyqText = row.pyqText
      }else if(parentRow.pyqText!=null && parentRow.pyqText!=''){
        this.imageForm.pyqText = parentRow.pyqText
      }
      if(row.shareText!=null && row.shareText!=''){
        this.imageForm.shareText = row.shareText
      }else if(parentRow.shareText!=null && parentRow.shareText!=''){
        this.imageForm.shareText = parentRow.shareText
      }
      if(row.shareTitle!=null && row.shareTitle!=''){
        this.imageForm.shareTitle = row.shareTitle
      }else if(parentRow.tweetTitle!=null && parentRow.tweetTitle!=''){
        this.imageForm.shareTitle = parentRow.tweetTitle
      }
      if(row.saleText!=null && row.saleText!=''){
        this.imageForm.saleText = row.saleText
      }else if(parentRow.saleText!=null && parentRow.saleText!=''){
        this.imageForm.saleText = parentRow.saleText
      }
      
      this.imageForm.tweetSysImg = this.tweetSysImg
      this.imageForm.tweetWxImg = this.tweetWxImg
      this.imageForm.tweetPyqImg = this.tweetPyqImg
      this.imageForm.channelId = row.channelId
      let params = {
        channelId: row.channelId,
        isSelectElem: false
      }
      tweetChannelInfo(params).then(response => {
        if (response) {
          let item = response.data
          this.imageForm.editType = 3

          this.imageForm.imgType = item.imgType
          if(item.sysImg!=null){
            this.imageForm.sysImg = item.sysImg
          }
          if(item.wxImg!=null){
            this.imageForm.wxImg = item.wxImg
          }
          if(item.pyqImg!=null){
            this.imageForm.pyqImg = item.pyqImg
          }
          this.openSysImage = true
        }
      })
    },
    //手机管理端配置form 重置
    imageFormReset(){
      this.imageForm = {
        channelType:'',
        pyqText:'',
        shareText:'',
        shareTitle:'',
        saleText:'',
        tweetText:'',
        channelId:undefined,
        editType:3,
        imgType: '',
        tweetSysImgId: undefined,
        tweetWxImgId: undefined,
        tweetPyqImgId: undefined,
        tweetSysImg: this.defaultImg,
        tweetWxImg: this.defaultImg,
        tweetPyqImg: this.defaultImg,
        sysImgId: undefined,
        wxImgId: undefined,
        pyqImgId: undefined,
        sysImg: this.defaultImg,
        wxImg: this.defaultImg,
        pyqImg: this.defaultImg,
      }
    },
    //手机管理端配置--取消按钮
    sysImageCancel(){
      this.currentIndex = undefined
      this.imageFormReset()
      this.openSysImage = false
    },
    //手机管理端配置--确定按钮
    saveSysImage(){
      if(this.imageForm.editType==0){
        //新增
        let i = this.currentIndex
        this.channelList[i].tweetText = this.imageForm.tweetText
        this.channelList[i].pyqText = this.imageForm.pyqText
        this.channelList[i].shareText = this.imageForm.shareText
        this.channelList[i].shareTitle = this.imageForm.shareTitle
        this.channelList[i].saleText = this.imageForm.saleText

        this.channelList[i].imgType = this.imageForm.imgType
        this.channelList[i].sysImgId = this.imageForm.sysImg.fileId
        this.channelList[i].wxImgId = this.imageForm.wxImg.fileId
        this.channelList[i].pyqImgId = this.imageForm.pyqImg.fileId
        this.channelList[i].sysImg = this.imageForm.sysImg
        this.channelList[i].wxImg = this.imageForm.wxImg
        this.channelList[i].pyqImg = this.imageForm.pyqImg
        this.channelList[i].tweetSysImgId = this.imageForm.tweetSysImg.fileId
        this.channelList[i].tweetWxImgId = this.imageForm.tweetWxImg.fileId
        this.channelList[i].tweetPyqImgId = this.imageForm.tweetPyqImg.fileId
        this.channelList[i].tweetSysImg = this.imageForm.tweetSysImg
        this.channelList[i].tweetWxImg = this.imageForm.tweetWxImg
        this.channelList[i].tweetPyqImg = this.imageForm.tweetPyqImg
        let msg = this.checkImg(this.channelList[i])
        if(msg!=""){
          this.$message.error(msg)
          return
        }
        this.openSysImage = false
      }else{
        //修改
        let item = this.imageForm;
        if(item.channelId==undefined || item.channelId=='undefined' || item.channelId=='' || item.channelId==null){
          this.$modal.msgError('渠道id参数丢失,请重新打开页面')
          return;
        }
        let msg = this.checkImg(item);
        if(msg!=""){
          this.$message.error(msg)
          return;
        }else{
          this.imageForm.tweetText = this.imageForm.tweetText
          this.imageForm.pyqText = this.imageForm.pyqText
          this.imageForm.shareText = this.imageForm.shareText
          this.imageForm.shareTitle = this.imageForm.shareTitle
          this.imageForm.saleText = this.imageForm.saleText

          this.imageForm.tweetSysImgId = this.imageForm.tweetSysImg.fileId
          this.imageForm.tweetWxImgId = this.imageForm.tweetWxImg.fileId
          this.imageForm.tweetPyqImgId = this.imageForm.tweetPyqImg.fileId
          this.imageForm.sysImgId = this.imageForm.sysImg.fileId
          this.imageForm.wxImgId = this.imageForm.wxImg.fileId
          this.imageForm.pyqImgId = this.imageForm.pyqImg.fileId
          this.imageForm.updateOrganizationId = this.sessionOrgId
          tweetChannelUpdate(this.imageForm).then(response => {
            this.$modal.msgSuccess('修改成功')
            this.openSysImage = false
            this.imageFormReset()
            //刷新渠道列表
            this.loadingChannel = true;
            tweetChannelList({
              pageNum: 1,
              pageSize: 1000,
              tweetId: this.parentRow.tweetId,
              organizationId: this.sessionOrgId
            }).then(response => {
              this.parentRow.tweetChannels = response.rows;
              this.loadingChannel = false;
            });
          })
        }
      }
    },

    //手机管理端配置检查
    checkImg(channel){
      let msg = "";
      if(channel.imgType=='0'){
        if(channel.tweetSysImg.fileId==undefined || channel.tweetSysImg.fileId==null || channel.tweetSysImg.fileId==''){
          msg = "请在生产库中配置推文手机管理端展架图";
        }
        if(channel.tweetWxImg.fileId==undefined || channel.tweetWxImg.fileId==null || channel.tweetWxImg.fileId==''){
          msg = "请在生产库中配置推文微信小程序封面";
        }
        if(channel.tweetPyqImg.fileId==undefined || channel.tweetPyqImg.fileId==null || channel.tweetPyqImg.fileId==''){
          msg = "请在生产库中配置推文朋友圈海报";
        }
      }else if(channel.imgType=='1'){
        if(channel.sysImg.fileId==undefined || channel.sysImg.fileId==null || channel.sysImg.fileId==''){
          msg = "请配置渠道下手机管理端展架图";
        }
        if(channel.wxImg.fileId==undefined || channel.wxImg.fileId==null || channel.wxImg.fileId==''){
          msg = "请配置渠道下微信小程序封面";
        }
        if(channel.pyqImg.fileId==undefined || channel.pyqImg.fileId==null || channel.pyqImg.fileId==''){
          msg = "请配置渠道下朋友圈海报";
        }
      }else{
        msg = "请配置手机管理端";
      }
      return msg;
    },
    //策略配置检查
    checkTactic(item){
      if(item.shareRules==undefined || item.shareRules=='undefined' || item.shareRules=='' || item.shareRules==null){
        return msg = "分发规则不能为空"
      }
      if(item.shareRules=='1' && (item.shareOrgId==undefined || item.shareOrgId=='undefined' || item.shareOrgId=='' ||
        item.shareOrgId==null || item.shareUserId==undefined || item.shareUserId=='undefined' || item.shareUserId=='' ||
        item.shareUserId==null)){
          return msg = "指定分发人不能为空"
      }
      console.log("elemTacticList",item.elemTacticList)
      let msg = "";
      if(item.elemTacticList!=null && item.elemTacticList.length!=0){
        for (let i = 0; i < item.elemTacticList.length; i++) {
          let element = item.elemTacticList[i];
          if(element.targetType == 'SCENE_LIVE_CODE'){
            if(element.tacticType=='3' && (element.channelTactics==null || element.channelTactics.length==0)){
              msg = "请配置活码策略组下 指定成员的策略";
              break
            }
            if(element.tacticType=='7' && (element.channelLiveCodeAppointOrg==null || element.channelLiveCodeAppointOrg==undefined)){
              msg = "请配置活码策略组下 选择指定组织活码";
              break
            }
            if(this.liveCodeShowTypeArray.includes(element.tacticType) && (element.channelLiveCodeShowType==null || element.channelLiveCodeShowType==undefined)){
              msg = "请配置活码策略组下 选择活码类型，个人微信或者企业微信";
              break
            }
            if(element.channelLiveCodeType=='2' && (element.channelLiveCodeImgId=='' || element.channelLiveCodeImgId==null || element.channelLiveCodeImgId==undefined)){
              msg = "请配置渠道下自定义活码";
              break
            }
          }else{
            if(element.tacticType==null || element.tacticType=='' || element.tacticType==undefined){
              msg = "请配置表单策略组";
              break
            }
            if(element.tacticType=='3' && (element.channelTactics==null || element.channelTactics.length==0)){
              msg = "请配置表单策略组下 指定成员的策略";
              break
            }

            if(element.channelSkipConfigType==null || element.channelSkipConfigType=='' || element.channelSkipConfigType==undefined){
              msg = "请配置表单结果页";
              break
            }

            if(element.channelSkipConfigType=='0' && (this.form_result_img_url=='' || this.form_result_img_url==null)){
              msg = "请在系统中配置默认的表单结果页";
              break
            }
            if(element.channelSkipConfigType=='1' && (element.skipImgId=='' || element.skipImgId==null || element.skipImgId==undefined)){
              msg = "请在生产库中配置表单结果页";
              break
            }
            if(element.channelSkipConfigType=='2' && (element.channelSkipImgId=='' || element.channelSkipImgId==null || element.channelSkipImgId==undefined)){
              msg = "请配置渠道下表单结果页";
              break
            }
          }
        }
      }
      return msg;
    },

    //手机管理端===结束=======
    //展示图 文件上传
    handleAvatarSuccess(res, file, source, item) {
      if(res.code!=200){
        this.$message.error(res.msg)
        return;
      }else{
        if (source == 'DISPLAY_CHANNEL_PYQ_IMG') {
          this.imageForm.pyqImg = res.data
        } else if (source == 'DISPLAY_CHANNEL_SYS_IMG') {
          this.imageForm.sysImg = res.data
        } else if (source == 'DISPLAY_CHANNEL_WX_IMG') {
          this.imageForm.wxImg = res.data
        } else if (source == 'DISPLAY_CHANNEL_SKIP_IMG') {
          for (let i = 0; i < this.tacticForm.elemTacticList.length; i++) {
            let elemTactic = this.tacticForm.elemTacticList[i]
            if (elemTactic.targetId == item.targetId && elemTactic.targetType == item.targetType) {
              this.$nextTick(() => {
                item.channelSkipImgId = res.data.fileId
                item.channelSkipImg = res.data
              })
              console.log(this.tacticForm.elemTacticList, ".............")
              break
            }
          }
        } else if (source == 'SCENE_LIVE_CODE_IMAGE') {
          for (let i = 0; i < this.tacticForm.elemTacticList.length; i++) {
            let elemTactic = this.tacticForm.elemTacticList[i]
            if (elemTactic.targetId == item.targetId && elemTactic.targetType == item.targetType) {
              this.$nextTick(() => {
                item.channelLiveCodeImgId = res.data.fileId
                item.channelLiveCodeImg = res.data
              })
              console.log(this.tacticForm.elemTacticList, ".............")
              break
            }
          }
        }
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
    delImg(val){
      if(val == 'DISPLAY_CHANNEL_SYS_IMG'){
        this.imageForm.sysImg.fileId = undefined
        this.imageForm.sysImg.fileOriginalName = ''
        this.imageForm.sysImg.fileVirtualPath = ''
      } else if(val == 'DISPLAY_CHANNEL_WX_IMG'){
        this.imageForm.wxImg.fileId = undefined
        this.imageForm.wxImg.fileOriginalName = ''
        this.imageForm.wxImg.fileVirtualPath = ''
      } else if(val == 'DISPLAY_CHANNEL_PYQ_IMG'){
        this.imageForm.pyqImg.fileId = undefined
        this.imageForm.pyqImg.fileOriginalName = ''
        this.imageForm.pyqImg.fileVirtualPath = ''
      }
    },

    // 删除渠道
    deleteChannel(index) {
      this.channelList.splice(index, 1);
      this.channelList = this.channelList.map((item,i)=>{
          return {
            ...item,
            index:i
          }
        })
    },

    addChannelSubmit() {
      let flag = true;
      this.channelList[this.currentIndex]
      console.log(this.channelList,"this.channelList")
      for (let index = 0; index < this.channelList.length; index++) {
        const item = this.channelList[index];
        if(item.tweetId==undefined || item.tweetId=='undefined' || item.tweetId=='' || item.tweetId==null){
          this.$modal.msgError('推文id参数丢失,请重新打开页面')
          flag = false;
          break;
        }
        if(item.channelType==undefined || item.channelType=='undefined' || item.channelType=='' || item.channelType==null){
          this.$modal.msgError('渠道类型不能为空')
          flag = false;
          break;
        }
        let msg = this.checkImg(item)
        if(msg!=""){
          this.$message.error(msg)
          flag = false;
          break;
        }
        msg = this.checkTactic(item)
        if(msg!=""){
          this.$message.error(msg)
          flag = false;
          break;
        }
      }
      if(flag){
        tweetChannelAddBatch(this.channelList).then(response => {
          this.$modal.msgSuccess('新增成功')
          this.openAddChannel = false
          this.channelList=[]
          this.tweetId = undefined
          //刷新渠道列表
          this.loadingChannel = true;
          tweetChannelList({
            pageNum: 1,
            pageSize: 1000,
            tweetId: this.parentRow.tweetId,
            organizationId: this.sessionOrgId
          }).then(response => {
            this.parentRow.tweetChannels = response.rows;
            this.loadingChannel = false;
            this.addChannelCancel();
            this.publicTweetClose();
          });
        })
      }
    },
    addChannelCancelButton(){
      if(this.openPublicTweet==false){
        this.addChannelCancel()
      }else{
        this.channelList=[]
        this.openAddChannel = false
      }
    },
    addChannelCancel() {
      this.parentRow = undefined
      this.channelList=[]
      this.tweetId = undefined
      this.imageFormReset()
      this.tweetShareButton = ''
      this.tweetShareButtonArray = ['pyq','wx','wxcode','wximg','share','sale']
      this.tweetText = ''
      this.pyqText = ''
      this.shareText = ''
      this.shareTitle = ''
      this.saleText = ''
      this.tweetSysImg = this.defaultImg
      this.tweetWxImg = this.defaultImg
      this.tweetPyqImg = this.defaultImg
      this.openAddChannel = false
    },
    // 修改渠道
    handleUpdateChannel(parentRow,row) {
      this.parentRow = parentRow
      this.tweetChannelReset();
      const channelId = row.channelId
      let params = {
        channelId: channelId,
        isSelectElem: false
      }
      tweetChannelInfo(params).then(response => {
        if (response) {
          this.tweetChannelForm = response.data
          this.tweetChannelForm.editType = 1
          this.openUpdateChannel = true
        }
      })
    },
    // 修改渠道 取消按钮
    updateChannelCancel() {
      this.parentRow = undefined
      this.openUpdateChannel = false
      this.tweetChannelReset()
    },
    // 修改渠道 form重置
    tweetChannelReset() {
      this.tweetChannelForm = {
        channelId: undefined,
        tweetId: undefined,
        organizationId: this.sessionOrgId,
        channelType: '',
        channelName: '',
        channelCode: '',
        editType: 1,
      }
    },
    // 修改渠道 确定按钮
    updateChannelSubmit() {
      let item = this.tweetChannelForm;
      if(item.tweetId==undefined || item.tweetId=='undefined' || item.tweetId=='' || item.tweetId==null){
        this.$modal.msgError('推文id参数丢失,请重新打开页面')
        return;
      }
      if(item.channelType==undefined || item.channelType=='undefined' || item.channelType=='' || item.channelType==null){
        this.$modal.msgError('渠道类型不能为空')
        return;
      }
      this.$refs['tweetChannelForm'].validate(valid => {
        if (valid) {
          this.tweetChannelForm.updateOrganizationId = this.sessionOrgId
          tweetChannelUpdate(this.tweetChannelForm).then(response => {
            this.$modal.msgSuccess('修改成功')
            this.openUpdateChannel = false
            this.tweetChannelReset()
            //刷新渠道列表
            this.loadingChannel = true;
            tweetChannelList({
              pageNum: 1,
              pageSize: 1000,
              tweetId: this.parentRow.tweetId,
              organizationId: this.sessionOrgId
            }).then(response => {
              this.parentRow.tweetChannels = response.rows;
              this.loadingChannel = false;
            });
          })
        }
      })
    },
    // 删除渠道
    handleDeleteChannel(parentRow,row) {
      let params = {
        channelId: row.channelId
      }
      this.$modal.confirm('"'+parentRow.tweetTitle + '"推文删除后会影响到已分发推文内容，影响前端用户体验！！！').then(function() {
        return tweetChannelRemove(params)
      }).then(() => {
        //刷新渠道列表
        this.loadingChannel = true;
        tweetChannelList({
          pageNum: 1,
          pageSize: 1000,
          tweetId: parentRow.tweetId,
          organizationId: this.sessionOrgId
        }).then(response => {
          parentRow.tweetChannels = response.rows;
          this.loadingChannel = false;
        });
        this.$modal.msgSuccess('删除成功')
      }).catch((e) => {
        console.log(e)
      })
    },
    //上下架按钮
    handleUpdateStatus(parentRow,row,status) {
      let params = {
        channelId: row.channelId,
        status:status,
        updateOrganizationId:this.sessionOrgId
      }
      let tip = '';
      if(status=='E'){
        tip = '"'+parentRow.tweetTitle + '"推文将上架';
      }else if(status=='J'){
        tip = '"'+parentRow.tweetTitle + '"推文下架后会影响到已分发推文内容，影响前端用户体验！！！';
      }
      this.$modal.confirm(tip).then(function() {
        return tweetChannelUpdateStatus(params)
      }).then(() => {
        //刷新渠道列表
        this.loadingChannel = true;
        tweetChannelList({
          pageNum: 1,
          pageSize: 1000,
          tweetId: parentRow.tweetId,
          organizationId: this.sessionOrgId
        }).then(response => {
          parentRow.tweetChannels = response.rows;
          this.loadingChannel = false;
        });
        this.$modal.msgSuccess('操作成功')
      }).catch((e) => {
        console.log(e)
      })
    },
    // 推文分发
    handleTweetShare(parentRow,row) {
      this.channelType = row.channelType
      this.shareUserName = row.shareUserName
      this.shareRules = row.shareRules
      this.getConfigKey('tweet_share_url').then(response => {
        let phone = sessionStorage.getItem('userPhone')
        console.log(window.btoa(phone));
        // console.log(window.atob(window.btoa(sessionStorage.getItem('userPhone'))));
        // let url = response.msg + '?code=' + parentRow.tweetCode + '&pp=' + encodeURIComponent(window.btoa(phone)) + "&sid="
	      let url = response.msg + '?channelType='+row.channelType+'&code=' + parentRow.tweetCode + '&pp=' + encodeURIComponent(window.btoa(phone)) + "&sid="
        let tweetShareForm = {
          channelId:row.channelId,
          tweetId:parentRow.tweetId,
          shareUrl:url,
          phone:phone,
          organizationId:this.sessionOrgId,
          shareSource:'pc-channel'
        }
        tweetShareAdd(tweetShareForm).then(response => {
          if(response.code==200){
            this.tweetShareId = response.data.shareId
            if(this.tweetShareId!=null){
              url = url + encodeURIComponent(window.btoa(this.tweetShareId))
              if(row.channelType=='dy' || row.channelType=='wx'){
                url = url + '&{{unionid}}'
              }
              if(!this.$refs.qrCode){
                setTimeout(()=>{
                  this.$refs.qrCode.updateCode(url)
                },500)
              }else{
                this.$refs.qrCode.updateCode(url)
              }
              if(!this.$refs.tweetShow){
                setTimeout(()=>{
                  this.$refs.tweetShow.getData(url)
                },500)
              }else{
                this.$refs.tweetShow.getData(url)
              }
              this.shareUrl = url
              this.tweetShare = true
            }else{
              this.$modal.msgError("请刷新页面重试");
            }
          }else{
            this.$modal.msgError("请刷新页面重试");
          }
        })
      })
    },
    // 推文分发取消按钮
    tweetShareCancel(){
      this.tweetShare = false
      this.tweetShareId = undefined
      this.shareUrl = undefined
      this.channelType = undefined
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
    copyShareUrl(data) {
      // 存储传递过来的数据
      let OrderNumber = data
      // 创建一个input 元素
      // createElement() 方法通过指定名称创建一个元素
      let newInput = document.createElement('input')
      // 讲存储的数据赋值给input的value值
      newInput.value = OrderNumber
      // appendChild() 方法向节点添加最后一个子节点。
      document.body.appendChild(newInput)
      // 选中input元素中的文本
      // select() 方法用于选择该元素中的文本。
      newInput.select()
      // 执行浏览器复制命令
      //  execCommand方法是执行一个对当前文档，当前选择或者给出范围的命令
      document.execCommand('Copy')
      // 清空输入框
      newInput.remove()
      // 下面是element的弹窗 不需要的自行删除就好
      this.$message({
        type: 'success',
        message: '复制成功'
      })
    },
    abc(data) {
      console.log(data)
    },
  }
}
</script>

<style scoped>
  .copyShareUrl{
    margin: 10px auto;
    width: 150px;
    display: flex;
    justify-content: center;
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
  .flex-column {
    flex-direction: column;
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
  .ml-2 {
    margin-left: 20px;
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
  .font-14 {
    font-size: 14px !important;
  }
  .center-board-row {
    padding: 10px;
    box-sizing: border-box;
	}
  .formP{
    .el-radio:last-child {
      margin-left: 100px;
    }
  }
  .channel{
    background-color: aliceblue;
    border: 1px solid #dcdfe6;
    border-radius: 3px;
    margin-bottom: 12px;
    .el-form-item{
      margin-bottom:10px;
      .el-form-item__label{
        width: 80px;
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
</style>

<style>
	.tweet-preview-dialog .el-dialog__body{
		padding: 10px 20px;
	}
  .configuration-dialog .el-dialog__body{
		padding: 0 10px;
	}
  .configuration-dialog .el-dialog__footer{
    text-align: center;
  }
</style>
