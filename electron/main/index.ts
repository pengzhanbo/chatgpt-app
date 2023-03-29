import './preset'
import { BrowserWindow, app } from 'electron'
import { bootstrap } from './bootstrap'
import { setupChatGPT } from './chatgpt'
import { setupDarkMode } from './darkMode'
import { setupDatabase } from './database'
import { setupMarkdown } from './markdown'

// The built directory structure
//
// ├─┬ dist-electron
// │ ├─┬ main
// │ │ └── index.js    > Electron-Main
// │ └─┬ preload
// │   └── index.js    > Preload-Scripts
// ├─┬ dist
// │ └── index.html    > Electron-Renderer
//

async function main() {
  await Promise.all([
    setupDarkMode(),
    setupDatabase(),
    setupChatGPT(),
    setupMarkdown(),
    app.whenReady(),
  ])
  bootstrap()
}

process.nextTick(main)

app.on('second-instance', () => {
  const allWindows = BrowserWindow.getAllWindows()
  if (allWindows.length) {
    if (allWindows[0].isMinimized()) allWindows[0].restore()
    allWindows[0].focus()
  }
})

app.on('activate', () => {
  const allWindows = BrowserWindow.getAllWindows()
  if (allWindows.length) {
    allWindows[0].focus()
  } else {
    bootstrap()
  }
})
