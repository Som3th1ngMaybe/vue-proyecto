<script setup>
/**
 * EstacionesView — Vista CRUD de registros meteorológicos
 *
 * Orquesta EstacionForm + EstacionesTable + alertas + modal de confirmación.
 * Toda la comunicación con el backend pasa por el store (Pinia).
 *
 * Demuestra: onMounted, ref, watch, manejo de emit de hijos, uso de store
 */
import { ref, onMounted } from 'vue'
import { useEstacionesStore } from '@/stores/estaciones'
import { useAuthStore } from '@/stores/auth'
import EstacionForm    from '@/components/estaciones/EstacionForm.vue'
import EstacionesTable from '@/components/estaciones/EstacionesTable.vue'
import AppAlert        from '@/components/shared/AppAlert.vue'
import ConfirmModal    from '@/components/shared/ConfirmModal.vue'

const store = useEstacionesStore()
const auth = useAuthStore()

// ── Estado local de la vista ───────────────────────────────
const editingRecord  = ref(null)   // null = modo CREATE
const formLoading    = ref(false)
const alert          = ref({ show: false, type: 'success', message: '' })
const confirmPending = ref({ show: false, id: null })

// Hook de ciclo de vida
onMounted(() => {
  if (store.registros.length === 0) store.fetchAll()
})

// ── Manejadores de emit de EstacionForm ────────────────────
async function handleSubmitRecord(formData) {
  formLoading.value = true
  try {
    if (editingRecord.value) {
      await store.actualizar(editingRecord.value._id, formData)
      showAlert('success', 'Registro actualizado correctamente.')
    } else {
      await store.crear(formData)
      showAlert('success', 'Registro creado correctamente.')
    }
    editingRecord.value = null
  } catch (e) {
    showAlert('error', e.message)
  } finally {
    formLoading.value = false
  }
}

function handleCancelEdit() {
  editingRecord.value = null
}

// ── Manejadores de emit de EstacionesTable ─────────────────
function handleEditRecord(record) {
  editingRecord.value = record
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function handleDeleteRequest(id) {
  confirmPending.value = { show: true, id }
}

async function confirmDelete() {
  try {
    await store.eliminar(confirmPending.value.id)
    showAlert('success', 'Registro eliminado.')
  } catch (e) {
    showAlert('error', e.message)
  } finally {
    confirmPending.value = { show: false, id: null }
  }
}

// ── Manejador filtro ───────────────────────────────────────
function handleFilterChange(val) {
  store.filtroEstacionId = val
}

// ── Utilidad alerta ────────────────────────────────────────
function showAlert(type, message) {
  alert.value = { show: true, type, message }
  setTimeout(() => { alert.value.show = false }, 4000)
}
</script>

<template>
  <div class="page">
    <div class="section-header">
      <h1 class="section-title">// <span>Estaciones</span> · CRUD</h1>
    </div>

    <!-- Alerta: v-if controla visibilidad; @dismiss sube el evento al handler -->
    <Transition name="fade">
      <AppAlert
        v-if="alert.show"
        :type="alert.type"
        :message="alert.message"
        style="margin-bottom:1rem"
        @dismiss="alert.show = false"
      />
    </Transition>

    <!--
      EstacionForm:
        :editingRecord  → prop que controla modo CREATE/EDIT
        :loading        → prop que deshabilita el botón
        @submit-record  → emit del hijo, recibido aquí
        @cancel-edit    → emit del hijo cuando se cancela la edición
        Solo visible para usuarios autenticados (no invitados)
    -->
    <EstacionForm
      v-if="auth.isLoggedIn"
      :editing-record="editingRecord"
      :loading="formLoading"
      @submit-record="handleSubmitRecord"
      @cancel-edit="handleCancelEdit"
    />

    <!--
      EstacionesTable:
        :records        → prop: array filtrado del store
        :loading        → prop: estado de carga del store
        :filter-id      → prop: valor del filtro activo
        :is-authenticated → prop: controla visibilidad de botones de editar/borrar
        @filter-change  → emit del hijo con nuevo valor de filtro
        @edit-record    → emit del hijo con el registro a editar
        @delete-record  → emit del hijo con el _id a eliminar
    -->
    <EstacionesTable
      :records="store.filtrados"
      :loading="store.loading"
      :filter-id="store.filtroEstacionId"
      :is-authenticated="auth.isLoggedIn"
      @filter-change="handleFilterChange"
      @edit-record="handleEditRecord"
      @delete-record="handleDeleteRequest"
    />

    <!-- Modal de confirmación de eliminación -->
    <ConfirmModal
      :show="confirmPending.show"
      title="Confirmar eliminación"
      message="¿Eliminar este registro meteorológico? Esta acción no se puede deshacer."
      @confirm="confirmDelete"
      @cancel="confirmPending = { show: false, id: null }"
    />
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active { transition: opacity 0.2s; }
.fade-enter-from,
.fade-leave-to     { opacity: 0; }
</style>
