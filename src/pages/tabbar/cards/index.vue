<template>
    <layout class="card">
        <u-gap height="50rpx" bgColor="#F3F4F6"></u-gap>
        <view class="card-info">
            <view>
                <view class="card-title">
                    一卡通：
                </view>
                <view class="card-subtitle">
                    学号/工号：
                </view>
            </view>
            <view class="card-number">
                卡号：
            </view>
        </view>
        <view class="card-btn">
            <template v-for="(item, index) in BtnItem" :key="index">
                <view class="btn-item" @click="routeto()">
                    <u-icon v-if="item.icon != ''" :name="item.icon" color="#34B5FA" size="24"></u-icon>
                    <view v-else style="height: 24px;" v-html="item.svg"></view>
                    <text class="btn-text">{{ item.title }}</text>
                </view>
            </template>
        </view>
    </layout>
</template>

<script setup lang='ts'>
import layout from "@/components/layout/index.vue"
import { reactive, ref, onMounted } from "vue"
import { settings } from "@/settings/settings"
let cardbg = ref(settings.cardBg)
let BtnItem = reactive([
    {
        icon: 'scan',
        title: '扫一扫'
    },
    {
        icon: 'rmb-circle',
        title: '充值'
    },
    {
        icon: '',
        svg: '<svg t="1726147632148" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="6477" width="24" height="24"><path d="M896 107.328H320a96 96 0 0 0-96 96v96H128a96 96 0 0 0-96 96v408a96 96 0 0 0 96 96h217.92a24 24 0 0 0 0-48H128a48 48 0 0 1-48-48V395.328a48 48 0 0 1 48-48h576a48 48 0 0 1 48 48v242.88a24 24 0 0 0 48 0v-58.88H896a96 96 0 0 0 96-96V203.328a96 96 0 0 0-96-96z m48 376a48 48 0 0 1-48 48h-96V395.328a96 96 0 0 0-96-96H272v-96a48 48 0 0 1 48-48h576a48 48 0 0 1 48 48v280z" fill="#34B5FA" p-id="6478"></path><path d="M263.36 715.52v-30.72a72.32 72.32 0 0 0 51.84-22.08 75.52 75.52 0 0 0 19.648-52.352 66.688 66.688 0 0 0-18.24-47.488 85.76 85.76 0 0 0-23.04-15.36l-30.208-8.64V451.968a37.888 37.888 0 0 1 23.04 12.032c6.4 7.808 10.432 17.344 11.52 27.328l30.72-4.8a69.504 69.504 0 0 0-23.488-45.12 76.16 76.16 0 0 0-41.792-15.36v-14.4h-17.728v14.4c-16.32 0.704-32.064 6.4-45.12 16.32a65.792 65.792 0 0 0-24.512 52.8c-0.32 11.2 2.368 22.336 7.68 32.192a52.48 52.48 0 0 0 24 24c11.84 6.656 24.64 11.52 37.952 14.4v96a45.376 45.376 0 0 1-30.272-17.728A73.856 73.856 0 0 1 202.88 608l-30.208 5.76c0.128 14.912 4.288 29.44 11.968 42.24 5.76 9.984 14.272 18.176 24.512 23.488 11.584 5.248 23.872 8.64 36.48 10.112v30.208l17.728-4.288z m0-147.392a70.4 70.4 0 0 1 32.64 17.728 40.32 40.32 0 0 1 8.192 26.368 47.872 47.872 0 0 1-11.52 32.192 47.68 47.68 0 0 1-29.312 15.36V568.128z m-18.688-33.088a59.072 59.072 0 0 1-28.352-16.832 37.824 37.824 0 0 1-8.64-25.408 35.456 35.456 0 0 1 10.56-26.88 48.128 48.128 0 0 1 27.392-14.4L244.672 535.04z" fill="#34B5FA" p-id="6479"></path><path d="M780.8 887.36l-52.288-52.8a16.384 16.384 0 0 0-9.152-4.352 141.632 141.632 0 1 0-19.648 19.648 13.248 13.248 0 0 0 4.352 9.152l52.352 52.8a16.768 16.768 0 0 0 12.48 4.8 17.92 17.92 0 0 0 17.792-17.28 17.408 17.408 0 0 0-5.312-12.48l-0.576 0.512z m-64.768-144a105.024 105.024 0 1 1-210.176-1.92 105.152 105.152 0 0 1 210.24 0.896l-0.064 1.024z" fill="#34B5FA" p-id="6480"></path><path d="M680 455.808a24 24 0 0 0-24-24h-192a24 24 0 0 0 0 48h192a24 24 0 0 0 24-24z" fill="#34B5FA" p-id="6481"></path></svg>',
        title: '卡余额'
    },
    {
        icon: '',
        svg: '<svg t="1726146540180" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5211" width="24" height="24"><path d="M75.8 45.1h366.9C480 48.7 471 113.6 471 155.7v200.6c0 43.6 8.3 97.1-20.9 109.4-19 8.1-70.2 2.4-94.8 2.4H160.8c-45 0-106.4 10.6-113.3-28v-367c5-13.7 13.8-23.6 28.3-28m50.5 82.7v261.4H391V124.1H127.5c-1.4 0.2-1.3 1.9-1.2 3.7m442-82.7h366.9c15 5.5 25.2 15.6 28.3 32.8v357.5c-3.4 14.9-11.2 27.5-25.9 31.6-23.9 6.7-63.7 1.2-92.3 1.2H657c-28.4 0-70.5 5.9-93.6-1.2-32.6-10-23.4-72.8-23.4-116.7V163c0-50.7-11.3-110.8 28.3-117.9m50.5 82.7v261.4h264.7V124.1H620c-1.4 0.2-1.3 1.9-1.2 3.7m-371.9 76.6c36.9-6.9 65.9 17.7 66.5 51.1 0.8 44-44.7 68.1-80 49.9-40.5-21-37.8-91.5 13.5-101m492.6 0c86.8-16 85.2 119.8 0 105.8-54.2-9-56-95.5 0-105.8M440.3 961.9H77c-15.1-4.6-25.3-14-29.6-29.2v-366C51 556 59.3 543.5 72 539.9c24.1-6.7 63.5-1.2 92.4-1.2h188.4c27.8 0 68.4-6.1 93.6 1.2 34.1 9.9 24.6 71.7 24.6 115.5v193.3c0 47.4 10.3 109-30.7 113.2m-314-340.5v261.4H391v-265H127.5c-1.4 0.2-1.3 1.9-1.2 3.6m837.3-49.8v102.1c-2.9 34.4-0.4 74.2-1.2 110.6H700.1v-59.6c-24.6-2.8-54.6-0.4-81.3-1.2-2.9 77-0.4 159.3-1.2 238.3h-48C528.2 953.7 540 892.5 540 844V655.5c0-28.3-5.8-70.8 1.2-93.6 8.4-27.2 44.8-23.1 81.3-23.1H801v161.7h82.5c0.8-53.5-1.6-110.2 1.2-161.7 39.8-2.4 76.5-1.8 78.9 32.8M253.1 696.8c39.4-4.3 71.9 33.1 56.6 74.2-21.2 57-122.4 35.6-103.4-36.5 5.2-19.9 20.4-34.8 46.8-37.7m535.6 265.1H700c0.8-31.2-1.6-65.7 1.2-94.9h87.4v94.9m175-94.8v62c-3.4 17.3-13.7 27.8-29.5 32.8h-62.8c0.8-31.2-1.6-65.7 1.2-94.8h91.1" fill="#34B5FA" p-id="5212"></path></svg>',
        title: '付款码'
    }
])
function routeto() {

}
</script>

<style lang='scss' scoped>
.card {
    background-color: $page-bg;
    height: 100vh;

    .card-info {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        background-color: $moduleBackgroundColor;
        margin: 20rpx 10rpx;
        padding: 40rpx;
        border-radius: 8px;
        height: 460rpx;
        background-image: url('@/static/images/card.png');
        background-repeat: no-repeat;
        background-size: cover;
        color: #0080ff;

        .card-title {
            font-size: 40rpx;
        }

        .card-subtitle {
            font-size: 40rpx;
        }

        .card-number {
            text-align: end;
        }
    }

    .card-btn {
        margin: 15rpx 10rpx;
        background-color: $moduleBackgroundColor;
        border-radius: 8px;
        display: grid;
        grid-template-columns: auto auto auto auto;

        .btn-item {
            display: flex;
            flex-direction: column;
            align-items: center;
            border: 1px solid #F7F7F7;
            padding: 20rpx;

            .btn-text {
                margin-top: 10rpx;
            }
        }
    }
}
</style>
