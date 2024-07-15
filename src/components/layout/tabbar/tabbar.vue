<template>
    <u-tabbar :value="active" :fixed="true" :placeholder="false" :safeAreaInsetBottom="true" class="tabbar">
        <u-tabbar-item :text="item.text" :icon="item.icon" @click="click(item)" v-for="item in list"
            :dot="item.badge != 0 ? true : false" :key="item.id"></u-tabbar-item>
    </u-tabbar>
</template>

<script setup lang='ts'>
import { ref, reactive, onMounted } from 'vue'
import usetabbar from "@/store/tabbar"
let badge = ref(1000)
let active = usetabbar().getActive
const tabbar = usetabbar()
const route = uni.$u.route
let list = reactive([
    {
        id: 0,
        text: '首页',
        icon: 'home',
        pagePath: "/pages/home/index",
        badge: 0
    },
    {
        id: 1,
        text: '校园卡',
        icon: 'rmb-circle',
        pagePath: "/pages/cards/index",
        badge: 0
    },
    {
        id: 2,
        text: '消息',
        icon: 'bell',
        pagePath: "/pages/messages/index",
        badge: badge.value
    },
    {
        id: 3,
        text: '我的',
        icon: 'account',
        pagePath: "/pages/my/index",
        badge: 0
    }
])
onMounted(() => {
    tabbar.setActive(active)
})
function click(item) {
    console.log(item.id);
    active = item.id
    uni.switchTab({
        url: item.pagePath,
        success() {
            tabbar.setActive(active)
        }
    })
}
</script>

<style lang='scss' scoped>
.tabbar {
    :deep(.u-tabbar__content__item-wrapper) {
        height: 100rpx;
    }

    :deep(.u-icon__icon) {
        font-size: 40rpx !important;
        line-height: 40rpx !important;
    }

    :deep(.u-tabbar-item__text) {
        font-size: 24rpx !important;
    }
}
</style>
