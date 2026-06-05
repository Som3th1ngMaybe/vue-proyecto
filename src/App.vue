<script setup>
/**
 * App.vue — Componente raíz
 * Solo contiene el layout externo: navbar fija + router-view.
 * La lógica de negocio vive en las vistas y stores.
 */
import AppNavbar from '@/components/shared/AppNavbar.vue'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
</script>

<template>
  <!-- v-if: muestra navbar solo cuando hay sesión activa -->
  <AppNavbar v-if="auth.isLoggedIn" />

  <main :class="{ 'with-navbar': auth.isLoggedIn }">
    <!-- RouterView aplica transition entre vistas -->
    <RouterView v-slot="{ Component }">
      <Transition name="page" mode="out-in">
        <component :is="Component" />
      </Transition>
    </RouterView>
  </main>
</template>

<style scoped>
main {
  min-height: 100vh;
}
main.with-navbar {
  padding-top: 56px;
}

/* Transición de página */
.page-enter-active,
.page-leave-active {
  transition: opacity 0.18s ease, transform 0.18s ease;
}
.page-enter-from {
  opacity: 0;
  transform: translateY(6px);
}
.page-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}
</style>
