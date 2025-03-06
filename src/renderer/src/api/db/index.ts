import type { queryParam, insertParam, updateParam, deleteParam } from "./base";


const mode = import.meta.env.VITE_CURRENT_RUN_MODE;

const query = function (param: queryParam) {
    if(mode === 'render') {
        return window.electronAPI.sqQuery(param);
    }

    return import('./base').then((module) => module.sqQuery(param));
}


const insert = (param: insertParam) => {
    if(mode === 'render') {
        return window.electronAPI.sqInsert(param);
    }

    return import('./base').then((module) => module.sqInsert(param));
}

const update = (param: updateParam) => {
    if(mode === 'render') {
        return window.electronAPI.sqUpdate(param);
    }

    return import('./base').then((module) => module.sqUpdate(param));
}

const clean = (param: deleteParam) => {
    if(mode === 'render') {
        return window.electronAPI.sqDelete(param);
    }

    return import('./base').then((module) => module.sqDelete(param));
}

export default {
    query: query,
    insert: insert,
    update: update,
    delete: clean
}




