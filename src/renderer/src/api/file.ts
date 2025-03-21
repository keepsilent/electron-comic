import type {
    queryParam,
    insertParam,
    updateParam,
    deleteParam,
    Result
} from "@renderer/utils/db/base";
import {Base, DB, Time} from "@renderer/utils";


export const isFileExist = async function ({name, type}):Promise<Result> {
    const sql = `SELECT * FROM file WHERE name = $name AND type = $type LIMIT 1`;
    const data:queryParam = {
        sql: sql,
        params: {$name: name, $type:type}
    }
    return await DB.query(data);
}

export const getFileInfo = async function ({id}):Promise<Result> {
    const sql = `SELECT * FROM file WHERE id = $id LIMIT 1`;
    const data:queryParam = {
        sql: sql,
        params: {$id: id}
    }
    return await DB.query(data);
}

export const getFileList = async function ({page,pagesize}):Promise<Result> {
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

export const addFile = async function (data:{ [key: string]: any }):Promise<Result> {
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

