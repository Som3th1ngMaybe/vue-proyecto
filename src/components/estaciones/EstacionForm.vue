<script setup>
/**
 * EstacionForm — Formulario CREATE / UPDATE de registros meteorológicos
 *
 * Props:    editingRecord (Object|null) — null = modo CREATE, objeto = modo EDIT
 *           loading       (Boolean)
 * Emits:    submit-record (formData)
 *           cancel-edit   ()
 *
 * Demuestra:
 *   • defineProps / defineEmits
 *   • v-model con .number modifier
 *   • :class binding dinámico (campo con error)
 *   • computed (isEditing, formTitle, submitLabel)
 *   • watch para sincronizar formulario al recibir prop
 *   • v-if / v-else dentro del template
 *   • Validación con reactive errors
 */
import { ref, computed, watch } from 'vue'

const props = defineProps({
  editingRecord: { type: Object, default: null },
  loading:       { type: Boolean, default: false },
})

const emit = defineEmits(['submit-record', 'cancel-edit'])

// ── Estado local del formulario ────────────────────────────
const EMPTY_FORM = () => ({
  estacion_id: '', temperatura_c: '', humedad_pct: '',
  presion_hPa: '', velocidad_viento_ms: '', fuente: '',
})

const form   = ref(EMPTY_FORM())
const errors = ref({})

// ── Computed ───────────────────────────────────────────────
const isEditing  = computed(() => props.editingRecord !== null)
const formTitle  = computed(() =>
  isEditing.value
    ? `EDITAR REGISTRO [${props.editingRecord?._id?.slice(-6)}]`
    : 'NUEVO REGISTRO'
)
const submitLabel = computed(() => isEditing.value ? 'Actualizar' : 'Guardar')

// ── Watch: sincroniza el form cuando llega un registro a editar ──
watch(
  () => props.editingRecord,
  (rec) => {
    if (rec) {
      form.value = {
        estacion_id:        rec.estacion_id,
        temperatura_c:      rec.temperatura_c,
        humedad_pct:        rec.humedad_pct,
        presion_hPa:        rec.presion_hPa        ?? '',
        velocidad_viento_ms: rec.velocidad_viento_ms ?? '',
        fuente:             rec.fuente             ?? '',
      }
    } else {
      reset()
    }
  }
)

// ── Métodos ────────────────────────────────────────────────
function validate() {
  errors.value = {}
  if (!form.value.estacion_id)          errors.value.estacion_id    = 'Requerido'
  if (form.value.temperatura_c === '')   errors.value.temperatura_c  = 'Requerido'
  if (form.value.humedad_pct === '')     errors.value.humedad_pct    = 'Requerido'
  return Object.keys(errors.value).length === 0
}

function handleSubmit() {
  if (!validate()) return
  // Emite los datos al componente padre (EstacionesView)
  emit('submit-record', { ...form.value })
}

function reset() {
  form.value   = EMPTY_FORM()
  errors.value = {}
}

function handleCancel() {
  reset()
  emit('cancel-edit')
}
</script>

<template>
  <div class="card" style="margin-bottom: 1.5rem">
    <div class="card-header">
      <!-- :style binding: cambia color del dot en modo edición -->
      <span class="dot" :style="isEditing ? 'background: var(--warn)' : ''"></span>
      {{ formTitle }}
    </div>

    <div class="card-body">
      <div class="form-grid">

        <!-- ID Estación -->
        <div class="form-group">
          <label class="form-label">ID ESTACIÓN *</label>
          <!-- v-model: two-way binding texto -->
          <input
            v-model="form.estacion_id"
            class="form-input"
            :class="{ 'is-invalid': errors.estacion_id }"
            type="text"
            placeholder="ej. 1"
          />
          <span v-if="errors.estacion_id" class="error-msg">{{ errors.estacion_id }}</span>
        </div>

        <!-- Temperatura -->
        <div class="form-group">
          <label class="form-label">TEMPERATURA °C *</label>
          <!-- v-model.number: convierte a número automáticamente -->
          <input
            v-model.number="form.temperatura_c"
            class="form-input"
            :class="{ 'is-invalid': errors.temperatura_c }"
            type="number"
            step="0.1"
            placeholder="25.4"
          />
          <span v-if="errors.temperatura_c" class="error-msg">{{ errors.temperatura_c }}</span>
        </div>

        <!-- Humedad -->
        <div class="form-group">
          <label class="form-label">HUMEDAD % *</label>
          <input
            v-model.number="form.humedad_pct"
            class="form-input"
            :class="{ 'is-invalid': errors.humedad_pct }"
            type="number"
            placeholder="75"
          />
          <span v-if="errors.humedad_pct" class="error-msg">{{ errors.humedad_pct }}</span>
        </div>

        <!-- Presión -->
        <div class="form-group">
          <label class="form-label">PRESIÓN hPa</label>
          <input
            v-model.number="form.presion_hPa"
            class="form-input"
            type="number"
            step="0.1"
            placeholder="1013.2"
          />
        </div>

        <!-- Velocidad viento -->
        <div class="form-group">
          <label class="form-label">VIENTO m/s</label>
          <input
            v-model.number="form.velocidad_viento_ms"
            class="form-input"
            type="number"
            step="0.1"
            placeholder="1.5"
          />
        </div>

        <!-- Fuente: binding manual :value + @change (alternativa a v-model) -->
        <div class="form-group">
          <label class="form-label">FUENTE</label>
          <select
            :value="form.fuente"
            class="form-select"
            @change="form.fuente = $event.target.value"
          >
            <option value="">Seleccionar...</option>
            <option value="JSON">JSON</option>
            <option value="API">API</option>
            <option value="Manual">Manual</option>
            <option value="Sensor">Sensor</option>
          </select>
        </div>

      </div><!-- /form-grid -->

      <div class="form-actions">
        <button class="btn btn-primary" :disabled="loading" @click="handleSubmit">
          <!-- v-if/v-else: spinner o label -->
          <span v-if="loading" class="spinner" style="width:13px;height:13px"></span>
          <span v-else>{{ submitLabel }}</span>
        </button>

        <!-- v-if: botón Cancelar solo en modo edición -->
        <button v-if="isEditing" class="btn btn-secondary" @click="handleCancel">
          Cancelar
        </button>

        <button class="btn btn-secondary" @click="reset">Limpiar</button>
      </div>
    </div>
  </div>
</template>
