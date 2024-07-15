<template>
    <view>

    </view>
</template>

<script setup lang='ts'>
import { onMounted, toRaw, ref, onUnmounted } from 'vue'
import { webSoketInit, sendMessage, websoket, closeSocket } from '@/apis/websocket'
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
