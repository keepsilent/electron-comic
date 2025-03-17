import type {
    queryParam,
    insertParam,
    updateParam,
    deleteParam
} from "@renderer/utils/db/base";
import {Base, DB, Time} from "@renderer/utils";


export const isFileExist = async function (name:string, type:string):Promise<boolen> {
    try {
        const sql = `SELECT * FROM file WHERE name = $name AND type = $type LIMIT 1`;
        const data:queryParam = {
            sql: sql,
            params: {$name: name, $type:type}
        }
        const res = await DB.query(data);

        if(res.code != 200) {
            return true;
        }

        if(Base.isEmpty(res.data)) {
            return false;
        }

        return true;
    } catch (err) {
        return true;
    }
}

export const getFileList = async function ({page,pagesize}):Promise<any[]> {
    const sql = `SELECT * FROM file LIMIT $page, $pagesize`;

    const data:queryParam = {
        sql: sql,
        params: {
            $page: (page - 1) * pagesize,
            $pagesize: pagesize
        },
    }

    return await DB.query(data);
}

export const addFile = async function (data:{ [key: string]: any }):Promise<any[]> {
    console.log('add file',data);
    const date = Time.formatDate(new Date().getTime());
    const params:insertParam = {
        table: 'file',
        data: {
            date: date,
            modified: date,
            ...data
        }
    }

    return await DB.insert(params);
}

