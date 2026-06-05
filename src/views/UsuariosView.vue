<script setup>
/**
 * UsuariosView — Vista CRUD de usuarios (solo admin)
 * Demuestra: guard en vista con computed del store, onMounted, manejo de emits
 */
import { ref, onMounted } from 'vue'
import { useUsuariosStore } from '@/stores/usuarios'
import { useAuthStore }     from '@/stores/auth'
import UsuarioForm   from '@/components/usuarios/UsuarioForm.vue'
import UsuariosTable from '@/components/usuarios/UsuariosTable.vue'
import AppAlert      from '@/components/shared/AppAlert.vue'
import ConfirmModal  from '@/components/shared/ConfirmModal.vue'

const store = useUsuariosStore()
const auth  = useAuthStore()

const editingUser    = ref(null)
const formLoading    = ref(false)
const alert          = ref({ show: false, type: 'success', message: '' })
const confirmPending = ref({ show: false, id: null })

onMounted(() => {
  if (store.usuarios.length === 0) store.fetchAll()
})

async function handleSubmitUser(formData) {
  formLoading.value = true
  try {
    if (editingUser.value) {
      await store.actualizar(editingUser.value.id, formData)
      showAlert('success', 'Usuario actualizado correctamente.')
    } else {
      await store.crear(formData)
      showAlert('success', 'Usuario creado correctamente.')
    }
    editingUser.value = null
  } catch (e) {
    showAlert('error', e.message)
  } finally {
    formLoading.value = false
  }
}

function handleEditUser(user) {
  editingUser.value = user
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function handleDeleteRequest(id) {
  confirmPending.value = { show: true, id }
}

async function confirmDelete() {
  try {
    await store.eliminar(confirmPending.value.id)
    showAlert('success', 'Usuario eliminado.')
  } catch (e) {
    showAlert('error', e.message)
  } finally {
    confirmPending.value = { show: false, id: null }
  }
}

function showAlert(type, message) {
  alert.value = { show: true, type, message }
  setTimeout(() => { alert.value.show = false }, 4000)
}
</script>

<template>
  <div class="page">
    <div class="section-header">
      <h1 class="section-title">// <span>Usuarios</span></h1>
    </div>

    <!-- v-if: muestra advertencia si no es admin (doble protección en UI) -->
    <div v-if="!auth.isAdmin" class="alert alert-warn" style="margin-bottom:1.25rem">
      ⚠ Esta sección requiere rol de administrador.
    </div>

    <template v-else>
      <Transition name="fade">
        <AppAlert
          v-if="alert.show"
          :type="alert.type"
          :message="alert.message"
          style="margin-bottom:1rem"
          @dismiss="alert.show = false"
        />
      </Transition>

      <UsuarioForm
        :editing-user="editingUser"
        :loading="formLoading"
        @submit-user="handleSubmitUser"
        @cancel-edit="editingUser = null"
      />

      <UsuariosTable
        :users="store.usuarios"
        :loading="store.loading"
        :current-user-id="auth.user?.id"
        @edit-user="handleEditUser"
        @delete-user="handleDeleteRequest"
      />

      <ConfirmModal
        :show="confirmPending.show"
        title="Eliminar usuario"
        message="¿Eliminar este usuario del sistema? Esta acción no se puede deshacer."
        @confirm="confirmDelete"
        @cancel="confirmPending = { show: false, id: null }"
      />
    </template>
  </div>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s; }
.fade-enter-from,   .fade-leave-to     { opacity: 0; }
</style>
