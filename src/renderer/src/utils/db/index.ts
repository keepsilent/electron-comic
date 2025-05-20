import type { queryParam, insertParam, updateParam, deleteParam } from "./base";

const mode = import.meta.env.VITE_CURRENT_RUN_MODE;
const query = function (param: queryParam) {
    if(mode === 'render') {
        //return window.electronAPI.sqQuery(param);
        return window.api.sqQuery(param);
    }

    return import('./base').then((module) => module.sqQuery(param));
}


const insert = (param: insertParam) => {
    if(mode === 'render') {
        return window.api.sqInsert(param);
    }

    return import('./base').then((module) => module.sqInsert(param));
}

const update = (param: updateParam) => {
    if(mode === 'render') {
        return window.api.sqUpdate(param);
    }

    return import('./base').then((module) => module.sqUpdate(param));
}

const transaction = (fn) => {
    if(mode === 'render') {
        return window.api.sqTransaction(fn);
    }

    return import('./base').then((module) => module.sqTransaction(fn));
}

const clean = (param: deleteParam) => {
    if(mode === 'render') {
        return window.api.sqDelete(param);
    }

    return import('./base').then((module) => module.sqDelete(param));
}

export default {
    query: query,
    insert: insert,
    update: update,
    delete: clean,
    transaction:transaction
}




