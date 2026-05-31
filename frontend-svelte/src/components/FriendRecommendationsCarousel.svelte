<script lang="ts">
  import BookCover from './BookCover.svelte'
  import {
    friendsRecommendations,
    friendsRecommendationsError,
    friendsRecommendationsLoading,
  } from '../stores/social'
  import { push } from 'svelte-spa-router'
  import { formatStars } from '../utils/stars'

  let currentIndex = $state(0)

  const current = $derived($friendsRecommendations[currentIndex] ?? null)
  const hasItems = $derived($friendsRecommendations.length > 0)

  function prev() {
    if (!hasItems) return
    currentIndex =
      (currentIndex - 1 + $friendsRecommendations.length) %
      $friendsRecommendations.length
  }

  function next() {
    if (!hasItems) return
    currentIndex = (currentIndex + 1) % $friendsRecommendations.length
  }
</script>

<section class="carousel">
  <h3 class="carousel-title">De tus amigos</h3>

  {#if $friendsRecommendationsLoading}
    <p class="status">Cargando...</p>
  {:else if $friendsRecommendationsError}
    <p class="status error">{$friendsRecommendationsError}</p>
  {:else if !hasItems}
    <p class="status">Tus amigos aún no han recomendado libros.</p>
  {:else if current}
    <div class="carousel-controls">
      <button type="button" class="nav-btn" aria-label="Anterior" onclick={prev}>
        ↑
      </button>
      <span class="counter">
        {currentIndex + 1}/{$friendsRecommendations.length}
      </span>
      <button type="button" class="nav-btn" aria-label="Siguiente" onclick={next}>
        ↓
      </button>
    </div>

    <div class="slide">
      <button
        type="button"
        class="slide-book"
        onclick={() => push(`/book/${current.book.externalApiId}`)}
      >
        <BookCover
          volumeId={current.book.externalApiId}
          src={current.book.thumbnailUrl}
          alt="Portada de {current.book.title}"
          imgClass="slide-cover"
          placeholderClass="slide-cover placeholder"
        />

        <p class="slide-title">{current.book.title}</p>
        <p class="slide-rating">{formatStars(current.rating)}</p>
      </button>
      <p class="slide-user">
        <button
          type="button"
          class="inline-link"
          onclick={() => push(`/users/${current.user.id}`)}
        >
          {current.user.name}
        </button>
      </p>
    </div>
  {/if}
</section>

<style>
  .carousel {
    margin-top: 1.25rem;
    padding-top: 1rem;
    border-top: 1px solid var(--border);
  }

  .carousel-title {
    margin: 0 0 0.75rem;
    font-size: 0.85rem;
    font-weight: 600;
    color: var(--muted);
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }

  .carousel-controls {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 0.5rem;
  }

  .nav-btn {
    width: 1.75rem;
    height: 1.75rem;
    border: 1px solid var(--border);
    border-radius: 4px;
    background: var(--surface);
    cursor: pointer;
    font-size: 0.75rem;
    line-height: 1;
  }

  .nav-btn:hover {
    border-color: var(--primary);
  }

  .counter {
    font-size: 0.75rem;
    color: var(--muted);
  }

  .slide {
    display: block;
    width: 100%;
  }

  .slide-book {
    display: block;
    width: 100%;
    padding: 0;
    border: none;
    background: none;
    cursor: pointer;
    text-align: left;
    color: inherit;
  }

  .slide-book :global(.slide-cover) {
    width: 100%;
    height: 140px;
    object-fit: cover;
    border-radius: 6px;
    border: 1px solid var(--border);
  }

  .slide-book :global(.placeholder) {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 140px;
    color: var(--muted);
    font-size: 0.75rem;
    border: 1px solid var(--border);
    border-radius: 6px;
    background: var(--bg);
  }

  .slide-title {
    margin: 0.5rem 0 0.25rem;
    font-size: 0.8rem;
    font-weight: 600;
    line-height: 1.3;
    display: -webkit-box;
    line-clamp: 2;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .slide-rating {
    margin: 0;
    color: #d97706;
    font-size: 0.75rem;
  }

  .slide-user {
    margin: 0.25rem 0 0;
    font-size: 0.75rem;
  }
</style>
