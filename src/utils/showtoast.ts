/**
 * @description 显示toast
 * @param {any} dom toast组件<u-toast ref="toast"></u-toast>
 * @param {String} type toast类型
 * @param {any} message toast内容
 * @param {String} icon toast图标
 * @param {String} position toast位置
 */
let ref: any = null
function showToast(dom: any, type: string, message: any, icon?: string, position?: string) {
    dom.show({
        type: type,//loading、success、error、warning、none
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
function onSuccess(message: any, position?: string) {
    showToast(ref, 'success', message, 'checkmark-circle', position)
}
function onError(message: any, position?: string) {
    showToast(ref, 'error', message, 'close-circle', position)
}
function onLoading(message: any, position?: string) {
    showToast(ref, 'loading', message, 'none', position)
}
function onInfo(message: any, position?: string) {
    showToast(ref, 'info', message, 'info-circle', position)
}
function onbind(dom: any) {
    ref = dom
}
export default { onSuccess, onError, onLoading, onInfo, onbind, ref }