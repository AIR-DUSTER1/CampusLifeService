<template>
    <view class="container">
        <web-view :src='websrc' class="webview"
            style=" height: calc(100vh-140rpx);margin-top: 140rpx;margin-bottom: 280rpx;"></web-view>
        <u-toast ref="uToastRef"></u-toast>
        <up-keyboard ref="uKeyboard" mode="car" :show="show"></up-keyboard>
    </view>
</template>

<script setup lang='ts'>
import { onMounted, ref, watch ,computed} from 'vue'
import useUserStore from '@/store/user'
import { onLaunch, onShow, onHide } from "@dcloudio/uni-app"
import showToast from '@/utils/showtoast'
const userStore = useUserStore()// 获取用户信息
const userInfo = userStore.userinfo// 获取用户信息
const uToastRef = ref()
let uid = uni.getStorageSync('uid')
let selectitem = ref('zhipu')
let show = ref(false)
let model = ref('智谱')
let websrc = computed(()=>'http://ai.airduster1.top/?userid=' + uid + '&model=' + selectitem.value +'&token='+uni.getStorageSync('token'))
let selectname =computed(()=>model.value)
let keyheight = "0px"
// #ifdef APP-PLUS 
uni.$on('changeModel',(data)=>{
    console.log(data.model)
    selectitem.value = data.model
})
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
        },
        {
            type: 'none',
            text: '更换模型',
            fontSize: "16",
            select: true,
            width: "auto",
            onclick: function () {
                openSelect()
                console.log("点击了选择")
            }
        }
        ],
    },
})
// #endif
onMounted(() => {
    document.body.style.background = "#f7f8fc"// 设置背景色
})
watch(selectitem,(value)=>{
    console.log(value);
    if (value =='zhipu') {
        model.value = '智谱'
    }else if (value == 'qianwen') {
        model.value = '通义千问'
    }
    console.log(websrc.value)
    
})
// #ifndef H5
onShow(() => {
    uni.onKeyboardHeightChange((obj) => {
        // 获取系统信息
        console.log(obj);
        let _sysInfo = uni.getSystemInfoSync();
        let _heightDiff = _sysInfo.screenHeight - _sysInfo.windowHeight
        let _diff = obj.height - _heightDiff
        // 键盘高度
        keyheight = (_diff > 0 ? _diff : 0) - 2 + "px";
    })
})
// #endif

function openSelect() {
    uni.navigateTo({
		url: '/pages/popup/popup'
	})
}
function back() {
    uni.navigateBack({
        delta: 1
    })
}
</script>

<style lang='scss' scoped>
.select-item {
    position: absolute;
    background-color: black;
    height: 500rpx;
    right: 0;
    top: 50rpx;
    z-index: 99999;
}

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
