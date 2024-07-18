function judgeLoginStatus(status: number | string): string {
    if (status == -7) {
        // 检查是否配置/已通过审核
        return 'uniAppid 缺失'
    }
    else if (status == 1000) {
        // 检查是否配置/已通过审核
        return '当前 uniAppid 尚未开通一键登录';
    }
    else if (status == 1001) {
        // 检查账号一键登录服务是否正常
        return '应用所有者账号信息异常，请检查账号一键登录服务是否正常';
    }
    else if (status == 1002) {
        // 检查账号余额是否充足
        return '应用所有者账号信息异常，请检查账号余额是否充足';
    }
    else if (status == 4001) {
        // 校验异常，联系官方人员
        return '请求参数异常';
    }
    else if (status == 4003) {
        // 校验异常，联系官方人员
        return '开发者账户appid 校验异常，联系官方人员';
    }
    else if (status == 5000) {
        // 联系官方人员
        return '取号失败，请检查SIM卡是否停机欠费;token是否过期';
    }
    else if (status == 20202) {
        // 引导用户手动开启设备流量
        return '终端未开启SIM流量';
    }
    else if (status == 30001) {
        // 无
        return '当前网络环境不适合执行该操作';
    }
    else if (status == 30002) {
        // 无
        return '用户点击了其他登录方式';
    }
    else if (status == 30003) {
        // 无
        return '用户关闭验证界面';
    }
    else if (status == 30004) {
        // 联系官方人员
        return '其他错误';
    }
    else if (status == 30005) {
        // 不具备一键登录的使用前提，设备不支持/未开启数据流量/其他原因
        return '预登录失败';
    }
    else if (status == 30006) {
        // 无
        return '一键登录失败';
    }
    else if (status == 30007) {
        // 校验异常，联系官方人员
        return '获取本机号码校验token失败';
    }
    else if (status == 30008) {
        // 无
        return '用户点击了自定义按钮';
    }
    else if (status == 40004) {
        // 多出现在自定义基座的场景，请确保应用已通过审核后，且已重新打包
        return '应用不存在';
    }
    else if (status == 40047) {
        // 校验异常，联系官方人员
        return '一键登录取号失败';
    }
    else if (status == 40053) {
        // 校验异常，联系官方人员
        return '手机号校验失败';
    }
    else if (status == 40101) {
        // 检查一下手机卡类型是否是正常运营商手机卡，关闭飞行模式后重新尝试。
        return '移动-源IP鉴权失败';
    }
    else if (status == 40201) {
        // 检查一下手机卡类型是否是正常运营商手机卡，关闭飞行模式后重新尝试。
        return '联通-源IP鉴权失败';
    }
    else if (status == 40301) {
        // 检查一下手机卡类型是否是正常运营商手机卡，关闭飞行模式后重新尝试。
        return '电信-源IP鉴权失败';
    } else {
        return '登录失败';
    }
}
export default judgeLoginStatus
// https://uniapp.dcloud.net.cn/univerify.html#%E9%94%99%E8%AF%AF%E7%A0%81 一键登录错误码文档