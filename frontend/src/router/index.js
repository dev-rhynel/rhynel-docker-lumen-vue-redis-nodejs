import { createRouter, createWebHistory } from 'vue-router'
import { useSession } from '@/composables/useSession'
import {useAccountStore} from '@/stores/account.store'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/dashboard'
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/LoginView.vue'),
      meta: { requiresAuth: false }
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('@/views/RegisterView.vue'),
      meta: { requiresAuth: false }
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('@/views/DashboardView.vue'),
      meta: { requiresAuth: true }
    }
  ]
})

// Navigation guard
router.beforeEach((to, from, next) => {
  const { getSessionToken } = useSession()
  const {isAuthenticated} = useAccountStore()
  const token = getSessionToken()

  // Redirect to dashboard if trying to access login/register while authenticated
  if ((to.name === 'login' || to.name === 'register') && (token || isAuthenticated)) {
    next('/dashboard')
    return
  }

  // Redirect to login if trying to access protected route while not authenticated
  if (to.meta.requiresAuth && !token && !isAuthenticated) {
    next('/login')
    return
  }

  next()
})

export default router
