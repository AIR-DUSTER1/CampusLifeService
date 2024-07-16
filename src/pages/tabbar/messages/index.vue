<template>
    <layout>
        <view class="navbar">
            <Navbar :bgColor="'#a6ffcb'">
                <template #left>
                    <view></view>
                </template>
                <template #center>
                    <view>
                        <text>消息中心</text>
                    </view>
                </template>
            </Navbar>
        </view>
    </layout>
</template>

<script setup lang='ts'>
import layout from "@/components/layout/index.vue"
import Navbar from "@/components/layout/navbar/navbar.vue"
</script>

<style lang='scss' scoped></style>
