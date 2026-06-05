/**
 * ROUTER Vue Router 4
 * Define las rutas de la SPA y protege las que requieren autenticación.
 */
import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

// Lazy-load de vistas para mejor rendimiento
const LoginView      = () => import('@/views/LoginView.vue')
const DashboardView  = () => import('@/views/DashboardView.vue')
const EstacionesView = () => import('@/views/EstacionesView.vue')
const UsuariosView   = () => import('@/views/UsuariosView.vue')

const routes = [
  { path: '/',           redirect: '/estaciones' },
  { path: '/login',      name: 'login',      component: LoginView,      meta: { public: true } },
  { path: '/dashboard',  name: 'dashboard',  component: DashboardView,  meta: { requiresAuth: true } },
  { path: '/estaciones', name: 'estaciones', component: EstacionesView, meta: { public: true } },
  { path: '/usuarios',   name: 'usuarios',   component: UsuariosView,   meta: { requiresAuth: true, adminOnly: true } },
  // Fallback
  { path: '/:pathMatch(.*)*', redirect: '/estaciones' },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

// ── Navigation Guard ───────────────────────────────────────
router.beforeEach(async (to) => {
  const auth = useAuthStore()

  // Primera visita: verifica si hay sesión activa en el backend
  if (auth.user === null && !to.meta.public) {
    await auth.checkSession()
  }

  // Ruta pública: si ya está autenticado y es login, redirige al dashboard
  if (to.meta.public && auth.isLoggedIn && to.name === 'login') {
    return { name: 'dashboard' }
  }

  // Ruta que requiere autenticación
  if (to.meta.requiresAuth && !auth.isLoggedIn) {
    return { name: 'login' }
  }

  // Ruta solo-admin
  if (to.meta.adminOnly && !auth.isAdmin) {
    return { name: 'estaciones' }
  }

  return true
})

export default router
