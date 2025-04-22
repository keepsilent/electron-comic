import pinyin from 'pinyin';
import Base from '@renderer/utils/base';
import { romanize } from '@romanize/korean';

const japanese = require("japanese") as typeof import("japanese");

const phonemeMap = {
    'ā': 'a',
    'á': 'a',
    'ǎ': 'a',
    'à': 'a',

    'ō': 'o',
    'ó': 'o',
    'ǒ': 'o',
    'ò': 'o',

    'ê': 'e',
    'ē': 'e',
    'é': 'e',
    'ě': 'e',
    'è': 'e',

    'ī': 'i',
    'í': 'i',
    'ǐ': 'i',
    'ì': 'i',

    'ū': 'u',
    'ú': 'u',
    'ǔ': 'u',
    'ù': 'u',

    'ǖ': 'u',
    'ǘ': 'u',
    'ǚ': 'u',
    'ǜ': 'u',
    'ü': 'u',
}

/**
 * 获取首个字符
 * @method getFirstChar
 * @param {String} str
 * @return {String}
 */
const getFirstChar = function (str:string):string {
    if(Base.isEmpty(str)) {
        return '';
    }

    return str.trim().charAt(0);
}

/**
 * 获取汉字转拼音首个字母
 * @method getHanToPinyinFirstLetter
 * @param {String} str
 * @return {String}
 */
const getHanToPinyinFirstLetter = function (str:string):string {
    if(Base.isEmpty(str)) {
        return '';
    }

    const res = pinyin(str.trim());
    if(Base.isEmpty(res)) {
        return '';
    }

    return getMatchPhonemeLetter(res[0][0]);
}

/**
 * 获取日语转罗马拼音的首个字母
 * @method getJapaneseToRomanizeFirstLetter
 * @param {String} str
 * @return {String}
 */
const getJapaneseToRomanizeFirstLetter = function (str:string):string {
    if(Base.isEmpty(str)) {
        return '';
    }

    const res = japanese.romanize(str.trim());
    if(Base.isEmpty(res)) {
        return '';
    }

    return getMatchPhonemeLetter(res[0]);
}

/**
 * 获取韩语转罗马拼音的首个字母
 * @method getKoreanToRomanizeFirstLetter
 * @param {String} str
 * @return {String}
 */
const getKoreanToRomanizeFirstLetter = function (str:string):string {
    if(Base.isEmpty(str)) {
        return '';
    }

    const res = romanize(str.trim());
    if(Base.isEmpty(res)) {
        return '';
    }

    return getMatchPhonemeLetter(res);
}

/**
 * 获取匹配的音素字母
 * @method getMatchPhonemeLetter
 * @param {String} str 字符串
 * @return {String}
 */
const getMatchPhonemeLetter = function (str:string):string {
    if(Base.isEmpty(str)) {
        return '';
    }

    const data = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'];
    const chat = getFirstChar(str.trim());
    if(data.includes(chat)) {
        return chat;
    }

    const phoneme = phonemeMap[chat];
    if(Base.isEmpty(phoneme)) {
        return ''
    }

    return phoneme;
}

/**
 * 获取首个字符对应的字母
 * @method getFirstCharMatchLetter
 * @param {String} str 字符串
 * @return {String}
 */
const getFirstCharMatchLetter = function (str:string):string {
    if(Base.isEmpty(str)) {
        return '';
    }

    const char = getFirstChar(str.trim());
    if(/^[A-Za-z]+$/.test(char)) { //正则英文
        return char;
    }

    if(/^[\u4e00-\u9fa5]$/.test(char)) {//正则中文
        return getHanToPinyinFirstLetter(char);
    }

    if(/[\uAC00-\uD7AF]+/.test(char)) {//正则韩文
        return getKoreanToRomanizeFirstLetter(char);
    }

    if(/[\u3040-\u30FF\u31F0-\u31FF\uFF66-\uFF9F\u4E00-\u9FAF]/g.test(char)) {//正则日文
        return getJapaneseToRomanizeFirstLetter(char);
    }

    return ''
}


/**
 * 获取首个字符对应的Ascii
 * @method getFirstCharMatchAscii
 * @param {String} str 字符串
 * @return {Number}
 */
const getFirstCharMatchAscii = function (str:string):number {
    if(Base.isEmpty(str)) {
        return 0;
    }

    let letter = getFirstCharMatchLetter(str);
    if(Base.isEmpty(letter)) {
        return ('#').charCodeAt(0);
    }

    return letter.toUpperCase().charCodeAt(0);
}

export default {
    getFirstChar: getFirstChar,
    getFirstCharMatchAscii: getFirstCharMatchAscii
}
