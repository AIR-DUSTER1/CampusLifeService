<template>
    <view class="system-setting">
        <Navbar :bgColor="'#a6ffcb'">
            <template #left>
                <view>
                    <u-icon name="arrow-left" size="20" color="#303133" @click="back"></u-icon>
                </view>
            </template>
            <template #center>
                <view>
                    <text>设置</text>
                </view>
            </template>
        </Navbar>
        <!-- #ifdef APP -->
        <u-gap height="30"></u-gap>
        <!-- #endif -->
        <!-- #ifdef MP-WEIXIN -->
        <u-gap height="70"></u-gap>
        <!-- #endif -->
        <view class="setting-list">
            <u-cell-group>
                <u-cell isLink v-for="item in settingList" :key="item.url" @click="toPage(item.url)">
                    <template #title>
                        {{ item.title }}
                    </template>
                    <template #value>
                        {{ item.value }}
                    </template>
                </u-cell>
                <u-gap height="20" bgColor="#F3F4F6"></u-gap>
                <u-button type="error" @click="exitLogin" class="exit-login">退出登录</u-button>
            </u-cell-group>
        </view>
        <u-toast ref="toast"></u-toast>
    </view>
</template>

<script setup lang='ts'>
import { onMounted, ref } from 'vue'
import Navbar from "@/components/layout/navbar/navbar.vue"
import showtoast from "@/utils/showtoast"
const toast = ref()
let settingList = [
    {
        title: '账户安全',
        value: '',
        url: '/pages/AccountSecurity/AccountSecurity'
    },
    {
        title: '版本号',
        value: '1.0.0',
        url: 'update'
    },
    {
        title: '关于我们',
        value: '',
        url: '/pages/AboutUs/AboutUs'
    },
]
onMounted(() => {
    showtoast.onbind(toast.value)

})
function toPage(url: string) {
    console.log(url);
    if (url.includes('/pages')) {
        uni.navigateTo({
            url: url
        })
    } else if (url == 'update') {
        showtoast.onSuccess('当前版本为最新版')
    }
}
function exitLogin() {
    uni.showModal({
        content: '是否退出当前账户',
        showCancel: true,
        success: ({ confirm, cancel }) => {
            if (confirm) {
                uni.removeStorageSync('token')
                uni.removeStorageSync('uid')
                uni.clearStorageSync()
                uni.reLaunch({
                    url: '/pages/login/login'
                })
            } else if (cancel) {
                console.log('用户点击取消');
            }
        }
    })
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
.system-setting {
    .setting-list {
        .exit-login {
            width: 90vw;
            margin: 10rpx auto;
        }
    }
}
</style>
