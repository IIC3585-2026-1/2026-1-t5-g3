<script lang="ts">
  import { activeTab, setActiveTab } from '../stores/books'
  import { isAuthenticated } from '../stores/auth'
  import { LIST_LABELS, type ListType } from '../types/book'

  const guestTabs: ListType[] = ['wantToRead', 'reading', 'read']
  const authTabs: ListType[] = ['wantToRead', 'reading', 'read', 'dashboard']

  const tabs = $derived($isAuthenticated ? authTabs : guestTabs)
</script>

<nav class="tabs">
  {#each tabs as tab}
    <button
      type="button"
      class:active={$activeTab === tab}
      onclick={() => setActiveTab(tab)}
    >
      {LIST_LABELS[tab]}
    </button>
  {/each}
</nav>

<style>
  .tabs {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  button {
    padding: 0.6rem 1rem;
    border: 1px solid var(--border);
    border-radius: 6px;
    background: var(--surface);
    color: var(--text);
    cursor: pointer;
    text-align: left;
    font-size: 0.95rem;
  }

  button:hover {
    border-color: var(--primary);
  }

  button.active {
    background: var(--primary);
    border-color: var(--primary);
    color: white;
  }
</style>
