<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { authError, authLoading, login } from '../stores/auth'

const router = useRouter()

const email = ref('')
const password = ref('')

async function handleSubmit() {
  try {
    await login(email.value, password.value)
    router.push('/')
  } catch {
    // authError is set in the store
  }
}
</script>

<template>
  <main class="app auth-page">
    <section class="auth-panel">
      <h1>Iniciar sesión</h1>
      <p class="subtitle">Accede a tus listas de libros</p>

      <form class="auth-form" @submit.prevent="handleSubmit">
        <label for="login-email">Email</label>
        <input
          id="login-email"
          v-model="email"
          type="email"
          autocomplete="email"
          required
        />

        <label for="login-password">Contraseña</label>
        <input
          id="login-password"
          v-model="password"
          type="password"
          autocomplete="current-password"
          required
        />

        <p v-if="authError" class="error">{{ authError }}</p>

        <button type="submit" class="btn-primary" :disabled="authLoading">
          {{ authLoading ? 'Entrando...' : 'Iniciar sesión' }}
        </button>
      </form>

      <p class="auth-footer">
        ¿No tienes cuenta?
        <RouterLink to="/register" class="link-button">Regístrate</RouterLink>
      </p>
    </section>
  </main>
</template>
