<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { authError, authLoading, register } from '../stores/auth'

const router = useRouter()

const name = ref('')
const email = ref('')
const password = ref('')

async function handleSubmit() {
  try {
    await register(name.value, email.value, password.value)
    router.push('/')
  } catch {
    // authError is set in the store
  }
}
</script>

<template>
  <main class="app auth-page">
    <section class="auth-panel">
      <h1>Crear cuenta</h1>
      <p class="subtitle">Regístrate para gestionar tus libros</p>

      <form class="auth-form" @submit.prevent="handleSubmit">
        <label for="register-name">Nombre</label>
        <input
          id="register-name"
          v-model="name"
          type="text"
          autocomplete="name"
          required
          minlength="2"
        />

        <label for="register-email">Email</label>
        <input
          id="register-email"
          v-model="email"
          type="email"
          autocomplete="email"
          required
        />

        <label for="register-password">Contraseña</label>
        <input
          id="register-password"
          v-model="password"
          type="password"
          autocomplete="new-password"
          required
          minlength="6"
        />

        <p v-if="authError" class="error">{{ authError }}</p>

        <button type="submit" class="btn-primary" :disabled="authLoading">
          {{ authLoading ? 'Creando cuenta...' : 'Registrarse' }}
        </button>
      </form>

      <p class="auth-footer">
        ¿Ya tienes cuenta?
        <RouterLink to="/login" class="link-button">Inicia sesión</RouterLink>
      </p>
    </section>
  </main>
</template>
