import type {Page, File} from "@renderer/types/common";

export interface PageInter extends Page {
    upload: boolean
}

export interface TermInter {
    term_id:number,
    term_taxonomy_id:number,
    term_group:number,
    name:string,
    taxonomy:string,
    slug:string,
    parent:number,
    description:string,
    count:number
}

export interface SortInter {
    name:string,
    value:string,
    selected:boolean
}

export interface LoadInter {
    page:string,
    pageSize:number,
    list:{name:string,data:TermInter[]}[],
    popular:Term[],
    taxonomy:string,
    sort:string
}

export interface MenuInter {
    current:string,
    group:string,
    data: {
        name:string,
        value:string
    }[],
    sort: SortInter[]
}


export interface ParamsInter {
    page:string,
    pageSize:number,
    taxonomy:string,
    sort:string
}
