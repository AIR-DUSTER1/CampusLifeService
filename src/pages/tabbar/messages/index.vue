<template>
    <layout class="navbar">
        <Navbar :bgColor="'#a6ffcb'">
            <template #left>
                <view></view>
            </template>
            <template #center>
                <view>
                    <text>消息中心</text>
                </view>
            </template>
        </Navbar>
        <u-list @scrolltolower="scrolltolower" class="list" v-show="!upEmpty">
            <u-list-item v-for="(item, index) in messageList" :key="index">
                <u-cell :title="`列表长度-${index + 1}`">
                    <template #icon>
                        <!-- <up-avatar shape="square" size="35" :src="item.url"
                                customStyle="margin: -3px 5px -3px 0"></up-avatar> -->
                    </template>
                </u-cell>
            </u-list-item>
        </u-list>
        <u-empty class="empty" :show="upEmpty" mode="message" text="暂无通知">
        </u-empty>
    </layout>
</template>

<script setup lang='ts'>
import layout from "@/components/layout/index.vue"
import Navbar from "@/components/layout/navbar/navbar.vue"
import { ref, reactive, watch } from 'vue'
import { onLoad, onShow } from '@dcloudio/uni-app'
let upEmpty = ref(true)
interface message {
    title: string,
    content: string
}
let messageList = reactive<message[]>([

])
onLoad(() => {
    loadmore()
    empty()
})

watch(messageList, (value) => {
    empty()
})
const scrolltolower = () => {
    loadmore()
}

const loadmore = () => {

}
function getList() {

}
function empty() {
    if (messageList.length == 0) {
        upEmpty.value = true
    } else if (messageList.length > 0) {
        upEmpty.value = true
    }
}
</script>

<style lang='scss' scoped>
.navbar {
    background-color: $page-bg;
    height: calc(100vh - 103rpx);

    .list {
        background-color: $moduleBackgroundColor;
    }

    .empty {
        height: calc(100vh - 200rpx);
    }
}
</style>
