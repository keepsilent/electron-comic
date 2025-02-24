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

const redirectByEvent = function ({currentTarget: {dataset: {url,target}}}) {
    redirect(url,target)
}

export default {
    isEmpty: isEmpty,
    redirect:　redirect,
    redirectByEvent: redirectByEvent
}
