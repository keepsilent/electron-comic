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

export const getRandomFileInfo = async function ({id}):Promise<Result> {
    const sql = `SELECT * FROM cm_file WHERE file_id != $id AND file_status = 'normal' ORDER BY RANDOM() LIMIT 1`;
    const data:queryParam = {
        sql: sql,
        params: {$id: id}
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

const getFileTotal = async function ({q, name, type}):Promise<number> {
    try {
        const join = name && type ? `JOIN cm_term_relationships ON  cm_term_relationships.object_id = cm_file.file_id
        JOIN cm_term_taxonomy ON cm_term_relationships.term_taxonomy_id = cm_term_taxonomy.term_taxonomy_id
        JOIN cm_terms ON cm_term_taxonomy.term_id = cm_terms.term_id`: '';
        const where = getFileListWhere({q, name, type});

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

const getFileListWhere = function ({q, name, type}):string {
    if(!Base.isEmpty(name) && !Base.isEmpty(type)) {
        return `file_status = 'normal' AND name = '${name}' AND taxonomy = '${type}'`;
    }

    if(!Base.isEmpty(q)) {
        return `file_status = 'normal' AND file_name LIKE '%${q}%'`;
    }

    return `file_status = 'normal'`;
}

const getFileListOrderBy = function (order = 'name', sort= 'desc'):string {
    const options = {
        'name':'file_name',
        'size': 'file_size',
        'type': 'file_mine_type',
        'date': 'file_modified'
    }

    return `ORDER BY ${options[order]} ${sort.toUpperCase()}`;
}

export const getFileList = async function ({page, pageSize, q, name, type, order, sort}):Promise<Result> {
    try {
        const total = await getFileTotal({q, name, type});
        const totalPage = Base.getTotalPage(total, pageSize);
        const orderby = getFileListOrderBy(order, sort);
        const join = name && type ? `JOIN cm_term_relationships ON  cm_term_relationships.object_id = cm_file.file_id
        JOIN cm_term_taxonomy ON cm_term_relationships.term_taxonomy_id = cm_term_taxonomy.term_taxonomy_id
        JOIN cm_terms ON cm_term_taxonomy.term_id = cm_terms.term_id`: '';
        const where = getFileListWhere({q, name, type});

        const sql = `SELECT * FROM cm_file ${join} WHERE ${where} ${orderby} LIMIT $page, $pageSize`;
       // console.log('sql',sql);
        const data: queryParam = {
            sql: sql,
            params: {
                $page:  Base.getPage(page, totalPage) * pageSize,
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
                page:  Base.getPage(page, totalPage) == totalPage ? totalPage :  Base.getPage(page, totalPage) + 1,
                pageSize: pageSize,
                total: total,
                totalPage: totalPage,
            },
            message:'success'
        }
    } catch (err) {
        console.log('err',err);
        return {code: 500, message: err};
    }
}

export const getFileList1 = async function ({keyword, page,pagesize}):Promise<Result> {
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
