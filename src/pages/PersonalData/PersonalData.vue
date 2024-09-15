<template>
    <view class="PersonData">
        <Navbar :bgColor="'#a6ffcb'">
            <template #left>
                <view>
                    <u-icon name="arrow-left" size="20" color="#303133" @click="back"></u-icon>
                </view>
            </template>
            <template #center>
                <view>
                    <text>个人资料</text>
                </view>
            </template>
        </Navbar>
        <view>

        </view>
    </view>
</template>

<script setup lang='ts'>
import { onMounted, ref, toRaw, reactive, shallowRef, watch, onUnmounted } from 'vue'
import { webSoketInit, sendMessage, websoket, closeSocket } from '@/apis/websocket'
import Navbar from "@/components/layout/navbar/navbar.vue"
let sendData = ref()

function back() {
    uni.navigateBack()
}
</script>

<style lang='scss' scoped></style>
