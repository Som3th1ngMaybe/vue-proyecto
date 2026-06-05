<script setup>
/**
 * UsuarioForm — Formulario CREATE / UPDATE de usuarios
 *
 * Props:  editingUser (Object|null), loading (Boolean)
 * Emits:  submit-user (formData), cancel-edit ()
 *
 * Demuestra: v-model en select, computed, watch, defineProps/defineEmits
 */
import { ref, computed, watch } from 'vue'

const props = defineProps({
  editingUser: { type: Object,  default: null },
  loading:     { type: Boolean, default: false },
})

const emit = defineEmits(['submit-user', 'cancel-edit'])

const EMPTY = () => ({ username: '', password: '', email: '', role: 'user' })
const form   = ref(EMPTY())
const errors = ref({})

const isEditing  = computed(() => props.editingUser !== null)
const formTitle  = computed(() => isEditing.value ? `EDITAR USUARIO [${props.editingUser?.username}]` : 'NUEVO USUARIO')
const submitLabel = computed(() => isEditing.value ? 'Actualizar' : 'Crear usuario')

watch(() => props.editingUser, (u) => {
  if (u) form.value = { username: u.username, password: '', email: u.email, role: u.role }
  else   reset()
})

function validate() {
  errors.value = {}
  if (!form.value.username) errors.value.username = 'Requerido'
  if (!isEditing.value && !form.value.password) errors.value.password = 'Requerido'
  if (!form.value.email)    errors.value.email    = 'Requerido'
  return Object.keys(errors.value).length === 0
}

function handleSubmit() {
  if (!validate()) return
  emit('submit-user', { ...form.value })
}

function reset() {
  form.value   = EMPTY()
  errors.value = {}
}
</script>

<template>
  <div class="card" style="margin-bottom: 1.5rem">
    <div class="card-header">
      <span class="dot" :style="isEditing ? 'background: var(--warn)' : ''"></span>
      {{ formTitle }}
    </div>
    <div class="card-body">
      <div class="form-grid">

        <div class="form-group">
          <label class="form-label">USERNAME *</label>
          <input v-model="form.username" class="form-input" :class="{ 'is-invalid': errors.username }" type="text" />
          <span v-if="errors.username" class="error-msg">{{ errors.username }}</span>
        </div>

        <div class="form-group">
          <label class="form-label">
            PASSWORD <span v-if="isEditing" style="font-size:.65rem;color:var(--text-3)">(vacío = sin cambios)</span>
            <span v-else>*</span>
          </label>
          <input v-model="form.password" class="form-input" :class="{ 'is-invalid': errors.password }" type="text" />
          <span v-if="errors.password" class="error-msg">{{ errors.password }}</span>
        </div>

        <div class="form-group">
          <label class="form-label">EMAIL *</label>
          <input v-model="form.email" class="form-input" :class="{ 'is-invalid': errors.email }" type="email" />
          <span v-if="errors.email" class="error-msg">{{ errors.email }}</span>
        </div>

        <div class="form-group">
          <label class="form-label">ROL</label>
          <!-- v-model en select -->
          <select v-model="form.role" class="form-select">
            <option value="user">user</option>
            <option value="admin">admin</option>
          </select>
        </div>

      </div>
      <div class="form-actions">
        <button class="btn btn-primary" :disabled="loading" @click="handleSubmit">
          <span v-if="loading" class="spinner" style="width:13px;height:13px"></span>
          <span v-else>{{ submitLabel }}</span>
        </button>
        <button v-if="isEditing" class="btn btn-secondary" @click="emit('cancel-edit')">Cancelar</button>
      </div>
    </div>
  </div>
</template>
