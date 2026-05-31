<script lang="ts">
  import BookCard from './BookCard.svelte'
  import GuestPrompt from './GuestPrompt.svelte'
  import { dashboard, booksError, booksLoading, setActiveTab } from '../stores/books'
  import { isAuthenticated } from '../stores/auth'

  const currentYear = new Date().getFullYear()
</script>

<section class="dashboard">
  <h2>Dashboard {currentYear}</h2>

  {#if $booksLoading}
    <p class="empty">Cargando estadísticas...</p>
  {:else if !$isAuthenticated}
    <GuestPrompt
      message="Inicia sesión para ver tu progreso de lectura del año."
      showRegister={false}
    />
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
    margin-bottom: 1.5rem;
  }

  .stat-value {
    color: var(--primary);
    font-size: 2rem;
  }

  .dashboard-section {
    margin-bottom: 1.5rem;
  }

  .dashboard-section h3 {
    margin: 0 0 0.75rem;
    font-size: 1rem;
  }

  .items {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }
</style>
