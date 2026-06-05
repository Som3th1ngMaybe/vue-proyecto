import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  server: {
    port: 5173,
    // Proxy: redirige /api y /login al backend Express en desarrollo
    // Así Vue en :5173 y Express en :3000 comparten cookies de sesión
    proxy: {
      '/api':     { target: 'http://localhost:3000', changeOrigin: true },
      '/login':   { target: 'http://localhost:3000', changeOrigin: true },
      '/logout':  { target: 'http://localhost:3000', changeOrigin: true },
    },
  },
})
