<script setup lang="ts">
import { useRouter } from 'vue-router'

interface Props {
  message: string
  showRegister?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  showRegister: true,
})

const router = useRouter()
</script>

<template>
  <div class="guest-panel">
    <p>{{ props.message }}</p>
    <div class="guest-actions">
      <button type="button" class="btn-primary-link" @click="router.push('/login')">
        Iniciar sesión
      </button>
      <button
        v-if="props.showRegister"
        type="button"
        class="btn-outline-link"
        @click="router.push('/register')"
      >
        Registrarse
      </button>
    </div>
  </div>
</template>
