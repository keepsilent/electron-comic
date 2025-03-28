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
const getExtractFileCover = async function (data:File):Promise<string> {
    const file = getExtractImageFile(data);
    return await getBase64Image(file);
}


/**
 * 获取Base64图片
 * @method getBase64Image
 * @param {File} file
 * @return {String}
 */
const getBase64Image = function (file:File):Promise<string> {
    if (Base.isEmpty(file)) {
        return '';
    }

    return new Promise(function (resolve, reject) {
        const blob = new Blob([file]);
        const reader = new FileReader();

        reader.onload = ({target: {result}}) => {
            if(Base.isEmpty(result)) {
                resolve('')
            }

            if(result.indexOf('data:application/octet-stream;base64,') != -1) {
                result = (result).replace('data:application/octet-stream;base64,', 'data:image/png;base64,')
            }

            resolve(result)
        }

        reader.onerror = function (error) {
            reject(error)
        }

        reader.readAsDataURL(blob)
    })
}

/**
 * 获取提取文件里的图片文件
 * @method getExtractImageList
 * @param {File} files 提取文件信息
 * @param {Object} list
 * @return {Object}
 */
const getExtractImageList = function (files:File, list:File[] = []) {
    for(let i in files) {
        if(isFolderByExtract(files[i])) {
            list = getExtractImageList(files[i],list)
        } else {
            if(isImageFileByPath(files[i].name)) {
                list.push(files[i])
            }
        }
    }

    list.sort((a, b) => {
        if (a.name < b.name) {
            return -1;
        }
        if (a.name > b.name) {
            return 1;
        }

        return 0;
    });

    return list;
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

// /**
//  * 获取渲染的文件名
//  * @method getRenderFileName
//  * @param {String} name 文件全称
//  * @return {String}
//  */
// const getRenderFileName = function(name:string):string{
//     if(Base.isEmpty(name)) {
//         return '';
//     }
//
//     if(name.indexOf('.') == -1) {
//         return '';
//     }
//
//     const data = name.trim().split('.');
//     return data[0];
// }

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

    //const path = getCoverPathByName(name);
    const path = `${Config.getStoragePath()}${name}.png`;
    const dataBuffer = new Buffer.from(base64.replace(/^data:image\/\w+;base64,/, ""), 'base64'); //把base64码转成buffer对象，
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


/**
 * 获取文件图片通过id
 * @method getFileCoverById
 * @param {Number} id 文件ID
 */
const getFileCoverById = function (id:number):string {
    const prefix = Config.getStoragePath();
    const path = `${prefix}${id}.png`;
    return path;
}


/**
 * 格式化文件大小
 * @method formatFileSize
 * @param {Number} filesize
 */
const formatFileSize = function (filesize:number):string{
    if(Base.isEmpty(filesize)) {
        return "0 Bytes";
    }

    const unitArr = new Array("Bytes","KB","MB","GB","TB","PB","EB","ZB","YB");
    const index = Math.floor(Math.log(filesize)/Math.log(1024));
    const size = (filesize/Math.pow(1024,index)).toFixed(2);
    return size+unitArr[index];
}

/**
 * 获取文件别名
 * @method getFileAlias
 * @param  {String} value 名称
 * @return {string}
 */
const getFileAlias = function (value:string):string {
    if(Base.isEmpty(value)) {
        return '';
    }

    if(value.lastIndexOf('.') == -1) {
        return '';
    }

    const index = value.lastIndexOf('\\')
    if(index != -1) {
        value = value.substring(index + 1, value.length)
    }

    const [name] = value.trim().split('.');
    return name;
}

/**
 * 文件是否存在
 * @method isExists
 * @param {String} path
 * @return {Boolean}
 */
const isExists = function (path:string):boolean {
    if (fs.existsSync(path)) {
        return true
    }

    return false
}

/**
 * 删除文件
 * @method deleteFile
 * @param {String} path
 * @return {Boolean}
 */
const deleteFile = function (path:string):boolean{
    try {
        fs.unlinkSync(path);
        return  true
    } catch (err) {
        Base.printErrorLog('unlinkSync',err)
        return  false;
    }
}

export default {
    mkdir: mkdir,
    isExists: isExists,
    isImageFileByPath: isImageFileByPath,

    createCoverByBase64: createCoverByBase64,

    getFileExt: getFileExt,
    getFileAlias: getFileAlias,
    getStorePath: getStorePath,
    getFileCoverById: getFileCoverById,



    formatFileSize: formatFileSize,
    deleteFile: deleteFile,

    getBase64Image: getBase64Image,
    getExtractFileTotal: getExtractFileTotal,
    getExtractFileCover: getExtractFileCover,
    getExtractImageList: getExtractImageList
}
