const fs = require('fs').promises;
const axios = require('axios');
const cheerio = require('cheerio');
const base = require('./lib/base');
const file = require('./lib/file');

const crawler = {
    scene: 'search',
    keyword: '',
    timer: null, //定时器
    ms: 3000, //定时器时间隔格
    current: 0, //定时器当前执行次数
    max: 10, //定时器最大可执行次数
    source: ''
}

const searchMap = {
    'nhentai': 'https://nhentai.net/search/?q='
}

const getCrawlerOptions = function () {
    return {
        'keyword': '111',
        'source': 'nhentai'
    }
}

const proxy = {
    protocol: 'http',   // 这里设置协议为 http
    host: '127.0.0.1',
    port: 8080
}
//https://nhentai.net/search/?q=%5BBG+Honda%5D+Ruuindo+Oogazumu+de+Amaiki+Tatakikoma+reru+Hanashi
const catchPage = async function () {
    try {
        // const res = await axios.get(crawler.url, {
        //     proxy: proxy,
        //     headers: {'Content-type': 'application/json; charset=UTF-8'},
        // });

        const res = await axios.get('https://nhentai.net/api/galleries/search?query=keep&page=1&sort=date');
        console.log('res',res);
        if(res.status != 200) {
            return false;
        }


        return res.data;

    } catch (err) {
        file.insertLogRecord('crawler',err,{'scene':crawler.scene});
        return '';
    }
}

const analysisSearch = function (content){
    // 获取网页数据
    const $ = cheerio.load(content);

}

const analysisDetails = function (content){

    const $ = cheerio.load(content);


    // console.log('xx',$('title').text());
    // file.writeFile('text.txt',content)
}

const setSearchOptions = function () {
    const options = getCrawlerOptions();
    crawler.keyword = options.keyword;
    crawler.source = options.source;
    switch (crawler.source) {
        case 'nhentai':
            crawler.url = 'https://nhentai.net/'
            //crawler.url = 'https://e-hentai.org/'
           // crawler.url = searchMap[options.source] + '%5BBG+Honda%5D+Ruuindo+Oogazumu+de+Amaiki+Tatakikoma+reru+Hanashi';
           // crawler.url = searchMap[options.source]
            break
    }

    catchPage();
    console.log('crawler',crawler);
}

const run = async function () {
    setSearchOptions();
}

run();
