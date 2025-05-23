import type {Page} from "@renderer/types/common";

export interface PageInter extends Page {
    keyword:string,
    setting:boolean,
    maximize: {name:string, value: string},
    layout: {
        prefix: string,
        fold: string
    }
}
