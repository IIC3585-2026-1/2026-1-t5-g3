<script lang="ts">
  import { onMount } from 'svelte'
  import { push } from 'svelte-spa-router'
  import { authError, authLoading, isAuthenticated, register } from '../stores/auth'

  let name = $state('')
  let email = $state('')
  let password = $state('')

  onMount(() => {
    if ($isAuthenticated) {
      push('/')
    }
  })

  async function handleSubmit(event: Event) {
    event.preventDefault()

    try {
      await register(name, email, password)
      push('/')
    } catch {
      // authError is set in the store
    }
  }
</script>

<main class="app auth-page">
  <section class="auth-panel">
    <h1>Crear cuenta</h1>
    <p class="subtitle">Regístrate para gestionar tus libros</p>

    <form class="auth-form" onsubmit={handleSubmit}>
      <label for="register-name">Nombre</label>
      <input
        id="register-name"
        bind:value={name}
        type="text"
        autocomplete="name"
        required
        minlength="2"
      />

      <label for="register-email">Email</label>
      <input
        id="register-email"
        bind:value={email}
        type="email"
        autocomplete="email"
        required
      />

      <label for="register-password">Contraseña</label>
      <input
        id="register-password"
        bind:value={password}
        type="password"
        autocomplete="new-password"
        required
        minlength="6"
      />

      {#if $authError}
        <p class="error">{$authError}</p>
      {/if}

      <button type="submit" class="btn-primary" disabled={$authLoading}>
        {$authLoading ? 'Creando cuenta...' : 'Registrarse'}
      </button>
    </form>

    <p class="auth-footer">
      ¿Ya tienes cuenta?
      <button type="button" class="link-button" onclick={() => push('/login')}>
        Inicia sesión
      </button>
    </p>
  </section>
</main>
