<script setup>
/**
 * AppAlert — Alerta reutilizable
 * Props: type ('success'|'error'|'warn'), message
 * Emits: dismiss
 * Demuestra: defineProps, defineEmits, computed para clase dinámica
 */
const props = defineProps({
  type:    { type: String, default: 'success' },
  message: { type: String, required: true },
})

const emit = defineEmits(['dismiss'])

// computed: icono según tipo
import { computed } from 'vue'
const icon = computed(() => ({ success: '✓', error: '✕', warn: '⚠' }[props.type] ?? '•'))
</script>

<template>
  <!-- :class binding dinámico basado en prop -->
  <div class="alert" :class="`alert-${type}`" role="alert">
    <span>{{ icon }} {{ message }}</span>
    <button class="dismiss-btn" @click="emit('dismiss')" aria-label="Cerrar">✕</button>
  </div>
</template>

<style scoped>
.dismiss-btn {
  margin-left: auto;
  background: none;
  border: none;
  cursor: pointer;
  color: inherit;
  opacity: 0.7;
  font-size: 0.85rem;
  flex-shrink: 0;
}
.dismiss-btn:hover { opacity: 1; }
</style>
