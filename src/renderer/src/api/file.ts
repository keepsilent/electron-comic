import type {
    queryParam,
    insertParam,
    updateParam,
    deleteParam
} from "@renderer/api/db/base";
import DB from "@renderer/api/db/index";

export const insertFileRecord = async function (data:{ [key: string]: any }) {
    const params:insertParam = {
        table: 'file',
        data: [...data]
    }

    return await DB.insert(params);
}

export const query = async function (sql: string, params:any[] = []) {
    const data:queryParam = {
        sql: sql,
        params: params
    }

    return await DB.query(data);
}

