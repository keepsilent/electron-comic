
export const debounce = function (fn, delay = 300) {
    let timer = null;
    return function(...args) {
        timer && clearTimeout(timer);
        timer = setTimeout(() => {
            fn.apply(this, args);
        }, delay);
    }
}


export const throttle = (fn, delay = 300)=> {
    let timer = null
    return function(...args) {
        if (timer) {
            return
        }

        timer = setTimeout(() => {
            timer = null
        }, delay)

        fn.apply(this, args)
    }
}
