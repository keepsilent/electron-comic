import type {
    queryParam,
    insertParam,
    updateParam,
    deleteParam,
    Result
} from "@renderer/utils/db/base";
import {Base, DB, File, Time} from "@renderer/utils";

const fs = require("fs") as typeof import("fs");

export const isFileExist = async function ({name, type}):Promise<Result> {
    const sql = `SELECT * FROM cm_file WHERE file_name = $name AND file_mine_type = $type LIMIT 1`;
    const data:queryParam = {
        sql: sql,
        params: {$name: name, $type:type}
    }
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

export const getFileList = async function ({keyword, page,pagesize}):Promise<Result> {
    let where = `WHERE file_status='normal'`;
    if(keyword) {
        where += ` AND file_name LIKE '%${keyword}%'`;
    }
    const sql = `SELECT * FROM cm_file  ${where}  LIMIT $page, $pagesize`;

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
    const data:queryParam = {
        table: 'cm_file',
        data: {
            'file_status': status
        },
        condition: `file_id = ${id}`
    }

    return await DB.update(data);
}


export const updateFileInfo = async function ({file_id, file_name, file_intro, file_path}):Promise<Result> {
    const data:queryParam = {
        table: 'cm_file',
        data: {
            'file_name': file_name,
            'file_intro': file_intro,
            'file_path': file_path
        },
        condition: `file_id = ${file_id}`
    }

    return await DB.update(data);
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
                file_name: file_name,
                file_intro: file_intro,
                file_path: old_file_path == new_file_path ? old_file_path : new_file_path
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
