<template>
    <view>
        <Navbar :bgColor="'#a6ffcb'">
            <template #left>
                <view>
                    <u-icon name="arrow-left" size="20" color="#303133" @click="back"></u-icon>
                </view>
            </template>
            <template #center>
                <view>
                    关于我们
                </view>
            </template>
        </Navbar>
        <!-- #ifdef APP || MP-WEIXIN -->
        <u-gap height="30"></u-gap>
        <!-- #endif -->
        <view class="about-us">
            <view>
                <u-image :show-loading="true" :src="logo" width="80px" height="80px"
                    class="logo"></u-image>
                <view class="title">飞鸟校园生活服务平台</view>
            </view>
        </view>
    </view>
</template>

<script setup lang='ts'>
import { onMounted, ref, toRaw, reactive } from 'vue'
import logo from '@/static/logo.png'
import Navbar from "@/components/layout/navbar/navbar.vue"
function back() {
    uni.navigateBack(
        {
            delta: 1
        }
    )
}
</script>

<style lang='scss' scoped>
.about-us {
    margin-top: 90rpx;

    .logo {
        :deep(.u-image) {
            margin: 0 auto;
        }
    }

    .title {
        text-align: center;
        margin-top: 30rpx;
        color: gray;
    }
}
</style>
