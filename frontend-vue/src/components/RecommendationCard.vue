<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import BookCover from './BookCover.vue'
import type { ProfileRecommendation } from '../types/social'

interface Props {
  recommendation: ProfileRecommendation
  showUser?: boolean
  compact?: boolean
  removable?: boolean
}

withDefaults(defineProps<Props>(), {
  showUser: false,
  compact: false,
  removable: false,
})

const emit = defineEmits<{
  remove: [id: string]
}>()

const showConfirm = ref(false)

function stars(rating: number): string {
  return '★'.repeat(rating) + '☆'.repeat(5 - rating)
}
</script>

<template>
  <article class="rec-card" :class="{ compact }">
    <RouterLink
      :to="`/book/${recommendation.book.externalApiId}`"
      class="cover-link"
    >
      <BookCover
        :volume-id="recommendation.book.externalApiId"
        :src="recommendation.book.thumbnailUrl"
        :alt="`Portada de ${recommendation.book.title}`"
        img-class="cover"
        placeholder-class="cover placeholder"
      />
    </RouterLink>

    <div class="info">
      <RouterLink
        :to="`/book/${recommendation.book.externalApiId}`"
        class="title-link"
      >
        <h4>{{ recommendation.book.title }}</h4>
      </RouterLink>

      <p class="authors">{{ recommendation.book.authors.join(', ') }}</p>

      <p class="rating" :title="`${recommendation.rating} de 5`">
        {{ stars(recommendation.rating) }}
      </p>

      <p v-if="showUser" class="recommender">
        Recomendado por
        <RouterLink :to="`/users/${recommendation.user.id}`">
          {{ recommendation.user.name }}
        </RouterLink>
      </p>

      <p v-if="recommendation.message" class="message">
        {{ recommendation.message }}
      </p>

      <button
        v-if="removable"
        type="button"
        class="btn-remove"
        @click="emit('remove', recommendation.id)"
      >
        Quitar
      </button>
    </div>
  </article>
</template>

<style scoped>
.rec-card {
  display: flex;
  gap: 0.75rem;
  padding: 0.75rem;
  border: 1px solid var(--border);
  border-radius: 8px;
  background: var(--surface);
}

.rec-card.compact {
  flex-direction: column;
  padding: 0.5rem;
}

.rec-card :deep(.cover) {
  width: 64px;
  height: 96px;
  object-fit: cover;
  border-radius: 4px;
  flex-shrink: 0;
}

.rec-card.compact :deep(.cover) {
  width: 100%;
  height: 120px;
}

.cover-link {
  flex-shrink: 0;
}

.title-link {
  text-decoration: none;
  color: inherit;
}

.title-link:hover h4 {
  color: var(--primary);
}

h4 {
  margin: 0 0 0.25rem;
  font-size: 0.95rem;
  line-height: 1.3;
}

.authors,
.recommender,
.message {
  margin: 0 0 0.35rem;
  color: var(--muted);
  font-size: 0.8rem;
}

.rating {
  margin: 0 0 0.35rem;
  color: #d97706;
  font-size: 0.85rem;
  letter-spacing: 0.05em;
}

.recommender a {
  color: var(--primary);
  text-decoration: none;
}

.recommender a:hover {
  text-decoration: underline;
}

.message {
  font-style: italic;
}

.btn-remove {
  margin-top: 0.35rem;
  padding: 0.3rem 0.6rem;
  border: 1px solid var(--border);
  border-radius: 4px;
  background: var(--surface);
  color: var(--text);
  cursor: pointer;
  font-size: 0.8rem;
}

.btn-remove:hover {
  border-color: #b42318;
  color: #b42318;
}
</style>
