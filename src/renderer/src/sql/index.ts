const sqlite3 = require('sqlite3').verbose();
const os = require('os') as typeof import("os");

let db;

interface Db {
    filename: string,
    mode: number
    open:boolean
}

const conDb = function ():Db {
    const homedir = os.homedir(); // 用于获取当前用户的主目录路径
    const users = homedir.replace(/\\/g,'\\\\'); // 替换绝对和相对路径
    if (!db || !db.open) {
        db = new sqlite3.Database(users+'\\sql.db'); // 保存地址文件
    }

    console.log('db',db);
    return db;
}

export {
    conDb
}
