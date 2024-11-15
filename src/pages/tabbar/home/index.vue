<template>
  <layout class="home">
    <view class="navbar">
      <Navbar :bgColor="'#a6ffcb'">
        <template #left>
          <view>
            <u-image :show-loading="true" :src="settings.homeNavimg" width="60" height="44px"></u-image>
          </view>
        </template>
        <template #right>
          <!-- #ifdef APP -->
          <u-icon name="scan" size="30" color="#000" @click="takephoto" :style="{ display: scan }"></u-icon>
          <!-- #endif -->
        </template>
      </Navbar>
    </view>
    <!-- #ifdef APP -->
    <u-gap height="20"></u-gap>
    <!-- #endif -->
    <!-- #ifdef MP-WEIXIN -->
    <u-gap height="10"></u-gap>
    <!-- #endif -->
    <view class="banner">
      <banner :bannerImg="bannerImg"></banner>
    </view>
    <u-gap height="10"></u-gap>
    <view class="btn-group">
      <view class="btn-item" @click="routeto(item.url)" v-for="(item, index) in BtnItem" :key="index">
        <up-image v-if="item.svg != ''" :show-loading="true"  width="40px" height="40px" :src="item.svg" ></up-image>
        <!-- <view style="height: 40px;" v-html="item.svg"></view> -->
        <text class="btn-text">{{ item.text }}</text>
      </view>
    </view>
    <u-gap height="10"></u-gap>
    <view class="news">
      <u-cell-group v-if="list.length > 0" title="新闻" :customStyle="{ 'fontSize': '32rpx' }">
        <u-cell isLink v-for="item in list" :key="item.nid" @click="toNews(item)">
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
        <view style="width: 60vw;margin: 20rpx auto;">
          <u-button type="primary" shape="circle" @click="moreNews">更多新闻</u-button>
        </view>
      </u-cell-group>
      <u-empty mode="news" text="暂无新闻" style="height: 400rpx;" :show="list.length == 0">
      </u-empty>
    </view>
    <u-toast ref="toast"></u-toast>
  </layout>
</template>

<script setup lang="ts">
import usePlatform from '@/store/platform'
import { reactive, ref, onMounted, computed } from "vue"
import { onLoad, onReady } from "@dcloudio/uni-app"
import layout from "@/components/layout/index.vue"
import Navbar from "@/components/layout/navbar/navbar.vue"
import banner from "@/components/banner/banner.vue"
import request from '@/utils/request'
import showtoast from "@/utils/showtoast"
import { settings } from '@/settings/settings'
import useUserStore from '@/store/user'
import useCard from '@/store/card'
const store = useUserStore()
const card = useCard()
let userinfo = computed(() => store.userinfo)
let uid = uni.getStorageSync('uid')
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
let bannerImg = ref<string[]>([])
let scan = ref("0")
const app = usePlatform()
let platform = app.getPlatform
let BtnItem = reactive([
  {
    id: 0,
    svg: 'data:image/svg+xml;base64,PHN2ZyB0PSIxNzI2Mzc4NzkzODU4IiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjgxMTkiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+PHBhdGggZD0iTTUxMS45OTk0ODggNjQuMDIxMTA2Yy0yNDcuMjcxNzEgMC00NDcuNzI0MDkxIDIwMC40NTIzODEtNDQ3LjcyNDA5MSA0NDcuNzI0MDkxczIwMC40NTIzODEgNDQ3LjcyNDA5MSA0NDcuNzI0MDkxIDQ0Ny43MjQwOTEgNDQ3LjcyNDA5MS0yMDAuNDUzNDA1IDQ0Ny43MjQwOTEtNDQ3LjcyNDA5MVM3NTkuMjcxMTk4IDY0LjAyMTEwNiA1MTEuOTk5NDg4IDY0LjAyMTEwNnpNNzIwLjc3MTM0OSA3MjUuMzIwNDU3Yy0xMy40MjI3MDcgMTMuNjcwMzQ4LTM2LjA0MDg0NCAyMC4yNTczNy02Ny44NTU0MzQgMTkuNzYxMDY2bC01Ny42NjMzMDQgMGMtNDQuNDA3Mzk2IDAtNjYuNjExMDk0LTI0Ljg1NTA4NC02Ni42MTEwOTQtNzQuNTY2Mjc2TDUyOC42NDE1MTcgNTM0LjgwNzQ0OWwtNTUuOTIzNjg0IDIuNDg1NjExYy04LjI4NjczNCAxMTQuMDAyNDUtNjEuNzIzNzgzIDE4Ny4yMzk0NTItMTYwLjMxMzE5NiAyMTkuNzE4MTY3LTIwLjIxODQ4NC0yNy41MDc0OTQtMzYuOTUwNTY0LTQ4Ljg4NDM2LTUwLjIwNzQ5NS02NC4xMjY1MDYgODUuNTAxMzI2LTIzLjY5MjYwOCAxMzIuNzI0ODYxLTc0LjMxNTU2NiAxNDEuNjcyNjUtMTUxLjg2MjczMy0zMy44MDE4NSAyLjE1NTA4My01OS42NTA1NjUgNC4zOTMwNTQtNzcuNTQ3MTY3IDYuNzExODY1bC0yNS44NDk3MzgtNTkuMTU1Mjg1YzM2Ljk0ODUxNy0yMS44NzIxNDcgNzUuNzIyNjEyLTU2LjE3MTMyNCAxMTYuMzIxMjYyLTEwMi44OTk1NzhMMjcwLjE1MjMyNSAzODUuNjc4OTlsMC02NS42MTc0NjMgMjAyLjMxNzg2OCAwLTE3Ljg5NTU3OS00MS4yNTc2NTkgNzIuNTc2OTY5LTE1LjkwODMxOCAyMy4zNjIwODEgNTcuMTY1OTc3IDE5NC44NjMwODMgMCAwIDY1LjYxNzQ2My0yMzguMzU4NzEzIDBjLTI5LjQ5NTc3OCAzMi4zMTE5MTctNjIuMjIyMTMzIDY0LjI5MjI4Mi05OC4xNzU5OTcgOTUuOTM5MDQ5IDQ2LjU2MDQzMi0wLjY2MDAzMiAxMDkuMzYxNzU3LTIuMzE4ODEyIDE4OC40MDA5MDQtNC45NjkxNzVsLTUzLjE5MDQzMy01Mi4xOTU3NzkgNDguNzEzNDY4LTM3Ljc3OTQ0MmM1MS4wMzQzMjcgNDQuMDc3ODkxIDk5LjkxNzY2NCA4OC45ODE1OSAxNDYuNjQ0ODk1IDEzNC43MTQxNjhsLTUxLjIwMTEyNiA0OC4yMTgxODgtMzcuMjgyMTE1LTM4Ljc3MzA3Mi01Mi42OTMxMDYgMS43Mzk2MjEgMCAxMjYuMDE0MDE4YzAgMTcuMjM1NTQ2IDguNzgwOTkgMjUuODQ5NzM4IDI2LjM0NjA0MSAyNS44NDk3MzhsMTkuMzg2NTM2IDBjMTQuNTc5MDQzIDAgMjQuMTkxOTgyLTQuNTk3NzE1IDI4LjgzMTY1Mi0xMy43OTQxNjggNC42Mzc2MjQtOS4xOTU0MjkgOC45NDc3ODktMzMuNzU5ODk1IDEyLjkyNTM4MS03My42OTU0NDIgMTguNTU1NjExIDguNjE5MzA4IDQxLjc1NjAwOSAxNy43MzM4OTYgNjkuNTk0MDMxIDI3LjM0MDY5NUM3NDUuNzA3Mjc0IDY3Ny45NzIwNzkgNzM0LjE5MjAxIDcxMS42NTExMzMgNzIwLjc3MTM0OSA3MjUuMzIwNDU3eiIgZmlsbD0iIzYwQURGQyIgcC1pZD0iODEyMCI+PC9wYXRoPjwvc3ZnPg==',
    text: '充值',
    url: "/pages/recharge/recharge"
  },
  {
    id: 1,
    svg: 'data:image/svg+xml;base64,PHN2ZyB0PSIxNzI2Mzc4NTQ0NTEyIiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjY2ODUiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+PHBhdGggZD0iTTUxMiAzNC4xMzMzMzNDMjQ5LjE3MzMzMyAzNC4xMzMzMzMgMzQuMTMzMzMzIDI0OS4xNzMzMzMgMzQuMTMzMzMzIDUxMnMyMTUuMDQgNDc3Ljg2NjY2NyA0NzcuODY2NjY3IDQ3Ny44NjY2NjcgNDc3Ljg2NjY2Ny0yMTUuMDQgNDc3Ljg2NjY2Ny00NzcuODY2NjY3Uzc3NC44MjY2NjcgMzQuMTMzMzMzIDUxMiAzNC4xMzMzMzN6TTIzOC45MzMzMzMgMzA4LjkwNjY2N2MwLTM5LjI1MzMzMyAzMC43Mi02OS45NzMzMzMgNjkuOTczMzM0LTY5Ljk3MzMzNEgzOTIuNTMzMzMzYzE4Ljc3MzMzMyAwIDM0LjEzMzMzMyAxNS4zNiAzNC4xMzMzMzQgMzQuMTMzMzM0cy0xNS4zNiAzNC4xMzMzMzMtMzQuMTMzMzM0IDM0LjEzMzMzM2gtODMuNjI2NjY2Yy0xLjcwNjY2NyAwLTEuNzA2NjY3IDEuNzA2NjY3LTEuNzA2NjY3IDEuNzA2NjY3VjM5Mi41MzMzMzNjMCAxOC43NzMzMzMtMTUuMzYgMzQuMTMzMzMzLTM0LjEzMzMzMyAzNC4xMzMzMzRzLTM0LjEzMzMzMy0xNS4zNi0zNC4xMzMzMzQtMzQuMTMzMzM0di04My42MjY2NjZ6TTM5Mi41MzMzMzMgNzg1LjA2NjY2N2gtODMuNjI2NjY2Yy0zOS4yNTMzMzMgMC02OS45NzMzMzMtMzAuNzItNjkuOTczMzM0LTY5Ljk3MzMzNFY2MzEuNDY2NjY3YzAtMTguNzczMzMzIDE1LjM2LTM0LjEzMzMzMyAzNC4xMzMzMzQtMzQuMTMzMzM0czM0LjEzMzMzMyAxNS4zNiAzNC4xMzMzMzMgMzQuMTMzMzM0djgzLjYyNjY2NmMwIDEuNzA2NjY3IDEuNzA2NjY3IDEuNzA2NjY3IDEuNzA2NjY3IDEuNzA2NjY3SDM5Mi41MzMzMzNjMTguNzczMzMzIDAgMzQuMTMzMzMzIDE1LjM2IDM0LjEzMzMzNCAzNC4xMzMzMzNzLTE1LjM2IDM0LjEzMzMzMy0zNC4xMzMzMzQgMzQuMTMzMzM0eiBtLTY2LjU2LTIzOC45MzMzMzRjLTE4Ljc3MzMzMyAwLTM0LjEzMzMzMy0xNS4zNi0zNC4xMzMzMzMtMzQuMTMzMzMzczE1LjM2LTM0LjEzMzMzMyAzNC4xMzMzMzMtMzQuMTMzMzMzaDM3Mi4wNTMzMzRjMTguNzczMzMzIDAgMzQuMTMzMzMzIDE1LjM2IDM0LjEzMzMzMyAzNC4xMzMzMzNzLTE1LjM2IDM0LjEzMzMzMy0zNC4xMzMzMzMgMzQuMTMzMzMzSDMyNS45NzMzMzN6TTc4NS4wNjY2NjcgNzE1LjA5MzMzM2MwIDM5LjI1MzMzMy0zMC43MiA2OS45NzMzMzMtNjkuOTczMzM0IDY5Ljk3MzMzNEg2MzEuNDY2NjY3Yy0xOC43NzMzMzMgMC0zNC4xMzMzMzMtMTUuMzYtMzQuMTMzMzM0LTM0LjEzMzMzNHMxNS4zNi0zNC4xMzMzMzMgMzQuMTMzMzM0LTM0LjEzMzMzM2g4My42MjY2NjZjMS43MDY2NjcgMCAxLjcwNjY2Ny0xLjcwNjY2NyAxLjcwNjY2Ny0xLjcwNjY2N1Y2MzEuNDY2NjY3YzAtMTguNzczMzMzIDE1LjM2LTM0LjEzMzMzMyAzNC4xMzMzMzMtMzQuMTMzMzM0czM0LjEzMzMzMyAxNS4zNiAzNC4xMzMzMzQgMzQuMTMzMzM0djgzLjYyNjY2NnpNNzg1LjA2NjY2NyAzOTIuNTMzMzMzYzAgMTguNzczMzMzLTE1LjM2IDM0LjEzMzMzMy0zNC4xMzMzMzQgMzQuMTMzMzM0cy0zNC4xMzMzMzMtMTUuMzYtMzQuMTMzMzMzLTM0LjEzMzMzNHYtODMuNjI2NjY2YzAtMS43MDY2NjctMS43MDY2NjctMS43MDY2NjctMS43MDY2NjctMS43MDY2NjdINjMxLjQ2NjY2N2MtMTguNzczMzMzIDAtMzQuMTMzMzMzLTE1LjM2LTM0LjEzMzMzNC0zNC4xMzMzMzNzMTUuMzYtMzQuMTMzMzMzIDM0LjEzMzMzNC0zNC4xMzMzMzRoODMuNjI2NjY2YzM5LjI1MzMzMyAwIDY5Ljk3MzMzMyAzMC43MiA2OS45NzMzMzQgNjkuOTczMzM0VjM5Mi41MzMzMzN6IiBmaWxsPSIjNjBBREZDIiBwLWlkPSI2Njg2Ij48L3BhdGg+PC9zdmc+',
    text: '扫一扫',
    url: "takephoto"
  },
  {
    id: 2,
    svg: 'data:image/svg+xml;base64,PHN2ZyB0PSIxNzI2NDk3MzE3NTE4IiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjM1MDAiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+PHBhdGggZD0iTTUxMiA2NEMyNjQuNSA2NCA2NCAyNjQuNSA2NCA1MTJzMjAwLjYgNDQ4IDQ0OCA0NDggNDQ4LTIwMC42IDQ0OC00NDhTNzU5LjUgNjQgNTEyIDY0eiBtLTUwLjYgMjE1LjFoMTAxLjhjMTIuNSAwIDIyLjUgMTEuOCAyMi41IDI1LjQgMCAxMy42LTEwIDI1LjQtMjEuOSAyNS40SDQ2MS40Yy0xMi41IDAtMjIuNS0xMS44LTIyLjUtMjUuNCAwLTEzLjcgMTAtMjUuNCAyMi41LTI1LjR6IG0xNjEuMiAxMzAuN2M4LjEgMCAxNSA2LjggMTUgMTQuOSAwIDguMS02LjkgMTQuOS0xNSAxNC45SDQwMi4xYy04LjEgMC0xNS02LjgtMTUtMTQuOSAwLTguMSA2LjktMTQuOSAxNS0xNC45aDIyMC41eiBtMCAxMTAuM0g0MDIuMWMtOC4xIDAtMTUtNi44LTE1LTE0LjkgMC04LjEgNi45LTE0LjkgMTUtMTQuOUg2MjJjOC4xIDAgMTUgNi4yIDE1LjYgMTQuOSAwIDgtNi45IDE0LjktMTUgMTQuOXogbTE1IDcyLjRjMCA4LjEtNi45IDE0LjktMTUgMTQuOUg0MDIuMWMtOC4xIDAtMTUtNi44LTE1LTE0LjkgMC04LjEgNi45LTE0LjkgMTUtMTQuOUg2MjJjOC4xIDAuMSAxNC45IDYuMyAxNS42IDE0Ljl6IG05NC45IDkxLjFjMCA0MC4zLTIxLjkgNjEuMy02MS44IDYxLjNIMzUzLjNjLTQwIDAtNjEuOC0yNS40LTYxLjgtNjEuM1YzNTIuMmMwLTMzLjQgMTcuNS01OC44IDU4LjctNTguOGgzNi45YzguMSAwIDExLjIgNSAxMS4yIDEzIDAgOC4xLTMuMSAxNi4xLTExLjIgMTYuMWgtMzYuOWMtMTcuNSAwLTI5LjQgMTEuOC0yOS40IDI5LjF2MzM1LjFjMCAxNy4zIDE5LjQgMjkuMSAzNi45IDI5LjFoMzE2LjFjMTcuNSAwIDI5LjQtMTEuOCAyOS40LTI5LjFWMzUxLjZjMC0xNy4zLTExLjktMjkuMS0yOS40LTI5LjFoLTI5LjRjLTguMSAwLTE3LjUtOC4xLTE3LjUtMTYuMSAwLTguMSA5LjQtMTMgMTcuNS0xM2gyOS40YzM4LjEgMCA1OC43IDI1LjQgNTguNyA1OC44djMzMS40eiIgcC1pZD0iMzUwMSIgZmlsbD0iIzYwQURGQyI+PC9wYXRoPjwvc3ZnPg==',
    text: '交易明细',
    url: "/pages/OrderRecord/OrderRecord"
  },
  {
    id: 3,
    svg: 'data:image/svg+xml;base64,PHN2ZyB0PSIxNzI2Mzc4OTQwODg5IiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjEwNzE1IiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiPjxwYXRoIGQ9Ik01MTIgNTEybS01MTIgMGE1MTIgNTEyIDAgMSAwIDEwMjQgMCA1MTIgNTEyIDAgMSAwLTEwMjQgMFoiIGZpbGw9IiM5QkQ2RkYiIHAtaWQ9IjEwNzE2Ij48L3BhdGg+PHBhdGggZD0iTTUxMiA1MTJtLTQ2MC44IDBhNDYwLjggNDYwLjggMCAxIDAgOTIxLjYgMCA0NjAuOCA0NjAuOCAwIDEgMC05MjEuNiAwWiIgZmlsbD0iIzJGODZGRiIgcC1pZD0iMTA3MTciPjwvcGF0aD48cGF0aCBkPSJNNDQ4IDUzNy42YTQ2LjA4IDQ2LjA4IDAgMCAxIDQ2LjA4IDQ2LjA4djEwMi40QTQ2LjA4IDQ2LjA4IDAgMCAxIDQ0OCA3MzIuMTZIMzQ1LjZhNDYuMDggNDYuMDggMCAwIDEtNDYuMDgtNDYuMDh2LTEwMi40QTQ2LjA4IDQ2LjA4IDAgMCAxIDM0NS42IDUzNy42eiBtMTAyLjQgNzYuOGEyMC40OCAyMC40OCAwIDAgMSAyMC4zMjY0IDE3LjkybDAuMTUzNiAyLjU2djc2LjhhMjAuNDggMjAuNDggMCAwIDEtNDAuODA2NCAyLjU2bC0wLjE1MzYtMi41NnYtNzYuOGEyMC40OCAyMC40OCAwIDAgMSAyMC40OC0yMC40OHogbTE1My42IDBhMjAuNDggMjAuNDggMCAwIDEgMjAuMzI2NCAxNy45MmwwLjE1MzYgMi41NnY3Ni44YTIwLjQ4IDIwLjQ4IDAgMCAxLTQwLjgwNjQgMi41NmwtMC4xNTM2LTIuNTZ2LTc2LjhhMjAuNDggMjAuNDggMCAwIDEgMjAuNDgtMjAuNDh6IG0tNzYuOCAwYTIwLjQ4IDIwLjQ4IDAgMCAxIDIwLjMyNjQgMTcuOTJsMC4xNTM2IDIuNTZ2NzYuOGEyMC40OCAyMC40OCAwIDAgMS00MC44MDY0IDIuNTZsLTAuMTUzNi0yLjU2di03Ni44YTIwLjQ4IDIwLjQ4IDAgMCAxIDIwLjQ4LTIwLjQ4eiBtLTE3OS4yLTM1Ljg0SDM0NS42YTUuMTIgNS4xMiAwIDAgMC01LjEyIDUuMTJ2MTAyLjRjMCAyLjgxNiAyLjMwNCA1LjEyIDUuMTIgNS4xMmgxMDIuNGE1LjEyIDUuMTIgMCAwIDAgNS4xMi01LjEydi0xMDIuNGE1LjEyIDUuMTIgMCAwIDAtNS4xMi01LjEyeiBtMTAyLjQtNDAuOTZhMjAuNDggMjAuNDggMCAwIDEgMjAuMzI2NCAxNy45MmwwLjE1MzYgMi41NnYyNS42YTIwLjQ4IDIwLjQ4IDAgMCAxLTQwLjgwNjQgMi41NmwtMC4xNTM2LTIuNTZ2LTI1LjZhMjAuNDggMjAuNDggMCAwIDEgMjAuNDgtMjAuNDh6IG0xNTMuNiAwYTIwLjQ4IDIwLjQ4IDAgMCAxIDIwLjMyNjQgMTcuOTJsMC4xNTM2IDIuNTZ2MjUuNmEyMC40OCAyMC40OCAwIDAgMS00MC44MDY0IDIuNTZsLTAuMTUzNi0yLjU2di0yNS42YTIwLjQ4IDIwLjQ4IDAgMCAxIDIwLjQ4LTIwLjQ4eiBtLTc2LjggMGEyMC40OCAyMC40OCAwIDAgMSAyMC4zMjY0IDE3LjkybDAuMTUzNiAyLjU2djI1LjZhMjAuNDggMjAuNDggMCAwIDEtNDAuODA2NCAyLjU2bC0wLjE1MzYtMi41NnYtMjUuNmEyMC40OCAyMC40OCAwIDAgMSAyMC40OC0yMC40OHpNNDQ4IDI4Ni43MkE0Ni4wOCA0Ni4wOCAwIDAgMSA0OTQuMDggMzMyLjh2MTAyLjRBNDYuMDggNDYuMDggMCAwIDEgNDQ4IDQ4MS4yOEgzNDUuNkE0Ni4wOCA0Ni4wOCAwIDAgMSAyOTkuNTIgNDM1LjJWMzMyLjhBNDYuMDggNDYuMDggMCAwIDEgMzQ1LjYgMjg2LjcyeiBtMjMwLjQgMEE0Ni4wOCA0Ni4wOCAwIDAgMSA3MjQuNDggMzMyLjh2MTAyLjRBNDYuMDggNDYuMDggMCAwIDEgNjc4LjQgNDgxLjI4aC0xMDIuNEE0Ni4wOCA0Ni4wOCAwIDAgMSA1MjkuOTIgNDM1LjJWMzMyLjhBNDYuMDggNDYuMDggMCAwIDEgNTc2IDI4Ni43MnpNNDQ4IDMyNy42OEgzNDUuNmE1LjEyIDUuMTIgMCAwIDAtNS4xMiA1LjEydjEwMi40YzAgMi44MTYgMi4zMDQgNS4xMiA1LjEyIDUuMTJoMTAyLjRhNS4xMiA1LjEyIDAgMCAwIDUuMTItNS4xMlYzMzIuOGE1LjEyIDUuMTIgMCAwIDAtNS4xMi01LjEyeiBtMjMwLjQgMGgtMTAyLjRhNS4xMiA1LjEyIDAgMCAwLTUuMTIgNS4xMnYxMDIuNGMwIDIuODE2IDIuMzA0IDUuMTIgNS4xMiA1LjEyaDEwMi40YTUuMTIgNS4xMiAwIDAgMCA1LjEyLTUuMTJWMzMyLjhhNS4xMiA1LjEyIDAgMCAwLTUuMTItNS4xMnoiIGZpbGw9IiNGRkZGRkYiIHAtaWQ9IjEwNzE4Ij48L3BhdGg+PHBhdGggZD0iTTM5Ni44IDM4NG0tMjUuNiAwYTI1LjYgMjUuNiAwIDEgMCA1MS4yIDAgMjUuNiAyNS42IDAgMSAwLTUxLjIgMFoiIGZpbGw9IiNGRkZGRkYiIHAtaWQ9IjEwNzE5Ij48L3BhdGg+PHBhdGggZD0iTTM5Ni44IDY0MG0tMjUuNiAwYTI1LjYgMjUuNiAwIDEgMCA1MS4yIDAgMjUuNiAyNS42IDAgMSAwLTUxLjIgMFoiIGZpbGw9IiNGRkZGRkYiIHAtaWQ9IjEwNzIwIj48L3BhdGg+PHBhdGggZD0iTTYyNy4yIDM4NG0tMjUuNiAwYTI1LjYgMjUuNiAwIDEgMCA1MS4yIDAgMjUuNiAyNS42IDAgMSAwLTUxLjIgMFoiIGZpbGw9IiNGRkZGRkYiIHAtaWQ9IjEwNzIxIj48L3BhdGg+PC9zdmc+',
    text: '付款码',
    url: "/pages/PaymentCode/PaymentCode"
  },
  {
    id: 4,
    svg: 'data:image/svg+xml;base64,PHN2ZyB0PSIxNzI2Mzc4OTgwNTI1IiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDExMTcgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjExODM0IiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiPjxwYXRoIGQ9Ik0xMDMyLjE5MiAxMTYuOTY4NzI3YTI4OS44ODUwOTEgMjg5Ljg4NTA5MSAwIDAgMSAwIDQwOS45MjU4MThsLTQ3My4zNjcyNzMgNDczLjM2NzI3M2gtMC41NTg1NDVMODQuODk4OTA5IDUyNi44OTQ1NDVhMjg5Ljg4NTA5MSAyODkuODg1MDkxIDAgMCAxIDQwNS4wODUwOTEtNDE0LjcyTDU1OC41NDU0NTUgMTgwLjU5NjM2NGw2My42NzQxODEtNjMuNjI3NjM3YTI4OS44ODUwOTEgMjg5Ljg4NTA5MSAwIDAgMSA0MDkuOTcyMzY0IDB6IG0tMzk5LjczMjM2NCAxNzIuMjY0NzI4Yy02LjA5NzQ1NS0yMi4yNDg3MjctMzcuODQxNDU1LTIxLjg3NjM2NC00My40MjY5MDkgMC41NTg1NDVsLTg4LjE1NzA5MSAzNTQuMjEwOTA5LTY1LjY3NTYzNi0xNTkuODgzNjM2YTIyLjQ4MTQ1NSAyMi40ODE0NTUgMCAwIDAtMjAuODA1ODE4LTEzLjkxNzA5MUgyNjQuODQzNjM2YTIyLjQ4MTQ1NSAyMi40ODE0NTUgMCAwIDAtMjIuNDM0OTA5IDIyLjQ4MTQ1NGwwLjA5MzA5MSAyLjMyNzI3M2MxLjE2MzYzNiAxMS4yNjQgMTAuNzA1NDU1IDIwLjEwNzYzNiAyMi4zNDE4MTggMjAuMTA3NjM2aDEzNC41MTYzNjRsODYuMDE2IDIwOS4zNjE0NTUgMS4wNzA1NDUgMi4xODc2MzZjOS40MDIxODIgMTcuNjg3MjczIDM2LjQ5MTYzNiAxNC44OTQ1NDUgNDEuNTE4NTQ2LTUuMzA2MTgxbDg0LjAxNDU0NS0zMzcuNTk0MTgyIDUwLjM2MjE4MiAxODIuODMwNTQ1IDAuNzQ0NzI3IDIuMjM0MTgyYTIyLjQ4MTQ1NSAyMi40ODE0NTUgMCAwIDAgMzkuMzc3NDU1IDQuNjU0NTQ1bDQwLjYzNDE4Mi01OC4zNjhoMTA5LjI0MjE4MmEyMi40ODE0NTUgMjIuNDgxNDU1IDAgMCAwIDAtNDQuOTE2MzYzaC0xMjAuOTcxNjM3bC0yLjQyMDM2MyAwLjEzOTYzNmEyMi40ODE0NTUgMjIuNDgxNDU1IDAgMCAwLTE2LjAxMTYzNyA5LjQ5NTI3M2wtMjAuMDE0NTQ1IDI4LjY3Mi02MC40MTYtMjE5LjIyOTA5MXoiIHAtaWQ9IjExODM1IiBmaWxsPSIjNjBBREZDIj48L3BhdGg+PC9zdmc+',
    text: '健康助手',
    url: "/pages/AIchat/AIchat"
  },
  {
    id: 5,
    svg: 'data:image/svg+xml;base64,PHN2ZyB0PSIxNzI2Mzc5MDc4NjE5IiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjE1NDI0IiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiPjxwYXRoIGQ9Ik01MTIgNTEybS00OTYuNDg0ODQ4IDBhNDk2LjQ4NDg0OCA0OTYuNDg0ODQ4IDAgMSAwIDk5Mi45Njk2OTYgMCA0OTYuNDg0ODQ4IDQ5Ni40ODQ4NDggMCAxIDAtOTkyLjk2OTY5NiAwWiIgZmlsbD0iI0RDRjJGRiIgcC1pZD0iMTU0MjUiPjwvcGF0aD48cGF0aCBkPSJNNzcwLjQ4MjQyNCA2NDQuNDk5Mzk0bC0xNDMuODI1NDU0LTE0My44MjU0NTVhMTk1LjQ5MDkwOSAxOTUuNDkwOTA5IDAgMCAwLTI2Ni4yNC0yNDAuOTUwMzAzbDkzLjA5MDkwOSA5My4wOTA5MDlhMzQuNzUzOTM5IDM0Ljc1MzkzOSAwIDAgMSAwIDUwLjI2OTA5MUw0MDMuMzkzOTM5IDQ1My45NzMzMzNhMzQuNzUzOTM5IDM0Ljc1MzkzOSAwIDAgMS01MC4yNjkwOTEgMGwtOTMuMDkwOTA5LTkzLjA5MDkwOWExOTUuNDkwOTA5IDE5NS40OTA5MDkgMCAwIDAgMjQwLjY0IDI2NS42MTkzOTRsMTQzLjgyNTQ1NSAxNDMuODI1NDU1YTM0Ljc1MzkzOSAzNC43NTM5MzkgMCAwIDAgNTAuMjY5MDkxIDBsNzUuNTU4Nzg4LTc1LjU1ODc4OGEzNC43NTM5MzkgMzQuNzUzOTM5IDAgMCAwIDAtNTAuMjY5MDkxeiBtLTY0LjY5ODE4MiA2MS4xMjk2OTdhMzUuNTI5Njk3IDM1LjUyOTY5NyAwIDEgMSAwLTUwLjI2OTA5MSAzNC43NTM5MzkgMzQuNzUzOTM5IDAgMCAxIDAgNTAuMjY5MDkxeiBtMCAwIiBmaWxsPSIjMkU5RkZGIiBwLWlkPSIxNTQyNiI+PC9wYXRoPjwvc3ZnPg==',
    text: '报修',
    url: "/pages/reportRepair/reportRepair"
  },
  {
    id: 6,
    svg: 'data:image/svg+xml;base64,PHN2ZyB0PSIxNzI2Mzc5MTA4NzMxIiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjE2NzY0IiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiPjxwYXRoIGQ9Ik01MTIgNTEybS01MTIgMGE1MTIgNTEyIDAgMSAwIDEwMjQgMCA1MTIgNTEyIDAgMSAwLTEwMjQgMFoiIGZpbGw9IiM1OUFDREQiIHAtaWQ9IjE2NzY1Ij48L3BhdGg+PHBhdGggZD0iTTcwOC4wNzYzMDggMjcwLjg2NzY5Mkg2NzYuNjI3NjkyYzMuMDkxNjkyIDUuMzk1NjkyIDQuNjg2NzY5IDExLjUwMDMwOCA0LjY0NzM4NSAxNy43MjMwNzd2MzUuODU5NjkzYTM1LjQ0NjE1NCAzNS40NDYxNTQgMCAwIDEtMzQuMzIzNjkyIDM1LjY0MzA3NkgzNTkuMTA4OTIzYTM1LjY0MzA3NyAzNS42NDMwNzcgMCAwIDEtMzQuNzc2NjE1LTM1LjY0MzA3NnYtMzUuODc5Mzg1YTMzLjQzNzUzOCAzMy40Mzc1MzggMCAwIDEgNC44ODM2OTItMTcuNzIzMDc3SDI5Ny43NDc2OTJhNzEuNTIyNDYyIDcxLjUyMjQ2MiAwIDAgMC03MS41MjI0NjEgNzEuMzI1NTM4djM1Ny4xNTkzODVhNzEuNTIyNDYyIDcxLjUyMjQ2MiAwIDAgMCA3MS41MjI0NjEgNzAuODUyOTIzaDI0MS4xMzIzMDhBMTYwLjc0ODMwOCAxNjAuNzQ4MzA4IDAgMCAxIDc3OS44MTUzODUgNTYxLjYwNDkyM1YzNDIuMTczNTM4YTcxLjUyMjQ2MiA3MS41MjI0NjIgMCAwIDAtNzEuNzM5MDc3LTcxLjMwNTg0NnpNNDk1LjA2NDYxNSA2MjkuMTI5ODQ2aC0xNzAuNzMyMzA3di01NS4zMzUzODRoMTcwLjczMjMwN3Y1NS4zMzUzODR6IG04MS4wMzM4NDctMTE5Ljc4ODMwOEgzMjQuMzMyMzA4di01NS41NzE2OTJoMjUxLjc2NjE1NHY1NS41NzE2OTJ6IiBmaWxsPSIjRkZGRkZGIiBwLWlkPSIxNjc2NiI+PC9wYXRoPjxwYXRoIGQ9Ik00MzcuNzIwNjE1IDMyNC45MDMzODVoMTQyLjgwODYxNmEzNS44NzkzODUgMzUuODc5Mzg1IDAgMCAwIDM1Ljg3OTM4NC0zNS42NDMwNzd2LTM1LjY2Mjc3YTM1LjY0MzA3NyAzNS42NDMwNzcgMCAwIDAtMzUuODc5Mzg0LTM1LjY0MzA3NmgtMTQyLjgwODYxNmEzNS42NDMwNzcgMzUuNjQzMDc3IDAgMCAwLTM1Ljg3OTM4NCAzNS42NDMwNzZ2MzUuNjQzMDc3YTM1Ljg3OTM4NSAzNS44NzkzODUgMCAwIDAgMzUuODc5Mzg0IDM1LjY0MzA3N3pNNjcyLjQzMzIzMSA1NTYuNTA0NjE1YTEyNC44ODg2MTUgMTI0Ljg4ODYxNSAwIDEgMCAxMjQuODY4OTIzIDEyNS4xMDUyMzEgMTI0LjY1MjMwOCAxMjQuNjUyMzA4IDAgMCAwLTEyNC44Njg5MjMtMTI1LjEwNTIzMXogbTcxLjI4NjE1NCAxNjAuNTMxNjkzaC0xMDYuOTI5MjMxdi05OS40MDY3N2gzNS42NDMwNzdWNjc3LjQxNTM4NWg3MS4yODYxNTR2MzkuNjIwOTIzeiIgZmlsbD0iI0ZGRkZGRiIgcC1pZD0iMTY3NjciPjwvcGF0aD48L3N2Zz4=',
    text: '请假',
    url: "/pages/LeaveApplication/LeaveApplication"
  },
  {
    id: 7,
    svg: 'data:image/svg+xml;base64,PHN2ZyB0PSIxNzI2Mzc5MTMxMTY2IiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjE3ODM0IiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiPjxwYXRoIGQ9Ik02ODIuNjY2NjY3IDU3Ny42Mzg0aDIzNi4zMDUwNjZDOTg4Ljk3OTIgNTc3LjYzODQgMTAyNCA2MTIuNjU5MiAxMDI0IDY4Mi42NjY2Njd2MjM2LjMwNTA2NkMxMDI0IDk4OC45NzkyIDk4OC45NzkyIDEwMjQgOTE4Ljk3MTczMyAxMDI0SDY4Mi42NjY2NjdjLTcwLjAwNzQ2NyAwLTEwNS4wMjgyNjctMzUuMDIwOC0xMDUuMDI4MjY3LTEwNS4wMjgyNjdWNjgyLjY2NjY2N2MwLTcwLjAwNzQ2NyAzNS4wMjA4LTEwNS4wMjgyNjcgMTA1LjAyODI2Ny0xMDUuMDI4MjY3ek0xMDUuMDI4MjY3IDBIMzQxLjMzMzMzM2M3MC4wMDc0NjcgMCAxMDUuMDI4MjY3IDM1LjAyMDggMTA1LjAyODI2NyAxMDUuMDI4MjY3VjM0MS4zMzMzMzNjMCA3MC4wMDc0NjctMzUuMDIwOCAxMDUuMDI4MjY3LTEwNS4wMjgyNjcgMTA1LjAyODI2N0gxMDUuMDI4MjY3QzM1LjAyMDggNDQ2LjM2MTYgMCA0MTEuMzQwOCAwIDM0MS4zMzMzMzNWMTA1LjAyODI2N0MwIDM1LjAyMDggMzUuMDIwOCAwIDEwNS4wMjgyNjcgMHogbTAgNTc3LjYzODRIMzQxLjMzMzMzM2M3MC4wMDc0NjcgMCAxMDUuMDI4MjY3IDM1LjAyMDggMTA1LjAyODI2NyAxMDUuMDI4MjY3djIzNi4zMDUwNjZDNDQ2LjM2MTYgOTg4Ljk3OTIgNDExLjM0MDggMTAyNCAzNDEuMzMzMzMzIDEwMjRIMTA1LjAyODI2N0MzNS4wMjA4IDEwMjQgMCA5ODguOTc5MiAwIDkxOC45NzE3MzNWNjgyLjY2NjY2N2MwLTcwLjAwNzQ2NyAzNS4wMjA4LTEwNS4wMjgyNjcgMTA1LjAyODI2Ny0xMDUuMDI4MjY3eiBtNjIwLjk1MzYtMTU2LjIyODI2N2MzNC4xMzMzMzMgMzQuMTMzMzMzIDg3Ljk2MTYgMzQuMTMzMzMzIDEyMi4wOTQ5MzMgMGwxMzYuNTMzMzMzLTEzNy44MzA0YzM0LjEzMzMzMy0zNC4xMzMzMzMgMzQuMTMzMzMzLTg3Ljk2MTYgMC0xMjIuMDk0OTMzbC0xMzYuNTMzMzMzLTEzNi41MzMzMzNjLTMyLjgwMjEzMy0zMi44MzYyNjctODcuOTYxNi0zMi44MzYyNjctMTIwLjgzMiAwbC0xMzcuNzk2MjY3IDEzNi41MzMzMzNjLTM0LjEzMzMzMyAzNC4xMzMzMzMtMzQuMTMzMzMzIDg3Ljk2MTYgMCAxMjIuMDk0OTMzbDEzNi41MzMzMzQgMTM3LjgzMDR6IiBmaWxsPSIjNjBBREZDIiBwLWlkPSIxNzgzNSI+PC9wYXRoPjwvc3ZnPg==',
    text: '更多',
    url: "/pages/MenuButton/MenuButton"
  },
])
let list = ref<newsList[]>([
]
)
onReady(() => {
  getNews()
  getUserinfo()
  getCardInfo()
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
    onlyFromCamera: false,
    autoZoom: true,
    success: function (res) {
      console.log('条码类型：' + res.scanType);
      console.log('条码内容：' + res.result);
      request({
        url: '/card/pay/scan',
        method: 'post',
        data: {
          cardNo: '',
          orderNo: ''
        }
      })
    },
    fail: function (res) {
      showtoast.onError(res.errMsg)
      console.log(res.errMsg)
    }
  })
}
function routeto(url: string) {
  if (url.includes('/pages')) {
    uni.navigateTo({
      url: url
    })
  } else {
    takephoto()
  }
}
function getNews() {
  request({
    url: '/news/list',
    method: 'get',
  }).then((res: any) => {
    if (res.success) {
      console.log(res.data)
      list.value = res.data
      let three = 0
      res.data.forEach(item => {
        three++
        if (item.cover != null && three < 3) {
          bannerImg.value.push(item.cover)
        }
      })
    } else {
      showtoast.onError(res.message)
    }
  }).catch((err) => {
    showtoast.onError(err)
  })
}
function moreNews() {
  uni.navigateTo({
    url: '/pages/moreNews/moreNews'
  })
}
function toNews(item) {
  console.log(item.slug)
  if (item.slug != undefined && item.slug != '' && item.slug != null) {
    uni.navigateTo({
      url: '/pages/article/article?slug=' + item.slug,
    })
  }
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
function getCardInfo() {
  request({
    url: '/card/current',
  }).then((res) => {
    if (res.success) {
      card.setCardInfo(res.data)
    } else {
      showtoast.onError(res.message)
    }
    console.log(res.data)
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
    height: 108rpx;
  }

  .banner {
    height: 260rpx;
  }

  .btn-group {
    display: grid;
    height: 320rpx;
    grid-template-columns: 1fr 1fr 1fr 1fr;

    .btn-item {
      background-color: $moduleBackgroundColor;
      width: 100%;
      display: flex;
      align-items: center;
      flex-direction: column;
      padding: 20rpx 0;

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
