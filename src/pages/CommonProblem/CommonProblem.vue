<template>
    <view>
        <Navbar :bgColor="'#a6ffcb'">
            <template #left>
                <view>
                    <u-icon v-if="current == null" name="arrow-left" size="20" color="#303133" @click="back"></u-icon>
                    <u-icon v-else name="arrow-left" size="20" color="#303133" @click="back"></u-icon>
                </view>
            </template>
            <template #center>
                <view>
                    <text>常见问题</text>
                </view>
            </template>
        </Navbar>
        <!-- #ifdef APP -->
        <u-gap height="20"></u-gap>
        <!-- #endif -->
        <view v-if="current == null">
            <u-cell-group title="常见问题" :customStyle="{ 'fontSize': '32rpx' }">
                <u-cell isLink v-for="item in ProblemList" :key="item.title" @click="toProblem(item)">
                    <template #title>
                        <view>
                            {{ item.title }}
                        </view>
                    </template>
                </u-cell>
            </u-cell-group>
        </view>
        <view v-else class="common-content">
            <view class="title">{{ current.title }}</view>
            <u-gap height="20"></u-gap>
            <view class="content">{{ current.content }}</view>
        </view>
    </view>
</template>

<script setup lang='ts'>
import { onMounted, ref, toRaw, reactive } from 'vue'
import Navbar from "@/components/layout/navbar/navbar.vue"
let current = ref<any>(null)
let ProblemList = [
    {
        title: '充值了没到账',
        content: '充值成功后，正常情况下，实时到账。如因学校网络问题，则预计两小时内到账，请耐心等待一下。提醒：如果查询订单成功超过两个小时还未到账，请去圈存机圈存，或者去卡务中心处理。',
        url: ''
    },
    {
        title: '怎么找回校园卡',
        content: '怎么找回校园卡？亲爱的同学，如果校园卡已被自己原手机号绑定，可用新手机号登录易校园，通过申诉的方式找回。您可在【系统设置-账户与安全-找回校园卡】操作找回校园卡。或在【校园卡-前往绑卡】重新绑定校园卡，根据操作提示申诉的方式找回校园卡。',
        url: ''
    },
]
function toProblem(item: any) {
    current.value = item
}
function back() {
    if (current.value == null) {
        uni.navigateBack(
            {
                delta: 1
            }
        )
    } else {
        current.value = null
    }
}
</script>

<style lang='scss' scoped>
.common-content {
    padding: 40rpx;

    .title {
        font-size: 40rpx;
        font-weight: bold;
    }

    .content {
        color: #6D6D6D;
    }
}
</style>
