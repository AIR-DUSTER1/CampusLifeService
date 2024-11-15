<template>
    <view class="Suggestions">
        <Navbar :bgColor="'#a6ffcb'">
            <template #left>
                <view>
                    <u-icon name="arrow-left" size="20" color="#303133" @click="back"></u-icon>
                </view>
            </template>
            <template #center>
                <view>
                    <text>建议</text>
                </view>
            </template>
        </Navbar>
        <!-- #ifdef APP || MP-WEIXIN -->
        <u-gap height="20"></u-gap>
        <!-- #endif -->
        <view>

        </view>
    </view>
</template>

<script setup lang='ts'>
import Navbar from "@/components/layout/navbar/navbar.vue"
function back() {
    uni.navigateBack(
        {
            delta: 1
        }
    )
}
</script>

<style lang='scss' scoped></style>
