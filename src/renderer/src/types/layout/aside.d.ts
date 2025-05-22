import type {Page} from "@renderer/types/common";

export interface PageInter extends Page {
    file: {
        id: string
    }
}

export interface MenuInter {
    current: number,
    data: {
        name:string,
        key:string,
        url:string
        icon:string
    }[]
}

export interface BannerInter {
    name: string,
    image: string,
    url: string
}

export interface UserInter {
    nicename: string,
    avatar: string
}

export interface AsideInter {
    layout:string
    prefix: string,
    fold:string
}
