const base = (function() {

    /**
     * 是否为空
     * @method isEmpty
     * @param {string/number/object/array} value 需要较验的值
     * @returns {boolean}
     */
    const isEmpty = function (value) {
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
     * 兼容日期,支持IOS日期转换
     * @method compatibleDate
     * @param {String} value 日期值：字符串或时间戳
     * @return {String}
     */
    const compatibleDate = function (value) {
        if (isEmpty(value)) {
            return ''
        }

        if(typeof value == 'string') {
            value = value.replace(/\-/g, '/');
        }

        return value;
    }

    /**
     * 格式化日期
     * @method formatDate
     * @param {String} value 日期值，字符串或时间戳
     * @param {String} format 日期格式,默认：YYYY-MM-DD HH:mm:ss
     * @return {String}
     */
    const formatDate = function(value, format = 'YYYY/MM/DD HH:mm:ss') {
        if (isEmpty(value)) {
            return '';
        }


        const date = new Date(compatibleDate(value));
        const options = {
            'Y+': date.getFullYear().toString(), // 年
            'M+': (date.getMonth() + 1).toString(), // 月
            'D+': date.getDate().toString(), // 日
            'H+': date.getHours().toString(), // 时
            'm+': date.getMinutes().toString(), // 分
            's+': date.getSeconds().toString() // 秒
        }

        for (let i in options) {
            let ret = new RegExp('(' + i + ')').exec(format)
            if (ret) {
                let length = ret[1].length;
                let value = (length === 1) ? options[i] : options[i].padStart(length, '0');
                format = format.replace(ret[1], value);
            }
        }

        return format
    }

    /**
     * 打印错误日志
     * @method printErrorLog
     * @param {string} name 日志标记名称
     * @param {string} err 日志错误信息
     * @return {void}
     */
    const printErrorLog  = function (name, err) {
        console.error('name:'+name,'err:'+err);
    }

    return {
        isEmpty: isEmpty,
        formatDate: formatDate,
        printErrorLog: printErrorLog
    }
})();

module.exports = base;
