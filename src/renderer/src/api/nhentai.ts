import axios from "axios";
import {Base,File} from "@renderer/utils";
import type {
    Result
} from "@renderer/utils/db/base";
import {isTermExist, increaseTerm, increaseTermRelationships} from "@renderer/api/terms";
import {insertFileMeta} from "@renderer/api/filemeta";

const options = {
    baseURL: 'https://nhentai.net/api',
    timeout: 5000,
}
const service = axios.create(options);

const getFileInfo = function (data:object, name:string):any {
    const reg = /[/\\?%*:|"<>]/g;

    for(let i in data) {
        for(let j in data[i].title) {
            if(Base.isEmpty(data[i].title[j])) {
                continue;
            }

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

    return {}
}


export const getNhentaiList = async function ({file_id, file_name}):Promise<Boolean> {
    try {
        const name = File.getFileAlias(file_name);
        const url = `/galleries/search?query=${name}&page=1&sort=date`
        const res = await service.get(url);
        if(res.status != 200) {
            return false;
        }

        if(Base.isEmpty(res.data) || Base.isEmpty(res.data.result)) {
            // const tags = [
            //     {name: "santa", type: "artist"},
            //     {name: "chinese", type: "language"}
            // ]
            // await batchInsertTermRelationships(file_id, tags);

            const tags = getTagsByTitle(file_name)
            await batchInsertTermRelationships(file_id, tags)
            return false
        }

        const {num_pages, per_page, result } = res.data;
        const info = getFileInfo(result, name);

        if(Base.isEmpty(info)) {
            return false;
        }


        const {id, title, tags} = info;
        await batchInsertTermRelationships(file_id, tags);
        await insertFileMeta({file_id: file_id, meta_key: 'id', meta_value:JSON.stringify({id:id,source:'nhentai'})});
        await insertFileMeta({file_id: file_id, meta_key: 'title', meta_value:JSON.stringify({title:title,source:'nhentai'})});
        return true
    } catch (err) {
        Base.printErrorLog('getNhentaiList',err);
        return false;
    }
}

const getTagsByTitle = function (title:string = ''):{name:string,type:string}[] {
    const tags = [];
    const artist = getArtistNameByTitle(title);
    const language = getLanguageByTitle(title)
    if(!Base.isEmpty(artist)) {
        tags.push( {name: artist, type: "artist"},)
    }

    if(!Base.isEmpty(language)) {
        tags.push( {name: language, type: "language"},)
    }

    return tags;
}

const getLanguageByTitle = function (title:string = ''):string {
    if(Base.isEmpty(title)) {
        return ''
    }

    title = title.toLowerCase();
    const data = ['chinese','english','japanese','korean']
    for(let i in data) {
        if(title.includes(`[${data[i]}]`) || title.includes(`(${data[i]})`)) {
            return data[i];
        }
    }

    return '';
}

const getArtistNameByTitle = function (title:string):string {
    const regex = /^\[(.+?)\](.+?)((\((.+?)\))|(\[(.+?)\]))*/i;
    if(regex.test(title) == false) {
        return '';
    }

    const end = title.indexOf(']');
    const name = title.slice(1,end);
    return getArtistAlias(name);
}

const getArtistAlias = function (artist:string):string {
    if(!artist.includes('(') && !artist.includes(')')) {
        return artist;
    }
    const begin = artist.indexOf('(')+1;
    const end = artist.indexOf(')');
    return artist.slice(begin,end);
}

const batchInsertTermRelationships = async function (object_id:number, tags:object):Promise<boolean> {
    if(Base.isEmpty(tags)) {
        return false;
    }

    for(let i in tags) {
        await insertTermRelationships(object_id, tags[i].name, tags[i].type);
    }

    return true
}

const insertTermRelationships = async function (object_id:number, name:string, taxonomy:string):Promise<Boolean> {
    try {
        const params = {name: name, taxonomy: taxonomy};
        const res = await isTermExist(params);
        if (res.code != 200) {
            return false;
        }

        let relationships:Result = {code: 500};
        if(res.data.length == 0) { //如果没有,插入数据, 添加关系,统计数+1
            relationships = await increaseTerm(object_id, name, taxonomy);
        } else {  //如果有,查看是否有关系,没有：添加关系，统计数+1; 有:不操作
            relationships = await increaseTermRelationships(object_id, name, taxonomy);
        }

        const {code} = relationships
        return code == 200 ? true : false;
    } catch (err) {
        return false;
    }
}

