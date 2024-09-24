<template>
    <view>
        <Navbar :bgColor="'#a6ffcb'">
            <template #left>
                <view>
                    <u-icon name="arrow-left" size="20" color="#303133" @click="back"></u-icon>
                </view>
            </template>
            <template #center>
                <view>
                    <text>报修</text>
                </view>
            </template>
        </Navbar>
        <!-- #ifdef APP -->
        <u-gap height="20"></u-gap>
        <!-- #endif -->
        <view>
            <u-form :model="form" :rules="rules" ref="form">
                <u-form-item label="标题" prop="title">
                    <u-input v-model="form" placeholder="请输入标题"></u-input>
                </u-form-item>
                <u-form-item label="内容" prop="content">
                    <u-input v-model="form" placeholder="请输入内容"></u-input>
                </u-form-item>
            </u-form>
        </view>
    </view>
    <u-toast ref="toast"></u-toast>
</template>

<script setup lang='ts'>
import { ref, reactive, watch, onMounted } from 'vue'
import Navbar from "@/components/layout/navbar/navbar.vue"
import showtoast from "@/utils/showtoast"
import request from '@/utils/request'
const toast = ref<any>()
let form = ref({

})
const rules = [
    {

    }
]
onMounted(() => {
    showtoast.onbind(toast.value)
})
function back() {
    uni.navigateBack({
        delta: 1
    })
}
</script>

<style lang='scss' scoped></style>
