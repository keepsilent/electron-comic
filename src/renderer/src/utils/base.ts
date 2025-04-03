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
const redirect = function (url:string, target:string = null):boolean {
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
 * 首字母大写
 * @method capitalizeFirstLetter
 * @param {String} str
 */
const capitalizeFirstLetter = function (str):string {
    if(isEmpty(str) == true) {
        return str
    }

    const reg = /^[A-Za-z]+$/
    if(reg.test(str) == false) {
        return str;
    }

    return str[0].toUpperCase() + str.slice(1);
}






export default {
    isEmpty: isEmpty,
    isObject: isObject,

    getDataLength: getDataLength,
    getObjectFirstKey: getObjectFirstKey,

    printErrorLog: printErrorLog,
    redirect:　redirect,
    redirectByEvent: redirectByEvent,

    capitalizeFirstLetter: capitalizeFirstLetter,
}
