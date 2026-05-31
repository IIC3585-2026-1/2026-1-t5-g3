<script setup lang="ts">
import { useRouter } from 'vue-router'
import ListTabs from '../components/ListTabs.vue'
import FriendRecommendationsCarousel from '../components/FriendRecommendationsCarousel.vue'
import BookSearch from '../components/BookSearch.vue'
import BookList from '../components/BookList.vue'
import BookDashboard from '../components/BookDashboard.vue'
import { activeTab } from '../stores/books'
import { isAuthenticated, logout, user } from '../stores/auth'

const router = useRouter()

function handleLogout() {
  logout()
  router.push('/')
}
</script>

<template>
  <main class="app">
    <header class="app-header">
      <div>
        <h1>Mybooks</h1>
        <p>Gestiona tus listas de libros</p>
      </div>

      <div v-if="user" class="user-bar">
        <RouterLink :to="`/users/${user.id}`" class="user-name">
          {{ user.name }}
        </RouterLink>
        <button type="button" class="btn-secondary" @click="handleLogout">
          Cerrar sesión
        </button>
      </div>

      <div v-else class="user-bar">
        <RouterLink to="/login" class="btn-secondary">Iniciar sesión</RouterLink>
        <RouterLink to="/register" class="btn-primary-link">Registrarse</RouterLink>
      </div>
    </header>

    <div class="layout">
      <aside class="sidebar">
        <ListTabs />
        <FriendRecommendationsCarousel v-if="isAuthenticated" />
      </aside>

      <section class="search-panel">
        <BookSearch />
      </section>
    </div>

    <section class="list-panel">
      <BookDashboard v-if="activeTab === 'dashboard'" />
      <BookList v-else />
    </section>
  </main>
</template>

<style scoped>
.app-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
  flex-wrap: wrap;
}

.user-bar {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.user-name {
  color: var(--muted);
  font-size: 0.95rem;
  text-decoration: none;
}

.user-name:hover {
  color: var(--primary);
}

.btn-secondary,
.btn-primary-link {
  display: inline-block;
  padding: 0.4rem 0.75rem;
  border-radius: 6px;
  text-decoration: none;
  font-size: 0.875rem;
  cursor: pointer;
}

.btn-secondary {
  border: 1px solid var(--border);
  background: var(--surface);
  color: var(--text);
}

.btn-secondary:hover {
  border-color: var(--primary);
}

.btn-primary-link {
  border: 1px solid var(--primary);
  background: var(--primary);
  color: white;
}
</style>
