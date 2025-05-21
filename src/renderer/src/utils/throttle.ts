
export const debounce = (fn, delay = 300) => {
    let timer:any = null;
    return (...args) => {
        timer && clearTimeout(timer);
        timer = setTimeout(() => {
            fn.apply(this, args);
        }, delay);
    }
}


export const throttle = (fn, delay = 300)=> {
    let timer:any = null
    return (...args:any) => {
        if (timer) {
            return
        }

        timer = setTimeout(() => {
            timer = null
        }, delay)

        fn.apply(this, args)
    }
}
