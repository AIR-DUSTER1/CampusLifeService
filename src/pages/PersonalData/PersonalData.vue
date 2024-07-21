<template>
    <view class="PersonData">
        <Navbar :bgColor="'#a6ffcb'">
            <template #left>

            </template>
            <template #center>
                <view>
                    <text>个人资料</text>
                </view>
            </template>
        </Navbar>
    </view>
</template>

<script setup lang='ts'>
import { onMounted, ref, toRaw, reactive, shallowRef, watch, onUnmounted } from 'vue'
import { webSoketInit, sendMessage, websoket, closeSocket } from '@/apis/websocket'
import Navbar from "@/components/layout/navbar/navbar.vue"
let sendData = ref()
onMounted(() => {
    webSoketInit()
    sendMessage(JSON.stringify(toRaw(sendData.value)))
    websoket.value.addEventListener('message', function (event) {
        console.log('Message from server ', event.data)
    })
})
onUnmounted(() => {
    closeSocket()
})
</script>

<style lang='scss' scoped></style>
