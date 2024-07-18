<template>
  <view class="login-form">
    <!-- 注意，如果需要兼容微信小程序，最好通过setRules方法设置rules规则 -->
    <u-form labelPosition="left" :model="form" ref="loginForm">
      <u-form-item prop="phone" borderBottom>
        <u-input
          placeholder="请输入手机号"
          type="number"
          :border="'bottom'"
          v-model="form.phone"
          clearable
        ></u-input>
      </u-form-item>
      <u-button @click="submit" :disabled="send">
        <view v-if="!send">获取验证码</view>
        <view v-else>{{ countDown }}秒后重新发送</view>
      </u-button>
    </u-form>
    <u-code-input @finish="finish"></u-code-input>
    <u-toast ref="uToastRef"></u-toast>
  </view>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from "vue";
let loginForm = ref();
let send = ref(false);
let countDown = ref(60);
const uToastRef = ref();
let trim = uni.$u.trim;
let throttle = uni.$u.throttle;
let form = reactive({
  phone: "",
  studentId: "",
  email: "",
  verificationCode: "",
  password: "",
});
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
  ],
});
onMounted(() => {
  loginForm.value.setRules(rules);
});
function submit() {
  loginForm.value.validate().then((valid) => {
      if (valid) {
        uni.$u.toast("验证码发送成功")
        send.value = true
        if (send.value == true) {
          let timer = setInterval(() => {
            countDown.value--;
            if (countDown.value == 0) {
              countDown.value = 60;
              send.value = false;
              clearInterval(timer);
            }
          }, 1000);
        } else {
          send.value = false;
        }
      } else {
        uni.$u.toast("手机号格式不正确")
      }
    })
    .catch(() => {
      // 处理验证错误
      uni.$u.toast("手机号格式不正确")
    });
  uni.$u.toast(form.phone);
}
// uni.$u.toast()
// 定义 finish 方法  
const finish = (e) => {  
  console.log('输入结束，当前值为：' + e);  
};  
</script>

<style lang="scss" scoped>
.login-form {
  width: 80%;
  margin: 0 auto;
}
</style>
