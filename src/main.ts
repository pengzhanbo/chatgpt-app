import 'virtual:windi.css'
import 'katex/dist/katex.min.css'
import './styles/index.css'
import './styles/markdown.css'

import { createApp } from 'vue'
import App from './App.vue'
import { useAppConfig } from './composables/appConfig'
import { setupModules } from './modules'
import { router, setupRouter } from './router'
import { setupPinia } from './store'

async function bootstrap() {
  const { initAppConfig, appConfig } = useAppConfig()

  const app = createApp(App)

  await initAppConfig()

  setupPinia(app)
  setupRouter(app)
  setupModules(app, appConfig.value!)

  await router.isReady()
  app
    .mount('#app')
    .$nextTick(() => postMessage({ payload: 'removeLoading' }, '*'))
}

bootstrap()
