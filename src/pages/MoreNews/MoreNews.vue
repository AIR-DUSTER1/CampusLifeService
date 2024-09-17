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
                    <text>个人资料</text>
                </view>
            </template>
        </Navbar>
        <view>
            <u-list height="550" @scrolltolower='scrolltolower'>
                <u-list-item v-for="item in NewsList" >
                    <u-cell isLink @click="toArticle(item)">
                        <template #title>
                            <view>
                                {{ item }}
                            </view>
                        </template>
                        <template #value>
                            <view >{{ item }}</view>
                        </template>
                    </u-cell>
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
import showtoast from "@/utils/showtoast"
let NewsList = ref([])
let toast =ref()

onMounted(() => {
    showtoast.onbind(toast.value)
    getNews()
})
function getNews(){
    request({
        url:'/news/page',
        data:{
            page:1,
            pageSize:10
        }
    }).then((res) => {
        if (res.success) {
            
        }else{
            showtoast.onError(res.message)
        }
    }).catch((err) => {
        showtoast.onError(err)
    })
}
function scrolltolower(){

}
function toArticle(item){
    console.log(item);
    
}
function back() {
    uni.navigateBack(
        {
            delta: 1
        }
    )
}
</script>

<style lang='scss' scoped></style>
