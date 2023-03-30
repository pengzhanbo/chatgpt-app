import './preset'
import { BrowserWindow, app } from 'electron'
import { bootstrap } from './bootstrap'
import { setupChatGPT } from './chatgpt'
import { setupDarkMode } from './darkMode'
import { setupDatabase } from './database'
import { setupMarkdown } from './markdown'

async function main() {
  await Promise.all([setupDatabase(), app.whenReady()])
  bootstrap()
  await setupDarkMode()
  await setupMarkdown()
  await setupChatGPT()
}

process.nextTick(main)

app.on('activate', () => {
  const allWindows = BrowserWindow.getAllWindows()
  if (allWindows.length) {
    allWindows[0].focus()
  } else {
    bootstrap()
  }
})
