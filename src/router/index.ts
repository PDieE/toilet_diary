import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '@/pages/home.vue'
import Stats from '@/pages/stats.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home,
  },
  {
    path: '/stats',
    name: 'stats',
    component: Stats,
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

export default router
