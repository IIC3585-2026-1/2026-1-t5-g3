<script setup lang="ts">
import { ref } from 'vue'
import BookCard from './BookCard.vue'
import { activeTab, addBook } from '../stores/books'
import { searchBooks } from '../services/googleBooks'
import type { Book } from '../types/book'

const query = ref('')
const results = ref<Book[]>([])
const loading = ref(false)
const errorMessage = ref('')
let debounceTimer: ReturnType<typeof setTimeout> | undefined

function handleInput(event: Event) {
  query.value = (event.target as HTMLInputElement).value
  clearTimeout(debounceTimer)

  debounceTimer = setTimeout(async () => {
    if (!query.value.trim()) {
      results.value = []
      errorMessage.value = ''
      return
    }

    loading.value = true
    errorMessage.value = ''
    results.value = await searchBooks(query.value)
    loading.value = false

    if (results.value.length === 0) {
      errorMessage.value = 'No se encontraron libros.'
    }
  }, 300)
}

function handleAdd(book: Book) {
  addBook(activeTab.value, book)
}
</script>

<template>
  <section class="search">
    <label for="search-input">Buscar libros</label>
    <input
      id="search-input"
      type="search"
      placeholder="Título o autor..."
      :value="query"
      @input="handleInput"
    />

    <p v-if="loading" class="status">Buscando...</p>
    <p v-else-if="errorMessage" class="status error">{{ errorMessage }}</p>

    <div v-if="results.length > 0" class="results">
      <BookCard
        v-for="book in results"
        :key="book.id"
        :book="book"
        action-label="Agregar"
        :on-action="() => handleAdd(book)"
      />
    </div>
  </section>
</template>

<style scoped>
.search label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
}

input {
  width: 100%;
  padding: 0.6rem 0.75rem;
  border: 1px solid var(--border);
  border-radius: 6px;
  font-size: 1rem;
  box-sizing: border-box;
}

.status {
  margin: 0.75rem 0 0;
  color: var(--muted);
}

.status.error {
  color: #b42318;
}

.results {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-top: 1rem;
}
</style>
