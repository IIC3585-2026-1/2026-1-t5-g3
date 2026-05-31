<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { followUser, unfollowUser } from '../services/follows'
import { searchUsers } from '../services/users'
import { isAuthenticated } from '../stores/auth'
import { getErrorMessage, type UserSummary } from '@mybooks/shared'

const router = useRouter()

const query = ref('')
const results = ref<UserSummary[]>([])
const loading = ref(false)
const errorMessage = ref('')
const actionError = ref<string | null>(null)
const followState = ref<Record<string, 'idle' | 'loading'>>({})

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

    if (!isAuthenticated.value) {
      router.push('/login')
      return
    }

    loading.value = true
    errorMessage.value = ''
    actionError.value = null

    try {
      results.value = await searchUsers(query.value.trim())
      if (results.value.length === 0) {
        errorMessage.value = 'No se encontraron usuarios.'
      }
    } catch (error) {
      errorMessage.value = getErrorMessage(error, 'Error al buscar usuarios')
      results.value = []
    } finally {
      loading.value = false
    }
  }, 300)
}

async function handleFollow(userId: string) {
  if (!isAuthenticated.value) {
    router.push('/login')
    return
  }

  actionError.value = null
  followState.value = { ...followState.value, [userId]: 'loading' }

  try {
    await followUser(userId)
  } catch (error) {
    actionError.value = getErrorMessage(error, 'No se pudo seguir al usuario')
  } finally {
    followState.value = { ...followState.value, [userId]: 'idle' }
  }
}
</script>

<template>
  <section class="user-search">
    <label for="user-search-input">Buscar usuarios</label>
    <input
      id="user-search-input"
      type="search"
      placeholder="Nombre..."
      :value="query"
      @input="handleInput"
    />

    <p v-if="loading" class="status">Buscando...</p>
    <p v-else-if="errorMessage" class="status error">{{ errorMessage }}</p>
    <p v-else-if="actionError" class="status error">{{ actionError }}</p>

    <ul v-if="results.length > 0" class="results">
      <li v-for="person in results" :key="person.id" class="result-item">
        <RouterLink :to="`/users/${person.id}`" class="name-link">
          {{ person.name }}
        </RouterLink>
        <button
          type="button"
          class="btn-follow"
          :disabled="followState[person.id] === 'loading'"
          @click="handleFollow(person.id)"
        >
          {{ followState[person.id] === 'loading' ? '...' : 'Seguir' }}
        </button>
      </li>
    </ul>
  </section>
</template>

<style scoped>
.user-search label {
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
  list-style: none;
  margin: 1rem 0 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.result-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 0.6rem 0.75rem;
  border: 1px solid var(--border);
  border-radius: 6px;
  background: var(--bg);
}

.name-link {
  color: var(--text);
  text-decoration: none;
  font-weight: 500;
}

.name-link:hover {
  color: var(--primary);
}

.btn-follow {
  padding: 0.35rem 0.75rem;
  border: 1px solid var(--primary);
  border-radius: 4px;
  background: var(--primary);
  color: white;
  cursor: pointer;
  font-size: 0.875rem;
  flex-shrink: 0;
}

.btn-follow:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
