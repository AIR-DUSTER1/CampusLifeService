<template>
    <view>
        <Navbar :bgColor="'#a6ffcb'">
            <template #left>
                <view>
                    <u-icon name="arrow-left" size="20" color="#303133" @click="back"></u-icon>
                </view>
            </template>
            <template #center>
                <view>
                    <text>投诉建议</text>
                </view>
            </template>
        </Navbar>
        <!-- #ifdef APP || MP-WEIXIN -->
        <u-gap height="20"></u-gap>
        <!-- #endif -->
        <u-sticky bgColor="#fff" class="sticky">
            <u-tabs :list="tabs" @change="change" class="tabs"></u-tabs>
        </u-sticky>
        <view v-if="current == '反馈留言'" class="feedback">
            <view class="tips">您好，很抱歉我们暂时无法为您提供服务，如需帮助，请留言，我们将尽快联系并解决您的问题</view>
            <view class="leavingMessage">问题描述：</view>
            <u-textarea v-model="Message.leavingMessage" placeholder="您好，为了更好地解决您的问题，请告诉我们以下内容：1,您的姓名2.问题描述"
                class="text"></u-textarea>
            <u-upload :fileList="Message.file" @afterRead="afterRead" @delete="deletePic" name="1" multiple
                :maxCount="2" class="upload"></u-upload>
            <view class="upload-tips">最多两个,大小不超过5M</view>
            <u-input v-model="Message.phone" placeholder="请输入你的手机号" class="phone"></u-input>
            <u-button shape="circle" type="primary" @click="submit" class="submit">提交</u-button>
        </view>
        <view v-else-if="current == '留言列表'">
            <u-swipe-action>
                <template v-for="(item, index) in MessageList" :key="index">
                    <u-swipe-action-item :options="options1" @click="deleteMessage" :index="index" :name="index">
                        <u-cell isLink @click="toMessage(item)">
                            <template #title>
                                <view>
                                    {{ userInfo.username }}
                                </view>
                                <view>
                                    {{ item.leavingMessage }}
                                </view>
                            </template>
                        </u-cell>
                    </u-swipe-action-item>
                </template>
            </u-swipe-action>
        </view>
    </view>
    <u-toast ref="toast"></u-toast>
</template>

<script setup lang='ts'>
import { onMounted, ref, toRaw, reactive, computed } from 'vue'
import Navbar from "@/components/layout/navbar/navbar.vue"
import showtoast from "@/utils/showtoast"
import useUserStore from '@/store/user'
const store = useUserStore()
const userInfo = computed(() => store.userinfo)
const options1 = reactive([{
    text: '删除',
    style: {
        backgroundColor: '#E53D30'
    }
}]);
let current = ref('反馈留言')
const toast = ref()
let MessageList = ref<any>([])
let Message = ref(
    {
        leavingMessage: '',
        file: [],
        phone: null
    }
)
let tabs = [
    { name: '反馈留言' },
    { name: '留言列表' }
]

onMounted(() => {
    MessageList.value.push(...uni.getStorageSync('message'))
    console.log(MessageList.value)
    showtoast.onbind(toast.value)
})
function change(item) {
    console.log(item)
    current.value = item.name
}
function deleteMessage(item) {
    console.log(item.name)
    MessageList.value = MessageList.value.filter((item1: any) => item1 != MessageList.value[item.name])
    uni.setStorageSync('message', MessageList.value)
    showtoast.onSuccess('删除成功')
}
function submit() {
    console.log(Message.value)
    const reg = /^1[3-9]\d{9}$/
    let valid = reg.test(Message.value.phone as never)
    if (!valid) {
        showtoast.onError('请输入正确的手机号')
    } else if (Message.value.leavingMessage == '' || Message.value.phone == null) {
        showtoast.onError('请输入留言内容')
    } else if (Message.value.phone == '' || Message.value.phone == null) {
        showtoast.onError('请输入手机号')
    } else {
        MessageList.value.push(Message.value)
        uni.setStorageSync('message', MessageList.value)
        console.log(MessageList.value)
        uni.showModal({
            content: '你的问题已经提交成功，我们会尽快处理您的问题',
            showCancel: false,
        })
        Message.value = {
            leavingMessage: '',
            file: [],
            phone: null
        }
    }
}
function afterRead(res) {
    console.log(res.file)
    res.file.forEach(item => {
        if (item.size > 5 * 1024 * 1024) {
            showtoast.onError('图片大小不能超过5M')
        } else {
            Message.value.file = res.file
        }
    });
}
function deletePic(res) {
    console.log(res)
    Message.value.file = Message.value.file.filter((item: any) => item.name != res.file.name)
}
function toMessage(item) {
    console.log(item)

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
.sticky {
    border-bottom: 1px solid #EEEEEF;

    .tabs {
        width: 328rpx;
        margin: 0 auto;

    }
}


.feedback {
    padding: 40rpx;

    .tips {
        font-size: 30rpx;
        padding: 24rpx;
        background-color: #F9F9FB;
        color: #B8BFC9;
    }

    .leavingMessage {
        margin: 32rpx 0;
    }

    .text {
        background-color: #F3F4F8;
    }

    .upload {
        margin-top: 32rpx;
    }

    .upload-tips {
        color: #E2E4E9;
        padding-bottom: 16rpx;
    }

    .phone {
        margin-bottom: 16rpx;
    }

    .submit {
        margin-top: 40rpx;
    }
}
</style>
