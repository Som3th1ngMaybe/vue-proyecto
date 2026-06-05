/**
 * STORE: Estaciones (Pinia)
 * Gestiona el estado de registros meteorológicos: lista, CRUD, filtros.
 */
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { estacionesService } from '@/services/api'

export const useEstacionesStore = defineStore('estaciones', () => {
  // ── State ──────────────────────────────────────────────
  const registros = ref([])
  const loading = ref(false)
  const error = ref(null)
  const filtroEstacionId = ref('')

  // ── Getters ────────────────────────────────────────────
  const filtrados = computed(() => {
    if (!filtroEstacionId.value) return registros.value
    return registros.value.filter((r) => r.estacion_id === filtroEstacionId.value)
  })

  const totalRegistros = computed(() => registros.value.length)

  const promedioTemp = computed(() => {
    if (!registros.value.length) return null
    const sum = registros.value.reduce((s, r) => s + r.temperatura_c, 0)
    return (sum / registros.value.length).toFixed(1)
  })

  const tempMaxima = computed(() => {
    if (!registros.value.length) return null
    return Math.max(...registros.value.map((r) => r.temperatura_c)).toFixed(1)
  })

  const estacionesUnicas = computed(() => new Set(registros.value.map((r) => r.estacion_id)).size)

  const ultimosRegistros = computed(() => [...registros.value].reverse().slice(0, 5))

  // ── Actions ────────────────────────────────────────────
  async function fetchAll() {
    loading.value = true
    error.value = null
    try {
      const res = await estacionesService.getAll()
      registros.value = res.data ?? []
    } catch (e) {
      error.value = e.message
    } finally {
      loading.value = false
    }
  }

  async function crear(formData) {
    const res = await estacionesService.create(formData)
    registros.value.push(res.data)
    return res.data
  }

  async function actualizar(id, formData) {
    const res = await estacionesService.update(id, formData)
    const idx = registros.value.findIndex((r) => r._id === id)
    if (idx !== -1) registros.value[idx] = res.data
    return res.data
  }

  async function eliminar(id) {
    await estacionesService.remove(id)
    registros.value = registros.value.filter((r) => r._id !== id)
  }

  return {
    registros, loading, error, filtroEstacionId,
    filtrados, totalRegistros, promedioTemp, tempMaxima, estacionesUnicas, ultimosRegistros,
    fetchAll, crear, actualizar, eliminar,
  }
})
