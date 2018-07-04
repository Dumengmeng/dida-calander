import { app, BrowserWindow, net, ipcMain, Tray, Menu } from 'electron'
import { version } from 'punycode';


const path = require('path')

// 设置右键任务栏图标展示的操作
app.setUserTasks([{
    program: process.execPath,
    arguments: '--new-window',
    iconPath: process.execPath,
    iconIndex: 0,
    title: 'New Window',
    description: 'create a new window'
}])

const trayMenuTemplate = [{
    label: '设置',
    click: function() {
        alert('setting window')
    }
}, {
    label: '关于',
    click: function() {
        alert('hi')
    }
}]

const menuList = [{
        label: 'Dida',
        submenu: [{
            label: 'about',
            click() { require('electron').shell.openExternal('https://electronjs.org') }
        }]
    },
    {
        label: 'View',
        submenu: [
            { role: 'reload' },
            { role: 'forcereload' },
            { role: 'toggledevtools' },
            { type: 'separator' },
            { role: 'resetzoom' },
            { role: 'zoomin' },
            { role: 'zoomout' },
            { type: 'separator' },
            { role: 'togglefullscreen' }
        ]
    },
    {
        role: 'window',
        submenu: [
            { role: 'minimize' },
            { role: 'close' }
        ]
    },
    {
        role: 'help',
        submenu: [{
            label: 'Learn More',
            click() { require('electron').shell.openExternal('https://electronjs.org') }
        }]
    }
]

const menu = Menu.buildFromTemplate(menuList)
Menu.setApplicationMenu(menu)

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
    global.__static = path.join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
const winURL = process.env.NODE_ENV === 'development' ?
    `http://localhost:9080` :
    `file://${__dirname}/index.html`

function createWindow() {
    /**
     * Initial window options
     */
    mainWindow = new BrowserWindow({
        show: false,
        useContentSize: true,
        height: 500,
        width: 600,
        minHeight: 460,
        minWidth: 470,
        titleBarStyle: 'hiddenInset',
        backgroundColor: '#ccc',
        webPreferences: {
            webSecurity: false, // 禁用同源策略
            // devTools: false,
        },
        // icon: path.join(__dirname, '/static/images/dida_icon.png'),
    })

    mainWindow.once('ready-to-show', () => {
        mainWindow.show()
    })

    mainWindow.loadURL(winURL)

    mainWindow.on('closed', () => {
        mainWindow = null
    })

    // 设置托盘图标
    let tray = new Tray(path.join('./static/images/dida_icon.png'))
    const contextMenu = Menu.buildFromTemplate(trayMenuTemplate)
    tray.setToolTip('滴答日历')
    tray.setContextMenu(contextMenu)

    // 设置缩略图工具栏
    // mainWindow.setThumbarButtons([{
    //     tooltip: 'date',
    //     icon: path.join('./static/images/dida_icon.png'),
    //     click() {
    //         console.log(123)
    //     }
    // }])

    // 任务栏闪烁框
    mainWindow.once('focus', () => {
        mainWindow.flashFrame(false)
    })
    mainWindow.flashFrame(true)

}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    if (mainWindow === null) {
        createWindow()
    }
})