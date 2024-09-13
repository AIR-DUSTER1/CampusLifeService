<template>
    <view class="active">
        <view class="navbar">
            <Navbar :bgColor="'#a6ffcb'">
                <template #left>
                    <u-icon name="arrow-left" size="20" color="#303133" @click="back"></u-icon>
                </template>
                <template #center>
                    <view>激活</view>
                </template>
            </Navbar>
        </view>
        <u-form labelPosition="left" :model="form" ref="activeForm" class="activeForm">
            <u-form-item prop="number">
                <u-input :border="'bottom'" type="number" v-model.trim="form.number" placeholder="请输入学号" clearable />
            </u-form-item>
            <u-form-item prop="password">
                <u-input v-show="!openPassword" :border="'bottom'" type="password" v-model.trim="form.password"
                    placeholder="请输入密码" clearable @focus="eye = true">
                    <template #suffix>
                        <u-icon v-show="!openPassword && eye" :name="'eye-fill'" color="#A6A5AF" size="20"
                            @click="openPassword = !openPassword"></u-icon>
                    </template>
                </u-input>
                <u-input v-show="openPassword" :border="'bottom'" type="text" v-model="form.password"
                    placeholder="请输入密码" clearable @focus="eye = true">
                    <template #suffix>
                        <u-icon v-show="openPassword && eye" :name="'eye-off'" color="#A6A5AF" size="20"
                            @click="openPassword = !openPassword"></u-icon>
                    </template>
                </u-input>
            </u-form-item>
        </u-form>
        <u-button type="primary" shape="circle" @click="submit" class="submit">激活</u-button>
        <u-toast ref="toast"></u-toast>
    </view>
</template>

<script setup lang='ts'>
import { onMounted, reactive, ref } from "vue"
import request from "@/utils/request"
import showtoast from "@/utils/showtoast"
import Navbar from "@/components/layout/navbar/navbar.vue"
const activeForm = ref()
const toast = ref()
let openPassword = ref(false)
let eye = ref(false)
const form = reactive({
    number: "",
    password: "",
})
const rules = {
    number: [
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
}
onMounted(() => {
    activeForm.value.setRules(rules)
    showtoast.onbind(toast.value)
})
function submit() {
    activeForm.value.validate().then((valid) => {
        if (valid) {
            request({
                url: "/user/active",
                method: "put",
                data: form,
            }).then((res: any) => {
                if (res.success) {
                    showtoast.onSuccess("激活成功")
                    uni.redirectTo({
                        url: '/pages/login/login'
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
function back() {
    uni.reLaunch({
        url: '/pages/login/LoginForm'
    })
}
</script>

<style lang='scss' scoped>
.active {
    display: flex;
    flex-direction: column;
    align-items: center;

    .navbar {
        height: 140rpx;
    }

    .activeForm {
        width: 80%;

        :deep(.u-form-item__body__right__message) {
            margin-left: 0 !important;
        }
    }

    .submit {
        width: 80%;
        margin-top: 50rpx;
    }
}
</style>
