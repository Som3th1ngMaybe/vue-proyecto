/**
 * STORE: Auth (Pinia)
 * Estado global de autenticación: usuario activo, login, logout.
 * Consumido por el router guard y los componentes de navegación.
 */
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authService } from '@/services/api'

export const useAuthStore = defineStore('auth', () => {
  // ── State ──────────────────────────────────────────────
  const user = ref(null)   // { id, username, email, role }
  const loading = ref(false)
  const error = ref(null)

  // ── Getters (computed) ─────────────────────────────────
  const isLoggedIn = computed(() => user.value !== null)
  const isAdmin = computed(() => user.value?.role === 'admin')
  const username = computed(() => user.value?.username ?? '')

  // ── Actions ────────────────────────────────────────────
  async function login(credentials) {
    loading.value = true
    error.value = null
    try {
      const data = await authService.login(credentials)
      user.value = data.user
      return true
    } catch (e) {
      error.value = e.message
      return false
    } finally {
      loading.value = false
    }
  }

  async function logout() {
    await authService.logout().catch(() => {})
    user.value = null
    error.value = null
  }

  // Verifica si hay sesión activa al montar la app (F5 / reentrada)
  async function checkSession() {
    try {
      const data = await authService.getSession()
      user.value = data || null
    } catch {
      user.value = null
    }
  }

  function clearError() {
    error.value = null
  }

  return { user, loading, error, isLoggedIn, isAdmin, username, login, logout, checkSession, clearError }
})
