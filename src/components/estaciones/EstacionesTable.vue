<script setup>
/**
 * EstacionesTable — Tabla paginada de registros meteorológicos
 *
 * Props:    records (Array), loading (Boolean), filterId (String)
 * Emits:    filter-change (value), edit-record (record), delete-record (id)
 *
 * Demuestra:
 *   • v-for con :key
 *   • v-if / v-else (empty state vs filas)
 *   • computed (paginación)
 *   • watch para resetear página
 *   • :class binding dinámico (color temperatura)
 *   • $emit desde template y desde setup
 */
import { ref, computed, watch } from 'vue'

const props = defineProps({
  records:        { type: Array,   default: () => [] },
  loading:        { type: Boolean, default: false },
  filterId:       { type: String,  default: '' },
  isAuthenticated: { type: Boolean, default: false },
})

const emit = defineEmits(['filter-change', 'edit-record', 'delete-record'])

// ── Paginación ─────────────────────────────────────────────
const PER_PAGE   = 8
const currentPage = ref(1)

const totalPages = computed(() => Math.max(1, Math.ceil(props.records.length / PER_PAGE)))

const paginatedRecords = computed(() => {
  const start = (currentPage.value - 1) * PER_PAGE
  return props.records.slice(start, start + PER_PAGE)
})

// Resetea página cuando cambia la lista filtrada
watch(() => props.records.length, () => { currentPage.value = 1 })

// ── Helpers ────────────────────────────────────────────────
function formatDate(d) {
  return new Date(d).toLocaleString('es-MX', {
    month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit',
  })
}

// computed por fila: devuelve clase de chip según temperatura
function tempChipClass(t) {
  if (t >= 35) return 'chip chip-red'
  if (t >= 28) return 'chip chip-warn'
  return 'chip chip-green'
}
</script>

<template>
  <div class="card">
    <div class="card-header">
      <span class="dot"></span>
      REGISTROS
      <span style="margin-left: auto; color: var(--text-3); font-size: .68rem">
        {{ records.length }} resultados
      </span>
    </div>

    <!-- Barra de filtro con v-model derivado (emite al padre) -->
    <div class="card-body" style="padding: 1rem; border-bottom: 1px solid var(--border)">
      <div style="display:flex; gap:.75rem; align-items:center; flex-wrap:wrap">
        <label class="form-label">FILTRAR EST:</label>
        <!-- :value + @input = binding controlado que notifica al padre -->
        <input
          :value="filterId"
          class="form-input"
          style="max-width:160px"
          type="text"
          placeholder="ID estación..."
          @input="emit('filter-change', $event.target.value)"
        />
        <button
          v-if="filterId"
          class="btn btn-secondary btn-sm"
          @click="emit('filter-change', '')"
        >
          ✕ Limpiar
        </button>
      </div>
    </div>

    <!-- Loading state -->
    <div v-if="loading" class="loading-state">
      <span class="spinner"></span> Cargando registros...
    </div>

    <!-- Contenido: v-else para mostrar cuando no está cargando -->
    <template v-else>
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>ID INTERNO</th>
              <th>EST.</th>
              <th>FECHA</th>
              <th>TEMP °C</th>
              <th>HUM %</th>
              <th>PRESIÓN</th>
              <th>VIENTO</th>
              <th>FUENTE</th>
              <th>ACCIONES</th>
            </tr>
          </thead>
          <tbody>
            <!-- v-if empty state -->
            <tr v-if="paginatedRecords.length === 0" class="empty-row">
              <td colspan="9">// SIN_REGISTROS_ENCONTRADOS</td>
            </tr>

            <!-- v-for principal con v-else -->
            <tr v-for="r in paginatedRecords" v-else :key="r._id">
              <td class="td-mono" style="font-size:.66rem">{{ r._id }}</td>

              <td><span class="chip chip-cyan">{{ r.estacion_id }}</span></td>

              <td class="td-mono">{{ formatDate(r.fecha) }}</td>

              <!-- :class dinámico según valor de temperatura -->
              <td>
                <span :class="tempChipClass(r.temperatura_c)">
                  {{ r.temperatura_c }}°
                </span>
              </td>

              <td>{{ r.humedad_pct }}%</td>
              <td class="td-mono">{{ r.presion_hPa       ?? '—' }}</td>
              <td class="td-mono">{{ r.velocidad_viento_ms ?? '—' }}</td>
              <td style="font-size:.75rem; color:var(--text-2)">{{ r.fuente ?? '—' }}</td>

              <td>
                <div v-if="isAuthenticated" style="display:flex; gap:.35rem">
                  <!-- emit al padre con el objeto completo para edición -->
                  <button class="btn btn-edit btn-sm" @click="emit('edit-record', r)">
                    Editar
                  </button>
                  <!-- emit al padre con el _id para eliminar -->
                  <button class="btn btn-danger btn-sm" @click="emit('delete-record', r._id)">
                    Borrar
                  </button>
                </div>
                <div v-else style="font-size:.75rem; color:var(--text-3)">—</div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Paginación -->
      <div class="pagination">
        <button class="btn btn-secondary btn-sm" :disabled="currentPage === 1" @click="currentPage--">
          ‹
        </button>
        <span class="page-info">{{ currentPage }} / {{ totalPages }}</span>
        <button class="btn btn-secondary btn-sm" :disabled="currentPage === totalPages" @click="currentPage++">
          ›
        </button>
      </div>
    </template>
  </div>
</template>
