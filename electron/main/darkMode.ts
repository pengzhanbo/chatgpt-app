import { ipcMain, nativeTheme } from 'electron'
import { getAppConfig } from './appConfig'

export async function setupDarkMode() {
  ipcMain.handle('darkMode:update', (_, preference: AppConfig['preference']) =>
    updateNativeTheme(preference),
  )
  const { preference } = await getAppConfig()
  updateNativeTheme(preference)
}

function updateNativeTheme(preference: AppConfig['preference']) {
  nativeTheme.themeSource = preference
}
