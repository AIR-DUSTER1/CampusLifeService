export default function interceptor(res: any) {
    if (res.statusCode == 401) {
        uni.removeStorageSync('token')
        uni.showToast({
            title: '登录状态已过期，请重新登录',
            icon: 'none',
            complete() {
                uni.reLaunch({
                    url: '/pages/login/login'
                })
            },
        })
    }
}