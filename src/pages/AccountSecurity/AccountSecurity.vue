<template>
    <view class="AccountSecurity">
        <Navbar :bgColor="'#a6ffcb'">
            <template #left>
                <view>
                    <u-icon name="arrow-left" size="20" color="#303133" @click="back"></u-icon>
                </view>
            </template>
            <template #center>
                <view>
                    <text>设置</text>
                </view>
            </template>
        </Navbar>
        <view class="AccountSecurity-list">
            <u-cell-group v-for="item in AccountSecurityList" :key="item.title">
                <u-cell isLink v-if="item.title != '绑定QQ登录' && item.title != '绑定微博登录'"
                    @click="toPage(item.url as string)">
                    <template #title>
                        {{ item.title }}
                    </template>
                    <template #value>
                        <view class="value">
                            {{ item.value }}
                        </view>
                    </template>
                </u-cell>
                <u-cell isLink v-else>
                    <template #title>
                        {{ item.title }}
                    </template>
                    <template #value>
                        <view v-if="item.value" class="bind">
                            已绑定
                        </view>
                        <view v-else class="unbind">
                            未绑定
                        </view>
                    </template>
                </u-cell>
                <view v-if="item.title == '修改邮箱' || item.title == '绑定微博登录'">
                    <u-gap height="20" bgColor="#F3F4F6"></u-gap>
                </view>
            </u-cell-group>
        </view>
        <u-toast ref="toast"></u-toast>
    </view>
</template>

<script setup lang='ts'>
import { onMounted, ref, toRaw, reactive, shallowRef, watch, computed } from 'vue'
import Navbar from "@/components/layout/navbar/navbar.vue"
import useUserStore from '@/store/user'
import showtoast from "@/utils/showtoast"
const store = useUserStore()
const userInfo = computed(() => store.userinfo)
let toast = ref()
onMounted(() => {
    showtoast.onbind(toast.value)
})
let AccountSecurityList = [
    {
        title: '更换手机号',
        value: userInfo.value.phone,
        url: '/pages/ChangePhone/ChangePhone?type=phone'
    },
    {
        title: '更换登录密码',
        value: '',
        url: '/pages/ChangePassword/ChangePassword'
    },
    {
        title: '修改邮箱',
        value: userInfo.value.email,
        url: '/pages/ChangePhone/ChangePhone?type=email'
    },
    {
        title: '绑定QQ登录',
        value: ''
    },
    {
        title: '绑定微博登录',
        value: ''
    },
    {
        title: '注销账号',
        value: '注销后将无法登录,请谨慎操作',
        url: ''
    }
]
function toPage(url: string) {
    console.log(url);


    if (url != '' && url != undefined) {
        uni.navigateTo({
            url: url,
        })
    }
}
function back() {
    uni.navigateBack(
        {
            delta: 1
        }
    )
}
</script>

<style lang='scss' scoped>
.AccountSecurity {
    .AccountSecurity-list {
        .value {
            color: $u-info;
        }

        .bind {
            color: $u-error;
        }

        .unbind {
            color: $u-info;
        }
    }
}
</style>
