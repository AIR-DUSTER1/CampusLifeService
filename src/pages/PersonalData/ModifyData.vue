<template>
    <view class="ModifyData">
        <Navbar :bgColor="'#a6ffcb'" class="navbar">
            <template #left>
                <view>
                    <u-icon name="arrow-left" size="20" color="#303133" @click="back"></u-icon>
                </view>
            </template>
            <template #center>
                <view>
                    <text>修改个人资料</text>
                </view>
            </template>
        </Navbar>
        <view class="form">
            <u-form labelPosition="left" :model="form" ref="userForm">
                <u-form-item label="姓名：" prop="username" labelWidth="80">
                    <u-input disabled v-model="form.username" color="#AFAFAF" disabledColor="#ffffff"
                        placeholder="请输入姓名" border="bottom" clearable></u-input>
                </u-form-item>
                <u-form-item label="性别：" prop="sex" @click="showSex = true; disabled = true" labelWidth="80">
                    <u-input v-model="form.sex" :disabled="disabled" placeholder="请选择性别" border="bottom"
                        clearable></u-input>
                </u-form-item>
                <u-form-item label="手机号：" prop="phone" labelWidth="80">
                    <u-input disabled v-model="form.phone" placeholder="请输入手机号" border="bottom" color="#AFAFAF"
                        disabledColor="#ffffff" clearable></u-input>
                </u-form-item>
                <u-form-item label="邮箱：" prop="email" labelWidth="80">
                    <u-input disabled v-model="form.email" placeholder="请输入邮箱" border="bottom" color="#AFAFAF"
                        disabledColor="#ffffff" clearable></u-input>
                </u-form-item>
                <u-button type="primary" shape="circle" formType @click="check" throttleTime="80"
                    class="btn">修改</u-button>
            </u-form>
            <u-action-sheet :show="showSex" :actions="list" title="请选择性别" @close="showSex = false; disabled = false"
                @select="sexSelect">
            </u-action-sheet>
        </view>
        <u-toast ref="toast"></u-toast>
    </view>
</template>

<script setup lang='ts'>
import { onMounted, ref, toRaw, reactive, shallowRef, computed, onUnmounted } from 'vue'
import Navbar from "@/components/layout/navbar/navbar.vue"
import useUserStore from '@/store/user'
import request from '@/utils/request'
import showtoast from "@/utils/showtoast"
const store = useUserStore()
const userInfo = computed(() => store.userinfo)
let uid = uni.getStorageSync('uid')
let toast = ref()
let disabled = ref(false)
let showSex = ref(false)
let userForm = ref()
let form = reactive({
    username: userInfo.value.username,
    email: userInfo.value.email,
    phone: userInfo.value.phone,
    sex: userInfo.value.sex,
})
const rules = reactive({
    sex: [
        { required: true, message: '性别不能为空', trigger: 'blur' }
    ],
    phone: [
        { required: true, message: '手机号不能为空', trigger: 'blur' },
        { pattern: /^1[3456789]\d{9}$/, message: '手机号格式不正确', trigger: 'blur' }
    ],
    email: [
        { required: true, message: '邮箱不能为空', trigger: 'blur' },
        { pattern: /^[a-zA-Z0-9_-]+@[a-z]/, message: '邮箱格式不正确', trigger: 'blur' }
    ]
})
const list = ref([
    {
        name: '男',
        fontSize: '20'
    },
    {
        name: '女',
        fontSize: '20'
    }
]);
onMounted(() => {
    showtoast.onbind(toast.value)
    userForm.value.setRules(rules)
})
function check() {
    userForm.value.validate().then((valid) => {
        if (valid) {
            submit()
        } else {
            showtoast.onError('请检查输入是否正确')
        }
    }).catch((err: any) => {
        showtoast.onError(err[0].message)
    })
}
function submit() {
    request({
        url: `/user/${uid}`,
        method: 'put',
        data: {
            ...toRaw(form)
        }
    }).then((res) => {
        if (res.success) {
            showtoast.onSuccess('修改成功')
        } else if (res.message != null) {
            showtoast.onError(res.message)
        } else {

        }
    }).catch((err) => {
        showtoast.onError(err)
    })
}
function sexSelect(item) {
    console.log(item);
    form.sex = item.name

}
function back() {
    uni.navigateBack(
        {
            delta: 1
        }
    )
}
</script>

<style lang='scss' scoped>
.ModifyData {
    .navbar {}

    .form {
        padding: 30rpx 30rpx;

        .btn {
            width: 70vw;
            margin-top: 90rpx;
        }
    }
}
</style>
