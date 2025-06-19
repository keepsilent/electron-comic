/**
 * 获取APP路径
 * @method getStoragePath
 * @return {String}
 */
const getAppPath = function ():string {
    return localStorage.getItem('cm_app_path') ?? '';
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

/**
 * 获取存储路径
 * @method getStoragePath
 * @return {String}
 */
const getStoragePath = function ():string {
    return localStorage.getItem('cm_setting_storage_path') ?? localStorage.getItem('cm_app_path')+'\\files\\temp';
}

/**
 * 获取数据库存储路径
 * @method getDatabasePath
 * @return {String}
 */
const getDatabasePath = function ():string {
    return localStorage.getItem('cm_app_path')+'\\files\\db';
}

export default {
    getAppPath: getAppPath,
    getPublicPath: getPublicPath,
    getStoragePath: getStoragePath,
    getDatabasePath: getDatabasePath
}

