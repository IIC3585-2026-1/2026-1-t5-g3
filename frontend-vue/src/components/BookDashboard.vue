<script setup lang="ts">
import BookCard from './BookCard.vue'
import { dashboard, booksError, booksLoading, setActiveTab } from '../stores/books'
import { isAuthenticated } from '../stores/auth'

const currentYear = new Date().getFullYear()
</script>

<template>
  <section class="dashboard">
    <h2>Dashboard {{ currentYear }}</h2>

    <p v-if="booksLoading" class="empty">Cargando estadísticas...</p>

    <div v-else-if="!isAuthenticated" class="guest-panel">
      <p>Inicia sesión para ver tu progreso de lectura del año.</p>
      <RouterLink to="/login" class="btn-primary-link">Iniciar sesión</RouterLink>
    </div>

    <p v-else-if="booksError" class="error">{{ booksError }}</p>

    <template v-else-if="dashboard">
      <div class="stats">
        <article class="stat-card">
          <span class="stat-value">{{ dashboard.readThisYear }}</span>
          <span class="stat-label">Leídos este año</span>
        </article>
        <article class="stat-card">
          <span class="stat-value">{{ dashboard.reading }}</span>
          <span class="stat-label">Leyendo ahora</span>
        </article>
        <article class="stat-card">
          <span class="stat-value">{{ dashboard.pending }}</span>
          <span class="stat-label">Por leer</span>
        </article>
      </div>

      <section class="dashboard-section">
        <h3>Leyendo ahora</h3>
        <p v-if="dashboard.readingBooks.length === 0" class="empty">
          No tienes libros en lectura activa.
        </p>
        <div v-else class="items">
          <BookCard
            v-for="book in dashboard.readingBooks"
            :key="book.userBookId ?? book.id"
            :book="book"
            action-label="Ir a Leyendo"
            :on-action="() => setActiveTab('reading')"
            :link-to-detail="true"
          />
        </div>
      </section>

      <section class="dashboard-section">
        <h3>Leídos en {{ currentYear }}</h3>
        <p v-if="dashboard.readThisYearBooks.length === 0" class="empty">
          Aún no has marcado libros como leídos este año.
        </p>
        <div v-else class="items">
          <BookCard
            v-for="book in dashboard.readThisYearBooks"
            :key="book.userBookId ?? book.id"
            :book="book"
            action-label="Ir a Leídos"
            :on-action="() => setActiveTab('read')"
          />
        </div>
      </section>

      <section class="dashboard-section">
        <h3>Pendientes por leer</h3>
        <p v-if="dashboard.pendingBooks.length === 0" class="empty">
          No tienes libros pendientes. ¡Busca algo nuevo!
        </p>
        <div v-else class="items">
          <BookCard
            v-for="book in dashboard.pendingBooks"
            :key="book.userBookId ?? book.id"
            :book="book"
            action-label="Ir a Quiero leer"
            :on-action="() => setActiveTab('wantToRead')"
          />
        </div>
      </section>
    </template>
  </section>
</template>

<style scoped>
.dashboard h2 {
  margin: 0 0 1rem;
  font-size: 1.125rem;
}

.stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.stat-card {
  padding: 1rem;
  border: 1px solid var(--border);
  border-radius: 8px;
  background: var(--bg);
  text-align: center;
}

.stat-value {
  display: block;
  font-size: 2rem;
  font-weight: 700;
  color: var(--primary);
}

.stat-label {
  color: var(--muted);
  font-size: 0.9rem;
}

.dashboard-section {
  margin-bottom: 1.5rem;
}

.dashboard-section h3 {
  margin: 0 0 0.75rem;
  font-size: 1rem;
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

.btn-primary-link {
  display: inline-block;
  padding: 0.5rem 0.85rem;
  border-radius: 6px;
  background: var(--primary);
  color: white;
  text-decoration: none;
  font-size: 0.9rem;
}

.items {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

@media (max-width: 640px) {
  .stats {
    grid-template-columns: 1fr;
  }
}
</style>
