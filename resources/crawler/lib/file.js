const base = require("./base");
const config = require("./config");
const fs = require('fs').promises;

const file = (function() {

    /**
     * 写入文件
     * @method writeFile
     * @param {string} path 文件路径
     * @param {string} content 文件内容
     * @return {Promise<boolean>}
     */
    const writeFile = async function (path, content) {
        try {
            await fs.writeFile(getFilePath(path), content);
            return true;
        } catch (err) {
            base.printErrorLog('fs.writeFile',err);
            insertLogRecord('fs.writeFile',err);
            return false;
        }
    }

    /**
     * 附加到文件
     * @method appendFile
     * @param {string} path 文件路径
     * @param {string} content 文件内容
     * @return {Promise<boolean>}
     */
    const appendFile = async function (path, content) {
        try {
            await fs.appendFile(getFilePath(path), content);
            return true;
        } catch (err) {
            base.printErrorLog('fs.appendFile',err);
            insertLogRecord('fs.appendFile',err);
            return false;
        }
    }


    /**
     * 插入日志记录
     * @method insertLogRecord
     * @param {string} name 日志标记名称
     * @param {string} info 日志查看信息
     * @param {object} extra 日志扩展信息
     * @return {Promise<void>}
     */
    const insertLogRecord = async function (name, info, extra= {}) {
        const data = {
            name: name,
            time: base.formatDate(new Date().getTime()),
            info: info
        }

        if(!base.isEmpty(extra)) {
            data.extra = extra;
        }

        const content = JSON.stringify(data)+'\n';
        appendFile('log.txt', content);
    }

    /**
     * 获取文件路径
     * @method getFilePath
     * @param {string} path 路径
     * @return {string}
     */
    const getFilePath = function (path) {
        return config.getFilePath() + path;
    }

    return {
        writeFile: writeFile,
        appendFile: appendFile,
        insertLogRecord: insertLogRecord
    }
})();

module.exports = file;
