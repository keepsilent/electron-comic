import type {
    queryParam,
    insertParam,
    updateParam,
    deleteParam,
    Result
} from "@renderer/utils/db/base";
import {Alphabet, Base, DB, Time} from "@renderer/utils";


export const isTermExist = async function ({name,taxonomy}):Promise<Result> {
    const sql = `SELECT * FROM cm_terms JOIN cm_term_taxonomy ON cm_terms.term_id = cm_term_taxonomy.term_id WHERE name = $name AND taxonomy = $taxonomy LIMIT 1`;
    const data:queryParam = {
        sql: sql,
        params: {$name: name, $taxonomy:taxonomy}
    }
    return await DB.query(data);
}

export const isTermExistById = async function ({term_taxonomy_id}):Promise<Result> {
    const sql = `SELECT * FROM cm_terms JOIN cm_term_taxonomy ON cm_terms.term_id = cm_term_taxonomy.term_id WHERE term_taxonomy_id = $term_taxonomy_id LIMIT 1`;
    const data:queryParam = {
        sql: sql,
        params: {$term_taxonomy_id: term_taxonomy_id}
    }
    return await DB.query(data);
}

export const isRelationshipsExist = async function ({object_id,term_taxonomy_id}):Promise<Result> {
    const sql = `SELECT * FROM cm_term_relationships WHERE object_id = $object_id AND term_taxonomy_id = $term_taxonomy_id LIMIT 1`;
    const data:queryParam = {
        sql: sql,
        params: {$object_id: object_id, $term_taxonomy_id:term_taxonomy_id}
    }
    return await DB.query(data);
}

export const getTermByName = async function ({name, taxonomy}):Promise<Result> {
    const sql = `SELECT * FROM cm_terms JOIN cm_term_taxonomy ON cm_terms.term_id = cm_term_taxonomy.term_id WHERE name = $name AND taxonomy = $taxonomy LIMIT 1`;
    const data:queryParam = {
        sql: sql,
        params: {$name: name, $taxonomy:taxonomy}
    }
    return await DB.query(data);
}

export const getTermRelationships  = async function ({object_id}):Promise<Result> {
    const sql = `SELECT * FROM cm_term_relationships  WHERE object_id = $object_id`;
    const data:queryParam = {
        sql: sql,
        params: {$object_id: object_id }
    }
    return await DB.query(data);
}

const getTermTotal = async function ({taxonomy}):Promise<number> {
    try {
        const sql = `SELECT count(*) AS total FROM cm_terms JOIN cm_term_taxonomy ON cm_terms.term_id = cm_term_taxonomy.term_id WHERE taxonomy = $taxonomy AND count > 0 LIMIT 1`;
        const data: queryParam = {
            sql: sql,
            params: {
                $taxonomy: taxonomy
            }
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

export const getTermList = async function ({page, pageSize, taxonomy, sort}):Promise<Result> {
    try {
        const total = await getTermTotal({taxonomy: taxonomy});
        const totalPage = Base.getTotalPage(total, pageSize);
        const orderby = sort == 'popular' ? 'count DESC': 'term_group ASC, name ASC'
        const sql = `SELECT * FROM cm_terms JOIN cm_term_taxonomy ON cm_terms.term_id = cm_term_taxonomy.term_id WHERE taxonomy = $taxonomy AND count > 0 ORDER BY ${orderby} LIMIT $page, $pageSize`;
        const data: queryParam = {
            sql: sql,
            params: {
                $page: Base.getPage(page, totalPage) * pageSize,
                $pageSize: pageSize,
                $taxonomy: taxonomy
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
                page: Base.getPage(page, totalPage) == totalPage ? totalPage : Base.getPage(page, totalPage) + 1,
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

export const getTermGroupFristRcord = async function ({taxonomy, group}):Promise<Result> {
    const sql = `SELECT name FROM cm_terms JOIN cm_term_taxonomy ON cm_terms.term_id = cm_term_taxonomy.term_id WHERE taxonomy = $taxonomy AND term_group = $group ORDER BY name ASC LIMIT 1`;
    const data: queryParam = {
        sql: sql,
        params: {
            $group: group,
            $taxonomy: taxonomy
        }
    }
    return await DB.query(data);
}

export const getTermGroupFristRcordPosition = async function ({taxonomy, name}):Promise<Result> {
    const sql = `SELECT count(*) AS total FROM (SELECT * FROM cm_terms JOIN cm_term_taxonomy ON cm_terms.term_id = cm_term_taxonomy.term_id WHERE taxonomy = $taxonomy AND count > 0 ORDER BY name ASC) AS tmp WHERE tmp.name <= $name`;
    const data: queryParam = {
        sql: sql,
        params: {
            $name: name,
            $taxonomy: taxonomy
        }
    }
    return await DB.query(data);
}

export const updateTaxonomyCount = async function ({term_taxonomy_id, count}):Promise<Result> {
    const data:queryParam = {
        table: 'cm_term_taxonomy',
        data: {
            'count': count
        },
        condition: `term_taxonomy_id = ${term_taxonomy_id}`
    }

    return await DB.update(data);
}

export const addTerm = async function (data:{ [key: string]: any }):Promise<Result> {
    const params:insertParam = {
        table: 'cm_terms',
        data: data
    }

    return await DB.insert(params);
}

export const addTermTaxonomy = async function (data:{ [key: string]: any }):Promise<Result> {
    const params:insertParam = {
        table: 'cm_term_taxonomy',
        data: data
    }

    return await DB.insert(params);
}

export const addTermRelationships = async function (data:{ [key: string]: any }):Promise<Result> {
    const params:insertParam = {
        table: 'cm_term_relationships',
        data: data
    }

    return await DB.insert(params);
}

const addTermRecord = async function (name:string):Promise<Number> {
    try {
        const params = {name: name, term_group: Alphabet.getFirstCharMatchAscii(name)}
        const res = await addTerm(params);
        if(res.code != 200) {
            return 0
        }

        return res.data;
    } catch (err) {
        Base.printErrorLog('addTerm',err);
        return 0;
    }
}

const addTermTaxonomyRecord = async function (term_id:number, taxonomy:string):Promise<Number>{
    try {
        const params = {term_id: term_id, taxonomy: taxonomy}
        const res = await addTermTaxonomy(params);
        if(res.code != 200) {
            return 0
        }

        return res.data;
    } catch (err) {
        Base.printErrorLog('addTermTaxonomy',err);
        return 0;
    }
}

const addTermRelationshipsRecord = async function (object_id:number, term_taxonomy_id:number):Promise<Boolean>{
    try {
        const params = {object_id: object_id, term_taxonomy_id: term_taxonomy_id}
        const res = await addTermRelationships(params);
        if(res.code != 200) {
            return false
        }

        return true
    } catch (err) {
        Base.printErrorLog('addTermRelationships',err);
        return false
    }
}

const updateTaxonomyCountRecord = async function (term_taxonomy_id:number, count:number):Promise<Boolean>{
    try {
        const params = {term_taxonomy_id: term_taxonomy_id, count: count}
        const res = await updateTaxonomyCount(params);
        if(res.code != 200) {
            return false
        }

        return true
    } catch (err) {
        Base.printErrorLog('updateTaxonomyCountRecord',err);
        return false
    }
}

export const increaseTerm = async function (object_id:number, name:string, taxonomy:string):Promise<Boolean> {
    return await DB.transaction(async () => {
        try {
            const params = {name: name, taxonomy: taxonomy};
            const res = await isTermExist(params);
            if (res.code != 200 || res.data.length >= 1) {
                return false;
            }

            const term_id = await addTermRecord(name);
            if (term_id == 0) {
                return false;
            }

            const term_taxonomy_id = await addTermTaxonomyRecord(term_id, taxonomy);
            if (term_taxonomy_id == 0) {
                return false;
            }

            const relationships = await addTermRelationshipsRecord(object_id, term_taxonomy_id);
            if (relationships == false) {
                return false;
            }

            return updateTaxonomyCountRecord(term_taxonomy_id, 1);
        } catch (err) {
            Base.printErrorLog('increaseTerm',err)
            return false;
        }
    });
}

export const increaseTermRelationships = async function (object_id:number, name:string, taxonomy:string):Promise<Boolean> {
    return await DB.transaction(async () => {
        try {
            const params = {name: name, taxonomy: taxonomy};
            const res = await isTermExist(params);

            if(res.code != 200 || res.data.length == 0) {
                return false;
            }

            const [term] = res.data;
            const {term_taxonomy_id, count} = term;
            const relationships = await isRelationshipsExist({object_id: object_id, term_taxonomy_id: term_taxonomy_id});
            if(relationships.code != 200) {
                return false;
            }

            if(relationships.data.length >= 1) { //已绑定过关系,无须再操作
                return true
            }

            //没有绑定关系,添加关系 && count+1
            const success = await addTermRelationshipsRecord(object_id, term_taxonomy_id);
            if(success == false) {
                return false;
            }
            return updateTaxonomyCountRecord(term_taxonomy_id, count + 1);
        } catch (err) {
            Base.printErrorLog('increaseTermRelationships',err)
            return false
        }
    });
}

export const deleteTermRelationships = async function ({object_id, term_taxonomy_id}):Promise<Result> {
    const data:deleteParam = {
        table: 'cm_term_relationships',
        condition: `object_id = ${object_id} AND term_taxonomy_id = '${term_taxonomy_id}'`
    }

    return await DB.delete(data);
}

export const runRemoveTermRelationships = async function (object_id:number, term_taxonomy_id:number):Promise<Boolean> {
    try {
        const params = {term_taxonomy_id: term_taxonomy_id};
        const res = await isTermExistById(params);
        if(res.code != 200 || res.data.length == 0) {
            return false;
        }

        const relationships = await isRelationshipsExist({object_id: object_id, term_taxonomy_id: term_taxonomy_id});
        if(relationships.code != 200) {
            return false;
        }

        if(relationships.data.length == 0) {
            return false;
        }

        const [term] = res.data;
        const {count} = term;
        const success = await deleteTermRelationships({object_id, term_taxonomy_id});
        if(success.code != 200) {
            return false;
        }

        return updateTaxonomyCountRecord(term_taxonomy_id, count - 1 < 0 ? 0 : count - 1);
    } catch (err) {
        Base.printErrorLog('removeTermRelationships',err)
        return false
    }
}

export const removeTermRelationships = async function (object_id:number, term_taxonomy_id:number):Promise<Boolean> {
    return await DB.transaction(async () => {
        return await runRemoveTermRelationships(object_id, term_taxonomy_id);
    });
}
