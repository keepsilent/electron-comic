const config = (function() {

    const options = {
        //path: './resources/crawler'
        path: '',
    }

    /**
     * 获取文件路径
     * @method getFilePath
     * @return {string}
     */
    const getFilePath = function () {
        return options.path;
    }

    return {
        getFilePath: getFilePath
    }
})();

module.exports = config;
