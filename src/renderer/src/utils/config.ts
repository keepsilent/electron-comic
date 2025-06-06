
/**
 * 设置容器高度
 * @method setMainHeight
 * @param {Number} height 屏幕高度
 * @param {Number} blank 留白空间,默认:118
 */
const getMainHeight = function (height:number, blank:number = 118):number {
    return height - blank;
}

/**
 * 获取存储路径
 * @method getStoragePath
 */
const getStoragePath = function (key:string = ''):string {
    return localStorage.getItem('cm_setting_storage_path') || import.meta.env.VITE_APP_COVER_PATH
}

/**
 * 获取公共资源路径
 * @method getPublicPath
 * @param {string} path 渲染文件数径
 * @return {String}
 */
const getPublicPath = function (path:string = ''):string {
    const mode = import.meta.env.MODE;
    if(mode == 'production') {
        path = `../${path}`
    }

    return new URL(path, import.meta.url).href
}

export default {
    getMainHeight: getMainHeight,
    getStoragePath: getStoragePath,
    getPublicPath: getPublicPath
}

