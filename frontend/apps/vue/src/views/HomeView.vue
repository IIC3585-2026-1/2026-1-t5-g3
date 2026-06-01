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
        <button type="button" class="btn-secondary" @click="router.push('/login')">
          Iniciar sesión
        </button>
        <button type="button" class="btn-primary-link" @click="router.push('/register')">
          Registrarse
        </button>
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
</style>
