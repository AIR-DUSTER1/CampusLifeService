import interceptor from './interceptor'
import { settings } from '@/settings/settings'
export const baseURL = settings.apiAddress
// export const baseURL = 'https://37b51487.r10.cpolar.top'

export interface ApiResult<T> {
    code: number; // API状态码
    message: string; // API消息提示
    data: T; // API实际返回的数据
    headers?: any;
    success: boolean;
}
const request = <T>(options) => {
    // 判断是不是完整的地址，不是的话，拼接上baseUrl
    let urlPath = ''
    if (options.url.indexOf('http') === -1 && options.url.indexOf('https') === -1 ) {
        urlPath = baseURL + options.url
    } else {
        urlPath = options.url
    }
    console.log('请求的url是:', urlPath)
    return new Promise<ApiResult<T>>((resolve, reject) => {
        uni.request({
            url: baseURL + options.url, //接口地址：前缀+方法中传入的地址
            method: options.method || 'GET', //请求方法：传入的方法或者默认是“GET”
            data: options.data || {}, //传递参数：传入的参数或者默认传递空集合
            header: {
                Authorization: uni.getStorageSync('token') ? 'Bearer ' + uni.getStorageSync('token') : '', //自定义请求头信息
            },
            success: (res: any) => {
                // 成功返回
                interceptor(res)
                console.log('返回数据:', res)
                resolve(res.data)
            },
            // 这里的接口请求，如果出现问题就输出接口请求失败
            fail: (err) => {
                console.log('请求错误:', err)
                reject(err)
            },
        })
    })
}

export default request
