<script lang="ts">
  import { onMount } from 'svelte'
  import { get } from 'svelte/store'
  import Router, { push } from 'svelte-spa-router'
  import { wrap } from 'svelte-spa-router/wrap'
  import { initAuth, isAuthenticated } from './stores/auth'
  import HomeView from './views/HomeView.svelte'
  import LoginView from './views/LoginView.svelte'
  import RegisterView from './views/RegisterView.svelte'
  import BookDetailView from './views/BookDetailView.svelte'
  import ProfileView from './views/ProfileView.svelte'
  import Toast from './components/Toast.svelte'

  function guestOnly() {
    if (get(isAuthenticated)) {
      push('/')
      return false
    }
    return true
  }

  const routes = {
    '/': HomeView,
    '/book/:id': BookDetailView,
    '/users/:id': ProfileView,
    '/login': wrap({ component: LoginView, conditions: [guestOnly] }),
    '/register': wrap({ component: RegisterView, conditions: [guestOnly] }),
  }

  onMount(() => {
    void initAuth()
  })
</script>

<Router {routes} />
<Toast />
