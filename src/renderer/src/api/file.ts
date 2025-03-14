import type {
    queryParam,
    insertParam,
    updateParam,
    deleteParam
} from "@renderer/utils/db/base";
import {Base,DB} from "@renderer/utils";


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
            $page: page,
            $pagesize: pagesize
        },
    }

    return await DB.query(data);
}

export const addFile = async function (data:{ [key: string]: any }):Promise<any[]> {
    const params:insertParam = {
        table: 'file',
        data: [...data]
    }

    return await DB.insert(params);

    // const sql = {
    //     table: 'file',
    //     data: {
    //         name: file.name,
    //         author: '',
    //         type: file.type,
    //         size: file.size,
    //         path: file.path,
    //         total: File.getExtractFileTotal(res)
    //     }
    // }
    //
    // return await DB.(data);
}

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

