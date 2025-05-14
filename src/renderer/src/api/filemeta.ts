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

export const insertFileMeta = async function (data:{ [key: string]: any }):Promise<Result> {
    try {
        const params = {id: data.file_id, key: data.meta_key, value: data.meta_value}
        const res = await getFileMetaValue(params);
        if (res.code !== 200) {
            return res;
        }

        if(Base.isEmpty(res.data)) {
            return await addFileMeta(data);
        }

        return await updateFileMetaValue(params);
    } catch (err) {
        Base.printErrorLog('insertFileMeta',err);
        return {code: 500, message: err, data:''}
    }
}
