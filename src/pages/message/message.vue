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
                    <text>{{title}}</text>
                </view>
            </template>
        </Navbar>
        <!-- #ifdef APP -->
        <u-gap height="20"></u-gap>
        <!-- #endif -->
        <view>
            <view class="notice-content">
                <view class="notice-title">
                    <text>{{content.title}}</text>
                </view>
                <view class="notice-time">
                    <text class="notice-time-text">{{content.updateBy?content.updateBy:content.createBy}}</text>
                    <text class="notice-time-text">{{content.updateTime?content.updateTime:content.createTime}}</text>
                </view>
                <view class="notice-content-text">
                    <text>{{content.content}}</text>
                </view>
            </view>
        </view>
        <u-toast ref="toast"></u-toast>
 </view>
</template>

<script lang="ts" setup>
 import Navbar from "@/components/layout/navbar/navbar.vue"
import request from "@/utils/request";
import { onLoad } from "@dcloudio/uni-app"
import { ref, reactive, watch, onMounted } from 'vue'
import showtoast from "@/utils/showtoast"
const toast = ref()
let nid = ref()
let title = ref('通知消息')
let content = ref({
    title:'',
    content:'',
    updateBy:'',
    updateTime:'',
    createBy:'',
    createTime:''
})
onLoad((query:any) => {
nid.value = query.nid
})
onMounted(() => {
    showtoast.onbind(toast.value)
    getNotice()
})
function getNotice(){
request({
    url:`/system/notice/getNotice/${nid.value}`
}).then((res:any) => {
    if (res.success) {
        console.log(res);
        title.value = res.data.title
        content.value = res.data
    } else {
        showtoast.onError(res.message)
    }
}).catch((err) => {
    showtoast.onError(err)
})
}
function back(){
    uni.navigateBack()
}
</script>

<style scoped lang="scss">
.notice-content{
    padding: 20rpx;
    .notice-title{
        text-align: center;
        font-size: 46rpx;
    }
    .notice-time{
        text-align: center;
        color: #999;
        margin-top: 20rpx;
        .notice-time-text{
            margin-right: 30rpx;
        }
    }
    .notice-content-text{
        text-indent: 2em;
        line-height: 50rpx;
        margin-top: 20rpx;
    }
}
</style>