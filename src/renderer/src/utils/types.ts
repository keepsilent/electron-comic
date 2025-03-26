export interface PageInter {
    show?: boolean,
    init?: boolean,
    loading?: boolean,
    actions?: object
}

export interface ConfirmInter {
    show:boolean,
    content: string,
    title?:string,
    callback?: string,
    showCancel?: boolean,
    cancelText?: string,
    confirmText?: string
}


export interface FileInter {
    id:number,
    date: string,
    modified:string,
    name: string,
    author: string,
    type: string,
    path: string,
    size:number,
    total:number,
    status: string
}
