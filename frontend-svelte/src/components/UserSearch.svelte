<script lang="ts">
  import { push } from 'svelte-spa-router'
  import { followUser } from '../stores/social'
  import { searchUsers } from '../services/users'
  import { isAuthenticated } from '../stores/auth'
  import type { UserSummary } from '../types/social'
  import { debounce } from '../utils/debounce'
  import { getErrorMessage } from '../utils/error'
  import { showToast } from '../stores/toast'

  let query = $state('')
  let results = $state<UserSummary[]>([])
  let loading = $state(false)
  let errorMessage = $state('')
  let actionError = $state<string | null>(null)
  let followState = $state<Record<string, 'idle' | 'loading'>>({})
  let followedIds = $state<Set<string>>(new Set())

  async function runSearch(searchQuery: string) {
    if (!searchQuery.trim()) {
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
      results = await searchUsers(searchQuery.trim())
      if (results.length === 0) {
        errorMessage = 'No se encontraron usuarios.'
      }
    } catch (error) {
      errorMessage = getErrorMessage(error, 'Error al buscar usuarios')
      results = []
    } finally {
      loading = false
    }
  }

  const debouncedSearch = debounce((searchQuery: string) => {
    void runSearch(searchQuery)
  }, 300)

  function handleInput(event: Event) {
    query = (event.target as HTMLInputElement).value
    debouncedSearch(query)
  }

  async function handleFollow(person: UserSummary) {
    if (!$isAuthenticated) {
      push('/login')
      return
    }

    if (followedIds.has(person.id) || followState[person.id] === 'loading') {
      return
    }

    actionError = null
    followState = { ...followState, [person.id]: 'loading' }

    try {
      await followUser(person.id)
      followedIds = new Set([...followedIds, person.id])
      showToast(`Ahora sigues a ${person.name}`)
    } catch (error) {
      const message = getErrorMessage(error, 'No se pudo seguir al usuario')
      actionError = message
      showToast(message, 'error')
    } finally {
      followState = { ...followState, [person.id]: 'idle' }
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
            class:followed={followedIds.has(person.id)}
            disabled={followState[person.id] === 'loading' || followedIds.has(person.id)}
            onclick={() => handleFollow(person)}
          >
            {#if followState[person.id] === 'loading'}
              <span class="spinner" aria-hidden="true"></span>
              Siguiendo...
            {:else if followedIds.has(person.id)}
              Siguiendo
            {:else}
              Seguir
            {/if}
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
    margin-top: 0.75rem;
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
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    padding: 0.35rem 0.75rem;
    border: 1px solid var(--primary);
    border-radius: 4px;
    background: var(--primary);
    color: white;
    cursor: pointer;
    font-size: 0.875rem;
    flex-shrink: 0;
  }

  .btn-follow.followed {
    border-color: var(--border);
    background: var(--bg);
    color: var(--muted);
  }

  .btn-follow:disabled {
    opacity: 0.85;
    cursor: not-allowed;
  }

  .btn-follow.followed:disabled {
    opacity: 1;
  }
</style>
