import axios from "axios";
import {Base, DB, File, Time} from "@renderer/utils";
import {isTermExist, getTermByName, increaseTerm, increaseTermRelationships, removeTermRelationships} from "@renderer/api/terms";
import {isFileMetaExist,getFileMetaValue,updateFileMetaValue,addFileMeta} from "@renderer/api/filemeta";

const options = {
    baseURL: 'https://nhentai.net/api'
}
const service = axios.create(options);

const getFileInfo = function (data:object, name:string):object {
    const reg = /[/\\?%*:|"<>]/g;
    for(let i in data) {
        for(let j in data[i].title) {
            if(data[i].title[j] == name) {
                return data[i];
            }

            //移除文件夹不支持字符
            if(data[i].title[j].replaceAll(reg,'') == name.replaceAll(reg,'')) {
                return data[i];
            }

            //移除文件夹不支持字符 && 移除空格
            if(data[i].title[j].replaceAll(reg,'').replaceAll("\s*", "") == name.replaceAll(reg,'').replaceAll("\s*", "")) {
                return data[i];
            }
        }
    }

    return []
}


export const getNhentaiList = async function ({file_id, file_name}) {
    try {
        const name = File.getFileAlias(file_name);
        const url = `/galleries/search?query=${name}&page=1&sort=date`
        console.log('url',url);
        const res = await service.get(url);
        console.log(res);
        if(res.status != 200) {
            return false;
        }

        if(Base.isEmpty(res.data) || Base.isEmpty(res.data.result)) {
            return false
        }

        const {num_pages, per_page, result } = res.data;
        const info = getFileInfo(result, name);

        if(Base.isEmpty(info)) {
            return false;
        }

        const {id, title, tags} = info;
        await batchInsertTermRelationships(file_id, tags);
        await addFileMeta({file_id: file_id, meta_key: 'id', meta_value:JSON.stringify({id:id,source:'nhentai'})});
        await addFileMeta({file_id: file_id, meta_key: 'title', meta_value:JSON.stringify({title:title,source:'nhentai'})});
        console.log('info',info);
    } catch (err) {
        Base.printErrorLog('getNhentaiList',err);
    }
}

const batchInsertTermRelationships = async function (object_id:number, tags:object) {
    if(Base.isEmpty(tags)) {
        return false;
    }
    for(let i in tags) {
        await insertTermRelationships(object_id, tags[i].name, tags[i].type);
    }
}

const insertTermRelationships = async function (object_id:number, name:string, taxonomy:string):Promise<Boolean> {
    try {
        const params = {name: name, taxonomy: taxonomy};
        const res = await isTermExist(params);
        if (res.code != 200) {
            return false;
        }

        let relationships = { code: 500 };
        if(res.data.length == 0) { //如果没有,插入数据, 添加关系,统计数+1
            relationships = await increaseTerm(object_id, name, taxonomy);
        } else {  //如果有,查看是否有关系,没有：添加关系，统计数+1; 有:不操作
            relationships = await increaseTermRelationships(object_id, name, taxonomy);
        }

        return relationships.code == 200 ? true : false;
    } catch (err) {
        return false;
    }
}

