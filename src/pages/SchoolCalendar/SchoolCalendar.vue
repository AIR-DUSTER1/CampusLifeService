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
                    <text>校历</text>
                </view>
            </template>
        </Navbar>
        <!-- #ifdef APP -->
        <u-gap height="30"></u-gap>
        <!-- #endif -->
        <view style="height:80vh;width:100%">
            <u-image :src="img" height="1000rpx" width="100%" ></u-image>
        </view>
    </view>
    <u-toast ref="toast"></u-toast>
</template>

<script setup lang='ts'>
import { ref, reactive, watch, onMounted } from 'vue'
import Navbar from "@/components/layout/navbar/navbar.vue"
import showtoast from "@/utils/showtoast"
import request from '@/utils/request'
const toast = ref()
let img = ref('https://qdbhu.edu.cn/UpBinhais/Images/20240808/84744fea-404c-4d32-80c7-9b2861f443c5.jpg')
onMounted(() => {
    showtoast.onbind(toast.value)
    getSchoolCalendar()
})
function getSchoolCalendar() {

}
function back() {
    uni.navigateBack({
        delta: 1
    })
}
</script>

<style lang='scss' scoped></style>
