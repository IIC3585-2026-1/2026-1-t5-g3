<script lang="ts">
  import { push } from 'svelte-spa-router'
  import ListTabs from '../components/ListTabs.svelte'
  import BookSearch from '../components/BookSearch.svelte'
  import BookList from '../components/BookList.svelte'
  import BookDashboard from '../components/BookDashboard.svelte'
  import FriendRecommendationsCarousel from '../components/FriendRecommendationsCarousel.svelte'
  import { activeTab } from '../stores/books'
  import { logout, user, isAuthenticated } from '../stores/auth'

  function handleLogout() {
    logout()
    push('/')
  }
</script>

<main class="app">
  <header class="app-header">
    <div>
      <h1>Mybooks</h1>
      <p>Gestiona tus listas de libros</p>
    </div>

    {#if $user}
      <div class="user-bar">
        <button
          type="button"
          class="user-name"
          onclick={() => push(`/users/${$user.id}`)}
        >
          {$user.name}
        </button>
        <button type="button" class="btn-secondary" onclick={handleLogout}>
          Cerrar sesión
        </button>
      </div>
    {:else}
      <div class="user-bar">
        <button type="button" class="btn-secondary" onclick={() => push('/login')}>
          Iniciar sesión
        </button>
        <button type="button" class="btn-primary-link" onclick={() => push('/register')}>
          Registrarse
        </button>
      </div>
    {/if}
  </header>

  <div class="layout">
    <aside class="sidebar">
      <ListTabs />
      {#if $isAuthenticated}
        <FriendRecommendationsCarousel />
      {/if}
    </aside>

    <section class="search-panel">
      <BookSearch />
    </section>
  </div>

  <section class="list-panel">
    {#if $activeTab === 'dashboard'}
      <BookDashboard />
    {:else}
      <BookList />
    {/if}
  </section>
</main>

<style>
  .app-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 1rem;
    flex-wrap: wrap;
    margin-bottom: 1.5rem;
  }

  .user-bar {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .user-name {
    color: var(--muted);
    font-size: 0.95rem;
    padding: 0;
    border: none;
    background: none;
    cursor: pointer;
    text-decoration: underline;
  }

  .user-name:hover {
    color: var(--primary);
  }

  .btn-secondary,
  .btn-primary-link {
    padding: 0.4rem 0.75rem;
    border-radius: 6px;
    font-size: 0.875rem;
    cursor: pointer;
    font-family: inherit;
  }

  .btn-secondary {
    border: 1px solid var(--border);
    background: var(--surface);
    color: var(--text);
  }

  .btn-secondary:hover {
    border-color: var(--primary);
  }
</style>
