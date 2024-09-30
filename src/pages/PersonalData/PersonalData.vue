<template>
    <view class="PersonData">
        <Navbar :bgColor="'#a6ffcb'" class="navbar">
            <template #left>
                <view>
                    <u-icon name="arrow-left" size="20" color="#303133" @click="back"></u-icon>
                </view>
            </template>
            <template #center>
                <view>
                    <text>个人资料</text>
                </view>
            </template>
        </Navbar>
        <!-- #ifdef APP -->
        <u-gap height="20"></u-gap>
        <!-- #endif -->
        <view class="list">
            <u-list height="550">
                <u-list-item v-for="item in list" :key="item.title">
                    <u-cell v-if="item.title == '性别' || item.title == '头像'" isLink @click="modify(item)">
                        <template #title>
                            <view>
                                {{ item.title }}
                            </view>
                        </template>
                        <template #value>
                            <u-avatar v-if="item.title == '头像'" shape="square" size="35" :src="userInfo.avatar"
                                customStyle="margin: -3px 5px -3px 0"></u-avatar>
                            <view v-else>{{ userInfo[item.value] }}</view>
                        </template>
                    </u-cell>
                    <u-cell v-else-if="item.title == '身份证'">
                        <template #title>
                            <view>
                                {{ item.title }}
                            </view>
                        </template>
                        <template #value>
                            <view class="text">{{ userInfo[item.value] ? '已经核证身份' : '未验证' }}</view>
                        </template>
                    </u-cell>
                    <u-cell v-else>
                        <template #title>
                            <view>
                                {{ item.title }}
                            </view>
                        </template>
                        <template #value>
                            <view v-if="item.title == '手机号'" class="text">
                                {{ userInfo[item.value] ? userInfo[item.value].replace(/(\d{3})\d{4}(\d{4})/,
            '$1****$2') : userInfo[item.value] }}
                            </view>
                            <view v-else-if="item.title == '邮箱'" class="text">
                                {{ userInfo[item.value] ? userInfo[item.value].replace(/^(.{2})(.*?)(@.*)/, '$1****$3')
            : userInfo[item.value] }}
                            </view>
                            <view v-else-if="item.title == '角色'" v-if="userInfo['roles']" class="text">
                                {{ userInfo['roles'][0].label }}
                            </view>
                            <view v-else class="text">{{ userInfo[item.value] }}</view>
                        </template>
                    </u-cell>
                </u-list-item>
            </u-list>
        </view>
        <u-toast ref="toast"></u-toast>
    </view>
</template>

<script setup lang='ts'>
import { onMounted, ref, toRaw, reactive, shallowRef, computed, onUnmounted } from 'vue'
import Navbar from "@/components/layout/navbar/navbar.vue"
import useUserStore from '@/store/user'
import request from '@/utils/request'
import showtoast from "@/utils/showtoast"
import { settings } from '@/settings/settings'
const store = useUserStore()
const userInfo = computed(() => store.userinfo)
console.log(userInfo.value)

let uid = uni.getStorageSync('uid')
let toast = ref()
let file = ref<File>()
let list = ref([
    {
        title: '头像',
        value: 'avatar',
        url: '',
    },
    {
        title: '姓名',
        value: 'username',
        url: '',
    },
    {
        title: '性别',
        value: 'sex',
        url: '',
    },
    {
        title: '手机号',
        value: 'phone',
        url: '',
    },
    {
        title: '邮箱',
        value: 'email',
        url: '',
    },
    {
        title: '身份证',
        value: 'idNumber',
        url: '',
    },
    {
        title: '学/工号',
        value: 'number',
        url: '',
    },
    {
        title: '角色',
        value: 'roles',
        url: '',
    }
])
onMounted(() => {
    showtoast.onbind(toast.value)
})

function modify(item) {
    if (item.title == '头像') {
        upload()
    } else {
        uni.navigateTo({
            url: '/pages/PersonalData/ModifyData'
        })
    }
}
function upload() {
    uni.chooseImage({
        count: 1,
        sizeType: ['compressed '],
        extension: ['png', 'jpg', 'jpeg', 'gif', 'bmp', 'webp'],
        sourceType: ['album'],
        success(res) {
            file.value = res.tempFiles[0]
            // console.log(file.value)
            uni.uploadFile({
                url: settings.apiAddress + '/file/upload',
                fileType: 'image',
                file: file.value,
                name: '',
                header: {
                    Authorization: uni.getStorageSync('token') ? 'Bearer ' + uni.getStorageSync('token') : '',
                },
                timeout: 5000,
                success(res) {
                    let result = JSON.parse(res.data)
                    let data = result.data
                    if (result.success) {
                        store.setAvatar(data.url)
                        modifyAvatar()
                        // showtoast.onSuccess('上传成功')
                    } else {
                        showtoast.onError(result.message)
                    }
                    console.log(result)
                },
                fail(result) {
                    console.log(result);
                },
            })
        },
        fail(err) {
            console.log(err)
        }
    })
}
function modifyAvatar() {
    request({
        url: `/user/${uid}`,
        method: 'put',
        data: {
            avatar: userInfo.value.avatar
        }
    }).then((res) => {
        if (res.success) {
            showtoast.onSuccess('修改成功')
        } else if (res.message != null) {
            showtoast.onError(res.message)
        } else {

        }
    }).catch((err) => {
        showtoast.onError(err)
    })
}
function back() {
    uni.navigateBack()
}
</script>

<style lang='scss' scoped>
.PersonData {
    display: flex;
    flex-direction: column;
    height: 100%;

    .navbar {
        height: 110rpx;
    }

    .list {
        .text {
            color: #8C8C8C;
        }
    }
}
</style>
