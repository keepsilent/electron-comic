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

export default {
    isEmpty: isEmpty
}
