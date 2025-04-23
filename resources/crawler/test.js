const got = require('got');

const API = 'https://nhentai.net/api'

const toQueryParams = (arg , defaults) => {
    Object.entries(arg).map(([key, value]) => `${key}=${value || defaults[key]}`).join('&')
}



const run = async function() {
    try {
        const response = await got(`${API}/api/galleries/search?query=[Zerodo]&page=1&sort=date`)
        console.log('err', response);
    } catch (err) {
        console.log('err',err);
    }

}

run();
