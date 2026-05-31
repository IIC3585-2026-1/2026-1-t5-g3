<script setup lang="ts">
import { activeTab, setActiveTab } from '../stores/books'
import { LIST_LABELS, type ListType } from '../types/book'

const tabs: ListType[] = ['read', 'recommended', 'wantToRead']
</script>

<template>
  <nav class="tabs">
    <button
      v-for="tab in tabs"
      :key="tab"
      type="button"
      :class="{ active: activeTab === tab }"
      @click="setActiveTab(tab)"
    >
      {{ LIST_LABELS[tab] }}
    </button>
  </nav>
</template>

<style scoped>
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
