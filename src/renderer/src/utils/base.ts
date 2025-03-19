

/**
 * 是否为空
 * @method isEmpty
 * @param {string/number/object/array} value 需要较验的值
 * @returns {boolean}
 */
const isEmpty = function (value:any): boolean {
    if (value === '' || value === undefined || value === null) {
        return true;
    }

    if(typeof value == 'object') {
        for (let i in value) {
            return false;
        }

        return true;
    }

    return false;
}

/**
 * 是否对象类型
 * @method isEmpty
 * @param {Any} value 需要较验的值
 * @returns {boolean}
 */
const isObject = function (value:any): boolean {
    if(isEmpty(value)) {
        return false;
    }

    if(Object.prototype.toString.call(value) === '[object Object]') {
        return true
    }

    return  false;
}

/**
 * 跳转
 * @method redirect
 * @param {String} url 链接
 * @param {String} type 类型
 * @return {Bloon}
 */
const redirect = function (url:string, target:string = null):boolean|void {
    if(!isEmpty(target)) {
        const a = document.createElement('a');
        a.setAttribute('target', target);
        a.setAttribute('href', url);
        a.click();
        return false;
    }

    window.location.href = url;
}

const redirectByEvent = function ({currentTarget: {dataset: {url,target}}}):void {
    redirect(url,target)
}

/**
 * 获取数据长度
 * @method getDataLength
 * @param {Object} data 检查的数据
 * @return {Number}
 */
const getDataLength = function(data:object):number {
    let len = 0;
    for (let i in data) {
        len++;
    }

    return len;
}


/**
 * 获取对象首个键名
 * @method getObjectFirstKey
 * @param {Object} object 校验的object值
 * @return {String}
 */
const getObjectFirstKey = function (object:object):string {
    if(!isObject(object)) {
        return undefined
    }

    const [key] = Object.keys(object);
    return key;
}


/**
 * 打印错误日志
 * @method printErrorLog
 * @param {String} name
 * @param {Any} error
 */
const printErrorLog = function (name:string, error:any):void {
    console.error(name+' error', error);
}

/**
 * 显示Alert
 * @method {showAlert}
 * @param {Object} that
 * @param {String} content 提示内容
 * @param {String} title 提示标题
 * @param {String} confirmText 按钮文本
 */
const showAlert = function (confirm, content:string, title:string= '温馨提示', confirmText:string = '知道了',callback:string = '') {
    confirm.show = true;
    confirm.title = title;
    confirm.content = content;
    confirm.callback = callback;

    confirm.showCancel = false;
    confirm.cancelText = '';
    confirm.confirmText = confirmText;
}

/**
 * 显示Confirm
 * @method {showConfirm}
 * @param {Object} that
 * @param {String} content 提示内容
 * @param {String} title 提示标题
 * @param {String} confirmText 按钮文本
 */
const showConfirm = function (confirm, content:string, callback:string= '', title:string= '温馨提示' , confirmText:string = '确定', cancelText:string='取消'):void {
    confirm.show = true;

    confirm.title = title;
    confirm.content = content;
    confirm.callback = callback;

    confirm.showCancel = true;
    confirm.cancelText = cancelText;
    confirm.confirmText = confirmText;
}

const operateConfirm = function (confirm, page):boolean {
    confirm.show = false;

    if(isEmpty(confirm.callback)) {
        return false;
    }

    page.actions[confirm.callback]()
}

/**
 * 取消同意框
 * @method cancelConfirm
 * @param {Confirm} confirm
 */
const cancelConfirm = function (confirm):void {
    confirm.show = false;
}

export default {
    isEmpty: isEmpty,
    isObject: isObject,

    getDataLength: getDataLength,
    getObjectFirstKey: getObjectFirstKey,

    showAlert: showAlert,
    showConfirm: showConfirm,
    cancelConfirm: cancelConfirm,
    operateConfirm: operateConfirm,


    printErrorLog: printErrorLog,
    redirect:　redirect,
    redirectByEvent: redirectByEvent
}
