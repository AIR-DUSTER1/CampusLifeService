<template>
    <view class="PersonData">
        <Navbar :bgColor="'#a6ffcb'">
            <template #left>

            </template>
            <template #center>
                <view>
                    <text>个人资料</text>
                </view>
            </template>
        </Navbar>
    </view>
</template>

<script setup lang='ts'>
import Navbar from "@/components/layout/navbar/navbar.vue"
</script>

<style lang='scss' scoped></style>
