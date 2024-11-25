import { ref } from 'vue'
import { settings } from '@/settings/settings'
const websoket = ref()
const webSoketInit = (address: string) => {
    //路径
    const wsUrl = settings.wsAddress+ address

    websoket.value = uni.connectSocket({
        url: wsUrl,
        success: () => {
            console.log('websoket连接成功',websoket.value);
        },
        fail: () => {
            console.log('websoket连接失败',wsUrl,websoket.value);
            uni.showToast({
                title: 'websoket连接失败',
                icon: 'error',
                duration: 2000,
            });
        },
    });

    websoket.value.onOpen((res: any) => {
        console.log('WebSocket连接正常打开中...！', res);
    });

    websoket.value.onClose(() => {
        console.log('已经被关闭了');
    });
};

// 关闭websocket【离开这个页面的时候执行关闭】
const closeSocket = () => {
    websoket.value.close({
        success(res: any) {
            this.is_open_socket = false;
            console.log('关闭成功', res);
        },
        fail(err: any) {
            console.log('关闭失败', err);
        },
    });
};
// const onMessage = (callback: any) => {
//     websoket.value.onMessage(callback);
//     return callback;
// };
const sendMessage = (data: string) => {
    websoket.value.send({
        data,
        async success() {
            console.log('消息发送成功');
        },
    });
};
export {
    websoket, webSoketInit, closeSocket, sendMessage
};