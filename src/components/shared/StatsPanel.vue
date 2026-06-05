<script setup>
/**
 * StatsPanel — Panel de estadísticas del dashboard
 * Props: loading (Boolean)
 * Consume el store de estaciones para obtener computed stats.
 * Demuestra: v-for sobre array computado, :class, v-if/v-else
 */
import { computed } from 'vue'
import { useEstacionesStore } from '@/stores/estaciones'

defineProps({
  loading: { type: Boolean, default: false },
})

const store = useEstacionesStore()

// Array de objetos para renderizar con v-for → evita repetición de markup
const stats = computed(() => [
  { label: 'REGISTROS',  value: store.totalRegistros,  unit: 'total'   },
  { label: 'TEMP. PROM', value: store.promedioTemp,    unit: '°C'      },
  { label: 'ESTACIONES', value: store.estacionesUnicas, unit: 'activas' },
  { label: 'TEMP. MÁX',  value: store.tempMaxima,      unit: '°C'      },
])
</script>

<template>
  <div class="stats-grid">
    <!-- v-for sobre array de stats computado -->
    <div v-for="stat in stats" :key="stat.label" class="stat-card">
      <span class="stat-label">{{ stat.label }}</span>
      <span class="stat-value">
        <!-- v-if/v-else: spinner mientras carga, valor cuando listo -->
        <span v-if="loading" class="spinner"></span>
        <span v-else>{{ stat.value ?? '—' }}</span>
      </span>
      <span class="stat-unit">{{ stat.unit }}</span>
    </div>
  </div>
</template>
