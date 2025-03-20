export interface PageInter {
    init: boolean,
    loading: boolean,
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
