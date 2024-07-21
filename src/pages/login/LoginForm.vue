<template>
  <view class="login">
    <view class="navbar">
      <Navbar :bgColor="'#a6ffcb'">
        <!-- #ifndef MP-WEIXIN || WEB -->
        <template #left>
          <u-icon name="arrow-left" size="30" color="#ffffff" @click="back"></u-icon>
        </template>
        <!-- #endif -->
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
      <u-form-item prop="phone" borderBottom v-if="!send">
        <u-input placeholder="请输入手机号" type="number" :border="'bottom'" v-model="form.phone" clearable></u-input>
      </u-form-item>
      <u-form-item prop="verificationCode" class="code" borderBottom v-else>
        <u-code-input v-model="form.verificationCode" @finish="finish" :focus="true"></u-code-input>
      </u-form-item>
      <u-button @click="submit" :disabled="send" class="login-btn">
        <view v-if="!send">获取验证码</view>
        <view v-else>{{ countDown }}秒后重新发送</view>
      </u-button>
      <u-button @click="switchphone" v-if="send" class="login-btn">更换手机号</u-button>
    </u-form>
    <u-toast ref="uToastRef"></u-toast>
  </view>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from "vue"
import Navbar from "@/components/layout/navbar/navbar.vue"
let loginForm = ref()
let send = ref(false)
let countDown = ref(60)
const uToastRef = ref()
let bordercolor = ref('#C9CACC')
let throttle = uni.$u.throttle
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
      message: "请输入手机号",
      trigger: "blur",
    },
    {
      type: "string",
      pattern: /^1[3456789]\d{9}$/,
      message: "手机号格式不正确",
      trigger: ["blur", "change"],
    },
  ],
  studentId: [
    {
      required: true,
    },
  ]
})
onMounted(() => {
  loginForm.value.setRules(rules)
})
function submit() {
  loginForm.value.validate().then((valid) => {
    if (valid) {
      uni.$u.toast("验证码发送成功")
      send.value = true
      if (send.value == true) {
        let timer = setInterval(() => {
          countDown.value--
          if (countDown.value == 0) {
            countDown.value = 60
            send.value = false
            clearInterval(timer)
          }
        }, 1000)
      } else {
        send.value = false
      }
    } else {
      uni.$u.toast("手机号格式不正确")
    }
  })
    .catch(() => {
      // 处理验证错误
      uni.$u.toast("手机号格式不正确")
    });
}
// 定义 finish 方法  
const finish = (value: string) => {
  console.log('输入结束，当前值为：' + value);
  if (value == "123456") {
    bordercolor.value = '#5ac725'
    uni.$u.toast('验证码正确')
    uni.switchTab({
      url: '/pages/tabbar/home/index'
    })
  } else {
    bordercolor.value = '#f56c6c'
    uni.$u.toast('验证码错误')
  }
}
function switchphone() {
  countDown.value = 1
  send.value = false
}
function back() {
  uni.reLaunch({
    url: '/pages/login/login'
  })
}
</script>

<style lang="scss" scoped>
body {
  background-color: $page-bg;
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
      margin-top: 20rpx;
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
}
</style>
