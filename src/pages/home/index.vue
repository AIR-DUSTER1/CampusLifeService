<template>
  <layout class="home">
    <view class="navbar">
      <Navbar :bgColor="'#a6ffcb'">
        <template #left>
          <view>
            <u-image :show-loading="true"
              src="https://s.cn.bing.net/th?id=OJ.7biM5vCN4l0IUw&qlt=80&o=6&dpr=1.3&pid=SANGAM" width="60"
              height="44px"></u-image>
          </view>
        </template>
        <template #right>
          <u-icon name="scan" size="30" color="#000" @click="takephoto"></u-icon>
        </template>
      </Navbar>
    </view>
    <view class="banner">
      <banner></banner>
    </view>
    <view class="btn-group">
      <view class="btn-item" @click="routeto()">
        <u-image src="../../static/images/chongzhi.png" shape="circle" width="100rpx" height="100rpx"></u-image>
        <text class="btn-text">123</text>
      </view>
      <view class="btn-item">
        <u-image src="../../static/images/chongzhi.png" shape="circle" width="100rpx" height="100rpx"></u-image>
        <text class="btn-text">123</text>
      </view>
      <view class="btn-item">
        <u-image src="../../static/images/chongzhi.png" shape="circle" width="100rpx" height="100rpx"></u-image>
        <text class="btn-text">123</text>
      </view>
      <view class="btn-item">
        <u-image src="../../static/images/chongzhi.png" shape="circle" width="100rpx" height="100rpx"></u-image>
        <text class="btn-text">123</text>
      </view>
      <view class="btn-item">
        <u-image src="../../static/images/chongzhi.png" shape="circle" width="100rpx" height="100rpx"></u-image>
        <text class="btn-text">123</text>
      </view>
      <view class="btn-item">
        <u-image src="../../static/images/chongzhi.png" shape="circle" width="100rpx" height="100rpx"></u-image>
        <text class="btn-text">123</text>
      </view>
      <view class="btn-item">
        <u-image src="../../static/images/chongzhi.png" shape="circle" width="100rpx" height="100rpx"></u-image>
        <text class="btn-text">123</text>
      </view>
      <view class="btn-item">
        <u-image src="../../static/images/chongzhi.png" shape="circle" width="100rpx" height="100rpx"></u-image>
        <text class="btn-text">123</text>
      </view>
    </view>
  </layout>
</template>

<script setup lang="ts">
import useUserStore from "@/store/user"
import usePlatform from '@/store/platform'
import { reactive, ref, onMounted } from "vue"
import layout from "@/components/layout/index.vue"
import Navbar from "@/components/layout/navbar/navbar.vue"
import banner from "@/components/banner/banner.vue"
const user = useUserStore()
let src = ref()
let barcode = ref()
const app = usePlatform()
let platform = app.getPlatform
onMounted(() => {
  console.log(platform);
  if (platform == 'h5') {

  } else if (platform == 'weixin') {

  }
})
function takephoto() {
  uni.scanCode({
    onlyFromCamera: true,
    success: function (res) {
      console.log('条码类型：' + res.scanType);
      console.log('条码内容：' + res.result);
    }
  });
  // uni.chooseVideo({
  //   sourceType: ['camera'],
  //   success: function (res: any) {
  //     src = res.tempFilePath;
  //   }
  // })
}
function routeto() {

}
</script>

<style lang="scss" scoped>
.home {
  display: flex;
  flex-direction: column;

  .navbar {
    height: 88rpx;
  }

  .banner {
    height: 260rpx;
  }

  .btn-group {
    display: grid;
    height: 250rpx;
    grid-template-columns: 1fr 1fr 1fr 1fr;

    .btn-item {
      background-color: aqua;
      width: 100%;
      display: flex;
      align-items: center;
      flex-direction: column;

      .btn-text {
        width: 100%;
        text-align: center;
      }

      :deep(.u-image) {
        margin: 0 auto;
      }
    }
  }
}
</style>
