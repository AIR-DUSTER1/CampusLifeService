<template>
  <layout class="my">
    <view class="user-info" @click="click()" v-if="userinfo.username != ''">
      <view class="user-info-avatar">
        <u-image :show-loading="true" :src="userinfo.avatar" width="50px" height="50px"></u-image>
      </view>
      <view class="user-info-name">
        <view class="user-info-username">{{ userinfo.username ? userinfo.username : '未设置昵称' }}</view>
        <view class="user-info-phone">{{ userinfo.phone ? userinfo.phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2') :
      '未绑定手机号' }}</view>
      </view>
      <view>
        <u-icon name="arrow-right" size="16" color="#A4A5A7"></u-icon>
      </view>
    </view>
    <view>
      <u-cell-group class="user-option" :border="false">
        <template v-for="(item, index) in cell">
          <u-cell v-if="index != cell.length - 1" isLink :name="item.name" @click="cellClick">
            <template #icon>
              <u-icon :name="item.icon" size="24"></u-icon>
            </template>
            <template #title>
              {{ item.title }}
            </template>
          </u-cell>
          <u-cell v-else :border="false" isLink :name="item.name" @click="cellClick">
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
  <u-toast ref="toast"></u-toast>
</template>

<script setup lang='ts'>
import { computed, reactive, onMounted, ref } from 'vue'
import layout from "@/components/layout/index.vue"
import useUserStore from '@/store/user'
import request from '@/utils/request'
import showtoast from "@/utils/showtoast"
let uid = uni.getStorageSync('uid')
const toast = ref()
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
    name: '/pages/SystemSetting/SystemSetting',
    title: '系统设置',
    icon: 'setting'
  }
])
const store = useUserStore()
let userinfo = computed(() => store.userinfo)
onMounted(() => {
  showtoast.onbind(toast.value)
  getUserinfo()
})
function click() {
  uni.navigateTo({
    url: '/pages/PersonalData/PersonalData'
  })
}
function cellClick(item: any) {
  console.log(item.name);
  uni.navigateTo({
    url: item.name
  })
}

function getUserinfo() {
  if (userinfo.value.phone == '') {
    request({
      url: `/user/${uid}`,
    }).then((res) => {
      if (res.success) {
        store.saveUserInfo(res.data)
      } else {
        showtoast.onError(res.message)
      }
    }).catch((err) => {
      showtoast.onError(err)
    })
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

    .icon {
      height: 32rpx;
      width: 32rpx;
    }
  }

  .user-option {
    margin-top: 20rpx;
    background-color: $moduleBackgroundColor;
    border-radius: 30rpx;
  }
}
</style>