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
        <!-- #ifdef APP  -->
        <u-gap height="20"></u-gap>
        <!-- #endif -->
         <!-- #ifdef APP || MP-WEIXIN -->
        <u-gap height="50"></u-gap>
        <!-- #endif -->
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
                        余额：{{ balance }}
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
        <view v-html="payAddress"></view>
    </view>
</template>

<script setup lang='ts'>
import { onMounted, ref, toRaw, reactive, shallowRef, watch, onUnmounted } from 'vue'
import Navbar from "@/components/layout/navbar/navbar.vue"
import request from '@/utils/request'
import showtoast from '@/utils/showtoast'
import { onLoad } from '@dcloudio/uni-app';
let number = ref()
let rechargeAmount = ref()
let charge = ref(true)
let balance = ref()
let payAddress = ref()
const toast = ref()
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
onLoad((query:any) => {
    number.value = query.cardNo ? query.cardNo : ''
    
})
onMounted(() => {
    showtoast.onbind(toast.value)
})
function query() {
    request({
        url: `/card/${number.value}/balance`,
    }).then((res) => {
        if (res.success) {
            balance.value = res.data
            charge.value = false
        } else {
            showtoast.onError(res.message)
        }
    }).catch((err) => {
        showtoast.onError(err)
    })
}
function recharge() {
    if (rechargeAmount.value == '' || rechargeAmount.value == null || rechargeAmount.value == undefined) {
        showtoast.onError('请输入充值金额')
    } else {
        request({
            url: '/card/alipay/apppay',
            data: {
                totalAmount: rechargeAmount.value,
                cardNo: number.value
            }
        }).then((res:any) => {
            console.log(res)
            // payAddress.value 
            let EnvUtils = plus.android.importClass("com.alipay.sdk.app.EnvUtils");    
            EnvUtils.setEnv(EnvUtils.EnvEnum.SANDBOX);
            let orderInfo = res.body;  //从服务器获取的订单
            //获取支付宝支付对象
            let alipaySev:any = null;  // 支付宝支付对象
            plus.payment.getChannels(function (channels) {
                for (var i in channels) {
                    var channel = channels[i];
                    if (channel.id === 'alipay') {
                        alipaySev = channel;
                    }
                }
                //发起支付
                plus.payment.request(alipaySev, orderInfo, function (result) {
                    var rawdata = JSON.parse(result.rawdata as string);
                    console.log(rawdata);
                    showtoast.onSuccess('支付成功')
                    console.log("支付成功");
                    query()
                }, function (e) {
                    showtoast.onError(e.message)
                    console.log("支付失败：" + JSON.stringify(e));
                });
            }, function (e) {
                console.log("获取支付渠道失败：" + JSON.stringify(e));
            });
        }).catch((err) => {
            // showtoast.onError(err)
        })
    }
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
