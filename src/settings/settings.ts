// 导入导航图片和卡片背景图片
import Navimg from '@/static/images/th.png'
import cardBg from '@/static/images/card3.png'

// 定义基础地址，用于构建API和WebSocket地址
const baseAddress = '110.40.67.194:37932'

// 导出设置对象，包含API地址、WebSocket地址、导航图片和卡片背景图片
export const settings = {
    // apiAddress: 'http://110.40.67.194:37932',
    // 使用HTTPS协议构建API地址
    apiAddress: 'http://'+baseAddress,
    // 使用WSS协议构建WebSocket地址
    wsAddress: 'ws://'+baseAddress,
    // 导航图片
    homeNavimg: Navimg,
    // 卡片背景图片
    cardBg: cardBg
}