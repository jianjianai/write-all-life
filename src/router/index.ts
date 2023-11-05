import { createRouter, createWebHashHistory } from 'vue-router'


const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    { 
      path: '/', 
      component: () => import('@/views/HomeView.vue') 
    },
    { 
      path: '/about', 
      component: () => import('@/views/AboutView.vue') 
    },
    { 
      path: '/words', 
      component: () => import('@/views/WordsView.vue') 
    }
  ]
})

export default router
