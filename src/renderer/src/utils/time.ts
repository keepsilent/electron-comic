import Base from "./base";

/**
 * 兼容日期,支持IOS日期转换
 * @method compatibleDate
 * @param {String} value 日期值：字符串或时间戳
 * @return {String}
 */
const compatibleDate = function (value:string|number):string {
    if (Base.isEmpty(value)) {
        return ''
    }

    if(typeof value == 'string') {
        value = value.replace(/\-/g, '/');
    }

    return value;
}

/**
 * 日期转时间戳
 * @method dateToTimestamp
 * @param {String} date 日期字符串
 * @return {String}
 */
const dateToTimestamp = function (date:string):string {
    if (Base.isEmpty(date)) {
        return ''
    }

    date = compatibleDate(date);
    return Math.round(new Date(date));
}


/**
 * 获得之前间时间
 * @method getTimeAgo
 * @param {Number} timeStamp 时间戳
 * @param {String} format 日期格式,默认：YYYY-MM-DD HH:mm:ss
 * @return {String}
 */
const getTimeAgo = function (date:number, format:string = 'YYYY/MM/DD HH:mm:ss'):string {   //dateTimeStamp是一个时间毫秒，注意时间戳是秒的形式，在这个毫秒的基础上除以1000，就是十位数的时间戳。13位数的都是时间毫秒。
    if (Base.isEmpty(date)) {
        return '';
    }

    const timeStamp = dateToTimestamp(date);
    const now = new Date().getTime();   //获取当前时间毫秒
    const value = now - parseInt(timeStamp); //时间差

    const hour = Math.floor(value / (1000 * 60 * 60));
    const minute = Math.floor(value / (1000 * 60));
    const second = Math.floor(value / 1000);

    if (hour >= 1 && hour <= 12) {
        return parseInt(hour) + '小时前';
    }

    if (minute >= 1 && minute <= 59) {
        return parseInt(minute) + '分钟前';
    }

    if(second >= 0 && second <= 59) {
        return '刚刚';
    }

    return formatDate(timeStamp, format);
}

/**
 * 格式化日期
 * @method formatDate
 * @param {String} value 日期值，字符串或时间戳
 * @param {String} format 日期格式,默认：YYYY-MM-DD HH:mm:ss
 * @return {String}
 */
const formatDate = function(value:string, format:string = 'YYYY/MM/DD HH:mm:ss'):string {
    if (Base.isEmpty(value)) {
        return '';
    }
    console.log('formatDate v4444a',compatibleDate(value))
    value = value * 1000;
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


export default {
    formatDate: formatDate,
    getTimeAgo: getTimeAgo,
	compatibleDate: compatibleDate,
    dateToTimestamp: dateToTimestamp
}
