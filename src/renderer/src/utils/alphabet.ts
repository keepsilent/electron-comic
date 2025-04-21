import pinyin from 'pinyin';
import Base from '@renderer/utils/base';

const asciiMap = {
    35: '#',
    65: 'A',
    66: 'B',
    67: 'C',
    68: 'D',
    69: 'E',
    70: 'F',
    71: 'G',
    72: 'H',
    73: 'I',
    74: 'J',
    75: 'K',
    76: 'L',
    77: 'M',
    78: 'N',
    79: 'O',
    80: 'P',
    81: 'Q',
    82: 'R',
    83: 'S',
    84: 'T',
    85: 'U',
    86: 'V',
    87: 'W',
    88: 'X',
    89: 'Y',
    90: 'Z',
}

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

    return str.charAt(0);
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

    const res = pinyin(str);
    if(Base.isEmpty(res)) {
        return '';
    }

    const data = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'];
    const chat = getFirstChar(res[0][0]);
    if(data.includes(chat)) {
        return chat;
    }

    const phoneme = phonemeMap[chat];
    return phoneme;
}

/**
 * 获取首个字符对应的字母
 * @method getFirstCharMatchLetter
 */
const getFirstCharMatchLetter = function (str:string):string {
    if(Base.isEmpty(str)) {
        return '#';
    }

    const char = getFirstChar(str);
    if(/^[A-Za-z]+$/.test(char)) { //正则英文
        return char;
    }

    if(/^[\u4e00-\u9fa5]$/.test(char)) {//正则中文
        return getHanToPinyinFirstLetter(char);
    }

    if(/[\u3040-\u30FF\u31F0-\u31FF\uFF66-\uFF9F\u4E00-\u9FAF]/g.test(char)) {//正则日文
        console.log('正则日文');
        return char;
    }

    if(/[\uAC00-\uD7AF]+/.test(char)) {//正则韩文
        return char
    }

    return '#'
}

export default {
    getFirstChar: getFirstChar,
    getHanToPinyinFirstLetter: getHanToPinyinFirstLetter,
    getFirstCharMatchLetter: getFirstCharMatchLetter
}
