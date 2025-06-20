import useClipboard from 'vue-clipboard3'
const { toClipboard } = useClipboard();

/**
 * 是否为空
 * @method isEmpty
 * @param {string/number/object/array} value 需要较验的值
 * @returns {boolean}
 */
const isEmpty = function (value:any = undefined): boolean {
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
const isObject = function (value:any = undefined): boolean {
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
const redirect = function (url:string, target:string = ''):boolean {
    if(!isEmpty(target)) {
        const a = document.createElement('a');
        a.setAttribute('target', target);
        a.setAttribute('href', url);
        a.click();
        return false;
    }

    window.location.href = url;
    return true;
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
const getDataLength = function(data:any = undefined):number {
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
        return ''
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


/**
 * 值是否在数组里
 * @method inArray
 * @param {Object} data
 * @param {String} key
 * @param {Any} value
 * @return {Boolean}
 */
const inArray = function (arr:object, key:string, value:any):boolean {
    for(let i in arr) {
        if(arr[i][key] == value) {
            return true
        }
    }

    return false;
}

/**
 * 数组去重
 * @method unique
 * @param {Object} arr
 * @return {Object}
 */
const unique = function (arr:any):object {
    if(isEmpty(arr)) {
        return []
    }

    return Array.from(new Set(arr))
}

/**
 * 复制文本到剪贴板
 * @method copy
 * @param event
 */
const copy = async function (event) {
    const text = event.target.dataset.text;
    try {
        await toClipboard(text)
    } catch (err) {
        printErrorLog('toClipboard',err)
    }
}

/**
 * 获取页数
 * @method getPage
 * @param {Number} spage
 * @param {Number} totalPage
 * @return {Number}
 */
const getPage = function (page:number, totalPage:number):number {
    if(page - 1 < 0) {
        return 0;
    }

    if(page - 1 > totalPage) {
        return totalPage;
    }

    return page - 1;
}

/**
 * 获取总页数
 * @method getTotalPage
 * @param {Number} total
 * @param {Number} pageSize
 * @return {Number}
 */
const getTotalPage = function (total:number, pageSize:number):number {
    return Math.ceil(total / pageSize) || 1
}

export default {
    isEmpty: isEmpty,
    isObject: isObject,
    inArray: inArray,
    unique: unique,
    copy: copy,

    getPage: getPage,
    getTotalPage: getTotalPage,
    getDataLength: getDataLength,
    getObjectFirstKey: getObjectFirstKey,

    printErrorLog: printErrorLog,
    redirect:　redirect,
    redirectByEvent: redirectByEvent,

    capitalizeFirstLetter: capitalizeFirstLetter
}
