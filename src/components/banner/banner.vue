<template>
    <u-swiper v-if="list.length > 0" :list="list" :autoplay="true" circular interval="2000" height="260rpx">
    </u-swiper>
</template>

<script setup lang='ts'>
import { reactive, ref, onMounted, watch } from 'vue'
import banner1 from '@/static/images/banner1.jpg'
import banner2 from '@/static/images/banner2.jpg'
import banner3 from '@/static/images/banner3.jpg'
let props = defineProps(['bannerImg'])
const list = reactive<any>([
    banner1, banner2, banner3
])
watch(props.bannerImg, (value) => {
    list.splice(0, list.length)
    if (value.length == 1) {
        list.push(...value, banner1, banner2)
    } else if (value.length == 2) {
        list.push(...value, banner1)
    } else if (value.length == 3) {
        list.push(...value)
    } else if (value.length == 0) {
        list.push(banner1, banner2, banner3)
    }
})
onMounted(() => {

})
</script>

<style lang='scss' scoped></style>
