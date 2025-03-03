import {contextBridge, ipcRenderer} from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

export interface queryParam {
    sql: string;
    params?: any[];
}

export interface insertParam {
    table: string;
    data: { [key: string]: any };
}

export interface updateParam {
    table: string;
    data: { [key: string]: any };
    condition: string;
}

export interface deleteParam {
    table: string;
    condition: string;
}

// Custom APIs for renderer
const api = {
    sqQuery: (param: queryParam) => {
        return ipcRenderer.invoke('sqQuery', param)
    },
    sqInsert: (param: insertParam) => {
        return ipcRenderer.invoke('sqInsert', param)
    },
    sqUpdate: (param: updateParam) => {
        return ipcRenderer.invoke('sqUpdate', param)
    },
    sqDelete: (param: deleteParam) => {
        return ipcRenderer.invoke('sqDelete', param)
    }
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
    try {
        contextBridge.exposeInMainWorld('electron', electronAPI)
        contextBridge.exposeInMainWorld('api', api)
    } catch (error) {
        console.error(error)
    }
} else {
    // @ts-ignore (define in dts)
    window.electron = electronAPI
    // @ts-ignore (define in dts)
    window.api = api
}
