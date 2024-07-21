/**
 * @description 显示toast
 * @param {any} dom toast组件<u-toast ref="uToastRef"></u-toast>
 * @param {String} type toast类型
 * @param {any} message toast内容
 * @param {String} icon toast图标
 * @param {String} position toast位置
 */
function showToast(dom: any, type: string, message: any, icon?: string, position?: string) {
    dom.show({
        type: type,//loading、success、error
        message: message,
        icon: icon || "",//info-circle、checkmark-circle、close-circle
        position: position || 'top',
        complete() {
            message.url && uni.navigateTo({
                url: message.url
            });
        }
    });
}
export default showToast;