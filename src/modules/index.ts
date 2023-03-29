import type { App } from 'vue'
import { installI18n } from './i18n'
import { installNaiveUI } from './naiveui'

export const setupModules = (app: App, appConfig: AppConfig) => {
  installNaiveUI()
  installI18n(app, appConfig)
}
