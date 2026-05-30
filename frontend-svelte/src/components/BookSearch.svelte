<script lang="ts">
  import BookCard from './BookCard.svelte';
  import { addBook, activeTab } from '../stores/books';
  import { searchBooks } from '../services/googleBooks';
  import type { Book } from '../types/book';

  let query = $state('');
  let results = $state<Book[]>([]);
  let loading = $state(false);
  let errorMessage = $state('');
  let debounceTimer: ReturnType<typeof setTimeout> | undefined;

  function handleInput(event: Event) {
    query = (event.target as HTMLInputElement).value;
    clearTimeout(debounceTimer);

    debounceTimer = setTimeout(async () => {
      if (!query.trim()) {
        results = [];
        errorMessage = '';
        return;
      }

      loading = true;
      errorMessage = '';
      results = await searchBooks(query);
      loading = false;

      if (results.length === 0) {
        errorMessage = 'No se encontraron libros.';
      }
    }, 300);
  }

  function handleAdd(book: Book) {
    addBook($activeTab, book);
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

  {#if loading}
    <p class="status">Buscando...</p>
  {:else if errorMessage}
    <p class="status error">{errorMessage}</p>
  {/if}

  {#if results.length > 0}
    <div class="results">
      {#each results as book (book.id)}
        <BookCard
          {book}
          actionLabel="Agregar"
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
