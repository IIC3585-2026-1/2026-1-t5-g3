<script lang="ts">
  import BookCover from './BookCover.svelte'
  import BookStatusBadge from './BookStatusBadge.svelte'
  import { push } from 'svelte-spa-router'
  import type { Book, BookStatus } from '../types/book'
  import { calculateReadingProgress, formatPublishedYear } from '../types/book'

  interface Props {
    book: Book
    actionLabel: string
    onAction: () => void
    secondaryActionLabel?: string
    onSecondaryAction?: () => void
    tertiaryActionLabel?: string
    onTertiaryAction?: () => void
    showProgress?: boolean
    onPageChange?: (currentPage: number) => void
    linkToDetail?: boolean
    userStatus?: BookStatus | null
    statusProgress?: number
  }

  let {
    book,
    actionLabel,
    onAction,
    secondaryActionLabel,
    onSecondaryAction,
    tertiaryActionLabel,
    onTertiaryAction,
    showProgress = false,
    onPageChange,
    linkToDetail = true,
    userStatus,
    statusProgress,
  }: Props = $props()

  const publishedYear = $derived(formatPublishedYear(book.publishedDate))

  let draftPage = $state(book.currentPage ?? 0)

  $effect(() => {
    draftPage = book.currentPage ?? 0
  })

  const draftProgress = $derived(
    calculateReadingProgress(draftPage, book.pageCount),
  )

  function applyPageUpdate() {
    if (!onPageChange || !book.pageCount) return
    const clamped = Math.min(
      Math.max(0, draftPage),
      book.pageCount,
    )
    draftPage = clamped
    onPageChange(clamped)
  }

  function handlePageKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      event.preventDefault()
      applyPageUpdate()
    }
  }

  function openDetail() {
    if (linkToDetail) push(`/book/${book.id}`)
  }
</script>

<article class="book-card">
  {#if linkToDetail}
    <button type="button" class="cover-link" onclick={openDetail}>
      <BookCover
        volumeId={book.id}
        src={book.thumbnail}
        alt="Portada de {book.title}"
        imgClass="cover"
        placeholderClass="cover placeholder"
      />
    </button>
  {:else}
    <BookCover
      volumeId={book.id}
      src={book.thumbnail}
      alt="Portada de {book.title}"
      imgClass="cover"
      placeholderClass="cover placeholder"
    />
  {/if}

  <div class="info">
    {#if linkToDetail}
      <button type="button" class="title-link" onclick={openDetail}>
        <h3>{book.title}</h3>
      </button>
    {:else}
      <h3>{book.title}</h3>
    {/if}

    <p>{book.authors.join(', ')}</p>
    {#if publishedYear}
      <p class="year">{publishedYear}</p>
    {/if}

    {#if userStatus}
      <div class="status-tag">
        <BookStatusBadge status={userStatus} readingProgress={statusProgress} />
      </div>
    {/if}

    {#if showProgress}
      <div class="progress-block">
        {#if book.pageCount}
          <label for="page-{book.userBookId ?? book.id}">
            Página{book.readingProgress === 100 ? ' final' : ' actual'}
            ({draftProgress}%)
          </label>
          <div class="page-input-row">
            <input
              id="page-{book.userBookId ?? book.id}"
              type="number"
              class="page-input"
              min="0"
              max={book.pageCount}
              step="1"
              bind:value={draftPage}
              onkeydown={handlePageKeydown}
            />
            <span class="page-total">de {book.pageCount} páginas</span>
            <button
              type="button"
              class="btn-update-page"
              onclick={applyPageUpdate}
            >
              Actualizar
            </button>
          </div>
        {:else}
          <p class="progress-warning">
            Sin total de páginas.
            <button type="button" class="text-link" onclick={openDetail}>
              Ver detalle
            </button>
            para intentar cargarlo.
          </p>
        {/if}
      </div>
    {/if}

    <div class="actions">
      <button type="button" onclick={onAction}>{actionLabel}</button>
      {#if secondaryActionLabel && onSecondaryAction}
        <button type="button" class="btn-outline" onclick={onSecondaryAction}>
          {secondaryActionLabel}
        </button>
      {/if}
      {#if tertiaryActionLabel && onTertiaryAction}
        <button type="button" class="btn-outline" onclick={onTertiaryAction}>
          {tertiaryActionLabel}
        </button>
      {/if}
    </div>
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

  .book-card :global(.cover) {
    width: 64px;
    height: 96px;
    object-fit: cover;
    border-radius: 4px;
    flex-shrink: 0;
  }

  .cover-link {
    flex-shrink: 0;
    display: block;
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

  .title-link:hover h3 {
    color: var(--primary);
  }

  .year {
    font-size: 0.8rem;
  }

  .status-tag {
    margin-bottom: 0.5rem;
  }

  .book-card :global(.placeholder) {
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

  .progress-block {
    margin-bottom: 0.75rem;
  }

  .progress-block label {
    display: block;
    margin-bottom: 0.35rem;
    font-size: 0.875rem;
    font-weight: 600;
  }

  .page-input-row {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    flex-wrap: wrap;
  }

  .page-input {
    width: 5rem;
    padding: 0.35rem 0.5rem;
    border: 1px solid var(--border);
    border-radius: 4px;
    font-size: 0.875rem;
  }

  .page-total {
    color: var(--muted);
    font-size: 0.875rem;
  }

  .btn-update-page {
    padding: 0.35rem 0.75rem;
    border: 1px solid var(--primary);
    border-radius: 4px;
    background: var(--surface);
    color: var(--primary);
    cursor: pointer;
    font-size: 0.875rem;
  }

  .btn-update-page:hover {
    background: var(--primary);
    color: white;
  }

  .progress-warning {
    margin: 0;
    font-size: 0.875rem;
    color: var(--muted);
  }

  .text-link {
    padding: 0;
    border: none;
    background: none;
    color: var(--primary);
    cursor: pointer;
    font-size: inherit;
    text-decoration: underline;
  }

  .actions {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .actions button {
    padding: 0.35rem 0.75rem;
    border: 1px solid var(--primary);
    border-radius: 4px;
    background: var(--primary);
    color: white;
    cursor: pointer;
    font-size: 0.875rem;
  }

  .actions button:hover {
    opacity: 0.9;
  }

  .btn-outline {
    background: var(--surface);
    color: var(--primary);
  }
</style>
