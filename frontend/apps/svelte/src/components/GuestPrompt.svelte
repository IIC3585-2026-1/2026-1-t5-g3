<script lang="ts">
  import { push } from 'svelte-spa-router'

  interface Props {
    message: string
    showRegister?: boolean
  }

  let { message, showRegister = true }: Props = $props()
</script>

<div class="guest-panel">
  <p>{message}</p>
  <div class="guest-actions">
    <button type="button" class="btn-primary-link" onclick={() => push('/login')}>
      Iniciar sesión
    </button>
    {#if showRegister}
      <button type="button" class="btn-outline-link" onclick={() => push('/register')}>
        Registrarse
      </button>
    {/if}
  </div>
</div>
