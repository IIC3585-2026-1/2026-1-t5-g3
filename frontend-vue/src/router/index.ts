import { createRouter, createWebHistory } from 'vue-router'
import { isAuthenticated } from '../stores/auth'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/HomeView.vue'),
    },
    {
      path: '/book/:id',
      name: 'book-detail',
      component: () => import('../views/BookDetailView.vue'),
    },
    {
      path: '/users/:id',
      name: 'profile',
      component: () => import('../views/ProfileView.vue'),
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
      meta: { guestOnly: true },
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/RegisterView.vue'),
      meta: { guestOnly: true },
    },
  ],
})

router.beforeEach((to) => {
  if (to.meta.guestOnly && isAuthenticated.value) {
    return { name: 'home' }
  }
})

export default router
