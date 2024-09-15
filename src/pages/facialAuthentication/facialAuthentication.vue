<template>
  <view class="facialAuthentication">
    <Navbar :bgColor="'#a6ffcb'" class="navbar">
      <template #left>
        <view>
          <u-icon name="arrow-left" size="20" color="#303133" @click="back"></u-icon>
        </view>
      </template>
      <template #center>
        <view>
          <text>人脸认证</text>
        </view>
      </template>
    </Navbar>
    <view class="content">
      <!-- <web-view src="./facialAuthentication.html" /> -->
      <view>
        <u-icon name="camera" size="100" color="#A6A5AF" @click="chooseVideo"></u-icon>
      </view>
      <live-pusher id='livePusher' ref="livePusher" device-position="front" class="livePusher" url="" mode="SD"
        :muted="true" :enable-camera="true" :auto-focus="true" :beauty="0" :whiteness="0" aspect="9:16"
        @statechange="statechange" @netstatus="netstatus" @error="error" local-mirror="disable"
        :enable-mic="false"></live-pusher>
      <button class="btn" @click="start">开始推流</button>
      <button class="btn" @click="switchCamera">切换摄像头</button>
      <button class="btn" @click="startPreview">开启摄像头预览</button>
      <button class="btn" @click="stop">停止推流</button>
      <view class="submit-btn">
        <u-button type="primary" shape="circle" @click="submit" class="submit">提交</u-button>
      </view>
    </view>
  </view>
</template>
<script setup lang='ts'>
import { onMounted, ref, toRaw, reactive, shallowRef, watch, onUnmounted, nextTick, getCurrentInstance, type ComponentInternalInstance } from 'vue'
import { webSoketInit, sendMessage, websoket, closeSocket } from '@/apis/websocket'
import { onLoad, onReady } from "@dcloudio/uni-app"
import { settings } from '@/settings/settings'
import Navbar from "@/components/layout/navbar/navbar.vue"
let context = ref()
let livePusher = ref()
const instance = getCurrentInstance() as ComponentInternalInstance

onReady(() => {
  context.value = uni.createLivePusherContext("livePusher", getCurrentInstance()?.proxy);

})// 生成
function statechange(e) {
  console.log("statechange:" + JSON.stringify(e));
}
function stop() {
  context.value.stop({
    success: (a) => {
      console.log(JSON.stringify(a))
    }
  });
}
function netstatus(e) {
  console.log("netstatus:" + JSON.stringify(e));
}
function error(e) {
  console.log("error:" + JSON.stringify(e));
}
function start() {
  context.value.start({
    success: (a) => {
      console.log("livePusher.start:" + JSON.stringify(a));
    }
  });
}
function startPreview() {
  context.value.startPreview({
    success: (a) => {
      console.log("livePusher.startPreview:" + JSON.stringify(a));
    }
  });
}
function switchCamera() {
  context.value.switchCamera({
    success: (a) => {
      console.log(a);

      console.log("livePusher.switchCamera:" + JSON.stringify(a));
    }
  });
}
onMounted(() => {
  webSoketInit(settings.apiAddress + '')
  // sendMessage(JSON.stringify(toRaw(sendData.value)))
  // websoket.value.addEventListener('message', function (event) {
  //     console.log('Message from server ', event.data)
  // })

})
onUnmounted(() => {
  closeSocket()
})


function chooseVideo() {
  uni.chooseVideo({
    sourceType: ['camera'],
    camera: 'front',
    success: function (res: any) {
      console.log(res);

      // src = res.tempFilePath;
    }
  })
}
function back() {
  uni.navigateBack(
    {
      delta: 1
    }
  )
}
function submit() {

}
</script>

<style lang='scss' scoped>
.facialAuthentication {
  display: flex;
  flex-direction: column;

  .navbar {
    height: 160rpx;
  }

  .content {
    display: flex;
    flex-direction: column;
    align-items: center;

    .submit-btn {
      width: 70vw;
      margin-top: 30rpx;
    }
  }
}
</style>
