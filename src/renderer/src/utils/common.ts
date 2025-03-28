import Base from '@renderer/utils/base';
import {i18n} from '@renderer/locales';
import type {PageInter, ConfirmInter, EmptyInter} from "@renderer/utils/types";

const { t } = i18n.global;



/**
 * 显示Alert
 * @method {showAlert}
 * @param {Object} confirm
 * @param {String} content 提示内容
 * @param {String} title 提示标题
 * @param {String} confirmText 按钮文本
 */
const showAlert = function (confirm:ConfirmInter, content:string, title:string, confirmText:string, callback:string = '') {
    confirm.show = true;
    confirm.title = title ?? t('alert.default');
    confirm.content = content;
    confirm.callback = callback;

    confirm.showCancel = false;
    confirm.cancelText = '';
    confirm.confirmText = confirmText ?? t('button.ok') ;
    // const object = {
    //     show: true,
    //     title: title,
    //     content: content,
    //     callback: callback,
    //     showCancel: false,
    //     cancelText: '',
    //     confirmText: confirmText
    // }
    //
    // Object.assign(confirm,object)
}

/**
 * 显示Confirm
 * @method {showConfirm}
 * @param {Object} that
 * @param {String} content 提示内容
 * @param {String} title 提示标题
 * @param {String} confirmText 按钮文本
 */
const showConfirm = function (confirm:ConfirmInter, content:string, callback:string= '', title:string, confirmText:string, cancelText:string):void {
    confirm.show = true;

    confirm.title = title ?? t('alert.default');
    confirm.content = content;
    confirm.callback = callback;

    confirm.showCancel = true;
    confirm.cancelText = cancelText ?? t('button.cancel');
    confirm.confirmText = confirmText ?? t('button.confirm');
}

const operateConfirm = function (confirm:ConfirmInter, page:PageInter):boolean {
    confirm.show = false;

    if(Base.isEmpty(confirm.callback)) {
        return false;
    }

    page.actions[confirm.callback]()
}

/**
 * 取消同意框
 * @method cancelConfirm
 * @param {ConfirmInter} confirm
 */
const cancelConfirm = function (confirm:ConfirmInter):void {
    confirm.show = false;
}


/**
 * 显示加载动画
 * @method showLoading
 * @param {PageInter} page
 */
const showLoading = function (page:PageInter):void {
    page.loading = true
}

/**
 * 隐藏加载动画
 * @method hideLoading
 * @param {PageInter} page
 */
const hideLoading = function (page:PageInter):void {
    page.loading = false
}


/**
 * 延时渲染页面
 * @method delayRenderPage
 * @param {PageInter} page
 */
const lazyRenderPage = function (page:PageInter):void {
    const time = import.meta.env.VITE_APP_DELAY_RENDER_TIME;
    setTimeout(() => {
        page.init = true
    },time)
}

/**
 * 设置存档
 * @method setArchive
 * @param {Archive} Archive
 */
const setArchive = function (Archive:Archive):void {
    const options = {
        workerUrl: '/src/utils/libarchive.js/dist/worker-bundle.js'
    }

    Archive.init(options);
}

/**
 * 显示空
 * @method showEmpty
 * @param {EmptyInter} empty
 * @param {String} icon
 * @param {String} title
 * @param {String} subtitle
 */
const showEmpty = function (empty:EmptyInter,title:string,subtitle: string,icon:string='icon-file'):void {

    const object = {
        show: true,
        icon: icon,
        title: title,
        subtitle: subtitle ?? '',
    }
    Object.assign(empty,object)
}

/**
 * 隐藏空
 * @method showEmpty
 * @param {EmptyInter} empty
 */
const hideEmpty = function (empty:EmptyInter,):void {

    const object = {
        show: false
    }
    Object.assign(empty,object)
}

/**
 * 获取默认图片
 * @method getDefaultImage
 * @param {String} type
 */
const getDefaultImage = function (type:string = ''):string {
    let img = '';
    switch (type) {
        default:
            img = new URL('@renderer/assets/images/common/default_cover.png', import.meta.url).href;
            break
    }

    return img;
}

export default {
    showLoading: showLoading,
    hideLoading: hideLoading,

    showAlert: showAlert,
    showConfirm: showConfirm,
    cancelConfirm: cancelConfirm,
    operateConfirm: operateConfirm,

    showEmpty: showEmpty,
    hideEmpty: hideEmpty,

    lazyRenderPage: lazyRenderPage,
    setArchive:setArchive,
    getDefaultImage: getDefaultImage,
}
