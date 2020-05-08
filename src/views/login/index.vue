<template>
  <div class="login_container">
    <el-form ref="loginFormRef" :rules="loginFormRules" :model="loginForm" class="login_form">
      <div class="title-container">
        <h3 class="title">
          系统登陆
        </h3>
      </div>
      <el-form-item prop="phone">
        <el-input
          placeholder="请输入手机号"
          v-model="loginForm.phone"
          clearable>
        </el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input
          class="login_input"
          placeholder="请输入密码"
          v-model="loginForm.password"
          show-password>
        </el-input>
      </el-form-item>
      <el-button type="primary" style="width:100%;margin-bottom:30px;"
                 @click="handleLogin">
        登陆
      </el-button>
    </el-form>
  </div>
</template>

<script>
  import { login } from '../../api/admin'

  export default {
    name: 'Login',
    data() {
      return {
        loginForm: {
          phone: '13363150950',
          password: '123456'
        },
        loginFormRules: {
          //验证手机号
          phone: [
            {required: true, message: '请输入手机号', trigger: 'blur'},
            {min: 11, max: 11, message: '手机号格式有误', trigger: 'blur'}
          ],
          //验证密码
          password: [
            {required: true, message: '请输入密码', trigger: 'blur'},
            {min: 6, message: '密码最少6位', trigger: 'blur'}
          ]
        }
      }
    },
    methods: {
      handleLogin() {
        this.$refs.loginFormRef.validate(async valid => {
          if (!valid) {
            //没有符合设置的基本校验规则，不予提交
            return;
          } else {
            const params = new URLSearchParams()
            params.append('phone', this.loginForm.phone)
            params.append('password', this.loginForm.password)
            login(params).then((response) => {
              this.$message.success("登录成功");
              sessionStorage.setItem("token", response.data[0]);
              this.$router.push({path: "/home"})
            }).catch((response) => {
              console.log(response)
            })
          }
        })
      },
    }
  }
</script>

<style lang="scss">

  $bg: #283443;
  $light_gray: #fff;
  $cursor: #fff;

  @supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
    .login_container .el-input input {
      color: $cursor;
    }
  }

  /* reset element-ui css */
  .login_container {
    .el-input {
      display: inline-block;
      height: 47px;
      width: 100%;

      input {
        background: transparent;
        border: 0px;
        -webkit-appearance: none;
        border-radius: 0px;
        padding: 12px 5px 12px 15px;
        color: $light_gray;
        height: 47px;
        caret-color: $cursor;

        &:-webkit-autofill {
          box-shadow: 0 0 0px 1000px $bg inset !important;
          -webkit-text-fill-color: $cursor !important;
        }
      }
    }

    .el-form-item {
      border: 1px solid rgba(255, 255, 255, 0.1);
      background: rgba(0, 0, 0, 0.1);
      border-radius: 5px;
      color: #454545;
    }
  }
</style>

<style lang="scss" scoped>
  $bg: #2d3a4b;
  $dark_gray: #889aa4;
  $light_gray: #eee;

  .login_container {
    min-height: 100%;
    width: 100%;
    background-color: $bg;
    overflow: hidden;

    .login_form {
      position: relative;
      width: 520px;
      max-width: 100%;
      padding: 160px 35px 0;
      margin: 0 auto;
      overflow: hidden;
    }

    .title-container {
      position: relative;

      .title {
        font-size: 26px;
        color: $light_gray;
        margin: 0px auto 40px auto;
        text-align: center;
        font-weight: bold;
      }
    }
  }
</style>

