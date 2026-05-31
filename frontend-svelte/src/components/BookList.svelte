<script lang="ts">
  import { push } from 'svelte-spa-router'
  import BookCard from './BookCard.svelte'
  import {
    activeList,
    activeTab,
    booksError,
    booksLoading,
    markAsRead,
    moveToReading,
    moveToWantToRead,
    removeBook,
    startReading,
    updateReadingProgress,
  } from '../stores/books'
  import { isAuthenticated } from '../stores/auth'
  import { LIST_LABELS, type Book } from '../types/book'

  async function handleRemove(book: Book) {
    if ($activeTab === 'dashboard') return

    try {
      await removeBook($activeTab, book)
    } catch {
      // booksError is set in the store
    }
  }

  function handlePageChange(book: Book, currentPage: number) {
    updateReadingProgress(book, currentPage)
  }
</script>

<section class="book-list">
  <h2>{LIST_LABELS[$activeTab]} ({$activeList.length})</h2>

  {#if $booksLoading}
    <p class="empty">Cargando tus libros...</p>
  {:else if !$isAuthenticated}
    <div class="guest-panel">
      <p>
        Inicia sesión para guardar libros, marcarlos como leídos y ver tu
        dashboard.
      </p>
      <div class="guest-actions">
        <button type="button" class="btn-primary-link" onclick={() => push('/login')}>
          Iniciar sesión
        </button>
        <button type="button" class="btn-outline-link" onclick={() => push('/register')}>
          Registrarse
        </button>
      </div>
    </div>
  {:else if $booksError}
    <p class="error">{$booksError}</p>
  {:else if $activeList.length === 0}
    <p class="empty">
      {#if $activeTab === 'reading'}
        No tienes libros en lectura. Empieza uno desde "Quiero leer".
      {:else}
        No hay libros en esta lista.
      {/if}
    </p>
  {:else}
    <div class="items">
      {#each $activeList as book (book.userBookId ?? book.id)}
        <BookCard
          {book}
          actionLabel="Quitar"
          onAction={() => handleRemove(book)}
          secondaryActionLabel={$activeTab === 'wantToRead'
            ? 'Empezar a leer'
            : $activeTab === 'read'
              ? 'Volver a leer'
              : undefined}
          onSecondaryAction={$activeTab === 'wantToRead'
            ? () => startReading(book)
            : $activeTab === 'read'
              ? () => moveToReading(book)
              : undefined}
          tertiaryActionLabel={$activeTab === 'wantToRead'
            ? 'Marcar leído'
            : $activeTab === 'read'
              ? 'Mover a Quiero leer'
              : undefined}
          onTertiaryAction={$activeTab === 'wantToRead'
            ? () => markAsRead(book)
            : $activeTab === 'read'
              ? () => moveToWantToRead(book)
              : undefined}
          showProgress={$activeTab === 'reading' || $activeTab === 'read'}
          onPageChange={$activeTab === 'reading' || $activeTab === 'read'
            ? (currentPage) => handlePageChange(book, currentPage)
            : undefined}
        />
      {/each}
    </div>
  {/if}
</section>

<style>
  .book-list h2 {
    margin: 0 0 1rem;
    font-size: 1.125rem;
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

  .guest-actions {
    display: flex;
    gap: 0.75rem;
    flex-wrap: wrap;
  }

  .btn-primary-link,
  .btn-outline-link {
    padding: 0.5rem 0.85rem;
    border-radius: 6px;
    font-size: 0.9rem;
    cursor: pointer;
  }

  .btn-primary-link {
    border: none;
    background: var(--primary);
    color: white;
  }

  .btn-outline-link {
    border: 1px solid var(--border);
    color: var(--text);
    background: var(--surface);
  }

  .items {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }
</style>
