import { app, BrowserWindow, net, ipcMain } from 'electron'
import { version } from 'punycode';

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`


const getBingImg = () => {
  const getBingImgApi = 'https://www.bing.com/HPImageArchive.aspx?format=js&idx=0&n=1'
  const request = net.request(getBingImgApi)
  request.on('response', (response) => {
      response.on('data', (chunk) => {
          console.log(`BODY: ${chunk}`)
      })
      response.on('end', () => {
          console.log('No more data in response.')
      })
  })
  request.end()
}

function createWindow() {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    height: 563,
    useContentSize: true,
    width: 800,
    minWidth: 300,
    minHeight: 400,
    titleBarStyle: 'hiddenInset',
  })

  mainWindow.loadURL(winURL)

  mainWindow.on('closed', () => {
    mainWindow = null
  })

  getBingImg()
  
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

ipcMain.on('sync-msg', (event, arg) => {
  console.log(arg +  + new Date())
  event.sender.send('sync-replay', 'b')
})

