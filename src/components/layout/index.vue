<template>
    <view class="container">
        <slot></slot>
        <tabbar></tabbar>
        <nonetwork></nonetwork>
    </view>
</template>

<script setup lang='ts'>
import tabbar from './tabbar/tabbar.vue'
import nonetwork from '@/components/NoNetwork/nonetwork.vue'
</script>

<style lang='scss' scoped></style>
