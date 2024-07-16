<template>
    <u-tabbar :value="active" :fixed="true" :placeholder="true" :safeAreaInsetBottom="true" class="tabbar">
        <u-tabbar-item :text="item.text" :icon="fillicon(item)" @click="click(item)" v-for="item in list"
            :dot="item.badge != 0 ? true : false" :key="item.id" :name="item.name"></u-tabbar-item>
    </u-tabbar>
</template>

<script setup lang='ts'>
import { ref, reactive, onMounted } from 'vue'
import usetabbar from "@/store/tabbar"
let badge = ref(1000)
let active = ref('')
const tabbar = usetabbar()
let list = reactive([
    {
        id: 0,
        text: '首页',
        icon: 'home',
        name: "home",
        selectedIconPath: "home-fill",
        pagePath: "/pages/tabbar/home/index",
        badge: 0
    },
    {
        id: 1,
        text: '校园卡',
        icon: '/static/images/tabBar/card.png',
        selectedIconPath: "/static/images/tabBar/card-fill.png",
        name: "rmb-circle",
        pagePath: "/pages/tabbar/cards/index",
        badge: 0
    },
    {
        id: 2,
        text: '消息',
        icon: 'bell',
        name: "bell",
        selectedIconPath: "bell-fill",
        pagePath: "/pages/tabbar/messages/index",
        badge: badge.value
    },
    {
        id: 3,
        text: '我的',
        icon: 'account',
        name: "account",
        selectedIconPath: "account-fill",
        pagePath: "/pages/tabbar/my/index",
        badge: 0
    }
])
onMounted(() => {
    active.value = usetabbar().getActive
})
function click(item) {
    let name = usetabbar().getActive
    if (item.name != name) {
        tabbar.setActive(item.name)
        active.value = name
        console.log(active.value);
        uni.switchTab({
            url: item.pagePath,
            success() {
            }
        })
    }
}
function fillicon(item) {
    return usetabbar().getActive === item.name ? item.selectedIconPath : item.icon
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
