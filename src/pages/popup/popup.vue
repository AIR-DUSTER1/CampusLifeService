<template>
    <view @click="close" class="mask">
        <view  class="content">
            <template v-for="item in modelList" >
                <u-cell isLink :name="item.name" @click="onClick">
                    <template #title>
                        <text>{{ item.title }}</text>
                    </template>
                    <template #value>

                    </template>
                </u-cell>
            </template>
        </view>
    </view>
</template>
<script setup lang="ts">
import { ref } from "vue"
const modelList = ref([
    {
        title: "智谱模型",
        name:'zhipu'
    },
    {
        title: "通义模型",
        name:'qianwen'
    },
])
function onClick(e) {
    
    uni.$emit('changeModel',{model:e.name})
    // #ifdef APP-NVUE
    e.stopPropagation()
    // #endif
}
function close() {
    uni.navigateBack()
}

</script>

<style lang="scss" scoped>
	page {
		background: transparent;
	}

	.mask {
		position: fixed;
		left: 0;
		top: 0;
		right: 0;
		bottom: 0;
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		justify-content: center;
		align-items: center;
		background-color: rgba(0, 0, 0, 0.4);
	}

	.content {
        background-color: white;
        border-radius: 20rpx;
	}

	.text {
		/* #ifndef APP-NVUE */
		display: block;
		/* #endif */
		line-height: 200px;
		text-align: center;
		color: #FFFFFF;
	}
</style>
