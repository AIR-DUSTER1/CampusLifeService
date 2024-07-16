<template>
    <view>
        <up-no-network @disconnected="disconnected" @connected="connected" @retry="retry"></up-no-network>
    </view>
</template>

<script setup lang='ts'>
function disconnected() {
    console.log('disconnected');
}

function connected() {
    console.log('connected');
}

function retry() {
    console.log('retry');
}  
</script>

<style lang='scss' scoped></style>
