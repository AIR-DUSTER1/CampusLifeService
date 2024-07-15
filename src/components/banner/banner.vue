<template>
    <u-swiper :list="list" :autoplay="true" circular interval="2000" height="260rpx">
    </u-swiper>
</template>

<script setup lang='ts'>
import { reactive, ref } from 'vue'
const list = reactive([
    'https://cdn.uviewui.com/uview/swiper/swiper3.png',
    'https://cdn.uviewui.com/uview/swiper/swiper2.png',
    'https://cdn.uviewui.com/uview/swiper/swiper1.png',
]);

</script>

<style lang='scss' scoped></style>
