<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import BookCover from './BookCover.vue'
import {
  friendsRecommendations,
  friendsRecommendationsError,
  friendsRecommendationsLoading,
  loadFriendsRecommendations,
} from '../stores/social'

const currentIndex = ref(0)

const current = computed(
  () => friendsRecommendations.value[currentIndex.value] ?? null,
)

const hasItems = computed(() => friendsRecommendations.value.length > 0)

onMounted(() => {
  loadFriendsRecommendations()
})

function prev() {
  if (!hasItems.value) return
  currentIndex.value =
    (currentIndex.value - 1 + friendsRecommendations.value.length) %
    friendsRecommendations.value.length
}

function next() {
  if (!hasItems.value) return
  currentIndex.value =
    (currentIndex.value + 1) % friendsRecommendations.value.length
}

function stars(rating: number): string {
  return '★'.repeat(rating)
}
</script>

<template>
  <section class="carousel">
    <h3 class="carousel-title">De tus amigos</h3>

    <p v-if="friendsRecommendationsLoading" class="status">Cargando...</p>
    <p v-else-if="friendsRecommendationsError" class="status error">
      {{ friendsRecommendationsError }}
    </p>
    <p v-else-if="!hasItems" class="status">
      Tus amigos aún no han recomendado libros.
    </p>

    <template v-else-if="current">
      <div class="carousel-controls">
        <button type="button" class="nav-btn" aria-label="Anterior" @click="prev">
          ↑
        </button>
        <span class="counter">
          {{ currentIndex + 1 }}/{{ friendsRecommendations.length }}
        </span>
        <button type="button" class="nav-btn" aria-label="Siguiente" @click="next">
          ↓
        </button>
      </div>

      <RouterLink
        :to="`/book/${current.book.externalApiId}`"
        class="slide"
      >
        <BookCover
          :volume-id="current.book.externalApiId"
          :src="current.book.thumbnailUrl"
          :alt="`Portada de ${current.book.title}`"
          img-class="slide-cover"
          placeholder-class="slide-cover placeholder"
        />

        <p class="slide-title">{{ current.book.title }}</p>
        <p class="slide-rating">{{ stars(current.rating) }}</p>
        <p class="slide-user">
          <RouterLink
            :to="`/users/${current.user.id}`"
            class="inline-link"
            @click.stop
          >
            {{ current.user.name }}
          </RouterLink>
        </p>
      </RouterLink>
    </template>
  </section>
</template>

<style scoped>
.carousel {
  margin-top: 1.25rem;
  padding-top: 1rem;
  border-top: 1px solid var(--border);
}

.carousel-title {
  margin: 0 0 0.75rem;
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--muted);
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.status {
  margin: 0;
  font-size: 0.8rem;
  color: var(--muted);
  line-height: 1.4;
}

.status.error {
  color: #b42318;
}

.carousel-controls {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.5rem;
}

.nav-btn {
  width: 1.75rem;
  height: 1.75rem;
  border: 1px solid var(--border);
  border-radius: 4px;
  background: var(--surface);
  cursor: pointer;
  font-size: 0.75rem;
  line-height: 1;
}

.nav-btn:hover {
  border-color: var(--primary);
}

.counter {
  font-size: 0.75rem;
  color: var(--muted);
}

.slide {
  display: block;
  text-decoration: none;
  color: inherit;
}

.slide :deep(.slide-cover) {
  width: 100%;
  height: 140px;
  object-fit: cover;
  border-radius: 6px;
  border: 1px solid var(--border);
}

.slide :deep(.placeholder) {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 140px;
  color: var(--muted);
  font-size: 0.75rem;
  border: 1px solid var(--border);
  border-radius: 6px;
  background: var(--bg);
}

.slide-title {
  margin: 0.5rem 0 0.25rem;
  font-size: 0.8rem;
  font-weight: 600;
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.slide-rating {
  margin: 0;
  color: #d97706;
  font-size: 0.75rem;
}

.slide-user {
  margin: 0.25rem 0 0;
  font-size: 0.75rem;
}

.slide-user a {
  color: var(--primary);
  text-decoration: none;
}

.slide-user a:hover {
  text-decoration: underline;
}
</style>
