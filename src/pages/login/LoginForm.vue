<template>
  <view class="login">
    <view class="navbar">
      <Navbar :bgColor="'#a6ffcb'">
        <template #left>
          <!-- #ifdef APP -->
          <u-icon name="arrow-left" size="20" color="#303133" @click="back"></u-icon>
          <!-- #endif -->
        </template>
        <template #center>
          <view>登录</view>
        </template>
      </Navbar>
    </view>
    <view class="logo">
      <u-image class="logo-img" src='@/static/logo.png' shape="circle" width="100" height="100"></u-image>
    </view>
    <!-- 注意，如果需要兼容微信小程序，最好通过setRules方法设置rules规则 -->
    <u-form labelPosition="left" :model="form" ref="loginForm" class="login-form">
      <u-form-item prop="phone" borderBottom v-if="!send && currentLoginType == loginType.phone">
        <u-input placeholder="请输入手机号" type="number" :border="'bottom'" v-model.trim="form.phone" clearable></u-input>
      </u-form-item>
      <u-form-item prop="email" borderBottom v-else-if="!send && currentLoginType == loginType.email">
        <u-input placeholder="请输入邮箱" type="text" :border="'bottom'" v-model.trim="form.email" clearable></u-input>
      </u-form-item>
      <div v-else-if="!send && currentLoginType == loginType.password">
        <u-form-item prop="studentId" borderBottom>
          <u-input placeholder="请输入学号" type="number" :border="'bottom'" v-model.trim="form.studentId"
            clearable></u-input>
        </u-form-item>
        <u-form-item prop="password" borderBottom>
          <u-input placeholder="请输入密码" type="password" :border="'bottom'" v-model.trim="form.password" clearable>

          </u-input>
        </u-form-item>
      </div>
      <u-form-item prop="verificationCode" class="code" borderBottom v-else-if="send">
        <u-code-input v-model="form.verificationCode" @finish="finish" :focus="true"></u-code-input>
      </u-form-item>
      <div class="login-type">
        <u-text style="width: 40%;" type="primary" :show="currentLoginType != loginType.email" text="邮箱登录"
          @click="loginEmail"></u-text>
        <u-text type="primary" :show="currentLoginType != loginType.phone" text="手机号登录" @click="loginPhone"></u-text>
        <u-text type="primary" :show="currentLoginType != loginType.password" text="密码登录"
          @click="loginPassword"></u-text>
      </div>
      <u-button v-if="currentLoginType != loginType.password" type="primary" formType shape="circle" @click="submit"
        :disabled="send" class="login-btn">
        <view v-if="!send">获取验证码</view>
        <view v-else>{{ countDown }}秒后重新发送</view>
      </u-button>
      <u-button @click="submit" v-else-if="currentLoginType == loginType.password" type="primary" formType
        shape="circle">登录</u-button>
      <u-button @click="switchphone" v-if="send" class="login-btn" type="primary" formType
        shape="circle">更换手机号</u-button>
    </u-form>
    <u-toast ref="toast"></u-toast>
  </view>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from "vue"
import Navbar from "@/components/layout/navbar/navbar.vue"
import request from "@/utils/request"
import showtoast from "@/utils/showtoast"
const loginForm = ref()
let send = ref(false)
let countDown = ref(60)
const toast = ref()
let bordercolor = ref('#C9CACC')
let throttle = uni.$u.throttle
let currentLoginType = ref(0)
let key = ref()
let form = reactive({
  phone: "",
  studentId: "",
  email: "",
  verificationCode: "",
  password: "",
})
const rules = reactive({
  phone: [
    {
      type: "string",
      required: true,
      message: "手机号不能为空",
      trigger: "blur",
    },
    {
      type: "string",
      pattern: /^1[3-9]\d{9}$/,
      message: "手机号格式不正确",
      trigger: ["blur", "change"],
    },
  ],
  email: [
    {
      type: 'email',
      required: true,
      message: "邮箱不能为空",
      trigger: "blur",
    },
    {
      type: "string",
      pattern: /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/,
      message: "邮箱格式不正确",
      trigger: ["blur", "change"]
    },
  ],
  studentId: [
    {
      required: true,
      message: "学号不能为空",
      trigger: "blur",
    },
    {
      type: "string",
      pattern: /^[0-9]{11}$/,
      message: "学号格式不正确",
      trigger: ["blur", "change"],
    }
  ],
  password: [
    {
      required: true,
      message: "密码不能为空",
      trigger: "blur",
    },
  ]
})
const loginType = {
  phone: 0,
  email: 1,
  password: 2
}
onMounted(() => {
  loginForm.value.setRules(rules)
  showtoast.onbind(toast.value)
})
function submit() {
  loginForm.value.validate().then((valid) => {
    console.log(valid);
    if (!valid && currentLoginType.value == loginType.phone) {
      showtoast.onError('手机号格式不正确')
    } else if (!valid && currentLoginType.value == loginType.email) {
      showtoast.onError('邮箱格式不正确')
    } else if (valid && currentLoginType.value == loginType.phone) {
      send.value = true
      if (send.value) {
        request(
          {
            url: '/captcha/phone',
            method: 'get',
            data: {
              phone: form.phone
            }
          }).then((res: any) => {
            if (res.success) {
              form.verificationCode = ""
              key.value = res.data.key
              setTime()
              showtoast.onSuccess('验证码发送成功')
            } else {
              showtoast.onError(res.message)
            }
          }).catch((err) => {
            showtoast.onError(err)
          })
      }
    } else if (valid && currentLoginType.value == loginType.email) {
      send.value = true
      if (send.value) {
        setTime()
        request(
          {
            url: '/captcha/email',
            method: 'get',
            data: {
              email: uni.$u.trim(form.email)
            }
          }).then((res: any) => {
            if (res.success) {
              form.verificationCode = ""
              key.value = res.data.key
              showtoast.onSuccess('验证码发送成功')
            } else {
              showtoast.onError(res.message)
            }
          }).catch((err) => {
            showtoast.onError(err)
          })
      }
    } else if (valid && currentLoginType.value == loginType.password) {
      request(
        {
          url: '/auth/app/login',
          method: 'post',
          data: {
            username: form.studentId || form.phone || form.email,
            password: uni.$u.trim(form.password)
          }
        }
      ).then((res: any) => {
        if (res.success) {
          console.log(res.data)
          uni.setStorageSync('token', res.data.access_token)
          showtoast.onSuccess('登录成功')
          uni.switchTab({
            url: '/pages/tabbar/home/index'
          })
        } else if (res.message == '用户未激活') {
          uni.navigateTo({
            url: '/pages/login/active'
          })
          showtoast.onError(res.message)
        } else {
          showtoast.onError(res.message)
        }
      }).catch((err) => {
        showtoast.onError(err)
      })
    }
  })
    .catch((err) => {
      // 处理验证错误
      showtoast.onError(err[0].message)
    });
}
// 定义 finish 方法  
const finish = (value: string) => {
  console.log('输入结束，当前值为：' + value);
  if (value) {
    request(
      {
        url: '/auth/app/login',
        method: 'post',
        data: {
          username: form.phone || uni.$u.trim(form.email),
          code: value,
          key: key.value
        }
      }
    ).then((res: any) => {
      if (res.success) {
        console.log(res.data);
        bordercolor.value = '#5ac725'
        uni.setStorageSync('token', res.data.token)
        showtoast.onSuccess('登录成功')
        uni.switchTab({
          url: '/pages/tabbar/home/index'
        })
      } else if (res.message == '用户未激活') {
        uni.navigateTo({
          url: '/pages/login/active'
        })
        bordercolor.value = '#f56c6c'
        showtoast.onError(res.message)
        send.value = false
      } else {
        showtoast.onError(res.message)
      }
    }).catch((err) => {
      bordercolor.value = '#f56c6c'
      showtoast.onError(err)
    })
  } else {
    bordercolor.value = '#f56c6c'
    showtoast.onError('验证码错误')
  }
}
function switchphone() {
  countDown.value = 1
  send.value = false
}
function back() {
  uni.redirectTo({
    url: '/pages/login/login'
  })
}
function loginEmail() {
  currentLoginType.value = loginType.email
  form.email = ''
}
function loginPhone() {
  currentLoginType.value = loginType.phone
  form.phone = ''
}
function loginPassword() {
  currentLoginType.value = loginType.password
  form.studentId = ''
  form.password = ''
}
function setTime() {
  let timer = setInterval(() => {
    countDown.value--
    if (countDown.value == 0) {
      countDown.value = 60
      send.value = false
      bordercolor.value = ''
      clearInterval(timer)
    }
  }, 1000)
}
</script>

<style lang="scss" scoped>
body {
  // background-color: $page-bg;
}

.login {
  width: 80%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;

  .navbar {
    height: 140rpx;
  }

  .logo {
    margin-top: 50rpx;

    .logo-img {
      display: flex;
      justify-content: center;
    }
  }

  .login-form {


    .login-btn {
      margin-top: 120rpx;
    }

    :deep(.u-form-item__body__right__message) {
      margin: 0 !important;
    }
  }

  .code {
    :deep(.u-code-input__item) {
      border-color: v-bind(bordercolor) !important;
    }

    :deep(.u-form-item__body__right__content__slot) {
      justify-content: center;
    }
  }

  .login-type {
    display: flex;
    justify-content: space-between;
    margin: 20rpx 0 30rpx 0;

    :deep(.u-text) {
      flex: none;
      display: block;
      width: auto;
    }

    :deep(.u-text__value) {
      display: block;
    }
  }
}
</style>
