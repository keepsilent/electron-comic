import type {Page, File} from "@renderer/types/common";

interface Artist {
    name: string
}

interface FileItem extends File {
    file_cover: string,
    file_ext: string,
    file_artist: {
        status: string,
        data: Artist[],
        total: number
    }
}

export interface PageInter extends Page {
    upload: boolean
    options: {
        title?: boolean,
        cover?: boolean,
        artist?: boolean,
        date?: boolean,
        view?: boolean,
        type?: boolean,
        size?: boolean
    }
}

export interface loadInter {
    page: string,
    pageSize: string,
    list: FileItem[],
    order: {
        mode: string,
        sort:string
    },
    q?: string,
    name?: string
    taxonomy?: string
}


export interface LoadParamsInter {
    page: string,
    pageSize: number,
    q?:string,
    order?: {mode:string, sort:string},
    name?:string,
    taxonomy?:string
}


export interface PaginationRouterInter {
    path:string,
    query: {
        page: string,
        pageSize: string,
        q?:string,
        name?:string
        taxonomy?:string
    }
}

export interface toolbarInter {
    view: {
        class: string,
        model: string
    }
}

