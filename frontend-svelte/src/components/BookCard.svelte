<script lang="ts">
  import BookSummaryRow from './BookSummaryRow.svelte'
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
    userStatus,
    statusProgress,
  }: Props = $props()

  const publishedYear = $derived(formatPublishedYear(book.publishedDate))

  let draftPage = $state(0)

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
    push(`/book/${book.id}`)
  }
</script>

<article class="book-card">
  <BookSummaryRow
    volumeId={book.id}
    thumbnail={book.thumbnail}
    title={book.title}
    authors={book.authors.join(', ')}
  >
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
            <button type="button" class="inline-link" onclick={openDetail}>
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
  </BookSummaryRow>
</article>

<style>
  .book-card {
    padding: 0.75rem;
    border: 1px solid var(--border);
    border-radius: 8px;
    background: var(--surface);
  }

  .year {
    margin: 0 0 0.5rem;
    color: var(--muted);
    font-size: 0.8rem;
  }

  .status-tag {
    margin-bottom: 0.5rem;
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
