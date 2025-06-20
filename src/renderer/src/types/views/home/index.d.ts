import type {Page, File} from "@renderer/types/common";

interface Artist {
    name: string
}

interface FileItem extends File {
    file_cover: string,
    file_cover_options: {
        marginTop: string,
        marginLeft: string,
        width: string,
        height: string
    },
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

export interface LoadInter {
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

export interface ToolbarInter {
    view: {
        class: string,
        model: string
    }
}


export interface CoverInter {
    marginTop: string,
    marginLeft: string,
    width: string,
    height: string
}

