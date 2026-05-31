<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getBookDetail } from '../services/googleBooks'
import { findUserBookByExternalId, getUserBookStatus, lists } from '../stores/books'
import type { BookDetail, BookStatus } from '@mybooks/shared'
import { calculateReadingProgress, formatPublishedYear } from '@mybooks/shared'
import BookCover from '../components/BookCover.vue'
import BookStatusBadge from '../components/BookStatusBadge.vue'

const route = useRoute()
const router = useRouter()

const book = ref<BookDetail | null>(null)
const loading = ref(true)
const errorMessage = ref<string | null>(null)

const publishedYear = computed(() => formatPublishedYear(book.value?.publishedDate))

const userStatus = computed<BookStatus | null>(() => {
  const id = route.params.id
  if (typeof id !== 'string' || !id) return null
  return getUserBookStatus(id)
})

const userReadingProgress = computed(() => {
  const id = route.params.id
  if (typeof id !== 'string' || !id) return undefined
  const userBook = findUserBookByExternalId(id)
  if (!userBook?.pageCount) return userBook?.readingProgress
  return calculateReadingProgress(userBook.currentPage ?? 0, userBook.pageCount)
})

const languageLabel = computed(() => {
  if (!book.value?.language) return null
  try {
    return new Intl.DisplayNames(['es'], { type: 'language' }).of(book.value.language)
  } catch {
    return book.value.language.toUpperCase()
  }
})

onMounted(async () => {
  const id = route.params.id
  if (typeof id !== 'string' || !id) {
    errorMessage.value = 'Libro no encontrado.'
    loading.value = false
    return
  }

  loading.value = true
  errorMessage.value = null

  const detail = await getBookDetail(id)
  const userBook = findUserBookByExternalId(id)

  if (!detail) {
    errorMessage.value = 'No se pudo cargar la información del libro.'
    book.value = null
  } else {
    book.value = userBook
      ? { ...detail, ...userBook, coverUrl: detail.coverUrl, thumbnail: detail.thumbnail }
      : detail
  }

  loading.value = false
})

watch(
  () => lists.value,
  () => {
    const id = route.params.id
    if (typeof id !== 'string' || !id || !book.value) return

    const userBook = findUserBookByExternalId(id)
    if (userBook) {
      book.value = {
        ...book.value,
        ...userBook,
        coverUrl: book.value.coverUrl,
        thumbnail: book.value.thumbnail,
      }
    }
  },
  { deep: true },
)

function goBack() {
  if (window.history.length > 1) {
    router.back()
    return
  }
  router.push('/')
}
</script>

<template>
  <main class="app detail-page">
    <button type="button" class="back-btn" @click="goBack">
      ← Volver
    </button>

    <p v-if="loading" class="status">Cargando información del libro...</p>
    <p v-else-if="errorMessage" class="status error">{{ errorMessage }}</p>

    <article v-else-if="book" class="book-detail">
      <div class="hero">
        <BookCover
          :volume-id="book.id"
          :src="book.coverUrl ?? book.thumbnail"
          :alt="`Portada de ${book.title}`"
          size="large"
          img-class="cover-large"
          placeholder-class="cover-large placeholder"
        />

        <div class="hero-info">
          <BookStatusBadge
            v-if="userStatus"
            :status="userStatus"
            :reading-progress="userReadingProgress"
            size="md"
            class="library-status"
          />

          <h1>{{ book.title }}</h1>
          <p v-if="book.subtitle" class="subtitle">{{ book.subtitle }}</p>

          <p class="authors">{{ book.authors.join(', ') }}</p>

          <div class="meta-chips">
            <span v-if="publishedYear" class="chip">Año: {{ publishedYear }}</span>
            <span v-if="book.publisher" class="chip">{{ book.publisher }}</span>
            <span v-if="book.pageCount" class="chip">{{ book.pageCount }} páginas</span>
            <span v-if="languageLabel" class="chip">{{ languageLabel }}</span>
          </div>

          <div v-if="book.averageRating" class="rating">
            ★ {{ book.averageRating.toFixed(1) }}
            <span v-if="book.ratingsCount">({{ book.ratingsCount }} valoraciones)</span>
          </div>

          <div v-if="book.categories?.length" class="categories">
            <span
              v-for="category in book.categories"
              :key="category"
              class="chip chip-muted"
            >
              {{ category }}
            </span>
          </div>

          <div class="external-links">
            <a
              v-if="book.previewLink"
              :href="book.previewLink"
              target="_blank"
              rel="noopener noreferrer"
            >
              Vista previa
            </a>
            <a
              v-if="book.infoLink"
              :href="book.infoLink"
              target="_blank"
              rel="noopener noreferrer"
            >
              Ver en Google Books
            </a>
          </div>
        </div>
      </div>

      <section class="detail-section">
        <h2>Descripción</h2>
        <div
          v-if="book.description"
          class="description"
          v-html="book.description"
        />
        <p v-else class="empty">Sin descripción disponible.</p>
      </section>

      <section class="detail-section">
        <h2>Detalles</h2>
        <dl class="details-grid">
          <template v-if="book.publishedDate">
            <dt>Fecha de publicación</dt>
            <dd>{{ book.publishedDate }}</dd>
          </template>
          <template v-if="book.publisher">
            <dt>Editorial</dt>
            <dd>{{ book.publisher }}</dd>
          </template>
          <template v-if="book.pageCount">
            <dt>Páginas</dt>
            <dd>{{ book.pageCount }}</dd>
          </template>
          <template v-if="book.printedPageCount">
            <dt>Páginas impresas</dt>
            <dd>{{ book.printedPageCount }}</dd>
          </template>
          <template v-if="book.isbn13">
            <dt>ISBN-13</dt>
            <dd>{{ book.isbn13 }}</dd>
          </template>
          <template v-if="book.isbn10">
            <dt>ISBN-10</dt>
            <dd>{{ book.isbn10 }}</dd>
          </template>
          <template v-if="languageLabel">
            <dt>Idioma</dt>
            <dd>{{ languageLabel }}</dd>
          </template>
          <template v-if="book.maturityRating">
            <dt>Clasificación</dt>
            <dd>{{ book.maturityRating }}</dd>
          </template>
          <template v-if="book.readingProgress !== undefined && book.pageCount">
            <dt>Tu progreso</dt>
            <dd>
              Página {{ book.currentPage ?? 0 }} de {{ book.pageCount }}
              ({{ calculateReadingProgress(book.currentPage ?? 0, book.pageCount) }}%)
            </dd>
          </template>
          <template v-else-if="book.readingProgress !== undefined">
            <dt>Tu progreso</dt>
            <dd>{{ book.readingProgress }}%</dd>
          </template>
        </dl>
      </section>
    </article>
  </main>
</template>

<style scoped>
.detail-page {
  max-width: 900px;
}

.back-btn {
  margin-bottom: 1rem;
  padding: 0.4rem 0.75rem;
  border: 1px solid var(--border);
  border-radius: 6px;
  background: var(--surface);
  color: var(--text);
  cursor: pointer;
  font-size: 0.9rem;
}

.back-btn:hover {
  border-color: var(--primary);
}

.status {
  color: var(--muted);
}

.status.error {
  color: #b42318;
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

.book-detail :deep(.cover-large) {
  width: 100%;
  max-height: 330px;
  object-fit: contain;
  border-radius: 8px;
  border: 1px solid var(--border);
  background: var(--bg);
}

.book-detail :deep(.placeholder) {
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

.library-status {
  margin-bottom: 0.75rem;
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

.description :deep(p) {
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

  .cover-large {
    max-height: 360px;
  }

  .details-grid {
    grid-template-columns: 1fr;
  }

  .details-grid dt {
    margin-top: 0.5rem;
  }
}
</style>
