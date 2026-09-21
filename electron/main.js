import { app, BrowserWindow, session, dialog } from 'electron'
import http from 'node:http'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const directory = path.dirname(fileURLToPath(import.meta.url))
const DEV_URL = process.env.ELECTRON_RENDERER_URL || 'http://127.0.0.1:5173'
let mainWindow

/**
 * Poll the Vite dev server using Node's http module (available before app.whenReady).
 * Resolves once the server responds, or rejects after the timeout.
 */
function waitForDevServer(url, timeoutMs = 30_000, intervalMs = 250) {
  return new Promise((resolve, reject) => {
    const deadline = Date.now() + timeoutMs
    const parsed = new URL(url)

    const attempt = () => {
      const req = http.get({ hostname: parsed.hostname, port: parsed.port, path: '/', timeout: 500 }, (res) => {
        res.resume() // drain response body
        resolve()
      })
      req.on('error', () => {
        if (Date.now() >= deadline) {
          reject(new Error(`Dev server at ${url} did not start within ${timeoutMs / 1000}s`))
        } else {
          setTimeout(attempt, intervalMs)
        }
      })
      req.on('timeout', () => {
        req.destroy()
        if (Date.now() >= deadline) {
          reject(new Error(`Dev server at ${url} timed out`))
        } else {
          setTimeout(attempt, intervalMs)
        }
      })
    }

    attempt()
  })
}

async function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1380,
    height: 940,
    minWidth: 800,
    minHeight: 650,
    title: 'Study Quest',
    icon: path.join(directory, '../public/icon.png'),
    backgroundColor: '#faf9f6',
    autoHideMenuBar: true,
    show: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: true,
      webSecurity: true,
    },
  })

  mainWindow.webContents.setWindowOpenHandler(() => ({ action: 'deny' }))
  mainWindow.webContents.on('will-navigate', (event) => event.preventDefault())
  mainWindow.once('ready-to-show', () => mainWindow?.show())
  mainWindow.on('closed', () => { mainWindow = null })

  if (!app.isPackaged) {
    // In dev mode, wait for Vite to be available before loading.
    await waitForDevServer(DEV_URL)
    await mainWindow.loadURL(DEV_URL)
  } else {
    await mainWindow.loadFile(path.join(directory, '../dist/index.html'))
  }
}

function showLaunchError(error) {
  console.error('Launch error:', error)
  dialog.showErrorBox('Study Quest could not open', error.message)
  app.quit()
}

// One running instance protects local progress from competing windows.
const gotLock = app.requestSingleInstanceLock()

if (!gotLock) {
  app.quit()
} else {
  app.on('second-instance', () => {
    if (mainWindow?.isMinimized()) mainWindow.restore()
    mainWindow?.show()
    mainWindow?.focus()
  })

  app.whenReady().then(async () => {
    session.defaultSession.setPermissionRequestHandler((_wc, _perm, cb) => cb(false))
    session.defaultSession.setPermissionCheckHandler(() => false)
    await createWindow()
    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) {
        createWindow().catch(showLaunchError)
      }
    })
  }).catch(showLaunchError)

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
  })
}
