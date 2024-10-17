<template>
    <view class="bind">
        <view class="navbar">
            <Navbar :bgColor="'#a6ffcb'">
                <template #left>
                    <view></view>
                    <!-- <u-icon name="arrow-left" size="20" color="#303133" @click="back"></u-icon> -->
                </template>
                <template #center>
                    <view>激活</view>
                </template>
            </Navbar>
        </view>
        <u-form labelPosition="left" :model="form" ref="activeForm" class="bindForm">
            <u-form-item prop="number">
                <u-input :border="'bottom'" type="number" v-model.trim="form.number" placeholder="请输入学/工号" clearable />
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
        <u-button type="primary" shape="circle" @click="bind" class="bind">绑定</u-button>
        <u-toast ref="toast"></u-toast>
    </view>
</template>

<script lang="ts" setup>
import request from '@/utils/request';
import { onLoad } from '@dcloudio/uni-app'
import Navbar from "@/components/layout/navbar/navbar.vue"
import { ref, onMounted } from 'vue'
import showtoast from '@/utils/showtoast'
import useUserStore from '@/store/user'
const store = useUserStore()
let toast = ref()
let openid = ref('')
let openPassword = ref(false)
let eye = ref(false)
let form = ref({
    number: '',
    password: '',
})
onLoad((query: any) => {
    if (query) {
        openid.value = query.openid
    }
})
onMounted(() => {
    showtoast.onbind(toast.value)
})
function bind() {
    if (form.value.number === '' || form.value.number === null) {
        showtoast.onError('请输入学/工号')
    }else if (form.value.password === '' || form.value.password === null) {
        showtoast.onError('请输入密码')
    }else if (openid.value === ''|| openid.value === null|| openid.value === undefined) {
        showtoast.onError('绑定失败，请重新绑定')
    }else{
        request({
        url: '/auth/app/loginAndBinding',
        method: 'post',
        data: {
            openid: openid.value,
            username: form.value.number,
            password: form.value.password
        }
    }).then((res: any) => {
        if (res.success) {
            store.setUid(res.data.uid)
            uni.setStorageSync('token', res.data.access_token)
            uni.setStorageSync('uid', res.data.uid)
            uni.switchTab({
                url: '/pages/tabbar/home/index'
            })
        } else {
            showtoast.onError(res.message)
        }
    }).catch((err) => {
        showtoast.onError(err)
    })
    }
}
function back() {
    uni.navigateBack()
}
</script>

<style scoped lang="scss">
.bind {
    display: flex;
    flex-direction: column;
    align-items: center;

    .navbar {
        height: 140rpx;
    }

    .bindForm {
        width: 80%;
        margin-top: 50rpx;

        :deep(.u-form-item__body__right__message) {
            margin-left: 0 !important;
        }
    }

    .bind {
        width: 80%;
        margin-top: 50rpx;
    }
}
</style>