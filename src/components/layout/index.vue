<template>
    <view class="container">
        <slot></slot>
        <tabbar></tabbar>
    </view>
</template>

<script setup lang='ts'>
import tabbar from './tabbar/tabbar.vue';
</script>

<style lang='scss' scoped></style>
