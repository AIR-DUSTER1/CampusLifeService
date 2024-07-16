<template>
  <layout class="my">
    <view>
      <u-cell-group>
        <u-cell icon="setting-fill" title="个人设置"></u-cell>
      </u-cell-group>
    </view>
    <view>
      <u-cell-group>
        <u-cell icon="setting-fill" title="个人设置"></u-cell>
        <u-cell icon="integral-fill" title="会员等级" value="新版本"></u-cell>
      </u-cell-group>
    </view>
  </layout>
</template>

<script setup lang='ts'>
import { reactive } from 'vue'
import layout from "@/components/layout/index.vue"
const my = reactive({
  text1: 'uview-plus UI众多组件覆盖开发过程的各个需求，组件功能丰富，多端兼容。让您快速集成，开箱即用'
})


</script>

<style scopedlang='scss' scoped>
.my-main {
  text-align: center;
}
</style>