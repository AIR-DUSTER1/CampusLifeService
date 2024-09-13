<template>
  <layout class="home">
    <view class="navbar">
      <Navbar :bgColor="'#a6ffcb'">
        <template #left>
          <view>
            <u-image :show-loading="true" src="/src/static/images/th.png" width="60" height="44px"></u-image>
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
        <u-cell v-if="list.length > 0" isLink v-for="item in list" :key="item.nid">
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
      </u-cell-group>
      <u-toast ref="toast"></u-toast>
    </view>
  </layout>
</template>

<script setup lang="ts">
import usePlatform from '@/store/platform'
import { reactive, ref, onMounted } from "vue"
import { onLaunch, onReady, onHide } from "@dcloudio/uni-app"
import layout from "@/components/layout/index.vue"
import Navbar from "@/components/layout/navbar/navbar.vue"
import banner from "@/components/banner/banner.vue"
import request from '@/utils/request'
import showtoast from "@/utils/showtoast"
interface newsList {
  createTime: string
  updateTime: string
  createBy: string
  updateBy: string
  nid: Number
  slug: string
  title: string
  author: string
  content: string
  cover: string
  description: string
  views: Number
  published: boolean
  deleted: boolean
}
const toast = ref()
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
let list = ref<newsList[]>([
]
)
onReady(() => {
  getNews()
})
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
function getNews() {
  request({
    url: '/news/list',
    method: 'get',
  }).then((res: any) => {
    if (res.success) {
      console.log(res.data)
      list.value = res.data
    } else {
      showtoast.onError(res.message)
    }
  }).catch((err) => {
    showtoast.onError(err)
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

    :deep(.u-cell__body__content) {
      flex: none;
    }

    :deep(.u-cell-group__title) {
      padding: 16rpx 32rpx;
    }

    :deep(.u-cell-group__title__text) {
      font-weight: bold;
      font-size: 32rpx;
    }

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
</style>
