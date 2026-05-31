<script lang="ts">
  import BookSummaryRow from './BookSummaryRow.svelte'
  import type { ProfileRecommendation } from '../types/social'
  import { formatStars } from '../utils/stars'

  interface Props {
    recommendation: ProfileRecommendation
    removable?: boolean
    onRemove?: (id: string) => void
  }

  let {
    recommendation,
    removable = false,
    onRemove,
  }: Props = $props()
</script>

<article class="rec-card">
  <BookSummaryRow
    volumeId={recommendation.book.externalApiId}
    thumbnail={recommendation.book.thumbnailUrl}
    title={recommendation.book.title}
    authors={recommendation.book.authors.join(', ')}
    heading="h4"
  >
    <p class="rating" title="{recommendation.rating} de 5">
      {formatStars(recommendation.rating)}
    </p>

    {#if recommendation.message}
      <p class="message">{recommendation.message}</p>
    {/if}

    {#if removable && onRemove}
      <button
        type="button"
        class="btn-remove"
        onclick={() => onRemove(recommendation.id)}
      >
        Quitar
      </button>
    {/if}
  </BookSummaryRow>
</article>

<style>
  .rec-card {
    padding: 0.75rem;
    border: 1px solid var(--border);
    border-radius: 8px;
    background: var(--surface);
  }

  .rating {
    margin: 0 0 0.35rem;
    color: #d97706;
    font-size: 0.85rem;
    letter-spacing: 0.05em;
  }

  .message {
    margin: 0 0 0.35rem;
    color: var(--muted);
    font-size: 0.8rem;
    font-style: italic;
  }

  .btn-remove {
    margin-top: 0.35rem;
    padding: 0.3rem 0.6rem;
    border: 1px solid var(--border);
    border-radius: 4px;
    background: var(--surface);
    color: var(--text);
    cursor: pointer;
    font-size: 0.8rem;
  }

  .btn-remove:hover {
    border-color: var(--error);
    color: var(--error);
  }
</style>
