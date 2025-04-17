import type {
    queryParam,
    insertParam,
    updateParam,
    deleteParam,
    Result
} from "@renderer/utils/db/base";
import {Base, DB, Time} from "@renderer/utils";


export const isFileMetaExist = async function ({id, key}):Promise<Result> {
    const sql = `SELECT * FROM cm_filemeta WHERE file_id = $id AND meta_key = $key LIMIT 1`;
    const data:queryParam = {
        sql: sql,
        params: {$id: id, $key:key}
    }
    return await DB.query(data);
}

export const getFileMetaValue = async function ({id, key}):Promise<Result> {
    const sql = `SELECT * FROM cm_filemeta WHERE file_id = $id AND meta_key = $key LIMIT 1`;
    const data:queryParam = {
        sql: sql,
        params: {$id: id, $key:key}
    }
    return await DB.query(data);
}

export const updateFileMetaValue = async function ({id, key, value}):Promise<Result> {
    const data:queryParam = {
        table: 'cm_filemeta',
        data: {
            'meta_value': value
        },
        condition: `file_id = ${id} AND meta_key='${key}'`
    }

    return await DB.update(data);
}

export const addFileMeta = async function (data:{ [key: string]: any }):Promise<Result> {
    const params:insertParam = {
        table: 'cm_filemeta',
        data: data
    }

    return await DB.insert(params);
}
