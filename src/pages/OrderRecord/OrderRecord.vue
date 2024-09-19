<template>
    <view class="OrderRecord">
        <Navbar :bgColor="'#a6ffcb'">
            <template #left>
                <view>
                    <u-icon name="arrow-left" size="20" color="#303133" @click="back"></u-icon>
                </view>
            </template>
            <template #center>
                <view>
                    <text>一卡通充值</text>
                </view>
            </template>
        </Navbar>
        <!-- #ifdef APP -->
        <u-gap height="20"></u-gap>
        <!-- #endif -->
        <view class="order-list">
            <u-list @scrolltolower='scrolltolower' height="auto" class="list">
                <u-list-item>
                    <u-cell>
                        <template #title>
                            <view>
                                炸酱面
                            </view>
                            <view>
                                9-17 12:00
                            </view>
                        </template>
                        <template #value>
                            <view>
                                13.00
                            </view>
                        </template>
                    </u-cell>
                    <view>
                        <u-loadmore :status="status" loading-text='正在加载中...' loadmore-text='加载更多' nomore-text='没有更多了' />
                    </view>
                </u-list-item>
            </u-list>
        </view>
    </view>
</template>

<script setup lang='ts'>
import { onMounted, ref, toRaw, reactive, shallowRef, watch, onUnmounted } from 'vue'
import Navbar from "@/components/layout/navbar/navbar.vue"
let status = ref('loadmore')
onMounted(() => {
    getNews()
})
function getNews() {

}
function scrolltolower() {

}
function back() {
    uni.navigateBack({
        delta: 1
    })
}
</script>

<style lang='scss' scoped></style>
