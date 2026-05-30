<script lang="ts">
  import type { Book } from '../types/book';

  interface Props {
    book: Book;
    actionLabel: string;
    onAction: () => void;
  }

  let { book, actionLabel, onAction }: Props = $props();
</script>

<article class="book-card">
  {#if book.thumbnail}
    <img class="cover" src={book.thumbnail} alt="Portada de {book.title}" />
  {:else}
    <div class="cover placeholder">Sin portada</div>
  {/if}

  <div class="info">
    <h3>{book.title}</h3>
    <p>{book.authors.join(', ')}</p>
    <button type="button" onclick={onAction}>{actionLabel}</button>
  </div>
</article>

<style>
  .book-card {
    display: flex;
    gap: 0.75rem;
    padding: 0.75rem;
    border: 1px solid var(--border);
    border-radius: 8px;
    background: var(--surface);
  }

  .cover {
    width: 64px;
    height: 96px;
    object-fit: cover;
    border-radius: 4px;
    flex-shrink: 0;
  }

  .placeholder {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.75rem;
    color: var(--muted);
    background: var(--bg);
    text-align: center;
  }

  .info {
    flex: 1;
    min-width: 0;
  }

  h3 {
    margin: 0 0 0.25rem;
    font-size: 1rem;
  }

  p {
    margin: 0 0 0.5rem;
    color: var(--muted);
    font-size: 0.875rem;
  }

  button {
    padding: 0.35rem 0.75rem;
    border: 1px solid var(--primary);
    border-radius: 4px;
    background: var(--primary);
    color: white;
    cursor: pointer;
    font-size: 0.875rem;
  }

  button:hover {
    opacity: 0.9;
  }
</style>
