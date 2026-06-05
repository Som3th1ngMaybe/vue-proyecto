/**
 * Punto de entrada de la aplicación Vue.
 * Configura Pinia, Vue Router y monta el componente raíz.
 */
import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import './assets/main.css'

const app = createApp(App)

// Store global con Pinia
app.use(createPinia())

// Enrutador de la app
app.use(router)

// Monta el app en el DOM
app.mount('#app')
