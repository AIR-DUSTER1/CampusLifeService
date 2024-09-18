<template>
    <view class="article">
        <Navbar :bgColor="'#a6ffcb'">
            <template #left>
                <view>
                    <u-icon name="arrow-left" size="20" color="#303133" @click="back"></u-icon>
                </view>
            </template>
            <template #center>
                <view v-if="news">
                    {{ news.title }}
                </view>
            </template>
        </Navbar>
        <!-- #ifdef APP -->
        <u-gap height="30"></u-gap>
        <!-- #endif -->
        <view class="news-info" v-if="news">
            <view class="news-info-title">
                {{ news.title }}
            </view>
            <view class="news-info-briefInfo">
                作者：{{ news.author }}
                修改时间：{{ news.updateTime ? formatDateTime(news.createTime) : formatDateTime(news.updateTime) }}
            </view>
            <view class="news-info-content">
                <u-parse :content="news.content" :tagStyle="styles" :lazyLoad="true" scrollTable selectable></u-parse>
            </view>
        </view>
        <u-toast ref="toast"></u-toast>
    </view>
</template>

<script setup lang='ts'>
import { onMounted, ref, toRaw, reactive, shallowRef, watch, onUnmounted } from 'vue'
import { onLoad } from "@dcloudio/uni-app"
import Navbar from "@/components/layout/navbar/navbar.vue"
import request from '@/utils/request'
import showtoast from "@/utils/showtoast"
const toast = ref()
let slug = ref()
let news = ref()
const styles = {
};
onLoad((query: any) => {
    if (query) {
        slug.value = query.slug
    }
    console.log(query.slug);
})
onMounted(() => {
    showtoast.onbind(toast.value)
    getNews()
})
function getNews() {
    request({
        url: `/news/post/${slug.value}`,
    }).then((res) => {
        if (res.success) {
            news.value = res.data
            console.log(res.data)
        } else {
            showtoast.onError(res.message)
        }
    }).catch((err) => {
        showtoast.onError(err)
    })
}
function formatDateTime(timestamp: number): string {
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // 月份从0开始，所以加1
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}
function back() {
    uni.navigateBack(
        {
            delta: 1
        }
    )
}
</script>

<style lang='scss' scoped>
.article {
    .news-info {
        .news-info-title {
            text-align: center;
            font-size: 56rpx;
            font-weight: 600;
        }

        .news-info-briefInfo {
            text-align: center;
            font-size: 28rpx;
            margin: 20rpx 0;
        }

        .news-info-content {
            max-width: 100%;
        }
    }

}
</style>
