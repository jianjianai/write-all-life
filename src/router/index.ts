import { createRouter, createWebHashHistory } from 'vue-router'


const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    { 
      path: '/', name:'HomeView',
      component: () => import('@/views/HomeView.vue') 
    },
    { 
      path: '/about', name:"AboutView",
      component: () => import('@/views/AboutView.vue') 
    },
    { 
      path: '/library',name:"LibrarysView", 
      component: () => import('@/views/LibrarysView.vue') 
    },{
      path:'/library/:libraryid([0-9]+)',name:"LibraryView",
      component:()=> import('@/views/LibraryView.vue')
    }
  ]
})

export default router
