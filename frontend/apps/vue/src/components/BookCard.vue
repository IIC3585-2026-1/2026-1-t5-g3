<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import BookCover from './BookCover.vue'
import BookStatusBadge from './BookStatusBadge.vue'
import type { Book, BookStatus } from '@mybooks/shared'
import { calculateReadingProgress, formatPublishedYear } from '@mybooks/shared'

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

const props = withDefaults(defineProps<Props>(), {
  linkToDetail: true,
})

const displayProgress = computed(() =>
  calculateReadingProgress(props.book.currentPage ?? 0, props.book.pageCount),
)

function handlePageInput(event: Event) {
  if (!props.onPageChange) return
  const value = Number((event.target as HTMLInputElement).value)
  props.onPageChange(value)
}
</script>

<template>
  <article class="book-card">
    <RouterLink
      v-if="linkToDetail"
      :to="`/book/${book.id}`"
      class="cover-link"
    >
      <BookCover
        :volume-id="book.id"
        :src="book.thumbnail"
        :alt="`Portada de ${book.title}`"
        img-class="cover"
        placeholder-class="cover placeholder"
      />
    </RouterLink>

    <BookCover
      v-else
      :volume-id="book.id"
      :src="book.thumbnail"
      :alt="`Portada de ${book.title}`"
      img-class="cover"
      placeholder-class="cover placeholder"
    />

    <div class="info">
      <RouterLink v-if="linkToDetail" :to="`/book/${book.id}`" class="title-link">
        <h3>{{ book.title }}</h3>
      </RouterLink>
      <h3 v-else>{{ book.title }}</h3>

      <p>{{ book.authors.join(', ') }}</p>
      <p v-if="formatPublishedYear(book.publishedDate)" class="year">
        {{ formatPublishedYear(book.publishedDate) }}
      </p>

      <BookStatusBadge
        v-if="userStatus"
        :status="userStatus"
        :reading-progress="statusProgress"
        class="status-tag"
      />

      <div v-if="showProgress" class="progress-block">
        <template v-if="book.pageCount">
          <label :for="`page-${book.userBookId ?? book.id}`">
            Página{{ book.readingProgress === 100 ? ' final' : ' actual' }}
            ({{ displayProgress }}%)
          </label>
          <div class="page-input-row">
            <input
              :id="`page-${book.userBookId ?? book.id}`"
              type="number"
              class="page-input"
              min="0"
              :max="book.pageCount"
              step="1"
              :value="book.currentPage ?? 0"
              @change="handlePageInput"
            />
            <span class="page-total">de {{ book.pageCount }} páginas</span>
          </div>
        </template>
        <p v-else class="progress-warning">
          Sin total de páginas.
          <RouterLink :to="`/book/${book.id}`">Ver detalle</RouterLink>
          para intentar cargarlo.
        </p>
      </div>

      <div class="actions">
        <button type="button" @click="onAction">
          {{ actionLabel }}
        </button>
        <button
          v-if="secondaryActionLabel && onSecondaryAction"
          type="button"
          class="btn-outline"
          @click="onSecondaryAction"
        >
          {{ secondaryActionLabel }}
        </button>
        <button
          v-if="tertiaryActionLabel && onTertiaryAction"
          type="button"
          class="btn-outline"
          @click="onTertiaryAction"
        >
          {{ tertiaryActionLabel }}
        </button>
      </div>
    </div>
  </article>
</template>

<style scoped>
.book-card {
  display: flex;
  gap: 0.75rem;
  padding: 0.75rem;
  border: 1px solid var(--border);
  border-radius: 8px;
  background: var(--surface);
}

.book-card :deep(.cover) {
  width: 64px;
  height: 96px;
  object-fit: cover;
  border-radius: 4px;
  flex-shrink: 0;
}

.cover-link {
  flex-shrink: 0;
  display: block;
}

.title-link {
  text-decoration: none;
  color: inherit;
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

.book-card :deep(.placeholder) {
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

.progress-warning {
  margin: 0;
  font-size: 0.875rem;
  color: var(--muted);
}

.progress-warning a {
  color: var(--primary);
  text-decoration: none;
}

.progress-warning a:hover {
  text-decoration: underline;
}

.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
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

.btn-outline {
  background: var(--surface);
  color: var(--primary);
}
</style>
