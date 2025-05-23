export interface Page {
    init: boolean,
    actions: object
}

export interface File {
    file_id: number,
    file_date: string,
    file_modified: string,
    file_name: string,
    file_path: string,
    file_status: string,
    file_size: string,
    file_total: string,
    file_mine_type: string,
    file_view :number,
    file_intro: string,
}

export interface ConfirmInter {
    show: boolean,
    content: string,
    title?:string,
    callback?: string,
    showCancel?: boolean,
    cancelText?: string,
    confirmText?: string
}

export interface FileInter {
    file_id:number,
    file_cover?:string,
    file_date?: string,
    file_name?: string,
    file_alias?: string,
    file_author?: string,
    file_intro?: string,
    file_path?: string,
    file_size?: string,
    file_total?: number,
    file_status?: string,
    file_modified?: string,
    file_mine_type?: string,
    file_view?:number,
    file_tags?: { name:string, count:string}[],
    file_artists?: { name:string, count:string}[],
    file_languages?: { name:string, count:string}[],
    file_categories?: { name:string, count:string}[],
}


export interface EmptyInter {
    show: boolean,
    icon?: string,
    title?: string,
    subtitle?: string
}

export interface InterimInter {
    show?: boolean,
    space?: boolean
}

export interface switchInter {
    key:string,
    value: boolean
    options: any[]
}


export interface SelectInter {
    key: string,
    name: string,
    value: any,
    options: { name: string, value: any }[]
}
