<script lang="ts">
  import { push } from 'svelte-spa-router'
  import BookCard from './BookCard.svelte'
  import {
    activeTab,
    addBook,
    findUserBookByExternalId,
    getUserBookStatus,
  } from '../stores/books'
  import { isAuthenticated } from '../stores/auth'
  import { searchBooks } from '../services/googleBooks'
  import type { Book } from '../types/book'
  import { calculateReadingProgress } from '../types/book'

  let query = $state('')
  let results = $state<Book[]>([])
  let loading = $state(false)
  let errorMessage = $state('')
  let actionError = $state<string | null>(null)
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

      loading = true
      errorMessage = ''
      results = await searchBooks(query)
      loading = false

      if (results.length === 0) {
        errorMessage = 'No se encontraron libros.'
      }
    }, 300)
  }

  async function handleAdd(book: Book) {
    actionError = null

    if (!$isAuthenticated) {
      push('/login')
      return
    }

    if (getUserBookStatus(book.id)) {
      actionError = 'Este libro ya está en tu biblioteca.'
      return
    }

    if ($activeTab === 'dashboard') {
      actionError = 'Selecciona una lista para agregar el libro.'
      return
    }

    try {
      await addBook($activeTab, book)
    } catch (error) {
      actionError =
        error instanceof Error ? error.message : 'No se pudo agregar el libro'
    }
  }

  function searchActionLabel(book: Book): string {
    if (!$isAuthenticated) return 'Iniciar sesión para guardar'

    const status = getUserBookStatus(book.id)
    if (status) return 'Ya en tu biblioteca'

    return 'Agregar'
  }

  function getStatusProgress(bookId: string): number | undefined {
    const userBook = findUserBookByExternalId(bookId)
    if (!userBook || getUserBookStatus(bookId) !== 'READING') return undefined

    if (userBook.pageCount) {
      return calculateReadingProgress(
        userBook.currentPage ?? 0,
        userBook.pageCount,
      )
    }

    return userBook.readingProgress
  }
</script>

<section class="search">
  <label for="search-input">Buscar libros</label>
  <input
    id="search-input"
    type="search"
    placeholder="Título o autor..."
    value={query}
    oninput={handleInput}
  />

  {#if !$isAuthenticated}
    <p class="guest-notice">
      Puedes buscar libros libremente. Para guardarlos en tus listas,
      <button type="button" class="inline-link" onclick={() => push('/login')}>
        inicia sesión
      </button>
      o
      <button type="button" class="inline-link" onclick={() => push('/register')}>
        regístrate
      </button>.
    </p>
  {/if}

  {#if loading}
    <p class="status">Buscando...</p>
  {:else if errorMessage}
    <p class="status error">{errorMessage}</p>
  {:else if actionError}
    <p class="status error">{actionError}</p>
  {/if}

  {#if results.length > 0}
    <div class="results">
      {#each results as book (book.id)}
        <BookCard
          {book}
          userStatus={getUserBookStatus(book.id)}
          statusProgress={getStatusProgress(book.id)}
          actionLabel={searchActionLabel(book)}
          onAction={() => handleAdd(book)}
        />
      {/each}
    </div>
  {/if}
</section>

<style>
  .search label {
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

  .guest-notice {
    margin: 0.75rem 0 0;
    color: var(--muted);
    font-size: 0.9rem;
  }

  .inline-link {
    padding: 0;
    border: none;
    background: none;
    color: var(--primary);
    cursor: pointer;
    font-size: inherit;
    text-decoration: underline;
  }

  .status {
    margin: 0.75rem 0 0;
    color: var(--muted);
  }

  .status.error {
    color: #b42318;
  }

  .results {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    margin-top: 1rem;
  }
</style>
