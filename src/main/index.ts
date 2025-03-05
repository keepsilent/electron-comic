import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'

const createWindow = function(): void {
    // Create the browser window.
    const mainWindow = new BrowserWindow({
        width: 662,
        height: 442,
        minWidth: 1165,
        minHeight: 678,

        frame: false, //无边框
        show: false, // 初始时不显示窗口
        autoHideMenuBar: true,// 自动隐藏菜单栏
        //...(process.platform === 'linux' ? { icon } : { icon: '../../resources/icon.ico?asset'}),
        icon: join(__dirname,'.../../resources/icon.png?asset'),
        webPreferences: {
            preload: join(__dirname, '../preload/index.js'), // 预加载脚本路径
            sandbox: false, // 禁用沙盒模式
            nodeIntegration: true,
            contextIsolation: false,
        }
    })

    mainWindow.webContents.openDevTools({mode:'detach'});

    // 当窗口准备好显示时，显示窗口
    mainWindow.on('ready-to-show', () => {
        mainWindow.show();
        //mainWindow.webContents.send('resize', mainWindow.getContentBounds())
    })

    // 拦截新窗口的打开请求，并在默认浏览器中打开 URL
    mainWindow.webContents.setWindowOpenHandler((details) => {
        shell.openExternal(details.url)
        return { action: 'deny' } // 拒绝在 Electron 窗口中打开新窗口
    })

    // 监听窗口发生变化
    mainWindow.on('resize', () => {
        mainWindow.webContents.send('maximize', mainWindow.isMaximized())
        mainWindow.webContents.send('resize', mainWindow.getContentBounds())
    })


    // 根据开发环境或生产环境加载不同的 URL
    // HMR for renderer base on electron-vite cli.
    // Load the remote URL for development or the local html file for production.
    if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
        mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
    } else {
        mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
    }

    // 监听ipcMain接收到的事件
    ipcMain.on('maximize', () => mainWindow.maximize())
    ipcMain.on('unmaximize', () => mainWindow.unmaximize())
    ipcMain.on('minimize', () => mainWindow.minimize())
    ipcMain.on('restore', () => mainWindow.restore())
    ipcMain.on('close', () => mainWindow.close())
    ipcMain.on('reset', () => {
        app.exit() //退出当前程序
        app.relaunch() //重新启动
    })

    ipcMain.on('openpath', (event,value) => {
        shell.openPath(value)
    })
}



// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
    // Set app user model id for windows
    electronApp.setAppUserModelId('com.electron')

    // Default open or close DevTools by F12 in development
    // and ignore CommandOrControl + R in production.
    // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
    app.on('browser-window-created', (_, window) => {
        optimizer.watchWindowShortcuts(window)
    })

    // IPC test
    ipcMain.on('ping', () => console.log('pong'))

    createWindow()

    app.on('activate', function () {
        // On macOS it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
