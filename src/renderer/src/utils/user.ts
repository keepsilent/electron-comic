/**
 * 获取用户等级经验
 * @method getUserLevelExp
 * @param {Number} level 等级
 * @return {Number}
 */
const getUserLevelExp = function (level:number):number {
    const data = [60,200,1500,4500,10800,28800,114457,292699,301183];
    return data[level-1];
}

/**
 * 获取用户经验进度
 * @method getUserExpProgress
 * @param {Number} level 等级
 * @param {Number} exp 经验值
 * @return {Number}
 */
const getUserExpProgress = function (level:number,exp:number):number {
    const total  = getUserLevelExp(level);
    const rate = (exp / total) * 100;
    return rate > 100 ? 100: rate;
}

export default {
    getUserLevelExp: getUserLevelExp,
    getUserExpProgress:　getUserExpProgress
}
