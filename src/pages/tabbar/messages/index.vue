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
        <!-- #ifdef APP -->
        <u-gap height="20"></u-gap>
        <!-- #endif -->
        <view class="Message-list" v-if="!upEmpty">
            <u-list @scrolltolower='scrolltolower' class="list">
                <u-list-item>
                    <u-cell v-for="item in messageList" isLink @click="toMessage(item)">
                        <template #title>
                            <view class="text u-flex u-flex-direction-column">
                                <text class="title">{{ item.title }}</text>
                            </view>
                        </template>
                        <template #label>
                            <text class="describe">{{ item.content }}</text>
                        </template>
                    </u-cell>
                </u-list-item>
            </u-list>
        </view>
        <u-toast ref="toast"></u-toast>
        <u-empty class="empty" :show="upEmpty" mode="message" text="暂无通知">
        </u-empty>
    </layout>
</template>

<script setup lang='ts'>
import layout from "@/components/layout/index.vue"
import Navbar from "@/components/layout/navbar/navbar.vue"
import { ref, reactive, watch } from 'vue'
import { onLoad, onShow } from '@dcloudio/uni-app'
import request from '@/utils/request'
import showtoast from "@/utils/showtoast"
let upEmpty = ref(true)
let toast = ref()
let currentPage = ref(1)
interface message {
    title: string,
    content: string
}
let messageList = ref<message[]>([

])
onLoad(() => {
    showtoast.onbind(toast.value)
    getList()
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
    request({
        url:'/system/notice/page',
        data:{
            page:currentPage.value,
            pageSize:10
        }
    }).then((res:any) => {
        if (res.success) {
            messageList.value = res.data.records
            console.log(res.data);
        } else {
            showtoast.onError(res.message)
        }
    }).catch((err) => {
        showtoast.onError(err)
    })
}
function empty() {
    if (messageList.value.length == 0) {
        upEmpty.value = true
    } else if (messageList.value.length > 0) {
        upEmpty.value = false
    }
}
function toMessage(item) {
    uni.navigateTo({
        url: '/pages/message/message?nid=' + item.nid
    })
}
</script>

<style lang='scss' scoped>
.navbar {
    background-color: $page-bg;
    height: calc(100vh - 103rpx);

    .list {
        height: calc(100vh - 190rpx) !important;
        background-color: $moduleBackgroundColor;
    }

    .empty {
        height: calc(100vh - 200rpx);
    }
}
.title{
    font-size: 40rpx;
}
.describe{
    margin-top: 10rpx;
    color: $subtitle;
}
</style>
