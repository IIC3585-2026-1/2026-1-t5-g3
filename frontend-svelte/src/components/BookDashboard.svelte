<script lang="ts">
  import { push } from 'svelte-spa-router'
  import BookCard from './BookCard.svelte'
  import { dashboard, booksError, booksLoading, setActiveTab } from '../stores/books'
  import { isAuthenticated } from '../stores/auth'

  const currentYear = new Date().getFullYear()
</script>

<section class="dashboard">
  <h2>Dashboard {currentYear}</h2>

  {#if $booksLoading}
    <p class="empty">Cargando estadísticas...</p>
  {:else if !$isAuthenticated}
    <div class="guest-panel">
      <p>Inicia sesión para ver tu progreso de lectura del año.</p>
      <button type="button" class="btn-primary-link" onclick={() => push('/login')}>
        Iniciar sesión
      </button>
    </div>
  {:else if $booksError}
    <p class="error">{$booksError}</p>
  {:else if $dashboard}
    <div class="stats">
      <article class="stat-card">
        <span class="stat-value">{$dashboard.readThisYear}</span>
        <span class="stat-label">Leídos este año</span>
      </article>
      <article class="stat-card">
        <span class="stat-value">{$dashboard.reading}</span>
        <span class="stat-label">Leyendo ahora</span>
      </article>
      <article class="stat-card">
        <span class="stat-value">{$dashboard.pending}</span>
        <span class="stat-label">Por leer</span>
      </article>
    </div>

    <section class="dashboard-section">
      <h3>Leyendo ahora</h3>
      {#if $dashboard.readingBooks.length === 0}
        <p class="empty">No tienes libros en lectura activa.</p>
      {:else}
        <div class="items">
          {#each $dashboard.readingBooks as book (book.userBookId ?? book.id)}
            <BookCard
              {book}
              actionLabel="Ir a Leyendo"
              onAction={() => setActiveTab('reading')}
            />
          {/each}
        </div>
      {/if}
    </section>

    <section class="dashboard-section">
      <h3>Leídos en {currentYear}</h3>
      {#if $dashboard.readThisYearBooks.length === 0}
        <p class="empty">Aún no has marcado libros como leídos este año.</p>
      {:else}
        <div class="items">
          {#each $dashboard.readThisYearBooks as book (book.userBookId ?? book.id)}
            <BookCard
              {book}
              actionLabel="Ir a Leídos"
              onAction={() => setActiveTab('read')}
            />
          {/each}
        </div>
      {/if}
    </section>

    <section class="dashboard-section">
      <h3>Pendientes por leer</h3>
      {#if $dashboard.pendingBooks.length === 0}
        <p class="empty">No tienes libros pendientes. Busca algo nuevo.</p>
      {:else}
        <div class="items">
          {#each $dashboard.pendingBooks as book (book.userBookId ?? book.id)}
            <BookCard
              {book}
              actionLabel="Ir a Quiero leer"
              onAction={() => setActiveTab('wantToRead')}
            />
          {/each}
        </div>
      {/if}
    </section>
  {/if}
</section>

<style>
  .dashboard h2 {
    margin: 0 0 1rem;
    font-size: 1.125rem;
  }

  .stats {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem;
    margin-bottom: 1.5rem;
  }

  .stat-card {
    padding: 1rem;
    border: 1px solid var(--border);
    border-radius: 8px;
    background: var(--bg);
    text-align: center;
  }

  .stat-value {
    display: block;
    font-size: 2rem;
    font-weight: 700;
    color: var(--primary);
  }

  .stat-label {
    color: var(--muted);
    font-size: 0.9rem;
  }

  .dashboard-section {
    margin-bottom: 1.5rem;
  }

  .dashboard-section h3 {
    margin: 0 0 0.75rem;
    font-size: 1rem;
  }

  .empty {
    color: var(--muted);
    margin: 0;
  }

  .error {
    color: #b42318;
    margin: 0;
  }

  .guest-panel {
    padding: 1rem;
    border: 1px dashed var(--border);
    border-radius: 8px;
    background: var(--bg);
  }

  .guest-panel p {
    margin: 0 0 1rem;
    color: var(--muted);
  }

  .btn-primary-link {
    padding: 0.5rem 0.85rem;
    border: none;
    border-radius: 6px;
    background: var(--primary);
    color: white;
    cursor: pointer;
    font-size: 0.9rem;
  }

  .items {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  @media (max-width: 640px) {
    .stats {
      grid-template-columns: 1fr;
    }
  }
</style>
