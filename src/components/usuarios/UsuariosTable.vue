<script setup>
/**
 * UsuariosTable — Tabla de usuarios del sistema
 *
 * Props:  users (Array), loading (Boolean), currentUserId (String)
 * Emits:  edit-user (user), delete-user (id)
 *
 * Demuestra: v-for, v-if/v-else, :class binding por rol
 */
defineProps({
  users:         { type: Array,  default: () => [] },
  loading:       { type: Boolean, default: false },
  currentUserId: { type: String,  default: null },
})

const emit = defineEmits(['edit-user', 'delete-user'])
</script>

<template>
  <div class="card">
    <div class="card-header">
      <span class="dot"></span> USUARIOS DEL SISTEMA
    </div>

    <div v-if="loading" class="loading-state">
      <span class="spinner"></span> Cargando...
    </div>

    <template v-else>
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>USERNAME</th>
              <th>EMAIL</th>
              <th>ROL</th>
              <th>ACCIONES</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="users.length === 0" class="empty-row">
              <td colspan="5">// SIN_USUARIOS</td>
            </tr>
            <tr v-for="u in users" v-else :key="u.id">
              <td class="td-mono">{{ u.id }}</td>
              <td>{{ u.username }}</td>
              <td class="td-mono" style="font-size:.78rem">{{ u.email }}</td>
              <td>
                <!-- :class dinámico según rol -->
                <span class="chip" :class="u.role === 'admin' ? 'chip-red' : 'chip-green'">
                  {{ u.role }}
                </span>
              </td>
              <td>
                <div style="display:flex; gap:.35rem">
                  <button class="btn btn-edit btn-sm" @click="emit('edit-user', u)">Editar</button>
                  <!-- v-if: no permite borrar el usuario activo -->
                  <button
                    v-if="String(u.id) !== String(currentUserId)"
                    class="btn btn-danger btn-sm"
                    @click="emit('delete-user', u.id)"
                  >
                    Borrar
                  </button>
                  <span v-else class="td-mono" style="font-size:.65rem; padding: .3rem .5rem">
                    (tú)
                  </span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </template>
  </div>
</template>
