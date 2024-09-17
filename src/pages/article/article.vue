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
import { onLoad } from "@dcloudio/uni-app"
import Navbar from "@/components/layout/navbar/navbar.vue"
import request from '@/utils/request'
let sendData = ref().
let slug = ref()
onLoad((query: any) => {
    if (query) {
        slug.value = query.slug
    }
    console.log(query.slug);
})
function getNews() {
    request({
        url: `/news/post/${slug}`,

    })
}
function back() {
    uni.navigateBack(
        {
            delta: 1
        }
    )
}
</script>

<style lang='scss' scoped></style>
