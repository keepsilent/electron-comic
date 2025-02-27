import Base from './base'
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




export default {
    mkdir: mkdir,
    getStorePath: getStorePath
}
