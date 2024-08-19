<template>
  <el-row>
    <el-row>
      <el-input v-model="uuid" placeholder="用户名称"></el-input>
    </el-row>
    <el-row>
      <el-input type="number" v-model="tweetId" placeholder="推文id"></el-input>
    </el-row>
    <el-row>
    </el-row>
    <el-row>
      <el-button @click="getTweetSort()">查询</el-button>
    </el-row>
    <div v-for="item in elemList">
      <el-row :gutter="100" class="mb8">
        <el-col :span="24">
          <div v-if="item.targetType == 'MEDIA_IMAGE'">
            <div>媒资图片</div>
            <div>元素提示：{{ item.warning }}</div>
            <div>容器id：{{ item.containerId }}</div>
            <div>元素id：{{ item.elemId }}</div>
            <div>目标id：{{ item.targetId }}</div>
            <img :src="item.target.compressionFile.fileVirtualPath" style="height: 100px;width: 200px">
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="100" class="mb8">
        <el-col :span="24">
          <div v-if="item.targetType == 'MEDIA_VIDEO'">
            <div>媒资视频</div>
            <div>元素提示：{{ item.warning }}</div>
            <div>容器id：{{ item.containerId }}</div>
            <div>元素id：{{ item.elemId }}</div>
            <div>目标id：{{ item.targetId }}</div>
            <video :src="item.target.file.fileVirtualPath" controls="controls" style="height: 100px;width: 200px"
            ></video>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="100" class="mb8">
        <el-col>
          <div v-if="item.targetType == 'MEDIA_TEXT'">
            <div>媒资文案</div>
            <div>元素提示：{{ item.warning }}</div>
            <div>容器id：{{ item.containerId }}</div>
            <div>元素id：{{ item.elemId }}</div>
            <div>目标id：{{ item.targetId }}</div>
            <div>
              <el-row>
                {{ item.target.textTitle }}
              </el-row>
              <el-row>
                {{ item.target.textContent }}
              </el-row>
            </div>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="100" class="mb8">
        <el-col :span="24">
          <div v-if="item.targetType == 'PRODUCT_COUPON'">
            <div>优惠券</div>
            <div>元素提示：{{ item.warning }}</div>
            <div>容器id：{{ item.containerId }}</div>
            <div>元素id：{{ item.elemId }}</div>
            <div>目标id：{{ item.targetId }}</div>
            <div>{{ item.target.couponName }}</div>
            <img :src="item.target.couponBgFile.fileVirtualPath" alt="" style="height: 100px;width: 200px">
            <el-button type="primary" @click="clickExecute(item.elemId,item.targetType,item.targetId)">领券</el-button>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="300" class="mb8">
        <el-col :span="24">
          <div v-if="item.targetType == 'SCENE_FORM'">
            <div>场景表单</div>
            <div>元素提示：{{ item.warning }}</div>
            <div>容器id：{{ item.containerId }}</div>
            <div>元素id：{{ item.elemId }}</div>
            <div>目标id：{{ item.targetId }}</div>
            <div>
              <div>
                <div class="active-area">
                  <div style="width: 85%;margin: 0px auto;display: block;padding: 0px 5px;">
                    <label style="color: #606266;text-align: left;font-size: 15px;">表单名称：{{item.target.title}}</label>
                    <br/>
                    <label style="color: #606266;text-align: left;font-size: 15px;">
                      <span v-show="item.target.status=='D'" style="color:red;display: block;margin-top: 10px;">状态：删除</span>
                      <span v-show="item.target.status=='J'" style="color:red;display: block;margin-top: 10px;">状态：停用</span>
                    </label>
                  </div>
                  <div style="width: 85%;margin: 0px auto;display: flex;justify-content: left;  padding: 0px 5px;" 
                    v-show="item.target.tipInfo!=null && item.target.tipInfo!='' && item.target.showTweet=='1'" >
                      <span v-html="item.target.tipInfo"></span>
                  </div>

                  <!-- 类型：0字符串 1文本 2单选 3多选 4下拉 5评分 6日期 7日期范围 8地址 9短信验证码 -->
                  <div v-for="item2 in item.target.elementList"
                       style="display:flex;justify-content: left;margin: 0 auto;width: 85%;"
                  >
                    <label style="width: 105px;display: inline-block; padding: 15px 5px;text-align: left;">
                      {{ item2.name }}
                      <span v-if="item2.isRequired==1" style="color:red">*</span>
                      :
                    </label>
                    <input class="phone-input"
                           style="margin:15px 0;width: 60%;padding-left: 20px;text-align: left;"
                           v-if="item2.type=='0'"
                    />

                    <textarea rows="5" cols="20" class="textarea"
                              style="margin:15px 0;width: 69%;padding: 10px;text-align: left;"
                              v-if="item2.type==1"
                    >
                    </textarea>

                    <el-radio-group style="margin:15px 0;text-align: left;min-width: 71%;"
                                    v-if="item2.type==2 && item2.optionList != null && item2.optionList.length!=0 " v-model="item.value"
                    >
                      <el-radio style="display:block;height: 25px;"
                                v-for="option2 in item2.optionList"
                                :key="option2.val"
                                :label="option2.name"
                      >{{ option2.name }}
                      </el-radio>
                    </el-radio-group>

                    <el-checkbox-group style="margin:15px 0;text-align: left;margin-left: 15px;min-width: 71%;"
                                       v-model="formChecked"
                                       v-if="item2.type==3 && item2.optionList != null && item2.optionList.length!=0 "
                    >
                      <el-checkbox
                        style="display:block;height: 25px;"
                        v-for="option3 in item2.optionList"
                        :label="option3.name"
                        :value="option3.val"
                      >{{ option3.name }}
                      </el-checkbox>
                    </el-checkbox-group>

                    <el-select style="margin:15px 0;" v-model="formSelected"
                               v-if="item2.type==4 && item2.optionList != null && item2.optionList.length!=0 " clearable filterable placeholder="请选择"
                    >
                      <el-option
                        v-for="option4 in item2.optionList"
                        :key="option4.val"
                        :label="option4.name"
                        :value="option4.val"
                      />
                    </el-select>

                    <el-rate
                      style="padding: 15px 5px;"
                      v-model="valueRate"
                      :max="item2.maxNum!=null ? item2.maxNum : 5"
                      :colors="colors"
                      v-if="item2.type==5"
                    >
                    </el-rate>

                    <el-date-picker
                      style="width: 180px;margin:15px 0;"
                      v-model="valueDate1"
                      type="date"
                      placeholder="请选择日期"
                      format="yyyy-MM-dd"
                      value-format="yyyy-MM-dd"
                      v-if="item2.type==6 && item2.dateFormat==1"
                    >
                    </el-date-picker>
                    <el-time-picker
                      style="width: 180px;margin:15px 0;"
                      v-model="valueDate2"
                      placeholder="请选择时间"
                      format="HH:mm"
                      value-format="HH:mm"
                      v-if="item2.type==6 && item2.dateFormat==2"
                    >
                    </el-time-picker>
                    <el-date-picker
                      style="width: 180px;margin:15px 0;"
                      v-model="valueDate3"
                      type="datetime"
                      placeholder="请选择日期时间"
                      format="yyyy-MM-dd HH:mm"
                      value-format="yyyy-MM-dd HH:mm"
                      v-if="item2.type==6 && item2.dateFormat==3"
                    >
                    </el-date-picker>

                    <el-date-picker
                      style="margin:15px 0;"
                      v-model="valueDate4"
                      type="daterange"
                      range-separator="至"
                      start-placeholder="开始日期"
                      end-placeholder="结束日期"
                      format="yyyy-MM-dd"
                      value-format="yyyy-MM-dd"
                      v-if="item2.type==7 && item2.dateFormat==1"
                    >
                    </el-date-picker>
                    <el-time-picker
                      style="margin:15px 0;"
                      is-range
                      v-model="valueDate5"
                      range-separator="至"
                      start-placeholder="开始时间"
                      end-placeholder="结束时间"
                      format="HH:mm"
                      value-format="HH:mm"
                      v-if="item2.type==7 && item2.dateFormat==2"
                    >
                    </el-time-picker>
                    <el-date-picker
                      style="margin:15px 0;"
                      v-model="valueDate6"
                      type="datetimerange"
                      range-separator="至"
                      start-placeholder="开始日期"
                      end-placeholder="结束日期"
                      format="yyyy-MM-dd HH:mm"
                      value-format="yyyy-MM-dd HH:mm"
                      v-if="item2.type==7 && item2.dateFormat==3"
                    >
                    </el-date-picker>
                  </div>
                </div>
              </div>
            </div>
            <el-button type="primary" @click="clickExecute(item.elemId,item.targetType,item.targetId)">表单填写</el-button>
          </div>
        </el-col>
      </el-row>
    </div>

  </el-row>

</template>

<script>
import { execute, tweetSort } from '../../../api/system/production/monifenfa'

export default {
  name: 'monifenfa',
  data() {
    return {
      elemList: [],
      uuid: '',
      tweetId: undefined,

      //默认值
      formSelected: '',
      formChecked: [],
      valueRate: 3,
      valueDate1: null,
      valueDate2: null,
      valueDate3: null,
      valueDate4: null,
      valueDate5: null,
      valueDate6: null,
      //评分颜色
      colors: ['#99A9BF', '#F7BA2A', '#FF9900']
    }
  },
  created() {
  },
  activated() {
  },
  methods: {

    getTweetSort() {
      let params = {
        tweetId: this.tweetId
      }
      tweetSort(params).then(response => {
        this.elemList = response.data
        console.dir(response)
      })

    },
    clickExecute(elemId, targetType, targetId) {
      let params = {
        uuid: this.uuid,
        tweetId: this.tweetId,
        elemId: elemId,
        targetType: targetType,
        targetId: targetId
      }
      execute(params).then(response => {
        console.log(response)
        if (response.code == 200) {
          this.$message.success(response.msg)
        }
        if (response.code == 500) {
          this.$message.error(response.msg)
        }
      })
    }
  }
}
</script>

<style>

</style>
