<template>
    <u-tabbar :value="active" :fixed="true" :placeholder="true" :safeAreaInsetBottom="true" class="tabbar">
        <u-tabbar-item :text="item.text" :icon="fillicon(item)" @click="click(item)" v-for="item in list"
             :badge="item.badge" :key="item.id" :name="item.name"></u-tabbar-item>
    </u-tabbar>

</template>

<script setup lang='ts'>
import usetabbar from "@/store/tabbar"
import { ref, reactive, onMounted, computed } from 'vue'
import { onLaunch, onShow, onHide, onLoad } from "@dcloudio/uni-app"
import request from "@/utils/request"

let badge = computed(() => tabbar.getBadge)
let active = ref()
const tabbar = usetabbar()
let name = computed(() => tabbar.getActive)
let curPage = getCurrentPages();
let route = curPage[curPage.length - 1].route
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
        text: '一卡通',
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
        badge: computed(()=>badge.value)
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
onLoad(() => {
    getbadge()
})
onShow(() => {
    setCurrent(route)
    active.value = name.value
})
function click(item) {
    if (item.name != name.value) {
        tabbar.setActive(item.name)
        uni.switchTab({
            url: item.pagePath,
            success() {
                // #ifndef MP-WEIXIN
                active.value = usetabbar().getActive
                // #endif
            }
        })
    }
}
function fillicon(item) {
    return usetabbar().getActive === item.name ? item.selectedIconPath : item.icon
}
function setCurrent(route: string | undefined) {
    if (route == 'pages/tabbar/home/index') {
        tabbar.setActive('home')
    } else if (route == 'pages/tabbar/cards/index') {
        tabbar.setActive('rmb-circle')
    } else if (route == 'pages/tabbar/messages/index') {
        tabbar.setActive('bell')
    } else if (route == 'pages/tabbar/my/index') {
        tabbar.setActive('account')
    }
}
function getbadge() {
    request({
        url:'/system/notice/unread',
    }).then((res) => {
        if (res.success) {
            tabbar.setBadge(res.data as number)
        }else{
            console.log(res.message);
        }
    }).catch((err) => {
        console.log(err)
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
