<template>
    <layout class="card">
        <u-gap height="10rpx" bgColor="#F3F4F6"></u-gap>
        <view class="card-info">
            <u-cell-group>
                <u-cell icon="setting-fill" title="个人设置"></u-cell>
                <u-cell icon="integral-fill" title="会员等级" value="新版本"></u-cell>
            </u-cell-group>
        </view>
        <view class="card-btn">
            <view class="btn-item" @click="routeto()" v-for="(item, index) in BtnItem" :key="index">
                <u-image src="/static/images/chongzhi.png" shape="circle" width="100rpx" height="100rpx"></u-image>
                <text class="btn-text">123</text>
            </view>
        </view>
    </layout>
</template>

<script setup lang='ts'>
import layout from "@/components/layout/index.vue"
import { reactive, ref, onMounted } from "vue"
let BtnItem = reactive([
    {

    }
])
function routeto() {

}
</script>

<style lang='scss' scoped>
.card {
    background-color: $page-bg;
    height: 100vh;

    .card-info {
        background-color: $moduleBackgroundColor;
        margin: 5rpx 10rpx;
        border-radius: 8px;
    }

    .card-btn {
        margin: 15rpx 10rpx;
        background-color: $moduleBackgroundColor;
        border-radius: 8px;
    }
}
</style>
