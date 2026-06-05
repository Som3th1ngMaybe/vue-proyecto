<script setup>
/**
 * AppNavbar — Barra de navegación global
 * Demuestra: useRouter, useAuthStore, v-for sobre rutas, :class binding,
 *            computed, emit implícito por router-link
 */
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const route  = useRoute()
const auth   = useAuthStore()

// computed: construye las tabs según el rol del usuario
const tabs = computed(() => {
  const base = []
  // Solo usuarios autenticados ven DASHBOARD
  if (auth.isLoggedIn) {
    base.push({ name: 'dashboard', label: 'DASHBOARD' })
  }
  // Todos ven ESTACIONES
  base.push({ name: 'estaciones', label: 'ESTACIONES' })
  // Solo admins ven USUARIOS
  if (auth.isAdmin) base.push({ name: 'usuarios', label: 'USUARIOS' })
  return base
})

async function handleLogout() {
  await auth.logout()
  router.push({ name: 'login' })
}

function handleLogin() {
  router.push({ name: 'login' })
}
</script>

<template>
  <nav class="navbar">
    <span class="nav-brand">Estaciones Meteorologicas®</span>

    <!-- v-for sobre tabs computadas + :class dinámico por ruta activa -->
    <div class="nav-tabs">
      <RouterLink
        v-for="tab in tabs"
        :key="tab.name"
        :to="{ name: tab.name }"
        class="nav-tab"
        :class="{ active: route.name === tab.name }">
        {{ tab.label }}
      </RouterLink>
    </div>

    <!-- v-if: solo si hay usuario en sesión -->
    <div v-if="auth.user" class="nav-user">
      <span class="nav-username">{{ auth.username }}</span>
      <!-- :class binding según rol -->
      <span class="badge-role" :class="auth.isAdmin ? 'badge-admin' : 'badge-user'">
        {{ auth.user.role }}
      </span>
      <button class="btn btn-secondary btn-sm" @click="handleLogout">salir</button>
    </div>
    <!-- v-else: mostrar botón de login para invitados -->
    <div v-else>
      <button class="btn btn-primary btn-sm" @click="handleLogin">login</button>
    </div>
  </nav>
</template>

<style scoped>
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 56px;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 2rem;
  background: var(--bg-card);
  border-bottom: 1px solid var(--border);
}

.nav-brand {
  font-family: var(--mono);
  font-size: 0.85rem;
  color: var(--accent);
  letter-spacing: 0.08em;
  flex-shrink: 0;
}

.nav-tabs {
  display: flex;
  gap: 0.25rem;
}

.nav-tab {
  font-family: var(--mono);
  font-size: 0.72rem;
  letter-spacing: 0.06em;
  padding: 0.4rem 0.9rem;
  border-radius: 4px;
  cursor: pointer;
  color: var(--text-2);
  transition: all 0.15s;
  text-decoration: none;
}
.nav-tab:hover { color: var(--text-1); background: var(--bg-input); }
.nav-tab.active { background: var(--accent); color: var(--bg-deep); font-weight: 700; }

.nav-user {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  flex-shrink: 0;
}
.nav-username { font-family: var(--mono); font-size: 0.72rem; color: var(--text-2); }

.badge-role {
  padding: 0.15rem 0.5rem;
  border-radius: 3px;
  font-family: var(--mono);
  font-size: 0.65rem;
  font-weight: 700;
}
.badge-admin { background: var(--accent2); color: #fff; }
.badge-user  { background: var(--bg-input); color: var(--text-2); border: 1px solid var(--border); }

@media (max-width: 640px) {
  .navbar { padding: 0 1rem; }
  .nav-brand { display: none; }
}
</style>
