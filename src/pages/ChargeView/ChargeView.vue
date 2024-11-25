<template>
    <!-- <rich-text :nodes="form"></rich-text> -->
    <!-- <form ref="punchoutForm" name="punchout_form" method="post" :action="formAction">
        <input type="hidden" name="biz_content" :value="bizContent">
        <input type="submit" value="立即支付" style="display:none">
    </form> -->
    <!-- <up-parse :content="form"></up-parse> -->
    <web-view :src='src' ></web-view>
</template>

<script setup lang='ts'>
import { onLoad } from '@dcloudio/uni-app'
import { onMounted, ref, nextTick, onBeforeMount } from 'vue'
import request from '@/utils/request'
import { settings } from '@/settings/settings'
let rechargeAmount = ref()
let number = ref()
let form = ref()
let src = ref()
onLoad((query: any) => {
    rechargeAmount.value = query.rechargeAmount ? query.rechargeAmount : ''
    number.value = query.cardNo ? query.cardNo : ''
    console.log(number.value, rechargeAmount.value);
    src.value = settings.apiAddress+"/card/alipay/topay?totalAmount=" + rechargeAmount.value + "&cardNo=" + number.value

})
onMounted(() => {

})

</script>

<style></style>