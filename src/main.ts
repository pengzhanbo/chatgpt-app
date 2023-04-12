import 'virtual:windi.css'
import 'katex/dist/katex.min.css'
import 'splitpanes/dist/splitpanes.css'
import './styles/index.css'
import './styles/markdown.css'

import { createApp } from 'vue'
import App from './App.vue'
import { useAppConfig } from './composables/appConfig'
import { setupDB } from './composables/db'
import { setupMarkdown } from './composables/markdown'
import { setupModules } from './modules'
import { router, setupRouter } from './router'
import { setupPinia } from './store'

async function bootstrap() {
  await setupDB()

  const { initAppConfig, appConfig } = useAppConfig()

  await initAppConfig()

  const app = createApp(App)

  setupPinia(app)
  setupRouter(app)
  setupModules(app, appConfig.value!)

  await setupMarkdown()
  await router.isReady()

  app.mount('#app')
}

bootstrap()
