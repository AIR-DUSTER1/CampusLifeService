<template>
    <view>
        <!-- <u-button type="suecss" @click="tologin()" style="margin: auto auto;">登录</u-button> -->

        <u-toast ref="toast"></u-toast>
    </view>
</template>

<script setup lang='ts'>
import { ref, reactive, onUnmounted, onMounted, getCurrentInstance, onBeforeMount } from 'vue'
import { onLoad, onBackPress, onReady } from "@dcloudio/uni-app"
import judgeLoginStatus from '@/utils/LoginStatus'
import usePlatform from '@/store/platform'
import request from '@/utils/request'
import showtoast from "@/utils/showtoast"
const toast = ref()
let weiboOauth = ref()
var qqOauth = ref()
const app = usePlatform()
let token = ref()
let tokenExist = ref()
let platform = app.getPlatform
const instance = getCurrentInstance()
onBackPress(() => {
    modal()
})
onLoad(() => {
    token.value = uni.getStorageSync('token')
    console.log()
    if (token.value != '' || token.value != null || token.value != undefined) {
        tokenExist.value = true
        uni.closeAuthView()
        uni.switchTab({
            url: '/pages/tabbar/home/index'
        })
    } else {
        tokenExist.value = false
    }
})
onMounted(() => {
    showtoast.onbind(toast.value)
    if (!tokenExist.value && platform == 'plus' || platform == 'nvue') {
        tologin()
    } else if (platform == 'weixin' || platform == 'mp' || platform == 'h5') {
        uni.reLaunch({
            url: '/pages/login/LoginForm'
        })
    }
    uni.getProvider({
        service: 'oauth',
        success: function (res) {
            console.log(res.provider)// ['qq', 'univerify']
        }
    })
})
function tologin() {
    uni.login({
        provider: 'univerify',
        univerifyStyle: { // 自定义登录框样式
            //参考`univerifyStyle 数据结构`
            "fullScreen": true, // 是否全屏显示，默认值： false
            "backgroundColor": "#ffffff",  // 授权页面背景颜色，默认值：#ffffff
            "backgroundImage": "", // 全屏显示的背景图片，默认值："" （仅支持本地图片，只有全屏显示时支持）
            "icon": {
                "path": "static/logo.png", // 自定义显示在授权框中的logo，仅支持本地图片 默认显示App logo
                "width": "60px",  //图标宽度 默认值：60px
                "height": "60px"   //图标高度 默认值：60px
            },
            "closeIcon": {
                "path": "", // 自定义显示在授权框中的logo，仅支持本地图片 默认显示App logo
                "width": "0",  //图标宽度 默认值：60px (HBuilderX 4.0支持)
                "height": "0"   //图标高度 默认值：60px (HBuilderX 4.0支持)
            },
            "phoneNum": {
                "color": "#202020"  // 手机号文字颜色 默认值：#202020
            },
            "slogan": {
                "color": "#BBBBBB"  //  slogan 字体颜色 默认值：#BBBBBB
            },
            "authButton": {
                "normalColor": "#3479f5", // 授权按钮正常状态背景颜色 默认值：#3479f5
                "highlightColor": "#2861c5",  // 授权按钮按下状态背景颜色 默认值：#2861c5（仅ios支持）
                "disabledColor": "#73aaf5",  // 授权按钮不可点击时背景颜色 默认值：#73aaf5（仅ios支持）
                "textColor": "#ffffff",  // 授权按钮文字颜色 默认值：#ffffff
                "title": "本机号码一键登录", // 授权按钮文案 默认值：“本机号码一键登录”
                "borderRadius": "24px"	// 授权按钮圆角 默认值："24px" （按钮高度的一半）
            },
            "otherLoginButton": {
                "visible": true, // 是否显示其他登录按钮，默认值：true
                "normalColor": "#F3F4F6", // 其他登录按钮正常状态背景颜色 默认值：透明
                "highlightColor": "#D5D6D8", // 其他登录按钮按下状态背景颜色 默认值：透明
                "textColor": "#656565", // 其他登录按钮文字颜色 默认值：#656565
                "title": "使用其他手机号或邮箱登录", // 其他登录方式按钮文字 默认值：“其他登录方式”
                "borderColor": "",  //边框颜色 默认值：透明（仅iOS支持）
                "borderRadius": "24px" // 其他登录按钮圆角 默认值："24px" （按钮高度的一半）
            },
            "privacyTerms": {
                "defaultCheckBoxState": false, // 条款勾选框初始状态 默认值： true
                "isCenterHint": false, //未勾选服务条款时点击登录按钮的提示是否居中显示 默认值: false (3.7.13+ 版本支持)
                "uncheckedImage": "", // 可选 条款勾选框未选中状态图片（仅支持本地图片 建议尺寸 24x24px）(3.2.0+ 版本支持)
                "checkedImage": "", // 可选 条款勾选框选中状态图片（仅支持本地图片 建议尺寸24x24px）(3.2.0+ 版本支持)
                "checkBoxSize": 24, // 可选 条款勾选框大小
                "textColor": "#BBBBBB", // 文字颜色 默认值：#BBBBBB
                "termsColor": "#5496E3", //  协议文字颜色 默认值： #5496E3
                "prefix": "我已阅读并同意", // 条款前的文案 默认值：“我已阅读并同意”
                "suffix": "并使用本机号码登录", // 条款后的文案 默认值：“并使用本机号码登录”
                "privacyItems": [  // 自定义协议条款，最大支持2个，需要同时设置url和title. 否则不生效
                    {
                        "url": "https://", // 点击跳转的协议详情页面
                        "title": "用户服务协议" // 协议名称
                    }
                ]
            },
            "buttons": {  // 自定义页面下方按钮仅全屏模式生效（3.1.14+ 版本支持）
                "iconWidth": "40px", // 图标宽度（高度等比例缩放） 默认值：45px
                "list": [
                    {
                        "provider": "sinaweibo",
                        "iconPath": "/static/images/weibo.png" // 图标路径仅支持本地图片
                    },
                    {
                        "provider": "qq",
                        "iconPath": "/static/images/QQ.png" // 图标路径仅支持本地图片
                    }
                ]
            }
        },
        success(res: any) { // 登录成功
            // console.log(res.authResult)
            request({
                url: '/auth/app/login',
                method: 'POST',
                data: {
                    access_token: res.authResult.access_token, // 客户端一键登录接口返回的access_token
                    openid: res.authResult.openid, // 客户端一键登录接口返回的openid
                    type: "univerify"
                }
            }).then((res: any) => {
                console.log(res)
                if (res.success) {
                    uni.setStorageSync('token', res.data.access_token)
                    uni.switchTab({
                        url: '/pages/tabbar/home/index'
                    })
                    showtoast.onSuccess('登录成功')
                } else if (res.message == '用户未激活') {
                    uni.navigateTo({
                        url: '/pages/login/active'
                    })
                    showtoast.onError(res.message)
                } else if (res.message == '用户不存在') {
                    showtoast.onError(res.message)
                    tologin()
                } else {
                    showtoast.onError(res.message)
                }
                console.log(res)
            }).catch((err) => {
                showtoast.onError(err)
            })
            // showtoast.onSuccess(res)
            // console.log(res.authResult);  // {openid:'登录授权唯一标识',access_token:'接口返回的 token'}
            uni.closeAuthView()
        },
        fail(res) {  // 登录失败
            console.log(res);
            console.log(res.code)
            console.log(res.errMsg)
            let status = judgeLoginStatus(res.code)
            console.log(status);
            if (status == '用户点击了自定义按钮') {
                if (res.provider == 'qq') {
                    // showtoast.onInfo('qq')
                    loginqq()
                } else if (res.provider == 'sinaweibo') {
                    // showToast('微博')
                    loginsina()
                }
            } else if (status == '用户点击了其他登录方式') {
                uni.navigateTo({
                    url: '/pages/login/LoginForm'
                })
            } else if (status == '用户关闭验证界面') {
                modal()
                // plus.runtime.quit()
            } else if (status == '一键登录失败' && uni.getStorageSync('token')) {

            } else {
                showtoast.onError(status)
                modal()
                // uni.openAppAuthorizeSetting({
                //     success(res) {
                //         console.log(res)
                //     }
                // })
                // uni.closeAuthView()
            }
        }
    })
}
function loginqq() {
    plus.oauth.getServices(function (services) {
        for (var i in services) {
            var service = services[i]
            // 获取QQ登录对象
            if (service.id == 'qq') {
                qqOauth.value = service
                break
            }
        }
        qqOauth.value.login(function (oauth) {
            request({
                url: '/auth/app/login',
                method: 'POST',
                data: {
                    access_token: oauth.target.authResult.access_token, // 客户端一键登录接口返回的access_token
                    openid: oauth.target.authResult.openid, // 客户端一键登录接口返回的openid
                    type: "qq"
                }
            }).then((res: any) => {
                if (res.success) {
                    uni.setStorageSync('token', res.data.access_token)
                    uni.switchTab({
                        url: '/pages/tabbar/home/index'
                    })
                    showtoast.onSuccess('登录激活成功')
                } else if (res.message == '用户未激活') {
                    uni.navigateTo({
                        url: '/pages/login/active'
                    })
                    showtoast.onError(res.message)
                } else if (res.message == '用户不存在') {
                    showtoast.onError(res.message)
                    tologin()
                } else {
                    showtoast.onError(res.message)
                }
            })
            // 授权成功，qqOauth.authResult 中保存授权信息
        }, function (err) {
            console.log(err)
            // err.code是错误码
        })
    }, function (err) {
        // 获取 services 失败
    })
}
function loginsina() {
    plus.oauth.getServices(function (services) {
        console.log(services)
        for (let i in services) {
            let service = services[i]
            // 获取新浪微博登录对象
            if (service.id == 'sinaweibo') {
                weiboOauth.value = service
                break
            }
        }
        weiboOauth.value.login(function (oauth) {
            request({
                url: '/auth/app/login',
                method: 'POST',
                data: {
                    access_token: oauth.target.authResult.access_token, // 客户端一键登录接口返回的access_token
                    openid: oauth.target.authResult.openid, // 客户端一键登录接口返回的openid
                    type: "sina"
                }
            }).then((res: any) => {
                if (res.success) {
                    uni.setStorageSync('token', res.data.access_token)
                    uni.switchTab({
                        url: '/pages/tabbar/home/index'
                    })
                    showtoast.onSuccess('登录激活成功')
                } else if (res.message == '用户未激活') {
                    uni.navigateTo({
                        url: '/pages/login/active'
                    })
                    showtoast.onError(res.message)
                } else if (res.message == '用户不存在') {
                    instance?.proxy?.$forceUpdate()
                    showtoast.onError(res.message)
                    uni.showToast({
                        title: '用户不存在',
                        icon: 'none',
                        duration: 3000,
                        complete() {
                            uni.reLaunch({
                                url: '/pages/login/login'
                            })
                        },
                    })
                } else {
                    showtoast.onError(res.message)
                }
            }).catch((err) => {
                showtoast.onError(err)
            })
            // 授权成功，weiboOauth.authResult 中保存授权信息
        }, function (err) {
            console.log(err);
            // 登录授权失败
            // err.code是错误码
        })
    }, function (err) {
        console.log(err);
        // 获取 services 失败
    })
}
function modal() {
    uni.showModal({
        title: '是否退出该应用?',
        confirmText: '退出',
        success: function (res) {
            if (res.confirm) {
                //此处把你退出后需要的方法写上就行
                plus.runtime.quit()
            } else if (res.cancel) {
                //取消
                tologin()
            }
        }.bind(instance?.appContext)//此处bind是关键
    })
}
</script>

<style lang='scss' scoped></style>
