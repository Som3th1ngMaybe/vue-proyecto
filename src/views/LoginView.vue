<script setup>
/**
 * LoginView — Pantalla de inicio de sesión
 * Consume el store de auth para login.
 * Demuestra: v-model, @keyup.enter, :disabled, v-if/v-else, useRouter
 */
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const auth   = useAuthStore()

const username = ref('admin')
const password = ref('admin123')

async function handleLogin() {
  const ok = await auth.login({ username: username.value, password: password.value })
  if (ok) router.push({ name: 'dashboard' })
}
</script>

<template>
  <div class="login-wrap">
    <div class="login-card">
      <div class="login-logo">⚡ METEO_SYS</div>
      <p class="login-sub">Plataforma de datos meteorológicos</p>

      <!-- v-if: muestra error del store si existe -->
      <div v-if="auth.error" class="alert alert-error" style="margin-bottom:1.25rem">
        {{ auth.error }}
      </div>

      <div class="form-group" style="margin-bottom:1rem">
        <label class="form-label">USUARIO</label>
        <input
          v-model="username"
          class="form-input"
          type="text"
          placeholder="usuario"
          autocomplete="username"
        />
      </div>

      <div class="form-group" style="margin-bottom:1.5rem">
        <label class="form-label">CONTRASEÑA</label>
        <input
          v-model="password"
          class="form-input"
          type="password"
          placeholder="••••••••"
          autocomplete="current-password"
          @keyup.enter="handleLogin"
        />
      </div>

      <button
        class="btn btn-primary"
        style="width:100%"
        :disabled="auth.loading"
        @click="handleLogin"
      >
        <span v-if="auth.loading" class="spinner" style="width:14px;height:14px"></span>
        <span v-else>Iniciar sesión →</span>
      </button>

      <p class="login-hint">
        Credenciales por defecto: <code>admin / admin123</code>
      </p>
    </div>
  </div>
</template>

<style scoped>
.login-wrap {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-deep);
}

.login-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 2.5rem;
  width: 100%;
  max-width: 380px;
}

.login-logo {
  font-family: var(--mono);
  font-size: 1.1rem;
  color: var(--accent);
  margin-bottom: 0.4rem;
  letter-spacing: 0.05em;
}

.login-sub {
  font-size: 0.82rem;
  color: var(--text-2);
  margin-bottom: 2rem;
}

.login-hint {
  margin-top: 1rem;
  font-size: 0.72rem;
  color: var(--text-3);
  text-align: center;
  font-family: var(--mono);
}
.login-hint code {
  color: var(--text-2);
}
</style>
