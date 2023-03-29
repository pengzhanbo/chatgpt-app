import type { RouteRecordRaw } from 'vue-router'
import Chat from '~/pages/Chat.vue'
// import Home from '~/pages/Home.vue'
import Setting from '~/pages/Setting.vue'
export const routes = [
  {
    name: 'home',
    path: '/',
    // component: Home,
    redirect: '/chat',
  },
  {
    name: 'chat',
    path: '/chat/:id?',
    component: Chat,
  },
  {
    name: 'setting',
    path: '/setting',
    component: Setting,
  },
] as RouteRecordRaw[]
