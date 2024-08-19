<template>
  <div class="login">
    <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form">
      <h3 class="title">社区化后台管理系统</h3>
      <el-form-item prop="username">
        <el-input
          v-model="loginForm.username"
          type="text"
          auto-complete="off"
          placeholder="账号"
        >
          <svg-icon slot="prefix" icon-class="user" class="el-input__icon input-icon" />
        </el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input
          v-model="loginForm.password"
          type="password"
          auto-complete="off"
          placeholder="密码"
          @keyup.enter.native="handleLogin"
        >
          <svg-icon slot="prefix" icon-class="password" class="el-input__icon input-icon" />
        </el-input>
      </el-form-item>
      <el-form-item prop="code" v-if="captchaEnabled">
        <el-input
          v-model="loginForm.code"
          auto-complete="off"
          placeholder="验证码"
          style="width: 63%"
          @keyup.enter.native="handleLogin"
        >
          <svg-icon slot="prefix" icon-class="validCode" class="el-input__icon input-icon" />
        </el-input>
        <div class="login-code">
          <img :src="codeUrl" @click="getCode" class="login-code-img"/>
        </div>
      </el-form-item>
      <el-checkbox v-model="loginForm.rememberMe" style="margin:0px 0px 25px 0px;">记住密码</el-checkbox>
      <el-form-item style="width:100%;">
        <el-button
          :loading="loading"
          size="medium"
          type="primary"
          style="width:100%;"
          @click.native.prevent="handleLogin"
        >
          <span v-if="!loading">登 录</span>
          <span v-else>登 录 中...</span>
        </el-button>
        <div style="float: right;" v-if="register">
          <router-link class="link-type" :to="'/register'">立即注册</router-link>
        </div>
      </el-form-item>
    </el-form>
		<el-dialog title="店铺选择" :visible.sync="dialogFormVisible" :before-close="close" :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false">
		  <el-form :model="form" :rules="rules" ref="ruleForm">
		    <el-form-item label="店铺选择" :label-width="formLabelWidth" prop="organizationId">
			  <el-select v-model="form.organizationId" placeholder="请选择" @change="select_click">
			  				  <el-option v-for="item in storeList"
			  							  :key="item.organizationId"  :label="item.organizationName" :value="item.organizationId"/>
			  				  </el-option>
			  				</el-select>
		    </el-form-item>
		  </el-form>
		  <div slot="footer" class="dialog-footer">
		    <el-button @click="close">取 消</el-button>
		    <el-button type="primary" @click="confirm('ruleForm')" :loading="loadingSelect">确 定</el-button>
		  </div>
		</el-dialog>

    <!--  底部  -->
    <div class="el-login-footer">
<!--      备案信息-->
      <span></span>
    </div>
  </div>
</template>

<script>
import { removeToken } from '@/utils/auth'
import { getCodeImg } from "@/api/login";
import Cookies from "js-cookie";
import { encrypt, decrypt } from '@/utils/jsencrypt'

export default {
  name: "Login",
  data() {
    return {
	  dialogFormVisible: false,//店铺弹框
	  form:{
		  organizationId:'',
	  },
	  formLabelWidth: '120px',
	  storeList:[],
      codeUrl: "",
      loginForm: {
        username: "",
        password: "",
        rememberMe: false,
        code: "",
        uuid: ""
      },
      loginRules: {
        username: [
          { required: true, trigger: "blur", message: "请输入您的账号" }
        ],
        password: [
          { required: true, trigger: "blur", message: "请输入您的密码" }
        ],
        code: [{ required: true, trigger: "change", message: "请输入验证码" }]
      },
      loading: false,
	  loadingSelect:false,
      // 验证码开关
      captchaEnabled: true,
      // 注册开关
      register: false,
      redirect: undefined,
	  rules: {
	           organizationId: [
	                       { required: true, message: '请选择店铺', trigger: 'change' }
	                     ],
	          }
    };
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect;
      },
      immediate: true
    }
  },
  created() {
    this.getCode();
    this.getCookie();
  },
  activated() {
    this.getCode();
    this.getCookie();
  },
  methods: {
    getCode() {
      getCodeImg().then(res => {
        this.captchaEnabled = res.captchaEnabled === undefined ? true : res.captchaEnabled;
        if (this.captchaEnabled) {
          this.codeUrl = "data:image/gif;base64," + res.img;
          this.loginForm.uuid = res.uuid;
        }
      });
    },
    getCookie() {
      const username = Cookies.get("username");
      const password = Cookies.get("password");
      const rememberMe = Cookies.get('rememberMe')
      this.loginForm = {
        username: username === undefined ? this.loginForm.username : username,
        password: password === undefined ? this.loginForm.password : decrypt(password),
        rememberMe: rememberMe === undefined ? false : Boolean(rememberMe)
      };
    },
    handleLogin() {
	  this.form.organizationId = ''
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true;
          if (this.loginForm.rememberMe) {
            Cookies.set("username", this.loginForm.username, { expires: 30 });
            Cookies.set("password", encrypt(this.loginForm.password), { expires: 30 });
            Cookies.set('rememberMe', this.loginForm.rememberMe, { expires: 30 });
          } else {
            Cookies.remove("username");
            Cookies.remove("password");
            Cookies.remove('rememberMe');
          }
          this.$store.dispatch("Login", this.loginForm).then(() => {
            let userId = JSON.parse(sessionStorage.getItem('userId'))
            if(userId == '1') {
              this.$router.push({ path: "/" }).catch(()=>{});
            } else {
              this.storeList = JSON.parse(sessionStorage.getItem('storeList'))
              this.dialogFormVisible  = true
              this.$refs['ruleForm'].resetFields();
            }
          }).catch(() => {
            this.loading = false;
            if (this.captchaEnabled) {
              this.getCode();
            }
          });
        }
      });
    },
	select_click(){
		sessionStorage.setItem('storageAside', '0')
		sessionStorage.setItem('organizationId',this.form.organizationId)
	},
	close(){
		this.dialogFormVisible = false
		this.loading = false;
		this.loginForm.code = ''
		sessionStorage.removeItem('organizationId');
		sessionStorage.removeItem('userId');
    sessionStorage.removeItem('userPhone')
		sessionStorage.removeItem('storeList');
		this.getCode()
		removeToken()
	},
	confirm(formName){
		this.$refs[formName].validate((valid) => {
		  if (valid) {
		    this.loadingSelect = true
		    this.$store.dispatch("GetInfo").then(res=>{
		    	 this.$store.dispatch("GenerateRoutes").then(()=>{
		    		 this.loading = false;
		    		 this.$router.push({ path: "/" }).catch(()=>{});
		    		 setTimeout(() => {
		    		 }, 500);
		    	 })
		    })
		  } else {
			// this.$message.error('请先选择店铺');
		    console.log('error submit!!');
		    return false;
		  }
		});

	},

  }
};
</script>

<style rel="stylesheet/scss" lang="scss">
.login {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  background-image: url("../assets/images/login-background.jpg");
  background-size: cover;
}
.title {
  margin: 0px auto 30px auto;
  text-align: center;
  color: #707070;
}

.login-form {
  border-radius: 6px;
  background: #ffffff;
  width: 400px;
  padding: 25px 25px 5px 25px;
  .el-input {
    height: 38px;
    input {
      height: 38px;
    }
  }
  .input-icon {
    height: 39px;
    width: 14px;
    margin-left: 2px;
  }
}
.login-tip {
  font-size: 13px;
  text-align: center;
  color: #bfbfbf;
}
.login-code {
  width: 33%;
  height: 38px;
  float: right;
  img {
    cursor: pointer;
    vertical-align: middle;
  }
}
.el-login-footer {
  height: 40px;
  line-height: 40px;
  position: fixed;
  bottom: 0;
  width: 100%;
  text-align: center;
  color: #fff;
  font-family: Arial;
  font-size: 12px;
  letter-spacing: 1px;
}
.login-code-img {
  height: 38px;
}
</style>
