<template>
    <view>
        <u-no-network @disconnected="disconnected" @connected="connected" @retry="retry"></u-no-network>
        <u-toast ref="toast"></u-toast>
    </view>
</template>

<script setup lang='ts'>
import showtoast from "@/utils/showtoast"
import { onBeforeMount, onMounted, onUnmounted, ref } from 'vue'
import { onLoad, onReady, onShow } from '@dcloudio/uni-app'
const toast = ref()
onMounted(() => {
    showtoast.onbind(toast.value)
})
function disconnected() {
    if (toast.value && showtoast.ref != null) {
        showtoast.onError('网络断开连接')
    } else {
        showtoast.onbind(toast.value)
        showtoast.onSuccess('网络已连接')
    }
}

function connected() {
    if (toast.value && showtoast.ref != null) {
        showtoast.onSuccess('网络已连接')
    } else {
        showtoast.onbind(toast.value)
        showtoast.onSuccess('网络已连接')
    }
}

function retry() {
    if (toast.value && showtoast.ref != null) {
        showtoast.onLoading('正在重连')
    } else {
        showtoast.onbind(toast.value)
        showtoast.onLoading('正在重连')
    }
}  
</script>

<style lang='scss' scoped></style>
