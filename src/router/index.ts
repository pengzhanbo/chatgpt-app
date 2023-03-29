import type { App } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router'
import { routes } from './routes'

export const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

export const setupRouter = (app: App) => {
  app.use(router)
}
