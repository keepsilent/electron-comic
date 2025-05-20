export interface PageInter {
    show?: boolean,
    init?: boolean,
    loading?: boolean,
    upload?: boolean
    layout?: string,
    aside?: string,
    actions?: object
}

export interface ConfirmInter {
    show: boolean,
    content?: string,
    title?:string,
    callback?: string,
    showCancel?: boolean,
    cancelText?: string,
    confirmText?: string
}


export interface FileInter {
    file_id:number|null,
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
    file_mine_type?: string
}


export interface EmptyInter {
    icon: string,
    title: string,
    subtitle?: string
}

export interface InterimInter {
    show?:boolean,
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
