import '../../../packages/shared/src/styles/app.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { initAuth } from './stores/auth'
import { loadUserBooks } from './stores/books'
import { loadFriendsRecommendations } from './stores/social'

initAuth()

if (localStorage.getItem('mybooks_token')) {
  loadUserBooks()
  loadFriendsRecommendations()
}

createApp(App).use(router).mount('#app')
