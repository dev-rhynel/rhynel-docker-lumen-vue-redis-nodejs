import {createRouter, createWebHistory} from 'vue-router'
import HomeView from '../views/HomeView.vue'
import {useAccountStore} from '@/stores/account.store'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: {requiresAuth: true},
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
      meta: {requiresAuth: false},
    },
    {
      path: '/signup',
      name: 'signup',
      component: () => import('../views/Register.vue'),
      meta: {requiresAuth: false},
    },
    {
      path: '/posts',
      name: 'posts',
      component: () => import('../views/post/PostListView.vue'),
      // meta: {requiresAuth: true},
    },
    {
      path: '/posts/new',
      name: 'create-post',
      component: () => import('../views/post/ManagePostView.vue'),
      meta: {requiresAuth: true},
    },
    {
      path: '/posts/:id/edit',
      name: 'edit-post',
      component: () => import('../views/post/ManagePostView.vue'),
      meta: {requiresAuth: true},
    },
  ],
})

router.beforeEach((to, from, next) => {
  const accountStore = useAccountStore()
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const authRoutes = ['login', 'signup']

  if (requiresAuth && !accountStore.isAuthenticated) {
    next({name: 'login'})
  } else if (accountStore.isAuthenticated && authRoutes.includes(to.name as string)) {
    next({name: 'home'})
  } else {
    next()
  }
})

export default router
