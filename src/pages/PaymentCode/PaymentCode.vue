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
                    <text>付款码</text>
                </view>
            </template>
        </Navbar>
        <!-- #ifdef APP -->
        <u-gap height="20"></u-gap>
        <!-- #endif -->
        <view class="payment-code">
            <u-image width="200px" height="200px" class="img" @click=""></u-image>
            <view>{{ setTime }}秒后自动刷新</view>
        </view>
    </view>
    <u-toast ref="toast"></u-toast>
</template>

<script setup lang='ts'>
import { ref, reactive, watch, onMounted } from 'vue'
import Navbar from "@/components/layout/navbar/navbar.vue"
import showtoast from "@/utils/showtoast"
import request from '@/utils/request'
const toast = ref<any>()
let setTime = ref(60)
onMounted(() => {
    showtoast.onbind(toast.value)
    setTimer()
})
function getCode() {

}
function setTimer() {
    setInterval(() => {
        setTime.value--
        if (setTime.value <= 0) {
            setTime.value = 60
        }
    }, 1000)
}
function back() {
    uni.navigateBack({
        delta: 1
    })
}
</script>

<style lang='scss' scoped>
.payment-code {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    border: 1px solid #ccc;
    border-radius: 16rpx;
    margin: 80rpx;
    padding: 80rpx 0;

    .img {
        padding-bottom: 10rpx;
    }
}
</style>
