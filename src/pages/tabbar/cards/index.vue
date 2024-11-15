<template>
    <layout class="card">
        <u-gap height="50rpx" bgColor="#F3F4F6"></u-gap>
        <up-image class="cardbg" :show-loading="true" :src="cardbg" width="98%" height="300px" shape="square" radius="40px" mode="widthFix"></up-image>
        <view class="card-info">
            <view>
                <view class="card-title">
                    一卡通：
                </view>
                <view class="card-subtitle">
                    学号/工号：{{ userinfo.number }}
                </view>
            </view>
            <view class="card-number">
                卡号：{{ cardInfo.carNo }}
            </view>
        </view>
        <view class="card-btn">
            <template v-for="(item, index) in BtnItem" :key="index">
                <view class="btn-item" @click="routeto(item)">
                    <u-icon v-if="item.icon != ''" :name="item.icon" color="#34B5FA" size="24"></u-icon>
                    <up-image v-else  :show-loading="true"  width="24px" height="24px" :src="item.svg" ></up-image>
                    <!-- <view v-else style="height: 24px;" v-html="item.svg"></view> -->
                    <text class="btn-text">{{ item.title }}</text>
                </view>
            </template>
        </view>
    </layout>
    <u-toast ref="toast"></u-toast>
</template>

<script setup lang='ts'>
import layout from "@/components/layout/index.vue"
import { reactive, ref, onMounted, computed } from "vue"
import { settings } from "@/settings/settings"
import showtoast from "@/utils/showtoast"
import request from "@/utils/request"
// import cardBg from '@/static/images/card3.png'
import { onLoad } from "@dcloudio/uni-app"
import useCard from '@/store/card'
import useUserStore from '@/store/user'
const store = useUserStore()
let userinfo = computed(() => store.userinfo)
const card = useCard()
let cardbg = ref(settings.cardBg)
let cardInfo = computed(() => card.cardinfo)
const toast = ref()
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
        svg: 'data:image/svg+xml;base64,PHN2ZyB0PSIxNzI2MTQ3NjMyMTQ4IiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjY0NzciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCI+PHBhdGggZD0iTTg5NiAxMDcuMzI4SDMyMGE5NiA5NiAwIDAgMC05NiA5NnY5NkgxMjhhOTYgOTYgMCAwIDAtOTYgOTZ2NDA4YTk2IDk2IDAgMCAwIDk2IDk2aDIxNy45MmEyNCAyNCAwIDAgMCAwLTQ4SDEyOGE0OCA0OCAwIDAgMS00OC00OFYzOTUuMzI4YTQ4IDQ4IDAgMCAxIDQ4LTQ4aDU3NmE0OCA0OCAwIDAgMSA0OCA0OHYyNDIuODhhMjQgMjQgMCAwIDAgNDggMHYtNTguODhIODk2YTk2IDk2IDAgMCAwIDk2LTk2VjIwMy4zMjhhOTYgOTYgMCAwIDAtOTYtOTZ6IG00OCAzNzZhNDggNDggMCAwIDEtNDggNDhoLTk2VjM5NS4zMjhhOTYgOTYgMCAwIDAtOTYtOTZIMjcydi05NmE0OCA0OCAwIDAgMSA0OC00OGg1NzZhNDggNDggMCAwIDEgNDggNDh2MjgweiIgZmlsbD0iIzM0QjVGQSIgcC1pZD0iNjQ3OCI+PC9wYXRoPjxwYXRoIGQ9Ik0yNjMuMzYgNzE1LjUydi0zMC43MmE3Mi4zMiA3Mi4zMiAwIDAgMCA1MS44NC0yMi4wOCA3NS41MiA3NS41MiAwIDAgMCAxOS42NDgtNTIuMzUyIDY2LjY4OCA2Ni42ODggMCAwIDAtMTguMjQtNDcuNDg4IDg1Ljc2IDg1Ljc2IDAgMCAwLTIzLjA0LTE1LjM2bC0zMC4yMDgtOC42NFY0NTEuOTY4YTM3Ljg4OCAzNy44ODggMCAwIDEgMjMuMDQgMTIuMDMyYzYuNCA3LjgwOCAxMC40MzIgMTcuMzQ0IDExLjUyIDI3LjMyOGwzMC43Mi00LjhhNjkuNTA0IDY5LjUwNCAwIDAgMC0yMy40ODgtNDUuMTIgNzYuMTYgNzYuMTYgMCAwIDAtNDEuNzkyLTE1LjM2di0xNC40aC0xNy43Mjh2MTQuNGMtMTYuMzIgMC43MDQtMzIuMDY0IDYuNC00NS4xMiAxNi4zMmE2NS43OTIgNjUuNzkyIDAgMCAwLTI0LjUxMiA1Mi44Yy0wLjMyIDExLjIgMi4zNjggMjIuMzM2IDcuNjggMzIuMTkyYTUyLjQ4IDUyLjQ4IDAgMCAwIDI0IDI0YzExLjg0IDYuNjU2IDI0LjY0IDExLjUyIDM3Ljk1MiAxNC40djk2YTQ1LjM3NiA0NS4zNzYgMCAwIDEtMzAuMjcyLTE3LjcyOEE3My44NTYgNzMuODU2IDAgMCAxIDIwMi44OCA2MDhsLTMwLjIwOCA1Ljc2YzAuMTI4IDE0LjkxMiA0LjI4OCAyOS40NCAxMS45NjggNDIuMjQgNS43NiA5Ljk4NCAxNC4yNzIgMTguMTc2IDI0LjUxMiAyMy40ODggMTEuNTg0IDUuMjQ4IDIzLjg3MiA4LjY0IDM2LjQ4IDEwLjExMnYzMC4yMDhsMTcuNzI4LTQuMjg4eiBtMC0xNDcuMzkyYTcwLjQgNzAuNCAwIDAgMSAzMi42NCAxNy43MjggNDAuMzIgNDAuMzIgMCAwIDEgOC4xOTIgMjYuMzY4IDQ3Ljg3MiA0Ny44NzIgMCAwIDEtMTEuNTIgMzIuMTkyIDQ3LjY4IDQ3LjY4IDAgMCAxLTI5LjMxMiAxNS4zNlY1NjguMTI4eiBtLTE4LjY4OC0zMy4wODhhNTkuMDcyIDU5LjA3MiAwIDAgMS0yOC4zNTItMTYuODMyIDM3LjgyNCAzNy44MjQgMCAwIDEtOC42NC0yNS40MDggMzUuNDU2IDM1LjQ1NiAwIDAgMSAxMC41Ni0yNi44OCA0OC4xMjggNDguMTI4IDAgMCAxIDI3LjM5Mi0xNC40TDI0NC42NzIgNTM1LjA0eiIgZmlsbD0iIzM0QjVGQSIgcC1pZD0iNjQ3OSI+PC9wYXRoPjxwYXRoIGQ9Ik03ODAuOCA4ODcuMzZsLTUyLjI4OC01Mi44YTE2LjM4NCAxNi4zODQgMCAwIDAtOS4xNTItNC4zNTIgMTQxLjYzMiAxNDEuNjMyIDAgMSAwLTE5LjY0OCAxOS42NDggMTMuMjQ4IDEzLjI0OCAwIDAgMCA0LjM1MiA5LjE1Mmw1Mi4zNTIgNTIuOGExNi43NjggMTYuNzY4IDAgMCAwIDEyLjQ4IDQuOCAxNy45MiAxNy45MiAwIDAgMCAxNy43OTItMTcuMjggMTcuNDA4IDE3LjQwOCAwIDAgMC01LjMxMi0xMi40OGwtMC41NzYgMC41MTJ6IG0tNjQuNzY4LTE0NGExMDUuMDI0IDEwNS4wMjQgMCAxIDEtMjEwLjE3Ni0xLjkyIDEwNS4xNTIgMTA1LjE1MiAwIDAgMSAyMTAuMjQgMC44OTZsLTAuMDY0IDEuMDI0eiIgZmlsbD0iIzM0QjVGQSIgcC1pZD0iNjQ4MCI+PC9wYXRoPjxwYXRoIGQ9Ik02ODAgNDU1LjgwOGEyNCAyNCAwIDAgMC0yNC0yNGgtMTkyYTI0IDI0IDAgMCAwIDAgNDhoMTkyYTI0IDI0IDAgMCAwIDI0LTI0eiIgZmlsbD0iIzM0QjVGQSIgcC1pZD0iNjQ4MSI+PC9wYXRoPjwvc3ZnPg==',
        title: '卡余额'
    },
    {
        icon: '',
        svg: 'data:image/svg+xml;base64,PHN2ZyB0PSIxNzI2MTQ2NTQwMTgwIiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjUyMTEiIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCI+PHBhdGggZD0iTTc1LjggNDUuMWgzNjYuOUM0ODAgNDguNyA0NzEgMTEzLjYgNDcxIDE1NS43djIwMC42YzAgNDMuNiA4LjMgOTcuMS0yMC45IDEwOS40LTE5IDguMS03MC4yIDIuNC05NC44IDIuNEgxNjAuOGMtNDUgMC0xMDYuNCAxMC42LTExMy4zLTI4di0zNjdjNS0xMy43IDEzLjgtMjMuNiAyOC4zLTI4bTUwLjUgODIuN3YyNjEuNEgzOTFWMTI0LjFIMTI3LjVjLTEuNCAwLjItMS4zIDEuOS0xLjIgMy43bTQ0Mi04Mi43aDM2Ni45YzE1IDUuNSAyNS4yIDE1LjYgMjguMyAzMi44djM1Ny41Yy0zLjQgMTQuOS0xMS4yIDI3LjUtMjUuOSAzMS42LTIzLjkgNi43LTYzLjcgMS4yLTkyLjMgMS4ySDY1N2MtMjguNCAwLTcwLjUgNS45LTkzLjYtMS4yLTMyLjYtMTAtMjMuNC03Mi44LTIzLjQtMTE2LjdWMTYzYzAtNTAuNy0xMS4zLTExMC44IDI4LjMtMTE3LjltNTAuNSA4Mi43djI2MS40aDI2NC43VjEyNC4xSDYyMGMtMS40IDAuMi0xLjMgMS45LTEuMiAzLjdtLTM3MS45IDc2LjZjMzYuOS02LjkgNjUuOSAxNy43IDY2LjUgNTEuMSAwLjggNDQtNDQuNyA2OC4xLTgwIDQ5LjktNDAuNS0yMS0zNy44LTkxLjUgMTMuNS0xMDFtNDkyLjYgMGM4Ni44LTE2IDg1LjIgMTE5LjggMCAxMDUuOC01NC4yLTktNTYtOTUuNSAwLTEwNS44TTQ0MC4zIDk2MS45SDc3Yy0xNS4xLTQuNi0yNS4zLTE0LTI5LjYtMjkuMnYtMzY2QzUxIDU1NiA1OS4zIDU0My41IDcyIDUzOS45YzI0LjEtNi43IDYzLjUtMS4yIDkyLjQtMS4yaDE4OC40YzI3LjggMCA2OC40LTYuMSA5My42IDEuMiAzNC4xIDkuOSAyNC42IDcxLjcgMjQuNiAxMTUuNXYxOTMuM2MwIDQ3LjQgMTAuMyAxMDktMzAuNyAxMTMuMm0tMzE0LTM0MC41djI2MS40SDM5MXYtMjY1SDEyNy41Yy0xLjQgMC4yLTEuMyAxLjktMS4yIDMuNm04MzcuMy00OS44djEwMi4xYy0yLjkgMzQuNC0wLjQgNzQuMi0xLjIgMTEwLjZINzAwLjF2LTU5LjZjLTI0LjYtMi44LTU0LjYtMC40LTgxLjMtMS4yLTIuOSA3Ny0wLjQgMTU5LjMtMS4yIDIzOC4zaC00OEM1MjguMiA5NTMuNyA1NDAgODkyLjUgNTQwIDg0NFY2NTUuNWMwLTI4LjMtNS44LTcwLjggMS4yLTkzLjYgOC40LTI3LjIgNDQuOC0yMy4xIDgxLjMtMjMuMUg4MDF2MTYxLjdoODIuNWMwLjgtNTMuNS0xLjYtMTEwLjIgMS4yLTE2MS43IDM5LjgtMi40IDc2LjUtMS44IDc4LjkgMzIuOE0yNTMuMSA2OTYuOGMzOS40LTQuMyA3MS45IDMzLjEgNTYuNiA3NC4yLTIxLjIgNTctMTIyLjQgMzUuNi0xMDMuNC0zNi41IDUuMi0xOS45IDIwLjQtMzQuOCA0Ni44LTM3LjdtNTM1LjYgMjY1LjFINzAwYzAuOC0zMS4yLTEuNi02NS43IDEuMi05NC45aDg3LjR2OTQuOW0xNzUtOTQuOHY2MmMtMy40IDE3LjMtMTMuNyAyNy44LTI5LjUgMzIuOGgtNjIuOGMwLjgtMzEuMi0xLjYtNjUuNyAxLjItOTQuOGg5MS4xIiBmaWxsPSIjMzRCNUZBIiBwLWlkPSI1MjEyIj48L3BhdGg+PC9zdmc+',
        title: '付款码'
    }
])
onLoad(() => {
})
onMounted(() => {
    showtoast.onbind(toast.value)
    
})
function routeto(item) {
    console.log(item)
    if (item.title == '扫一扫') {
        takephoto()
    } else if (item.title == '充值') {
        uni.navigateTo({
            url: '/pages/recharge/recharge'
        })
    } else if (item.title == '卡余额') {
        uni.navigateTo({
            url: '/pages/CardBalance/CardBalance'
        })
    } else if (item.title == '付款码') {
        uni.navigateTo({
            url: '/pages/PaymentCode/PaymentCode'
        })
    }
}
function takephoto() {
    uni.scanCode({
        onlyFromCamera: false,
        autoZoom: true,
        success: function (res) {
            console.log('条码类型：' + res.scanType);
            console.log('条码内容：' + res.result);
        },
        fail: function (res) {
            showtoast.onError(res.errMsg)
            console.log(res.errMsg)
        }
    })
}

</script>

<style lang='scss' scoped>
.card {
    background-color: $page-bg;
    height: 100vh;
    .cardbg{
        width: 100%;
        padding: 10px;
        z-index: -1;
        position: absolute;
    }
    .card-info {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        // background-color: $moduleBackgroundColor;
        margin: 20rpx 10rpx;
        padding: 40rpx;
        border-radius: 8px;
        height: 460rpx;
        // background-image: url('@/static/images/card3.png');
        // background-repeat: no-repeat;
        // background-size: cover;
        color: #d4df43;

        .card-title {
            font-size: 40rpx;
        }

        .card-subtitle {
            font-size: 40rpx;
        }

        .card-number {
            text-align: end;
            font-size: 40rpx;
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
