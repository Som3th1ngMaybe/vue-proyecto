/**
 * CAPA DE SERVICIO — API
 * Centraliza todas las llamadas HTTP al backend Express.
 * El frontend Vue corre en :5173 (Vite dev) y el backend en :3000.
 * En producción ambos comparten el mismo origen.
 */

const BASE_URL = import.meta.env.VITE_API_URL ?? ''

// Helper interno: hace fetch, lanza error si !ok
async function request(method, path, body = null) {
  const options = {
    method,
    credentials: 'include', // Envía cookie de sesión en dev/prod
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
  }
  if (body) options.body = JSON.stringify(body)

  const res = await fetch(`${BASE_URL}${path}`, options)
  const data = await res.json()

  if (!res.ok) {
    // Lanza el mensaje de error que viene del backend
    throw new Error(data.error || data.message || `Error ${res.status}`)
  }
  return data
}

// ── Auth ───────────────────────────────────────────────────
export const authService = {
  login: (credentials) => request('POST', '/login', credentials),
  logout: () => request('GET', '/logout'),
  getSession: () => request('GET', '/api/v1/session'),
}

// ── Estaciones ─────────────────────────────────────────────
export const estacionesService = {
  getAll: () => request('GET', '/api/v1/estaciones'),
  getById: (id) => request('GET', `/api/v1/estaciones/${id}`),
  create: (data) => request('POST', '/api/v1/estaciones', data),
  update: (id, data) => request('PUT', `/api/v1/estaciones/${id}`, data),
  remove: (id) => request('DELETE', `/api/v1/estaciones/${id}`),
}

// ── Usuarios ───────────────────────────────────────────────
export const usuariosService = {
  getAll: () => request('GET', '/api/v1/usuarios'),
  create: (data) => request('POST', '/api/v1/usuarios', data),
  update: (id, data) => request('PUT', `/api/v1/usuarios/${id}`, data),
  remove: (id) => request('DELETE', `/api/v1/usuarios/${id}`),
}
