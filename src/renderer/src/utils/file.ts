import Base from './base'
import Config from "./config";
const fs = require("fs") as typeof import("fs");
const path = require("path") as typeof import("path");


/**
 * 获取存储路径
 * @method getStorePath
 */
const getStorePath = function ():string {
    return './user/images/cover';
}


/**
 * 生成文件目录
 * @method mkdir
 * @param {String} path 文件路径
 */
const mkdir = function(path:string):boolean|void {
    if(Base.isEmpty(path)) {
        return false;
    }

    if(fs.existsSync(path)) {
        return false
    }

    fs.mkdir(path, { recursive: true }, (err) => {
        if (err) {
            console.error('fs.mkdir',err);
            return false;
        }
        console.log('目录递归创建成功');
    });
}

/**
 * 生成文件目录,兼容写法
 * @member mkdirByRecursive
 * @param {Sring} str 文件路径
 * @param {Number} index 文件目录索引
 */
const mkdirByRecursive = function(str:string,index:number = 0):boolean|void {
    const data = str.split('/');
    const length = data.length - 1;
    if(index > length) {
        return false;
    }

    let path = '';
    const regular = /(\/*$)/g;
    for(let i = 0; i <= index; i++) {
        path += data[i]+'/';
    }

    if(!Base.isEmpty(path)) {
        path = path.replace(regular,"");
    }

    if(fs.existsSync(path)) {
        mkdirByRecursive(str,index+1);
        return false
    }

    fs.mkdir(path,function(err) { //生成文件夹
        if(err){
            console.log('生成文件夹失败:'+err);
            return false;
        }

        mkdirByRecursive(str,index+1);
    })
}

/**
 * 获取解压文件总数
 * @member getExtractFileTotal
 * @param {Object} data 解压包提出文件数据
 * @return {Number}
 */
const getExtractFileTotal = function (data:object):number {
    if(Base.isEmpty(data)) {
        return 0
    }

    const key = Base.getObjectFirstKey(data);
    if(Base.isEmpty(key)) {
        return 0
    }

    return Base.getDataLength(data[key]);
}

/**
 * 获取解压文件封面
 * @member getExtractFileCover
 * @param {Object} data 解压包提出文件数据
 * @return {Number}
 */
const getExtractFileCover = function (data:object):Promise<string> {
    const reader = new FileReader()
    const file = getExtractImageFile(data);

    return new Promise(function (resolve, reject) {
        if (Base.isEmpty(file)) {
            reject('')
        }

        const blob = new Blob([file])
        reader.onload = ({target: {result}}) => {
            const base64 = (result).replace('data:application/octet-stream;base64,', 'data:image/png;base64,')
            resolve(base64)
        }

        reader.onerror = function (error) {
            reject('')
        }

        reader.readAsDataURL(blob)
    })
}

/**
 * 获取提取的图片文件信息
 * @method getExtractImageFile
 * @param {File|Object} data 提取到的文件对象数据
 * @return {File}
 */
const getExtractImageFile = function (data:File|object):File {
    let file = null;
    for(let i in data) {
        if(isFolderByExtract(data[i])) {
            file = getExtractImageFile(data[i])
            if(!Base.isEmpty(file)) {
                return file;
            }
        } else {
            if(isImageFileByPath(data[i].name)) {
                return data[i]
            }
        }
    }

    return file;
}

/**
 * 是否文件夹,通过提取
 * @method isFolderByExtract
 * @param {File|Object} file 提取到的文件对象数据
 * @return {boolean}
 */
const isFolderByExtract = function (file:File|object):boolean {
    if(Base.isEmpty(file)) {
        return false
    }

    if(!Base.isEmpty(file.type)) {
        return false
    }

    return true
}

/**
 * 获取文件后缀
 * @method getFileExt
 * @param {String} path 文件路径径
 * @return {String}
 */
const getFileExt = function(path:string):string{
    if(Base.isEmpty(path)) {
        return '';
    }

    if(path.indexOf('.') == -1) {
        return '';
    }

    const data = path.toLowerCase().trim().split('.');
    return data[data.length - 1];
}

/**
 * 通过路径，判断是否图片文件
 * @method isImageFileByPath
 * @param {String} path 文件路径
 * @return {Boolean}
 */
const isImageFileByPath = function (path:string):boolean {
    const ext = getFileExt(path);
    const data = ['png','gif', 'webp', 'jpg', 'bmp', 'jpeg'];

    if(Base.isEmpty(ext)) {
        return false;
    }

    if(data.indexOf(ext) != -1 ){
        return true
    }

    return false;
}

/**
 * 生成封面图片
 * @method createCoverByBase64
 * @param {String} name 文件名
 * @param {String} base64 base64图片
 */
const createCoverByBase64 = function (name:string, base64:string):boolean|void {
    if (Base.isEmpty(base64)) {
        return false
    }

    const path = getCoverPathByName(name);
    const dataBuffer = new Buffer(base64.replace(/^data:image\/\w+;base64,/, ""), 'base64'); //把base64码转成buffer对象，
    fs.writeFile(path, dataBuffer,function(err) {//用fs写入文件
        if(Base.isEmpty(err)) {
           return false
        }

        Base.printErrorLog('Use fs model write file fail:',err);
    });
}

/**
 * 获取封面图片路径
 * @method getCoverPathByName
 * @param {String} value 文件名
 * @return {String}
 */
const getCoverPathByName = function (value:string):string {
    if(Base.isEmpty(value)) {
        return '';
    }

    if(value.indexOf('.') == -1) {
        return '';
    }

    const index = value.lastIndexOf('.');
    const name = value.substr(0, index);
    const path = Config.getStoragePath();
    return `${path}${name}.png`;
}

export default {
    mkdir: mkdir,
    isImageFileByPath: isImageFileByPath,

    createCoverByBase64: createCoverByBase64,

    getFileExt: getFileExt,
    getStorePath: getStorePath,

    getExtractFileTotal: getExtractFileTotal,
    getExtractFileCover: getExtractFileCover
}
