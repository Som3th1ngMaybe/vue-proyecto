<script setup>
/**
 * DashboardView — Vista principal del sistema
 * Muestra estadísticas y los últimos registros.
 * Demuestra: onMounted (hook de ciclo de vida), store computed, v-for, v-if/v-else
 */
import { onMounted } from 'vue'
import { useEstacionesStore } from '@/stores/estaciones'
import StatsPanel from '@/components/shared/StatsPanel.vue'

const store = useEstacionesStore()

// Hook de ciclo de vida: carga datos al montar la vista
onMounted(() => {
  if (store.registros.length === 0) store.fetchAll()
})

function formatDate(d) {
  return new Date(d).toLocaleString('es-MX', {
    month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit',
  })
}

function tempChipClass(t) {
  if (t >= 35) return 'chip chip-red'
  if (t >= 28) return 'chip chip-warn'
  return 'chip chip-green'
}
</script>

<template>
  <div class="page">
    <div class="section-header">
      <h1 class="section-title">// <span>Dashboard</span></h1>
      <button class="btn btn-secondary btn-sm" @click="store.fetchAll">↺ Actualizar</button>
    </div>

    <!-- Componente StatsPanel: recibe loading como prop -->
    <StatsPanel :loading="store.loading" />

    <!-- Tabla de últimos registros -->
    <div class="card">
      <div class="card-header">
        <span class="dot"></span> ÚLTIMOS 5 REGISTROS
      </div>

      <!-- v-if loading -->
      <div v-if="store.loading" class="loading-state">
        <span class="spinner"></span> Cargando datos...
      </div>

      <!-- v-else: contenido cuando no está cargando -->
      <template v-else>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>EST.</th>
                <th>FECHA</th>
                <th>TEMP °C</th>
                <th>HUM %</th>
                <th>PRESIÓN</th>
                <th>VIENTO</th>
                <th>FUENTE</th>
              </tr>
            </thead>
            <tbody>
              <!-- v-if empty state -->
              <tr v-if="store.ultimosRegistros.length === 0" class="empty-row">
                <td colspan="7">// SIN_DATOS_DISPONIBLES</td>
              </tr>
              <!-- v-for con v-else -->
              <tr v-for="r in store.ultimosRegistros" v-else :key="r._id">
                <td><span class="chip chip-cyan">EST-{{ r.estacion_id }}</span></td>
                <td class="td-mono">{{ formatDate(r.fecha) }}</td>
                <td><span :class="tempChipClass(r.temperatura_c)">{{ r.temperatura_c }}°</span></td>
                <td>{{ r.humedad_pct }}%</td>
                <td class="td-mono">{{ r.presion_hPa ?? '—' }}</td>
                <td class="td-mono">{{ r.velocidad_viento_ms ?? '—' }}</td>
                <td style="font-size:.75rem; color:var(--text-2)">{{ r.fuente ?? '—' }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </template>
    </div>
  </div>
</template>
