import { createPinia } from 'pinia'
import type { App } from 'vue'

const store = createPinia()

export const setupPinia = (app: App) => {
  app.use(store)
}

export { store }
