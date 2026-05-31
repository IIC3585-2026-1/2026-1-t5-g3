<script lang="ts">
  import { onMount } from 'svelte'
  import { push } from 'svelte-spa-router'
  import { authError, authLoading, isAuthenticated, login } from '../stores/auth'

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
      await login(email, password)
      push('/')
    } catch {
      // authError is set in the store
    }
  }
</script>

<main class="app auth-page">
  <section class="auth-panel">
    <h1>Iniciar sesión</h1>
    <p class="subtitle">Accede a tus listas de libros</p>

    <form class="auth-form" onsubmit={handleSubmit}>
      <label for="login-email">Email</label>
      <input
        id="login-email"
        bind:value={email}
        type="email"
        autocomplete="email"
        required
      />

      <label for="login-password">Contraseña</label>
      <input
        id="login-password"
        bind:value={password}
        type="password"
        autocomplete="current-password"
        required
      />

      {#if $authError}
        <p class="error">{$authError}</p>
      {/if}

      <button type="submit" class="btn-primary" disabled={$authLoading}>
        {$authLoading ? 'Entrando...' : 'Iniciar sesión'}
      </button>
    </form>

    <p class="auth-footer">
      ¿No tienes cuenta?
      <button type="button" class="link-button" onclick={() => push('/register')}>
        Regístrate
      </button>
    </p>
  </section>
</main>
