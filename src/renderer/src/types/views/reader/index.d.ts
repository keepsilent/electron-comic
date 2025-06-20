import type {Page, File} from "@renderer/types/common";

export interface PageInter extends Page {
    loading: boolean,
    edit: boolean,
    upload: boolean,
    layout: string,
    cover: {
        width: string,
        height: string
    }
}

export interface FileInter extends File {
    file_cover?: string,
    file_alias?: string,
    file_ext?: string,

    file_tags?: { name:string, count:number}[],
    file_artists?: { name:string, count:number}[],
    file_languages?: { name:string, count:number}[],
    file_categories?: { name:string, count:number}[],
}

export interface ThumbnailInter {
    name:string,
    cover:string,
    alias:string,
    origin: { type: string, width: string, height: string}
    width:number,
    height:number
    status:string
}

export interface SettingsInter {
    page: {
        show: boolean,
        num: number,
        total: number,
        layout: string
    },
    scrollTop: number,
    zoom: number,
    space: number
    thumbnail: { index:string,width:string,height:string }[],
}


export interface MetaInter {
    id: { show: boolean, id: number, source: string},
    title: {show: boolean, title: string, source: string},
}


export interface CoverInter {
    width: string,
    height: string
}
