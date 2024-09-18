<template>
    <view class='moreNews'>
        <Navbar :bgColor="'#a6ffcb'">
            <template #left>
                <view>
                    <u-icon name="arrow-left" size="20" color="#303133" @click="back"></u-icon>
                </view>
            </template>
            <template #center>
                <view>
                    <text>更多新闻</text>
                </view>
            </template>
        </Navbar>
        <!-- #ifdef APP -->
        <u-gap height="20"></u-gap>
        <!-- #endif -->
        <view class="moreNews-list">
            <u-list @scrolltolower='scrolltolower' class="list">
                <u-list-item>
                    <u-cell v-for="item in currentNewsList" isLink @click="toArticle(item)">
                        <template #title>
                            <view class="img">
                                <u-image :src="item.cover" width="100rpx" height="100rpx" lazyLoad />
                            </view>
                        </template>
                        <template #value>
                            <view class="text u-flex u-flex-direction-column">
                                <text class="title">{{ item.title }}</text>
                                <text class="describe">{{ item.description }}</text>
                            </view>
                        </template>
                    </u-cell>
                    <view>
                        <u-loadmore :status="status" loading-text='正在加载中...' loadmore-text='加载更多' nomore-text='没有更多了' />
                    </view>
                </u-list-item>
            </u-list>
        </view>
        <u-toast ref="toast"></u-toast>
    </view>
</template>

<script setup lang='ts'>
import { onMounted, ref, toRaw, reactive, shallowRef, watch, onUnmounted } from 'vue'
import Navbar from "@/components/layout/navbar/navbar.vue"
import request from '@/utils/request'
import showtoast from "@/utils/showtoast"
let NewsList = ref<any>([])
let currentNewsList = ref<any>([])
let toast = ref()
let toEnd = ref(false)
let status = ref('loadmore')
let currentPage = ref(1)
onMounted(() => {
    showtoast.onbind(toast.value)
    getNews()
})
function getNews() {
    status.value = 'loading'
    request({
        url: '/news/page',
        data: {
            page: currentPage.value,
            pageSize: 10
        }
    }).then((res: any) => {
        if (res.success) {
            if (res.data.records.length != 0) {
                NewsList.value = res.data.records
                currentNewsList.value.push(...NewsList.value)
                status.value = 'loadmore'
            } else {
                toEnd.value = true
                status.value = 'nomore'
            }
        } else {
            showtoast.onError(res.message)
        }
    }).catch((err) => {
        showtoast.onError(err)
    })
}
function scrolltolower() {
    if (toEnd.value) {
        status.value = 'nomore'
    } else {
        currentPage.value += 1
        uni.$u.debounce(getNews, 200, false)
    }

}
function toArticle(item) {
    if (item.slug != undefined && item.slug != '' && item.slug != null) {
        uni.navigateTo({
            url: '/pages/article/article?slug=' + item.slug,
        })
    }
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
.moreNews {
    .moreNews-list {
        .list {
            height: 90vh !important;

            .img {}

            .text {
                margin-left: 20rpx;
                line-height: 1.5;
                display: flex;
                flex-direction: column;
                flex: 1;
                width: 70%;

                .title {
                    font-size: 34rpx;
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                }

                .describe {
                    font-size: 26rpx;
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                    color: $subtitle;
                    width: auto;
                }
            }
        }
    }
}
</style>
