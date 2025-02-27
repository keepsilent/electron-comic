
/**
 * 设置容器高度
 * @method setMainHeight
 * @param {Number} height 屏幕高度
 * @param {Number} blank 留白空间,默认:118
 */
const getMainHeight = function (height:number, blank:number = 118):number {
    return height - blank;
}


export default {
    getMainHeight: getMainHeight
}
