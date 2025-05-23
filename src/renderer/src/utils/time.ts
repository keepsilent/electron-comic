import Base from "./base";
import {i18n} from '@renderer/locales';

const { t } = i18n.global;

/**
 * 兼容日期,支持IOS日期转换
 * @method compatibleDate
 * @param {String|Number} value 日期值：日期字符串或时间戳
 * @return {String|Number}
 */
const compatibleDate = function(value:string|number):string|number {
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
 * @param {String|Number} value 日期值：日期字符串或时间戳
 * @return {Number}
 */
const dateToTimestamp = function (value:string|number):number {
    if (Base.isEmpty(value)) {
        return 0
    }

    const date = compatibleDate(value);
    return Math.round(Number(new Date(date)));
}

/**
 * 获得之前间时间
 * @method getTimeAgo
 * @param {Number} date 日期值：日期字符串或时间戳
 * @param {String} format 日期格式,默认：YYYY/MM/DD HH:mm:ss
 * @param {String} short 日期短格式,默认：MM/DD HH:mm:ss
 * @return {String}
 */
const getTimeAgo = function (date:string|number = '', format:string = 'YYYY/MM/DD HH:mm:ss',short:string= 'MM/DD HH:mm:ss'):string {
    if (Base.isEmpty(date)) {
        return '';
    }

    const now = new Date().getTime();   //获取当前时间毫秒
    const timeStamp = dateToTimestamp(date);
    const value = now - timeStamp; //时间差

    const year = new Date().getFullYear().toString();
    const day = Math.floor(value / (1000 * 60 * 60) / 24);
    const hour = Math.floor(value / (1000 * 60 * 60));
    const minute = Math.floor(value / (1000 * 60));
    const second = Math.floor(value / 1000);

    if (day >= 1 && day <= 6) {
        if(hour - day * 24 == 0) {
            return t('time.dayAgo', {day: day});
        } else {
            return t('time.day', {day: day, hour: hour - day * 24});
        }
    }

    if (hour >= 1 && hour <= 23) {
        if(minute - hour * 60 == 0) {
            return t('time.hourAgo', {hour: hour});
        } else {
            return t('time.hour', {hour: hour, minute: minute - hour * 60});
        }
    }

    if (minute >= 1 && minute <= 59) {
        return t('time.minute',{minute:minute});
    }

    if(second >= 4 && second <= 59) {
        return t('time.second',{second:second})
    }

    if(second >= 0 && second <= 3) {
        return t('time.now');
    }

    if(formatDate(timeStamp, 'YYYY') == year) {
        return formatDate(timeStamp, short);
    } else {
        return formatDate(timeStamp, format);
    }
}

/**
 * 格式化日期
 * @method formatDate
 * @param {String|Number} value 日期值，字符串或时间戳
 * @param {String} format 日期格式,默认：YYYY-MM-DD HH:mm:ss
 * @return {String}
 */
const formatDate = function(value:string|number, format:string = 'YYYY/MM/DD HH:mm:ss'):string {
    if (Base.isEmpty(value)) {
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

export default {
    formatDate: formatDate,
    getTimeAgo: getTimeAgo,
	compatibleDate: compatibleDate,
    dateToTimestamp: dateToTimestamp
}
