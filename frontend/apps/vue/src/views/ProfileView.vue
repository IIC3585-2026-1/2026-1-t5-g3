<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import RecommendationCard from '../components/RecommendationCard.vue'
import UserSearch from '../components/UserSearch.vue'
import {
  createRecommendation,
  removeRecommendation,
} from '../services/recommendations'
import { lists } from '../stores/books'
import {
  followUser as followUserAction,
  loadUserProfile,
  profile,
  profileError,
  profileLoading,
  unfollowUser as unfollowUserAction,
} from '../stores/social'
import { isAuthenticated, user } from '../stores/auth'
import { getErrorMessage, type Book } from '@mybooks/shared'

const route = useRoute()
const router = useRouter()

const currentYear = new Date().getFullYear()
const formError = ref<string | null>(null)
const formLoading = ref(false)
const selectedUserBookId = ref('')
const rating = ref(3)
const message = ref('')

const profileUserId = computed(() => {
  const id = route.params.id
  return typeof id === 'string' ? id : ''
})

const isOwnProfile = computed(
  () => isAuthenticated.value && user.value?.id === profileUserId.value,
)

const eligibleBooks = computed(() => {
  const all: Book[] = [
    ...lists.value.reading.filter((book) => (book.readingProgress ?? 0) >= 10),
    ...lists.value.read,
  ]
  return all
})

onMounted(() => {
  if (profileUserId.value) {
    loadUserProfile(profileUserId.value)
  }
})

watch(profileUserId, (id) => {
  if (id) loadUserProfile(id)
})

function goBack() {
  if (window.history.length > 1) {
    router.back()
    return
  }
  router.push('/')
}

async function handleFollow() {
  if (!isAuthenticated.value) {
    router.push('/login')
    return
  }
  await followUserAction(profileUserId.value)
}

async function handleUnfollow() {
  await unfollowUserAction(profileUserId.value)
}

async function handleRecommend() {
  formError.value = null

  if (!selectedUserBookId.value) {
    formError.value = 'Selecciona un libro'
    return
  }

  formLoading.value = true

  try {
    await createRecommendation({
      userBookId: selectedUserBookId.value,
      rating: rating.value,
      message: message.value.trim() || undefined,
    })
    selectedUserBookId.value = ''
    rating.value = 3
    message.value = ''
    await loadUserProfile(profileUserId.value)
  } catch (error) {
    formError.value = getErrorMessage(error, 'No se pudo recomendar el libro')
  } finally {
    formLoading.value = false
  }
}

async function handleRemoveRecommendation(id: string) {
  try {
    await removeRecommendation(id)
    await loadUserProfile(profileUserId.value)
  } catch (error) {
    profileError.value = getErrorMessage(
      error,
      'No se pudo quitar la recomendación',
    )
  }
}
</script>

<template>
  <main class="app profile-page">
    <button type="button" class="back-btn" @click="goBack">← Volver</button>

    <p v-if="profileLoading" class="status">Cargando perfil...</p>
    <p v-else-if="profileError" class="status error">{{ profileError }}</p>

    <template v-else-if="profile">
      <header class="profile-header">
        <div>
          <h1>{{ profile.name }}</h1>
          <p v-if="profile.followStatus?.isFriend" class="friend-badge">Amigo</p>
        </div>

        <div v-if="!isOwnProfile" class="follow-actions">
          <template v-if="isAuthenticated">
            <button
              v-if="profile.followStatus?.isFollowing"
              type="button"
              class="btn-outline"
              @click="handleUnfollow"
            >
              Dejar de seguir
            </button>
            <button v-else type="button" class="btn-primary" @click="handleFollow">
              Seguir
            </button>
          </template>
          <RouterLink v-else to="/login" class="btn-primary">
            Inicia sesión para seguir
          </RouterLink>
        </div>
      </header>

      <div class="stats">
        <article class="stat-card">
          <span class="stat-value">{{ profile.readThisYear }}</span>
          <span class="stat-label">Leídos en {{ currentYear }}</span>
        </article>
        <article class="stat-card">
          <span class="stat-value">{{ profile.friendsCount }}</span>
          <span class="stat-label">Amigos</span>
        </article>
        <article class="stat-card">
          <span class="stat-value">{{ profile.followingCount }}</span>
          <span class="stat-label">Siguiendo</span>
        </article>
      </div>

      <section v-if="isOwnProfile" class="profile-section">
        <h2>Buscar usuarios</h2>
        <UserSearch />
      </section>

      <section class="profile-section">
        <h2>Amigos ({{ profile.friends.length }})</h2>
        <p v-if="profile.friends.length === 0" class="empty">
          Aún no tiene amigos.
        </p>
        <ul v-else class="friends-list">
          <li v-for="friend in profile.friends" :key="friend.id">
            <RouterLink :to="`/users/${friend.id}`">{{ friend.name }}</RouterLink>
          </li>
        </ul>
      </section>

      <section class="profile-section">
        <h2>Recomendaciones ({{ profile.recommendations.length }})</h2>

        <div v-if="isOwnProfile" class="recommend-form">
          <h3>Recomendar un libro</h3>
          <p class="hint">
            Solo libros en lectura con al menos 10% de progreso o ya leídos.
          </p>

          <label for="book-select">Libro</label>
          <select
            id="book-select"
            v-model="selectedUserBookId"
            :disabled="eligibleBooks.length === 0"
          >
            <option value="">Selecciona un libro...</option>
            <option
              v-for="book in eligibleBooks"
              :key="book.userBookId"
              :value="book.userBookId"
            >
              {{ book.title }} — {{ book.authors.join(', ') }}
            </option>
          </select>

          <label for="rating">Puntuación (1–5)</label>
          <input
            id="rating"
            v-model.number="rating"
            type="number"
            min="1"
            max="5"
            step="1"
          />

          <label for="message">Comentario (opcional)</label>
          <textarea
            id="message"
            v-model="message"
            rows="3"
            placeholder="¿Por qué lo recomiendas?"
          />

          <p v-if="formError" class="error">{{ formError }}</p>

          <button
            type="button"
            class="btn-primary"
            :disabled="formLoading || eligibleBooks.length === 0"
            @click="handleRecommend"
          >
            {{ formLoading ? 'Guardando...' : 'Recomendar' }}
          </button>
        </div>

        <p v-if="profile.recommendations.length === 0" class="empty">
          Aún no hay recomendaciones en este perfil.
        </p>

        <div v-else class="recommendations">
          <RecommendationCard
            v-for="rec in profile.recommendations"
            :key="rec.id"
            :recommendation="rec"
            :removable="isOwnProfile"
            @remove="handleRemoveRecommendation"
          />
        </div>
      </section>
    </template>
  </main>
</template>

<style scoped>
.profile-page {
  max-width: 720px;
}

.back-btn {
  margin-bottom: 1rem;
  padding: 0.4rem 0.75rem;
  border: 1px solid var(--border);
  border-radius: 6px;
  background: var(--surface);
  cursor: pointer;
}

.profile-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 1.25rem;
}

.profile-header h1 {
  margin: 0;
}

.friend-badge {
  display: inline-block;
  margin: 0.5rem 0 0;
  padding: 0.2rem 0.55rem;
  border-radius: 999px;
  background: #ecfdf5;
  color: #047857;
  border: 1px solid #a7f3d0;
  font-size: 0.75rem;
  font-weight: 600;
}

.stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

.stat-card {
  padding: 1rem;
  border: 1px solid var(--border);
  border-radius: 8px;
  background: var(--surface);
  text-align: center;
}

.stat-value {
  display: block;
  font-size: 1.75rem;
  font-weight: 700;
}

.stat-label {
  color: var(--muted);
  font-size: 0.85rem;
}

.profile-section {
  margin-bottom: 1.5rem;
  padding: 1rem;
  border: 1px solid var(--border);
  border-radius: 10px;
  background: var(--surface);
}

.profile-section h2 {
  margin: 0 0 1rem;
  font-size: 1.125rem;
}

.friends-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.friends-list a {
  display: inline-block;
  padding: 0.35rem 0.65rem;
  border: 1px solid var(--border);
  border-radius: 999px;
  text-decoration: none;
  color: var(--text);
  font-size: 0.875rem;
}

.friends-list a:hover {
  border-color: var(--primary);
  color: var(--primary);
}

.recommend-form {
  margin-bottom: 1rem;
  padding: 1rem;
  border: 1px dashed var(--border);
  border-radius: 8px;
  background: var(--bg);
}

.recommend-form h3 {
  margin: 0 0 0.5rem;
  font-size: 1rem;
}

.hint {
  margin: 0 0 1rem;
  color: var(--muted);
  font-size: 0.875rem;
}

.recommend-form label {
  display: block;
  margin: 0.75rem 0 0.35rem;
  font-weight: 600;
  font-size: 0.875rem;
}

.recommend-form select,
.recommend-form input,
.recommend-form textarea {
  width: 100%;
  padding: 0.5rem 0.65rem;
  border: 1px solid var(--border);
  border-radius: 6px;
  font-size: 0.9rem;
  box-sizing: border-box;
}

.recommendations {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.follow-actions {
  flex-shrink: 0;
}

.btn-primary,
.btn-outline {
  padding: 0.45rem 0.85rem;
  border-radius: 6px;
  font-size: 0.875rem;
  cursor: pointer;
  text-decoration: none;
  display: inline-block;
}

.btn-primary {
  border: 1px solid var(--primary);
  background: var(--primary);
  color: white;
}

.btn-outline {
  border: 1px solid var(--border);
  background: var(--surface);
  color: var(--text);
}

.status {
  color: var(--muted);
}

.status.error,
.error {
  color: #b42318;
}

.empty {
  color: var(--muted);
  margin: 0;
}

@media (max-width: 640px) {
  .stats {
    grid-template-columns: 1fr;
  }
}
</style>
