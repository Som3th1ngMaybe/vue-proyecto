/**
 * STORE: Usuarios (Pinia)
 * Gestiona la lista de usuarios del sistema y sus operaciones CRUD.
 */
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { usuariosService } from '@/services/api'

export const useUsuariosStore = defineStore('usuarios', () => {
  // ── State ──────────────────────────────────────────────
  const usuarios = ref([])
  const loading = ref(false)
  const error = ref(null)

  // ── Actions ────────────────────────────────────────────
  async function fetchAll() {
    loading.value = true
    error.value = null
    try {
      usuarios.value = await usuariosService.getAll()
    } catch (e) {
      error.value = e.message
    } finally {
      loading.value = false
    }
  }

  async function crear(data) {
    const res = await usuariosService.create(data)
    await fetchAll() // Re-fetch para obtener el usuario con ID asignado
    return res
  }

  async function actualizar(id, data) {
    const res = await usuariosService.update(id, data)
    await fetchAll()
    return res
  }

  async function eliminar(id) {
    await usuariosService.remove(id)
    usuarios.value = usuarios.value.filter((u) => u.id !== id)
  }

  return { usuarios, loading, error, fetchAll, crear, actualizar, eliminar }
})
