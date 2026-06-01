<script setup lang="ts">
import BookCard from './BookCard.vue'
import GuestPrompt from './GuestPrompt.vue'
import {
  activeList,
  activeTab,
  booksError,
  booksLoading,
  markAsRead,
  moveToReading,
  moveToWantToRead,
  removeBook,
  startReading,
  updateReadingProgress,
} from '../stores/books'
import { isAuthenticated } from '../stores/auth'
import { LIST_LABELS, type Book } from '@mybooks/shared'

async function handleRemove(book: Book) {
  if (activeTab.value === 'dashboard') return

  try {
    await removeBook(activeTab.value, book)
  } catch {
    // booksError is set in the store
  }
}

function handlePageChange(book: Book, currentPage: number) {
  updateReadingProgress(book, currentPage)
}
</script>

<template>
  <section class="book-list">
    <h2>{{ LIST_LABELS[activeTab] }} ({{ activeList.length }})</h2>

    <p v-if="booksLoading" class="empty">Cargando tus libros...</p>

    <GuestPrompt
      v-else-if="!isAuthenticated"
      message="Inicia sesión para guardar libros, marcarlos como leídos y ver tu dashboard."
    />

    <p v-else-if="booksError" class="error">{{ booksError }}</p>

    <p v-else-if="activeList.length === 0" class="empty">
      <template v-if="activeTab === 'reading'">
        No tienes libros en lectura. Empieza uno desde "Quiero leer".
      </template>
      <template v-else>
        No hay libros en esta lista.
      </template>
    </p>

    <div v-else class="items">
      <BookCard
        v-for="book in activeList"
        :key="book.userBookId ?? book.id"
        :book="book"
        action-label="Quitar"
        :on-action="() => handleRemove(book)"
        :secondary-action-label="
          activeTab === 'wantToRead'
            ? 'Empezar a leer'
            : activeTab === 'read'
              ? 'Volver a leer'
              : undefined
        "
        :on-secondary-action="
          activeTab === 'wantToRead'
            ? () => startReading(book)
            : activeTab === 'read'
              ? () => moveToReading(book)
              : undefined
        "
        :tertiary-action-label="
          activeTab === 'wantToRead'
            ? 'Marcar leído'
            : activeTab === 'read'
              ? 'Mover a Quiero leer'
              : undefined
        "
        :on-tertiary-action="
          activeTab === 'wantToRead'
            ? () => markAsRead(book)
            : activeTab === 'read'
              ? () => moveToWantToRead(book)
              : undefined
        "
        :show-progress="activeTab === 'reading' || activeTab === 'read'"
        :on-page-change="
          activeTab === 'reading' || activeTab === 'read'
            ? (currentPage) => handlePageChange(book, currentPage)
            : undefined
        "
      />
    </div>
  </section>
</template>

<style scoped>
.book-list h2 {
  margin: 0 0 1rem;
  font-size: 1.125rem;
}

.empty {
  color: var(--muted);
  margin: 0;
}

.error {
  color: #b42318;
  margin: 0;
}

.items {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}
</style>
