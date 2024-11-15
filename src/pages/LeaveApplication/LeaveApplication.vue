<template>
    <view class="LeaveApplication">
        <Navbar :bgColor="'#a6ffcb'">
            <template #left>
                <view>
                    <u-icon name="arrow-left" size="20" color="#303133" @click="back"></u-icon>
                </view>
            </template>
            <template #center>
                <view>
                    <text>请假申请</text>
                </view>
            </template>
        </Navbar>
        <!-- #ifdef APP-->
        <u-gap height="20"></u-gap>
        <!-- #endif -->
        <!-- #ifdef MP-WEIXIN -->
        <u-gap height="70"></u-gap>
        <!-- #endif -->
        <view class="u-tabs-box">
            <u-tabs :list="list" @change="change" class="tabs"></u-tabs>
        </view>
        <view v-if="current == '请假申请'" class="form">
            <u-form ref="formRef" :model="form" :rule="rule">
                <u-form-item label="姓名" prop="username" labelWidth="80" required>
                    <u-input v-model="form.username" type="text" placeholder="请输入姓名" border="bottom" clearable></u-input>
                </u-form-item>
                <u-form-item label="请假类型" prop="type" labelWidth="80" required
                    @click="typeDisabled = true; showType = true">
                    <u-input v-model="form.type" :disabled="typeDisabled" placeholder="请选择请假类型" border="bottom"
                        @change="changeHandler" clearable></u-input>
                </u-form-item>
                <u-picker ref="uPickerRef" title="请假类型" :show="showType" :columns="typelist" :closeOnClickOverlay="true"
                    @change="changeHandler" @close="typeClose" @confirm="confirm"
                    @cancel="showType = false, typeDisabled = false"></u-picker>
                <u-form-item label="请假离校" prop="leavingSchool" labelWidth="80" required>
                    <u-radio-group placement="column" v-model="form.leavingSchool" @change="leavinggroupChange"
                        class="radio-group">
                        <u-radio :customStyle="{ marginBottom: '8px' }" v-for="(item, index) in radiolist1" :key="index"
                            :label="item.label" :name="item.name">
                        </u-radio>
                    </u-radio-group>
                </u-form-item>
                <u-form-item label="请假回宿" prop="returnDormitory" labelWidth="80" required>
                    <u-radio-group placement="column" v-model="form.returnDormitory" @change="returnDormChange"
                        class="radio-group">
                        <u-radio :customStyle="{ marginBottom: '8px' }" v-for="(item, index) in radiolist1" :key="index"
                            :label="item.label" :name="item.name">
                        </u-radio>
                    </u-radio-group>
                </u-form-item>
                <u-form-item label="请假不归寝" prop="notGoingToBed" labelWidth="80" required>
                    <u-radio-group placement="column" v-model="form.notGoingToBed" @change="noReturnToBedChange"
                        class="radio-group">
                        <u-radio :customStyle="{ marginBottom: '8px' }" v-for="(item, index) in radiolist1" :key="index"
                            :label="item.label" :name="item.name">
                        </u-radio>
                    </u-radio-group>
                </u-form-item>
                <u-form-item label="开始日期" prop="startvalue" labelWidth="80" required @click="openstart()">
                    <u-input v-model="form.startDate" :disabled="startshow" disabledColor="#ffffff" type="text"
                        placeholder="请选开始日期" border="bottom">
                        <template #suffix>
                            <u-icon name="clock"></u-icon>
                        </template>
                    </u-input>
                    <u-datetime-picker ref="datetimePickerRef" :show="startshow" v-model="startvalue" mode="datetime"
                        :minDate="Date.now()" :formatter="formatter" @confirm="startTime" 
                        @cancel="startshow = !startshow"></u-datetime-picker>
                </u-form-item>
                <u-form-item label="结束日期" prop="endvalue" labelWidth="80" required @click="openend()">
                    <u-input v-model="form.endDate" :disabled="enddisabled" disabledColor="#ffffff" type="text"
                        placeholder="请选结束日期" border="bottom">
                        <template #suffix>
                            <u-icon name="clock"></u-icon>
                        </template>
                    </u-input>
                    <u-datetime-picker ref="datetimePickerRef1" :show="endshow" v-model="endvalue" mode="datetime"
                        :minDate="startvalue + 100000" :formatter="formatter" @confirm="endTime"
                        @cancel="endshow = !endshow"></u-datetime-picker>
                </u-form-item>
                <u-form-item label="请假事由" prop="reason" labelWidth="80">
                    <up-textarea v-model="form.reason" placeholder="请输入内容"></up-textarea>
                </u-form-item>
                <u-form-item label="附件" prop="file" labelWidth="80">
                    <up-upload :fileList="file" @afterRead="afterRead" @delete="deletePic" :sizeType="['original']"
                        maxSize="5242880" :maxCount="1"></up-upload>
                </u-form-item>
            </u-form>
            <u-button type="primary" class="btn" shape="circle" @click="submit">提交</u-button>
        </view>
        <view v-else-if="current == '我的申请'">
            <u-swipe-action v-if="ApplyList.length > 0">
                <template v-for="(item, index) in ApplyList" :key="index">
                    <u-swipe-action-item class="ApplyList-item" :options="options" :disabled="item.status !='待审批'" @click="deleteMessage" :index="index" :name="item.lid">
                        <u-cell isLink>
                            <template #title>
                                <view class="ApplyList-title">
                                    <view class="ApplyList-title-name">
                                        {{ item.username }}
                                    </view>
                                    <view class="ApplyList-title-type">
                                        {{ item.type }}
                                    </view>
                                </view>
                            </template>
                            <template #label>
                                <view class="ApplyList-label-info">
                                    <view class="ApplyList-label-info-number">
                                        {{ item.number }}
                                    </view>
                                    <view class="ApplyList-label-info-class">
                                        {{ item.class }}
                                    </view>
                                </view>
                                <view class="ApplyList-label-TypeMeassge">
                                    <view class="ApplyList-label-TypeMeassge-item">
                                        {{ item.leavingSchool ? '请假离校' : '' }}
                                    </view>
                                    <view class="ApplyList-label-TypeMeassge-item">
                                        {{ item.returnDormitory ? '请假回宿' : '' }}
                                    </view>
                                    <view class="ApplyList-label-TypeMeassge-item">
                                        {{ item.notGoingToBed ? '请假不归寝' : '' }}
                                    </view>
                                </view>
                                <view class="ApplyList-label-time">
                                    <view class="ApplyList-label-time-item">
                                        开始日期：{{ item.start }}
                                    </view>
                                    <view class="ApplyList-label-time-item">
                                        结束日期：{{ item.end }}
                                    </view>
                                </view>
                            </template>
                            <template #value>
                                <view>
                                    <up-tag v-if="item.status === '已生效'" text="已生效" type="success"></up-tag>
                                    <up-tag v-else-if="item.status === '已撤销'" text="已撤销" type="error"></up-tag>
                                    <up-tag v-else-if="item.status === '待审批'" text="待审批"></up-tag>
                                    <up-tag v-else text="拒绝" type="error"></up-tag>
                                </view>
                            </template>
                        </u-cell>
                    </u-swipe-action-item>
                </template>
            </u-swipe-action>
            <u-empty style="height: 85vh;" text="暂无报修记录" mode="list" v-else></u-empty>
        </view>
    </view>
    <u-toast ref="toast"></u-toast>
</template>

<script setup lang='ts'>
import { ref, reactive, watch, onMounted, computed } from 'vue'
import Navbar from "@/components/layout/navbar/navbar.vue"
import useUserStore from '@/store/user'
import showtoast from "@/utils/showtoast"
import { settings } from '@/settings/settings'
import request from '@/utils/request'
const toast = ref<any>()
const store = useUserStore()
const useinfo = computed(() => store.userinfo)
const startshow = ref(false)
const endshow = ref(false)
const enddisabled = ref(false)
const file = ref<any>([])
const typeDisabled = ref(false)
const showType = ref(false)
const uPickerRef = ref()
const formRef = ref()
let startvalue = ref(Date.now())
let endvalue = ref(Date.now())
let currentPage = ref(1)
const datetimePickerRef = ref()
const datetimePickerRef1 = ref()
const radiolist1 = ref([
    { name: true, label: '是' },
    { name: false, label: '否' }
])
let current = ref('请假申请')
let form = ref({
    username: useinfo.value.username ? useinfo.value.username : '',
    type: '',
    leavingSchool: false,
    returnDormitory: false,
    notGoingToBed: false,
    startDate: '',
    endDate: '',
    reason: '',
    file: ''
})
const rule = {
    username: [
        {
            required: true,
            message: '请输入标题',
            trigger: 'blur'
        },
        {
            min: 2,
            max: 20,
            message: '长度在 2 到 20 个字符',
            trigger: 'blur'
        }
    ],
    type: [
        {
            required: true,
            message: '请选择请假类型',
            trigger: 'blur'
        },
    ],
    startDate: [
        {
            required: true,
            message: '请选择开始日期',
            trigger: 'blur'
        },
    ],
    endDate: [
        {
            required: true,
            message: '请选择结束日期',
            trigger: 'blur'
        },
    ],
}
const options = reactive([{
    text: '撤销',
    style: {
        backgroundColor: '#E53D30'
    }
}])
let ApplyList = ref<any>([
{
    title: useinfo.value.username ? useinfo.value.username : '',
    type: '123',
    number:useinfo.value.phone?useinfo.value.phone:'',
    leavingSchool: false,
    returnDormitory: false,
    notGoingToBed: false,
    start: '2021-05-01',
    end: '2021-05-01',
    status:'审批中'
}
])
const list = reactive([
    { name: '请假申请' },
    { name: '我的申请' }
])
const typelist = ref([
    ['事假', '病假'],
    ['当天事假', '事假', '跑操假', '课假', '晚自习假', '专项事假']
])
const columnData = reactive([
    ['当天事假', '事假', '跑操假', '课假', '晚自习假', '专项事假'],
    ['当天病假', '病假']
]);
onMounted(() => {
    showtoast.onbind(toast.value)
    getApply()
    // #ifdef MP-WEIXIN
    formRef.value.setRules(rule)
    datetimePickerRef.value.setFormatter(formatter)
    datetimePickerRef1.value.setFormatter(formatter)
    // #endif
})
const formatter = (type, value) => {
    if (type === 'year') {
        return `${value}年`;
    }
    if (type === 'month') {
        return `${value}月`;
    }
    if (type === 'day') {
        return `${value}日`;
    }
    return value;
}
function startTime(item) {
    console.log(startvalue.value);
    startshow.value = false
    let time = formatTimestamp(startvalue.value)
    form.value.startDate = time
}
function endTime() {
    console.log(endvalue.value)
    endshow.value = false
    let time = formatTimestamp(endvalue.value)
    form.value.endDate = time
}
function confirm(item) {
    console.log(item)
    const { value } = item
    form.value.type = value[1]
    showType.value = false
    typeDisabled.value = false
}
function typeClose() {
    showType.value = false
    typeDisabled.value = false
}
function noReturnToBedChange(item) {
    console.log(item)
}

function returnDormChange(item) {
    console.log(item)

}
function openstart(){
    startshow.value = !startshow.value
}
function openend() {
    enddisabled.value = true
    if (form.value.startDate == '') {
        showtoast.onError('请先选择开始日期')
        setTimeout(() => {
            enddisabled.value = false
        }, 500)
    } else {
        endshow.value = true
        setTimeout(() => {
            enddisabled.value = false
        }, 500)
    }
}
const deletePic = (event) => {
    file.value.splice(event.index, 1)
};
function afterRead(event) {
    console.log(event.file.file)
    file.value.push(event.file)
    uni.uploadFile({
        url: settings.apiAddress + '/file/upload',
        fileType: 'image',
        file: event.file.file,
        name: '',
        header: {
            Authorization: uni.getStorageSync('token') ? 'Bearer ' + uni.getStorageSync('token') : '',
        },
        timeout: 5000,
        success(res) {
            let result = JSON.parse(res.data)
            let data = result.data
            if (result.success) {
                form.value.file = data.url
                showtoast.onSuccess('上传成功')
            } else {
                showtoast.onError(result.message)
            }
            console.log(result)
        },
        fail(result) {
            showtoast.onError(result)
            console.log(result);
        },
    })
}
const changeHandler = (e) => {
    console.log(e);

    const {
        columnIndex,
        value,
        values,
        index,
    } = e

    if (columnIndex === 0) {
        uPickerRef.value.setColumnValues(1, columnData[index]);
    }
}

function formatTimestamp(timestamp: number): string {
    const date = new Date(timestamp)
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    return `${year}-${month}-${day} ${hours}:${minutes}`
}
function leavinggroupChange(item) {
    console.log(item)
    if (item == '是') {
        form.value.leavingSchool = true
    } else if (item == '否') {
        form.value.leavingSchool = false
    }
}
function submit() {
    if (form.value.username == '') {
        showtoast.onError('请输入姓名')
    } else if (form.value.type == '') {
        showtoast.onError('请输入请假类型')
    }else if (form.value.startDate == '') {
        showtoast.onError('请输入开始时间')
    }else if (form.value.endDate == '') {
        showtoast.onError('请输入结束时间')
    }else{
        request({
        url:'/life/leave',
        method:'post',
        data:{
            username:form.value.username,
            type:form.value.type,
            start:form.value.startDate,
            end:form.value.endDate,
            leavingSchool:form.value.leavingSchool,
            returnDormitory:form.value.returnDormitory,
            notGoingToBed:form.value.notGoingToBed,
            reason:form.value.reason,
            file:form.value.file
        }
    }).then(res=>{
        if(res.success){
            showtoast.onSuccess('提交成功')
            setTimeout(() => {
                back()
            }, 1000)
        }else{
            showtoast.onError(res.message)
        }
    }).catch((err) => {
        showtoast.onError(err)
    })
    }
}
function deleteMessage(index) {
    console.log(index.name)
    request({
        url:`/life/leave/${index.name}/revoke`,
        method:'post',
        data:{
            username:useinfo.value.username
        }
    }).then((res) => {
        if (res.success) {
            getApply()
            current.value = ''
            setTimeout(() => {
                current.value ='我的申请'
            }, 300)
        }else{
            showtoast.onError(res.message)
        }
    }).catch((err) => {
        showtoast.onError(err)
    })
}
function getApply() {
    request({
        url:'/life/leave/page',
        data:{
            username:useinfo.value.username ? useinfo.value.username : '',
            pageSize:10,
            page:currentPage.value
        }
    }).then((res:any) => {
        if (res.success) {
            ApplyList.value = res.data.records
        } else {
            showtoast.onError(res.message)
        }
    }).catch((err) => {
        showtoast.onError(err)
    })
}
function change(item) {
    console.log(item);
    current.value = item.name
    if (item.name == '我的申请') {
        getApply()
    }
}
function back() {
    uni.navigateBack({
        delta: 1
    })
}
</script>

<style lang='scss' scoped>
body{
    background-color: $page-bg;
}
.u-tabs-box {
    display: flex;
    justify-content: center;
    background-color: $moduleBackgroundColor;
    .tabs {
        width: 328rpx;
    }
}

.form {
    padding: 0 50rpx;
    background-color: $moduleBackgroundColor;
    .radio-group {
        flex-direction: row;
        justify-content: space-around;
        :deep(.u-radio-group){
            flex-direction: row !important;
            justify-content: space-around;
        }
    }
}
.ApplyList-item{
    border: 1px solid white;
    border-radius: 10rpx;
    margin: 20rpx;
    .ApplyList-title{
    display: flex;
    flex-direction: row;
    align-items: center;
    .ApplyList-title-name{
        border-right: 1px solid #ccc;
        margin: 20rpx;
        padding-right: 20rpx;
    }
    .ApplyList-title-type{
    }
}
.ApplyList-label-info{
    display: flex;
    flex-direction: row;
    align-items: center;
    .ApplyList-label-info-number{
        border-right: 1px solid #ccc;
        margin: 20rpx;
        padding-right: 20rpx;
    }
    .ApplyList-label-info-class{
    }
}
.ApplyList-label-TypeMeassge{
    display: flex;
    flex-direction: row;
    align-items: center;
    .ApplyList-label-TypeMeassge-item{
        border-right: 1px solid #ccc;
        margin: 10rpx;
        padding-right: 10rpx;
    }
    .ApplyList-label-TypeMeassge-item:last-child{
        border-right: none;
    }
}
.ApplyList-label-time{
    .ApplyList-label-time-item{
        margin: 10rpx;
    }
}
}

</style>
