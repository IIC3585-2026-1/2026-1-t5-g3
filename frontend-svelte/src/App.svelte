<script lang="ts">
  import ListTabs from './components/ListTabs.svelte';
  import BookSearch from './components/BookSearch.svelte';
  import BookList from './components/BookList.svelte';
</script>

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
