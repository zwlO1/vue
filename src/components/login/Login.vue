<template>
  <div class="login_container">
    <span>fes</span>
    <!--登录框  -->
    <div class="login_box">
      <!-- 头像框 -->
      <div class="avatar_box">
        <img src="@/assets/img/logo.png" alt />
      </div>
      <!-- 表单 -->
      <!-- label-with="0px" -->
      <!-- rules属性为校验规则  prop为需校验的字段 -->
      <el-form class="login_form" :rules="loginFormRules" :model="loginForm" ref="loginFormRef">
        <!-- 用户名-->
        <el-form-item prop="username">
          <el-input v-model="loginForm.username" prefix-icon="el-icon-user"></el-input>
        </el-form-item>
        <!-- 密码-->
        <el-form-item prop="password">
          <!--  type="password" -->
          <el-input v-model="loginForm.password" show-password prefix-icon="el-icon-lock"></el-input>
        </el-form-item>
        <!-- 按钮-->
        <el-form-item class="btns">
          <el-button type="primary" @click="login" :loading="loginLoading">登录</el-button>
          <el-button type="info" @click="resetLoginForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data() {
    return {
      loginLoading: false,
      loginForm: {
        username: 'test',
        password: '123',
      },
      loginFormRules: {
        //输入框失去鼠标焦点触发验证
        username: [
          { required: true, message: '请输入登录名称', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入登录密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    resetLoginForm() {
      // console.log(this);
      this.$refs.loginFormRef.resetFields();//resetFields() 重置字段为初始值
      console.log('重置成功');
    },
    login() {
      this.loginLoading = true
      // validate(callback: Function(boolean, object))  表单校验结束后返回bollean 值传参给validate
      this.$refs.loginFormRef.validate(async valid => {
        console.log('校验结果：' + valid);//boolean
        if (!valid) {
          return (this.loginLoading = false)
        }
        // console.log(this.loginForm);
        //响应 对象
        const { data: res } = await this.$http.post('login', this.loginForm)
        console.log(res);
        if (res.meta.status !== 200) {
          this.loginLoading = false
          return this.$message.error('登录失败 帐号或密码错误!')
        }
        this.$message.success('登录成功!')
        // 1. 将登录成功之后的 token,保存到客户端的 sessionStorage(会话机制/只在当前页面生效)中 localStorage(持久话机制/关闭页面也不会忘记数据)
        //   1.1 项目中除了登录之外的API接口,必须在登录之后才能访问
        //   1.2 token 只应在当前网站打开期间生效, 所以将 token 保存在 sessionStorage中
        window.sessionStorage.setItem('token', res.data.token)
        // 2. 通过编程式路由导航跳转到后台主页,路由地址是 /home
        this.$router.push('/home')
        this.loginLoading = false
      })
    },
    keyDown(e) {
      if (e.keyCode == 13)
        this.login()
    }
  },
  mounted() {
    window.addEventListener('keydown', this.keyDown)
  }
}
</script>

<style lang="less" scoped>
.login_container {
  position: relative;
  background-color: #6c8f7b;
  height: 100%;
  span {
    display: block;
    // text-align: center;
    font-size: 100px;
    color: white;
    // background: linear-gradient(to left right, red, blue);
  }
}
.login_box {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 450px;
  height: 300px;
  background-color: #fff;
  border-radius: 3px;
  .avatar_box {
    display: block;
    width: 130px;
    height: 130px;
    border-radius: 50%;
    border: 1px solid #eee;
    padding: 10px;
    background-color: #fff;
    position: absolute;
    left: 50%;
    // top: -25%;
    transform: translate(-50%, -50%);
    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background-color: #eee;
    }
  }
  .login_form {
    box-sizing: border-box;
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 0 20px;
  }
  .btns {
    display: flex;
    justify-content: flex-end;
  }
}
</style>
