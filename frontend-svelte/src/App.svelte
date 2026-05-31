<script lang="ts">
  import { onMount } from 'svelte'
  import Router from 'svelte-spa-router'
  import { initAuth } from './stores/auth'
  import HomeView from './views/HomeView.svelte'
  import LoginView from './views/LoginView.svelte'
  import RegisterView from './views/RegisterView.svelte'

  const routes = {
    '/': HomeView,
    '/login': LoginView,
    '/register': RegisterView,
  }

  onMount(() => {
    void initAuth()
  })
</script>

<Router {routes} />
