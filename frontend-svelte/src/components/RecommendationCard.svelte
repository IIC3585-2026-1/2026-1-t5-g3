<script lang="ts">
  import BookCover from './BookCover.svelte'
  import { push } from 'svelte-spa-router'
  import type { ProfileRecommendation } from '../types/social'

  interface Props {
    recommendation: ProfileRecommendation
    showUser?: boolean
    compact?: boolean
    removable?: boolean
    onRemove?: (id: string) => void
  }

  let {
    recommendation,
    showUser = false,
    compact = false,
    removable = false,
    onRemove,
  }: Props = $props()

  function stars(rating: number): string {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating)
  }
</script>

<article class="rec-card" class:compact>
  <button
    type="button"
    class="cover-link"
    onclick={() => push(`/book/${recommendation.book.externalApiId}`)}
  >
    <BookCover
      volumeId={recommendation.book.externalApiId}
      src={recommendation.book.thumbnailUrl}
      alt="Portada de {recommendation.book.title}"
      imgClass="cover"
      placeholderClass="cover placeholder"
    />
  </button>

  <div class="info">
    <button
      type="button"
      class="title-link"
      onclick={() => push(`/book/${recommendation.book.externalApiId}`)}
    >
      <h4>{recommendation.book.title}</h4>
    </button>

    <p class="authors">{recommendation.book.authors.join(', ')}</p>

    <p class="rating" title="{recommendation.rating} de 5">
      {stars(recommendation.rating)}
    </p>

    {#if showUser}
      <p class="recommender">
        Recomendado por
        <button
          type="button"
          class="inline-link"
          onclick={() => push(`/users/${recommendation.user.id}`)}
        >
          {recommendation.user.name}
        </button>
      </p>
    {/if}

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
  </div>
</article>

<style>
  .rec-card {
    display: flex;
    gap: 0.75rem;
    padding: 0.75rem;
    border: 1px solid var(--border);
    border-radius: 8px;
    background: var(--surface);
  }

  .rec-card.compact {
    flex-direction: column;
    padding: 0.5rem;
  }

  .rec-card :global(.cover) {
    width: 64px;
    height: 96px;
    object-fit: cover;
    border-radius: 4px;
    flex-shrink: 0;
  }

  .rec-card.compact :global(.cover) {
    width: 100%;
    height: 120px;
  }

  .cover-link,
  .title-link {
    padding: 0;
    border: none;
    background: none;
    cursor: pointer;
    text-align: left;
    color: inherit;
  }

  .cover-link {
    flex-shrink: 0;
  }

  .title-link:hover h4 {
    color: var(--primary);
  }

  h4 {
    margin: 0 0 0.25rem;
    font-size: 0.95rem;
    line-height: 1.3;
  }

  .authors,
  .recommender,
  .message {
    margin: 0 0 0.35rem;
    color: var(--muted);
    font-size: 0.8rem;
  }

  .rating {
    margin: 0 0 0.35rem;
    color: #d97706;
    font-size: 0.85rem;
    letter-spacing: 0.05em;
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

  .message {
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
    border-color: #b42318;
    color: #b42318;
  }
</style>
