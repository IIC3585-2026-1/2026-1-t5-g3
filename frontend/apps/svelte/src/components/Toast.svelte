<script lang="ts">
  import { toast, hideToast } from '../stores/toast'
</script>

{#if $toast}
  <div
    class="toast"
    class:success={$toast.type === 'success'}
    class:error={$toast.type === 'error'}
    role="status"
    aria-live="polite"
  >
    <p>{$toast.message}</p>
    <button type="button" class="toast-close" aria-label="Cerrar" onclick={hideToast}>
      ×
    </button>
  </div>
{/if}

<style>
  .toast {
    position: fixed;
    bottom: 1.5rem;
    left: 50%;
    transform: translateX(-50%);
    z-index: 1000;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    max-width: min(90vw, 420px);
    padding: 0.75rem 1rem;
    border-radius: 8px;
    border: 1px solid var(--border);
    background: var(--surface);
    box-shadow: 0 4px 16px rgb(0 0 0 / 12%);
    animation: toast-in 0.2s ease-out;
  }

  .toast.success {
    border-color: #a7f3d0;
    background: #ecfdf5;
  }

  .toast.error {
    border-color: #fecaca;
    background: #fef2f2;
  }

  .toast p {
    margin: 0;
    flex: 1;
    font-size: 0.9rem;
    color: var(--text);
  }

  .toast-close {
    padding: 0;
    border: none;
    background: none;
    color: var(--muted);
    font-size: 1.25rem;
    line-height: 1;
    cursor: pointer;
  }

  .toast-close:hover {
    color: var(--text);
  }

  @keyframes toast-in {
    from {
      opacity: 0;
      transform: translateX(-50%) translateY(0.5rem);
    }

    to {
      opacity: 1;
      transform: translateX(-50%) translateY(0);
    }
  }
</style>
