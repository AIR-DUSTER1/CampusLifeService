<template>
    <view class="changePassword">
        <Navbar :bgColor="'#a6ffcb'">
            <template #left>
                <view>
                    <u-icon name="arrow-left" size="20" color="#303133" @click="back"></u-icon>
                </view>
            </template>
            <template #center>
                <view>
                    修改密码
                </view>
            </template>
        </Navbar>
        <view class="changeForm">
            <u-form ref="changeForm" :model="form">
                <u-form-item leftIconStyle prop="phone">
                    <u-input prefixIcon="phone" v-model="form.phone" disabled color="#AFAFAF" disabledColor="#ffffff"
                        type="number" border="bottom"></u-input>
                </u-form-item>
                <u-form-item prop="verificationCode">
                    <u-input class="verificationCode" v-model="form.verificationCode" type="number" placeholder="请输入验证码"
                        border="bottom"></u-input>
                    <u-button type="primary" @click="sendVerificationCode" class="btn">
                        <view v-if="sendcode">{{ time }}秒后重试</view>
                        <view v-else>发送验证码</view>
                    </u-button>
                </u-form-item>
                <u-form-item prop="oldPassword">
                    <u-input prefixIcon="lock" v-model="form.oldPassword" type="password" placeholder="请输入原密码"
                        border="bottom"></u-input>
                </u-form-item>
                <u-form-item prop="newPassword">
                    <u-input prefixIcon="lock" v-model="form.newPassword" type="password" placeholder="请输入新密码"
                        border="bottom"></u-input>
                </u-form-item>
                <u-button type="primary" @click="submit" class="sumbit">确定</u-button>
            </u-form>
        </view>
        <u-toast ref="toast"></u-toast>
    </view>
</template>

<script setup lang='ts'>
import { onMounted, ref, toRaw, reactive, shallowRef, watch, computed } from 'vue'
import Navbar from "@/components/layout/navbar/navbar.vue"
import showtoast from "@/utils/showtoast"
import useUserStore from '@/store/user'
import request from '@/utils/request'
const store = useUserStore()
const userInfo = computed(() => store.userinfo)
let sendcode = ref(false)
let changeForm = ref()
let time = ref(60)
let toast = ref()
let form = ref(
    {
        phone: userInfo.value.phone,
        oldPassword: '',
        newPassword: '',
        verificationCode: '',
        key: '',
    }
)
const rule = {
    oldPassword: [
        { required: true, message: '原密码不能为空', trigger: 'blur' }
    ],
    newPassword: [
        { required: true, message: '新密码不能为空', trigger: 'blur' },
        { pattern: /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/, message: '密码格式不正确', trigger: ['blur', 'change'] }
    ],
    verificationCode: [
        { required: true, message: '验证码不能为空', trigger: 'blur' },
        { pattern: /^\d{6}$/, message: '验证码格式不正确', trigger: 'blur' }
    ]
}
onMounted(() => {
    showtoast.onbind(toast.value)
    changeForm.value.setRules(rule)
})

function submit() {
    if (form.value.oldPassword == '') {

    }
    request({
        url: '/user/edit/password',
        method: 'put',
        data: {
            oldPassword: form.value.oldPassword,
            newPassword: form.value.newPassword

        }
    }).then((res) => {
        if (res.success) {
            showtoast.onSuccess('修改成功')
        } else if (res.message != null) {
            showtoast.onError(res.message)
        } else {
            showtoast.onError('修改失败')
        }
    }).catch((err) => {
        showtoast.onError(err)
    })
}
function sendVerificationCode() {
    request({
        url: '/captcha/phone',
        data: {
            phone: userInfo.value.phone,
        }
    }).then((res: any) => {
        if (res.success) {
            showtoast.onSuccess('验证码发送成功')
            form.value.key = res.data.key
            sendcode.value = true
            setTime()
        } else {
            showtoast.onError(res.message)
        }
    }).catch((err) => {
        showtoast.onError(err)
    })
}
function setTime() {
    setInterval(() => {
        time.value--
        if (time.value <= 0) {
            sendcode.value = false
        }
    }, 1000);
}
function back() {
    uni.navigateBack(
        {
            delta: 1
        }
    )
}
</script>

<style lang='scss' scoped>
.changePassword {
    .changeForm {
        padding: 30rpx;

        .verificationCode {
            flex: 3;
        }

        .btn {
            flex: 1;
        }

        .sumbit {
            margin-top: 80rpx;
        }

        :deep(.u-form-item__body__right__message) {
            margin-left: 0 !important;
        }
    }
}
</style>
