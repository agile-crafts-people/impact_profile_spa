import { createRouter, createWebHistory } from 'vue-router'
import { useAuth, hasStoredRole } from '@/composables/useAuth'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: '/profiles'
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import('@/pages/LoginPage.vue'),
      meta: { requiresAuth: false }
    },
    
    // Control domain: Profile
    {
      path: '/profiles',
      name: 'Profiles',
      component: () => import('@/pages/ProfilesListPage.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/profiles/new',
      name: 'ProfileNew',
      component: () => import('@/pages/ProfileNewPage.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/profiles/:id',
      name: 'ProfileEdit',
      component: () => import('@/pages/ProfileEditPage.vue'),
      meta: { requiresAuth: true }
    },
    
    // Control domain: Platform
    {
      path: '/platforms',
      name: 'Platforms',
      component: () => import('@/pages/PlatformsListPage.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/platforms/new',
      name: 'PlatformNew',
      component: () => import('@/pages/PlatformNewPage.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/platforms/:id',
      name: 'PlatformEdit',
      component: () => import('@/pages/PlatformEditPage.vue'),
      meta: { requiresAuth: true }
    },
    
    // Control domain: User
    {
      path: '/users',
      name: 'Users',
      component: () => import('@/pages/UsersListPage.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/users/new',
      name: 'UserNew',
      component: () => import('@/pages/UserNewPage.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/users/:id',
      name: 'UserEdit',
      component: () => import('@/pages/UserEditPage.vue'),
      meta: { requiresAuth: true }
    },
    
    
    
    // Consume domain: Identity
    {
      path: '/identitys',
      name: 'Identitys',
      component: () => import('@/pages/IdentitysListPage.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/identitys/:id',
      name: 'IdentityView',
      component: () => import('@/pages/IdentityViewPage.vue'),
      meta: { requiresAuth: true }
    },
    
    // Admin route
    {
      path: '/admin',
      name: 'Admin',
      component: () => import('@/pages/AdminPage.vue'),
      meta: { requiresAuth: true, requiresRole: 'admin' }
    }
  ]
})

router.beforeEach((to, _from, next) => {
  const { isAuthenticated } = useAuth()
  
  // Check authentication
  if (to.meta.requiresAuth && !isAuthenticated.value) {
    next({ name: 'Login', query: { redirect: to.fullPath } })
    return
  }
  
  // Check role-based authorization
  const requiredRole = to.meta.requiresRole as string | undefined
  if (requiredRole && !hasStoredRole(requiredRole)) {
    // Redirect to default page if user doesn't have required role
    next({ name: 'Profiles' })
    return
  }
  
  next()
})

router.afterEach((to) => {
  document.title = to.path === '/login' ? 'Creators Dashboard Login' : 'Profile'
})

export default router