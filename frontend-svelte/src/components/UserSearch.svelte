<script lang="ts">
  import { push } from 'svelte-spa-router'
  import { followUser } from '../stores/social'
  import { searchUsers } from '../services/users'
  import { isAuthenticated } from '../stores/auth'
  import type { UserSummary } from '../types/social'

  let query = $state('')
  let results = $state<UserSummary[]>([])
  let loading = $state(false)
  let errorMessage = $state('')
  let actionError = $state<string | null>(null)
  let followState = $state<Record<string, 'idle' | 'loading'>>({})
  let debounceTimer: ReturnType<typeof setTimeout> | undefined

  function handleInput(event: Event) {
    query = (event.target as HTMLInputElement).value
    clearTimeout(debounceTimer)

    debounceTimer = setTimeout(async () => {
      if (!query.trim()) {
        results = []
        errorMessage = ''
        return
      }

      if (!$isAuthenticated) {
        push('/login')
        return
      }

      loading = true
      errorMessage = ''
      actionError = null

      try {
        results = await searchUsers(query.trim())
        if (results.length === 0) {
          errorMessage = 'No se encontraron usuarios.'
        }
      } catch (error) {
        errorMessage =
          error instanceof Error ? error.message : 'Error al buscar usuarios'
        results = []
      } finally {
        loading = false
      }
    }, 300)
  }

  async function handleFollow(userId: string) {
    if (!$isAuthenticated) {
      push('/login')
      return
    }

    actionError = null
    followState = { ...followState, [userId]: 'loading' }

    try {
      await followUser(userId)
    } catch (error) {
      actionError =
        error instanceof Error ? error.message : 'No se pudo seguir al usuario'
    } finally {
      followState = { ...followState, [userId]: 'idle' }
    }
  }
</script>

<section class="user-search">
  <label for="user-search-input">Buscar usuarios</label>
  <input
    id="user-search-input"
    type="search"
    placeholder="Nombre..."
    value={query}
    oninput={handleInput}
  />

  {#if loading}
    <p class="status">Buscando...</p>
  {:else if errorMessage}
    <p class="status error">{errorMessage}</p>
  {:else if actionError}
    <p class="status error">{actionError}</p>
  {/if}

  {#if results.length > 0}
    <ul class="results">
      {#each results as person (person.id)}
        <li class="result-item">
          <button
            type="button"
            class="name-link"
            onclick={() => push(`/users/${person.id}`)}
          >
            {person.name}
          </button>
          <button
            type="button"
            class="btn-follow"
            disabled={followState[person.id] === 'loading'}
            onclick={() => handleFollow(person.id)}
          >
            {followState[person.id] === 'loading' ? '...' : 'Seguir'}
          </button>
        </li>
      {/each}
    </ul>
  {/if}
</section>

<style>
  .user-search label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 600;
  }

  input {
    width: 100%;
    padding: 0.6rem 0.75rem;
    border: 1px solid var(--border);
    border-radius: 6px;
    font-size: 1rem;
    box-sizing: border-box;
  }

  .status {
    margin: 0.75rem 0 0;
    color: var(--muted);
  }

  .status.error {
    color: #b42318;
  }

  .results {
    list-style: none;
    margin: 1rem 0 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .result-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.75rem;
    padding: 0.6rem 0.75rem;
    border: 1px solid var(--border);
    border-radius: 6px;
    background: var(--bg);
  }

  .name-link {
    padding: 0;
    border: none;
    background: none;
    color: var(--text);
    font-weight: 500;
    cursor: pointer;
    text-align: left;
  }

  .name-link:hover {
    color: var(--primary);
  }

  .btn-follow {
    padding: 0.35rem 0.75rem;
    border: 1px solid var(--primary);
    border-radius: 4px;
    background: var(--primary);
    color: white;
    cursor: pointer;
    font-size: 0.875rem;
    flex-shrink: 0;
  }

  .btn-follow:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
</style>
