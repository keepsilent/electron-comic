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
const getExtractFileTotal = function (data:object):any {
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
    return file && await getBase64Image(file);
}


/**
 * 获取Base64图片
 * @method getBase64Image
 * @param {File} file
 * @return {String}
 */
const getBase64Image = function (file:any):Promise<string>|string {
    if (Base.isEmpty(file)) {
        return '';
    }

    return new Promise(function (resolve, reject) {
        const blob = new Blob([file]);
        const reader = new FileReader();
        // type  Event = {target?: {result?:string}}

        reader.onload = (fileReader) => {
            if(Base.isEmpty(fileReader)) {
                resolve('')
            }

            if(!fileReader.target || !fileReader.target.result) {
                resolve('')
            }

            let result = (fileReader.target && fileReader.target.result) ? (fileReader.target.result).toString() : '';

            if(result.includes('data:application/octet-stream;base64,')) {
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
    let file:any = '';
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
const isFolderByExtract = function (file):boolean {
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
const getFileExt = function(path:string = ''):string{
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
const isImageFileByPath = function (path:string = ''):boolean {
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
const createCoverByBase64 = async function (name:string = '', base64:string = ''):Promise<boolean|void> {
    if (Base.isEmpty(base64)) {
        return false
    }

    //const path = getCoverPathByName(name);
    const path = `${Config.getStoragePath()}${name}.png`;
    const newBase64 = await getScaleBase64(base64)
    const dataBuffer = Buffer.from(newBase64.replace(/^data:image\/\w+;base64,/, ""), 'base64'); //把base64码转成buffer对象，
    fs.writeFile(path, dataBuffer,function(err) {//用fs写入文件
        if(Base.isEmpty(err)) {
           return false
        }

        Base.printErrorLog('Use fs model write file fail:',err);
    });
}

/**
 * 获取缩放的Base64
 * @method getScaleBase64
 * @param {String} base64 base64字符串
 * @param {Number} maxWidth 图片最大宽，默认：432
 * @param {Number} maxHeight 图片最大高，默认：576
 * @param {Number} quality 图片压缩率,0-1
 */
const getScaleBase64 = async function (base64: string, maxWidth: number = 324 , maxHeight: number = 432, quality:number = 0.6):Promise<string> {
    const image = new Image();
    image.src = base64;
    image.setAttribute("crossOrigin", 'Anonymous');    // url为外域时需要

    return new Promise((resolve, reject) => {
        image.onload = function() {
            const {width:originalWidth,height:originalHeight} = image;
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d") as any;
            const {width, height} = scaleImage(originalWidth, originalHeight, maxWidth, maxHeight)
            canvas.width = width;
            canvas.height = height;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(this, 0, 0, canvas.width, canvas.height);
            resolve(canvas.toDataURL("image/webp", quality));
        }

        image.onerror = function () {
            reject('');
        }
    })
}

/**
 * 等比例缩放图片
 * @method scaleImage
 * @param {Number} originalWidth 图片原始宽
 * @param {Number} originalHeight 图片原始宽
 * @param {Number} maxWidth 图片最大宽
 * @param {Number} maxHeight 图片最大高
 */
const scaleImage = function (originalWidth:number, originalHeight:number, maxWidth:number, maxHeight:number):{width:number, height:number} {
    const aspectRatio = originalWidth / originalHeight;
    let width = maxWidth;
    let height = maxHeight;

    if (width / height > aspectRatio) {
        width = height * aspectRatio;
    } else {
        height = width / aspectRatio;
    }

    return { width, height };
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
const formatFileSize = function (filesize:number = 0):string{
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
const getFileAlias = function (value:string = ''):string {
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
const isExists = function (path:string=''):boolean {
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
        return true;
    } catch (err) {
        Base.printErrorLog('unlinkSync',err)
        return false;
    }
}

/**
 * 获取文件列表选项
 * @method getFileFilterOptions
 */
const getFileFilterOptions = function (): {mode :string, options:object } {
    const options = localStorage.getItem('cm_setting_file_filter');

    const res = {
        mode: 'full',
        options:{
            title: true,
            cover: true,
            artist: true,
            date: true,
            view: true,
            type: true,
            size: true
        }
    }

    return options ? JSON.parse(options) : res;
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
    getExtractImageList: getExtractImageList,
    getFileFilterOptions:getFileFilterOptions
}
