<template>
  <layout class="my">
    <view class="user-info" @click="click">
      <view class="user-info-avatar">
        <u-image :show-loading="true" :src="userinfo.avatar" width="50px" height="50px"></u-image>
      </view>
      <view class="user-info-name">
        <view class="user-info-username">{{ userinfo.username ? userinfo.username : '未设置昵称' }}</view>
        <view class="user-info-phone">{{ userinfo.phone ? userinfo.phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2') :
      '未绑定手机号' }}</view>
      </view>
      <view>
        <svg t="1726123579682" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
          p-id="2311" width="16" height="16">
          <path
            d="M313.926 1008.647a35.387 35.387 0 0 1-22.867-8.345c-15.028-12.644-16.942-35.077-4.299-50.07l376.532-447.01L304.137 73.695c-12.608-15.064-10.585-37.462 4.48-50.07 15.063-12.607 37.46-10.584 50.068 4.48l378.266 452.358c11.054 13.222 11.018 32.512-0.073 45.698l-395.75 469.842c-7.044 8.345-17.087 12.644-27.202 12.644z"
            fill="#313A48" p-id="2312"></path>
        </svg>
      </view>
    </view>
    <view>
      <u-cell-group class="user-option" :border="false">
        <template v-for="(item, index) in cell">
          <u-cell v-if="index != cell.length - 1" isLink :name="item.name" @click="cellClick(item.name)">
            <template #icon>
              <u-icon :name="item.icon" size="24"></u-icon>
            </template>
            <template #title>
              {{ item.title }}
            </template>
          </u-cell>
          <u-cell v-else :border="false" isLink :name="item.name" @click="cellClick(item.name)">
            <template #icon>
              <u-icon :name="item.icon" size="24"></u-icon>
            </template>
            <template #title>
              {{ item.title }}
            </template>
          </u-cell>
        </template>
      </u-cell-group>
    </view>
  </layout>
</template>

<script setup lang='ts'>
import { computed, reactive } from 'vue'
import layout from "@/components/layout/index.vue"
import useUserStore from '@/store/user'
const cell = reactive([
  {
    name: 'order',
    title: '交易记录',
    icon: 'order'
  },
  {
    name: 'question-circle',
    title: '常见问题',
    icon: 'question-circle'
  },
  {
    name: 'edit-pen',
    title: '投诉建议',
    icon: 'edit-pen'
  },
  {
    name: 'setting',
    title: '系统设置',
    icon: 'setting'
  }
])
const store = useUserStore()
let userinfo = computed(() => store.userinfo)
function click() {
  uni.navigateTo({
    url: '/pages/user/info'
  })
}
function cellClick(name: string) {
  if (name == 'order') {

  } else if (name == 'setting') {

  }

}
</script>

<style lang='scss' scoped>
.my {
  background-color: $page-bg;
  padding: 100rpx 20rpx 0 20rpx;
  height: calc(100vh - 120rpx);

  .user-info {
    background-color: $moduleBackgroundColor;
    display: flex;
    align-items: center;
    border: 2rpx solid #E5E5E5;
    padding: 20rpx;
    border-radius: 30rpx;

    .user-info-avatar {
      padding: 20rpx;
    }

    .user-info-name {
      flex: auto;

      .user-info-username {
        margin-left: 15rpx;
        padding-bottom: 8rpx;
        font-size: 36rpx;
        font-weight: 550;
      }

      .user-info-phone {
        margin-left: 15rpx;
        font-size: 26rpx;
        color: $subtitle;
      }
    }
  }

  .user-option {
    margin-top: 20rpx;
    background-color: $moduleBackgroundColor;
    border-radius: 30rpx;
  }
}
</style>