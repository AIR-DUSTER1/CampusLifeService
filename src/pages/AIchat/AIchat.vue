<template>
    <view class="container">
        <web-view :src='websrc' class="webview"
            style=" height: calc(100vh-140rpx);margin-top: 140rpx;margin-bottom: 280rpx;"></web-view>
        <u-toast ref="uToastRef"></u-toast>
        <up-keyboard ref="uKeyboard" mode="car" :show="show"></up-keyboard>
    </view>
</template>

<script setup lang='ts'>
import { onMounted, ref } from 'vue'
import useUserStore from '@/store/user'
import { onLaunch, onShow, onHide } from "@dcloudio/uni-app"
import showToast from '@/utils/showtoast'
const userStore = useUserStore()// 获取用户信息
const userInfo = userStore.userinfo// 获取用户信息
let uid = uni.getStorageSync('uid')
let show = ref(false)
let websrc = 'http://ai.airduster1.top/?userid=' + uid + 'token' + userInfo.token
const uToastRef = ref()
let keyheight = "0px"
// #ifdef APP-PLUS
//  监听键盘高度变化

const pages = getCurrentPages()
const page: any = pages[pages.length - 1];
const currentWebview = page.$getAppWebview()
currentWebview.setStyle({
    titleNView: {
        buttons: [{
            float: 'left',
            type: 'back',
            fontSize: "20px",
            onclick: function () {
                back()
            }
        }]
    }
})
// #endif
onMounted(() => {
    document.body.style.background = "#f7f8fc"// 设置背景色

})
onShow(() => {
    uni.onKeyboardHeightChange((obj) => {
        // 获取系统信息
        console.log(obj);
        let _sysInfo = uni.getSystemInfoSync();
        let _heightDiff = _sysInfo.screenHeight - _sysInfo.windowHeight
        let _diff = obj.height - _heightDiff
        // 键盘高度
        keyheight = (_diff > 0 ? _diff : 0) - 2 + "px";
        // showToast(uToastRef.value, , keyheight)
    })
    // uni.onWindowResize(res => {
    // 			console.log(res);
    // 			if (res.size.windowHeight < height) {
    // 				setTimeout(() => {
    // 					wv.setStyle({
    // 						top: this.barHeight,
    // 						// webview的高度动态修改为减去键盘高度后的
    // 						height: this.height - this.kbHeight,
    // 						bottom: 0
    // 					})
    // 				}, 100)
    // 			} else {
    // 				setTimeout(() => {
    // 					this.wv.setStyle({
    // 						top: this.barHeight,
    // 						// 这里可以根据自己情况微调
    // 						height: this.height + 60,
    // 						bottom: 0
    // 					})
    // 				}, 100)
    // 			}
    // })
})
function back() {
    uni.navigateBack({
        delta: 1
    })
}
</script>

<style lang='scss' scoped>
.container {
    .navbar {
        // #ifdef H5
        height: 100rpx;
        //#endif
        // #ifndef H5
        height: 140rpx;
        //#endif
    }

    .webview {
        // margin-bottom: v-bind(keyheight);
        margin-bottom: 17.8125rem;
    }
}
</style>
