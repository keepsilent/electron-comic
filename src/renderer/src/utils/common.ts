import {i18n} from '@renderer/locales';
import Base from '@renderer/utils/base';
import Config from '@renderer/utils/config';

import type {PageInter, ConfirmInter, EmptyInter} from "@renderer/utils/types";

const {t} = i18n.global;

const openFolder = function (type:string) {
    let path = ''
    switch (type) {
        case 'app':
            path = 'open app folder'
            break
        case 'cache':
            path = Config.getStoragePath()// 用于获取当前用户的主目录路径
            break
        case 'database':
            const os = require('os') as typeof import("os");
            path = os.homedir(); // 用于获取当前用户的主目录路径
            break
        default:
            break
    }

    window.electron.ipcRenderer.send('openpath', path);
}

/**
 * 显示提示框
 * @method showAlert
 * @param {Object} confirm
 * @param {String} content 提示内容
 * @param {String} title 提示标题
 * @param {String} confirmText 确认按钮文本
 * @param {String} callback 回调函数名称
 * @return Void
 */
const showAlert = function (confirm, content:string, title:string = '', confirmText:string = '', callback:string = ''):void {
    const object = {
        show: true,
        title: title || t('alert.default'),
        content: content,
        callback: callback,
        showCancel: false,
        cancelText: '',
        confirmText: confirmText || t('button.ok')
    }

    Object.assign(confirm,object)
}

/**
 * 显示同意框
 * @method showConfirm
 * @param {Object} confirm
 * @param {String} content 提示内容
 * @param {String} callback 回调函数名称
 * @param {String} title 提示标题
 * @param {String} confirmText 确认按钮文本
 * @param {String} cancelText 取消按钮文本
 */
const showConfirm = function (confirm, content:string, callback:string = '', title:string = '', confirmText:string = '', cancelText:string = ''):void {
    const object = {
        show: true,
        title: title || t('alert.default'),
        content: content,
        callback: callback,

        showCancel: true,
        cancelText: cancelText || t('button.cancel'),
        confirmText: confirmText || t('button.confirm')
    }

    Object.assign(confirm,object)
}

/**
 * 操作同意框
 * @method operateConfirm
 * @param {Object} confirm
 * @param {String} page
 */
const operateConfirm = function (confirm, page):boolean|void {
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
const cancelConfirm = function (confirm):void {
    confirm.show = false;
}

/**
 * 显示加载动画
 * @method showLoading
 * @param {PageInter} page
 */
const showLoading = function (page):void {
    page.loading = true
}

/**
 * 隐藏加载动画
 * @method hideLoading
 * @param {PageInter} page
 */
const hideLoading = function (page):void {
    page.loading = false
}

/**
 * 延时渲染页面
 * @method delayRenderPage
 * @param {PageInter} page
 */
const lazyRenderPage = function (page):void {
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
const setArchive = function (Archive):void {
    const options = {
        workerUrl: '/src/utils/libarchive.js/dist/worker-bundle.js?asset'
        //workerUrl: '../../dist/worker-bundle.js'
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
const showEmpty = function (empty,title:string, subtitle: string = '',icon:string='icon-file'):void {
    const object = {
        show: true,
        icon: icon,
        title: title,
        subtitle: subtitle || '',
    }
    Object.assign(empty,object)
}

/**
 * 隐藏空
 * @method showEmpty
 * @param {EmptyInter} empty
 */
const hideEmpty = function (empty):void {
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

/**
 * 获取布局类型
 * @param {String} type 布局类型
 * @param {String} prefix 样式前缀
 * @return {String}
 */
const getLayoutFold = function (type:string = '', prefix:string = ''):string {
    let fold = '';
    switch (type) {
        case 'one':
            fold = prefix+'__fold';
            break
        case 'two':
            fold = prefix+'__fold-2';
            break
    }

    return fold;
}

/**
 * 设置统计单位
 * @method setCountUnit
 * @param {Number} count
 * @return {String}
 */
const setCountUnit = function (count:number = 0):string {
    if(count < 1000) {
        return count.toString();
    }

    let num = count / 1000;
    if(Number.isInteger(num) == false) {
        num = Math.round(num * 10) / 10;
    }

    return `${num}k`;
}

export default {
    showEmpty: showEmpty,
    hideEmpty: hideEmpty,
    showLoading: showLoading,
    hideLoading: hideLoading,

    showAlert: showAlert,
    showConfirm: showConfirm,
    cancelConfirm: cancelConfirm,
    operateConfirm: operateConfirm,

    openFolder:openFolder,
    lazyRenderPage: lazyRenderPage,
    setArchive:setArchive,
    setCountUnit: setCountUnit,

    getLayoutFold: getLayoutFold,
    getDefaultImage: getDefaultImage
}
