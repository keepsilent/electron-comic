import Config from "../config";
const sqlite3 = require('sqlite3').verbose();
const os = require('os') as typeof import("os");
const path = require("path") as typeof import("path");

// const homedir = os.homedir(); // 用于获取当前用户的主目录路径
// const userDataPath = homedir.replace(/\\/g,'\\\\'); // 替换绝对和相对路径
// const dbPath = path.join(userDataPath, "sqliteDatabase.db")
// console.error('dbPath',dbPath);
const dbPath = path.join(Config.getDatabasePath(), "app.db")

export interface queryParam {
    sql: string;
    //params?: any[];
    //params?: object;
    params?: { [key: string]: any };
}

export interface insertParam {
    table: string;
    data: { [key: string]: any };
}

export interface updateParam {
    table: string;
    data: { [key: string]: any };
    condition: string;
}

export interface deleteParam {
    table: string;
    condition: string;
}

export interface Result {
    code: number,
    message?: any,
    data?: any
}


class Database {
    private db;
    private static instance: Database;


    private constructor() {
        this.db = new sqlite3.Database(dbPath);
    }

    static async getInstance(): Promise<Database> {
        if (!Database.instance) {
            Database.instance = new Database();
            await Database.instance.open();
            await Database.instance.initializeSchema();
        }
        return Database.instance;
    }

    private dataFormat(code:number,message:any = '', data:any = null):Result {
        return { code: code, message: message, data: data }
    }

    private open(): Promise<Result> {
        return new Promise<Result>((resolve, reject) => {
            this.db.serialize(() => {
                this.db.run("PRAGMA foreign_keys = ON", (err) => {
                    if (err) {
                        reject(Database.instance.dataFormat(500,err));
                    } else {
                        console.log("Connected to the database.");
                        resolve(Database.instance.dataFormat(200,'Connected to the database'));
                    }
                });
            });
        });
    }

    private async initializeSchema(index:number=0): Promise<any> {
        const options = {
            'cm_file': `CREATE TABLE IF NOT EXISTS cm_file (
                file_id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
                file_date DATETIME NOT NULL DEFAULT '0000-00-00 00:00:00',
                file_modified DATETIME NOT NULL DEFAULT '0000-00-00 00:00:00',
                file_name TEXT NOT NULL DEFAULT '' ,
                file_path TEXT NOT NULL DEFAULT '' ,
                file_status VARCHAR(32) NOT NULL DEFAULT 'normal',
                file_size INTEGER NOT NULL DEFAULT 0,
                file_total VARCHAR(10) NOT NULL DEFAULT '0',
                file_mine_type VARCHAR(64) NOT NULL DEFAULT '',
                file_view INT(11) NOT NULL DEFAULT 0,
                file_intro TEXT NOT NULL DEFAULT '' 
            );`,
            'file_name': `CREATE INDEX IF NOT EXISTS file_name on cm_file (file_name);`,
            'cm_filemeta': `CREATE TABLE IF NOT EXISTS cm_filemeta (
                meta_id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
                file_id BIGINT(20) NOT NULL DEFAULT 0,
                meta_key VARCHAR(255) NOT NULL DEFAULT '',
                meta_value TEXT NOT NULL DEFAULT ''
            );`,
            'filemeta_meta_key': `CREATE INDEX IF NOT EXISTS meta_key on cm_filemeta (meta_key);`,
            'filemeta_meta_value': `CREATE INDEX IF NOT EXISTS meta_value on cm_filemeta (meta_value);`,
            'cm_terms': `CREATE TABLE IF NOT EXISTS cm_terms (
                term_id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
                name VARCHAR(200) NOT NULL DEFAULT '',
                slug VARCHAR(200) NOT NULL DEFAULT '',
                term_group BIGINT(10) NOT NULL DEFAULT '0'
            );`,
            'cm_term_taxonomy': `CREATE TABLE IF NOT EXISTS cm_term_taxonomy (
                term_taxonomy_id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
                term_id BIGINT(20) NOT NULL DEFAULT '0',
                taxonomy VARCHAR(32) NOT NULL DEFAULT '',
                description TEXT NOT NULL DEFAULT '' ,
                parent BIGINT(20) NOT NULL DEFAULT '0',
                count BIGINT(20) NOT NULL DEFAULT '0'
            );`,
            'cm_term_relationships': `CREATE TABLE IF NOT EXISTS cm_term_relationships (
                object_id BIGINT(20) NOT NULL, 
                term_taxonomy_id BIGINT(20) NOT NULL DEFAULT '0',
                term_order INT(11) NOT NULL DEFAULT '0',
                PRIMARY KEY (object_id,term_taxonomy_id)
            );`,
        }

        const keys = Object.keys(options)
        const key= keys[index];
        const sql = options[key];

        if(index > keys.length - 1) {
            return false;
        }

        try {
            const res = await this.query({sql: sql});
            if(res.code == 200) {
                //console.log(`Sql ${key} run success`);
            }
        } catch (err) {
            console.error("Error initializing database schema:", err);
        } finally {
            await Database.instance.initializeSchema(index+1);
        }

        // return this.query({sql: sql}).then(() => {
        //     console.log("Database schema initialized.");
        // }).catch((err) => {
        //     console.error("Error initializing database schema:", err);
        // });
    }

    close(): Promise<Result> {
        return new Promise<Result>((resolve, reject) => {
            this.db.close((err) => {
                if (err) {
                    reject(Database.instance.dataFormat(500,err));
                } else {
                    resolve(Database.instance.dataFormat(200,'Database closed.'));
                }
            });
        });
    }

    query(param: queryParam): Promise<Result> {
        return new Promise<Result>((resolve, reject) => {
            //console.log('param.sql',param.sql);
            this.db.all(param.sql, param.params, (err, rows) => {
                if (err) {
                    reject(Database.instance.dataFormat(500,err));
                } else {
                    resolve(Database.instance.dataFormat(200,'success',rows));
                }
            });
        });
    }

    insert(param: insertParam): Promise<Result> {
        return new Promise<Result>((resolve, reject) => {
            const keys = Object.keys(param.data);
            const values = Object.values(param.data);
            const placeholders = keys.map(() => "?").join(",");
            const sql = `INSERT INTO ${param.table} (${keys.join(",")}) VALUES (${placeholders})`;

            this.db.run(sql, values, function (this:any, err:string)  {
                if (err) {
                    reject(Database.instance.dataFormat(500,err));
                } else {
                    let {lastID} = this;
                    resolve(Database.instance.dataFormat(200,'success',lastID));
                }
            });
        });
    }

    update(param: updateParam): Promise<Result> {
        return new Promise<Result>((resolve, reject) => {
            const entries = Object.entries(param.data).map(([key, value]) => `${key} = ?`).join(",");
            const params = Object.values(param.data);
            const sql = `UPDATE ${param.table} SET ${entries} WHERE ${param.condition}`;

            this.db.run(sql, params, function(this:any, err:string) {
                if (err) {
                    reject(Database.instance.dataFormat(500, err));
                } else {
                    let {changes} = this;
                    resolve(Database.instance.dataFormat(200,'success',changes));
                }
            });
        });
    }

    delete(param: deleteParam): Promise<Result> {
        return new Promise<Result>((resolve, reject) => {
            const sql = `DELETE FROM ${param.table} WHERE ${param.condition}`;
            this.db.run(sql, (err) => {
                if (err) {
                    reject(Database.instance.dataFormat(500,err));
                } else {
                    resolve(Database.instance.dataFormat(200,'success'));
                }
            });
        });
    }

    transaction(fn): Promise<Result> {
        return new Promise<Result>((resolve, reject) => {
            this.db.run('BEGIN', async (err) => {
                if (err) {
                    reject(Database.instance.dataFormat(500,err));
                    return false;
                }

                try {
                    const res = await fn();
                    if(res == false) {
                        this.db.run('ROLLBACK'); // 回滚事务
                        reject(Database.instance.dataFormat(500,err));
                        return
                    }

                    this.db.run('COMMIT');  // 提交事务
                    resolve(Database.instance.dataFormat(200,'success'));
                } catch(err) {
                    this.db.run('ROLLBACK'); // 回滚事务
                    reject(Database.instance.dataFormat(500,err));
                }
            });
        });
    }
}

// Wrap database calls to ensure initialization
const getDatabase = async (): Promise<Database> => {
    return await Database.getInstance();
};

export const sqQuery = async (param: queryParam) => {
    const db = await getDatabase();
    return db.query(param);
};

export const sqInsert = async (param: insertParam) => {
    const db = await getDatabase();
    return db.insert(param);
};

export const sqUpdate = async (param: updateParam) => {
    const db = await getDatabase();
    return db.update(param);
};

export const sqDelete = async (param: deleteParam) => {
    const db = await getDatabase();
    return db.delete(param);
};

export const sqTransaction = async (fn) => {
    const db = await getDatabase();
    return db.transaction(fn);
};
