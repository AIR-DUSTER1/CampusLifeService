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
                    <text>报修</text>
                </view>
            </template>
        </Navbar>
        <!-- #ifdef APP -->
        <u-gap height="20"></u-gap>
        <!-- #endif -->
        <view class="u-tabs-box">
            <u-tabs :list="list" @change="change" class="tabs"></u-tabs>
        </view>
        <view v-if="currentTabs == '报修申请'" class="form">
            <u-form :model="form" :rules="rules" ref="reportForm">
                <u-form-item label="报修人" prop="repairer" labelWidth="80" required>
                    <u-input v-model="form.repairer" placeholder="请输入报修人" border="bottom"></u-input>
                </u-form-item>
                <u-form-item label="电话" prop="phone" labelWidth="80" required>
                    <u-input v-model="form.phone" placeholder="请输入手机号" border="bottom"></u-input>
                </u-form-item>
                <u-form-item label="维修区域" prop="repairArea" labelWidth="80" @click="showPickerRepairArea" required>
                    <u-input v-model="form.repairArea" :disabled="repairArea" placeholder="请选择维修区域" border="bottom"></u-input>
                </u-form-item>
                <u-picker :show="areaShow" ref="areaPicker" title="选择区域" :columns="areaColumns" closeOnClickOverlay @close="closeRepairArea" @cancel="closeRepairArea" @confirm="confirmArea" @change="changeHandlerArea"></u-picker>
                <u-form-item label="房间号" prop="addressDetails" labelWidth="80" required>
                    <u-input v-model="form.addressDetails" placeholder="请输入房间号" border="bottom"></u-input>
                </u-form-item>
                <u-form-item label="维修类型" prop="typeRepair" labelWidth="80" @click="showPickerType" required>
                    <u-input v-model="form.typeRepair" :disabled="typeRepair" placeholder="请选择维修类型" border="bottom"></u-input>
                </u-form-item>
                <u-picker :show="typeShow" ref="typePicker" title="维修类型" :columns="typeColumns" closeOnClickOverlay @close="closeType" @cancel="closeType" @confirm="confirmType" @change="changeHandlerType"></u-picker>
                <u-form-item label="故障描述" prop="description" labelWidth="80">
                    <up-textarea v-model="form.description" placeholder="请输入内容" count maxlength="60" border="bottom"></up-textarea>
                </u-form-item>
                <u-form-item label="附件" prop="file" labelWidth="80">
                    <up-upload :fileList="file" @afterRead="afterRead" @delete="deletePic" :sizeType="['original']"
                    maxSize="5242880" :maxCount="1"></up-upload>
                </u-form-item>
                <u-button type="primary" class="btn" shape="circle" @click="submit">提交</u-button>
            </u-form>
        </view>
        <view v-else-if="currentTabs == '我的申请'">
            <view>
                
            </view>
            <u-empty text="暂无报修记录" mode="list"></u-empty>
        </view>
    </view>
    <u-toast ref="toast"></u-toast>
</template>

<script setup lang='ts'>
import { ref, reactive, watch, onMounted ,computed} from 'vue'
import Navbar from "@/components/layout/navbar/navbar.vue"
import showtoast from "@/utils/showtoast"
import { settings } from '@/settings/settings'
import useUserStore from '@/store/user'
const store = useUserStore()
const userinfo = computed(() => store.userinfo)
import request from '@/utils/request'
const toast = ref<any>()
const reportForm = ref()
const typeShow= ref(false)
const areaShow =ref(false)
const areaPicker= ref()
const typePicker =ref()
const list = reactive([
    { name: '报修申请' },
    { name: '我的申请' }
])
const areaColumns = reactive([
  ['小珠山', '大珠山'],
  ['4号楼', '15号楼', '16号楼', '17号楼','18号楼','19号楼','20号楼','21号楼','22号楼','23号楼','28号楼','41号楼','42号楼','43号楼','45号楼','55号楼','57号楼','59号楼','60号楼','61号楼','62号楼','67号楼','68号楼','69号楼']
])
const typeColumns = reactive([
    ['宿舍设施','宿舍供暖/冷气','电线设备设施','水路设备设施','窗户','校园网','建筑物维修','其他'],
    ['桌椅维修','门锁','床']
])
const typeColumnData = reactive([
  ['桌椅维修','门锁','床'],
  ['暖气维修','空调维修'],
  ['插座维修','灯具维修','电路故障'],
  ['水池维修','水龙头维修','花洒维修','便池维修','饮水机维修','洗衣机维修'],
  ['窗户','玻璃','纱窗'],
  ['主页信息错误','无法上网','无法登陆','网络质量差'],
  ['楼体墙面维修','楼梯维修'],
  ['其他']
])
const areaColumnData = reactive([
  ['4号楼', '15号楼', '16号楼', '17号楼','18号楼','19号楼','20号楼','21号楼','22号楼','23号楼','28号楼','41号楼','42号楼','43号楼','45号楼','55号楼','57号楼','59号楼','60号楼','61号楼','62号楼','67号楼','68号楼','69号楼'],
  ['1号楼', '2号楼', '3号楼', '4号楼','5号楼','6号楼','7号楼']
])
const file = ref()
const form = ref({
    repairer: userinfo.value.username ? userinfo.value.username : '',
    phone: userinfo.value.phone ? userinfo.value.phone : '',
    repairArea:'',
    addressDetails:'',
    typeRepair:'',
    description:'',
    file:''
})
const rules = {
    repairer:[
    {
        required: true,
        message: '请输入姓名',
        trigger: 'blur'
    }
],
phone: [
    {
        required: true,
        message: '请输入手机号',
        trigger: 'blur'
    },
    {
        pattern: /^1[3-9]\d{9}$/,
        message: '手机号格式不正确',
        trigger: 'change'
    }
],
repairArea:[
    {
        required: true,
        message: '请选择维修区域',
        trigger:  ['change']
    }
],
addressDetails:[
    {
        required: true,
        message: '请输入房间号',
        trigger: 'blur'
    }
],
typeRepair:[
    {
        required: true,
        message: '请选择维修类型',
        trigger:  ['change']
    }
]
}
let currentTabs = ref('报修申请')
let repairArea =ref(false)
let typeRepair =ref(false)
onMounted(() => {
    showtoast.onbind(toast.value)
    // #ifdef MP-WEIXIN
    reportForm.value.setRules(rules)
    // #endif
})
function afterRead(event){
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
function change(item) {
    console.log(item);
    currentTabs.value = item.name
}
function deletePic(){

}
function submit(){

}
function confirmArea(list){
    const { value } = list
    areaShow.value = false
    repairArea.value = !repairArea.value
    form.value.repairArea = value[0]+'-'+value[1]
}
function showPickerRepairArea(){
    areaShow.value = !areaShow.value
    repairArea.value = !repairArea.value
}

function changeHandlerArea(e){
    console.log(e);
    const {
        columnIndex,
        value,
        values,
        index
    } = e
    if (columnIndex === 0) {
        areaPicker.value.setColumnValues(1, areaColumnData[index]);
    }
}
function closeRepairArea(){
    areaShow.value = !areaShow.value
    repairArea.value = !repairArea.value
}
function closeType(){
    typeShow.value = !typeShow.value
    typeRepair.value = !typeRepair.value
}
function showPickerType(){
    typeShow.value = !typeShow.value
    typeRepair.value = !typeRepair.value
}
function confirmType(list){
    const { value } = list
    typeShow.value = !typeShow.value
    typeRepair.value =!typeRepair.value
    form.value.typeRepair = value[0]+'-'+value[1]
}
function changeHandlerType(e){
    const {
        columnIndex,
        value,
        values,
        index
    } = e
    if (columnIndex === 0) {
        typePicker.value.setColumnValues(1, typeColumnData[index]);
    }
}

function back() {
    uni.navigateBack({
        delta: 1
    })
}
</script>

<style lang='scss' scoped>
.u-tabs-box {
    display: flex;
    justify-content: center;
    background-color: $moduleBackgroundColor;
    .tabs {
        width: 328rpx;
    }
}
.form{
    padding: 30rpx 40rpx;
}
</style>
