<template>
    <view class="recharge">
        <Navbar :bgColor="'#a6ffcb'">
            <template #left>
                <view>
                    <u-icon name="arrow-left" size="20" color="#303133" @click="back"></u-icon>
                </view>
            </template>
            <template #center>
                <view>
                    <text>一卡通充值</text>
                </view>
            </template>
        </Navbar>
        <view class="recharge-number" v-if="charge">
            <u-input class="recharge-number-input" v-model="number" placeholder="请输入卡号" type="number"
                :maxlength="'6'"></u-input>
            <u-button type="primary" @click="query" class="query">查询</u-button>
        </view>
        <view class="recharge-content" v-else>
            <view>
                <u-cell>
                    <template #title>
                        卡号：{{ number }}
                    </template>
                </u-cell>
            </view>
            <view>
                <u-cell>
                    <template #title>
                        余额：{{ 100 }}
                    </template>
                </u-cell>
            </view>
            <view class="tag">
                <u-tag v-for="item in tagMoneny" :key="item.money" :text="item.money + '元'" :name="item.money" plain
                    @click="amountOfMoney"></u-tag>
            </view>
            <view class="recharge-money">
                <u-cell :border="false">
                    <template #title>
                        充值金额：
                    </template>
                    <template #value>
                        <u-input v-model="rechargeAmount" placeholder="请输入充值金额" type="number" :maxlength="'6'"
                            border="bottom"></u-input>
                    </template>
                </u-cell>
            </view>
            <view class="recharge-button">
                <u-button class="btn" shape="circle" type="primary" @click="recharge">充值</u-button>
            </view>
        </view>
        <u-toast ref="toast"></u-toast>
    </view>
</template>

<script setup lang='ts'>
import { onMounted, ref, toRaw, reactive, shallowRef, watch, onUnmounted } from 'vue'
import Navbar from "@/components/layout/navbar/navbar.vue"
let number = ref()
let rechargeAmount = ref()
let charge = ref(true)
const tagMoneny = reactive([
    {
        money: 20,
    },
    {
        money: 50,
    },
    {
        money: 100,
    },
    {
        money: 200,
    },
])
function query() {
    charge.value = false
}
function recharge() {

}
function amountOfMoney(item) {
    rechargeAmount.value = item
    console.log(rechargeAmount.value)

}
function back() {
    uni.navigateBack({
        delta: 1
    })
}
</script>

<style lang='scss' scoped>
.recharge {
    padding: 0 20rpx;

    .recharge-number {
        display: flex;
        margin-top: 50rpx;
        padding: 30rpx;
        border: 1px solid #ccc;
        border-radius: 20rpx;
        box-shadow: 10px 10px 5px #888888;

        .recharge-number-input {
            flex: 3;
        }

        .query {
            flex: 1;
        }
    }

    .recharge-content {
        display: flex;
        flex-direction: column;
        margin-top: 50rpx;
        padding: 30rpx;
        border: 1px solid #ccc;
        border-radius: 20rpx;
        box-shadow: 10px 10px 5px #888888;

        .tag {
            display: flex;
            justify-content: space-evenly;
            margin: 20rpx 0 0 0;
        }

        .recharge-money {
            :deep(.u-cell__body__content) {
                flex: none;
            }
        }

        .recharge-button {
            margin-top: 50rpx;

            .btn {
                width: 70vw;
            }
        }
    }


}
</style>
