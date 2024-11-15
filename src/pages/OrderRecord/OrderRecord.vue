<template>
    <view class="OrderRecord">
        <Navbar :bgColor="'#a6ffcb'">
            <template #left>
                <view>
                    <u-icon name="arrow-left" size="20" color="#303133" @click="back"></u-icon>
                </view>
            </template>
            <template #center>
                <view>
                    <text>订单记录</text>
                </view>
            </template>
        </Navbar>
        <!-- #ifdef APP || MP-WEIXIN -->
        <u-gap height="20"></u-gap>
        <!-- #endif -->
        <view class="order-list">
            <u-list @scrolltolower='scrolltolower' class="list">
                <u-list-item>
                    <u-cell v-for="(item,index) in list" :key="index">
                        <template #title>
                            <view>
                                订单号：{{item.orderNo}}
                            </view>
                            <view>
                                {{item.createTime}}
                            </view>
                        </template>
                        <template #value>
                            <view>
                                <view v-if="payStatus.length > 0">
                                    {{item.amount}}
                                    {{ payStatus[index].payStatus }}
                                </view>
                            </view>
                        </template>
                    </u-cell>
                    <view>
                        <u-loadmore :status="status" loading-text='正在加载中...' loadmore-text='加载更多' nomore-text='没有更多了' />
                    </view>
                </u-list-item>
            </u-list>
        </view>

        <u-toast ref="toast"></u-toast>
    </view>
</template>

<script setup lang='ts'>
import { onMounted, ref, toRaw, reactive, shallowRef, watch, onUnmounted } from 'vue'
import Navbar from "@/components/layout/navbar/navbar.vue"
import request from '@/utils/request'
import showtoast from '@/utils/showtoast';
let status = ref('loadmore')
let payStatus = ref<any>([])
let toEnd = ref(false)
let currentPage = ref(1)
const options = reactive([{
    text: '取消',
    style: {
        backgroundColor: '#E53D30'
    }
}])
const toast = ref()
let list = ref<any>([
    // {
    //     orderNo:'123456789',
    //     createTime:'2022-01-01',
    //     payStatus:1,
    //     amount:'100'
    // }
])
let newList = ref([])
onMounted(() => {
    showtoast.onbind(toast.value)
    getOrderList()
})
function getOrderList() {
    request({
        url:'/card/order/page/current',
        data:{
            page:currentPage.value,
            pageSize:10
        }
    }).then((res:any) => {
        if (res.success) {
            if (res.data.records.length != 0) {
                newList.value = res.data.records
                list.value.push(...newList.value)
                status.value = 'loadmore'
            } else {
                toEnd.value = true
                status.value = 'nomore'
            }
            list.value.forEach(item => {
                if (item.payStatus == 1) {
                payStatus.value.push({payStatus:'未支付'})
            } else if (item.payStatus == 2) {
                payStatus.value.push({payStatus:'已支付'})
            } else if (item.payStatus == 3) {
                payStatus.value.push({payStatus:'退款'})
            } else if (item.payStatus == 4) {
                payStatus.value.push({payStatus:'取消'})
            }
            })
            console.log(res)
        } else {
            showtoast.onError(res.message)
        }
    })
}
function scrolltolower() {
    if (toEnd.value) {
        status.value = 'nomore'
    } else {
        currentPage.value += 1
        uni.$u.debounce(getOrderList, 200, false)
    }
}
function back() {
    uni.navigateBack({
        delta: 1
    })
}
</script>

<style lang='scss' scoped></style>
