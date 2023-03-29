import messages from '@intlify/unplugin-vue-i18n/messages'
import type { App } from 'vue'
import { createI18n } from 'vue-i18n'

export const installI18n = (app: App, appConfig: AppConfig) => {
  const i18n = createI18n({
    legacy: false,
    locale: appConfig.locale,
    fallbackLocale: appConfig.locale,
    messages,
  })

  app.use(i18n)
}
