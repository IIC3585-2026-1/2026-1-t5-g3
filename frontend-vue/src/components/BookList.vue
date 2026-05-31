<script setup lang="ts">
import BookCard from './BookCard.vue'
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
import { LIST_LABELS, type Book } from '../types/book'

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

    <div v-else-if="!isAuthenticated" class="guest-panel">
      <p>Inicia sesión para guardar libros, marcarlos como leídos y ver tu dashboard.</p>
      <div class="guest-actions">
        <RouterLink to="/login" class="btn-primary-link">Iniciar sesión</RouterLink>
        <RouterLink to="/register" class="btn-outline-link">Registrarse</RouterLink>
      </div>
    </div>

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

.guest-panel {
  padding: 1rem;
  border: 1px dashed var(--border);
  border-radius: 8px;
  background: var(--bg);
}

.guest-panel p {
  margin: 0 0 1rem;
  color: var(--muted);
}

.guest-actions {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.btn-primary-link,
.btn-outline-link {
  display: inline-block;
  padding: 0.5rem 0.85rem;
  border-radius: 6px;
  text-decoration: none;
  font-size: 0.9rem;
}

.btn-primary-link {
  background: var(--primary);
  color: white;
}

.btn-outline-link {
  border: 1px solid var(--border);
  color: var(--text);
  background: var(--surface);
}

.items {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}
</style>
