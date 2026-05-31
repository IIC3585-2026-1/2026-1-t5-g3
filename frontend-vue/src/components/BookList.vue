<script setup lang="ts">
import BookCard from './BookCard.vue'
import { activeList, activeTab, removeBook } from '../stores/books'
import { LIST_LABELS } from '../types/book'
</script>

<template>
  <section class="book-list">
    <h2>{{ LIST_LABELS[activeTab] }} ({{ activeList.length }})</h2>

    <p v-if="activeList.length === 0" class="empty">
      No hay libros en esta lista.
    </p>

    <div v-else class="items">
      <BookCard
        v-for="book in activeList"
        :key="book.id"
        :book="book"
        action-label="Quitar"
        :on-action="() => removeBook(activeTab, book.id)"
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

.items {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}
</style>
