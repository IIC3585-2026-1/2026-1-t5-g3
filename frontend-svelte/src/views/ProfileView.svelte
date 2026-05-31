<script lang="ts">
  import { push } from 'svelte-spa-router'
  import RecommendationCard from '../components/RecommendationCard.svelte'
  import UserSearch from '../components/UserSearch.svelte'
  import { createRecommendation, removeRecommendation } from '../services/recommendations'
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
  import { goBack } from '../utils/router'
  import { getErrorMessage } from '../utils/error'
  import { showToast } from '../stores/toast'

  interface Props {
    params?: { id?: string }
  }

  let { params = {} }: Props = $props()

  const userId = $derived(params.id ?? '')

  const currentYear = new Date().getFullYear()
  let formError = $state<string | null>(null)
  let formLoading = $state(false)
  let selectedUserBookId = $state('')
  let rating = $state(3)
  let message = $state('')
  let followLoading = $state(false)

  const isOwnProfile = $derived(
    $isAuthenticated && $user?.id === userId,
  )

  const eligibleBooks = $derived([
    ...$lists.reading.filter((book) => (book.readingProgress ?? 0) >= 10),
    ...$lists.read,
  ])

  $effect(() => {
    if (userId) void loadUserProfile(userId)
  })

  async function handleFollow() {
    if (!$isAuthenticated) {
      push('/login')
      return
    }

    followLoading = true

    try {
      await followUserAction(userId)
      showToast(`Ahora sigues a ${$profile?.name ?? 'este usuario'}`)
    } catch (error) {
      showToast(getErrorMessage(error, 'No se pudo seguir al usuario'), 'error')
    } finally {
      followLoading = false
    }
  }

  async function handleUnfollow() {
    followLoading = true

    try {
      await unfollowUserAction(userId)
      showToast(`Dejaste de seguir a ${$profile?.name ?? 'este usuario'}`)
    } catch (error) {
      showToast(getErrorMessage(error, 'No se pudo dejar de seguir'), 'error')
    } finally {
      followLoading = false
    }
  }

  async function handleRecommend() {
    formError = null

    if (!selectedUserBookId) {
      formError = 'Selecciona un libro'
      return
    }

    formLoading = true

    try {
      await createRecommendation({
        userBookId: selectedUserBookId,
        rating,
        message: message.trim() || undefined,
      })
      selectedUserBookId = ''
      rating = 3
      message = ''
      await loadUserProfile(userId)
    } catch (error) {
      formError = getErrorMessage(error, 'No se pudo recomendar el libro')
    } finally {
      formLoading = false
    }
  }

  async function handleRemoveRecommendation(id: string) {
    try {
      await removeRecommendation(id)
      await loadUserProfile(userId)
    } catch (error) {
      profileError.set(
        getErrorMessage(error, 'No se pudo quitar la recomendación'),
      )
    }
  }
</script>

<main class="app profile-page">
  <button type="button" class="back-btn" onclick={goBack}>← Volver</button>

  {#if $profileLoading}
    <p class="status">Cargando perfil...</p>
  {:else if $profileError}
    <p class="status error">{$profileError}</p>
  {:else if $profile}
    <header class="profile-header">
      <div>
        <h1>{$profile.name}</h1>
        {#if $profile.followStatus?.isFriend}
          <p class="friend-badge">Amigo</p>
        {/if}
      </div>

      {#if !isOwnProfile}
        <div class="follow-actions">
          {#if $isAuthenticated}
            {#if $profile.followStatus?.isFollowing}
              <button
                type="button"
                class="btn-outline"
                disabled={followLoading}
                onclick={handleUnfollow}
              >
                {#if followLoading}
                  <span class="spinner" aria-hidden="true"></span>
                  Procesando...
                {:else}
                  Dejar de seguir
                {/if}
              </button>
            {:else}
              <button
                type="button"
                class="btn-primary"
                disabled={followLoading}
                onclick={handleFollow}
              >
                {#if followLoading}
                  <span class="spinner" aria-hidden="true"></span>
                  Siguiendo...
                {:else}
                  Seguir
                {/if}
              </button>
            {/if}
          {:else}
            <button type="button" class="btn-primary" onclick={() => push('/login')}>
              Inicia sesión para seguir
            </button>
          {/if}
        </div>
      {/if}
    </header>

    <div class="stats">
      <article class="stat-card">
        <span class="stat-value">{$profile.readThisYear}</span>
        <span class="stat-label">Leídos en {currentYear}</span>
      </article>
      <article class="stat-card">
        <span class="stat-value">{$profile.friendsCount}</span>
        <span class="stat-label">Amigos</span>
      </article>
      <article class="stat-card">
        <span class="stat-value">{$profile.followingCount}</span>
        <span class="stat-label">Siguiendo</span>
      </article>
    </div>

    {#if isOwnProfile}
      <section class="profile-section">
        <h2>Buscar usuarios</h2>
        <UserSearch />
      </section>
    {/if}

    <section class="profile-section">
      <h2>Amigos ({$profile.friends.length})</h2>
      {#if $profile.friends.length === 0}
        <p class="empty">Aún no tiene amigos.</p>
      {:else}
        <ul class="friends-list">
          {#each $profile.friends as friend (friend.id)}
            <li>
              <button
                type="button"
                class="friend-link"
                onclick={() => push(`/users/${friend.id}`)}
              >
                {friend.name}
              </button>
            </li>
          {/each}
        </ul>
      {/if}
    </section>

    <section class="profile-section">
      <h2>Recomendaciones ({$profile.recommendations.length})</h2>

      {#if isOwnProfile}
        <div class="recommend-form">
          <h3>Recomendar un libro</h3>
          <p class="hint">
            Solo libros en lectura con al menos 10% de progreso o ya leídos.
          </p>

          <label for="book-select">Libro</label>
          <select
            id="book-select"
            bind:value={selectedUserBookId}
            disabled={eligibleBooks.length === 0}
          >
            <option value="">Selecciona un libro...</option>
            {#each eligibleBooks as book (book.userBookId)}
              <option value={book.userBookId}>
                {book.title} — {book.authors.join(', ')}
              </option>
            {/each}
          </select>

          <label for="rating">Puntuación (1–5)</label>
          <input id="rating" type="number" min="1" max="5" step="1" bind:value={rating} />

          <label for="message">Comentario (opcional)</label>
          <textarea
            id="message"
            rows="3"
            placeholder="¿Por qué lo recomiendas?"
            bind:value={message}
          ></textarea>

          {#if formError}
            <p class="error">{formError}</p>
          {/if}

          <button
            type="button"
            class="btn-primary"
            disabled={formLoading || eligibleBooks.length === 0}
            onclick={handleRecommend}
          >
            {formLoading ? 'Guardando...' : 'Recomendar'}
          </button>
        </div>
      {/if}

      {#if $profile.recommendations.length === 0}
        <p class="empty">Aún no hay recomendaciones en este perfil.</p>
      {:else}
        <div class="recommendations">
          {#each $profile.recommendations as rec (rec.id)}
            <RecommendationCard
              recommendation={rec}
              removable={isOwnProfile}
              onRemove={handleRemoveRecommendation}
            />
          {/each}
        </div>
      {/if}
    </section>
  {/if}
</main>

<style>
  .profile-page {
    max-width: 720px;
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
    margin-bottom: 1.5rem;
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

  .friend-link {
    display: inline-block;
    padding: 0.35rem 0.65rem;
    border: 1px solid var(--border);
    border-radius: 999px;
    background: var(--bg);
    color: var(--text);
    cursor: pointer;
    font-size: 0.875rem;
  }

  .friend-link:hover {
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

  .btn-outline {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    padding: 0.45rem 0.85rem;
    border-radius: 6px;
    font-size: 0.875rem;
    cursor: pointer;
    border: 1px solid var(--border);
    background: var(--surface);
    color: var(--text);
  }

  .btn-outline:disabled {
    opacity: 0.85;
    cursor: not-allowed;
  }
</style>
