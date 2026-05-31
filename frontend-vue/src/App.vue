<script setup lang="ts">
import ListTabs from './components/ListTabs.vue'
import BookSearch from './components/BookSearch.vue'
import BookList from './components/BookList.vue'
</script>

<template>
  <main class="app">
    <header>
      <h1>Mybooks</h1>
      <p>Gestiona tus listas de libros</p>
    </header>

    <div class="layout">
      <aside class="sidebar">
        <ListTabs />
      </aside>

      <section class="search-panel">
        <BookSearch />
      </section>
    </div>

    <section class="list-panel">
      <BookList />
    </section>
  </main>
</template>
