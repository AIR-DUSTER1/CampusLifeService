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
          <u-icon name="scan" size="30" color="#000" @click="takephoto" :style="{ display: scan }"></u-icon>
        </template>
      </Navbar>
    </view>
    <view class="banner">
      <banner></banner>
    </view>
    <view class="btn-group">
      <view class="btn-item" @click="routeto(item.url)" v-for="(item, index) in BtnItem" :key="index">
        <u-image src="../../../static/images/chongzhi.png" shape="circle" width="100rpx" height="100rpx"></u-image>
        <text class="btn-text">123</text>
      </view>
    </view>
    <u-gap height="20"></u-gap>
    <view class="news">
      <u-cell-group title="新闻" :customStyle="{ 'fontSize': '32rpx' }">
        <u-cell isLink v-for="(item, index) in list" :key="index">
          <template #title>
            <view class="img">
              <u-image src="/static/images/chongzhi.png" width="100rpx" height="100rpx" />
            </view>
          </template>
          <template #value>
            <view class="text u-flex u-flex-direction-column">
              <text class="title">123</text>
              <text class="describe">123</text>
            </view>
          </template>
        </u-cell>
      </u-cell-group>
    </view>
  </layout>
</template>

<script setup lang="ts">
import usePlatform from '@/store/platform'
import { reactive, ref, onMounted } from "vue"
import layout from "@/components/layout/index.vue"
import Navbar from "@/components/layout/navbar/navbar.vue"
import banner from "@/components/banner/banner.vue"
let src = ref()
let scan = ref("0")
const app = usePlatform()
let platform = app.getPlatform
let BtnItem = reactive([
  {
    id: 0,
    img: '',
    text: '',
    url: "/pages/AIchat/AIchat"
  },
  {
    id: 1,
    img: '',
    text: '',
    url: ""
  },
  {
    id: 2,
    img: '',
    text: '',
    url: ""
  },
  {
    id: 3,
    img: '',
    text: '',
    url: ""
  },
  {
    id: 4,
    img: '',
    text: '',
    url: ""
  },
])
let list = reactive([
  {
    id: 0,
    img: "",
    title: "",
    desc: "",
    url: ""
  },
  {
    id: 1,
    img: "",
    title: "",
    desc: "",
    url: ""
  },
  {
    id: 2,
    img: "",
    title: "",
    desc: "",
    url: ""
  }
]
)
onMounted(() => {

  if (platform == 'h5') {

  } else if (platform == 'weixin' || platform == 'mp') {
    scan.value = 'none'
  } else if (platform == 'plus' || platform == 'nvue') {

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
function routeto(url: string) {
  uni.navigateTo({
    url: url
  })
}
</script>

<style lang="scss" scoped>
.home {
  display: flex;
  flex-direction: column;
  background-color: $page-bg;

  .navbar {
    height: 88rpx;
  }

  .banner {
    height: 260rpx;
  }

  .btn-group {
    display: grid;
    height: 280rpx;
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

  .news {
    background-color: $moduleBackgroundColor;

    :deep(.u-cell-group__title) {
      padding: 16rpx 32rpx;
    }

    :deep(.u-cell-group__title__text) {
      font-weight: bold;
      font-size: 32rpx;
    }

    .img {}

    .text {
      display: flex;

      .title {}

      .describe {}
    }
  }
}
</style>
