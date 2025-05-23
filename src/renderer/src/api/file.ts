import type {
    queryParam,
    insertParam,
    updateParam,
    deleteParam,
    Result
} from "@renderer/utils/db/base";
import {Base, DB, File, Time} from "@renderer/utils";
import {getTermRelationships,runRemoveTermRelationships} from "@renderer/api/terms";

const fs = require("fs") as typeof import("fs");

export const isFileExist = async function ({name}):Promise<Result> {
    const sql = `SELECT * FROM cm_file WHERE file_name = $name LIMIT 1`;
    const data:queryParam = {
        sql: sql,
        params: {$name: name}
    }
    return await DB.query(data);
}

export const getRandomFileInfo = async function ({file_id}):Promise<Result> {
    const sql = `SELECT * FROM cm_file WHERE file_id != $file_id AND file_status = 'normal' ORDER BY RANDOM() LIMIT 1`;
    const data:queryParam = {
        sql: sql,
        params: {$file_id: file_id}
    }
    console.log('getRandomFileInfo',sql);
    return await DB.query(data);
}

export const getFileInfo = async function ({id}):Promise<Result> {
    const sql = `SELECT * FROM cm_file WHERE file_id = $id LIMIT 1`;
    const data:queryParam = {
        sql: sql,
        params: {$id: id}
    }
    return await DB.query(data);
}

export const getFileArtist = async function ({object_id}):Promise<Result> {
    const sql = `SELECT name from cm_terms 
                 JOIN cm_term_taxonomy ON cm_term_taxonomy.term_id = cm_terms.term_id 
                 JOIN cm_term_relationships ON cm_term_relationships.term_taxonomy_id = cm_term_taxonomy.term_taxonomy_id
                 WHERE taxonomy = 'artist' AND object_id = $object_id`;
    const data:queryParam = {
        sql: sql,
        params: {$object_id: object_id}
    }
    return await DB.query(data);
}

export const getFileTaxonomy = async function ({file_id, taxonomy}):Promise<Result> {
    const sql = `SELECT cm_term_taxonomy.term_taxonomy_id, name, taxonomy, count FROM cm_file 
            JOIN cm_term_relationships ON cm_term_relationships.object_id = cm_file.file_id  
            JOIN cm_term_taxonomy ON cm_term_taxonomy.term_taxonomy_id = cm_term_relationships.term_taxonomy_id  
            JOIN cm_terms ON cm_terms.term_id = cm_term_taxonomy.term_id 
            WHERE file_id = $file_id AND taxonomy = $taxonomy`;
    const data:queryParam = {
        sql: sql,
        params: {$file_id: file_id, $taxonomy : taxonomy }
    }
    return await DB.query(data);
}

const getFileTotal = async function ({q, name, taxonomy}):Promise<number> {
    try {
        const join = getFileListJoin({name, taxonomy})
        const where = getFileListWhere({q, name, taxonomy});

        const sql = `SELECT count(*) as total FROM cm_file ${join} WHERE ${where} LIMIT 1`;
        const data: queryParam = {
            sql: sql,
            params: {}
        }
        const res = await DB.query(data);
        if(res.code != 200) {
            return 0;
        }

        if(Base.isEmpty(res.data)) {
            return 0;
        }

        return res.data[0].total;
    } catch (err) {
        return 0;
    }
}

const getFileListWhere = function ({q, name, taxonomy}):string {
    if(!Base.isEmpty(name) && !Base.isEmpty(taxonomy)) {
        return `(file_status = 'normal' OR file_status = 'lose') AND name = '${name}' AND taxonomy = '${taxonomy}'`;
    }

    if(!Base.isEmpty(q)) {
        return `(file_status = 'normal' OR file_status = 'lose') AND file_name LIKE '%${q}%'`;
    }

    return `file_status = 'normal' OR file_status = 'lose'`;
}

const getFileListJoin = function ({name, taxonomy}):string {
    const join = name && taxonomy ? `JOIN cm_term_relationships ON cm_term_relationships.object_id = cm_file.file_id
        JOIN cm_term_taxonomy ON cm_term_relationships.term_taxonomy_id = cm_term_taxonomy.term_taxonomy_id
        JOIN cm_terms ON cm_term_taxonomy.term_id = cm_terms.term_id`: '';
    return join;
}

const getFileListOrderBy = function ({mode ='name',sort= 'desc'}):string {
    const options = {
        'name':'file_name',
        'size': 'file_size',
        'type': 'file_mine_type',
        'date': 'file_date',
        'modify': 'file_modified',
        'view': 'file_view'
    }

    return `ORDER BY ${options[mode]} ${sort.toUpperCase()}`;
}

interface ListInter {
    page: string,
    pageSize: number,
    q?:string,
    order?: {mode:string, sort:string},
    name?:string,
    taxonomy?:string
}
export const getFileList = async function (params:ListInter):Promise<Result> {
    try {
        const {page, pageSize, q, name, taxonomy, order} = params;
        console.log('getFileList order',order);
        const total = await getFileTotal({q, name, taxonomy});
        const totalPage = Base.getTotalPage(total, pageSize);
        const join = getFileListJoin({name, taxonomy})
        const where = getFileListWhere({q, name, taxonomy});
        const orderby = getFileListOrderBy(order ? order: {mode:'name',sort: 'desc'});

        const sql = `SELECT * FROM cm_file ${join} WHERE ${where} ${orderby} LIMIT $page, $pageSize`;
        console.log('sql',sql);
        const data: queryParam = {
            sql: sql,
            params: {
                $page: Base.getPage(Number(page), totalPage) * pageSize,
                $pageSize: pageSize
            }
        }
        const res = await DB.query(data);
        if(res.code != 200) {
            return res
        }

        return {
            code: 200,
            data: {
                list: res.data,
                page:  Base.getPage(Number(page), totalPage) == totalPage ? totalPage :  Base.getPage(Number(page), totalPage) + 1,
                pageSize: pageSize,
                total: total,
                totalPage: totalPage,
            },
            message:'success'
        }
    } catch (err) {
        return {code: 500, message: err};
    }
}

export const addFile = async function (data:{ [key: string]: any }):Promise<Result> {
    const date = Time.formatDate(new Date().getTime());
    const params:insertParam = {
        table: 'cm_file',
        data: {
            'file_date': date,
            'file_modified': date,
            ...data
        }
    }

    return await DB.insert(params);
}

export const updateFileStatus = async function ({id, status}):Promise<Result> {
    const data:updateParam = {
        table: 'cm_file',
        data: {
            'file_status': status
        },
        condition: `file_id = ${id}`
    }

    return await DB.update(data);
}


export const updateFileInfo = async function ({file_id, data}):Promise<Result> {

    const params:updateParam = {
        table: 'cm_file',
        data: {
            ...data
        },
        condition: `file_id = ${file_id}`
    }

    return await DB.update(params);
}

export const deleteFile = async function ({id, status}):Promise<Result> {
    const data:deleteParam = {
        table: 'cm_file',
        condition: `file_id = ${id} AND file_status = '${status}'`
    }

    return await DB.delete(data);
}


const rename = function (oldPath:string,newPath:string):boolean {
    try {
        fs.renameSync(oldPath, newPath);
        return true
    } catch (err) {
        return false;
    }
}

export const updateFileInfoRecord = async function ({file_id, file_name, file_intro, old_file_path, new_file_path}):Promise<Boolean> {
    return await DB.transaction(async () => {
        try {
            const params = {
                file_id: file_id,
                data: {
                    file_name: file_name,
                    file_intro: file_intro,
                    file_path: old_file_path == new_file_path ? old_file_path : new_file_path,
                    file_modified: Time.formatDate(new Date().getTime())
                }
            }

            const res = await updateFileInfo(params)
            if(res.code != 200) {
                return false
            }

            if(File.isExists(old_file_path) && old_file_path != new_file_path) {
                if(rename(old_file_path, new_file_path) == false) {
                    return false;
                }
            }

            return true;
        } catch (err) {
            Base.printErrorLog('updateFileInfoRecord',err);
            return false
        }
    });
}

const removeTermRelationshipsCount = async function (object_id) {
    try {
        const params = { object_id: object_id};
        const res = await getTermRelationships(params);
        if(res.code != 200) {
            return false;
        }

        let num = 0;
        const total = Base.getDataLength(res.data);
        for(let i in res.data) {
            let {term_taxonomy_id} = res.data[i];
            if(await runRemoveTermRelationships(object_id, term_taxonomy_id)) {
                num++
            }
        }

        if(num != total) {
            return false
        }

        return true;
    } catch (err) {
        console.log('removeTermRelationshipsCount',err);
        return false;
    }
}

export const deleteFileInfoRecord = async function ({file_id}):Promise<Boolean> {
    return await DB.transaction(async () => {
        try {
            const params = { id: file_id, status: 'delete'};
            const res = await updateFileStatus(params);
            if(res.code != 200) {
                return false;
            }

            return await removeTermRelationshipsCount(file_id);
        } catch (err) {
            Base.printErrorLog('deleteFileInfoRecord',err);
            return false
        }
    });
}
