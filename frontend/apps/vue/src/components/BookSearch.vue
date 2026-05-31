<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import BookCard from './BookCard.vue'
import { activeTab, addBook, findUserBookByExternalId, getUserBookStatus } from '../stores/books'
import { isAuthenticated } from '../stores/auth'
import { searchBooks } from '../services/googleBooks'
import type { Book } from '@mybooks/shared'
import { calculateReadingProgress, getErrorMessage } from '@mybooks/shared'

const router = useRouter()

const query = ref('')
const results = ref<Book[]>([])
const loading = ref(false)
const errorMessage = ref('')
const actionError = ref<string | null>(null)
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

async function handleAdd(book: Book) {
  actionError.value = null

  if (!isAuthenticated.value) {
    router.push('/login')
    return
  }

  if (getUserBookStatus(book.id)) {
    actionError.value = 'Este libro ya está en tu biblioteca.'
    return
  }

  if (activeTab.value === 'dashboard') {
    actionError.value = 'Selecciona una lista para agregar el libro.'
    return
  }

  try {
    await addBook(activeTab.value, book)
  } catch (error) {
    actionError.value = getErrorMessage(error, 'No se pudo agregar el libro')
  }
}

function searchActionLabel(book: Book): string {
  if (!isAuthenticated.value) return 'Iniciar sesión para guardar'

  const status = getUserBookStatus(book.id)
  if (status) return 'Ya en tu biblioteca'

  return 'Agregar'
}

function getStatusProgress(bookId: string): number | undefined {
  const userBook = findUserBookByExternalId(bookId)
  if (!userBook || getUserBookStatus(bookId) !== 'READING') return undefined

  if (userBook.pageCount) {
    return calculateReadingProgress(userBook.currentPage ?? 0, userBook.pageCount)
  }

  return userBook.readingProgress
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

    <p v-if="!isAuthenticated" class="guest-notice">
      Puedes buscar libros libremente. Para guardarlos en tus listas,
      <RouterLink to="/login">inicia sesión</RouterLink>
      o
      <RouterLink to="/register">regístrate</RouterLink>.
    </p>

    <p v-if="loading" class="status">Buscando...</p>
    <p v-else-if="errorMessage" class="status error">{{ errorMessage }}</p>
    <p v-else-if="actionError" class="status error">{{ actionError }}</p>

    <div v-if="results.length > 0" class="results">
      <BookCard
        v-for="book in results"
        :key="book.id"
        :book="book"
        :user-status="getUserBookStatus(book.id)"
        :status-progress="getStatusProgress(book.id)"
        :action-label="searchActionLabel(book)"
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

.guest-notice {
  margin: 0.75rem 0 0;
  color: var(--muted);
  font-size: 0.9rem;
}

.guest-notice a {
  color: var(--primary);
  text-decoration: none;
}

.guest-notice a:hover {
  text-decoration: underline;
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
