<script lang="ts">
  import BookCard from './BookCard.svelte';
  import { activeList, activeTab, removeBook } from '../stores/books';
  import { LIST_LABELS } from '../types/book';
</script>

<section class="book-list">
  <h2>{LIST_LABELS[$activeTab]} ({$activeList.length})</h2>

  {#if $activeList.length === 0}
    <p class="empty">No hay libros en esta lista.</p>
  {:else}
    <div class="items">
      {#each $activeList as book (book.id)}
        <BookCard
          {book}
          actionLabel="Quitar"
          onAction={() => removeBook($activeTab, book.id)}
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

  .items {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }
</style>
