<template>
    <u-navbar fixed :safeAreaInsetTop="true" :bgColor="bgColor" height="88rpx">
        <template #left>
            <slot name="left"></slot>
        </template>
        <template #center>
            <slot name="center"></slot>
        </template>
        <template #right>
            <slot name="right"></slot>
        </template>
    </u-navbar>
</template>

<script setup lang='ts'>
defineProps(['bgColor'])

</script>

<style lang='scss' scoped>
:global(.u-navbar) {
    height: 88rpx;
}
</style>
