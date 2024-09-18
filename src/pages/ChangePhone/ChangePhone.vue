<template>
    <view class="change-phone">
        <Navbar :bgColor="'#a6ffcb'">
            <template #left>
                <view>
                    <u-icon name="arrow-left" size="20" color="#303133" @click="back"></u-icon>
                </view>
            </template>
            <template #center>
                <view>
                    <text>修改手机号</text>
                </view>
            </template>
        </Navbar>
        <!-- #ifdef APP -->
        <u-gap height="30"></u-gap>
        <!-- #endif -->
        <view class="change-phone-form" v-if="current == 'phone'">
            <u-form ref="verificationForm" class="verificationForm" :model="form" v-if="!changePhoneNumber">
                <u-form-item label="手机号" prop="phone" labelWidth="60">
                    <u-input disabled v-model="form.phone" :maxlength="11" color="#AFAFAF" disabledColor="#ffffff"
                        border="bottom" clearable></u-input>
                </u-form-item>
                <u-form-item label="验证码" prop="captcha" labelWidth="60">
                    <u-input class="captcha" type="number" v-model="form.captcha" placeholder="请输入验证码" :maxlength="6"
                        border="bottom" clearable>
                        <template #suffix>
                            <u-button class="btn" type="primary"
                                @click="sendVerificationCode(parseInt(userInfo.phone), '')">
                                <view v-if="sendcode">{{ time }}秒后重试</view>
                                <view v-else>发送验证码</view>
                            </u-button>
                        </template>
                    </u-input>
                </u-form-item>
                <u-button type="primary" class="next" @click="checkphone()">下一步</u-button>
            </u-form>
            <u-form ref="changeForm" class="changeForm" :model="form" v-else>
                <u-form-item label="手机号" prop="newPhone" labelWidth="60">
                    <u-input v-model="form.newPhone" type="number" placeholder="请输入新手机号" :maxlength="11" border="bottom"
                        clearable></u-input>
                </u-form-item>
                <u-form-item label="验证码" prop="code" labelWidth="60">
                    <u-input v-model="form.code" type="number" placeholder="请输入验证码" :maxlength="6" border="bottom"
                        clearable>
                        <template #suffix>
                            <u-button type="primary" @click="sendVerificationCode(form.newPhone, '')">
                                <view v-if="sendcode">{{ time }}秒后重试</view>
                                <view v-else>发送验证码</view>
                            </u-button>
                        </template>
                    </u-input>
                </u-form-item>
                <u-button type="primary" class="submit" @click="submit()">提交</u-button>
            </u-form>
        </view>
        <view class="change-email-form" v-else-if="current == 'email'">
            <u-form ref="verificationForm" class="verificationForm" :model="form" v-if="!changePhoneNumber">
                <u-form-item label="邮箱" prop="email" labelWidth="60">
                    <u-input disabled v-model="form.email" :maxlength="11" color="#AFAFAF" disabledColor="#ffffff"
                        border="bottom" clearable></u-input>
                </u-form-item>
                <u-form-item label="验证码" prop="captcha" labelWidth="60">
                    <u-input class="captcha" type="number" v-model="form.captcha" placeholder="请输入验证码" :maxlength="6"
                        border="bottom" clearable>
                        <template #suffix>
                            <u-button class="btn" type="primary" @click="sendVerificationCode(0, userInfo.email)">
                                <view v-if="sendcode">{{ time }}秒后重试</view>
                                <view v-else>发送验证码</view>
                            </u-button>
                        </template>
                    </u-input>
                </u-form-item>
                <u-button type="primary" class="next" @click="checkemail()">下一步</u-button>
            </u-form>
            <u-form ref="changeForm" class="changeForm" :model="form" v-else>
                <u-form-item label="邮箱" prop="newPhone" labelWidth="60">
                    <u-input v-model="form.newEmail" type="number" placeholder="请输入新邮箱" :maxlength="11" border="bottom"
                        clearable></u-input>
                </u-form-item>
                <u-form-item label="验证码" prop="code" labelWidth="60">
                    <u-input v-model="form.code" type="number" placeholder="请输入验证码" :maxlength="6" border="bottom"
                        clearable>
                        <template #suffix>
                            <u-button type="primary" @click="sendVerificationCode(0, form.newEmail)">
                                <view v-if="sendcode">{{ time }}秒后重试</view>
                                <view v-else>发送验证码</view>
                            </u-button>
                        </template>
                    </u-input>
                </u-form-item>
                <u-button type="primary" class="submit" @click="submit()">提交</u-button>
            </u-form>
        </view>
        <u-toast ref="toast"></u-toast>
    </view>
</template>

<script setup lang='ts'>
import { onMounted, ref, computed } from 'vue'
import { onLoad } from "@dcloudio/uni-app"
import Navbar from "@/components/layout/navbar/navbar.vue"
import showtoast from "@/utils/showtoast"
import useUserStore from '@/store/user'
import request from '@/utils/request'
const store = useUserStore()
const userInfo = computed(() => store.userinfo)
const toast = ref()
const changeForm = ref()
const verificationForm = ref()
let changePhoneNumber = ref(false)
let sendcode = ref(false)
let time = ref(60)
let title = ref()
let form = ref(
    {
        phone: userInfo.value.phone,
        newPhone: 0,
        email: userInfo.value.email,
        newEmail: '',
        captcha: '',
        code: '',
        key: ''
    }
)
let current = ref()
const rule = {
    newPhone: [
        { required: true, message: '新手机号不能为空', trigger: 'blur' },
        { pattern: /^1[3456789]\d{9}$/, message: '新手机号格式不正确', trigger: 'blur' }
    ],
    code: [
        { required: true, message: '验证码不能为空', trigger: 'blur' },
        { pattern: /^\d{6}$/, message: '验证码格式不正确', trigger: 'blur' }
    ],
    captcha: [
        { required: true, message: '验证码不能为空', trigger: 'blur' },
        { pattern: /^\d{6}$/, message: '验证码格式不正确', trigger: 'blur' }
    ]
}
onLoad((query: any) => {
    if (query == undefined) {
        console.log('无参数')
    } else if (query.type == 'phone') {
        current.value = 'phone'
        title.value = '修改手机号'
    } else if (query.type == 'email') {
        current.value = 'email'
        title.value = '修改邮箱'
    }
})
onMounted(() => {
    showtoast.onbind(toast.value)
    verificationForm.value.setRules(rule)
})
function submit() {
    changeForm.value.validate().then((valid) => {
        if (valid) {
            request({
                url: '/user/updatePhone',
                method: 'post',
                data: {
                    payload: form.value.newPhone || form.value.newEmail,
                    code: form.value.code,
                    key: form.value.key
                }
            }).then((res) => {
                if (res.success) {
                    showtoast.onSuccess('修改成功')
                    uni.switchTab({
                        url: '/pages/tabbar/my/index'
                    })
                } else {
                    showtoast.onError(res.message)
                }
            }).catch((err) => {
                showtoast.onError(err)
            })
        }
    }).catch((err) => {
        showtoast.onError(err[0].message)
    })
}
function checkphone() {
    verificationForm.value.validate().then((valid) => {
        if (valid) {
            request({
                url: '/captcha/check',
                method: 'post',
                data: {
                    key: form.value.key,
                    captcha: form.value.captcha
                }
            }).then((res) => {
                if (res.success) {
                    changePhoneNumber.value = !changePhoneNumber.value
                    changeForm.value.setRules(rule)
                } else {
                    showtoast.onError(res.message)
                }
            }).catch((err) => {
                showtoast.onError(err)
            })
        }
    }).catch((err: any) => {
        showtoast.onError(err[0].message)
    })
}
function checkemail() {
    verificationForm.value.validate().then((valid) => {
        if (valid) {
            request({
                url: '/captcha/check',
                method: 'post',
                data: {
                    key: form.value.key,
                    captcha: form.value.captcha
                }
            }).then((res) => {
                if (res.success) {
                    changePhoneNumber.value = !changePhoneNumber.value
                    changeForm.value.setRules(rule)
                } else {
                    showtoast.onError(res.message)
                }
            }).catch((err) => {
                showtoast.onError(err)
            })
        }
    }).catch((err: any) => {
        showtoast.onError(err[0].message)
    })
}
function sendVerificationCode(phone: number, email: string) {
    if (phone != 0) {
        request({
            url: '/captcha/phone',
            data: {
                phone: phone,
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
    } else if (email != '') {
        request({
            url: '/captcha/email',
            data: {
                email: email,
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
.change-phone {
    .change-phone-form {
        padding: 30rpx;

        .verificationForm {
            .captcha {
                flex: 3;
            }

            .btn {
                flex: 1;
            }

            .next {
                margin-top: 50rpx;
            }
        }

        .changeForm {
            .captcha {
                flex: 3;
            }

            .btn {
                flex: 1;
            }

            .submit {
                margin-top: 50rpx;
            }
        }

        :deep(.u-form-item__body__right__message) {
            margin-left: 0 !important;
        }
    }

    .change-email-form {
        padding: 30rpx;

        .verificationForm {
            .captcha {
                flex: 3;
            }

            .btn {
                flex: 1;
            }

            .next {
                margin-top: 50rpx;
            }
        }

        .changeForm {
            .captcha {
                flex: 3;
            }

            .btn {
                flex: 1;
            }

            .submit {
                margin-top: 50rpx;
            }
        }

        :deep(.u-form-item__body__right__message) {
            margin-left: 0 !important;
        }
    }
}
</style>
