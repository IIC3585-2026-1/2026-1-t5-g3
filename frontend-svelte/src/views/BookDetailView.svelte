<script lang="ts">
  import BookCover from '../components/BookCover.svelte'
  import BookStatusBadge from '../components/BookStatusBadge.svelte'
  import { getBookDetail } from '../services/googleBooks'
  import {
    findUserBookByExternalId,
    getUserBookStatus,
    lists,
  } from '../stores/books'
  import { goBack } from '../utils/router'
  import type { BookDetail, BookStatus } from '../types/book'
  import {
    calculateReadingProgress,
    formatPublishedYear,
  } from '../types/book'

  interface Props {
    params?: { id?: string }
  }

  let { params = {} }: Props = $props()

  const bookId = $derived(params.id ?? '')

  let book = $state<BookDetail | null>(null)
  let loading = $state(true)
  let errorMessage = $state<string | null>(null)

  const publishedYear = $derived(formatPublishedYear(book?.publishedDate))

  const userStatus = $derived<BookStatus | null>(getUserBookStatus(bookId))

  const userReadingProgress = $derived.by(() => {
    const userBook = findUserBookByExternalId(bookId)
    if (!userBook?.pageCount) return userBook?.readingProgress
    return calculateReadingProgress(
      userBook.currentPage ?? 0,
      userBook.pageCount,
    )
  })

  const languageLabel = $derived.by(() => {
    if (!book?.language) return null
    try {
      return new Intl.DisplayNames(['es'], { type: 'language' }).of(
        book.language,
      )
    } catch {
      return book.language.toUpperCase()
    }
  })

  async function loadDetail(id: string) {
    loading = true
    errorMessage = null

    const detail = await getBookDetail(id)
    const userBook = findUserBookByExternalId(id)

    if (!detail) {
      errorMessage = 'No se pudo cargar la información del libro.'
      book = null
    } else {
      book = userBook
        ? {
            ...detail,
            ...userBook,
            coverUrl: detail.coverUrl,
            thumbnail: detail.thumbnail,
          }
        : detail
    }

    loading = false
  }

  $effect(() => {
    if (bookId) void loadDetail(bookId)
  })

  $effect(() => {
    if (!book || !bookId) return
    void $lists
    const userBook = findUserBookByExternalId(bookId)
    if (userBook) {
      book = {
        ...book,
        ...userBook,
        coverUrl: book.coverUrl,
        thumbnail: book.thumbnail,
      }
    }
  })
</script>

<main class="app detail-page">
  <button type="button" class="back-btn" onclick={goBack}>← Volver</button>

  {#if loading}
    <p class="status">Cargando información del libro...</p>
  {:else if errorMessage}
    <p class="status error">{errorMessage}</p>
  {:else if book}
    <article class="book-detail">
      <div class="hero">
        <BookCover
          volumeId={book.id}
          src={book.coverUrl ?? book.thumbnail}
          alt="Portada de {book.title}"
          size="large"
          imgClass="cover-large"
          placeholderClass="cover-large placeholder"
        />

        <div class="hero-info">
          {#if userStatus}
            <BookStatusBadge
              status={userStatus}
              readingProgress={userReadingProgress}
              size="md"
            />
          {/if}

          <h1>{book.title}</h1>
          {#if book.subtitle}
            <p class="subtitle">{book.subtitle}</p>
          {/if}

          <p class="authors">{book.authors.join(', ')}</p>

          <div class="meta-chips">
            {#if publishedYear}
              <span class="chip">Año: {publishedYear}</span>
            {/if}
            {#if book.publisher}
              <span class="chip">{book.publisher}</span>
            {/if}
            {#if book.pageCount}
              <span class="chip">{book.pageCount} páginas</span>
            {/if}
            {#if languageLabel}
              <span class="chip">{languageLabel}</span>
            {/if}
          </div>

          {#if book.averageRating}
            <div class="rating">
              ★ {book.averageRating.toFixed(1)}
              {#if book.ratingsCount}
                <span>({book.ratingsCount} valoraciones)</span>
              {/if}
            </div>
          {/if}

          {#if book.categories?.length}
            <div class="categories">
              {#each book.categories as category}
                <span class="chip chip-muted">{category}</span>
              {/each}
            </div>
          {/if}

          <div class="external-links">
            {#if book.previewLink}
              <a href={book.previewLink} target="_blank" rel="noopener noreferrer">
                Vista previa
              </a>
            {/if}
            {#if book.infoLink}
              <a href={book.infoLink} target="_blank" rel="noopener noreferrer">
                Ver en Google Books
              </a>
            {/if}
          </div>
        </div>
      </div>

      <section class="detail-section">
        <h2>Descripción</h2>
        {#if book.description}
          <div class="description">{@html book.description}</div>
        {:else}
          <p class="empty">Sin descripción disponible.</p>
        {/if}
      </section>

      <section class="detail-section">
        <h2>Detalles</h2>
        <dl class="details-grid">
          {#if book.publishedDate}
            <dt>Fecha de publicación</dt>
            <dd>{book.publishedDate}</dd>
          {/if}
          {#if book.publisher}
            <dt>Editorial</dt>
            <dd>{book.publisher}</dd>
          {/if}
          {#if book.pageCount}
            <dt>Páginas</dt>
            <dd>{book.pageCount}</dd>
          {/if}
          {#if book.printedPageCount}
            <dt>Páginas impresas</dt>
            <dd>{book.printedPageCount}</dd>
          {/if}
          {#if book.isbn13}
            <dt>ISBN-13</dt>
            <dd>{book.isbn13}</dd>
          {/if}
          {#if book.isbn10}
            <dt>ISBN-10</dt>
            <dd>{book.isbn10}</dd>
          {/if}
          {#if languageLabel}
            <dt>Idioma</dt>
            <dd>{languageLabel}</dd>
          {/if}
          {#if book.maturityRating}
            <dt>Clasificación</dt>
            <dd>{book.maturityRating}</dd>
          {/if}
          {#if book.readingProgress !== undefined && book.pageCount}
            <dt>Tu progreso</dt>
            <dd>
              Página {book.currentPage ?? 0} de {book.pageCount}
              ({calculateReadingProgress(book.currentPage ?? 0, book.pageCount)}%)
            </dd>
          {:else if book.readingProgress !== undefined}
            <dt>Tu progreso</dt>
            <dd>{book.readingProgress}%</dd>
          {/if}
        </dl>
      </section>
    </article>
  {/if}
</main>

<style>
  .detail-page {
    max-width: 900px;
  }

  .book-detail {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 1.5rem;
  }

  .hero {
    display: grid;
    grid-template-columns: 220px 1fr;
    gap: 1.5rem;
    margin-bottom: 1.5rem;
  }

  .book-detail :global(.cover-large) {
    width: 100%;
    max-height: 330px;
    object-fit: contain;
    border-radius: 8px;
    border: 1px solid var(--border);
    background: var(--bg);
  }

  .book-detail :global(.placeholder) {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 280px;
    color: var(--muted);
    width: 100%;
    border-radius: 8px;
    border: 1px solid var(--border);
    background: var(--bg);
  }

  .hero-info h1 {
    margin: 0;
    font-size: 1.75rem;
    line-height: 1.2;
  }

  .subtitle {
    margin: 0.35rem 0 0;
    color: var(--muted);
    font-size: 1.05rem;
  }

  .authors {
    margin: 0.75rem 0;
    font-size: 1.05rem;
    color: var(--text);
  }

  .meta-chips,
  .categories {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-bottom: 0.75rem;
  }

  .chip {
    display: inline-block;
    padding: 0.25rem 0.6rem;
    border-radius: 999px;
    background: var(--bg);
    border: 1px solid var(--border);
    font-size: 0.85rem;
  }

  .chip-muted {
    color: var(--muted);
  }

  .rating {
    margin-bottom: 0.75rem;
    font-weight: 600;
  }

  .rating span {
    color: var(--muted);
    font-weight: 400;
  }

  .external-links {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
  }

  .external-links a {
    color: var(--primary);
    text-decoration: none;
    font-size: 0.95rem;
  }

  .external-links a:hover {
    text-decoration: underline;
  }

  .detail-section {
    margin-top: 1.5rem;
    padding-top: 1.5rem;
    border-top: 1px solid var(--border);
  }

  .detail-section h2 {
    margin: 0 0 0.75rem;
    font-size: 1.125rem;
  }

  .description {
    color: var(--text);
    line-height: 1.7;
    font-size: 0.975rem;
  }

  .description :global(p) {
    margin: 0 0 0.75rem;
  }

  .empty {
    color: var(--muted);
    margin: 0;
  }

  .details-grid {
    display: grid;
    grid-template-columns: 180px 1fr;
    gap: 0.5rem 1rem;
    margin: 0;
  }

  .details-grid dt {
    color: var(--muted);
    font-weight: 600;
  }

  .details-grid dd {
    margin: 0;
  }

  @media (max-width: 640px) {
    .hero {
      grid-template-columns: 1fr;
    }

    .details-grid {
      grid-template-columns: 1fr;
    }

    .details-grid dt {
      margin-top: 0.5rem;
    }
  }
</style>
