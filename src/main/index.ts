import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import { R2D2Model } from './model/R2D2Model'
import { R2D2 } from './model/R2D2ServerInterface'

function createWindow(): void {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
    let model = new R2D2Model()
    let res = model.load(`r2d2.trace "test.mlir" (%p0) {
  %0  = r2d2.loc [%p0:1:18] ()
  %1  = r2d2.loc [%p0:2:8]  ()
  %2  = r2d2.loc [%p0:3:8]  ()
  %3  = r2d2.loc [%p0:4:3]  ()
  %4  = r2d2.loc [%p0:1:1]  ()
  %5  = r2d2.loc [%p0:0:0]  ()
  %p1 = r2d2.pass "snap-pass1.mlir" (%p0)
  %6  = r2d2.loc [%p1:4:4] (%1, %2)
  %7  = r2d2.loc [%p1:5:4] (%3)
  %8  = r2d2.loc [%p1:3:2] (%4)
  %9  = r2d2.loc [%p1:2:0] (%5)
  %p2 = r2d2.pass "snap-pass2.mlir" (%p1)
  %10 = r2d2.loc [%p2:4:4] (%6)
  %11 = r2d2.loc [%p2:5:4] (%7)
  %12 = r2d2.loc [%p2:3:2] (%8)
  %13 = r2d2.loc [%p2:2:0] (%9)
}
`)
    res
      .then((succ) => {
        if (succ == 'success') {
          model
            .trace(
              {
                filename: 'snap-pass1.mlir',
                line: 4,
                column: 4
              },
              R2D2.TraceDirection.Backward
            )
            .then(console.log)
        }
      })
      .catch(console.error)
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
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
