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
                    <text>卡余额</text>
                </view>
            </template>
        </Navbar>
        <!-- #ifdef APP  -->
        <u-gap height="20"></u-gap>
        <!-- #endif -->
        <!-- #ifdef MP-WEIXIN  -->
        <u-gap height="50"></u-gap>
        <!-- #endif -->
        <view class="form">
            <u-form labelPosition="left" :model="form">
                <u-form-item label="卡号" borderBottom labelWidth="60">
                    <u-input v-model="form.cardNo" maxlength="6" type="number" border="bottom" clearable></u-input>
                </u-form-item>
                <u-form-item label="卡余额" borderBottom labelWidth="60">
                    <u-input class="card-balance" v-model="form.cardBalance" disabled disabledColor="#ffffff"
                        border="none"></u-input>
                </u-form-item>
            </u-form>
        </view>
        <view class="btn-box">
            <u-button type="primary" class="btn" shape="circle" @click="getBalance">查询</u-button>
            <u-button type="primary" class="btn" shape="circle" @click="torecharge">充值</u-button>
        </view>
    </view>
    <u-toast ref="toast"></u-toast>
</template>

<script setup lang='ts'>
import { ref, reactive, watch, onMounted, computed } from 'vue'
import Navbar from "@/components/layout/navbar/navbar.vue"
import showtoast from "@/utils/showtoast"
import useCard from '@/store/card'
import request from '@/utils/request'
const store = useCard()
const cardinfo = computed(() => store.cardinfo)
const toast = ref<any>()
let form = ref({
    cardNo: cardinfo.value.carNo || '',
    cardBalance: cardinfo.value.cardBalance || null
})
onMounted(() => {
    showtoast.onbind(toast.value)
    if (form.value.cardNo != '') {
        getBalance()
    }
})
function getBalance() {
    request({
        url: `/card/${form.value.cardNo}/balance`,
    }).then(res => {
        if (res.success) {
            form.value.cardBalance = res.data as number
        } else {
            showtoast.onError(res.message)
        }
    }).catch((err) => {
        showtoast.onError(err)
    })
}
function torecharge() {
    uni.navigateTo({
        url: '/pages/recharge/recharge?cardNo=' + form.value.cardNo
    })
}
function back() {
    uni.navigateBack({
        delta: 1
    })
}
</script>

<style lang='scss' scoped>
.form {
    padding: 40rpx;

    .card-balance {
        margin-left: 30rpx;
    }
}

.btn-box {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 40rpx;

    .btn {
        width: 40vw;
    }
}
</style>
