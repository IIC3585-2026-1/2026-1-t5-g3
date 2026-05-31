<script lang="ts">
  import type { Snippet } from 'svelte'
  import BookCover from './BookCover.svelte'
  import { push } from 'svelte-spa-router'

  interface Props {
    volumeId: string
    thumbnail?: string
    title: string
    authors: string
    heading?: 'h3' | 'h4'
    children?: Snippet
  }

  let {
    volumeId,
    thumbnail,
    title,
    authors,
    heading = 'h3',
    children,
  }: Props = $props()

  function openDetail() {
    push(`/book/${volumeId}`)
  }
</script>

<div class="book-summary">
  <button type="button" class="cover-link" onclick={openDetail}>
    <BookCover
      {volumeId}
      src={thumbnail}
      alt="Portada de {title}"
      imgClass="cover"
      placeholderClass="cover placeholder"
    />
  </button>

  <div class="info">
    <button type="button" class="title-link" onclick={openDetail}>
      {#if heading === 'h4'}
        <h4>{title}</h4>
      {:else}
        <h3>{title}</h3>
      {/if}
    </button>

    <p class="authors">{authors}</p>

    {@render children?.()}
  </div>
</div>

<style>
  .book-summary {
    display: flex;
    gap: 0.75rem;
    min-width: 0;
  }

  .book-summary :global(.cover) {
    width: 64px;
    height: 96px;
    object-fit: cover;
    border-radius: 4px;
    flex-shrink: 0;
  }

  .book-summary :global(.placeholder) {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 64px;
    height: 96px;
    font-size: 0.75rem;
    color: var(--muted);
    background: var(--bg);
    text-align: center;
    border-radius: 4px;
  }

  .cover-link {
    flex-shrink: 0;
    padding: 0;
    border: none;
    background: none;
    cursor: pointer;
  }

  .title-link {
    padding: 0;
    border: none;
    background: none;
    cursor: pointer;
    text-align: left;
    color: inherit;
    width: 100%;
  }

  .title-link:hover :is(h3, h4) {
    color: var(--primary);
  }

  .info {
    flex: 1;
    min-width: 0;
  }

  h3,
  h4 {
    margin: 0 0 0.25rem;
    line-height: 1.3;
  }

  h3 {
    font-size: 1rem;
  }

  h4 {
    font-size: 0.95rem;
  }

  .authors {
    margin: 0 0 0.5rem;
    color: var(--muted);
    font-size: 0.875rem;
  }
</style>
