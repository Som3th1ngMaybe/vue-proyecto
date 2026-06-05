<script setup>
/**
 * ConfirmModal — Modal de confirmación genérico
 * Props: show, title, message
 * Emits: confirm, cancel
 * Demuestra: defineProps, defineEmits, Transition, @click.self
 */
defineProps({
  show:    { type: Boolean, default: false },
  title:   { type: String,  default: 'Confirmar acción' },
  message: { type: String,  default: '¿Estás seguro?' },
})

const emit = defineEmits(['confirm', 'cancel'])
</script>

<template>
  <Transition name="fade">
    <!-- @click.self: cierra solo si se hace click en el overlay, no en el modal -->
    <div v-if="show" class="modal-overlay" @click.self="emit('cancel')">
      <div class="modal">
        <div class="modal-header">
          ⚠ {{ title }}
          <button class="close-btn" @click="emit('cancel')">✕</button>
        </div>
        <div class="modal-body">{{ message }}</div>
        <div class="modal-footer">
          <button class="btn btn-secondary" @click="emit('cancel')">Cancelar</button>
          <button class="btn btn-danger"    @click="emit('confirm')">Eliminar</button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active { transition: opacity 0.18s ease; }
.fade-enter-from,
.fade-leave-to     { opacity: 0; }
</style>
