<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :rules="rulesOption">
      <el-form-item label="调用接口" prop="interface">
        <el-select
          v-model="queryParams.interface"
          placeholder="请选择调用接口"
          clearable
          style="width: 208px"
          @change="interfaceChange"
        >
          <el-option
            v-for="dict in interfaces"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="入参模板" prop="inParamsShow">
        <el-input v-model="queryParams.inParamsShow" type="textarea" />
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          icon="el-icon-search"
          size="mini"
          @click="handleQuery"
          >查询</el-button
        >
      </el-form-item>
      <el-form-item label="出参">
        <el-input v-model="outParams" type="textarea" />
      </el-form-item>
    </el-form>
    <!--列表-->
  </div>
</template>

<script>
import { orderListByCoupon } from "@/api/system/douyinOrder/order";
import { getsceneLiveCodeList } from "../../../api/tool/tweetArticle.js";
import {
  tweetList,
  tweetDetail,
  tweetShare,
} from "../../../api/system/mobileApp/index";
import {
  selectCustomerReport,
  selectCustomerReportRealTime,
  selectCustomerReportTrackStatus,
  selectCustomerReportTemplateType,
} from "../../../api/system/share/tweetReport";
import {
  mbTypeListByOrganizationId,
  mbTypeListByOrganizationId2,
  mbTypeListByManage,
  mbOptionListByOrganizationId,
  mbOptionListByManage,
} from "../../../api/system/mb/mb";
import {
  forwardUser,
  updateStatus,
  customerList,
  customerElementList,
} from "../../../api/system/customer/index";
import {
  organizationUser,
  manageUserOrganization,
} from "../../../api/system/production/tweet";
import { getSignRecord } from "@/api/system/scene/signInfo";
import { getFormRecord } from "@/api/system/scene/formInfo";
export default {
  name: "index",
  data() {
    return {
      interfaces: [
        {
          value: "1",
          label: "微信端推文列表",
        },
        {
          value: "2",
          label: "微信端推文详情",
        },
        {
          value: "3",
          label: "微信端推文分发",
        },
        {
          value: "4",
          label: "手机端订单查询",
        },
        {
          value: "5",
          label: "手机端订单受理",
        },
        {
          value: "6",
          label: "手机端订单甩单--查询组织",
        },
        {
          value: "7",
          label: "手机端订单甩单--查询用户",
        },
        {
          value: "8",
          label: "手机端订单甩单",
        },
        {
          value: "9",
          label: "表单详情",
        },
        {
          value: "10",
          label: "签到详情",
        },
        {
          value: "11",
          label: "手机端数据看板",
        },
        {
          value: "12",
          label: "查询组织下模板类型",
        },
        {
          value: "13",
          label: "查询纳管下模板类型",
        },
        {
          value: "14",
          label: "查询组织下跟踪状态列表",
        },
        {
          value: "15",
          label: "查询纳管下跟踪状态列表",
        },
        {
          value: "16",
          label: "手机端数据看板--实时数据",
        },
        {
          value: "17",
          label: "手机端订单列表--跟踪状态列表",
        },
        {
          value: "18",
          label: "手机端订单列表--产品模板类型列表",
        },
        {
          value: "19",
          label: "新增推文时 查询活码列表",
        },
        {
          value: "20",
          label: "根据核销码查询抖店订单列表",
        },
      ],
      // 校验
      rulesOption: {
        interface: [
          { required: true, message: "调用接口不能为空", trigger: "blur" },
        ],
      },
      queryParams: {
        inParamsShow: "",
        interface: "",
      },
      organizationId: sessionStorage.getItem("organizationId"),
      outParams: "",
    };
  },
  mounted() {},
  methods: {
    interfaceChange() {
      this.queryParams.inParamsShow = "";
      this.outParams = "";
    },
    // 搜索按钮操作
    handleQuery() {
      if (this.queryParams.interface == "1") {
        if (
          this.queryParams.inParamsShow == null ||
          this.queryParams.inParamsShow == ""
        ) {
          this.queryParams.inParamsShow = JSON.stringify({
            organizationId: 1,
            channelType: "wx",
            pageNum: 1,
            pageSize: 10,
            orderByColumn: "st.createTime", //根据时间排序
            isAsc: "descending", //倒序 descending 正序 ascending
          });
          this.$modal.msgWarning("入参已提示，请按照需求修改");
        } else {
          console.log("====", JSON.parse(this.queryParams.inParamsShow));
          tweetList(JSON.parse(this.queryParams.inParamsShow)).then(
            (response) => {
              this.outParams = JSON.stringify(response);
            }
          );
        }
      } else if (this.queryParams.interface == "2") {
        if (
          this.queryParams.inParamsShow == null ||
          this.queryParams.inParamsShow == ""
        ) {
          this.queryParams.inParamsShow = JSON.stringify({
            tweetId: 1,
            channelId: 1,
          });
          this.$modal.msgWarning("入参已提示，请按照需求修改");
        } else {
          console.log("====", JSON.parse(this.queryParams.inParamsShow));
          tweetDetail(JSON.parse(this.queryParams.inParamsShow)).then(
            (response) => {
              this.outParams = JSON.stringify(response);
            }
          );
        }
      } else if (this.queryParams.interface == "3") {
        if (
          this.queryParams.inParamsShow == null ||
          this.queryParams.inParamsShow == ""
        ) {
          this.queryParams.inParamsShow = JSON.stringify({
            tweetId: 91,
            channelId: 60,
            organizationId: 1,
            shareUserId: sessionStorage.getItem("userId"),
            shareSource: "H5Img",
          });
          this.$modal.msgWarning("入参已提示，请按照需求修改");
        } else {
          console.log("====", JSON.parse(this.queryParams.inParamsShow));
          tweetShare(JSON.parse(this.queryParams.inParamsShow)).then(
            (response) => {
              this.outParams = JSON.stringify(response);
            }
          );
        }
      } else if (this.queryParams.interface == "4") {
        if (
          this.queryParams.inParamsShow == null ||
          this.queryParams.inParamsShow == ""
        ) {
          this.queryParams.inParamsShow = JSON.stringify({
            organizationId: 1,
            searchType: "orgAll",
            isSelectElem: true,
            pageNum: 1,
            pageSize: 10,
            today: "1",
            templateType: "商品",
            orderByColumn: "sic.browseTime", //根据时间排序
            isAsc: "descending", //倒序 descending 正序 ascending
          });
          this.$modal.msgWarning("入参已提示，请按照需求修改");
        } else {
          console.log("====", JSON.parse(this.queryParams.inParamsShow));
          customerList(JSON.parse(this.queryParams.inParamsShow)).then(
            (response) => {
              this.outParams = JSON.stringify(response);
            }
          );
        }
      } else if (this.queryParams.interface == "5") {
        if (
          this.queryParams.inParamsShow == null ||
          this.queryParams.inParamsShow == ""
        ) {
          this.queryParams.inParamsShow = JSON.stringify({
            organizationId: 1,
            elementId: 53,
            productTemplate: 2,
            orderStatus: "已完成",
            remark: "受理备注",
            kdNumber: "kdbh123456",
          });
          this.$modal.msgWarning("入参已提示，请按照需求修改");
        } else {
          console.log("====", JSON.parse(this.queryParams.inParamsShow));
          updateStatus(JSON.parse(this.queryParams.inParamsShow)).then(
            (response) => {
              this.outParams = JSON.stringify(response);
            }
          );
        }
      } else if (this.queryParams.interface == "6") {
        if (
          this.queryParams.inParamsShow == null ||
          this.queryParams.inParamsShow == ""
        ) {
          this.queryParams.inParamsShow = "入参为空";
          this.$modal.msgWarning("入参已提示，请按照需求修改");
        } else {
          manageUserOrganization().then((response) => {
            this.outParams = JSON.stringify(response);
          });
        }
      } else if (this.queryParams.interface == "7") {
        if (
          this.queryParams.inParamsShow == null ||
          this.queryParams.inParamsShow == ""
        ) {
          this.queryParams.inParamsShow = JSON.stringify({
            organizationId: 1,
          });
          this.$modal.msgWarning("入参已提示，请按照需求修改");
        } else {
          console.log("====", JSON.parse(this.queryParams.inParamsShow));
          organizationUser(JSON.parse(this.queryParams.inParamsShow)).then(
            (response) => {
              this.outParams = JSON.stringify(response);
            }
          );
        }
      } else if (this.queryParams.interface == "8") {
        if (
          this.queryParams.inParamsShow == null ||
          this.queryParams.inParamsShow == ""
        ) {
          this.queryParams.inParamsShow = JSON.stringify({
            organizationId: 1,
            elementId: 53,
            toOrganizationId: 1,
            toUserId: 2,
          });
          this.$modal.msgWarning("入参已提示，请按照需求修改");
        } else {
          console.log("====", JSON.parse(this.queryParams.inParamsShow));
          forwardUser(JSON.parse(this.queryParams.inParamsShow)).then(
            (response) => {
              this.outParams = JSON.stringify(response);
            }
          );
        }
      } else if (this.queryParams.interface == "9") {
        if (
          this.queryParams.inParamsShow == null ||
          this.queryParams.inParamsShow == ""
        ) {
          this.queryParams.inParamsShow = 260;
          this.$modal.msgWarning("入参已提示，请按照需求修改");
        } else {
          console.log("====", JSON.parse(this.queryParams.inParamsShow));
          getFormRecord(JSON.parse(this.queryParams.inParamsShow)).then(
            (response) => {
              this.outParams = JSON.stringify(response);
            }
          );
        }
      } else if (this.queryParams.interface == "10") {
        if (
          this.queryParams.inParamsShow == null ||
          this.queryParams.inParamsShow == ""
        ) {
          this.queryParams.inParamsShow = 42;
          this.$modal.msgWarning("入参已提示，请按照需求修改");
        } else {
          console.log("====", JSON.parse(this.queryParams.inParamsShow));
          getSignRecord(JSON.parse(this.queryParams.inParamsShow)).then(
            (response) => {
              this.outParams = JSON.stringify(response);
            }
          );
        }
      } else if (this.queryParams.interface == "11") {
        if (
          this.queryParams.inParamsShow == null ||
          this.queryParams.inParamsShow == ""
        ) {
          this.queryParams.inParamsShow = JSON.stringify({
            organizationId: 1,
            searchType: "person",
          });
          this.$modal.msgWarning("入参已提示，请按照需求修改");
        } else {
          console.log("====", JSON.parse(this.queryParams.inParamsShow));
          selectCustomerReport(JSON.parse(this.queryParams.inParamsShow)).then(
            (response) => {
              this.outParams = JSON.stringify(response);
            }
          );
        }
      } else if (this.queryParams.interface == "12") {
        if (
          this.queryParams.inParamsShow == null ||
          this.queryParams.inParamsShow == ""
        ) {
          this.queryParams.inParamsShow = JSON.stringify({
            organizationId: 1,
          });
          this.$modal.msgWarning("入参已提示，请按照需求修改");
        } else {
          mbTypeListByOrganizationId2(
            JSON.parse(this.queryParams.inParamsShow)
          ).then((response) => {
            this.outParams = JSON.stringify(response);
          });
        }
      } else if (this.queryParams.interface == "13") {
        if (
          this.queryParams.inParamsShow == null ||
          this.queryParams.inParamsShow == ""
        ) {
          this.queryParams.inParamsShow = "入参为空";
          this.$modal.msgWarning("入参已提示，请按照需求修改");
        } else {
          mbTypeListByManage().then((response) => {
            this.outParams = JSON.stringify(response);
          });
        }
      } else if (this.queryParams.interface == "14") {
        if (
          this.queryParams.inParamsShow == null ||
          this.queryParams.inParamsShow == ""
        ) {
          this.queryParams.inParamsShow = JSON.stringify({
            organizationId: 1,
          });
          this.$modal.msgWarning("入参已提示，请按照需求修改");
        } else {
          mbOptionListByOrganizationId(
            JSON.parse(this.queryParams.inParamsShow)
          ).then((response) => {
            this.outParams = JSON.stringify(response);
          });
        }
      } else if (this.queryParams.interface == "15") {
        if (
          this.queryParams.inParamsShow == null ||
          this.queryParams.inParamsShow == ""
        ) {
          this.queryParams.inParamsShow = "入参为空";
          this.$modal.msgWarning("入参已提示，请按照需求修改");
        } else {
          mbOptionListByManage().then((response) => {
            this.outParams = JSON.stringify(response);
          });
        }
      } else if (this.queryParams.interface == "16") {
        if (
          this.queryParams.inParamsShow == null ||
          this.queryParams.inParamsShow == ""
        ) {
          this.queryParams.inParamsShow = JSON.stringify({
            organizationId: 1,
            searchType: "person",
          });
          this.$modal.msgWarning("入参已提示，请按照需求修改");
        } else {
          console.log("====", JSON.parse(this.queryParams.inParamsShow));
          selectCustomerReportRealTime(
            JSON.parse(this.queryParams.inParamsShow)
          ).then((response) => {
            this.outParams = JSON.stringify(response);
          });
        }
      } else if (this.queryParams.interface == "17") {
        if (
          this.queryParams.inParamsShow == null ||
          this.queryParams.inParamsShow == ""
        ) {
          this.queryParams.inParamsShow = JSON.stringify({
            organizationId: 1,
            searchType: "person",
            today: 1,
            templateType: "商品",
          });
          this.$modal.msgWarning("入参已提示，请按照需求修改");
        } else {
          console.log("====", JSON.parse(this.queryParams.inParamsShow));
          selectCustomerReportTrackStatus(
            JSON.parse(this.queryParams.inParamsShow)
          ).then((response) => {
            this.outParams = JSON.stringify(response);
          });
        }
      } else if (this.queryParams.interface == "18") {
        if (
          this.queryParams.inParamsShow == null ||
          this.queryParams.inParamsShow == ""
        ) {
          this.queryParams.inParamsShow = JSON.stringify({
            organizationId: 1,
            searchType: "person",
            today: 1,
            orderTrackStatus: "待发货",
          });
          this.$modal.msgWarning("入参已提示，请按照需求修改");
        } else {
          console.log("====", JSON.parse(this.queryParams.inParamsShow));
          selectCustomerReportTemplateType(
            JSON.parse(this.queryParams.inParamsShow)
          ).then((response) => {
            this.outParams = JSON.stringify(response);
          });
        }
      } else if (this.queryParams.interface == "19") {
        if (
          this.queryParams.inParamsShow == null ||
          this.queryParams.inParamsShow == ""
        ) {
          this.queryParams.inParamsShow = JSON.stringify({
            pageNum: 1,
            pageSize: 10,
            organizationId: 1,
          });
          this.$modal.msgWarning("入参已提示，请按照需求修改");
        } else {
          getsceneLiveCodeList(JSON.parse(this.queryParams.inParamsShow)).then(
            (response) => {
              this.outParams = JSON.stringify(response);
            }
          );
        }
      } else if (this.queryParams.interface == "20") {
        if (
          this.queryParams.inParamsShow == null ||
          this.queryParams.inParamsShow == ""
        ) {
          this.queryParams.inParamsShow = JSON.stringify({
            coupon: '8F1856233EBF',
            organizationId: 264,
            isSelectElem:true,
          });
          this.$modal.msgWarning("入参已提示，请按照需求修改");
        } else {
          orderListByCoupon(JSON.parse(this.queryParams.inParamsShow)).then(
            (response) => {
              this.outParams = JSON.stringify(response);
            }
          );
        }
      } else {
      }
    },
  },
};
</script>

<style scoped></style>
